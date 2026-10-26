#!/usr/bin/env python3
"""
Builds the loading screen's character assets (public/loader/) from the
chroma-keyed source animations. Offline only — the browser never keys a
frame; it just plays the transparent results.

    python3 scripts/loader-assets/build_loader_assets.py \
        --landscape path/to/landscape.mp4 --portrait path/to/portrait.mp4

Either source can be given alone to rebuild just that set. Requirements:
ffmpeg (with libvpx-vp9 and libwebp) on PATH, and Python 3 with numpy,
pillow and scipy (`pip install numpy pillow scipy`).

Pipeline, per source:
  1. Extract every frame (24fps).
  2. Matte each frame. The landscape source sits on magenta and is keyed
     on "magentaness" (min(R, B) - G); the portrait source sits on pink,
     which is too close to skin, cheeks and tongue for that, so it's keyed
     on chroma direction and keeps its ground shadow as translucent black.
     Both then re-solve a 3px edge band against the nearest interior colour
     (no pink fringe on saturated edges or green specks on outlines),
     despill only what exceeds that neighbour's own tint, and drop the
     source's floating background sparkles.
  3. Cut the cleanest loop (found by a frame-similarity search) and
     cross-fade across the wrap so it has no visible jump.
  4. Feather the edges the landscape frame cuts through (the top of the
     hair, the beanbags at both sides); crop the portrait to its content.
  5. Encode VP9-with-alpha WebM loops plus one transparent WebP still per
     orientation (Safari / reduced motion / failure fallback).
"""

import argparse
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor
from dataclasses import dataclass, field
from functools import partial
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

BAND = 3  # px of edge re-solved against the neighbouring colour
LUMA = np.array([0.299, 0.587, 0.114])


@dataclass(frozen=True)
class Source:
    name: str
    key: tuple[float, float, float]  # measured background colour
    keyer: str  # "magenta" | "chroma"
    loop: tuple[int, int]  # [start, end) frames; frame `end` ≈ `start`
    crossfade: int  # frames blended across the wrap
    # "lead-in": the tail blends into the frames before `start`.
    # "lead-out": the loop starts `crossfade` frames late and the tail
    # blends into the frames it skipped (for loops that begin at frame 0).
    crossfade_mode: str
    still_frame: int  # loop-relative
    feather_top: int = 0  # px, source scale
    feather_sides: int = 0
    crop_to_content: bool = False
    videos: tuple[tuple[int, int], ...] = field(default=())  # (width, crf)
    still_width: int = 960


SOURCES = {
    "landscape": Source(
        name="landscape",
        key=(237.0, 22.0, 232.0),
        keyer="magenta",
        loop=(98, 170),  # 3s
        crossfade=6,
        crossfade_mode="lead-in",
        still_frame=2,
        feather_top=36,  # the hair touches the frame top
        feather_sides=48,  # the beanbags are cut by both sides
        videos=((960, 42), (720, 42)),
        still_width=960,
    ),
    "portrait": Source(
        name="portrait",
        key=(240.0, 81.0, 158.0),
        keyer="chroma",
        loop=(0, 49),  # 41 frames after the lead-out ≈ 1.7s
        crossfade=8,
        crossfade_mode="lead-out",
        still_frame=12,
        crop_to_content=True,
        videos=((680, 40),),
        still_width=680,
    ),
}


def _chroma(c: np.ndarray) -> np.ndarray:
    return c - c.mean(-1, keepdims=True)


def _key_amount(f: np.ndarray, key: np.ndarray):
    """How much of the key's chroma a colour carries (s) and how much
    chroma it carries in any other direction (r)."""
    ck = _chroma(key)
    c = _chroma(f)
    s = (c * ck).sum(-1) / (ck * ck).sum()
    r = np.linalg.norm(c - s[..., None] * ck, axis=-1)
    return s, r


def _initial_alpha(f: np.ndarray, key: np.ndarray, keyer: str) -> np.ndarray:
    if keyer == "magenta":
        m = np.minimum(f[..., 0], f[..., 2]) - f[..., 1]
        return np.clip((200.0 - m) / (200.0 - 25.0), 0.0, 1.0)
    s, r = _key_amount(f, key)
    transparency = np.clip((s - 0.45) / 0.25, 0, 1) * np.clip(1 - (r - 6) / 12, 0, 1)
    return 1.0 - transparency


def matte(rgb: np.ndarray, key: np.ndarray, keyer: str) -> np.ndarray:
    f = rgb.astype(np.float32)
    a = _initial_alpha(f, key, keyer)

    solid = a >= 1.0
    band = ~ndimage.binary_erosion(solid, iterations=BAND, border_value=1)
    band &= a > 0
    interior = solid & ~band
    _, (iy, ix) = ndimage.distance_transform_edt(~interior, return_indices=True)
    fg_est = f[iy, ix]

    # pixel = a * fg + (1 - a) * key, with fg ≈ the nearest interior colour.
    d = fg_est - key
    a_proj = ((f - key) * d).sum(-1) / np.maximum((d * d).sum(-1), 1.0)
    a = np.where(band, np.clip(a_proj, 0, 1), a)
    # Soften codec noise in the band's alpha (it reads as a dotted halo).
    a = np.where(band, ndimage.gaussian_filter(a, 0.7), a)
    a[a < 0.12] = 0.0

    safe = np.maximum(a, 1e-3)[..., None]
    fg = (f - (1.0 - a)[..., None] * key) / safe
    fg = np.clip(np.where(a[..., None] > 0, fg, 0), 0, 255)
    # Unmixing amplifies noise as alpha falls, so lean low-alpha band
    # pixels on the neighbouring colour.
    w = (a * a)[..., None]
    fg = np.where(band[..., None], fg_est * (1 - w) + fg * w, fg)

    # Only the excess over the neighbouring colour's own key tint is spill
    # (the landscape hair is a slightly purple grey and must not turn
    # green; the panda's cheeks are genuinely pink).
    s_fg, _ = _key_amount(fg, key)
    s_est, _ = _key_amount(fg_est, key)
    spill = np.where(band, np.maximum(s_fg - np.maximum(s_est, 0), 0), 0)
    fg = np.clip(fg - spill[..., None] * _chroma(key), 0, 255)

    out_a = a
    if keyer == "chroma":
        # Ground shadow: key-coloured but darker → translucent black.
        s, _ = _key_amount(f, key)
        lum = (f * LUMA).sum(-1)
        shadow = np.clip((1 - lum / (key * LUMA).sum() - 0.05) * 1.6, 0, 0.55)
        shadow *= (a == 0) & (s > 0.5)
        shadow = ndimage.gaussian_filter(shadow, 1.0)
        out_a = a + shadow * (1 - a)
        fg = np.where((a == 0)[..., None], 0, fg)

    return np.dstack([fg, out_a * 255]).astype(np.float32)


def remove_specks(rgba: np.ndarray) -> np.ndarray:
    """Drops the source's floating background sparkles (small, pale blobs)
    and keeps the detached yellow strokes (saturated)."""
    visible = rgba[..., 3] > 20
    labels, count = ndimage.label(visible)
    if count == 0:
        return rgba
    idx = np.arange(1, count + 1)
    area = ndimage.sum(visible, labels, idx)
    rgb = rgba[..., :3]
    saturation = rgb.max(-1) - rgb.min(-1)
    mean_sat = ndimage.mean(saturation, labels, idx)
    drop = idx[(area < 60) | ((area < 1500) & (mean_sat < 90))]
    faint = (rgba[..., 3] > 0) & ~ndimage.binary_dilation(visible, iterations=2)
    out = rgba.copy()
    out[np.isin(labels, drop) | faint] = 0
    return out


def premultiply(p: np.ndarray) -> np.ndarray:
    out = p.copy()
    out[..., :3] *= p[..., 3:] / 255.0
    return out


def unpremultiply(p: np.ndarray) -> np.ndarray:
    out = p.copy()
    alpha = np.maximum(p[..., 3:], 1e-3)
    out[..., :3] = np.where(p[..., 3:] > 0, p[..., :3] * 255.0 / alpha, 0)
    return out


def matte_frame(path: Path, key: np.ndarray, keyer: str) -> np.ndarray:
    rgb = np.asarray(Image.open(path).convert("RGB"))
    return remove_specks(matte(rgb, key, keyer))


def blend(a: np.ndarray, b: np.ndarray, u: float) -> np.ndarray:
    return unpremultiply(premultiply(a) * (1 - u) + premultiply(b) * u)


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def loop_frames(src: Source, mattes: dict[int, np.ndarray]) -> list[np.ndarray]:
    start, end = src.loop
    k = src.crossfade
    if src.crossfade_mode == "lead-in":
        first, length = start, end - start
        lead = lambda j: mattes[start - k + j]  # noqa: E731
    else:
        first, length = start + k, end - start - k
        lead = lambda j: mattes[start + j]  # noqa: E731

    frames = []
    for t in range(length):
        frame = mattes[first + t]
        tail = t - (length - k)
        if tail >= 0:
            frame = blend(frame, lead(tail), (tail + 1) / (k + 1))
        frames.append(frame)
    return frames


def build(src: Source, video: Path, out: Path) -> None:
    key = np.array(src.key)
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp = Path(tmp_dir)
        (tmp / "src").mkdir()
        (tmp / "loop").mkdir()
        run(["ffmpeg", "-v", "error", "-i", str(video), "-an",
             "-fps_mode", "passthrough", "-start_number", "0",
             str(tmp / "src" / "f%03d.png")])

        start, end = src.loop
        first = start - src.crossfade if src.crossfade_mode == "lead-in" else start
        needed = list(range(first, end))
        with ProcessPoolExecutor() as pool:
            mattes = dict(zip(needed, pool.map(
                partial(matte_frame, key=key, keyer=src.keyer),
                [tmp / "src" / f"f{i:03d}.png" for i in needed])))

        frames = loop_frames(src, mattes)
        height, width = frames[0].shape[:2]

        if src.feather_top or src.feather_sides:
            top = np.ones(height)
            if src.feather_top:
                top = np.clip(np.arange(height) / src.feather_top, 0, 1) ** 1.5
            sides = np.ones(width)
            if src.feather_sides:
                x = np.arange(width)
                sides = np.clip(np.minimum(x, width - 1 - x) / src.feather_sides, 0, 1) ** 1.5
            for frame in frames:
                frame[..., 3] *= top[:, None] * sides[None, :]

        if src.crop_to_content:
            union = np.zeros((height, width), bool)
            for frame in frames:
                union |= frame[..., 3] > 2
            ys, xs = np.where(union)
            pad = 12
            y0, y1 = max(0, ys.min() - pad), min(height, ys.max() + pad + 1)
            x0, x1 = max(0, xs.min() - pad), min(width, xs.max() + pad + 1)
            # Even dimensions for yuva420p.
            y1 -= (y1 - y0) % 2
            x1 -= (x1 - x0) % 2
            frames = [frame[y0:y1, x0:x1] for frame in frames]
            height, width = frames[0].shape[:2]
            print(f"{src.name}: cropped to {width}x{height} (from x{x0} y{y0})")

        for t, frame in enumerate(frames):
            Image.fromarray(np.clip(frame, 0, 255).round().astype(np.uint8)
                            ).save(tmp / "loop" / f"l{t:03d}.png")

        for video_width, crf in src.videos:
            run(["ffmpeg", "-v", "error", "-framerate", "24",
                 "-i", str(tmp / "loop" / "l%03d.png"),
                 "-vf", f"scale={video_width}:-2:flags=lanczos",
                 "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
                 "-b:v", "0", "-crf", str(crf), "-row-mt", "1",
                 "-deadline", "good", "-cpu-used", "1",
                 "-auto-alt-ref", "0", "-g", str(len(frames)), "-an",
                 "-y", str(out / f"characters-{src.name}-{video_width}.webm")])

        still = Image.open(tmp / "loop" / f"l{src.still_frame:03d}.png")
        still = still.resize(
            (src.still_width, round(src.still_width * height / width)),
            Image.LANCZOS)
        still.save(out / f"characters-{src.name}.webp",
                   quality=82, method=6, exact=False)
        print(f"{src.name}: still {still.width}x{still.height}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--landscape", type=Path, help="magenta-keyed source")
    parser.add_argument("--portrait", type=Path, help="pink-keyed source")
    parser.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parents[2] / "public" / "loader",
    )
    args = parser.parse_args()

    if not args.landscape and not args.portrait:
        parser.error("give --landscape and/or --portrait")
    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not found on PATH")

    args.out.mkdir(parents=True, exist_ok=True)
    for name in ("landscape", "portrait"):
        video = getattr(args, name)
        if video:
            build(SOURCES[name], video, args.out)

    for path in sorted(args.out.iterdir()):
        print(f"{path.name}: {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()

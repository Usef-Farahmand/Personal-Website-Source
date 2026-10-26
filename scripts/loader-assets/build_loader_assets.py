#!/usr/bin/env python3
"""
Builds the loading screen's character assets (public/loader/) from the
chroma-keyed source animation. Offline only — the browser never keys a
frame; it just plays the transparent results.

    python3 scripts/loader-assets/build_loader_assets.py path/to/source.mp4

Requirements: ffmpeg (with libvpx-vp9 and libwebp) on PATH, and Python 3
with numpy, pillow and scipy (`pip install numpy pillow scipy`).

Pipeline:
  1. Extract every frame of the source (1280x720 @ 24fps, magenta key).
  2. Matte each frame: a "magentaness" key (min(R, B) - G), then a
     re-solve of the 3px edge band against the nearest interior colour so
     saturated edges (the yellow strokes) and dark outlines don't keep a
     pink fringe, then a band-limited despill and removal of the source's
     background sparkles.
  3. Cut the cleanest loop (LOOP_START..LOOP_END, chosen by frame-
     similarity search: the closest pair at least 1.5s apart) and
     cross-fade its last frames into the frames just before LOOP_START so
     the wrap-around has no visible jump.
  4. Feather the edges the source frame cuts through (the top of the
     hair, the beanbags at both sides) so no hard edge shows in the room.
  5. Encode VP9-with-alpha WebM at two widths, plus one transparent WebP
     still (Safari / reduced motion / failure fallback).
"""

import argparse
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

KEY = np.array([237.0, 22.0, 232.0])  # measured background colour
KEY_LO, KEY_HI = 25.0, 200.0  # magentaness: <= LO opaque, >= HI clear
BAND = 3  # px of edge re-solved against the neighbouring colour

LOOP_START, LOOP_END = 98, 170  # frames; 72 frames = 3s at 24fps
CROSSFADE = 6  # frames blended into the frames before LOOP_START
STILL_FRAME = 2  # loop-relative frame used for the still

FEATHER_TOP = 36  # px (source scale) — the hair touches the frame top
FEATHER_SIDES = 48  # px — the beanbags are cut by both frame sides

VIDEO_VARIANTS = [  # (width, crf)
    (960, 42),
    (720, 42),
]
STILL_WIDTH = 960


def matte(rgb: np.ndarray) -> np.ndarray:
    f = rgb.astype(np.float32)
    m = np.minimum(f[..., 0], f[..., 2]) - f[..., 1]
    a = np.clip((KEY_HI - m) / (KEY_HI - KEY_LO), 0.0, 1.0)

    solid = a >= 1.0
    band = ~ndimage.binary_erosion(solid, iterations=BAND, border_value=1)
    band &= a > 0
    interior = solid & ~band
    _, (iy, ix) = ndimage.distance_transform_edt(~interior, return_indices=True)
    fg_est = f[iy, ix]

    # pixel = a * fg + (1 - a) * key, with fg ≈ the nearest interior colour.
    d = fg_est - KEY
    a_proj = ((f - KEY) * d).sum(-1) / np.maximum((d * d).sum(-1), 1.0)
    a = np.where(band, np.clip(a_proj, 0, 1), a)
    # Soften codec noise in the band's alpha (it reads as a dotted halo).
    a = np.where(band, ndimage.gaussian_filter(a, 0.7), a)
    a[a < 0.12] = 0.0

    safe = np.maximum(a, 1e-3)[..., None]
    fg = (f - (1.0 - a)[..., None] * KEY) / safe
    fg = np.clip(np.where(a[..., None] > 0, fg, 0), 0, 255)
    # Unmixing amplifies noise as alpha falls, so lean low-alpha band
    # pixels on the neighbouring colour.
    w = (a * a)[..., None]
    fg = np.where(band[..., None], fg_est * (1 - w) + fg * w, fg)

    def tint(c):
        return np.maximum(np.minimum(c[..., 0], c[..., 2]) - c[..., 1], 0)

    # Only the excess over the neighbouring colour's own tint is spill —
    # the hair is a slightly purple grey and must not turn green.
    spill = np.where(band, np.maximum(tint(fg) - tint(fg_est), 0), 0)
    fg[..., 0] -= spill
    fg[..., 2] -= spill
    fg = np.clip(fg, 0, 255)
    return np.dstack([fg, a * 255]).astype(np.float32)


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


def matte_frame(path: Path) -> np.ndarray:
    return remove_specks(matte(np.asarray(Image.open(path).convert("RGB"))))


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("video", type=Path, help="chroma-keyed source video")
    parser.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parents[2] / "public" / "loader",
    )
    args = parser.parse_args()

    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not found on PATH")

    args.out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp = Path(tmp_dir)
        src = tmp / "src"
        loop = tmp / "loop"
        src.mkdir()
        loop.mkdir()

        run(["ffmpeg", "-v", "error", "-i", str(args.video), "-an",
             "-fps_mode", "passthrough", "-start_number", "0",
             str(src / "f%03d.png")])

        needed = range(LOOP_START - CROSSFADE, LOOP_END)
        with ProcessPoolExecutor() as pool:
            mattes = dict(zip(needed, pool.map(
                matte_frame, [src / f"f{i:03d}.png" for i in needed])))

        height, width = next(iter(mattes.values())).shape[:2]
        top = np.clip(np.arange(height) / FEATHER_TOP, 0, 1) ** 1.5
        x = np.arange(width)
        sides = np.clip(np.minimum(x, width - 1 - x) / FEATHER_SIDES, 0, 1) ** 1.5
        feather = top[:, None] * sides[None, :]

        length = LOOP_END - LOOP_START
        for t in range(length):
            frame = mattes[LOOP_START + t]
            tail = t - (length - CROSSFADE)
            if tail >= 0:
                u = (tail + 1) / (CROSSFADE + 1)
                lead_in = mattes[LOOP_START - CROSSFADE + tail]
                frame = unpremultiply(
                    premultiply(frame) * (1 - u) + premultiply(lead_in) * u)
            frame = frame.copy()
            frame[..., 3] *= feather
            Image.fromarray(np.clip(frame, 0, 255).round().astype(np.uint8)
                            ).save(loop / f"l{t:03d}.png")

        for video_width, crf in VIDEO_VARIANTS:
            run(["ffmpeg", "-v", "error", "-framerate", "24",
                 "-i", str(loop / "l%03d.png"),
                 "-vf", f"scale={video_width}:-2:flags=lanczos",
                 "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
                 "-b:v", "0", "-crf", str(crf), "-row-mt", "1",
                 "-deadline", "good", "-cpu-used", "1",
                 "-auto-alt-ref", "0", "-g", str(length), "-an",
                 "-y", str(args.out / f"characters-{video_width}.webm")])

        still = Image.open(loop / f"l{STILL_FRAME:03d}.png")
        still = still.resize(
            (STILL_WIDTH, round(STILL_WIDTH * height / width)), Image.LANCZOS)
        still.save(args.out / f"characters-{STILL_WIDTH}.webp",
                   quality=82, method=6, exact=False)

    for path in sorted(args.out.iterdir()):
        print(f"{path.name}: {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()

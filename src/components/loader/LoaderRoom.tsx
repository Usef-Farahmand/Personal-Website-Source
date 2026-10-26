import { loaderConfig } from "@/config/loader";

const { landscape, portrait } = loaderConfig.room;

/**
 * The loading screen's backdrop: the dark game-dev room, as two
 * art-directed images — a landscape one and a portrait one for upright
 * screens. The <picture> lets the browser download only the one that
 * matches the viewport's orientation. styles/loader.css softens it
 * slightly and darkens the edges so the characters and text stay in front.
 */
export function LoaderRoom() {
  return (
    <div className="site-loader__backdrop">
      <picture>
        <source
          media="(orientation: portrait)"
          srcSet={portrait.src}
          width={portrait.width}
          height={portrait.height}
        />
        <img
          className="site-loader__room"
          src={landscape.src}
          width={landscape.width}
          height={landscape.height}
          alt=""
          decoding="async"
          fetchPriority="high"
          draggable={false}
        />
      </picture>
      <div className="site-loader__glow" />
      <div className="site-loader__vignette" />
    </div>
  );
}

import type { MediaItem } from "@/types/media";

interface YoutubeEmbedProps {
  item: MediaItem;
}

/**
 * Renders a YouTube gallery item inside the Universal Media Viewer,
 * alongside ImageViewer/VideoPlayer/PdfViewer (see MediaViewer.tsx's
 * type dispatch) — added, not inserted into, those three; none of their
 * existing behavior changes.
 *
 * A plain `<iframe>` using YouTube's standard `/embed/{id}` URL is the
 * deliberate choice over the YouTube IFrame Player API: this viewer
 * doesn't need programmatic control over playback (no custom play/pause
 * button, no synced state) — MediaViewerToolbar's existing
 * download/external-link/fullscreen actions already work generically
 * for any item type, and playback speed / zoom controls are already
 * gated to type "video"/"image" only, so nothing here needs to hook
 * into a JS player API. Loading the IFrame API purely to get an
 * `<iframe>` that would look identical would be exactly the
 * over-engineering this codebase's VideoPlayer doc comment warns
 * against for its own, more complex case.
 */
export function YoutubeEmbed({ item }: YoutubeEmbedProps) {
  if (!item.youtubeVideoId) return null;

  return (
    <div className="aspect-video w-full max-w-full">
      <iframe
        key={item.id}
        src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
        title={item.title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full rounded-md"
      />
    </div>
  );
}

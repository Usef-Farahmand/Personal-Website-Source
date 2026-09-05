import { YouTubeIcon } from "@/components/ui/icons";
import { resolveYoutubeVideoId } from "@/lib/youtube";
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
 *
 * The video id is resolved via `resolveYoutubeVideoId` rather than
 * trusting `item.youtubeVideoId` directly — today's actual content
 * (see src/content/generated/projects.json) carries YouTube gallery
 * items with only `src` set, no `youtubeVideoId`, so requiring the
 * latter silently dropped every real YouTube item. Falling back to
 * parsing `src` (watch/youtu.be/shorts/embed, all handled) fixes that
 * without depending on an upstream field this codebase doesn't
 * control. A `src` that isn't a recognized YouTube URL at all — or
 * simply missing — renders a small fallback instead of nothing, so one
 * bad item never looks like a rendering bug in the gallery.
 */
export function YoutubeEmbed({ item }: YoutubeEmbedProps) {
  const videoId = resolveYoutubeVideoId(item);

  if (!videoId) {
    return (
      <div className="border-border bg-surface text-text-secondary aspect-video w-full max-w-full rounded-md border">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
          <YouTubeIcon className="h-8 w-8" />
          <p className="text-small">
            {item.title ?? "This video"} couldn&apos;t be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full max-w-full">
      <iframe
        key={item.id}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={item.title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        // Security hardening for an embedded third-party document:
        // no referrer info leaked to YouTube beyond origin, and the
        // embed is limited to exactly the capabilities it needs
        // (script execution, its own-origin storage/postMessage, and
        // presenting fullscreen/popups for things like the Share
        // sheet) rather than the unrestricted default an iframe gets
        // with no `sandbox` at all.
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        allowFullScreen
        loading="lazy"
        className="h-full w-full rounded-md"
      />
    </div>
  );
}

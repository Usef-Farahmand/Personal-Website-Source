/**
 * "Ready" for the loading screen means the page can be shown without a
 * visible reflow: web fonts have loaded and every image already in the
 * viewport has loaded (or failed). Below-the-fold images, videos and
 * other optional resources are deliberately not waited on.
 */

function fontsReady(): Promise<void> {
  return "fonts" in document
    ? document.fonts.ready.then(() => undefined)
    : Promise.resolve();
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

function aboveTheFoldImagesReady(root: ParentNode): Promise<void> {
  const pending = Array.from(root.querySelectorAll("img")).filter(
    (img) => !img.complete && isInViewport(img)
  );

  return Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);
}

/** Resolves when the page is ready, or after `timeoutMs`, whichever is
 *  first — never rejects, so a failed request can't hold the loader. */
export function waitForPageReady(
  root: ParentNode,
  timeoutMs: number
): Promise<void> {
  const ready = Promise.all([fontsReady(), aboveTheFoldImagesReady(root)]).then(
    () => undefined
  );
  const timeout = new Promise<void>((resolve) =>
    setTimeout(resolve, Math.max(0, timeoutMs))
  );

  return Promise.race([ready, timeout]).catch(() => undefined);
}

/**
 * VP9 with an alpha channel renders transparently in Chromium and Firefox
 * only. WebKit (desktop Safari, and every browser on iOS) plays the same
 * file with a black background, and there's no API that reports alpha
 * support, so WebKit is identified from the user agent.
 */
export function supportsAlphaWebm(): boolean {
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isSafari =
    /AppleWebKit/.test(ua) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);

  if (isIOS || isSafari) return false;

  return (
    document.createElement("video").canPlayType('video/webm; codecs="vp9"') !==
    ""
  );
}

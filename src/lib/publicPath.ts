/**
 * Normalizes an image `src` written in content JSON so next/image never
 * throws "Invalid URL". Accepts absolute URLs as-is; turns a path written
 * relative to the project root ("public/learning/a.png") or without a
 * leading slash ("learning/a.png") into the public URL ("/learning/a.png").
 */
export function toPublicSrc(src: string): string {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return src;
  const trimmed = src.replace(/^\.?\//, "").replace(/^public\//, "");
  return `/${trimmed}`;
}

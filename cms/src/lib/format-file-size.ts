/**
 * Human-readable file size for the Media Library list/detail views
 * (section 7/9). Binary (1024-based) units — matches what OS file
 * browsers show, which is what people expect on a "file size" label.
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return "—";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  const decimals = exponent === 0 ? 0 : value < 10 ? 1 : 0;

  return `${value.toFixed(decimals)} ${units[exponent]}`;
}

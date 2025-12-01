// Utility to format a file size in bytes into a human readable string (KB, MB, GB)
// Examples:
//  - formatsize(0) => "0 KB"
//  - formatsize(1536) => "1.5 MB"? No, 1536 bytes = 1.5 KB
//  - formatsize(1536) => "1.5 KB"

export function formatsize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";

  const K = 1024;
  let value = bytes / K; // start at KB
  let unit: "KB" | "MB" | "GB" = "KB";

  if (value >= K) {
    value = value / K;
    unit = "MB";
  }
  if (value >= K) {
    value = value / K;
    unit = "GB";
  }

  const isKB = unit === "KB";
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: isKB ? 0 : 1,
    maximumFractionDigits: isKB ? 0 : 1,
  });

  return `${formatter.format(value)} ${unit}`;
}

export default formatsize;

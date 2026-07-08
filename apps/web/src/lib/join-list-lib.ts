// Pure grammatical list join (Oxford comma), split out of the tag detail route
// so it can be unit-tested and reused.

/** Join a list into readable prose: "a", "a and b", or "a, b, and c". */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function compareShareOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

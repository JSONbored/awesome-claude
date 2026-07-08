// Pure yes/no label for an optional boolean field, split out of the entry detail
// route so it can be unit-tested. Returns undefined when the value is absent so
// callers can omit the row entirely.

export function booleanLabel(value?: boolean): string | undefined {
  if (value === undefined) return undefined;
  return value ? "Yes" : "No";
}

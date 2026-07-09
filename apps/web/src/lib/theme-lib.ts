// Pure theme value handling, split out of the theme provider so the guard can be
// unit-tested without React or storage.

export type Theme = "light" | "dark";

/** Type guard for a persisted theme value ("light" / "dark"); null-safe. */
export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

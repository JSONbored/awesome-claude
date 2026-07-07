// Pure sponsor-kind → badge label mapping, split out of sponsors-section.tsx so
// it can be unit-tested without React.

/**
 * Short uppercase badge label for a sponsor kind. Known kinds map to their own
 * label; any unknown kind falls back to "SERVICE".
 */
export function sponsorKindLabel(kind: string): string {
  switch (kind) {
    case "ai":
      return "AI";
    case "infra":
      return "INFRA";
    case "credits":
      return "CREDITS";
    default:
      return "SERVICE";
  }
}

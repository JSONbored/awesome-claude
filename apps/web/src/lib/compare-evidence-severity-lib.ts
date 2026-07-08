// Pure severity -> CSS class mapping for the compare evidence-gaps panel, split
// out so the mapping can be unit-tested without React.

/** Border/background/text classes for an evidence-gap severity. */
export function severityClass(severity: "low" | "medium" | "high"): string {
  if (severity === "high") return "border-trust-blocked/30 bg-trust-blocked/5 text-trust-blocked";
  if (severity === "medium") return "border-amber-500/30 bg-amber-500/5 text-amber-900";
  return "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted";
}

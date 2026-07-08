// Pure tone -> CSS class mapping for the browse rollout signals panel, split out
// so the mapping can be unit-tested without React.

/** Border/background/text classes for a rollout signal tone. */
export function toneClass(tone: "good" | "watch" | "risk"): string {
  if (tone === "good") return "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted";
  if (tone === "watch") return "border-amber-500/30 bg-amber-500/5 text-amber-900";
  return "border-trust-blocked/30 bg-trust-blocked/5 text-trust-blocked";
}

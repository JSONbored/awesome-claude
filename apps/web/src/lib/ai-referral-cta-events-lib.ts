/**
 * Pure AI referral analytics helpers.
 *
 * Maps one-per-session AI assistant referral attribution to privacy-light event
 * names without embedding full landing paths or entry slugs.
 */

export const AI_REFERRAL_SURFACE = "ai-referral";

export function aiReferralAnalyticsEvent(): string {
  return "ai-referral";
}

export function aiReferralLandingSegment(pathname: string): string {
  const normalized = pathname.trim() || "/";
  if (normalized === "/") return "home";
  const segment = normalized.split("/").filter(Boolean)[0];
  return segment ?? "home";
}

export function aiReferralAnalyticsData(source: string, pathname: string) {
  return {
    surface: AI_REFERRAL_SURFACE,
    source,
    landingSegment: aiReferralLandingSegment(pathname),
  };
}

/**
 * Pure claim and newsletter conversion CTA analytics helpers.
 *
 * Builds privacy-light event names and data without emails or other PII.
 */

export const NEWSLETTER_CTA_SURFACE = "newsletter";

export type ClaimCtaSurface =
  | "detail-command-center"
  | "detail-mobile"
  | "compare-table"
  | "compare-drawer"
  | "compare-page";

export function claimCtaAnalyticsEvent(): string {
  return "claim_cta_click";
}

export function claimCtaAnalyticsData(surface: ClaimCtaSurface, category?: string, slug?: string) {
  return {
    surface,
    ...(category && slug ? { entry: `${category}/${slug}` } : {}),
  };
}

export type ClaimCtaDestination = {
  to: "/claim";
};

/** Map a claim CTA id to the claim route. */
export function claimCtaDestination(destination: string): ClaimCtaDestination | null {
  switch (destination) {
    case "claim":
      return { to: "/claim" };
    default:
      return null;
  }
}

export function newsletterSubscribeAnalyticsEvent(): string {
  return "newsletter-subscribe";
}

export function newsletterSubscribeAnalyticsData(source: string, pending: boolean) {
  return {
    source: sanitizeNewsletterSource(source),
    pending,
    surface: NEWSLETTER_CTA_SURFACE,
  };
}

export function sanitizeNewsletterSource(source: string): string {
  return source.trim().slice(0, 64) || "inline";
}

/**
 * Newsletter email surface.
 *
 * Pure HTML/text template builders live in `newsletter-emails-lib.ts`. This
 * module re-exports that surface so existing `@/lib/newsletter-emails` imports
 * stay unchanged.
 */
export {
  THEME,
  DISPLAY,
  BODY,
  escapeHtml,
  trimUrl,
  siteHostOf,
  emailShell,
  eyebrow,
  primaryButton,
  standingCtasHtml,
  standingCtasText,
  buildNewsletterConfirmEmail,
  buildWelcomeEmail,
  buildListingLeadAckEmail,
  buildDigestEmail,
} from "@/lib/newsletter-emails-lib";

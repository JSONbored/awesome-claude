import { trackEvent } from "@/lib/analytics";
import { skipLinkAnalyticsData, skipLinkAnalyticsEvent } from "@/lib/a11y-chrome-cta-events";

export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={() => trackEvent(skipLinkAnalyticsEvent(), skipLinkAnalyticsData())}
      className="sr-only fixed left-3 top-3 z-[60] inline-flex h-9 items-center rounded-md bg-ink px-3 text-sm font-medium text-background focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      Skip to main content
    </a>
  );
}

import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  commercialDisclosureEgressAnalyticsData,
  commercialDisclosureEgressAnalyticsEvent,
} from "@/lib/commercial-disclosure-cta-events";

export function CommercialDisclosure({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-border bg-surface p-5 text-sm text-ink-muted ${className}`}
    >
      <div className="flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-trust-trusted" />
        <div className="space-y-2">
          <p className="font-medium text-ink">Paid placement stays separate from free content</p>
          <ul className="ml-4 list-disc space-y-1 text-xs">
            <li>
              Free, source-backed directory entries are reviewed the same way regardless of payment.
            </li>
            <li>
              Paid placements are labeled sponsor or featured — they never buy organic ranking.
            </li>
            <li>Trust and source badges reflect registry metadata, not sponsorship.</li>
            <li>
              Commercial interest is waitlist-first: maintainers review fit before any checkout or
              publish step.
            </li>
          </ul>
          <p className="text-xs">
            Policy details live on{" "}
            <Link
              to="/legal"
              className="text-ink underline-offset-2 hover:underline"
              onClick={() =>
                trackEvent(
                  commercialDisclosureEgressAnalyticsEvent(),
                  commercialDisclosureEgressAnalyticsData("legal"),
                )
              }
            >
              /legal
            </Link>
            .
          </p>
        </div>
      </div>
    </aside>
  );
}

export function CommercialLeadSuccess({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="h-display-2 text-ink text-balance">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{body}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}

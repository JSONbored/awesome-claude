import { entryCitationFacts } from "@heyclaude/registry";

import type { Entry } from "@/types/registry";
import { trackEvent, outboundHost } from "@/lib/analytics";
import {
  citationFactsEgressAnalyticsData,
  citationFactsEgressAnalyticsEvent,
} from "@/lib/citation-facts-cta-events";

// `Robots` is a crawler directive, not a human/AI citation fact — keep it in the
// machine LLMS endpoint but hide it from the visible block.
const HIDDEN_LABELS = new Set(["Robots"]);
const SINGLE_URL = /^https?:\/\/[^\s,]+$/i;

/**
 * Consolidated, machine-extractable "citation facts" for an entry, rendered as a
 * definition list. Every value comes from `entryCitationFacts` — the same
 * registry helper that produces the per-entry LLMS endpoint — so the visible
 * block and the plain-text endpoint can never drift, and nothing is fabricated.
 */
export function CitationFacts({ entry }: { entry: Entry }) {
  const facts = entryCitationFacts(entry as Parameters<typeof entryCitationFacts>[0]).filter(
    ([label]) => !HIDDEN_LABELS.has(label),
  );

  if (facts.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-[max-content_minmax(0,1fr)]">
      {facts.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="font-mono text-xs uppercase tracking-wide text-ink-subtle">{label}</dt>
          <dd className="min-w-0 break-words text-sm text-ink">
            {SINGLE_URL.test(value) ? (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackEvent(
                    citationFactsEgressAnalyticsEvent(),
                    citationFactsEgressAnalyticsData(
                      entry.category,
                      entry.slug,
                      label,
                      outboundHost(value),
                    ),
                  )
                }
                className="text-ink underline-offset-2 hover:underline"
              >
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

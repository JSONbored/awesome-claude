import { Download } from "lucide-react";

import { reportExportUrl } from "@/lib/data-reports";
import { trackEvent } from "@/lib/analytics";
import {
  reportDownloadsExportAnalyticsData,
  reportDownloadsExportAnalyticsEvent,
} from "@/lib/report-downloads-cta-events";

const LINK_CLASS =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-ink hover:bg-surface";

/**
 * "Download the data" section for a data report — links the JSON + CSV exports
 * served by `/api/reports/<exportSlug>.{json,csv}`.
 */
export function ReportDownloads({ exportSlug }: { exportSlug: string }) {
  return (
    <section className="mt-12 rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2">
        <Download className="h-5 w-5 text-ink-muted" aria-hidden />
        <h2 className="font-display text-xl font-semibold text-ink">Download the data</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Every figure in this report is available as a machine-readable export, regenerated from the
        registry. Free to reuse under CC BY 4.0 with attribution.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={reportExportUrl(exportSlug, "json")}
          className={LINK_CLASS}
          onClick={() =>
            trackEvent(
              reportDownloadsExportAnalyticsEvent(),
              reportDownloadsExportAnalyticsData(exportSlug, "json"),
            )
          }
        >
          <Download className="h-4 w-4" aria-hidden /> JSON
        </a>
        <a
          href={reportExportUrl(exportSlug, "csv")}
          className={LINK_CLASS}
          onClick={() =>
            trackEvent(
              reportDownloadsExportAnalyticsEvent(),
              reportDownloadsExportAnalyticsData(exportSlug, "csv"),
            )
          }
        >
          <Download className="h-4 w-4" aria-hidden /> CSV
        </a>
      </div>
    </section>
  );
}

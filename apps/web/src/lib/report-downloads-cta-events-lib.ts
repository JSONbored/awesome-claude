/**
 * Pure report downloads navigation analytics helpers.
 *
 * Maps JSON/CSV export egress to privacy-light event names without embedding
 * file bytes or regenerated report contents.
 */

export const REPORT_DOWNLOADS_SURFACE = "report-downloads";

export type ReportDownloadsFormat = "json" | "csv";

export function reportDownloadsExportAnalyticsEvent(): string {
  return "report_downloads_export_click";
}

export function reportDownloadsExportAnalyticsData(
  exportSlug: string,
  format: ReportDownloadsFormat,
) {
  return {
    surface: REPORT_DOWNLOADS_SURFACE,
    exportSlug,
    format,
  };
}

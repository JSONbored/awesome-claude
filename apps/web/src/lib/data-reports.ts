/**
 * Registry data report surface.
 *
 * Pure report helpers live in `data-reports-lib.ts`. This module re-exports that
 * surface so existing `@/lib/data-reports` imports stay unchanged.
 */
export type { DistRow, ReportDimension, ReportModel, ReportStat } from "@/lib/data-reports-lib";
export {
  REPORT_PATHS,
  buildReportDataset,
  reportExportUrl,
  reportToCsv,
  reportToJson,
  tagDistribution,
} from "@/lib/data-reports-lib";

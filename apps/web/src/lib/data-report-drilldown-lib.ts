/**
 * Pure data-report distribution drill-down helpers.
 *
 * Attaches privacy-light browse/tag destinations to distribution rows using
 * stable enum/slug keys — never free-form titles beyond registry tag slugs.
 */

import type { DistRow, DistRowDrilldown } from "@/components/data-report";
import { SOURCE_LABEL, TRUST_LABEL, type SourceStatus, type TrustLevel } from "@/types/registry";

const TRUST_BY_LABEL = Object.fromEntries(
  (Object.entries(TRUST_LABEL) as Array<[TrustLevel, string]>).map(([key, label]) => [label, key]),
) as Record<string, TrustLevel>;

const SOURCE_BY_LABEL = Object.fromEntries(
  (Object.entries(SOURCE_LABEL) as Array<[SourceStatus, string]>).map(([key, label]) => [
    label,
    key,
  ]),
) as Record<string, SourceStatus>;

export function trustLevelFromLabel(label: string): TrustLevel | undefined {
  return TRUST_BY_LABEL[label];
}

export function sourceStatusFromLabel(label: string): SourceStatus | undefined {
  return SOURCE_BY_LABEL[label];
}

export function browseDrilldown(search: {
  category?: string;
  trust?: string;
  source?: string;
}): DistRowDrilldown {
  return { kind: "browse", search };
}

export function tagDrilldown(tag: string): DistRowDrilldown {
  return { kind: "tag", tag };
}

export function withTrustDrilldown(rows: DistRow[], category?: string): DistRow[] {
  return rows.map((row) => {
    const trust = trustLevelFromLabel(row.label);
    if (!trust) return row;
    return {
      ...row,
      rowKey: trust,
      drilldown: browseDrilldown({
        ...(category ? { category } : {}),
        trust,
      }),
    };
  });
}

export function withSourceDrilldown(rows: DistRow[], category?: string): DistRow[] {
  return rows.map((row) => {
    const source = sourceStatusFromLabel(row.label);
    if (!source) return row;
    return {
      ...row,
      rowKey: source,
      drilldown: browseDrilldown({
        ...(category ? { category } : {}),
        source,
      }),
    };
  });
}

export function withTagDrilldown(rows: DistRow[]): DistRow[] {
  return rows.map((row) => ({
    ...row,
    rowKey: row.rowKey ?? row.label,
    drilldown: tagDrilldown(row.label),
  }));
}

export function withCategoryBrowseDrilldown(rows: DistRow[], category: string): DistRow[] {
  return rows.map((row) => ({
    ...row,
    rowKey: row.rowKey ?? row.label,
    drilldown: browseDrilldown({ category }),
  }));
}

/**
 * Attach drill-downs for known report dimension keys. Unknown dimensions are
 * returned unchanged (still display-only).
 */
export function withReportDimensionDrilldown(
  dimensionKey: string,
  rows: DistRow[],
  category: string,
): DistRow[] {
  switch (dimensionKey) {
    case "trust-level":
      return withTrustDrilldown(rows, category);
    case "source-provenance":
      return withSourceDrilldown(rows, category);
    case "use-cases":
      return withTagDrilldown(rows);
    case "prerequisites":
    case "disclosure":
    case "packaging":
    case "skill-type":
    case "maturity":
    case "verification":
    case "hook-events":
      return withCategoryBrowseDrilldown(rows, category);
    default:
      return rows;
  }
}

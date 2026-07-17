/**
 * Pure data-report distribution drill-down helpers.
 *
 * Attaches privacy-light browse/tag destinations to distribution rows using
 * stable enum/slug keys — never free-form titles beyond registry tag slugs.
 */

import type { DistBrowseSearch, DistRow, DistRowDrilldown } from "@/components/data-report";
import {
  PLATFORM_LABEL,
  SOURCE_LABEL,
  TRUST_LABEL,
  type Platform,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";

const TRUST_BY_LABEL = Object.fromEntries(
  (Object.entries(TRUST_LABEL) as Array<[TrustLevel, string]>).map(([key, label]) => [label, key]),
) as Record<string, TrustLevel>;

const SOURCE_BY_LABEL = Object.fromEntries(
  (Object.entries(SOURCE_LABEL) as Array<[SourceStatus, string]>).map(([key, label]) => [
    label,
    key,
  ]),
) as Record<string, SourceStatus>;

const PLATFORM_BY_LABEL = Object.fromEntries(
  (Object.entries(PLATFORM_LABEL) as Array<[Platform, string]>).map(([key, label]) => [label, key]),
) as Record<string, Platform>;

const NOTES_SIGNAL_BY_LABEL: Record<string, string> = {
  "Safety notes": "safety-notes",
  "Privacy notes": "privacy-notes",
};

const SUPPLY_SIGNAL_BY_LABEL: Record<string, string> = {
  "Verified package": "trusted-package",
  "Checksummed download": "checksums",
};

const TRANSPORT_KEY_BY_LABEL: Record<string, string> = {
  "stdio (local)": "stdio",
  HTTP: "http",
  SSE: "sse",
  Unspecified: "unspecified",
};

const HOSTING_KEY_BY_LABEL: Record<string, string> = {
  "Local (stdio)": "local",
  "Remote (hosted)": "remote",
  Unspecified: "unspecified",
};

export function trustLevelFromLabel(label: string): TrustLevel | undefined {
  return TRUST_BY_LABEL[label];
}

export function sourceStatusFromLabel(label: string): SourceStatus | undefined {
  return SOURCE_BY_LABEL[label];
}

export function platformFromLabel(label: string): Platform | undefined {
  return PLATFORM_BY_LABEL[label];
}

export function notesSignalFromLabel(label: string): string | undefined {
  return NOTES_SIGNAL_BY_LABEL[label];
}

export function supplyChainSignalFromLabel(label: string): string | undefined {
  return SUPPLY_SIGNAL_BY_LABEL[label];
}

export function transportKeyFromLabel(label: string): string | undefined {
  return TRANSPORT_KEY_BY_LABEL[label];
}

export function hostingKeyFromLabel(label: string): string | undefined {
  return HOSTING_KEY_BY_LABEL[label];
}

export function installMethodKeyFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function browseDrilldown(search: DistBrowseSearch): DistRowDrilldown {
  return { kind: "browse", search };
}

export function tagDrilldown(tag: string): DistRowDrilldown {
  return { kind: "tag", tag };
}

export function categoryDrilldown(category: string): DistRowDrilldown {
  return { kind: "category", category };
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

export function withPlatformDrilldown(rows: DistRow[]): DistRow[] {
  return rows.map((row) => {
    const platform = platformFromLabel(row.label);
    if (!platform) return row;
    return {
      ...row,
      rowKey: platform,
      drilldown: browseDrilldown({ platform }),
    };
  });
}

export function withNotesSignalDrilldown(rows: DistRow[], category?: string): DistRow[] {
  return rows.map((row) => {
    const signal = notesSignalFromLabel(row.label);
    if (!signal) {
      if (!category) return row;
      return {
        ...row,
        rowKey: row.rowKey ?? row.label,
        drilldown: browseDrilldown({ category }),
      };
    }
    return {
      ...row,
      rowKey: signal,
      drilldown: browseDrilldown({
        ...(category ? { category } : {}),
        signal,
      }),
    };
  });
}

export function withSupplyChainSignalDrilldown(rows: DistRow[], category?: string): DistRow[] {
  return rows.map((row) => {
    const signal = supplyChainSignalFromLabel(row.label);
    if (!signal) return row;
    return {
      ...row,
      rowKey: signal,
      drilldown: browseDrilldown({
        ...(category ? { category } : {}),
        signal,
      }),
    };
  });
}

export function withDocsCoverageDrilldown(rows: DistRow[], category: string): DistRow[] {
  return rows.map((row) => {
    const signal = notesSignalFromLabel(row.label);
    if (signal) {
      return {
        ...row,
        rowKey: signal,
        drilldown: browseDrilldown({ category, signal }),
      };
    }
    return {
      ...row,
      rowKey: row.rowKey ?? installMethodKeyFromLabel(row.label),
      drilldown: browseDrilldown({ category }),
    };
  });
}

export function withTransportDrilldown(rows: DistRow[], category: string): DistRow[] {
  return rows.map((row) => {
    const key = transportKeyFromLabel(row.label);
    if (!key) return row;
    return {
      ...row,
      rowKey: key,
      drilldown: browseDrilldown({ category }),
    };
  });
}

export function withHostingDrilldown(rows: DistRow[], category: string): DistRow[] {
  return rows.map((row) => {
    const key = hostingKeyFromLabel(row.label);
    if (!key) return row;
    return {
      ...row,
      rowKey: key,
      drilldown: browseDrilldown({ category }),
    };
  });
}

export function withInstallMethodDrilldown(rows: DistRow[], category?: string): DistRow[] {
  return rows.map((row) => ({
    ...row,
    rowKey: installMethodKeyFromLabel(row.label),
    drilldown: browseDrilldown({
      ...(category ? { category } : {}),
    }),
  }));
}

export function withTagDrilldown(rows: DistRow[]): DistRow[] {
  return rows.map((row) => ({
    ...row,
    rowKey: row.rowKey ?? row.label,
    drilldown: tagDrilldown(row.label),
  }));
}

export function withCategoryHubDrilldown(
  rows: DistRow[],
  labelToId: Map<string, string>,
): DistRow[] {
  return rows.map((row) => {
    const category = labelToId.get(row.label);
    if (!category) return row;
    return {
      ...row,
      rowKey: category,
      drilldown: categoryDrilldown(category),
    };
  });
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
    case "platform-coverage":
      return withPlatformDrilldown(rows);
    case "notes-coverage":
      return withNotesSignalDrilldown(rows, category);
    case "supply-chain":
      return withSupplyChainSignalDrilldown(rows, category);
    case "docs-coverage":
      return withDocsCoverageDrilldown(rows, category);
    case "transport":
      return withTransportDrilldown(rows, category);
    case "hosting":
      return withHostingDrilldown(rows, category);
    case "install-methods":
      return withInstallMethodDrilldown(rows, category);
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

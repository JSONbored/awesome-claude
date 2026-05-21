import type { DirectoryEntry } from "@/lib/content";

export type UtilityFilterOption = {
  readonly value: string;
  readonly label: string;
};

export const utilityFilterOptions = [
  { value: "all", label: "All Utility" },
  { value: "installable", label: "Installable" },
  { value: "trusted-package", label: "Trusted Package" },
  { value: "source-backed", label: "Source-backed" },
  { value: "brand-metadata", label: "Brand Metadata" },
  { value: "checksum", label: "Checksum" },
  { value: "adapter", label: "Adapter" },
  { value: "reviewed", label: "Reviewed" },
  { value: "verified", label: "Verified/Prod" },
  { value: "draft", label: "Draft" },
  { value: "hook-trigger", label: "Hook Trigger" },
  { value: "prerequisites", label: "Prerequisites" },
  { value: "safety-notes", label: "Safety Notes" },
  { value: "privacy-notes", label: "Privacy Notes" },
  { value: "troubleshooting", label: "Troubleshooting" },
] as const satisfies ReadonlyArray<UtilityFilterOption>;

export type UtilityFilterValue = (typeof utilityFilterOptions)[number]["value"];

export type TrustFilterChip = {
  readonly value: UtilityFilterValue;
  readonly label: string;
  readonly description: string;
};

export const trustFilterChips: ReadonlyArray<TrustFilterChip> = [
  {
    value: "safety-notes",
    label: "Safety notes",
    description: "Entries that disclose execution, install, or network safety context.",
  },
  {
    value: "privacy-notes",
    label: "Privacy notes",
    description: "Entries that disclose local files, logs, credentials, or telemetry behavior.",
  },
  {
    value: "source-backed",
    label: "Source-backed",
    description: "Entries with available source metadata for review.",
  },
  {
    value: "trusted-package",
    label: "Trusted package",
    description: "First-party packages or maintainer-verified package downloads.",
  },
  {
    value: "reviewed",
    label: "Reviewed",
    description: "Entries with a reviewer or a verified claim.",
  },
  {
    value: "checksum",
    label: "Checksum",
    description: "Entries that ship with a recorded package checksum.",
  },
];

export function normalizeUtilityFilter(value?: string): string {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return utilityFilterOptions.some((option) => option.value === normalized)
    ? normalized
    : "all";
}

export function matchesUtilityFilter(
  entry: DirectoryEntry,
  filter: string,
): boolean {
  switch (filter) {
    case "installable":
      return Boolean(
        entry.installable || entry.installCommand || entry.downloadUrl,
      );
    case "trusted-package":
      return (
        entry.downloadTrust === "first-party" || entry.packageVerified === true
      );
    case "source-backed":
      return entry.trustSignals?.sourceStatus === "available";
    case "brand-metadata":
      return Boolean(entry.brandDomain || entry.brandIconUrl);
    case "checksum":
      return entry.trustSignals?.checksumPresent === true;
    case "adapter":
      return entry.trustSignals?.adapterGenerated === true;
    case "reviewed":
      return Boolean(entry.reviewedBy || entry.claimStatus === "verified");
    case "verified":
      return (
        entry.verificationStatus === "validated" ||
        entry.verificationStatus === "production"
      );
    case "draft":
      return entry.verificationStatus === "draft";
    case "hook-trigger":
      return Boolean(entry.trigger);
    case "prerequisites":
      return Boolean(entry.hasPrerequisites || entry.prerequisites?.length);
    case "safety-notes":
      return Boolean(entry.safetyNotes?.length);
    case "privacy-notes":
      return Boolean(entry.privacyNotes?.length);
    case "troubleshooting":
      return entry.hasTroubleshooting === true;
    default:
      return true;
  }
}

export function countTrustFilterChips(
  entries: ReadonlyArray<DirectoryEntry>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const chip of trustFilterChips) {
    counts[chip.value] = 0;
  }
  for (const entry of entries) {
    for (const chip of trustFilterChips) {
      if (matchesUtilityFilter(entry, chip.value)) {
        counts[chip.value] += 1;
      }
    }
  }
  return counts;
}

import type { Entry } from "@/types/registry";

export type CompareSignalTone = "present" | "missing";

export type CompareSignalValue = {
  tone: CompareSignalTone;
  label: string;
  detail?: string;
};

export function reviewCompareSignal(
  entry: Pick<Entry, "reviewedBy" | "reviewedAt" | "reviewed">,
): CompareSignalValue {
  if (entry.reviewedBy || entry.reviewed) {
    const detail = entry.reviewedBy
      ? entry.reviewedAt
        ? `${entry.reviewedBy} · ${String(entry.reviewedAt).slice(0, 10)}`
        : entry.reviewedBy
      : "Maintainer reviewed";
    return { tone: "present", label: "Reviewed", detail };
  }
  return { tone: "missing", label: "Not reviewed" };
}

export function packageTrustCompareSignal(
  entry: Pick<Entry, "packageVerified" | "verifiedAt" | "trustSignals" | "downloadSha256">,
): CompareSignalValue {
  const explicitVerification = entry.packageVerified ?? entry.trustSignals?.packageVerified;

  if (explicitVerification === true) {
    return {
      tone: "present",
      label: "Package verified",
      detail: entry.verifiedAt ? String(entry.verifiedAt).slice(0, 10) : undefined,
    };
  }

  if (explicitVerification === false) {
    return { tone: "missing", label: "Package not verified" };
  }

  if (entry.downloadSha256 || entry.trustSignals?.checksumPresent) {
    return { tone: "present", label: "Checksum present" };
  }

  return { tone: "missing", label: "Package not verified" };
}

export function sourceProvenanceCompareSignal(
  entry: Pick<Entry, "source" | "sourceSubmissionUrl" | "importPrUrl" | "trustSignals">,
): CompareSignalValue {
  if (entry.sourceSubmissionUrl || entry.importPrUrl) {
    return {
      tone: "present",
      label: "Submission linked",
      detail: entry.importPrUrl ? "Import PR" : "Source submission",
    };
  }
  if (entry.source === "source-backed" || entry.trustSignals?.sourceStatus === "available") {
    return { tone: "present", label: "Source-backed" };
  }
  return { tone: "missing", label: "No submission link" };
}

export function submitterCompareSignal(
  entry: Pick<Entry, "submittedBy">,
): CompareSignalValue | undefined {
  if (!entry.submittedBy) return undefined;
  return { tone: "present", label: entry.submittedBy };
}

export function resolveCompareSignal(value: CompareSignalValue | undefined): CompareSignalValue {
  return value ?? { tone: "missing", label: "—" };
}

export const COMPARE_DECISION_ROWS = [
  { label: "Review status", resolve: reviewCompareSignal },
  { label: "Package trust", resolve: packageTrustCompareSignal },
  { label: "Source provenance", resolve: sourceProvenanceCompareSignal },
  { label: "Submitter", resolve: submitterCompareSignal },
] as const;

export function compareSignalsDiverge(values: Array<CompareSignalValue | undefined>): boolean {
  if (values.length < 2) return false;
  const signature = values.map((value) => {
    const signal = resolveCompareSignal(value);
    return `${signal.tone}:${signal.label}:${signal.detail ?? ""}`;
  });
  return new Set(signature).size > 1;
}

export function decisionRowDiverges(
  resolve: (entry: Entry) => CompareSignalValue | undefined,
  items: Entry[],
): boolean {
  return compareSignalsDiverge(items.map((entry) => resolve(entry)));
}

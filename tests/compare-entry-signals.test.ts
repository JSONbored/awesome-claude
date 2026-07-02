import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareSignalToneClass,
  compareSignalsDiverge,
  COMPARE_DECISION_ROWS,
  decisionRowDiverges,
  packageTrustCompareSignal,
  resolveCompareSignal,
  reviewCompareSignal,
  sourceProvenanceCompareSignal,
  submitterCompareSignal,
} from "@/lib/compare-entry-signals";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("compare entry signals", () => {
  it("describes review status for maintainer-reviewed entries", () => {
    expect(reviewCompareSignal(entry())).toEqual({
      tone: "missing",
      label: "Not reviewed",
    });
    expect(reviewCompareSignal(entry({ reviewed: true }))).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "Maintainer reviewed",
    });
    expect(
      reviewCompareSignal(
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-05-01T00:00:00Z" }),
      ),
    ).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "maintainer · 2026-05-01",
    });
    expect(reviewCompareSignal(entry({ reviewedBy: "maintainer" }))).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "maintainer",
    });
  });

  it("describes package trust from verified metadata only", () => {
    expect(packageTrustCompareSignal(entry())).toEqual({
      tone: "missing",
      label: "Package not verified",
    });
    expect(packageTrustCompareSignal(entry({ packageVerified: true }))).toEqual(
      {
        tone: "verified",
        label: "Package verified",
        detail: undefined,
      },
    );
    expect(
      packageTrustCompareSignal(
        entry({
          verifiedAt: "2026-04-12",
          packageVerified: true,
        }),
      ),
    ).toEqual({
      tone: "verified",
      label: "Package verified",
      detail: "2026-04-12",
    });
    expect(
      packageTrustCompareSignal(
        entry({ trustSignals: { packageVerified: true } }),
      ),
    ).toEqual({
      tone: "verified",
      label: "Package verified",
      detail: undefined,
    });
  });

  it("maps compare signal tones to drawer styling classes", () => {
    expect(compareSignalToneClass("verified")).toBe("text-trust-trusted");
    expect(compareSignalToneClass("present")).toBe("text-ink");
    expect(compareSignalToneClass("missing")).toBe("text-ink-subtle");
    expect(resolveCompareSignal(undefined)).toEqual({
      tone: "missing",
      label: "—",
    });
  });

  it("maps checksum-only package metadata to a neutral present tone", () => {
    const checksumOnly = packageTrustCompareSignal(
      entry({ trustSignals: { checksumPresent: true } }),
    );
    expect(checksumOnly).toEqual({
      tone: "present",
      label: "Checksum present",
    });
    expect(compareSignalToneClass(checksumOnly.tone)).toBe("text-ink");
    expect(
      compareSignalToneClass(
        packageTrustCompareSignal(entry({ packageVerified: true })).tone,
      ),
    ).toBe("text-trust-trusted");
  });

  it("surfaces checksum-only metadata without overstating package verification", () => {
    expect(
      packageTrustCompareSignal(
        entry({ trustSignals: { checksumPresent: true } }),
      ),
    ).toEqual({
      tone: "present",
      label: "Checksum present",
    });
    expect(
      packageTrustCompareSignal(entry({ downloadSha256: "abc123" })),
    ).toEqual({
      tone: "present",
      label: "Checksum present",
    });
    expect(
      packageTrustCompareSignal(
        entry({
          packageVerified: false,
          downloadSha256: "abc123",
        }),
      ),
    ).toEqual({
      tone: "missing",
      label: "Package not verified",
    });
    expect(
      packageTrustCompareSignal(
        entry({
          trustSignals: { packageVerified: false, checksumPresent: true },
        }),
      ),
    ).toEqual({
      tone: "missing",
      label: "Package not verified",
    });
  });

  it("describes source provenance from submission links or source-backed metadata", () => {
    expect(sourceProvenanceCompareSignal(entry())).toEqual({
      tone: "missing",
      label: "No submission link",
    });
    expect(
      sourceProvenanceCompareSignal(
        entry({
          source: "source-backed",
          trustSignals: { sourceStatus: "available" },
        }),
      ),
    ).toEqual({
      tone: "present",
      label: "Source-backed",
    });
    expect(
      sourceProvenanceCompareSignal(entry({ source: "source-backed" })),
    ).toEqual({
      tone: "present",
      label: "Source-backed",
    });
    expect(
      sourceProvenanceCompareSignal(
        entry({ trustSignals: { sourceStatus: "available" } }),
      ),
    ).toEqual({
      tone: "present",
      label: "Source-backed",
    });
    expect(
      sourceProvenanceCompareSignal(
        entry({
          importPrUrl: "https://github.com/org/repo/pull/1",
          sourceSubmissionUrl: "https://github.com/org/repo/issues/1",
        }),
      ),
    ).toEqual({
      tone: "present",
      label: "Submission linked",
      detail: "Import PR",
    });
    expect(
      sourceProvenanceCompareSignal(
        entry({ importPrUrl: "https://github.com/org/repo/pull/1" }),
      ),
    ).toEqual({
      tone: "present",
      label: "Submission linked",
      detail: "Import PR",
    });
    expect(
      sourceProvenanceCompareSignal(
        entry({ sourceSubmissionUrl: "https://github.com/org/repo/issues/1" }),
      ),
    ).toEqual({
      tone: "present",
      label: "Submission linked",
      detail: "Source submission",
    });
  });

  it("returns submitter labels only when provenance exists", () => {
    expect(submitterCompareSignal(entry())).toBeUndefined();
    expect(submitterCompareSignal(entry({ submittedBy: "kiannidev" }))).toEqual(
      {
        tone: "present",
        label: "kiannidev",
      },
    );
  });

  it("exposes compare decision rows and detects diverging signal sets", () => {
    expect(COMPARE_DECISION_ROWS.map((row) => row.label)).toEqual([
      "Review status",
      "Package trust",
      "Source provenance",
      "Submitter",
    ]);
    expect(
      compareSignalsDiverge([
        reviewCompareSignal(entry({ reviewed: true })),
        reviewCompareSignal(entry()),
      ]),
    ).toBe(true);
    expect(
      compareSignalsDiverge([
        reviewCompareSignal(entry({ reviewed: true })),
        reviewCompareSignal(entry({ reviewed: true })),
      ]),
    ).toBe(false);
    expect(compareSignalsDiverge([reviewCompareSignal(entry())])).toBe(false);
    expect(compareSignalsDiverge([])).toBe(false);
    expect(
      compareSignalsDiverge([
        submitterCompareSignal(entry({ submittedBy: "kiannidev" })),
        submitterCompareSignal(entry()),
      ]),
    ).toBe(true);
    expect(
      compareSignalsDiverge([
        submitterCompareSignal(entry({ submittedBy: "kiannidev" })),
        submitterCompareSignal(entry({ submittedBy: "kiannidev" })),
      ]),
    ).toBe(false);
  });

  it("detects submitter row divergence across compared entries", () => {
    const submitterRow = COMPARE_DECISION_ROWS.find(
      (row) => row.label === "Submitter",
    );
    expect(submitterRow).toBeDefined();
    expect(
      decisionRowDiverges(submitterRow!.resolve, [
        entry({ submittedBy: "kiannidev" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      decisionRowDiverges(submitterRow!.resolve, [
        entry({ submittedBy: "kiannidev" }),
        entry({ submittedBy: "kiannidev" }),
      ]),
    ).toBe(false);
  });
});

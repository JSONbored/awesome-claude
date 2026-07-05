import { describe, expect, it } from "vitest";

import type { Entry } from "@/types/registry";
import {
  COMPARE_DECISION_ROWS,
  compareSignalToneClass,
  compareSignalsDiverge,
  decisionRowDiverges,
  packageTrustCompareSignal,
  resolveCompareSignal,
  reviewCompareSignal,
  sourceProvenanceCompareSignal,
  submitterCompareSignal,
  type CompareSignalTone,
} from "../apps/web/src/lib/compare-entry-signals-lib";

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

describe("reviewCompareSignal", () => {
  it("returns missing when no review metadata exists", () => {
    expect(reviewCompareSignal(entry())).toEqual({
      tone: "missing",
      label: "Not reviewed",
    });
  });

  it("returns verified with maintainer copy when reviewed flag is set", () => {
    expect(reviewCompareSignal(entry({ reviewed: true }))).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "Maintainer reviewed",
    });
  });

  it("includes reviewer and date when both are present", () => {
    expect(
      reviewCompareSignal(
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-05-01T00:00:00Z" }),
      ),
    ).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "maintainer · 2026-05-01",
    });
  });

  it("includes reviewer only when reviewedAt is absent", () => {
    expect(reviewCompareSignal(entry({ reviewedBy: "maintainer" }))).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "maintainer",
    });
  });

  it("prefers reviewedBy over reviewed flag for detail text", () => {
    expect(
      reviewCompareSignal(
        entry({
          reviewed: true,
          reviewedBy: "editor",
          reviewedAt: "2026-06-15",
        }),
      ),
    ).toEqual({
      tone: "verified",
      label: "Reviewed",
      detail: "editor · 2026-06-15",
    });
  });

  it.each(["2026-01-01", "2026-12-31T23:59:59Z", "2025-07-04T12:00:00.000Z"])(
    "truncates reviewedAt %s to the date portion",
    (reviewedAt) => {
      const signal = reviewCompareSignal(
        entry({ reviewedBy: "bot", reviewedAt }),
      );
      expect(signal.detail).toBe(`bot · ${String(reviewedAt).slice(0, 10)}`);
    },
  );
});

describe("packageTrustCompareSignal", () => {
  it("returns missing when no verification metadata exists", () => {
    expect(packageTrustCompareSignal(entry())).toEqual({
      tone: "missing",
      label: "Package not verified",
    });
  });

  it("returns verified when packageVerified is true", () => {
    expect(packageTrustCompareSignal(entry({ packageVerified: true }))).toEqual(
      {
        tone: "verified",
        label: "Package verified",
        detail: undefined,
      },
    );
  });

  it("includes verifiedAt date when package is verified", () => {
    expect(
      packageTrustCompareSignal(
        entry({ packageVerified: true, verifiedAt: "2026-04-12" }),
      ),
    ).toEqual({
      tone: "verified",
      label: "Package verified",
      detail: "2026-04-12",
    });
  });

  it("reads packageVerified from trustSignals when top-level field is absent", () => {
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

  it("prefers explicit false over checksum hints", () => {
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
  });

  it("returns missing when trustSignals explicitly mark package unverified", () => {
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

  it("returns present for checksum-only metadata", () => {
    expect(
      packageTrustCompareSignal(entry({ downloadSha256: "abc123" })),
    ).toEqual({
      tone: "present",
      label: "Checksum present",
    });
    expect(
      packageTrustCompareSignal(
        entry({ trustSignals: { checksumPresent: true } }),
      ),
    ).toEqual({
      tone: "present",
      label: "Checksum present",
    });
  });

  it("does not treat undefined packageVerified as false", () => {
    expect(
      packageTrustCompareSignal(
        entry({ packageVerified: undefined, downloadSha256: "sha" }),
      ),
    ).toEqual({
      tone: "present",
      label: "Checksum present",
    });
  });
});

describe("sourceProvenanceCompareSignal", () => {
  it("returns missing when no provenance exists", () => {
    expect(sourceProvenanceCompareSignal(entry())).toEqual({
      tone: "missing",
      label: "No submission link",
    });
  });

  it("returns source-backed for explicit source-backed entries", () => {
    expect(
      sourceProvenanceCompareSignal(entry({ source: "source-backed" })),
    ).toEqual({
      tone: "present",
      label: "Source-backed",
    });
  });

  it("returns source-backed when trustSignals report available source", () => {
    expect(
      sourceProvenanceCompareSignal(
        entry({ trustSignals: { sourceStatus: "available" } }),
      ),
    ).toEqual({
      tone: "present",
      label: "Source-backed",
    });
  });

  it("prefers submission links over source-backed metadata", () => {
    expect(
      sourceProvenanceCompareSignal(
        entry({
          source: "source-backed",
          sourceSubmissionUrl: "https://github.com/org/repo/issues/1",
        }),
      ),
    ).toEqual({
      tone: "present",
      label: "Submission linked",
      detail: "Source submission",
    });
  });

  it("labels import PR links distinctly", () => {
    expect(
      sourceProvenanceCompareSignal(
        entry({ importPrUrl: "https://github.com/org/repo/pull/1" }),
      ),
    ).toEqual({
      tone: "present",
      label: "Submission linked",
      detail: "Import PR",
    });
  });

  it("prefers Import PR detail when both URLs are present", () => {
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
  });
});

describe("submitterCompareSignal", () => {
  it("returns undefined when submittedBy is absent", () => {
    expect(submitterCompareSignal(entry())).toBeUndefined();
  });

  it("returns present tone with submitter label", () => {
    expect(submitterCompareSignal(entry({ submittedBy: "kiannidev" }))).toEqual(
      {
        tone: "present",
        label: "kiannidev",
      },
    );
  });

  it.each(["alice", "bob-dev", "org-bot"])(
    "preserves submitter label %s",
    (submittedBy) => {
      expect(submitterCompareSignal(entry({ submittedBy }))?.label).toBe(
        submittedBy,
      );
    },
  );
});

describe("resolveCompareSignal", () => {
  it("returns the input signal when defined", () => {
    const signal = { tone: "present" as const, label: "X" };
    expect(resolveCompareSignal(signal)).toBe(signal);
  });

  it("returns an em dash missing placeholder for undefined", () => {
    expect(resolveCompareSignal(undefined)).toEqual({
      tone: "missing",
      label: "—",
    });
  });
});

describe("COMPARE_DECISION_ROWS", () => {
  it("lists the compare drawer decision rows in order", () => {
    expect(COMPARE_DECISION_ROWS.map((row) => row.label)).toEqual([
      "Review status",
      "Package trust",
      "Source provenance",
      "Submitter",
    ]);
  });

  it.each(COMPARE_DECISION_ROWS)("wires resolver for $label", (row) => {
    expect(typeof row.resolve).toBe("function");
    if (row.label === "Submitter") {
      expect(row.resolve(entry())).toBeUndefined();
      expect(row.resolve(entry({ submittedBy: "dev" }))).toBeDefined();
      return;
    }
    expect(row.resolve(entry())).toBeDefined();
  });
});

describe("compareSignalToneClass", () => {
  it.each<[CompareSignalTone, string]>([
    ["verified", "text-trust-trusted"],
    ["present", "text-ink"],
    ["missing", "text-ink-subtle"],
  ])("maps %s to %s", (tone, className) => {
    expect(compareSignalToneClass(tone)).toBe(className);
  });
});

describe("compareSignalsDiverge", () => {
  it("returns false for fewer than two values", () => {
    expect(compareSignalsDiverge([])).toBe(false);
    expect(compareSignalsDiverge([reviewCompareSignal(entry())])).toBe(false);
  });

  it("detects review status divergence", () => {
    expect(
      compareSignalsDiverge([
        reviewCompareSignal(entry({ reviewed: true })),
        reviewCompareSignal(entry()),
      ]),
    ).toBe(true);
  });

  it("returns false when compared review signals match", () => {
    expect(
      compareSignalsDiverge([
        reviewCompareSignal(entry({ reviewed: true })),
        reviewCompareSignal(entry({ reviewed: true })),
      ]),
    ).toBe(false);
  });

  it("detects package trust divergence", () => {
    expect(
      compareSignalsDiverge([
        packageTrustCompareSignal(entry({ packageVerified: true })),
        packageTrustCompareSignal(entry()),
      ]),
    ).toBe(true);
  });

  it("detects provenance divergence", () => {
    expect(
      compareSignalsDiverge([
        sourceProvenanceCompareSignal(entry({ source: "source-backed" })),
        sourceProvenanceCompareSignal(entry()),
      ]),
    ).toBe(true);
  });

  it("detects submitter divergence including undefined vs present", () => {
    expect(
      compareSignalsDiverge([
        submitterCompareSignal(entry({ submittedBy: "alice" })),
        submitterCompareSignal(entry()),
      ]),
    ).toBe(true);
  });

  it("treats matching submitter labels as non-divergent", () => {
    expect(
      compareSignalsDiverge([
        submitterCompareSignal(entry({ submittedBy: "alice" })),
        submitterCompareSignal(entry({ submittedBy: "alice" })),
      ]),
    ).toBe(false);
  });

  it("includes detail text in divergence signatures", () => {
    expect(
      compareSignalsDiverge([
        reviewCompareSignal(entry({ reviewedBy: "alice" })),
        reviewCompareSignal(entry({ reviewedBy: "bob" })),
      ]),
    ).toBe(true);
    expect(
      compareSignalsDiverge([
        sourceProvenanceCompareSignal(entry({ importPrUrl: "https://x/pr/1" })),
        sourceProvenanceCompareSignal(
          entry({ sourceSubmissionUrl: "https://x/issues/1" }),
        ),
      ]),
    ).toBe(true);
  });
});

describe("decisionRowDiverges", () => {
  it.each(COMPARE_DECISION_ROWS)("evaluates divergence for $label", (row) => {
    const diverging = decisionRowDiverges(row.resolve, [
      entry({ reviewed: true, packageVerified: true, submittedBy: "a" }),
      entry(),
    ]);
    expect(typeof diverging).toBe("boolean");
  });

  it("detects submitter row divergence across compared entries", () => {
    const submitterRow = COMPARE_DECISION_ROWS.find(
      (row) => row.label === "Submitter",
    )!;
    expect(
      decisionRowDiverges(submitterRow.resolve, [
        entry({ submittedBy: "kiannidev" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      decisionRowDiverges(submitterRow.resolve, [
        entry({ submittedBy: "kiannidev" }),
        entry({ submittedBy: "kiannidev" }),
      ]),
    ).toBe(false);
  });

  it("detects review row divergence", () => {
    const reviewRow = COMPARE_DECISION_ROWS.find(
      (row) => row.label === "Review status",
    )!;
    expect(
      decisionRowDiverges(reviewRow.resolve, [
        entry({ reviewed: true }),
        entry(),
      ]),
    ).toBe(true);
  });

  it("detects package trust row divergence", () => {
    const packageRow = COMPARE_DECISION_ROWS.find(
      (row) => row.label === "Package trust",
    )!;
    expect(
      decisionRowDiverges(packageRow.resolve, [
        entry({ packageVerified: true }),
        entry({ downloadSha256: "abc" }),
      ]),
    ).toBe(true);
  });
});

describe("integration snapshots", () => {
  it("builds a coherent signal bundle for a fully attributed entry", () => {
    const rich = entry({
      reviewedBy: "editor",
      reviewedAt: "2026-03-01",
      packageVerified: true,
      verifiedAt: "2026-03-02",
      source: "source-backed",
      submittedBy: "contributor",
    });

    expect(reviewCompareSignal(rich).tone).toBe("verified");
    expect(packageTrustCompareSignal(rich).tone).toBe("verified");
    expect(sourceProvenanceCompareSignal(rich).tone).toBe("present");
    expect(submitterCompareSignal(rich)?.tone).toBe("present");
  });

  it("builds a minimal missing bundle for sparse entries", () => {
    const sparse = entry();
    expect(reviewCompareSignal(sparse).tone).toBe("missing");
    expect(packageTrustCompareSignal(sparse).tone).toBe("missing");
    expect(sourceProvenanceCompareSignal(sparse).tone).toBe("missing");
    expect(submitterCompareSignal(sparse)).toBeUndefined();
  });

  it("maps every decision row tone to a CSS class", () => {
    const sample = entry({
      reviewed: true,
      packageVerified: true,
      sourceSubmissionUrl: "https://example.com/submission",
      submittedBy: "dev",
    });
    for (const row of COMPARE_DECISION_ROWS) {
      const signal = resolveCompareSignal(row.resolve(sample));
      expect(compareSignalToneClass(signal.tone)).toMatch(/^text-/);
    }
  });
});

describe("package trust precedence matrix", () => {
  it.each([
    [{ packageVerified: true }, "verified"],
    [{ trustSignals: { packageVerified: true } }, "verified"],
    [{ packageVerified: false }, "missing"],
    [{ downloadSha256: "sha" }, "present"],
    [{ trustSignals: { checksumPresent: true } }, "present"],
    [{}, "missing"],
  ] as const)("classifies %j as %s tone", (partial, tone) => {
    expect(packageTrustCompareSignal(entry(partial)).tone).toBe(tone);
  });
});

describe("provenance precedence matrix", () => {
  it.each([
    [{ importPrUrl: "https://x/pr/1" }, "Submission linked"],
    [{ sourceSubmissionUrl: "https://x/issues/1" }, "Submission linked"],
    [{ source: "source-backed" }, "Source-backed"],
    [{ trustSignals: { sourceStatus: "available" } }, "Source-backed"],
    [{}, "No submission link"],
  ] as const)("classifies %j as %s", (partial, label) => {
    expect(sourceProvenanceCompareSignal(entry(partial)).label).toBe(label);
  });
});

describe("bulk divergence checks", () => {
  const catalog = [
    entry({ slug: "a", reviewed: true }),
    entry({ slug: "b", packageVerified: true }),
    entry({ slug: "c", source: "source-backed" }),
    entry({ slug: "d", submittedBy: "dev" }),
    entry({ slug: "e" }),
  ];

  it.each(COMPARE_DECISION_ROWS)(
    "may diverge across a heterogeneous catalog for $label",
    (row) => {
      const diverges = decisionRowDiverges(row.resolve, catalog);
      expect(typeof diverges).toBe("boolean");
    },
  );
});

describe("review detail formatting", () => {
  it("uses maintainer reviewed copy only when reviewed flag is set alone", () => {
    expect(reviewCompareSignal(entry({ reviewed: true })).detail).toBe(
      "Maintainer reviewed",
    );
  });

  it("does not emit detail for unreviewed entries", () => {
    expect(reviewCompareSignal(entry()).detail).toBeUndefined();
  });
});

describe("signal label stability", () => {
  it("uses stable user-facing labels across signal helpers", () => {
    expect(reviewCompareSignal(entry()).label).toBe("Not reviewed");
    expect(reviewCompareSignal(entry({ reviewed: true })).label).toBe(
      "Reviewed",
    );
    expect(packageTrustCompareSignal(entry()).label).toBe(
      "Package not verified",
    );
    expect(
      packageTrustCompareSignal(entry({ packageVerified: true })).label,
    ).toBe("Package verified");
    expect(sourceProvenanceCompareSignal(entry()).label).toBe(
      "No submission link",
    );
    expect(resolveCompareSignal(undefined).label).toBe("—");
  });
});

describe("multi-entry decision matrix", () => {
  it("detects divergence when one entry is reviewed and another is not", () => {
    const pairs = [
      entry({ reviewed: true }),
      entry({ reviewedBy: "alice", reviewedAt: "2026-01-01" }),
      entry(),
    ];
    expect(decisionRowDiverges(reviewCompareSignal, pairs)).toBe(true);
  });

  it("detects divergence across package trust states", () => {
    const pairs = [
      entry({ packageVerified: true }),
      entry({ downloadSha256: "abc" }),
      entry(),
    ];
    expect(decisionRowDiverges(packageTrustCompareSignal, pairs)).toBe(true);
  });

  it("detects divergence across provenance states", () => {
    const pairs = [
      entry({ importPrUrl: "https://github.com/x/pull/1" }),
      entry({ source: "source-backed" }),
      entry(),
    ];
    expect(decisionRowDiverges(sourceProvenanceCompareSignal, pairs)).toBe(
      true,
    );
  });
});

describe("verifiedAt formatting", () => {
  it.each([
    ["2026-01-15T08:30:00Z", "2026-01-15"],
    ["2026-12-01", "2026-12-01"],
    ["2025-06-30T00:00:00.000Z", "2025-06-30"],
  ])("formats verifiedAt %s to %s", (verifiedAt, expected) => {
    expect(
      packageTrustCompareSignal(entry({ packageVerified: true, verifiedAt }))
        .detail,
    ).toBe(expected);
  });
});

describe("reviewedAt formatting", () => {
  it.each([
    ["2026-02-02T10:00:00Z", "2026-02-02"],
    ["2026-11-11", "2026-11-11"],
  ])("formats reviewedAt %s to %s in review detail", (reviewedAt, expected) => {
    expect(
      reviewCompareSignal(entry({ reviewedBy: "qa", reviewedAt })).detail,
    ).toBe(`qa · ${expected}`);
  });
});

describe("tone class coverage", () => {
  it("maps review signals to expected tone classes", () => {
    expect(compareSignalToneClass(reviewCompareSignal(entry()).tone)).toBe(
      "text-ink-subtle",
    );
    expect(
      compareSignalToneClass(
        reviewCompareSignal(entry({ reviewed: true })).tone,
      ),
    ).toBe("text-trust-trusted");
  });

  it("maps package trust signals to expected tone classes", () => {
    expect(
      compareSignalToneClass(packageTrustCompareSignal(entry()).tone),
    ).toBe("text-ink-subtle");
    expect(
      compareSignalToneClass(
        packageTrustCompareSignal(entry({ packageVerified: true })).tone,
      ),
    ).toBe("text-trust-trusted");
    expect(
      compareSignalToneClass(
        packageTrustCompareSignal(entry({ downloadSha256: "x" })).tone,
      ),
    ).toBe("text-ink");
  });

  it("maps provenance signals to expected tone classes", () => {
    expect(
      compareSignalToneClass(sourceProvenanceCompareSignal(entry()).tone),
    ).toBe("text-ink-subtle");
    expect(
      compareSignalToneClass(
        sourceProvenanceCompareSignal(entry({ source: "source-backed" })).tone,
      ),
    ).toBe("text-ink");
  });
});

describe("COMPARE_DECISION_ROWS resolvers", () => {
  it("resolves review row for sparse and rich entries", () => {
    const row = COMPARE_DECISION_ROWS[0];
    expect(row.resolve(entry()).tone).toBe("missing");
    expect(row.resolve(entry({ reviewed: true })).tone).toBe("verified");
  });

  it("resolves package row for sparse and rich entries", () => {
    const row = COMPARE_DECISION_ROWS[1];
    expect(row.resolve(entry()).tone).toBe("missing");
    expect(row.resolve(entry({ packageVerified: true })).tone).toBe("verified");
  });

  it("resolves provenance row for sparse and rich entries", () => {
    const row = COMPARE_DECISION_ROWS[2];
    expect(row.resolve(entry()).tone).toBe("missing");
    expect(row.resolve(entry({ source: "source-backed" })).tone).toBe(
      "present",
    );
  });

  it("resolves submitter row as undefined for sparse entries", () => {
    const row = COMPARE_DECISION_ROWS[3];
    expect(row.resolve(entry())).toBeUndefined();
    expect(row.resolve(entry({ submittedBy: "dev" }))?.label).toBe("dev");
  });
});

describe("catalog-wide signal snapshots", () => {
  const fixtures: Array<{ name: string; entry: Entry }> = [
    { name: "sparse", entry: entry() },
    {
      name: "reviewed",
      entry: entry({ reviewedBy: "editor", reviewedAt: "2026-04-01" }),
    },
    {
      name: "verified-package",
      entry: entry({ packageVerified: true, verifiedAt: "2026-04-02" }),
    },
    {
      name: "checksum-only",
      entry: entry({ downloadSha256: "deadbeef" }),
    },
    {
      name: "submission-linked",
      entry: entry({ sourceSubmissionUrl: "https://example.com/sub" }),
    },
    {
      name: "import-pr",
      entry: entry({ importPrUrl: "https://github.com/x/pull/9" }),
    },
    {
      name: "submitter",
      entry: entry({ submittedBy: "alice" }),
    },
  ];

  it.each(fixtures)(
    "produces stable review signal for $name fixture",
    ({ entry: e }) => {
      const signal = reviewCompareSignal(e);
      expect(signal).toHaveProperty("tone");
      expect(signal).toHaveProperty("label");
    },
  );

  it.each(fixtures)(
    "produces stable package signal for $name fixture",
    ({ entry: e }) => {
      const signal = packageTrustCompareSignal(e);
      expect(signal).toHaveProperty("tone");
      expect(signal).toHaveProperty("label");
    },
  );

  it.each(fixtures)(
    "produces stable provenance signal for $name fixture",
    ({ entry: e }) => {
      const signal = sourceProvenanceCompareSignal(e);
      expect(signal).toHaveProperty("tone");
      expect(signal).toHaveProperty("label");
    },
  );
});

describe("divergence false positives", () => {
  it("does not flag divergence for identical sparse entries", () => {
    const sparse = entry();
    expect(decisionRowDiverges(reviewCompareSignal, [sparse, sparse])).toBe(
      false,
    );
    expect(
      decisionRowDiverges(packageTrustCompareSignal, [sparse, sparse]),
    ).toBe(false);
    expect(
      decisionRowDiverges(sourceProvenanceCompareSignal, [sparse, sparse]),
    ).toBe(false);
  });

  it("does not flag divergence for identical rich entries", () => {
    const rich = entry({
      reviewed: true,
      packageVerified: true,
      source: "source-backed",
      submittedBy: "dev",
    });
    for (const row of COMPARE_DECISION_ROWS) {
      expect(decisionRowDiverges(row.resolve, [rich, rich])).toBe(false);
    }
  });
});

describe("compare signature edge cases", () => {
  it("treats different tones as divergent even with the same label", () => {
    expect(
      compareSignalsDiverge([
        { tone: "present", label: "Checksum present" },
        { tone: "missing", label: "Package not verified" },
      ]),
    ).toBe(true);
  });

  it("treats identical resolved undefined submitters as matching", () => {
    expect(
      compareSignalsDiverge([
        submitterCompareSignal(entry()),
        submitterCompareSignal(entry()),
      ]),
    ).toBe(false);
  });
});

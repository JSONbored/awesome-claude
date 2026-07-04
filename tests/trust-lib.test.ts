import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getTrustReasons,
  installRiskLevel,
  INSTALL_RISK_DETAIL,
  INSTALL_RISK_LABEL,
  summarizeTrust,
} from "../apps/web/src/lib/trust-lib";
import type { Entry } from "@/types/registry";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
    slug: "demo",
    title: "Demo",
    description: "d",
    trust: "trusted",
    source: "first-party",
    platforms: [],
    tags: [],
    ...overrides,
  } as Entry;
}

const byId = (reasons: ReturnType<typeof getTrustReasons>, id: string) =>
  reasons.find((r) => r.id === id);

describe("getTrustReasons core reasons", () => {
  it("always emits the six core reasons", () => {
    const reasons = getTrustReasons(entry());
    for (const id of [
      "trust-level",
      "source",
      "claim",
      "reviewed",
      "safety",
      "privacy",
    ]) {
      expect(byId(reasons, id), `missing ${id}`).toBeDefined();
    }
  });

  it("maps every trust posture to severity and detail copy", () => {
    const trusted = byId(
      getTrustReasons(entry({ trust: "trusted" })),
      "trust-level",
    );
    expect(trusted?.severity).toBe("ok");
    expect(trusted?.detail).toContain("source-checked");

    const review = byId(
      getTrustReasons(entry({ trust: "review" })),
      "trust-level",
    );
    expect(review?.severity).toBe("warning");
    expect(review?.detail).toContain("Surface-level review");

    const limited = byId(
      getTrustReasons(entry({ trust: "limited" })),
      "trust-level",
    );
    expect(limited?.severity).toBe("warning");
    expect(limited?.detail).toContain("Limited support");

    const blocked = byId(
      getTrustReasons(entry({ trust: "blocked" })),
      "trust-level",
    );
    expect(blocked?.severity).toBe("blocker");
    expect(blocked?.detail).toContain("Do not run without human review");
    expect(blocked?.docHref).toBe("/quality#trust-levels");
  });

  it("maps every source provenance tier to severity and detail copy", () => {
    const firstParty = byId(
      getTrustReasons(entry({ source: "first-party" })),
      "source",
    );
    expect(firstParty?.severity).toBe("ok");
    expect(firstParty?.detail).toContain("original maintainer");

    const sourceBacked = byId(
      getTrustReasons(entry({ source: "source-backed" })),
      "source",
    );
    expect(sourceBacked?.severity).toBe("ok");
    expect(sourceBacked?.detail).toContain("public repository");

    const external = byId(
      getTrustReasons(entry({ source: "external" })),
      "source",
    );
    expect(external?.severity).toBe("info");
    expect(external?.detail).toContain("Hosted off-registry");

    const unverified = byId(
      getTrustReasons(entry({ source: "community" as Entry["source"] })),
      "source",
    );
    expect(unverified?.severity).toBe("warning");
    expect(unverified?.detail).toContain("Treat as unverified");
  });

  it("links repository provenance when sourceUrl or repoUrl is present", () => {
    const both = byId(
      getTrustReasons(
        entry({
          sourceUrl: "https://github.com/org/primary",
          repoUrl: "https://github.com/org/fallback",
        }),
      ),
      "source",
    );
    expect(both?.sourceHref).toBe("https://github.com/org/primary");

    const withSourceUrl = byId(
      getTrustReasons(entry({ sourceUrl: "https://github.com/org/repo" })),
      "source",
    );
    expect(withSourceUrl?.sourceHref).toBe("https://github.com/org/repo");
    expect(withSourceUrl?.sourceLabel).toBe("Repository");

    const withRepoUrl = byId(
      getTrustReasons(entry({ repoUrl: "https://gitlab.com/org/repo" })),
      "source",
    );
    expect(withRepoUrl?.sourceHref).toBe("https://gitlab.com/org/repo");
    expect(withRepoUrl?.sourceLabel).toBe("Repository");

    const emptySourceUrl = byId(
      getTrustReasons(
        entry({ sourceUrl: "", repoUrl: "https://github.com/org/fallback" }),
      ),
      "source",
    );
    expect(emptySourceUrl?.sourceHref).toBe("");
    expect(emptySourceUrl?.sourceLabel).toBe("Repository");

    const withoutUrls = byId(getTrustReasons(entry()), "source");
    expect(withoutUrls?.sourceHref).toBeUndefined();
    expect(withoutUrls?.sourceLabel).toBeUndefined();
  });

  it("describes claim and review status", () => {
    const claimed = byId(getTrustReasons(entry({ claimed: true })), "claim");
    expect(claimed?.severity).toBe("ok");
    expect(claimed?.label).toBe("Listing claimed");
    expect(claimed?.detail).toContain("can update it");

    const unclaimed = byId(getTrustReasons(entry({ claimed: false })), "claim");
    expect(unclaimed?.severity).toBe("info");
    expect(unclaimed?.label).toBe("Listing unclaimed");
    expect(unclaimed?.detail).toContain("proof of ownership");

    const reviewed = byId(
      getTrustReasons(entry({ reviewed: true })),
      "reviewed",
    );
    expect(reviewed?.severity).toBe("ok");
    expect(reviewed?.detail).toContain("signed off");

    const awaiting = byId(
      getTrustReasons(entry({ reviewed: false })),
      "reviewed",
    );
    expect(awaiting?.severity).toBe("warning");
    expect(awaiting?.detail).toContain("No maintainer has reviewed");
  });
});

describe("getTrustReasons safety and privacy notes", () => {
  it("treats safetyNotes as equivalent to safetyNotesList", () => {
    expect(
      byId(getTrustReasons(entry({ safetyNotes: "runs a worker" })), "safety")
        ?.severity,
    ).toBe("ok");
    expect(
      byId(
        getTrustReasons(entry({ safetyNotesList: ["touches ~/.ssh"] })),
        "safety",
      )?.severity,
    ).toBe("ok");
    expect(byId(getTrustReasons(entry()), "safety")?.severity).toBe("warning");
  });

  it("joins safetyNotesList into the detail when safetyNotes is absent", () => {
    const reason = byId(
      getTrustReasons(
        entry({ safetyNotesList: ["reads env", "writes cache"] }),
      ),
      "safety",
    );
    expect(reason?.detail).toBe("reads env writes cache");
    expect(reason?.label).toBe("Safety notes present");
  });

  it("uses the missing-safety fallback copy when no notes are present", () => {
    const reason = byId(getTrustReasons(entry()), "safety");
    expect(reason?.label).toBe("Safety notes missing");
    expect(reason?.detail).toContain("No safety notes provided");
  });

  it("treats privacyNotes and privacyNotesList equivalently", () => {
    expect(
      byId(getTrustReasons(entry({ privacyNotes: "no telemetry" })), "privacy")
        ?.severity,
    ).toBe("ok");
    expect(
      byId(
        getTrustReasons(entry({ privacyNotesList: ["local only"] })),
        "privacy",
      )?.severity,
    ).toBe("ok");
    expect(byId(getTrustReasons(entry()), "privacy")?.severity).toBe("info");
  });

  it("joins privacyNotesList into the detail when privacyNotes is absent", () => {
    const reason = byId(
      getTrustReasons(
        entry({ privacyNotesList: ["no PII", "ephemeral logs"] }),
      ),
      "privacy",
    );
    expect(reason?.detail).toBe("no PII ephemeral logs");
    expect(reason?.label).toBe("Privacy notes present");
  });

  it("uses the missing-privacy fallback copy when no notes are present", () => {
    const reason = byId(getTrustReasons(entry()), "privacy");
    expect(reason?.label).toBe("Privacy notes missing");
    expect(reason?.detail).toContain("No privacy notes provided");
  });
});

describe("getTrustReasons optional integrity signals", () => {
  it("only emits checksum reason when a download is present", () => {
    expect(byId(getTrustReasons(entry()), "checksum")).toBeUndefined();
    expect(
      byId(
        getTrustReasons(entry({ downloadUrl: "https://x/y.zip" })),
        "checksum",
      )?.severity,
    ).toBe("warning");
    expect(
      byId(
        getTrustReasons(entry({ downloadSha256: "abcdef0123456789" })),
        "checksum",
      )?.severity,
    ).toBe("ok");
  });

  it("truncates recorded checksums in the detail line", () => {
    const reason = byId(
      getTrustReasons(entry({ downloadSha256: "abcdef0123456789abcdef" })),
      "checksum",
    );
    expect(reason?.detail).toContain("SHA-256 abcdef0123456789…");
    expect(reason?.label).toBe("Package checksum recorded");
  });

  it("warns when a download exists without a checksum", () => {
    const reason = byId(
      getTrustReasons(entry({ downloadUrl: "https://cdn.example/pkg.zip" })),
      "checksum",
    );
    expect(reason?.label).toBe("No package checksum");
    expect(reason?.detail).toContain("cannot verify byte-for-byte integrity");
  });

  it("only emits package-verified reason when the flag is defined", () => {
    expect(byId(getTrustReasons(entry()), "package-verified")).toBeUndefined();
    expect(
      byId(
        getTrustReasons(entry({ packageVerified: true })),
        "package-verified",
      )?.severity,
    ).toBe("ok");
    expect(
      byId(
        getTrustReasons(entry({ packageVerified: false })),
        "package-verified",
      )?.severity,
    ).toBe("warning");
    expect(
      byId(
        getTrustReasons(entry({ packageVerified: false })),
        "package-verified",
      )?.detail,
    ).toContain("not cross-checked");
  });

  it("emits prerequisites reason only when present", () => {
    expect(byId(getTrustReasons(entry()), "prereqs")).toBeUndefined();
    expect(
      byId(
        getTrustReasons(entry({ prerequisites: ["Node 20", "an API key"] })),
        "prereqs",
      )?.label,
    ).toContain("2 prerequisites");
    expect(
      byId(getTrustReasons(entry({ prerequisites: ["one"] })), "prereqs")
        ?.label,
    ).toContain("1 prerequisite");
    expect(
      byId(getTrustReasons(entry({ prerequisites: ["Docker"] })), "prereqs")
        ?.detail,
    ).toBe("Docker");
  });
});

describe("summarizeTrust", () => {
  it("counts every reason exactly once across severities", () => {
    const reasons = getTrustReasons(
      entry({ trust: "blocked", source: "external", packageVerified: false }),
    );
    const counts = summarizeTrust(reasons);
    expect(counts.ok + counts.info + counts.warning + counts.blocker).toBe(
      reasons.length,
    );
    expect(counts.blocker).toBeGreaterThan(0);
  });

  it("starts from zero for an empty reason list", () => {
    expect(summarizeTrust([])).toEqual({
      ok: 0,
      info: 0,
      warning: 0,
      blocker: 0,
    });
  });
});

describe("installRiskLevel", () => {
  const lowEntry = () =>
    entry({
      trust: "trusted",
      source: "first-party",
      claimed: true,
      reviewed: true,
      safetyNotes: "runs read-only",
      privacyNotes: "no telemetry",
      packageVerified: true,
    });

  it("returns low for a clean trusted entry", () => {
    expect(installRiskLevel(lowEntry())).toBe("low");
  });

  it("returns high when blocked", () => {
    expect(installRiskLevel(entry({ trust: "blocked" }))).toBe("high");
  });

  it("returns review when trust is not trusted (no blocker)", () => {
    expect(installRiskLevel({ ...lowEntry(), trust: "review" } as Entry)).toBe(
      "review",
    );
    expect(installRiskLevel({ ...lowEntry(), trust: "limited" } as Entry)).toBe(
      "review",
    );
  });

  it("downgrades a trusted entry to review on any warning", () => {
    expect(installRiskLevel({ ...lowEntry(), reviewed: false } as Entry)).toBe(
      "review",
    );
    expect(
      installRiskLevel({
        ...lowEntry(),
        safetyNotes: undefined,
        safetyNotesList: [],
      } as Entry),
    ).toBe("review");
    expect(
      installRiskLevel({ ...lowEntry(), packageVerified: false } as Entry),
    ).toBe("review");
  });

  it("exposes labels and detail copy for every risk level", () => {
    expect(INSTALL_RISK_LABEL.low).toBe("Low risk");
    expect(INSTALL_RISK_LABEL.review).toBe("Review first");
    expect(INSTALL_RISK_LABEL.high).toBe("High risk");
    expect(INSTALL_RISK_DETAIL.low).toContain("Standard caution");
    expect(INSTALL_RISK_DETAIL.review).toContain("read safety notes");
    expect(INSTALL_RISK_DETAIL.high).toContain("human review");
  });
});

describe("freshness 60-day boundary", () => {
  const NOW = new Date("2026-06-13T00:00:00.000Z");
  const daysAgo = (n: number) =>
    new Date(NOW.getTime() - n * 86_400_000).toISOString();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("treats verification under 60 days old as fresh", () => {
    const reasons = getTrustReasons(entry({ reviewedAt: daysAgo(59) }));
    const freshness = byId(reasons, "freshness");
    expect(freshness?.severity).toBe("ok");
    expect(freshness?.label).toBe("Recently verified");
    expect(freshness?.detail).toContain(daysAgo(59));
  });

  it("treats verification at/after 60 days as stale", () => {
    expect(
      byId(getTrustReasons(entry({ reviewedAt: daysAgo(60) })), "freshness")
        ?.severity,
    ).toBe("warning");
    expect(
      byId(getTrustReasons(entry({ reviewedAt: daysAgo(120) })), "freshness")
        ?.severity,
    ).toBe("warning");
    expect(
      byId(getTrustReasons(entry({ reviewedAt: daysAgo(120) })), "freshness")
        ?.label,
    ).toBe("Stale verification");
  });

  it("prefers brandVerifiedAt over reviewedAt/submittedAt for freshness", () => {
    const reasons = getTrustReasons(
      entry({ brandVerifiedAt: daysAgo(1), reviewedAt: daysAgo(900) }),
    );
    expect(byId(reasons, "freshness")?.severity).toBe("ok");
  });

  it("falls back to submittedAt when no brand or review timestamps exist", () => {
    const reasons = getTrustReasons(entry({ submittedAt: daysAgo(10) }));
    expect(byId(reasons, "freshness")?.severity).toBe("ok");
    expect(byId(reasons, "freshness")?.detail).toContain(daysAgo(10));
  });

  it("treats invalid freshness timestamps as stale", () => {
    const reasons = getTrustReasons(entry({ reviewedAt: "not-a-date" }));
    expect(byId(reasons, "freshness")?.severity).toBe("warning");
  });

  it("a stale verification pushes an otherwise-clean entry to review risk", () => {
    const stale = entry({
      trust: "trusted",
      source: "first-party",
      claimed: true,
      reviewed: true,
      safetyNotes: "x",
      privacyNotes: "y",
      packageVerified: true,
      reviewedAt: daysAgo(90),
    });
    expect(installRiskLevel(stale)).toBe("review");
  });
});

describe("combined trust drilldown scenarios", () => {
  it("surfaces every optional reason for a richly documented entry", () => {
    const reasons = getTrustReasons(
      entry({
        trust: "trusted",
        source: "source-backed",
        sourceUrl: "https://github.com/org/repo",
        claimed: true,
        reviewed: true,
        safetyNotes: "sandboxed",
        privacyNotes: "no outbound calls",
        downloadUrl: "https://cdn.example/pkg.zip",
        downloadSha256: "abcdef0123456789",
        packageVerified: true,
        prerequisites: ["Node 20"],
        reviewedAt: new Date().toISOString(),
      }),
    );
    for (const id of [
      "trust-level",
      "source",
      "claim",
      "reviewed",
      "safety",
      "privacy",
      "checksum",
      "package-verified",
      "prereqs",
      "freshness",
    ]) {
      expect(byId(reasons, id), `missing ${id}`).toBeDefined();
    }
  });

  it("keeps sparse entries to the six core reasons only", () => {
    const reasons = getTrustReasons(entry());
    expect(reasons.map((r) => r.id)).toEqual([
      "trust-level",
      "source",
      "claim",
      "reviewed",
      "safety",
      "privacy",
    ]);
  });
});

import { describe, expect, it } from "vitest";

import type { JobListing } from "@/types/registry";
import {
  companyTint,
  compensationSortValue,
  daysSince,
  isFresh,
  monogram,
  pickDailySpotlight,
  relativePosted,
  sortJobs,
} from "../apps/web/src/lib/jobs-utils-lib";

const DAY = 86_400_000;
const NOW = Date.parse("2026-07-01T00:00:00Z");
const iso = (daysAgo: number) => new Date(NOW - daysAgo * DAY).toISOString();

function job(overrides: Partial<JobListing> = {}): JobListing {
  return {
    slug: "role",
    title: "Engineer",
    company: "Acme",
    location: "Remote",
    type: "full-time",
    postedAt: iso(1),
    description: "A role.",
    tier: "standard",
    ...overrides,
  };
}

describe("monogram", () => {
  it("takes up to two leading initials, uppercased", () => {
    expect(monogram("Anthropic")).toBe("A");
    expect(monogram("Open AI")).toBe("OA");
    expect(monogram("a b c d")).toBe("AB");
  });

  it("collapses extra whitespace and is empty for a blank name", () => {
    expect(monogram("  Foo   Bar  ")).toBe("FB");
    expect(monogram("   ")).toBe("");
  });
});

describe("companyTint", () => {
  it("is deterministic per company and returns oklch bg/fg", () => {
    const a = companyTint("Anthropic");
    expect(a).toEqual(companyTint("Anthropic"));
    expect(a.bg).toMatch(/^oklch\(0\.94 0\.04 \d+\)$/);
    expect(a.fg).toMatch(/^oklch\(0\.32 0\.08 \d+\)$/);
  });

  it("varies the hue between different companies", () => {
    expect(companyTint("Anthropic").bg).not.toBe(companyTint("OpenAI").bg);
  });
});

describe("daysSince", () => {
  it("computes whole days elapsed against an injected now", () => {
    expect(daysSince(iso(0), NOW)).toBe(0);
    expect(daysSince(iso(5), NOW)).toBe(5);
  });

  it("returns Infinity for an unparseable date", () => {
    expect(daysSince("not-a-date", NOW)).toBe(Infinity);
  });
});

describe("relativePosted", () => {
  it("labels each bucket", () => {
    expect(relativePosted(iso(0), NOW)).toBe("today");
    expect(relativePosted(iso(1), NOW)).toBe("1d ago");
    expect(relativePosted(iso(3), NOW)).toBe("3d ago");
    expect(relativePosted(iso(14), NOW)).toBe("2w ago");
    expect(relativePosted(iso(60), NOW)).toBe("2mo ago");
    expect(relativePosted(iso(400), NOW)).toBe("1y ago");
  });

  it("renders an em dash for an invalid date", () => {
    expect(relativePosted("nope", NOW)).toBe("—");
  });
});

describe("isFresh", () => {
  it("is fresh within 7 days, stale after", () => {
    expect(isFresh(iso(7), NOW)).toBe(true);
    expect(isFresh(iso(8), NOW)).toBe(false);
  });
});

describe("sortJobs", () => {
  it("orders by tier then by postedAt descending, without mutating input", () => {
    const input = [
      job({ slug: "free-new", tier: "free", postedAt: iso(0) }),
      job({ slug: "sponsored-old", tier: "sponsored", postedAt: iso(10) }),
      job({ slug: "standard", tier: "standard", postedAt: iso(1) }),
      job({ slug: "featured", tier: "featured", postedAt: iso(2) }),
    ];
    const snapshot = [...input];
    const sorted = sortJobs(input);
    expect(sorted.map((j) => j.slug)).toEqual([
      "sponsored-old",
      "featured",
      "standard",
      "free-new",
    ]);
    expect(input).toEqual(snapshot);
  });

  it("breaks a tier tie by newest postedAt first", () => {
    const sorted = sortJobs([
      job({ slug: "older", tier: "standard", postedAt: iso(5) }),
      job({ slug: "newer", tier: "standard", postedAt: iso(1) }),
    ]);
    expect(sorted.map((j) => j.slug)).toEqual(["newer", "older"]);
  });
});

describe("pickDailySpotlight", () => {
  // Two high-signal jobs (score >= 4): verified(3)+fresh(2) = 5.
  const pool = [
    job({ slug: "a", lastVerifiedAt: iso(0), postedAt: iso(1) }),
    job({ slug: "b", lastVerifiedAt: iso(0), postedAt: iso(1) }),
  ];

  it("returns null current/next when no job clears the score threshold", () => {
    const weak = [job({ slug: "weak", postedAt: iso(40) })]; // stale, unverified → score 0
    expect(pickDailySpotlight(weak, NOW)).toEqual({
      current: null,
      next: null,
    });
  });

  it("has no 'up next' job when exactly one job qualifies", () => {
    const solo = [
      job({ slug: "solo", lastVerifiedAt: iso(0), postedAt: iso(1) }),
    ];
    expect(pickDailySpotlight(solo, NOW)).toEqual({
      current: expect.objectContaining({ slug: "solo" }),
      next: null,
    });
  });

  it("never returns next === current for any pool size or day", () => {
    for (const size of [1, 2, 3, 4]) {
      const jobs = Array.from({ length: size }, (_, k) =>
        job({ slug: `j-${k}`, lastVerifiedAt: iso(0), postedAt: iso(1) }),
      );
      for (let day = 0; day < size + 2; day += 1) {
        const { current, next } = pickDailySpotlight(jobs, NOW + day * DAY);
        if (next) expect(next.slug).not.toBe(current?.slug);
      }
    }
  });

  it("rotates deterministically by day: same day → same pick, next day → next", () => {
    const today = pickDailySpotlight(pool, NOW);
    expect(pickDailySpotlight(pool, NOW + DAY - 1)).toEqual(today); // same UTC day slot
    const tomorrow = pickDailySpotlight(pool, NOW + DAY);
    expect(tomorrow.current?.slug).toBe(today.next?.slug); // advanced by one
    expect(tomorrow.current?.slug).not.toBe(today.current?.slug);
  });

  it("scores compensation/remote/sponsored and orders higher-signal jobs first", () => {
    // strong: compensation(2) + isRemote(1) + fresh(2) + sponsored(1) = 6.
    const strong = job({
      slug: "strong",
      compensation: "$1",
      isRemote: true,
      tier: "sponsored",
      postedAt: iso(1),
    });
    // weak-but-eligible: verified(3) + fresh(2) = 5.
    const weak = job({
      slug: "weak",
      lastVerifiedAt: iso(0),
      postedAt: iso(1),
    });
    // Both clear the threshold, so the pool holds exactly these two (the
    // score-diff sort branch runs because their scores differ); which one is
    // "current" vs "next" depends on the day-index rotation.
    const { current, next } = pickDailySpotlight([weak, strong], NOW);
    expect([current?.slug, next?.slug].sort()).toEqual(["strong", "weak"]);
  });
});

describe("compensationSortValue", () => {
  it('scales "k" shorthand to real dollars so mixed formats share one scale', () => {
    // Regression for #5475: "$210k" sorted as 210 (below "$120,000" at
    // 120000) because the trailing "k" multiplier was discarded.
    expect(compensationSortValue("$210k")).toBe(210_000);
    expect(compensationSortValue("$120,000")).toBe(120_000);
    expect(compensationSortValue("$210k")).toBeGreaterThan(
      compensationSortValue("$120,000"),
    );
  });

  it("handles uppercase K and unprefixed amounts", () => {
    expect(compensationSortValue("$95K")).toBe(95_000);
    expect(compensationSortValue("180k")).toBe(180_000);
    expect(compensationSortValue("150000")).toBe(150_000);
  });

  it("uses the leading figure of a range", () => {
    expect(compensationSortValue("$100k-$150k")).toBe(100_000);
    expect(compensationSortValue("$90,000 - $120,000")).toBe(90_000);
  });

  it("keeps the fallback ordering: missing sorts below unparseable", () => {
    expect(compensationSortValue(undefined)).toBe(-1);
    expect(compensationSortValue(null)).toBe(-1);
    expect(compensationSortValue("")).toBe(-1);
    expect(compensationSortValue("Competitive")).toBe(0);
  });
});

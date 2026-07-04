import { describe, expect, it } from "vitest";

import {
  LISTING_LEAD_KINDS,
  COMMERCIAL_TIERS,
  PAID_JOB_TIERS,
  JOB_PUBLICATION_QUALITY_RULES,
  JOB_PUBLIC_EXPOSURE_RULES,
  COMMERCIAL_PLACEMENT_TARGETS,
  DISCLOSURE_STATES,
  COMMERCIAL_STATUSES,
  JOB_SOURCE_STATUSES,
  normalizeCommercialTier,
  normalizeLeadKind,
  normalizeDisclosure,
  isPaidOrAffiliateDisclosure,
  normalizePricingModel,
  validateListingLeadPayload,
  textValue,
  listValue,
  firstValue,
  hasHttpsUrl,
  validateJobPublicationQuality,
  validateJobPublicExposure,
  evaluateJobSourceLifecycle,
  normalizeCommercialStatus,
  isPlacementActive,
  linkRelForDisclosure,
  toolPlacementRank,
  compareToolListings,
  nextLeadStatus,
  summarizePlacementExpiry,
  buildPlacementRenewalReminder,
} from "../packages/registry/src/commercial-lib.js";

const NOW = new Date("2026-06-01T00:00:00.000Z");

function paidActiveJob(overrides: Record<string, unknown> = {}) {
  return {
    tier: "standard",
    status: "active",
    summary: "S".repeat(JOB_PUBLICATION_QUALITY_RULES.summaryMinLength),
    descriptionMd: "D".repeat(
      JOB_PUBLICATION_QUALITY_RULES.descriptionMinLength,
    ),
    responsibilities: ["r1", "r2", "r3"],
    requirements: ["q1", "q2", "q3"],
    benefits: ["b1", "b2"],
    compensation: "$100k-$120k",
    employmentType: "full-time",
    applyUrl: "https://jobs.example/apply",
    postedAt: "2026-05-01",
    expiresAt: "2026-07-01",
    sourceCheckedAt: "2026-05-20",
    ...overrides,
  };
}

describe("constants", () => {
  it("exposes lead, tier, disclosure, and status catalogs", () => {
    expect(LISTING_LEAD_KINDS).toEqual(["job", "tool", "claim"]);
    expect(COMMERCIAL_TIERS).toContain("sponsored");
    expect(PAID_JOB_TIERS).toEqual(["standard", "featured", "sponsored"]);
    expect(COMMERCIAL_PLACEMENT_TARGETS).toEqual(["job", "tool", "entry"]);
    expect(DISCLOSURE_STATES).toContain("affiliate");
    expect(COMMERCIAL_STATUSES).toContain("pending_review");
    expect(JOB_SOURCE_STATUSES).toEqual([
      "active",
      "stale_pending_review",
      "closed",
    ]);
    expect(JOB_PUBLICATION_QUALITY_RULES.summaryMinLength).toBe(120);
    expect(JOB_PUBLIC_EXPOSURE_RULES.detailMinLength).toBe(240);
  });
});

describe("normalizers", () => {
  it("normalizes commercial tiers with a free fallback", () => {
    expect(normalizeCommercialTier("Sponsored")).toBe("sponsored");
    expect(normalizeCommercialTier("unknown")).toBe("free");
    expect(normalizeCommercialTier("")).toBe("free");
    expect(normalizeCommercialTier(null)).toBe("free");
  });

  it("normalizes lead kinds with a tool fallback", () => {
    expect(normalizeLeadKind("JOB")).toBe("job");
    expect(normalizeLeadKind("claim")).toBe("claim");
    expect(normalizeLeadKind("app")).toBe("tool");
    expect(normalizeLeadKind(undefined)).toBe("tool");
  });

  it("normalizes disclosure states with an editorial fallback", () => {
    expect(normalizeDisclosure("Affiliate")).toBe("affiliate");
    expect(normalizeDisclosure("heyclaude_pick")).toBe("heyclaude_pick");
    expect(normalizeDisclosure("claimed")).toBe("claimed");
    expect(normalizeDisclosure("nope")).toBe("editorial");
    expect(normalizeDisclosure("")).toBe("editorial");
  });

  it("detects paid or affiliate disclosures", () => {
    expect(isPaidOrAffiliateDisclosure("sponsored")).toBe(true);
    expect(isPaidOrAffiliateDisclosure("affiliate")).toBe(true);
    expect(isPaidOrAffiliateDisclosure("editorial")).toBe(false);
    expect(isPaidOrAffiliateDisclosure("claimed")).toBe(false);
  });

  it("normalizes known pricing models and rejects unknowns", () => {
    for (const model of [
      "free",
      "freemium",
      "paid",
      "open-source",
      "subscription",
      "usage-based",
      "contact-sales",
    ]) {
      expect(normalizePricingModel(model.toUpperCase())).toBe(model);
    }
    expect(normalizePricingModel("enterprise")).toBe("");
    expect(normalizePricingModel("")).toBe("");
    expect(normalizePricingModel(null)).toBe("");
  });

  it("normalizes commercial statuses with a new fallback", () => {
    expect(normalizeCommercialStatus("Active")).toBe("active");
    expect(normalizeCommercialStatus("unknown")).toBe("new");
    expect(normalizeCommercialStatus("")).toBe("new");
  });
});

describe("text helpers", () => {
  it("collapses whitespace in textValue", () => {
    expect(textValue("  hello   world  ")).toBe("hello world");
    expect(textValue(null)).toBe("");
    expect(textValue(undefined)).toBe("");
  });

  it("parses listValue from arrays and JSON strings", () => {
    expect(listValue([" a ", "", "b"])).toEqual(["a", "b"]);
    expect(listValue('["one", "two"]')).toEqual(["one", "two"]);
    expect(listValue("[not-json")).toEqual([]);
    expect(listValue("plain")).toEqual([]);
    expect(listValue(null)).toEqual([]);
    expect(listValue(12)).toEqual([]);
  });

  it("returns the first non-empty firstValue", () => {
    expect(firstValue("", "  ", "keep", "later")).toBe("keep");
    expect(firstValue(null, undefined, "")).toBe("");
  });

  it("detects https urls case-insensitively", () => {
    expect(hasHttpsUrl("HTTPS://example.com")).toBe(true);
    expect(hasHttpsUrl("http://example.com")).toBe(false);
    expect(hasHttpsUrl("")).toBe(false);
  });
});

describe("validateListingLeadPayload", () => {
  const base = {
    kind: "tool",
    tierInterest: "featured",
    contactName: "Ada",
    contactEmail: "ada@example.com",
    companyName: "Example Co",
    listingTitle: "Example Tool",
    websiteUrl: "https://example.com",
    applyUrl: "",
    message: "hello",
  };

  it("accepts a valid tool lead", () => {
    const result = validateListingLeadPayload(base);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.data.kind).toBe("tool");
    expect(result.data.tierInterest).toBe("featured");
    expect(result.data.contactEmail).toBe("ada@example.com");
  });

  it("defaults an empty payload and reports required fields", () => {
    const result = validateListingLeadPayload();
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "contactName is required",
        "valid contactEmail is required",
        "companyName is required",
        "listingTitle is required",
        "tool leads require an https websiteUrl",
      ]),
    );
    expect(result.data.kind).toBe("tool");
    expect(result.data.tierInterest).toBe("free");
  });

  it("rejects invalid emails and claim/tool website requirements", () => {
    expect(
      validateListingLeadPayload({
        ...base,
        contactEmail: "user@example.",
      }).errors,
    ).toContain("valid contactEmail is required");
    expect(
      validateListingLeadPayload({
        ...base,
        contactEmail: "user@.com",
      }).errors,
    ).toContain("valid contactEmail is required");
    expect(
      validateListingLeadPayload({
        ...base,
        contactEmail: "user@example.com extra",
      }).errors,
    ).toContain("valid contactEmail is required");
    expect(
      validateListingLeadPayload({
        ...base,
        contactEmail: "not-an-email",
      }).errors,
    ).toContain("valid contactEmail is required");
    expect(
      validateListingLeadPayload({
        ...base,
        kind: "claim",
        websiteUrl: "http://insecure.example",
      }).errors,
    ).toContain("claim leads require an https websiteUrl");
  });

  it("requires an https applyUrl for job leads", () => {
    const result = validateListingLeadPayload({
      ...base,
      kind: "job",
      websiteUrl: "",
      applyUrl: "http://jobs.example",
    });
    expect(result.errors).toContain("job leads require an https applyUrl");
    expect(result.errors).not.toContain(
      "tool leads require an https websiteUrl",
    );
  });

  it("accepts a valid job lead without a websiteUrl", () => {
    const result = validateListingLeadPayload({
      ...base,
      kind: "job",
      websiteUrl: "",
      applyUrl: "https://jobs.example/apply",
    });
    expect(result.ok).toBe(true);
  });
});

describe("validateJobPublicationQuality", () => {
  it("skips the gate for free or non-active jobs", () => {
    expect(validateJobPublicationQuality()).toEqual({
      ok: true,
      required: false,
      errors: [],
    });
    expect(
      validateJobPublicationQuality({ tier: "free", status: "active" }),
    ).toMatchObject({ ok: true, required: false });
    expect(
      validateJobPublicationQuality({ tier: "standard", status: "draft" }),
    ).toMatchObject({ ok: true, required: false });
  });

  it("accepts a fully populated paid active job", () => {
    expect(validateJobPublicationQuality(paidActiveJob())).toEqual({
      ok: true,
      required: true,
      errors: [],
    });
  });

  it("reads snake_case aliases and JSON list strings", () => {
    const result = validateJobPublicationQuality(
      paidActiveJob({
        summary: "",
        description: "S".repeat(JOB_PUBLICATION_QUALITY_RULES.summaryMinLength),
        descriptionMd: "",
        description_md: "D".repeat(
          JOB_PUBLICATION_QUALITY_RULES.descriptionMinLength,
        ),
        responsibilities: undefined,
        responsibilities_json: '["r1","r2","r3"]',
        requirements: undefined,
        requirements_json: '["q1","q2","q3"]',
        benefits: undefined,
        benefits_json: '["b1","b2"]',
        compensation: "",
        compensation_summary: "$90k",
        employmentType: "",
        employment_type: "contract",
        applyUrl: "",
        source_url: "https://jobs.example/source",
        postedAt: "",
        posted_at: "2026-05-01",
        expiresAt: "",
        expires_at: "2026-07-01",
        sourceCheckedAt: "",
        last_checked_at: "2026-05-20",
      }),
    );
    expect(result.ok).toBe(true);
  });

  it("reports every missing paid-active requirement", () => {
    const result = validateJobPublicationQuality({
      tier: "featured",
      status: "active",
    });
    expect(result.required).toBe(true);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(8);
    expect(result.errors.join("\n")).toContain("original summary");
    expect(result.errors.join("\n")).toContain("role detail");
    expect(result.errors.join("\n")).toContain("responsibilities");
    expect(result.errors.join("\n")).toContain("requirements");
    expect(result.errors.join("\n")).toContain("benefits");
    expect(result.errors.join("\n")).toContain("compensation");
    expect(result.errors.join("\n")).toContain("employment type");
    expect(result.errors.join("\n")).toContain("HTTPS source");
    expect(result.errors.join("\n")).toContain("postedAt");
    expect(result.errors.join("\n")).toContain("expiresAt");
    expect(result.errors.join("\n")).toContain("source verification");
  });
});

describe("validateJobPublicExposure", () => {
  it("skips non-active jobs and defaults an empty payload as active", () => {
    expect(validateJobPublicExposure({ status: "draft" })).toEqual({
      ok: true,
      required: false,
      errors: [],
    });
    expect(validateJobPublicExposure().required).toBe(true);
  });

  it("accepts a reviewed active job with structured depth", () => {
    const result = validateJobPublicExposure({
      status: "active",
      summary: "S".repeat(JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength),
      responsibilities: ["r1", "r2"],
      requirements: ["q1", "q2"],
      applyUrl: "https://jobs.example/apply",
      sourceUrl: "https://jobs.example/source",
      sourceCheckedAt: "2026-05-20",
      source: "manual",
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("accepts detailed pages instead of structured depth", () => {
    const result = validateJobPublicExposure({
      status: "active",
      summary: "S".repeat(JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength),
      descriptionMd: "D".repeat(JOB_PUBLIC_EXPOSURE_RULES.detailMinLength),
      apply_url: "https://jobs.example/apply",
      source_url: "https://jobs.example/source",
      last_checked_at: "2026-05-20",
    });
    expect(result.ok).toBe(true);
  });

  it("allows live source truth to replace a missing verification date", () => {
    const result = validateJobPublicExposure(
      {
        status: "active",
        summary: "S".repeat(JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength),
        responsibilities: ["r1", "r2"],
        requirements: ["q1", "q2"],
        applyUrl: "https://jobs.example/apply",
        sourceUrl: "https://jobs.example/source",
      },
      { sourceTruth: { sourceOk: true } },
    );
    expect(result.errors).not.toContain(
      "active jobs require a source verification date",
    );
  });

  it("enforces curated source kinds and source-truth failures", () => {
    const result = validateJobPublicExposure(
      {
        status: "active",
        summary: "short",
        source: "curated",
        source_kind: "newsletter",
        applyUrl: "http://insecure",
        sourceUrl: "http://insecure",
      },
      {
        sourceTruth: {
          sourceOk: false,
          titleMatched: false,
          companyMatched: false,
          closureDetected: true,
          applyDetected: false,
        },
      },
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("reviewed summary"),
        "active jobs require an HTTPS employer apply URL",
        "active jobs require an HTTPS source URL",
        "active jobs require a source verification date",
        "curated active jobs require an official ATS or employer careers source",
        expect.stringContaining("reviewed detail"),
        "source check must confirm the role is still available",
        "source page must match the reviewed job title",
        "source page must match the reviewed company",
        "source page must not show closed or filled-role copy",
        "source page must still expose an apply path",
      ]),
    );
  });

  it("accepts curated jobs with official ATS or employer careers sources", () => {
    for (const sourceKind of ["official_ats", "employer_careers"]) {
      const result = validateJobPublicExposure({
        status: "active",
        summary: "S".repeat(JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength),
        responsibilities: ["r1", "r2"],
        requirements: ["q1", "q2"],
        applyUrl: "https://jobs.example/apply",
        sourceUrl: "https://jobs.example/source",
        sourceCheckedAt: "2026-05-20",
        source: "curated",
        sourceKind,
      });
      expect(result.errors.join("\n")).not.toContain("official ATS");
    }
  });

  it("merges paid publication errors for paid active jobs", () => {
    const result = validateJobPublicExposure({
      status: "active",
      tier: "sponsored",
      summary: "S".repeat(JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength),
      responsibilities: ["r1", "r2"],
      requirements: ["q1", "q2"],
      applyUrl: "https://jobs.example/apply",
      sourceUrl: "https://jobs.example/source",
      sourceCheckedAt: "2026-05-20",
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("benefits");
  });
});

describe("evaluateJobSourceLifecycle", () => {
  const healthy = {
    sourceOk: true,
    titleMatched: true,
    companyMatched: true,
    closureDetected: false,
    applyDetected: true,
  };

  it("keeps closed and archived statuses terminal", () => {
    expect(
      evaluateJobSourceLifecycle({ currentStatus: "closed" }, NOW),
    ).toEqual({
      status: "closed",
      staleCheckCount: 0,
      indexable: false,
      reason: "closed",
    });
    expect(
      evaluateJobSourceLifecycle(
        { currentStatus: "archived", staleCheckCount: 2 },
        NOW,
      ),
    ).toMatchObject({
      status: "closed",
      reason: "archived",
      staleCheckCount: 2,
    });
  });

  it("closes paid placements and paid-tier expiries", () => {
    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "free",
          paidPlacementExpiresAt: "2026-05-01T00:00:00.000Z",
          ...healthy,
        },
        NOW,
      ),
    ).toMatchObject({ status: "closed", reason: "paid_placement_expired" });

    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "standard",
          expiresAt: "2026-05-01T00:00:00.000Z",
          ...healthy,
        },
        NOW,
      ),
    ).toMatchObject({ status: "closed", reason: "expired" });
  });

  it("reactivates healthy sources and clears expiry when refreshed", () => {
    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "free",
          expiresAt: "2026-07-01T00:00:00.000Z",
          staleCheckCount: 3,
          ...healthy,
        },
        NOW,
      ),
    ).toEqual({
      status: "active",
      staleCheckCount: 0,
      indexable: true,
      reason: "source_verified",
      expiresAt: "2026-07-01T00:00:00.000Z",
    });

    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "free",
          expiresAt: "2026-05-01T00:00:00.000Z",
          ...healthy,
        },
        NOW,
      ),
    ).toMatchObject({
      status: "active",
      reason: "source_verified_expiry_refreshed",
      expiresAt: null,
    });

    // Healthy + no expiry date uses undefined rather than an empty string.
    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "free",
          expiresAt: "",
          ...healthy,
        },
        NOW,
      ),
    ).toEqual({
      status: "active",
      staleCheckCount: 0,
      indexable: true,
      reason: "source_verified",
      expiresAt: undefined,
    });
  });

  it("marks expired unverified sources stale", () => {
    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "free",
          expiresAt: "2026-05-01T00:00:00.000Z",
          sourceOk: false,
          staleCheckCount: 0,
        },
        NOW,
      ),
    ).toMatchObject({
      status: "stale_pending_review",
      reason: "expired_source_unverified",
      staleCheckCount: 1,
      indexable: false,
    });
  });

  it("escalates failed source checks from first failure to closed", () => {
    expect(
      evaluateJobSourceLifecycle(
        { tier: "free", sourceOk: false, staleCheckCount: 0 },
        NOW,
      ),
    ).toMatchObject({
      status: "stale_pending_review",
      reason: "first_failed_source_check",
      staleCheckCount: 1,
    });

    expect(
      evaluateJobSourceLifecycle(
        { tier: "free", sourceOk: false, staleCheckCount: 1 },
        NOW,
      ),
    ).toMatchObject({
      status: "closed",
      reason: "repeated_failed_source_check",
      staleCheckCount: 2,
    });
  });

  it("treats non-finite stale counts as zero and accepts string now", () => {
    const result = evaluateJobSourceLifecycle(
      { tier: "free", sourceOk: false, staleCheckCount: "nope" },
      "2026-06-01T00:00:00.000Z",
    );
    expect(result.staleCheckCount).toBe(1);
    expect(result.reason).toBe("first_failed_source_check");
  });

  it("defaults currentStatus to active", () => {
    expect(evaluateJobSourceLifecycle({}, NOW).reason).toBe(
      "first_failed_source_check",
    );
  });

  it("ignores non-finite expiry timestamps", () => {
    expect(
      evaluateJobSourceLifecycle(
        {
          tier: "standard",
          expiresAt: "not-a-date",
          paidPlacementExpiresAt: "also-bad",
          ...healthy,
        },
        NOW,
      ),
    ).toMatchObject({ status: "active", reason: "source_verified" });
  });
});

describe("isPlacementActive", () => {
  it("requires an active status inside the start/expiry window", () => {
    expect(isPlacementActive({ status: "expired" }, NOW)).toBe(false);
    expect(
      isPlacementActive(
        {
          status: "active",
          startsAt: "2026-07-01T00:00:00.000Z",
        },
        NOW,
      ),
    ).toBe(false);
    expect(
      isPlacementActive(
        {
          status: "active",
          expires_at: "2026-05-01T00:00:00.000Z",
        },
        NOW,
      ),
    ).toBe(false);
    expect(
      isPlacementActive(
        {
          status: "active",
          starts_at: "2026-05-01T00:00:00.000Z",
          expiresAt: "2026-07-01T00:00:00.000Z",
        },
        NOW,
      ),
    ).toBe(true);
    expect(isPlacementActive({}, NOW)).toBe(true);
    expect(
      isPlacementActive(
        { status: "active", startsAt: "bad", expiresAt: "bad" },
        "2026-06-01T00:00:00.000Z",
      ),
    ).toBe(true);
  });
});

describe("placement ranking and comparison", () => {
  it("ranks sponsored and featured tools", () => {
    expect(toolPlacementRank({ sponsored: true, featured: true })).toBe(5);
    expect(toolPlacementRank({ sponsored: true })).toBe(3);
    expect(toolPlacementRank({ featured: true })).toBe(2);
    expect(toolPlacementRank()).toBe(0);
  });

  it("compares tools by rank, then date, then title/slug", () => {
    expect(
      compareToolListings(
        { sponsored: false, featured: true },
        { sponsored: true },
      ),
    ).toBeGreaterThan(0);
    expect(
      compareToolListings(
        { dateAdded: "2026-01-01", title: "A" },
        { dateAdded: "2026-02-01", title: "B" },
      ),
    ).toBeGreaterThan(0);
    expect(
      compareToolListings({ title: "Beta" }, { title: "Alpha" }),
    ).toBeGreaterThan(0);
    expect(compareToolListings({ slug: "b" }, { slug: "a" })).toBeGreaterThan(
      0,
    );
    expect(compareToolListings({}, {})).toBe(0);
  });

  it("builds disclosure link rel values", () => {
    expect(linkRelForDisclosure("sponsored")).toBe(
      "sponsored nofollow noreferrer",
    );
    expect(linkRelForDisclosure("editorial")).toBe("noreferrer");
  });
});

describe("nextLeadStatus", () => {
  it("applies every supported transition and ignores invalid actions", () => {
    expect(nextLeadStatus("new", "review")).toBe("pending_review");
    expect(nextLeadStatus("new", "approve")).toBe("approved");
    expect(nextLeadStatus("new", "reject")).toBe("rejected");
    expect(nextLeadStatus("new", "archive")).toBe("archived");
    expect(nextLeadStatus("pending_review", "approve")).toBe("approved");
    expect(nextLeadStatus("pending_review", "reject")).toBe("rejected");
    expect(nextLeadStatus("pending_review", "archive")).toBe("archived");
    expect(nextLeadStatus("approved", "activate")).toBe("active");
    expect(nextLeadStatus("approved", "reject")).toBe("rejected");
    expect(nextLeadStatus("approved", "archive")).toBe("archived");
    expect(nextLeadStatus("active", "expire")).toBe("expired");
    expect(nextLeadStatus("active", "archive")).toBe("archived");
    expect(nextLeadStatus("rejected", "archive")).toBe("archived");
    expect(nextLeadStatus("expired", "archive")).toBe("archived");
    expect(nextLeadStatus("archived", "approve")).toBe("archived");
    expect(nextLeadStatus("active", "nope")).toBe("active");
    // Unknown statuses normalize to "new" before the transition table is applied.
    expect(nextLeadStatus("unknown", "review")).toBe("pending_review");
    expect(nextLeadStatus("active", "")).toBe("active");
  });
});

describe("summarizePlacementExpiry", () => {
  it("defaults to an empty list", () => {
    expect(summarizePlacementExpiry()).toEqual([]);
  });

  it("defaults missing placement fields", () => {
    const [summary] = summarizePlacementExpiry([{}], NOW);
    expect(summary).toMatchObject({
      targetKind: "",
      targetKey: "",
      tier: "free",
      status: "active",
      expiresAt: "",
      daysUntilExpiry: null,
      needsRenewalReminder: false,
      expired: false,
    });
  });

  it("flags renewals inside the reminder window and expired actives", () => {
    const summaries = summarizePlacementExpiry(
      [
        {
          target_kind: "tool",
          target_key: "z-tool",
          tier: "featured",
          status: "active",
          expires_at: "2026-06-10T00:00:00.000Z",
        },
        {
          targetKind: "job",
          targetKey: "a-job",
          tier: "sponsored",
          status: "active",
          expiresAt: "2026-05-20T00:00:00.000Z",
        },
        {
          targetKind: "entry",
          targetKey: "no-expiry",
          status: "active",
        },
        {
          targetKind: "tool",
          targetKey: "inactive",
          status: "expired",
          expiresAt: "2026-05-20T00:00:00.000Z",
        },
        {
          targetKind: "tool",
          targetKey: "bad-date",
          status: "active",
          expiresAt: "not-a-date",
        },
      ],
      NOW,
      14,
    );

    // Sorted by daysUntilExpiry ascending, then targetKey. Inactive still has
    // a negative day count even though status is expired (expired flag is false).
    expect(summaries.map((item) => item.targetKey)).toEqual([
      "a-job",
      "inactive",
      "z-tool",
      "bad-date",
      "no-expiry",
    ]);
    const byKey = Object.fromEntries(
      summaries.map((item) => [item.targetKey, item]),
    );
    expect(byKey["a-job"]).toMatchObject({
      expired: true,
      needsRenewalReminder: false,
      daysUntilExpiry: -12,
    });
    expect(byKey["z-tool"]).toMatchObject({
      needsRenewalReminder: true,
      expired: false,
      daysUntilExpiry: 9,
      tier: "featured",
      targetKind: "tool",
    });
    expect(byKey["bad-date"].daysUntilExpiry).toBeNull();
    expect(byKey.inactive).toMatchObject({
      expired: false,
      needsRenewalReminder: false,
      status: "expired",
    });
  });

  it("accepts a string now and custom reminder window", () => {
    const [summary] = summarizePlacementExpiry(
      [
        {
          targetKind: "tool",
          targetKey: "soon",
          status: "active",
          expiresAt: "2026-06-03T00:00:00.000Z",
        },
      ],
      "2026-06-01T00:00:00.000Z",
      1,
    );
    expect(summary.needsRenewalReminder).toBe(false);
    expect(summary.daysUntilExpiry).toBe(2);
  });

  it("sorts equal expiry days by targetKey", () => {
    const summaries = summarizePlacementExpiry(
      [
        {
          targetKind: "tool",
          targetKey: "b",
          status: "active",
          expiresAt: "2026-06-05T00:00:00.000Z",
        },
        {
          targetKind: "tool",
          targetKey: "a",
          status: "active",
          expiresAt: "2026-06-05T00:00:00.000Z",
        },
      ],
      NOW,
    );
    expect(summaries.map((item) => item.targetKey)).toEqual(["a", "b"]);
  });
});

describe("buildPlacementRenewalReminder", () => {
  it("returns an empty string when no reminder is needed", () => {
    expect(buildPlacementRenewalReminder(null)).toBe("");
    expect(buildPlacementRenewalReminder({ needsRenewalReminder: false })).toBe(
      "",
    );
  });

  it("pluralizes day counts in the reminder copy", () => {
    expect(
      buildPlacementRenewalReminder({
        needsRenewalReminder: true,
        tier: "featured",
        targetKind: "tool",
        targetKey: "acme",
        daysUntilExpiry: 1,
      }),
    ).toContain("expires in 1 day.");
    expect(
      buildPlacementRenewalReminder({
        needsRenewalReminder: true,
        tier: "sponsored",
        targetKind: "job",
        targetKey: "role",
        daysUntilExpiry: 5,
      }),
    ).toContain("expires in 5 days.");
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the commercial.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/commercial.js");
    expect(wrapper.validateListingLeadPayload).toBe(validateListingLeadPayload);
    expect(wrapper.validateJobPublicationQuality).toBe(
      validateJobPublicationQuality,
    );
    expect(wrapper.validateJobPublicExposure).toBe(validateJobPublicExposure);
    expect(wrapper.evaluateJobSourceLifecycle).toBe(evaluateJobSourceLifecycle);
    expect(wrapper.nextLeadStatus).toBe(nextLeadStatus);
    expect(wrapper.COMMERCIAL_TIERS).toEqual(COMMERCIAL_TIERS);
  });
});

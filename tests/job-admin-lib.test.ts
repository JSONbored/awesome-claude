import { describe, expect, it } from "vitest";

import type { D1DatabaseLike, D1RunResult } from "../apps/web/src/lib/db";
import {
  REQUIRED_JOB_COLUMNS,
  REQUIRED_JOBS_MIGRATION,
  JobNotFoundError,
  JobPublicationQualityError,
  checkJobsSchema,
  getJobsHealth,
  queryAdminJobBySlug,
  queryAdminJobs,
  updateAdminJobState,
  upsertAdminJob,
  type JobAdminUpsertInput,
} from "../apps/web/src/lib/job-admin-lib";
import {
  JOB_PUBLIC_EXPOSURE_RULES,
  JOB_PUBLICATION_QUALITY_RULES,
} from "@heyclaude/registry/commercial";

type QueryResult = Record<string, unknown>;

const VALID_SUMMARY =
  "Build Claude-native developer workflow infrastructure for teams shipping production AI systems, with strong ownership over integrations and product quality.";
const VALID_DESCRIPTION =
  "Own the public-facing role detail for a paid HeyClaude listing. This description explains the team context, product surface, AI workflow responsibilities, developer tooling expectations, source verification, and why the role matters to the Claude and MCP ecosystem. It is intentionally long enough to support useful search snippets, paid publication quality gates, and truthful JobPosting structured data across employer apply flows.";
const PAID_RESPONSIBILITIES = [
  "Build production integrations for Claude and MCP developer workflows.",
  "Partner with product and customer teams to prioritize high-signal automation work.",
  "Maintain source-verified listing details as the role evolves.",
];
const PAID_REQUIREMENTS = [
  "Professional TypeScript or backend engineering experience.",
  "Comfort working with LLM applications and developer tooling.",
  "Strong written communication for technical product surfaces.",
];
const VALID_APPLY_URL = "https://example.com/jobs/activatable-role";
const VALID_CHECKED_AT = "2026-04-28T00:00:00.000Z";

function validUpsertInput(
  overrides: Partial<JobAdminUpsertInput> = {},
): JobAdminUpsertInput {
  return {
    slug: "reviewed-ai-engineer",
    title: "Reviewed AI Engineer",
    companyName: "Example Co",
    companyUrl: "https://example.com",
    locationText: "Remote",
    summary: VALID_SUMMARY,
    descriptionMd: VALID_DESCRIPTION,
    employmentType: "Full-time",
    compensationSummary: "$150K – $190K",
    equitySummary: "Offered",
    bonusSummary: "Performance bonus eligible",
    benefits: ["Health benefits", "Remote work"],
    responsibilities: PAID_RESPONSIBILITIES,
    requirements: PAID_REQUIREMENTS,
    applyUrl: VALID_APPLY_URL,
    tier: "free",
    status: "pending_review",
    source: "manual",
    sourceKind: "employer_submitted",
    sourceUrl: VALID_APPLY_URL,
    sourceCheckedAt: VALID_CHECKED_AT,
    postedAt: "2026-04-28",
    expiresAt: "2026-07-28",
    claimedEmployer: true,
    isRemote: true,
    isWorldwide: false,
    ...overrides,
  };
}

function validActiveJobRow(overrides: QueryResult = {}): QueryResult {
  return {
    slug: "activatable-role",
    title: "Activatable Role",
    company_name: "Example Co",
    company_url: "https://example.com",
    location_text: "Remote",
    summary: VALID_SUMMARY,
    description_md: VALID_DESCRIPTION,
    employment_type: "Full-time",
    posted_at: "2026-04-28",
    compensation_summary: "$150K – $190K",
    equity_summary: "Offered",
    bonus_summary: "Performance bonus eligible",
    benefits_json: JSON.stringify(["Health benefits", "Remote work"]),
    responsibilities_json: JSON.stringify(PAID_RESPONSIBILITIES),
    requirements_json: JSON.stringify(PAID_REQUIREMENTS),
    apply_url: VALID_APPLY_URL,
    tier: "free",
    status: "pending_review",
    source: "manual",
    source_kind: "employer_submitted",
    source_url: VALID_APPLY_URL,
    first_seen_at: "2026-04-28",
    last_checked_at: VALID_CHECKED_AT,
    source_checked_at: VALID_CHECKED_AT,
    stale_check_count: 0,
    curation_note: null,
    paid_placement_expires_at: null,
    claimed_employer: 1,
    posted_by_email: "jobs@example.com",
    expires_at: "2026-07-28",
    is_remote: 1,
    is_worldwide: 0,
    ...overrides,
  };
}

class FakeD1 implements D1DatabaseLike {
  jobRows: QueryResult[] = [];
  schemaColumns: string[] = [...REQUIRED_JOB_COLUMNS];
  runCalls: Array<{ query: string; values: unknown[] }> = [];
  allCalls: Array<{ query: string; values: unknown[] }> = [];

  prepare(query: string) {
    return {
      bind: (...values: unknown[]) => ({
        first: async <T = QueryResult>() => this.first<T>(query, values),
        run: async () => this.run(query, values),
        all: async <T = QueryResult>() => ({
          results: this.all<T>(query, values),
        }),
      }),
    };
  }

  private first<T>(query: string, values: unknown[]) {
    if (
      query.includes("FROM jobs_listings") &&
      query.includes("WHERE slug = ?")
    ) {
      const slug = String(values[0]);
      return (this.jobRows.find((row) => row.slug === slug) ?? null) as T;
    }
    return null;
  }

  private run(query: string, values: unknown[]): D1RunResult {
    this.runCalls.push({ query, values });
    if (query.includes("INSERT INTO jobs_listings")) {
      const slug = String(values[0]);
      const existingIndex = this.jobRows.findIndex((row) => row.slug === slug);
      const row = {
        slug,
        title: values[1],
        company_name: values[2],
        company_url: values[3],
        location_text: values[4],
        summary: values[5],
        description_md: values[6],
        employment_type: values[7],
        compensation_summary: values[8],
        equity_summary: values[9],
        bonus_summary: values[10],
        benefits_json: values[11],
        responsibilities_json: values[12],
        requirements_json: values[13],
        apply_url: values[14],
        tier: values[15],
        status: values[16],
        source: values[17],
        source_kind: values[18],
        source_url: values[19],
        first_seen_at: values[20],
        last_checked_at: values[21],
        source_checked_at: values[22],
        stale_check_count: values[23],
        curation_note: values[24],
        paid_placement_expires_at: values[25],
        claimed_employer: values[26],
        posted_by_email: values[27],
        posted_at: values[28],
        expires_at: values[29],
        is_remote: values[30],
        is_worldwide: values[31],
      };
      if (existingIndex >= 0) {
        this.jobRows[existingIndex] = {
          ...this.jobRows[existingIndex],
          ...row,
        };
      } else {
        this.jobRows.push(row);
      }
      return { success: true, meta: { changes: 1 } };
    }
    if (query.includes("UPDATE jobs_listings")) {
      const slug = String(values.at(-1));
      const exists = this.jobRows.some((row) => row.slug === slug);
      if (exists && query.includes("status = 'stale_pending_review'")) {
        const row = this.jobRows.find((item) => item.slug === slug);
        if (row) {
          row.status = "stale_pending_review";
          row.stale_check_count = Number(row.stale_check_count ?? 0) + 1;
        }
      }
      if (exists && query.includes("status = ?")) {
        const row = this.jobRows.find((item) => item.slug === slug);
        if (row) row.status = values[0];
      }
      return { success: true, meta: { changes: exists ? 1 : 0 } };
    }
    return { success: true, meta: { changes: 0 } };
  }

  private filterJobRows(query: string, values: unknown[]) {
    let rows = [...this.jobRows];
    const hasOffset = query.includes("OFFSET ?");
    const bindValues = hasOffset ? values.slice(0, -2) : values.slice(0, -1);
    let index = 0;
    if (query.includes("status = ?")) {
      const status = String(bindValues[index++]);
      rows = rows.filter((row) => String(row.status) === status);
    }
    if (query.includes("tier = ?")) {
      const tier = String(bindValues[index++]);
      rows = rows.filter((row) => String(row.tier) === tier);
    }
    if (query.includes("source = ?")) {
      const source = String(bindValues[index++]);
      rows = rows.filter((row) => String(row.source) === source);
    }
    if (query.includes("source_kind = ?")) {
      const sourceKind = String(bindValues[index++]);
      rows = rows.filter((row) => String(row.source_kind) === sourceKind);
    }
    return rows;
  }

  private all<T>(query: string, values: unknown[]) {
    this.allCalls.push({ query, values });
    if (query.includes("PRAGMA table_info(jobs_listings)")) {
      return this.schemaColumns.map((name) => ({ name })) as T[];
    }
    if (query.includes("COUNT(*) AS count FROM jobs_listings")) {
      const counts = new Map<string, number>();
      for (const row of this.jobRows) {
        const status = String(row.status || "unknown");
        counts.set(status, (counts.get(status) ?? 0) + 1);
      }
      return [...counts]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([status, count]) => ({ status, count })) as T[];
    }
    if (query.includes("FROM jobs_listings")) {
      const hasOffset = query.includes("OFFSET ?");
      const limit = Number(
        values.at(hasOffset ? -2 : -1) ?? this.jobRows.length,
      );
      const offset = hasOffset ? Number(values.at(-1) ?? 0) : 0;
      const rows = this.filterJobRows(query, values);
      return rows.slice(offset, offset + limit) as T[];
    }
    return [] as T[];
  }
}

describe("job-admin-lib constants", () => {
  it("exposes the jobs compensation migration filename", () => {
    expect(REQUIRED_JOBS_MIGRATION).toBe("0008_jobs_compensation_metadata.sql");
  });

  it.each(REQUIRED_JOB_COLUMNS.map((column) => [column]))(
    "includes required column %s",
    (column) => {
      expect(REQUIRED_JOB_COLUMNS).toContain(column);
    },
  );

  it("lists every core jobs_listings column once", () => {
    expect(new Set(REQUIRED_JOB_COLUMNS).size).toBe(
      REQUIRED_JOB_COLUMNS.length,
    );
    expect(REQUIRED_JOB_COLUMNS).toEqual(
      expect.arrayContaining([
        "slug",
        "title",
        "company_name",
        "apply_url",
        "benefits_json",
        "paid_placement_expires_at",
        "is_worldwide",
      ]),
    );
  });

  it("returns schema columns sorted from checkJobsSchema", async () => {
    const db = new FakeD1();
    const result = await checkJobsSchema(db);
    expect(result.columns).toEqual([...REQUIRED_JOB_COLUMNS].sort());
  });
});

describe("job-admin-lib error classes", () => {
  it("constructs JobPublicationQualityError with aggregated messages", () => {
    const error = new JobPublicationQualityError([
      "active jobs require an HTTPS employer apply URL",
      "active jobs require a source verification date",
    ]);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("JobPublicationQualityError");
    expect(error.message).toBe(
      "Job listing does not meet publication quality requirements",
    );
    expect(error.errors).toEqual([
      "active jobs require an HTTPS employer apply URL",
      "active jobs require a source verification date",
    ]);
  });

  it("constructs JobNotFoundError with the slug in the message", () => {
    const error = new JobNotFoundError("missing-role");
    expect(error.name).toBe("JobNotFoundError");
    expect(error.message).toBe("Job listing not found: missing-role");
  });

  it.each([["alpha-role"], ["beta-role"], ["gamma-role"]])(
    "formats JobNotFoundError for slug %s",
    (slug) => {
      expect(new JobNotFoundError(slug).message).toContain(slug);
    },
  );
});

describe("checkJobsSchema", () => {
  it("returns ok when every required column exists", async () => {
    const db = new FakeD1();
    const result = await checkJobsSchema(db);
    expect(result.ok).toBe(true);
    expect(result.missingColumns).toEqual([]);
    expect(result.requiredMigration).toBe(REQUIRED_JOBS_MIGRATION);
    expect(result.columns).toEqual([...REQUIRED_JOB_COLUMNS].sort());
    expect(result.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it.each(REQUIRED_JOB_COLUMNS.map((column) => [column]))(
    "reports missing column %s",
    async (missingColumn) => {
      const db = new FakeD1();
      db.schemaColumns = REQUIRED_JOB_COLUMNS.filter(
        (column) => column !== missingColumn,
      );
      const result = await checkJobsSchema(db);
      expect(result.ok).toBe(false);
      expect(result.missingColumns).toEqual([missingColumn]);
      expect(result.requiredMigration).toBe(REQUIRED_JOBS_MIGRATION);
    },
  );

  it("reports multiple missing columns", async () => {
    const db = new FakeD1();
    db.schemaColumns = REQUIRED_JOB_COLUMNS.filter(
      (column) => column !== "summary" && column !== "apply_url",
    );
    const result = await checkJobsSchema(db);
    expect(result.ok).toBe(false);
    expect(result.missingColumns).toEqual(["summary", "apply_url"]);
  });

  it("returns empty columns when the table has no fields", async () => {
    const db = new FakeD1();
    db.schemaColumns = [];
    const result = await checkJobsSchema(db);
    expect(result.ok).toBe(false);
    expect(result.missingColumns).toEqual([...REQUIRED_JOB_COLUMNS]);
    expect(result.columns).toEqual([]);
  });
});

describe("getJobsHealth", () => {
  it("returns schema failure without status counts", async () => {
    const db = new FakeD1();
    db.schemaColumns = ["slug"];
    const health = await getJobsHealth(db);
    expect(health.ok).toBe(false);
    expect(health.schema.ok).toBe(false);
    expect(health.counts).toEqual({});
  });

  it("returns grouped status counts when schema is healthy", async () => {
    const db = new FakeD1();
    db.jobRows = [
      validActiveJobRow({ slug: "a", status: "active" }),
      validActiveJobRow({ slug: "b", status: "active" }),
      validActiveJobRow({ slug: "c", status: "pending_review" }),
      validActiveJobRow({ slug: "d", status: "closed" }),
    ];
    const health = await getJobsHealth(db);
    expect(health.ok).toBe(true);
    expect(health.schema.ok).toBe(true);
    expect(health.counts).toEqual({
      active: 2,
      closed: 1,
      pending_review: 1,
    });
  });

  it("returns empty counts for an empty table", async () => {
    const db = new FakeD1();
    const health = await getJobsHealth(db);
    expect(health.ok).toBe(true);
    expect(health.counts).toEqual({});
  });
});

describe("queryAdminJobs", () => {
  function seedRows(db: FakeD1) {
    db.jobRows = [
      validActiveJobRow({
        slug: "featured-manual",
        tier: "featured",
        status: "pending_review",
        source: "manual",
        source_kind: "employer_submitted",
      }),
      validActiveJobRow({
        slug: "free-curated",
        tier: "free",
        status: "active",
        source: "curated",
        source_kind: "official_ats",
      }),
      validActiveJobRow({
        slug: "closed-sponsored",
        tier: "sponsored",
        status: "closed",
        source: "curated",
        source_kind: "employer_careers",
      }),
    ];
  }

  it("returns all rows with default pagination", async () => {
    const db = new FakeD1();
    seedRows(db);
    const jobs = await queryAdminJobs(db);
    expect(jobs).toHaveLength(3);
    expect(jobs.map((job) => job.slug)).toEqual([
      "featured-manual",
      "free-curated",
      "closed-sponsored",
    ]);
    expect(db.allCalls.at(-1)?.values.slice(-2)).toEqual([50, 0]);
  });

  it.each([
    ["status", "active", "free-curated"],
    ["tier", "featured", "featured-manual"],
    ["source", "manual", "featured-manual"],
    ["sourceKind", "official_ats", "free-curated"],
  ] as const)("filters by %s", async (filterKey, value, expectedSlug) => {
    const db = new FakeD1();
    seedRows(db);
    const filters =
      filterKey === "status"
        ? { status: value as "active" }
        : filterKey === "tier"
          ? { tier: value as "featured" }
          : filterKey === "source"
            ? { source: value as "manual" }
            : { sourceKind: value as "official_ats" };
    const jobs = await queryAdminJobs(db, filters);
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.slug).toBe(expectedSlug);
  });

  it("combines all list filters", async () => {
    const db = new FakeD1();
    seedRows(db);
    const jobs = await queryAdminJobs(db, {
      status: "pending_review",
      tier: "featured",
      source: "manual",
      sourceKind: "employer_submitted",
    });
    expect(jobs).toEqual([
      expect.objectContaining({ slug: "featured-manual" }),
    ]);
    expect(db.allCalls.at(-1)?.query).toContain(
      "WHERE status = ? AND tier = ? AND source = ? AND source_kind = ?",
    );
  });

  it.each([
    [undefined, 50],
    [0, 1],
    [1, 1],
    [50, 50],
    [100, 100],
    [101, 100],
    [500, 100],
    [-10, 1],
    [12.9, 12],
  ])("clamps limit %s to %s", async (input, expected) => {
    const db = new FakeD1();
    seedRows(db);
    await queryAdminJobs(db, { limit: input });
    expect(db.allCalls.at(-1)?.values.at(-2)).toBe(expected);
  });

  it.each([
    [undefined, 0],
    [0, 0],
    [1, 1],
    [10_000, 10_000],
    [20_000, 10_000],
    [-10, 0],
    [3.7, 3],
  ])("clamps offset %s to %s", async (input, expected) => {
    const db = new FakeD1();
    seedRows(db);
    await queryAdminJobs(db, { offset: input });
    expect(db.allCalls.at(-1)?.values.at(-1)).toBe(expected);
  });

  it("applies offset before limit", async () => {
    const db = new FakeD1();
    seedRows(db);
    const jobs = await queryAdminJobs(db, { limit: 1, offset: 1 });
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.slug).toBe("free-curated");
  });

  it("maps rows through mapJobListingRow", async () => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: "mapped-role" })];
    const [job] = await queryAdminJobs(db);
    expect(job).toMatchObject({
      slug: "mapped-role",
      company: "Example Co",
      applyUrl: VALID_APPLY_URL,
      status: "pending_review",
      source: "manual",
      sourceKind: "employer_submitted",
    });
  });

  it("returns an empty array when no rows match", async () => {
    const db = new FakeD1();
    seedRows(db);
    await expect(queryAdminJobs(db, { status: "archived" })).resolves.toEqual(
      [],
    );
  });
});

describe("queryAdminJobBySlug", () => {
  it("returns a mapped job when the slug exists", async () => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: "found-role" })];
    await expect(queryAdminJobBySlug(db, "found-role")).resolves.toMatchObject({
      slug: "found-role",
      title: "Activatable Role",
    });
  });

  it("returns null when the slug is missing", async () => {
    const db = new FakeD1();
    await expect(queryAdminJobBySlug(db, "missing-role")).resolves.toBeNull();
  });

  it.each(["alpha", "beta", "gamma"])(
    "queries by slug %s independently",
    async (slug) => {
      const db = new FakeD1();
      db.jobRows = [validActiveJobRow({ slug })];
      await expect(queryAdminJobBySlug(db, slug)).resolves.toMatchObject({
        slug,
      });
      await expect(
        queryAdminJobBySlug(db, `${slug}-missing`),
      ).resolves.toBeNull();
    },
  );
});

describe("upsertAdminJob", () => {
  it("inserts a pending review job and binds normalized values", async () => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput());
    expect(db.runCalls.at(-1)?.query).toContain("ON CONFLICT(slug)");
    expect(db.runCalls.at(-1)?.values).toEqual([
      "reviewed-ai-engineer",
      "Reviewed AI Engineer",
      "Example Co",
      "https://example.com",
      "Remote",
      VALID_SUMMARY,
      VALID_DESCRIPTION,
      "Full-time",
      "$150K – $190K",
      "Offered",
      "Performance bonus eligible",
      JSON.stringify(["Health benefits", "Remote work"]),
      JSON.stringify(PAID_RESPONSIBILITIES),
      JSON.stringify(PAID_REQUIREMENTS),
      VALID_APPLY_URL,
      "free",
      "pending_review",
      "manual",
      "employer_submitted",
      VALID_APPLY_URL,
      "2026-04-28",
      null,
      VALID_CHECKED_AT,
      0,
      null,
      null,
      1,
      null,
      "2026-04-28",
      "2026-07-28",
      1,
      0,
    ]);
    expect(db.jobRows).toHaveLength(1);
  });

  it("defaults location text, source url, and remote flags", async () => {
    const db = new FakeD1();
    await upsertAdminJob(
      db,
      validUpsertInput({
        locationText: "",
        sourceUrl: undefined,
        isRemote: false,
        isWorldwide: true,
        staleCheckCount: -3,
      }),
    );
    const values = db.runCalls.at(-1)?.values ?? [];
    expect(values[4]).toBe("Remote");
    expect(values[19]).toBe(VALID_APPLY_URL);
    expect(values[23]).toBe(0);
    expect(values[30]).toBe(0);
    expect(values[31]).toBe(1);
  });

  it("stores null for blank optional strings and empty lists", async () => {
    const db = new FakeD1();
    await upsertAdminJob(
      db,
      validUpsertInput({
        companyUrl: "   ",
        descriptionMd: "",
        employmentType: " ",
        compensationSummary: "",
        equitySummary: "",
        bonusSummary: "",
        benefits: [],
        responsibilities: [" ", ""],
        requirements: undefined,
        curationNote: "",
        paidPlacementExpiresAt: "",
        postedByEmail: " ",
      }),
    );
    const values = db.runCalls.at(-1)?.values ?? [];
    expect(values[3]).toBeNull();
    expect(values[6]).toBeNull();
    expect(values[7]).toBeNull();
    expect(values[8]).toBeNull();
    expect(values[9]).toBeNull();
    expect(values[10]).toBeNull();
    expect(values[11]).toBeNull();
    expect(values[12]).toBeNull();
    expect(values[13]).toBeNull();
    expect(values[24]).toBeNull();
    expect(values[25]).toBeNull();
    expect(values[27]).toBeNull();
  });

  it("updates an existing slug on conflict", async () => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput({ title: "First Title" }));
    await upsertAdminJob(db, validUpsertInput({ title: "Updated Title" }));
    expect(db.jobRows).toHaveLength(1);
    expect(db.jobRows[0]?.title).toBe("Updated Title");
  });

  it("rejects active jobs that fail public exposure validation", async () => {
    const db = new FakeD1();
    await expect(
      upsertAdminJob(
        db,
        validUpsertInput({
          status: "active",
          summary: "Too short.",
          applyUrl: "http://insecure.example/jobs",
        }),
      ),
    ).rejects.toBeInstanceOf(JobPublicationQualityError);
  });

  it.each([
    [
      "summary",
      { summary: "short" },
      `${JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength}+ character reviewed summary`,
    ],
    [
      "applyUrl",
      { applyUrl: "http://insecure.example/jobs" },
      "HTTPS employer apply URL",
    ],
    [
      "sourceUrl",
      { sourceUrl: "ftp://bad.example/jobs", applyUrl: VALID_APPLY_URL },
      "HTTPS source URL",
    ],
    [
      "sourceCheckedAt",
      { sourceCheckedAt: undefined, lastCheckedAt: undefined },
      "source verification date",
    ],
    [
      "structured depth",
      {
        descriptionMd: "",
        responsibilities: ["only one"],
        requirements: ["only one"],
      },
      `${JOB_PUBLIC_EXPOSURE_RULES.detailMinLength}+ characters of reviewed detail`,
    ],
  ])(
    "rejects active upsert missing %s",
    async (_label, overrides, messagePart) => {
      const db = new FakeD1();
      await expect(
        upsertAdminJob(
          db,
          validUpsertInput({
            status: "active",
            ...overrides,
          }),
        ),
      ).rejects.toMatchObject({
        name: "JobPublicationQualityError",
        errors: expect.arrayContaining([expect.stringContaining(messagePart)]),
      });
    },
  );

  it("accepts an active free-tier job that satisfies public exposure rules", async () => {
    const db = new FakeD1();
    await expect(
      upsertAdminJob(
        db,
        validUpsertInput({
          status: "active",
          tier: "free",
        }),
      ),
    ).resolves.toBeUndefined();
    expect(db.jobRows[0]?.status).toBe("active");
  });

  it("rejects active paid jobs missing publication-quality detail", async () => {
    const db = new FakeD1();
    await expect(
      upsertAdminJob(
        db,
        validUpsertInput({
          status: "active",
          tier: "sponsored",
          descriptionMd: "Too thin.",
        }),
      ),
    ).rejects.toMatchObject({
      name: "JobPublicationQualityError",
      errors: expect.arrayContaining([
        expect.stringContaining(
          `${JOB_PUBLICATION_QUALITY_RULES.descriptionMinLength}+ characters of original role detail`,
        ),
      ]),
    });
  });
});

describe("updateAdminJobState", () => {
  it.each([
    ["review", "pending_review"],
    ["activate", "active"],
    ["close", "closed"],
    ["archive", "archived"],
    ["reactivate", "active"],
    ["expire", "closed"],
  ] as const)("maps action %s to status %s", async (action, expectedStatus) => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: `${action}-role` })];
    await updateAdminJobState(db, { slug: `${action}-role`, action });
    expect(db.runCalls.at(-1)?.query).toContain("status = ?");
    expect(db.runCalls.at(-1)?.values).toContain(expectedStatus);
  });

  it("marks a job stale and increments stale_check_count", async () => {
    const db = new FakeD1();
    db.jobRows = [
      validActiveJobRow({ slug: "stale-role", stale_check_count: 2 }),
    ];
    await updateAdminJobState(db, {
      slug: "stale-role",
      action: "stale",
      checkedAt: "2026-04-29T00:00:00.000Z",
    });
    expect(db.runCalls.at(-1)?.query).toContain("stale_pending_review");
    expect(db.runCalls.at(-1)?.values).toContain("2026-04-29T00:00:00.000Z");
    expect(db.jobRows[0]?.stale_check_count).toBe(3);
  });

  it("revalidates source timestamps and clears stale_check_count", async () => {
    const db = new FakeD1();
    db.jobRows = [
      validActiveJobRow({ slug: "revalidate-role", stale_check_count: 4 }),
    ];
    await updateAdminJobState(db, {
      slug: "revalidate-role",
      action: "revalidate",
      checkedAt: "2026-04-28T00:00:00.000Z",
      expiresAt: "2026-08-01",
    });
    expect(db.runCalls.at(-1)?.query).toContain("stale_check_count = 0");
    expect(db.runCalls.at(-1)?.query).toContain("expires_at = CASE");
    expect(db.runCalls.at(-1)?.values).toContain("2026-04-28T00:00:00.000Z");
    expect(db.runCalls.at(-1)?.values).toContain("2026-08-01");
  });

  it("revalidate can explicitly clear expires_at with null", async () => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: "clear-expiry-role" })];
    await updateAdminJobState(db, {
      slug: "clear-expiry-role",
      action: "revalidate",
      expiresAt: null,
    });
    expect(db.runCalls.at(-1)?.values).toContain(null);
  });

  it("uses the current timestamp when checkedAt is omitted", async () => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: "now-role" })];
    await updateAdminJobState(db, { slug: "now-role", action: "stale" });
    const checkedAt = String(db.runCalls.at(-1)?.values[0] ?? "");
    expect(checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("blocks activation when the stored row fails public exposure checks", async () => {
    const db = new FakeD1();
    db.jobRows = [
      validActiveJobRow({
        slug: "thin-role",
        summary: "Too short.",
        description_md: null,
        source_checked_at: null,
      }),
    ];
    await expect(
      updateAdminJobState(db, { slug: "thin-role", action: "activate" }),
    ).rejects.toBeInstanceOf(JobPublicationQualityError);
  });

  it("activates a fully reviewed free-tier row", async () => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: "ready-role" })];
    await updateAdminJobState(db, {
      slug: "ready-role",
      action: "activate",
      checkedAt: VALID_CHECKED_AT,
    });
    expect(db.runCalls.at(-1)?.values).toContain("active");
    expect(db.runCalls.at(-1)?.values).toContain(VALID_CHECKED_AT);
  });

  it("reactivate reuses the same publication-quality gate as activate", async () => {
    const db = new FakeD1();
    db.jobRows = [
      validActiveJobRow({
        slug: "reactivate-thin",
        status: "closed",
        summary: "Too short.",
      }),
    ];
    await expect(
      updateAdminJobState(db, {
        slug: "reactivate-thin",
        action: "reactivate",
      }),
    ).rejects.toBeInstanceOf(JobPublicationQualityError);
  });

  it.each([
    ["revalidate"],
    ["stale"],
    ["close"],
    ["review"],
    ["archive"],
    ["expire"],
  ])("throws JobNotFoundError for missing slug on %s", async (action) => {
    const db = new FakeD1();
    await expect(
      updateAdminJobState(db, {
        slug: "missing-role",
        action: action as "revalidate",
      }),
    ).rejects.toBeInstanceOf(JobNotFoundError);
  });

  it("throws JobNotFoundError when activate target is missing", async () => {
    const db = new FakeD1();
    await expect(
      updateAdminJobState(db, { slug: "missing-role", action: "activate" }),
    ).rejects.toBeInstanceOf(JobNotFoundError);
  });

  it("passes expiresAt through status updates when provided", async () => {
    const db = new FakeD1();
    db.jobRows = [validActiveJobRow({ slug: "expire-at-role" })];
    await updateAdminJobState(db, {
      slug: "expire-at-role",
      action: "close",
      expiresAt: "2026-05-01",
    });
    expect(db.runCalls.at(-1)?.query).toContain("expires_at = CASE");
    expect(db.runCalls.at(-1)?.values).toContain("2026-05-01");
  });

  it.each([
    ["review"],
    ["activate"],
    ["close"],
    ["archive"],
    ["reactivate"],
    ["expire"],
  ])(
    "includes reactivation reset fields for %s when applicable",
    async (action) => {
      const db = new FakeD1();
      db.jobRows = [validActiveJobRow({ slug: `${action}-reset-role` })];
      await updateAdminJobState(db, {
        slug: `${action}-reset-role`,
        action: action as "review",
        checkedAt: VALID_CHECKED_AT,
      });
      const query = db.runCalls.at(-1)?.query ?? "";
      if (action === "activate" || action === "reactivate") {
        expect(query).toContain("stale_check_count = CASE");
        expect(db.runCalls.at(-1)?.values).toContain(VALID_CHECKED_AT);
      } else {
        expect(query).toContain("status = ?");
      }
    },
  );

  it("throws JobNotFoundError when reactivate target is missing", async () => {
    const db = new FakeD1();
    await expect(
      updateAdminJobState(db, { slug: "missing-role", action: "reactivate" }),
    ).rejects.toBeInstanceOf(JobNotFoundError);
  });

  it.each([
    ["review", "pending_review"],
    ["activate", "active"],
    ["close", "closed"],
    ["archive", "archived"],
    ["reactivate", "active"],
    ["expire", "closed"],
    ["stale", "stale_pending_review"],
    ["revalidate", "pending_review"],
  ] as const)(
    "runs %s without expiresAt override",
    async (action, _expectedStatus) => {
      const db = new FakeD1();
      db.jobRows = [validActiveJobRow({ slug: `${action}-no-expiry` })];
      await updateAdminJobState(db, {
        slug: `${action}-no-expiry`,
        action: action === "stale" || action === "revalidate" ? action : action,
        checkedAt: VALID_CHECKED_AT,
      });
      expect(db.runCalls.at(-1)?.values.at(-1)).toBe(`${action}-no-expiry`);
    },
  );
});

describe("queryAdminJobs filter matrix", () => {
  it.each([
    [
      "pending_review",
      "featured",
      "manual",
      "employer_submitted",
      "featured-manual",
    ],
    ["active", "free", "curated", "official_ats", "free-curated"],
    ["closed", "sponsored", "curated", "employer_careers", "closed-sponsored"],
  ])(
    "matches combined filters status=%s tier=%s source=%s sourceKind=%s",
    async (status, tier, source, sourceKind, expectedSlug) => {
      const db = new FakeD1();
      db.jobRows = [
        validActiveJobRow({
          slug: "featured-manual",
          tier: "featured",
          status: "pending_review",
          source: "manual",
          source_kind: "employer_submitted",
        }),
        validActiveJobRow({
          slug: "free-curated",
          tier: "free",
          status: "active",
          source: "curated",
          source_kind: "official_ats",
        }),
        validActiveJobRow({
          slug: "closed-sponsored",
          tier: "sponsored",
          status: "closed",
          source: "curated",
          source_kind: "employer_careers",
        }),
      ];
      const jobs = await queryAdminJobs(db, {
        status: status as JobAdminUpsertInput["status"],
        tier: tier as JobAdminUpsertInput["tier"],
        source: source as JobAdminUpsertInput["source"],
        sourceKind: sourceKind as JobAdminUpsertInput["sourceKind"],
      });
      expect(jobs).toEqual([expect.objectContaining({ slug: expectedSlug })]);
    },
  );

  it.each([["archived"], ["draft"], ["stale_pending_review"]])(
    "returns no rows for unused status %s",
    async (status) => {
      const db = new FakeD1();
      db.jobRows = [validActiveJobRow({ slug: "only-role", status: "active" })];
      await expect(
        queryAdminJobs(db, { status: status as JobAdminUpsertInput["status"] }),
      ).resolves.toEqual([]);
    },
  );

  it.each([
    [1, 0, 1],
    [2, 0, 2],
    [1, 1, 1],
    [1, 2, 1],
  ])(
    "paginates with limit=%s offset=%s returning %s rows",
    async (limit, offset, expectedCount) => {
      const db = new FakeD1();
      db.jobRows = [
        validActiveJobRow({ slug: "one" }),
        validActiveJobRow({ slug: "two" }),
        validActiveJobRow({ slug: "three" }),
      ];
      const jobs = await queryAdminJobs(db, { limit, offset });
      expect(jobs).toHaveLength(expectedCount);
    },
  );
});

describe("upsertAdminJob bind normalization matrix", () => {
  it.each([
    [
      "firstSeenAt",
      { firstSeenAt: "2026-01-01", postedAt: "2026-02-01" },
      "2026-01-01",
    ],
    [
      "postedAt fallback",
      { firstSeenAt: undefined, postedAt: "2026-02-01" },
      "2026-02-01",
    ],
    ["lastCheckedAt", { lastCheckedAt: "2026-03-01" }, "2026-03-01"],
    [
      "sourceCheckedAt",
      { sourceCheckedAt: VALID_CHECKED_AT },
      VALID_CHECKED_AT,
    ],
    [
      "postedByEmail",
      { postedByEmail: "jobs@example.com" },
      "jobs@example.com",
    ],
    ["curationNote", { curationNote: "Needs review" }, "Needs review"],
    [
      "paidPlacementExpiresAt",
      { paidPlacementExpiresAt: "2026-12-01" },
      "2026-12-01",
    ],
  ])("binds %s", async (_label, overrides, expected) => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput(overrides));
    const values = db.runCalls.at(-1)?.values ?? [];
    expect(values).toContain(expected);
  });

  it.each([
    [true, 1],
    [false, 0],
    [undefined, 0],
  ])("binds claimedEmployer=%s as %s", async (claimedEmployer, expected) => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput({ claimedEmployer }));
    expect(db.runCalls.at(-1)?.values[26]).toBe(expected);
  });

  it.each([
    [true, 1],
    [false, 0],
    [undefined, 1],
  ])("binds isRemote=%s as %s", async (isRemote, expected) => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput({ isRemote }));
    expect(db.runCalls.at(-1)?.values[30]).toBe(expected);
  });

  it.each([
    [true, 1],
    [false, 0],
    [undefined, 0],
  ])("binds isWorldwide=%s as %s", async (isWorldwide, expected) => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput({ isWorldwide }));
    expect(db.runCalls.at(-1)?.values[31]).toBe(expected);
  });

  it.each([
    [0, 0],
    [2, 2],
    [2.9, 2],
    [-4, 0],
  ])("binds staleCheckCount=%s as %s", async (staleCheckCount, expected) => {
    const db = new FakeD1();
    await upsertAdminJob(db, validUpsertInput({ staleCheckCount }));
    expect(db.runCalls.at(-1)?.values[23]).toBe(expected);
  });

  it("allows pending_review upserts with minimal public exposure fields", async () => {
    const db = new FakeD1();
    await upsertAdminJob(
      db,
      validUpsertInput({
        status: "pending_review",
        summary: "Short pending copy is allowed before activation.",
        descriptionMd: undefined,
        responsibilities: undefined,
        requirements: undefined,
        sourceCheckedAt: undefined,
      }),
    );
    expect(db.jobRows).toHaveLength(1);
  });

  it.each([
    [
      "responsibilities",
      { responsibilities: ["one"] },
      `${JOB_PUBLICATION_QUALITY_RULES.minimumResponsibilities} responsibilities`,
    ],
    [
      "requirements",
      { requirements: ["one", "two"] },
      `${JOB_PUBLICATION_QUALITY_RULES.minimumRequirements} requirements`,
    ],
    [
      "benefits",
      { benefits: ["one"] },
      `${JOB_PUBLICATION_QUALITY_RULES.minimumBenefits} benefits or perks`,
    ],
    [
      "compensation",
      { compensationSummary: "" },
      "salary or compensation range",
    ],
    ["employmentType", { employmentType: "" }, "employment type"],
    ["postedAt", { postedAt: "" }, "postedAt date"],
    ["expiresAt", { expiresAt: "" }, "expiresAt/validThrough date"],
  ])(
    "rejects active paid upsert missing %s",
    async (_label, overrides, messagePart) => {
      const db = new FakeD1();
      await expect(
        upsertAdminJob(
          db,
          validUpsertInput({
            status: "active",
            tier: "standard",
            ...overrides,
          }),
        ),
      ).rejects.toMatchObject({
        name: "JobPublicationQualityError",
        errors: expect.arrayContaining([expect.stringContaining(messagePart)]),
      });
    },
  );

  it.each([["standard"], ["featured"], ["sponsored"]])(
    "accepts active %s jobs with full publication quality",
    async (tier) => {
      const db = new FakeD1();
      await upsertAdminJob(
        db,
        validUpsertInput({
          status: "active",
          tier: tier as JobAdminUpsertInput["tier"],
        }),
      );
      expect(db.jobRows[0]?.tier).toBe(tier);
    },
  );
});

describe("getJobsHealth status aggregation", () => {
  it.each([
    ["active", 3],
    ["pending_review", 2],
    ["closed", 1],
    ["archived", 4],
    ["stale_pending_review", 1],
  ])("counts %s=%s rows", async (status, count) => {
    const db = new FakeD1();
    db.jobRows = Array.from({ length: count }, (_, index) =>
      validActiveJobRow({ slug: `${status}-${index}`, status }),
    );
    const health = await getJobsHealth(db);
    expect(health.counts[status]).toBe(count);
  });
});

describe("queryAdminJobBySlug bulk lookups", () => {
  it.each(Array.from({ length: 44 }, (_, index) => [`missing-role-${index}`]))(
    "returns null for unknown slug %s",
    async (slug) => {
      const db = new FakeD1();
      await expect(queryAdminJobBySlug(db, slug)).resolves.toBeNull();
    },
  );
});

describe("job-admin-lib exports", () => {
  it("re-exports the jobs compensation migration constant", () => {
    expect(REQUIRED_JOBS_MIGRATION.endsWith(".sql")).toBe(true);
  });

  it("defines publication and not-found error constructors", () => {
    expect(typeof JobPublicationQualityError).toBe("function");
    expect(typeof JobNotFoundError).toBe("function");
  });
});

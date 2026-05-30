import { z } from "zod";
import { normalizeBrandDomain } from "@heyclaude/registry/brand-assets";
import { validateJobPublicationQuality } from "@heyclaude/registry/commercial";

const entryKeySchema = z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/);
const safeSlugSchema = z.string().regex(/^[a-z0-9-]+$/);
const categorySchema = z
  .union([safeSlugSchema, z.literal("")])
  .optional()
  .default("");
const platformSchema = z
  .union([
    z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9][a-z0-9 -]{0,48}$/),
    z.literal(""),
  ])
  .optional()
  .default("");
const jobTierSchema = z.enum(["free", "standard", "featured", "sponsored"]);
const jobStatusSchema = z.enum([
  "draft",
  "pending_review",
  "active",
  "stale_pending_review",
  "closed",
  "archived",
]);
const jobSourceSchema = z.enum(["manual", "polar", "email", "curated"]);
const jobSourceKindSchema = z.enum(["official_ats", "employer_careers", "employer_submitted"]);
const listingLeadStatusSchema = z.enum([
  "new",
  "pending_review",
  "approved",
  "active",
  "rejected",
  "expired",
  "archived",
]);

function isAsciiEmail(value: string) {
  if (value.length < 3 || value.length > 320) return false;

  const atIndex = value.indexOf("@");
  if (atIndex <= 0 || atIndex !== value.lastIndexOf("@")) return false;

  const local = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);
  if (local.length > 64 || domain.length < 3 || domain.length > 255) {
    return false;
  }
  if (
    local.startsWith(".") ||
    local.endsWith(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".")
  ) {
    return false;
  }

  let previousLocalChar = "";
  for (const char of local) {
    const code = char.charCodeAt(0);
    const isLowerAlpha = code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;
    const isAllowedSymbol = "!#$%&'*+-/=?^_`{|}~.".includes(char);
    if (!isLowerAlpha && !isDigit && !isAllowedSymbol) return false;
    if (char === "." && previousLocalChar === ".") return false;
    previousLocalChar = char;
  }

  let labelLength = 0;
  let previousDomainChar = "";
  let dotCount = 0;
  for (const char of domain) {
    const code = char.charCodeAt(0);
    const isLowerAlpha = code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;
    if (char === ".") {
      if (labelLength === 0 || previousDomainChar === "-" || previousDomainChar === ".") {
        return false;
      }
      dotCount += 1;
      labelLength = 0;
      previousDomainChar = char;
      continue;
    }
    if (!isLowerAlpha && !isDigit && char !== "-") return false;
    if (labelLength === 0 && char === "-") return false;
    labelLength += 1;
    if (labelLength > 63) return false;
    previousDomainChar = char;
  }

  return dotCount > 0 && labelLength >= 2 && previousDomainChar !== "-";
}

const safeEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(320)
  .refine(isAsciiEmail, { message: "Invalid email address" });

const optionalHttpsUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => !value || value.toLowerCase().startsWith("https://"), {
    message: "URL must be HTTPS",
  })
  .optional()
  .default("");

const isoDateLikeSchema = z
  .union([z.literal(""), z.iso.datetime({ offset: true }), z.iso.date()])
  .optional()
  .default("");

export const jobSourceKindFilterSchema = z
  .enum(["all", "official_ats", "employer_careers", "employer_submitted", ""])
  .optional()
  .default("all");

export const publicJobsQuerySchema = z.object({
  q: z.string().trim().toLowerCase().max(120).optional().default(""),
  tier: z
    .union([jobTierSchema, z.literal("all"), z.literal("")])
    .optional()
    .default("all"),
  remote: z.enum(["all", "true", "false", ""]).optional().default("all"),
  location: z.string().trim().toLowerCase().max(120).optional().default(""),
  type: z.string().trim().toLowerCase().max(60).optional().default(""),
  sourceKind: jobSourceKindFilterSchema,
  compensation: z.enum(["all", "true", "false", ""]).optional().default("all"),
  claimedEmployer: z.enum(["all", "true", "false", ""]).optional().default("all"),
  postedAfter: isoDateLikeSchema,
  limit: z.coerce.number().int().min(1).max(100).optional().default(100),
  offset: z.coerce
    .number()
    .int()
    .min(0)
    .max(10_000)
    .default(0)
    .meta({ type: "integer", minimum: 0, maximum: 10_000, default: 0 }),
});

export const publicJobParamsSchema = z.object({
  slug: safeSlugSchema,
});

const publicJobListingSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    company: z.string(),
    companyUrl: z.string().url().optional(),
    location: z.string(),
    description: z.string(),
    descriptionMd: z.string().optional(),
    type: z.string().optional(),
    postedAt: z.string().optional(),
    compensation: z.string().optional(),
    equity: z.string().optional(),
    bonus: z.string().optional(),
    benefits: z.array(z.string()).max(24).optional(),
    responsibilities: z.array(z.string()).max(24).optional(),
    requirements: z.array(z.string()).max(24).optional(),
    featured: z.boolean(),
    sponsored: z.boolean().optional(),
    applyUrl: z.string(),
    tier: jobTierSchema.optional(),
    status: jobStatusSchema.optional(),
    source: jobSourceSchema.optional(),
    sourceKind: jobSourceKindSchema.optional(),
    sourceUrl: z.string().optional(),
    firstSeenAt: z.string().optional(),
    lastCheckedAt: z.string().optional(),
    sourceCheckedAt: z.string().optional(),
    curationNote: z.string().optional(),
    claimedEmployer: z.boolean().optional(),
    expiresAt: z.string().optional(),
    isRemote: z.boolean().optional(),
    isWorldwide: z.boolean().optional(),
    webUrl: z.string().url(),
    labels: z.array(z.string()).max(24),
    sourceLabel: z.string(),
    applySourceLabel: z.string(),
    lastVerifiedAt: z.string().optional(),
  })
  .passthrough();

export const publicJobsResponseSchema = z.object({
  schemaVersion: z.number(),
  kind: z.literal("jobs-index"),
  generatedAt: z.string(),
  count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  totalAvailable: z.number().int().nonnegative(),
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  nextOffset: z.number().int().nullable(),
  entries: z.array(publicJobListingSchema).max(100),
});

export const publicJobDetailResponseSchema = z.object({
  schemaVersion: z.number(),
  kind: z.literal("jobs-detail"),
  slug: z.string(),
  generatedAt: z.string(),
  entry: publicJobListingSchema,
  related: z.array(publicJobListingSchema).max(4),
});

export const apiErrorEnvelopeSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string().min(1),
    message: z.string().optional(),
    details: z.unknown().optional(),
  }),
  requestId: z.string().optional(),
});

export const registryTrustSignalsSchema = z.object({
  firstPartyEditorial: z.boolean().optional(),
  packageVerified: z.boolean().optional(),
  packageTrust: z.string().nullable().optional(),
  packageChecksum: z.string().optional(),
  checksumPresent: z.boolean().optional(),
  sourceUrlCount: z.number().int().nonnegative().optional(),
  sourceUrls: z.array(z.string().url()).max(8).optional(),
  sourceStatus: z.enum(["available", "missing"]).or(z.string()).optional(),
  lastVerifiedAt: z.string().optional(),
  adapterGenerated: z.boolean().optional(),
  platforms: z.array(z.string()).max(12).optional(),
  supportLevels: z.array(z.string()).max(12).optional(),
});

export const registryBrandAssetSchema = z.object({
  brandName: z.string().optional(),
  brandDomain: z.string().optional(),
  brandIconUrl: z.string().optional(),
  brandLogoUrl: z.string().optional(),
  brandAssetSource: z.string().optional(),
  brandVerifiedAt: z.string().optional(),
  brandColors: z.array(z.string()).max(6).optional(),
});

export const registryProvenanceSchema = z.object({
  submittedBy: z.string().optional(),
  submittedByUrl: z.string().url().optional(),
  submittedAt: z.string().optional(),
  submissionIssueNumber: z.number().int().positive().optional(),
  submissionIssueUrl: z.string().url().optional(),
  importPrNumber: z.number().int().positive().optional(),
  importPrUrl: z.string().url().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  claimStatus: z.enum(["unclaimed", "pending", "verified"]).optional(),
  claimedBy: z.string().optional(),
  claimedByUrl: z.string().url().optional(),
  claimedAt: z.string().optional(),
});

export const registrySearchResultSchema = registryBrandAssetSchema
  .merge(registryProvenanceSchema)
  .extend({
    category: z.string(),
    slug: z.string(),
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    seoDescription: z.string().optional(),
    tags: z.array(z.string()).max(32),
    keywords: z.array(z.string()).max(64),
    author: z.string(),
    safetyNotes: z.array(z.string().min(1).max(320)).max(8).optional(),
    privacyNotes: z.array(z.string().min(1).max(320)).max(8).optional(),
    dateAdded: z.string(),
    installable: z.boolean(),
    downloadUrl: z.string().optional(),
    downloadTrust: z.string().nullable().optional(),
    verificationStatus: z.string(),
    platforms: z.array(z.string()).max(12).optional(),
    supportLevels: z.array(z.string()).max(12).optional(),
    documentationUrl: z.string(),
    repoUrl: z.string(),
    url: z.string(),
    canonicalUrl: z.string().url(),
    llmsUrl: z.string().url(),
    apiUrl: z.string().url(),
    trustSignals: registryTrustSignalsSchema,
  })
  .passthrough();

export const registrySearchFacetBucketsSchema = z.record(
  z.string().min(1).max(64),
  z.number().int().nonnegative(),
);

export const registrySearchFacetsSchema = z.object({
  categories: registrySearchFacetBucketsSchema,
  platforms: registrySearchFacetBucketsSchema,
  hasSafetyNotes: registrySearchFacetBucketsSchema,
  hasPrivacyNotes: registrySearchFacetBucketsSchema,
  downloadTrust: registrySearchFacetBucketsSchema,
  claimStatus: registrySearchFacetBucketsSchema,
  sourceStatus: registrySearchFacetBucketsSchema,
});

export const registrySearchResponseSchema = z.object({
  schemaVersion: z.number(),
  query: z.string(),
  category: z.string(),
  platform: z.string(),
  filters: z
    .object({
      hasSafetyNotes: z.string(),
      hasPrivacyNotes: z.string(),
      downloadTrust: z.string(),
      claimStatus: z.string(),
      sourceStatus: z.string(),
    })
    .optional(),
  count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  limit: z.number().int().min(1).max(50),
  offset: z.number().int().min(0).max(10_000),
  nextOffset: z.number().int().min(0).max(10_000).nullable(),
  results: z.array(registrySearchResultSchema).max(50),
  facets: registrySearchFacetsSchema.optional(),
});

export const registryTrendingResponseSchema = z.object({
  schemaVersion: z.number(),
  kind: z.literal("registry-trending"),
  category: z.string(),
  platform: z.string(),
  limit: z.number().int().min(1).max(50),
  count: z.number().int().nonnegative(),
  signalsAvailable: z.object({ votes: z.boolean(), community: z.boolean(), intent: z.boolean() }),
  entries: z
    .array(
      z.object({
        category: z.string(),
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        canonicalUrl: z.string().url().optional(),
        platforms: z.array(z.string()).max(12),
        tags: z.array(z.string()).max(32),
        dateAdded: z.string(),
        score: z.number(),
        reasons: z.array(z.string()).max(6),
        trustSignals: z.object({ sourceStatus: z.string() }),
      }),
    )
    .max(50),
});

export const registrySearchQuerySchema = z.object({
  q: z.string().trim().toLowerCase().max(120).optional().default(""),
  category: categorySchema,
  platform: platformSchema,
  hasSafetyNotes: z.enum(["all", "true", "false"]).optional().default("all"),
  hasPrivacyNotes: z.enum(["all", "true", "false"]).optional().default("all"),
  downloadTrust: z.enum(["all", "first-party", "external", "none"]).optional().default("all"),
  claimStatus: z.enum(["all", "unclaimed", "pending", "verified"]).optional().default("all"),
  sourceStatus: z.enum(["all", "available", "missing"]).optional().default("all"),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

export const registryTrendingQuerySchema = z
  .object({
    category: categorySchema,
    platform: platformSchema,
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  })
  .strict();

export const registryDiffQuerySchema = z.object({
  since: z.string().trim().max(128).optional().default(""),
  limit: z.coerce.number().int().min(1).max(500).optional().default(100),
});

const registryIntegrityPairMessage = "Provide both artifact and hash together for verification";

// Empty is treated as "snapshot listing" by the route handler at
// apps/web/src/routes/api/registry/integrity.ts (`!artifact` → status
// `snapshot`, `artifact || null` in response). Accept it as a valid value
// at the field level so clients that round-trip `null → ""` (HTML forms,
// Raycast) don't get a 400 from the Zod gate. The pair-check below still
// rejects non-empty artifact paired with empty/absent hash (and vice versa).
export const registryIntegrityQuerySchema = z
  .object({
    artifact: z
      .union([
        z.literal(""),
        z
          .string()
          .trim()
          .max(160)
          .regex(/^\/?(?:[a-z0-9][a-z0-9._-]*\/)*(?:[a-z0-9][a-z0-9._-]*)$/),
      ])
      .optional(),
    hash: z
      .union([
        z.literal(""),
        z
          .string()
          .trim()
          .toLowerCase()
          .regex(/^[a-f0-9]{64}$/),
      ])
      .optional(),
  })
  .superRefine((query, ctx) => {
    if (query.artifact && !query.hash) {
      ctx.addIssue({
        code: "custom",
        path: ["hash"],
        message: registryIntegrityPairMessage,
      });
    }
    if (!query.artifact && query.hash) {
      ctx.addIssue({
        code: "custom",
        path: ["artifact"],
        message: registryIntegrityPairMessage,
      });
    }
  });

export const entryParamsSchema = z.object({
  category: safeSlugSchema,
  slug: safeSlugSchema,
});

export const votesQueryBodySchema = z.object({
  keys: z.array(entryKeySchema).max(1000).optional().default([]),
  clientId: z.string().trim().max(128).optional().default(""),
});

export const votesToggleBodySchema = z.object({
  key: entryKeySchema,
  clientId: z.string().trim().min(8).max(128),
  vote: z.boolean(),
});

const newsletterSegmentIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9:_-]+$/i);

export const newsletterSubscribeBodySchema = z.object({
  email: safeEmailSchema,
  segments: z.array(newsletterSegmentIdSchema).max(20).optional().default([]),
  source: z.string().trim().max(64).optional().default("site"),
});

export const newsletterWebhookBodySchema = z
  .object({
    type: z.string().optional(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export const submissionBodySchema = z.object({
  fields: z.record(z.string(), z.unknown()).optional().default({}),
  turnstileToken: z.string().max(4096).optional().default(""),
  honeypot: z.string().max(256).optional().default(""),
});

export const submissionPreflightBodySchema = z.object({
  fields: z.record(z.string(), z.unknown()).optional().default({}),
  honeypot: z.string().max(256).optional().default(""),
});

export const submissionQueueQuerySchema = z.object({
  number: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

const submissionPreflightNoteSchema = z.object({
  code: z.string().max(80),
  message: z.string().max(500),
});

const submissionPreflightDuplicateSchema = z.object({
  key: z.string().max(160),
  category: z.string().max(80),
  slug: z.string().max(160),
  title: z.string().max(240),
  url: z.string().url().max(2048),
  reasons: z.array(z.string().max(80)).max(8),
});

const submissionPreflightSuccessResponseSchema = z.object({
  ok: z.literal(true),
  valid: z.boolean(),
  routeSuggestion: z.enum(["github_issue", "fix_required", "tools_form"]),
  category: z.string(),
  slug: z.string(),
  fallbackUrl: z.string().url(),
  issuePreview: z.object({
    title: z.string().max(300),
    labels: z.array(z.string().max(80)).max(12),
    body: z.string().max(32_000),
  }),
  schema: z.object({
    ok: z.boolean(),
    skipped: z.boolean(),
    errors: z.array(z.string().max(500)).max(32),
    warnings: z.array(z.string().max(500)).max(32),
    fields: z.record(z.string(), z.unknown()),
  }),
  risk: z.object({
    tier: z.string().optional(),
    policyDecision: z.string().optional(),
    policyMatrix: z.record(z.string(), z.unknown()),
    reviewFlags: z.array(z.string().max(120)).max(32),
    classificationWarnings: z.array(z.unknown()).max(32),
  }),
  expectedNotes: z.object({
    safety: z.boolean(),
    privacy: z.boolean(),
    reasons: z.array(z.string().max(500)).max(8),
  }),
  blockers: z.array(submissionPreflightNoteSchema).max(24),
  warnings: z.array(submissionPreflightNoteSchema).max(24),
  duplicates: z.array(submissionPreflightDuplicateSchema).max(5),
  nextAction: z.object({
    label: z.string().max(160),
    url: z.string().max(4096).optional(),
  }),
});

const submissionPreflightDiscardResponseSchema = z.object({
  ok: z.literal(true),
  valid: z.literal(false),
  queued: z.literal(false),
});

export const submissionPreflightResponseSchema = z.union([
  submissionPreflightSuccessResponseSchema,
  submissionPreflightDiscardResponseSchema,
]);

const submissionQueueStatusSchema = z.enum([
  "queued",
  "in_review",
  "ready",
  "approved",
  "import_pr_open",
  "needs_author_input",
  "source_needs_verification",
  "stale",
  "imported",
  "closed",
]);

const submissionQueueItemSchema = z.object({
  number: z.number().int().positive(),
  url: z.string().url(),
  title: z.string().max(300),
  author: z.string().max(120),
  authorUrl: z.string().url().optional(),
  category: z.string().max(80),
  slug: z.string().max(160),
  status: submissionQueueStatusSchema,
  state: z.enum(["open", "closed"]),
  labels: z.array(z.string().max(120)).max(32),
  blockers: z.array(z.string().max(240)).max(12),
  updatedAt: z.string(),
  bodyFingerprint: z.string().max(40).optional(),
  bodyUpdatedAt: z.string().optional(),
  authorCommentedAfterReview: z.boolean().optional(),
  authorCommentedWithoutBodyUpdate: z.boolean().optional(),
  lastAuthorCommentAt: z.string().optional(),
  createdAt: z.string(),
  closedAt: z.string().nullable().optional(),
  importPrUrl: z.string().url().optional(),
});

export const submissionQueueResponseSchema = z.object({
  ok: z.literal(true),
  generatedAt: z.string(),
  repo: z.string(),
  count: z.number().int().nonnegative(),
  entries: z.array(submissionQueueItemSchema).max(100),
});

export const downloadQuerySchema = z.object({
  asset: z.string().trim().max(256),
});

export const githubStatsResponseSchema = z.object({
  repo: z.string(),
  stars: z.number().nullable(),
  forks: z.number().nullable(),
  updatedAt: z.string().nullable(),
});

export const publicAlertsResponseSchema = z.object({
  events: z
    .array(
      z
        .object({
          id: z.string().optional(),
          kind: z.string().optional(),
          category: z.string().optional(),
          slug: z.string().optional(),
          action: z.string().optional(),
          date: z.string().optional(),
          title: z.string().optional(),
          commit: z.string().optional(),
        })
        .passthrough(),
    )
    .max(500),
});

export const publicFeedsHealthResponseSchema = z.object({
  generatedAt: z.string(),
  count: z.number().int().nonnegative(),
  feeds: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
        itemCount: z.number().int().nonnegative(),
        latestItemAt: z.string().nullable(),
        lastBuilt: z.string(),
        etag: z.string(),
        isCurrent: z.boolean(),
      }),
    )
    .max(100),
});

export const listingLeadBodySchema = z
  .object({
    kind: z.enum(["job", "tool", "claim"]),
    tierInterest: z.enum(["free", "standard", "featured", "sponsored"]).optional().default("free"),
    contactName: z.string().trim().min(1).max(120),
    contactEmail: safeEmailSchema,
    companyName: z.string().trim().min(1).max(160),
    listingTitle: z.string().trim().min(1).max(180),
    websiteUrl: z.string().trim().max(2048).optional().default(""),
    applyUrl: z.string().trim().max(2048).optional().default(""),
    message: z.string().trim().max(4000).optional().default(""),
  })
  .strict();

export const adminListingLeadsQuerySchema = z.object({
  kind: z.string().trim().toLowerCase().optional().default(""),
  status: z
    .union([listingLeadStatusSchema, z.literal("")])
    .optional()
    .default(""),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  format: z.string().trim().toLowerCase().optional().default(""),
});

export const adminListingLeadsPatchBodySchema = z.object({
  id: z.coerce.number().int().positive(),
  action: z.string().trim().toLowerCase().min(1).max(64),
});

export const adminJobsQuerySchema = z.object({
  status: z
    .union([jobStatusSchema, z.literal("")])
    .optional()
    .default(""),
  tier: z
    .union([jobTierSchema, z.literal("")])
    .optional()
    .default(""),
  source: z
    .union([jobSourceSchema, z.literal("")])
    .optional()
    .default(""),
  sourceKind: z
    .union([jobSourceKindSchema, z.literal("")])
    .optional()
    .default(""),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

export const adminJobsUpsertBodySchema = z
  .object({
    slug: safeSlugSchema,
    title: z.string().trim().min(4).max(180),
    companyName: z.string().trim().min(2).max(160),
    companyUrl: optionalHttpsUrlSchema,
    locationText: z.string().trim().min(2).max(160).optional().default("Remote"),
    summary: z.string().trim().min(80).max(900),
    descriptionMd: z.string().trim().max(8000).optional().default(""),
    employmentType: z.string().trim().max(80).optional().default(""),
    compensationSummary: z.string().trim().max(160).optional().default(""),
    equitySummary: z.string().trim().max(160).optional().default(""),
    bonusSummary: z.string().trim().max(160).optional().default(""),
    benefits: z.array(z.string().trim().min(2).max(180)).max(16).optional(),
    responsibilities: z.array(z.string().trim().min(2).max(240)).max(12).optional(),
    requirements: z.array(z.string().trim().min(2).max(240)).max(12).optional(),
    applyUrl: optionalHttpsUrlSchema.refine((value) => Boolean(value), {
      message: "applyUrl is required",
    }),
    tier: jobTierSchema.optional().default("free"),
    status: jobStatusSchema.optional().default("pending_review"),
    source: jobSourceSchema.optional().default("manual"),
    sourceKind: jobSourceKindSchema.optional().default("employer_submitted"),
    sourceUrl: optionalHttpsUrlSchema,
    firstSeenAt: z.string().trim().max(64).optional().default(""),
    lastCheckedAt: z.string().trim().max(64).optional().default(""),
    sourceCheckedAt: z.string().trim().max(64).optional().default(""),
    staleCheckCount: z.coerce.number().int().min(0).max(20).optional().default(0),
    curationNote: z.string().trim().max(1200).optional().default(""),
    paidPlacementExpiresAt: z.string().trim().max(64).optional().default(""),
    claimedEmployer: z.boolean().optional().default(false),
    postedByEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email()
      .max(320)
      .optional()
      .or(z.literal(""))
      .default(""),
    postedAt: z.string().trim().max(64).optional().default(""),
    expiresAt: z.string().trim().max(64).optional().default(""),
    isRemote: z.boolean().optional().default(true),
    isWorldwide: z.boolean().optional().default(false),
  })
  .strict()
  .superRefine((job, ctx) => {
    const report = validateJobPublicationQuality(job);
    if (report.ok) return;
    for (const message of report.errors) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

export const adminJobsPatchBodySchema = z
  .object({
    slug: safeSlugSchema,
    action: z.enum([
      "review",
      "activate",
      "stale",
      "close",
      "archive",
      "reactivate",
      "expire",
      "revalidate",
    ]),
    checkedAt: z.string().trim().max(64).optional().default(""),
    expiresAt: z.union([z.string().trim().max(64), z.null()]).optional(),
  })
  .strict();

export const intentEventsBodySchema = z.object({
  type: z.enum(["copy", "open", "install", "download", "vote"]),
  entryKey: z
    .union([entryKeySchema, z.literal("")])
    .optional()
    .default(""),
  sessionId: z.string().trim().max(128).optional().default(""),
});

export const communitySignalsQuerySchema = z.object({
  targetKind: z.enum(["entry", "tool"]),
  targetKey: z.string().trim().min(1).max(160),
});

export const communitySignalsBodySchema = communitySignalsQuerySchema.extend({
  signalType: z.enum(["used", "works", "broken"]),
  clientId: z.string().trim().min(8).max(128),
  active: z.boolean().optional().default(true),
});

export const communitySignalsBatchQueryBodySchema = z.object({
  targets: z.array(communitySignalsQuerySchema).max(100).optional().default([]),
});

export const ogQuerySchema = z.object({
  title: z.string().trim().max(120).optional().default("HeyClaude"),
  description: z
    .string()
    .trim()
    .max(220)
    .optional()
    .default(
      "A Claude-native registry for agents, MCP servers, skills, commands, hooks, rules, guides, and tools.",
    ),
  label: z.string().trim().max(64).optional().default("Registry"),
  kind: z
    .enum(["registry", "category", "entry", "job", "tool", "platform"])
    .optional()
    .default("registry"),
  badge: z.string().trim().max(64).optional().default("heyclau.de"),
});

export const brandAssetParamsSchema = z.object({
  kind: z.literal("icon"),
  domain: z
    .string()
    .trim()
    .max(255)
    .refine((value) => Boolean(normalizeBrandDomain(value)), {
      message: "domain must be a canonical brand domain",
    }),
});

export type ApiRouteDefinition = {
  id: string;
  method: "GET" | "POST" | "PATCH";
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  originCheck?: boolean;
  bodyLimitBytes?: number;
  requiresJsonBody?: boolean;
  rateLimit?: {
    scope: string;
    limit: number;
    windowMs: number;
    binding?:
      | "API_REGISTRY_RATE_LIMIT"
      | "API_DYNAMIC_RATE_LIMIT"
      | "API_STRICT_RATE_LIMIT"
      | "API_MCP_RATE_LIMIT";
  };
  querySchema?: z.ZodTypeAny;
  paramsSchema?: z.ZodTypeAny;
  bodySchema?: z.ZodTypeAny;
  responseSchema?: z.ZodTypeAny;
  responseSchemaName?: string;
  responseContentType?: string;
  staticSurface?: boolean;
  auth?: "admin-token" | "resend-signature" | "turnstile";
};

function route(definition: ApiRouteDefinition) {
  return definition;
}

export const apiRouteDefinitions = {
  "registry.manifest": route({
    id: "registry.manifest",
    method: "GET",
    path: "/api/registry/manifest",
    summary: "Registry artifact manifest",
    tags: ["Registry"],
    originCheck: true,
    rateLimit: {
      scope: "registry-manifest",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.categories": route({
    id: "registry.categories",
    method: "GET",
    path: "/api/registry/categories",
    summary: "Registry category summaries",
    tags: ["Registry"],
    originCheck: true,
    rateLimit: {
      scope: "registry-categories",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.search": route({
    id: "registry.search",
    method: "GET",
    path: "/api/registry/search",
    summary: "Search registry entries",
    description:
      "Search entries by query, category, and platform while preserving bounded result size.",
    tags: ["Registry"],
    originCheck: true,
    querySchema: registrySearchQuerySchema,
    responseSchema: registrySearchResponseSchema,
    rateLimit: {
      scope: "registry-search",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.feed": route({
    id: "registry.feed",
    method: "GET",
    path: "/api/registry/feed",
    summary: "Registry feed discovery",
    description:
      "Discovers API, RSS, changelog, category feeds, platform feeds, category and platform shards, and artifact URLs.",
    tags: ["Registry"],
    originCheck: true,
    rateLimit: {
      scope: "registry-feed",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.trending": route({
    id: "registry.trending",
    method: "GET",
    path: "/api/registry/trending",
    summary: "Public registry trending entries",
    description:
      "Returns bounded privacy-safe trending registry entries from aggregate votes, community signals, intent events, and static trust metadata.",
    tags: ["Registry"],
    originCheck: true,
    querySchema: registryTrendingQuerySchema,
    responseSchema: registryTrendingResponseSchema,
    responseSchemaName: "RegistryTrendingResponse",
    rateLimit: {
      scope: "registry-trending",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.diff": route({
    id: "registry.diff",
    method: "GET",
    path: "/api/registry/diff",
    summary: "Registry changelog diff",
    tags: ["Registry"],
    originCheck: true,
    querySchema: registryDiffQuerySchema,
    rateLimit: {
      scope: "registry-diff",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.integrity": route({
    id: "registry.integrity",
    method: "GET",
    path: "/api/registry/integrity",
    summary: "Registry artifact integrity verification",
    description:
      "Lists current registry artifact hashes and verifies submitted artifact/hash pairs against the deployed manifest.",
    tags: ["Registry"],
    originCheck: true,
    querySchema: registryIntegrityQuerySchema,
    rateLimit: {
      scope: "registry-integrity",
      limit: 120,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.entry": route({
    id: "registry.entry",
    method: "GET",
    path: "/api/registry/entries/{category}/{slug}",
    summary: "Registry entry detail",
    description:
      "Returns entry metadata, body content, package facts, platform compatibility, and factual trustSignals when available.",
    tags: ["Registry"],
    originCheck: true,
    paramsSchema: entryParamsSchema,
    rateLimit: {
      scope: "registry-entry",
      limit: 180,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "registry.entryLlms": route({
    id: "registry.entryLlms",
    method: "GET",
    path: "/api/registry/entries/{category}/{slug}/llms",
    summary: "Registry entry LLM text export",
    tags: ["Registry"],
    originCheck: true,
    paramsSchema: entryParamsSchema,
    responseContentType: "text/plain; charset=utf-8",
    rateLimit: {
      scope: "registry-entry-llms",
      limit: 180,
      windowMs: 60_000,
      binding: "API_REGISTRY_RATE_LIMIT",
    },
  }),
  "mcp.streamable": route({
    id: "mcp.streamable",
    method: "POST",
    path: "/api/mcp",
    summary: "Read-only HeyClaude MCP endpoint",
    description:
      "Exposes no-key read-only HeyClaude MCP tools, resources, and prompts over Streamable HTTP for registry search, discovery, entry detail, copyable assets, comparison, compatibility lookup, install guidance, platform adapters, feed discovery, client setup, and submission draft helpers. This endpoint does not publish registry content, create submissions, open PRs, or host package artifacts.",
    tags: ["MCP"],
    originCheck: true,
    requiresJsonBody: true,
    bodyLimitBytes: 64 * 1024,
    rateLimit: {
      scope: "mcp-streamable",
      limit: 60,
      windowMs: 60_000,
      binding: "API_MCP_RATE_LIMIT",
    },
  }),
  "brandAsset.read": route({
    id: "brandAsset.read",
    method: "GET",
    path: "/api/brand-assets/{kind}/{domain}",
    summary: "Resolve a cached brand icon or logo",
    description:
      "Returns a cacheable HeyClaude-hosted brand asset backed by Brandfetch when a registry entry has a validated brand domain.",
    tags: ["Distribution"],
    paramsSchema: brandAssetParamsSchema,
    responseContentType: "image/png",
    rateLimit: {
      scope: "brand-assets",
      limit: 300,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "votes.query": route({
    id: "votes.query",
    method: "POST",
    path: "/api/votes/query",
    summary: "Query vote counts and client state",
    tags: ["Dynamic"],
    originCheck: true,
    bodySchema: votesQueryBodySchema,
    bodyLimitBytes: 16 * 1024,
    rateLimit: {
      scope: "votes-query",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "votes.toggle": route({
    id: "votes.toggle",
    method: "POST",
    path: "/api/votes/toggle",
    summary: "Toggle a vote",
    tags: ["Dynamic"],
    originCheck: true,
    bodySchema: votesToggleBodySchema,
    bodyLimitBytes: 8 * 1024,
    rateLimit: {
      scope: "votes-toggle",
      limit: 45,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "newsletter.subscribe": route({
    id: "newsletter.subscribe",
    method: "POST",
    path: "/api/newsletter/subscribe",
    summary: "Subscribe an email to the newsletter",
    tags: ["Newsletter"],
    originCheck: true,
    bodySchema: newsletterSubscribeBodySchema,
    bodyLimitBytes: 8 * 1024,
    rateLimit: {
      scope: "newsletter-subscribe",
      limit: 15,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "newsletter.webhook": route({
    id: "newsletter.webhook",
    method: "POST",
    path: "/api/newsletter/webhook",
    summary: "Receive Resend webhook events",
    tags: ["Newsletter"],
    requiresJsonBody: true,
    bodyLimitBytes: 256 * 1024,
    auth: "resend-signature",
    rateLimit: {
      scope: "newsletter-webhook",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "submissions.create": route({
    id: "submissions.create",
    method: "POST",
    path: "/api/submissions",
    summary: "Create a reviewable content submission issue",
    description:
      "Validates schema-aligned UGC fields, applies anti-abuse controls, and creates a GitHub issue for review. Eligible source-backed submissions may later be approved for a PR from GitHub automation, but this endpoint never writes content files, publishes registry entries, or hosts community ZIP/MCPB artifacts directly.",
    tags: ["Submissions"],
    originCheck: true,
    bodySchema: submissionBodySchema,
    bodyLimitBytes: 64 * 1024,
    auth: "turnstile",
    rateLimit: {
      scope: "submissions",
      limit: 8,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "submissions.preflight": route({
    id: "submissions.preflight",
    method: "POST",
    path: "/api/submissions/preflight",
    summary: "Preflight a content submission draft",
    description:
      "Runs read-only schema, duplicate, source, package, and safety/privacy checks before a contributor opens a public GitHub submission issue. This endpoint never creates issues, labels, branches, pull requests, registry content, or package artifacts.",
    tags: ["Submissions"],
    originCheck: true,
    bodySchema: submissionPreflightBodySchema,
    responseSchema: submissionPreflightResponseSchema,
    bodyLimitBytes: 64 * 1024,
    rateLimit: {
      scope: "submissions-preflight",
      limit: 30,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "submissions.queue": route({
    id: "submissions.queue",
    method: "GET",
    path: "/api/submissions/queue",
    summary: "List public content submission issue status",
    description:
      "Returns sanitized, read-only status for public content-submission issues. This endpoint reads GitHub issue metadata only; it cannot approve, reject, label, import, create branches, create PRs, or publish registry content.",
    tags: ["Submissions"],
    originCheck: true,
    querySchema: submissionQueueQuerySchema,
    responseSchema: submissionQueueResponseSchema,
    rateLimit: {
      scope: "submissions-queue",
      limit: 60,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  download: route({
    id: "download",
    method: "GET",
    path: "/api/download",
    summary: "Download generated registry packages",
    description:
      "Serves maintainer-built package artifacts from constrained /downloads paths. Community-submitted archives are not exposed through this endpoint unless maintainers rebuild and verify the artifact.",
    tags: ["Distribution"],
    querySchema: downloadQuerySchema,
    responseContentType: "application/octet-stream",
    rateLimit: {
      scope: "asset-download",
      limit: 180,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "listingLeads.create": route({
    id: "listingLeads.create",
    method: "POST",
    path: "/api/listing-leads",
    summary: "Create a commercial listing lead",
    tags: ["Commercial"],
    originCheck: true,
    bodySchema: listingLeadBodySchema,
    bodyLimitBytes: 16 * 1024,
    rateLimit: {
      scope: "listing-leads",
      limit: 12,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "jobs.list": route({
    id: "jobs.list",
    method: "GET",
    path: "/api/jobs",
    summary: "List active reviewed jobs",
    description:
      "Returns active D1-backed job listings for public distribution surfaces such as the jobs board and Raycast. Only reviewed active jobs are returned; private lead, review, payment, and contact fields are excluded.",
    tags: ["Jobs"],
    originCheck: true,
    querySchema: publicJobsQuerySchema,
    responseSchema: publicJobsResponseSchema,
    rateLimit: {
      scope: "jobs-list",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "jobs.detail": route({
    id: "jobs.detail",
    method: "GET",
    path: "/api/jobs/{slug}",
    summary: "Get one active reviewed job",
    description:
      "Returns one active D1-backed public job listing plus a small related set. Expired, closed, stale, unreviewed, or source-unhealthy jobs return 404.",
    tags: ["Jobs"],
    originCheck: true,
    paramsSchema: publicJobParamsSchema,
    responseSchema: publicJobDetailResponseSchema,
    rateLimit: {
      scope: "jobs-detail",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "adminListingLeads.list": route({
    id: "adminListingLeads.list",
    method: "GET",
    path: "/api/admin/listing-leads",
    summary: "Token-protected lead review/export endpoint",
    tags: ["Admin"],
    originCheck: true,
    querySchema: adminListingLeadsQuerySchema,
    auth: "admin-token",
    rateLimit: {
      scope: "admin-listing-leads",
      limit: 60,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "adminListingLeads.update": route({
    id: "adminListingLeads.update",
    method: "PATCH",
    path: "/api/admin/listing-leads",
    summary: "Update listing lead status transition",
    tags: ["Admin"],
    originCheck: true,
    bodySchema: adminListingLeadsPatchBodySchema,
    bodyLimitBytes: 4 * 1024,
    auth: "admin-token",
    rateLimit: {
      scope: "admin-listing-leads",
      limit: 60,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "adminJobs.list": route({
    id: "adminJobs.list",
    method: "GET",
    path: "/api/admin/jobs",
    summary: "Token-protected reviewed jobs list",
    description:
      "Lists D1-backed job records for maintainer review. Public jobs are rendered from active rows only; this admin endpoint can inspect all statuses.",
    tags: ["Admin"],
    originCheck: true,
    querySchema: adminJobsQuerySchema,
    auth: "admin-token",
    rateLimit: {
      scope: "admin-jobs",
      limit: 60,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "adminJobs.upsert": route({
    id: "adminJobs.upsert",
    method: "POST",
    path: "/api/admin/jobs",
    summary: "Create or update a reviewed D1 job",
    description:
      "Creates or updates a private D1 job record after maintainer review. This endpoint never writes public repository content.",
    tags: ["Admin"],
    originCheck: true,
    bodySchema: adminJobsUpsertBodySchema,
    bodyLimitBytes: 32 * 1024,
    auth: "admin-token",
    rateLimit: {
      scope: "admin-jobs",
      limit: 45,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "adminJobs.update": route({
    id: "adminJobs.update",
    method: "PATCH",
    path: "/api/admin/jobs",
    summary: "Transition reviewed D1 job state",
    description:
      "Transitions reviewed job rows through active, stale, closed, archived, and revalidated states without publishing repo content.",
    tags: ["Admin"],
    originCheck: true,
    bodySchema: adminJobsPatchBodySchema,
    bodyLimitBytes: 4 * 1024,
    auth: "admin-token",
    rateLimit: {
      scope: "admin-jobs",
      limit: 45,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "adminJobs.health": route({
    id: "adminJobs.health",
    method: "GET",
    path: "/api/admin/jobs/health",
    summary: "Token-protected D1 jobs health check",
    description:
      "Checks the jobs D1 schema, required columns, and status counts before release or operational review.",
    tags: ["Admin"],
    originCheck: true,
    auth: "admin-token",
    rateLimit: {
      scope: "admin-jobs-health",
      limit: 60,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "intentEvents.create": route({
    id: "intentEvents.create",
    method: "POST",
    path: "/api/intent-events",
    summary: "Store a low-risk intent event",
    tags: ["Dynamic"],
    originCheck: true,
    bodySchema: intentEventsBodySchema,
    bodyLimitBytes: 4 * 1024,
    rateLimit: {
      scope: "intent-events",
      limit: 60,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "communitySignals.read": route({
    id: "communitySignals.read",
    method: "GET",
    path: "/api/community-signals",
    summary: "Read community signal counts",
    tags: ["Dynamic"],
    originCheck: true,
    querySchema: communitySignalsQuerySchema,
    rateLimit: {
      scope: "community-signals-read",
      limit: 180,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "communitySignals.write": route({
    id: "communitySignals.write",
    method: "POST",
    path: "/api/community-signals",
    summary: "Store community signal state",
    tags: ["Dynamic"],
    originCheck: true,
    bodySchema: communitySignalsBodySchema,
    bodyLimitBytes: 8 * 1024,
    rateLimit: {
      scope: "community-signals-write",
      limit: 45,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "communitySignals.query": route({
    id: "communitySignals.query",
    method: "POST",
    path: "/api/community-signals/query",
    summary: "Read community signal counts for multiple targets",
    description:
      "Returns aggregate used/works/broken counts for up to 100 entry or tool targets without exposing client identifiers.",
    tags: ["Dynamic"],
    originCheck: true,
    bodySchema: communitySignalsBatchQueryBodySchema,
    bodyLimitBytes: 16 * 1024,
    rateLimit: {
      scope: "community-signals-query",
      limit: 90,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "githubStats.read": route({
    id: "githubStats.read",
    method: "GET",
    path: "/api/github-stats",
    summary: "Read cached GitHub repository stats",
    tags: ["Dynamic"],
    responseSchema: githubStatsResponseSchema,
    rateLimit: {
      scope: "github-stats",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "publicAlerts.read": route({
    id: "publicAlerts.read",
    method: "GET",
    path: "/api/public/alerts",
    summary: "Read public registry alert events",
    description:
      "Returns the current in-edge-cache registry event list used by browser-local watch alerts. Cold cache or missing webhook configuration returns an empty events array rather than simulated activity.",
    tags: ["Dynamic"],
    responseSchema: publicAlertsResponseSchema,
    rateLimit: {
      scope: "public-alerts",
      limit: 180,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "publicFeeds.health": route({
    id: "publicFeeds.health",
    method: "GET",
    path: "/api/public/feeds/health",
    summary: "Read public feed health metadata",
    description:
      "Returns deterministic feed item counts, freshness, and ETag metadata for every public distribution feed.",
    tags: ["Distribution"],
    responseSchema: publicFeedsHealthResponseSchema,
    rateLimit: {
      scope: "public-feeds-health",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    },
  }),
  "og.render": route({
    id: "og.render",
    method: "GET",
    path: "/api/og",
    summary: "Generate social preview image",
    tags: ["Distribution"],
    querySchema: ogQuerySchema,
    responseContentType: "image/png",
    rateLimit: {
      scope: "og-image",
      limit: 90,
      windowMs: 60_000,
      binding: "API_STRICT_RATE_LIMIT",
    },
  }),
  "static.rss": route({
    id: "static.rss",
    method: "GET",
    path: "/feed.xml",
    summary: "RSS feed",
    tags: ["Distribution"],
    staticSurface: true,
    responseContentType: "application/rss+xml",
  }),
  "static.atom": route({
    id: "static.atom",
    method: "GET",
    path: "/atom.xml",
    summary: "Atom feed",
    tags: ["Distribution"],
    staticSurface: true,
    responseContentType: "application/atom+xml",
  }),
  "static.feedIndex": route({
    id: "static.feedIndex",
    method: "GET",
    path: "/data/feeds/index.json",
    summary: "Static feed index",
    tags: ["Distribution"],
    staticSurface: true,
  }),
  "static.categoryFeed": route({
    id: "static.categoryFeed",
    method: "GET",
    path: "/data/feeds/categories/{category}.json",
    summary: "Static category feed",
    tags: ["Distribution"],
    staticSurface: true,
    paramsSchema: z.object({ category: safeSlugSchema }),
  }),
  "static.platformFeed": route({
    id: "static.platformFeed",
    method: "GET",
    path: "/data/feeds/platforms/{platform}.json",
    summary: "Static platform feed",
    tags: ["Distribution"],
    staticSurface: true,
    paramsSchema: z.object({ platform: safeSlugSchema }),
  }),
} as const;

export type ApiRouteId = keyof typeof apiRouteDefinitions;

export function getApiRouteDefinition(id: ApiRouteId) {
  return apiRouteDefinitions[id];
}

export function listApiRouteDefinitions() {
  return Object.values(apiRouteDefinitions);
}

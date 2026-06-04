export const LISTING_LEAD_KINDS = ["job", "tool", "claim"];
export const COMMERCIAL_TIERS = ["free", "standard", "featured", "sponsored"];
export const PAID_JOB_TIERS = ["standard", "featured", "sponsored"];
export const JOB_PUBLICATION_QUALITY_RULES = {
  summaryMinLength: 120,
  descriptionMinLength: 300,
  minimumResponsibilities: 3,
  minimumRequirements: 3,
  minimumBenefits: 2,
};
export const JOB_PUBLIC_EXPOSURE_RULES = {
  summaryMinLength: 120,
  detailMinLength: 240,
  minimumResponsibilities: 2,
  minimumRequirements: 2,
};
export const COMMERCIAL_PLACEMENT_TARGETS = ["job", "tool", "entry"];
export const DISCLOSURE_STATES = [
  "editorial",
  "heyclaude_pick",
  "affiliate",
  "sponsored",
  "claimed",
];
export const COMMERCIAL_STATUSES = [
  "new",
  "pending_review",
  "approved",
  "active",
  "rejected",
  "expired",
  "archived",
];
export const JOB_SOURCE_STATUSES = ["active", "stale_pending_review", "closed"];

export function normalizeCommercialTier(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return COMMERCIAL_TIERS.includes(normalized) ? normalized : "free";
}

export function normalizeLeadKind(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return LISTING_LEAD_KINDS.includes(normalized) ? normalized : "tool";
}

export function normalizeDisclosure(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (DISCLOSURE_STATES.includes(normalized)) return normalized;
  return "editorial";
}

export function isPaidOrAffiliateDisclosure(value) {
  const disclosure = normalizeDisclosure(value);
  return disclosure === "sponsored" || disclosure === "affiliate";
}

export function normalizePricingModel(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (
    [
      "free",
      "freemium",
      "paid",
      "open-source",
      "subscription",
      "usage-based",
      "contact-sales",
    ].includes(normalized)
  ) {
    return normalized;
  }
  return "";
}

export function validateListingLeadPayload(payload = {}) {
  const errors = [];
  const kind = normalizeLeadKind(payload.kind);
  const tierInterest = normalizeCommercialTier(payload.tierInterest);
  const contactName = String(payload.contactName || "").trim();
  const contactEmail = String(payload.contactEmail || "")
    .trim()
    .toLowerCase();
  const companyName = String(payload.companyName || "").trim();
  const listingTitle = String(payload.listingTitle || "").trim();
  const websiteUrl = String(payload.websiteUrl || "").trim();
  const applyUrl = String(payload.applyUrl || "").trim();
  const message = String(payload.message || "").trim();

  if (!contactName) errors.push("contactName is required");
  const emailParts = contactEmail.split("@");
  const emailDomain = emailParts[1] || "";
  // Require a dotted domain with non-empty labels on both sides of every dot,
  // so trailing-dot / empty-label domains ("user@example.", "user@.com") are
  // rejected rather than passing on a bare includes(".") check.
  const domainLabels = emailDomain.split(".");
  const hasValidDomain =
    domainLabels.length >= 2 && domainLabels.every((label) => label.length > 0);
  if (
    emailParts.length !== 2 ||
    !emailParts[0] ||
    !hasValidDomain ||
    contactEmail.includes(" ")
  ) {
    errors.push("valid contactEmail is required");
  }
  if (!companyName) errors.push("companyName is required");
  if (!listingTitle) errors.push("listingTitle is required");
  if (
    (kind === "tool" || kind === "claim") &&
    !/^https:\/\//i.test(websiteUrl)
  ) {
    errors.push(`${kind} leads require an https websiteUrl`);
  }
  if (kind === "job" && !/^https:\/\//i.test(applyUrl)) {
    errors.push("job leads require an https applyUrl");
  }

  return {
    ok: errors.length === 0,
    errors,
    data: {
      kind,
      tierInterest,
      contactName,
      contactEmail,
      companyName,
      listingTitle,
      websiteUrl,
      applyUrl,
      message,
    },
  };
}

function textValue(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function listValue(value) {
  if (Array.isArray(value)) {
    return value.map(textValue).filter(Boolean);
  }
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return listValue(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

function firstValue(...values) {
  for (const value of values) {
    const normalized = textValue(value);
    if (normalized) return normalized;
  }
  return "";
}

function hasHttpsUrl(value) {
  return /^https:\/\//i.test(textValue(value));
}

export function validateJobPublicationQuality(job = {}) {
  const tier = normalizeCommercialTier(job.tier);
  const status = textValue(job.status).toLowerCase();
  const requiresGate = status === "active" && PAID_JOB_TIERS.includes(tier);
  const errors = [];

  if (!requiresGate) {
    return { ok: true, required: false, errors };
  }

  const summary = firstValue(job.summary, job.description);
  const details = firstValue(job.descriptionMd, job.description_md);
  const responsibilities = listValue(
    job.responsibilities ?? job.responsibilities_json,
  );
  const requirements = listValue(job.requirements ?? job.requirements_json);
  const benefits = listValue(job.benefits ?? job.benefits_json);
  const compensation = firstValue(
    job.compensationSummary,
    job.compensation_summary,
    job.compensation,
  );
  const employmentType = firstValue(
    job.employmentType,
    job.employment_type,
    job.type,
  );
  const sourceUrl = firstValue(job.sourceUrl, job.source_url, job.applyUrl);
  const postedAt = firstValue(job.postedAt, job.posted_at);
  const expiresAt = firstValue(job.expiresAt, job.expires_at);
  const checkedAt = firstValue(
    job.sourceCheckedAt,
    job.source_checked_at,
    job.lastCheckedAt,
    job.last_checked_at,
  );

  if (summary.length < JOB_PUBLICATION_QUALITY_RULES.summaryMinLength) {
    errors.push(
      `paid active jobs require a ${JOB_PUBLICATION_QUALITY_RULES.summaryMinLength}+ character original summary`,
    );
  }
  if (details.length < JOB_PUBLICATION_QUALITY_RULES.descriptionMinLength) {
    errors.push(
      `paid active jobs require ${JOB_PUBLICATION_QUALITY_RULES.descriptionMinLength}+ characters of original role detail`,
    );
  }
  if (
    responsibilities.length <
    JOB_PUBLICATION_QUALITY_RULES.minimumResponsibilities
  ) {
    errors.push(
      `paid active jobs require at least ${JOB_PUBLICATION_QUALITY_RULES.minimumResponsibilities} responsibilities`,
    );
  }
  if (requirements.length < JOB_PUBLICATION_QUALITY_RULES.minimumRequirements) {
    errors.push(
      `paid active jobs require at least ${JOB_PUBLICATION_QUALITY_RULES.minimumRequirements} requirements`,
    );
  }
  if (benefits.length < JOB_PUBLICATION_QUALITY_RULES.minimumBenefits) {
    errors.push(
      `paid active jobs require at least ${JOB_PUBLICATION_QUALITY_RULES.minimumBenefits} benefits or perks`,
    );
  }
  if (!compensation) {
    errors.push("paid active jobs require a salary or compensation range");
  }
  if (!employmentType) {
    errors.push("paid active jobs require an employment type");
  }
  if (!hasHttpsUrl(sourceUrl)) {
    errors.push("paid active jobs require an HTTPS source or apply URL");
  }
  if (!postedAt) {
    errors.push("paid active jobs require a postedAt date");
  }
  if (!expiresAt) {
    errors.push("paid active jobs require an expiresAt/validThrough date");
  }
  if (!checkedAt) {
    errors.push("paid active jobs require a last source verification date");
  }

  return {
    ok: errors.length === 0,
    required: true,
    errors,
  };
}

export function validateJobPublicExposure(job = {}, options = {}) {
  const status = textValue(job.status).toLowerCase();
  if (status && status !== "active") {
    return { ok: true, required: false, errors: [] };
  }

  const errors = [];
  const sourceTruth = options.sourceTruth || {};
  const summary = firstValue(job.summary, job.description);
  const details = firstValue(job.descriptionMd, job.description_md);
  const responsibilities = listValue(
    job.responsibilities ?? job.responsibilities_json,
  );
  const requirements = listValue(job.requirements ?? job.requirements_json);
  const source = textValue(job.source).toLowerCase();
  const sourceKind = textValue(job.sourceKind ?? job.source_kind).toLowerCase();
  const applyUrl = firstValue(job.applyUrl, job.apply_url);
  const sourceUrl = firstValue(job.sourceUrl, job.source_url, applyUrl);
  const checkedAt = firstValue(
    job.sourceCheckedAt,
    job.source_checked_at,
    job.lastCheckedAt,
    job.last_checked_at,
  );
  const hasLiveSourceTruth = sourceTruth.sourceOk === true;

  if (summary.length < JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength) {
    errors.push(
      `active jobs require a ${JOB_PUBLIC_EXPOSURE_RULES.summaryMinLength}+ character reviewed summary`,
    );
  }
  if (!hasHttpsUrl(applyUrl)) {
    errors.push("active jobs require an HTTPS employer apply URL");
  }
  if (!hasHttpsUrl(sourceUrl)) {
    errors.push("active jobs require an HTTPS source URL");
  }
  if (!checkedAt && !hasLiveSourceTruth) {
    errors.push("active jobs require a source verification date");
  }
  if (
    source === "curated" &&
    sourceKind !== "official_ats" &&
    sourceKind !== "employer_careers"
  ) {
    errors.push(
      "curated active jobs require an official ATS or employer careers source",
    );
  }

  const hasDetailedPage =
    details.length >= JOB_PUBLIC_EXPOSURE_RULES.detailMinLength;
  const hasStructuredDepth =
    responsibilities.length >=
      JOB_PUBLIC_EXPOSURE_RULES.minimumResponsibilities &&
    requirements.length >= JOB_PUBLIC_EXPOSURE_RULES.minimumRequirements;

  if (!hasDetailedPage && !hasStructuredDepth) {
    errors.push(
      `active jobs require ${JOB_PUBLIC_EXPOSURE_RULES.detailMinLength}+ characters of reviewed detail or at least ${JOB_PUBLIC_EXPOSURE_RULES.minimumResponsibilities} responsibilities and ${JOB_PUBLIC_EXPOSURE_RULES.minimumRequirements} requirements`,
    );
  }

  if (sourceTruth.sourceOk === false) {
    errors.push("source check must confirm the role is still available");
  }
  if (sourceTruth.titleMatched === false) {
    errors.push("source page must match the reviewed job title");
  }
  if (sourceTruth.companyMatched === false) {
    errors.push("source page must match the reviewed company");
  }
  if (sourceTruth.closureDetected === true) {
    errors.push("source page must not show closed or filled-role copy");
  }
  if (sourceTruth.applyDetected === false) {
    errors.push("source page must still expose an apply path");
  }

  const paidReport = validateJobPublicationQuality({
    ...job,
    status: "active",
  });
  if (!paidReport.ok) {
    errors.push(...paidReport.errors);
  }

  return {
    ok: errors.length === 0,
    required: true,
    errors: [...new Set(errors)],
  };
}

export function evaluateJobSourceLifecycle(input = {}, now = new Date()) {
  const currentStatus = String(input.currentStatus || "active")
    .trim()
    .toLowerCase();
  const tier = normalizeCommercialTier(input.tier);
  const staleCheckCount = Math.max(
    0,
    Number.isFinite(Number(input.staleCheckCount))
      ? Math.trunc(Number(input.staleCheckCount))
      : 0,
  );
  const expiresAt = input.expiresAt || "";
  const paidPlacementExpiresAt = input.paidPlacementExpiresAt || "";
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const expiryTime = expiresAt ? new Date(expiresAt).getTime() : null;
  const paidExpiryTime = paidPlacementExpiresAt
    ? new Date(paidPlacementExpiresAt).getTime()
    : null;
  const expired =
    expiryTime !== null && Number.isFinite(expiryTime) && expiryTime < nowTime;
  const paidPlacementExpired =
    paidExpiryTime !== null &&
    Number.isFinite(paidExpiryTime) &&
    paidExpiryTime < nowTime;
  const paidOrPlacementScoped =
    PAID_JOB_TIERS.includes(tier) || Boolean(paidPlacementExpiresAt);
  const sourceHealthy =
    input.sourceOk === true &&
    input.titleMatched !== false &&
    input.companyMatched !== false &&
    input.closureDetected !== true &&
    input.applyDetected === true;

  if (currentStatus === "closed" || currentStatus === "archived") {
    return {
      status: "closed",
      staleCheckCount,
      indexable: false,
      reason: currentStatus,
    };
  }

  if (paidPlacementExpired || (expired && paidOrPlacementScoped)) {
    return {
      status: "closed",
      staleCheckCount,
      indexable: false,
      reason: paidPlacementExpired ? "paid_placement_expired" : "expired",
    };
  }

  if (sourceHealthy) {
    return {
      status: "active",
      staleCheckCount: 0,
      indexable: true,
      reason: expired ? "source_verified_expiry_refreshed" : "source_verified",
      expiresAt: expired ? null : expiresAt || undefined,
    };
  }

  if (expired) {
    return {
      status: "stale_pending_review",
      staleCheckCount: staleCheckCount + 1,
      indexable: false,
      reason: "expired_source_unverified",
    };
  }

  if (staleCheckCount <= 0) {
    return {
      status: "stale_pending_review",
      staleCheckCount: 1,
      indexable: false,
      reason: "first_failed_source_check",
    };
  }

  return {
    status: "closed",
    staleCheckCount: staleCheckCount + 1,
    indexable: false,
    reason: "repeated_failed_source_check",
  };
}

export function normalizeCommercialStatus(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return COMMERCIAL_STATUSES.includes(normalized) ? normalized : "new";
}

export function isPlacementActive(placement = {}, now = new Date()) {
  const status = normalizeCommercialStatus(placement.status || "active");
  if (status !== "active") return false;

  const startsAt = placement.startsAt || placement.starts_at;
  const expiresAt = placement.expiresAt || placement.expires_at;
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const startTime = startsAt ? new Date(startsAt).getTime() : null;
  const expiryTime = expiresAt ? new Date(expiresAt).getTime() : null;

  if (startTime && Number.isFinite(startTime) && startTime > nowTime)
    return false;
  if (expiryTime && Number.isFinite(expiryTime) && expiryTime < nowTime)
    return false;
  return true;
}

export function linkRelForDisclosure(value) {
  return isPaidOrAffiliateDisclosure(value)
    ? "sponsored nofollow noreferrer"
    : "noreferrer";
}

export function toolPlacementRank(tool = {}) {
  return (
    Number(Boolean(tool.sponsored)) * 3 + Number(Boolean(tool.featured)) * 2
  );
}

export function compareToolListings(left = {}, right = {}) {
  const rankDelta = toolPlacementRank(right) - toolPlacementRank(left);
  if (rankDelta !== 0) return rankDelta;

  const dateDelta = String(right.dateAdded || "").localeCompare(
    String(left.dateAdded || ""),
  );
  if (dateDelta !== 0) return dateDelta;

  return String(left.title || left.slug || "").localeCompare(
    String(right.title || right.slug || ""),
  );
}

export function nextLeadStatus(currentStatus, action) {
  const current = normalizeCommercialStatus(currentStatus);
  const normalizedAction = String(action || "")
    .trim()
    .toLowerCase();
  const transitions = {
    new: {
      review: "pending_review",
      approve: "approved",
      reject: "rejected",
      archive: "archived",
    },
    pending_review: {
      approve: "approved",
      reject: "rejected",
      archive: "archived",
    },
    approved: {
      activate: "active",
      reject: "rejected",
      archive: "archived",
    },
    active: {
      expire: "expired",
      archive: "archived",
    },
    rejected: {
      archive: "archived",
    },
    expired: {
      archive: "archived",
    },
    archived: {},
  };

  return transitions[current]?.[normalizedAction] ?? current;
}

export function summarizePlacementExpiry(
  placements = [],
  now = new Date(),
  reminderWindowDays = 14,
) {
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const windowMs = reminderWindowDays * 86_400_000;

  return placements
    .map((placement) => {
      const expiresAt = placement.expiresAt || placement.expires_at;
      const expiryTime = expiresAt ? new Date(expiresAt).getTime() : null;
      const daysUntilExpiry =
        expiryTime && Number.isFinite(expiryTime)
          ? Math.ceil((expiryTime - nowTime) / 86_400_000)
          : null;
      const status = normalizeCommercialStatus(placement.status || "active");

      return {
        targetKind: placement.targetKind || placement.target_kind || "",
        targetKey: placement.targetKey || placement.target_key || "",
        tier: normalizeCommercialTier(placement.tier),
        status,
        expiresAt: expiresAt || "",
        daysUntilExpiry,
        needsRenewalReminder:
          status === "active" &&
          daysUntilExpiry !== null &&
          daysUntilExpiry >= 0 &&
          daysUntilExpiry <= Math.ceil(windowMs / 86_400_000),
        expired:
          status === "active" &&
          daysUntilExpiry !== null &&
          daysUntilExpiry < 0,
      };
    })
    .sort((left, right) => {
      const leftDays = left.daysUntilExpiry ?? Number.POSITIVE_INFINITY;
      const rightDays = right.daysUntilExpiry ?? Number.POSITIVE_INFINITY;
      return (
        leftDays - rightDays || left.targetKey.localeCompare(right.targetKey)
      );
    });
}

export function buildPlacementRenewalReminder(summary) {
  if (!summary?.needsRenewalReminder) return "";
  return [
    `${summary.tier} ${summary.targetKind} placement ${summary.targetKey} expires in ${summary.daysUntilExpiry} day${summary.daysUntilExpiry === 1 ? "" : "s"}.`,
    "Review performance, confirm disclosure remains accurate, and contact the sponsor before expiry.",
  ].join(" ");
}

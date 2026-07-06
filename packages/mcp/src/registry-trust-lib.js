import { SITE_URL } from "./platforms.js";
import { publicUrlHostname } from "./public-url-lib.js";
import { unique } from "./registry-collection-lib.js";
import { notes } from "./registry-response-lib.js";
import {
  entryClaimStatusValue,
  entryPackageTrustValue,
  entrySourceStatusValue,
} from "./search-ranking.js";

// Deterministic, disclosure-only trust signals. Each signal reflects whether a
// piece of trust metadata is present, NOT whether the entry is safe. Coverage
// is metadata completeness, never a safety verdict or install approval.
export const TRUST_SIGNAL_KEYS = [
  "source-available",
  "repo-url",
  "documentation-url",
  "trusted-package",
  "package-checksum",
  "safety-notes",
  "privacy-notes",
  "review-provenance",
];

export function entryCanonicalUrl(entry) {
  return (
    entry.canonicalUrl ||
    entry.url ||
    `${SITE_URL}/entry/${entry.category}/${entry.slug}`
  );
}

export function sourceHost(value) {
  return publicUrlHostname(String(value || "").trim());
}

export function entrySourceHosts(entry) {
  return [
    entry.documentationUrl,
    entry.repoUrl,
    entry.url,
    entry.canonicalUrl,
    entry.llmsUrl,
    entry.apiUrl,
  ]
    .map(sourceHost)
    .filter(Boolean);
}

export function sourceSummary(entry) {
  return {
    repoUrl: entry.repoUrl || entry.githubUrl || "",
    documentationUrl: entry.documentationUrl || "",
    downloadUrl: entry.downloadUrl || "",
    sourceHosts: unique(entrySourceHosts(entry)),
    githubStars:
      typeof entry.githubStars === "number" ? entry.githubStars : null,
    githubForks:
      typeof entry.githubForks === "number" ? entry.githubForks : null,
    repoUpdatedAt: entry.repoUpdatedAt || null,
    downloadTrust: entry.downloadTrust || null,
  };
}

export function entryTrustRecommendations(entry) {
  const recommendations = [];
  const safetyNotes = notes(entry.safetyNotes);
  const privacyNotes = notes(entry.privacyNotes);
  const packageTrust = entryPackageTrustValue(entry);
  const source = sourceSummary(entry);

  if (!source.repoUrl && !source.documentationUrl) {
    recommendations.push(
      "Verify a canonical source before relying on this entry.",
    );
  }
  if (packageTrust === "external") {
    recommendations.push(
      "Review the upstream package source and checksum before installing.",
    );
  }
  if (entry.downloadUrl && packageTrust !== "first-party") {
    recommendations.push(
      "Treat the download as external unless maintainers have rebuilt and verified it.",
    );
  }
  if (!safetyNotes.length) {
    recommendations.push(
      "No structured safety notes are present; inspect commands and permissions manually.",
    );
  }
  if (!privacyNotes.length) {
    recommendations.push(
      "No structured privacy notes are present; review file, credential, telemetry, and network behavior manually.",
    );
  }
  return unique(recommendations).slice(0, 6);
}

export function entryTrustSummary(entry) {
  const safetyNotes = notes(entry.safetyNotes);
  const privacyNotes = notes(entry.privacyNotes);
  const source = sourceSummary(entry);
  const packageTrust = entryPackageTrustValue(entry);
  const claimStatus = entryClaimStatusValue(entry);
  return {
    source: {
      status: entrySourceStatusValue(entry),
      repoUrl: source.repoUrl,
      documentationUrl: source.documentationUrl,
      sourceHosts: source.sourceHosts,
      githubStars: source.githubStars,
      githubForks: source.githubForks,
      repoUpdatedAt: source.repoUpdatedAt,
    },
    package: {
      downloadUrl: source.downloadUrl,
      downloadTrust: packageTrust,
      packageVerified: Boolean(
        entry.packageVerified || entry.trustSignals?.packageVerified,
      ),
      checksum:
        entry.checksum ||
        entry.packageChecksum ||
        entry.downloadSha256 ||
        entry.skillPackage?.sha256 ||
        "",
    },
    disclosures: {
      safetyNotes,
      privacyNotes,
      hasSafetyNotes: safetyNotes.length > 0,
      hasPrivacyNotes: privacyNotes.length > 0,
    },
    review: {
      claimStatus,
      reviewedBy: entry.reviewedBy || "",
      reviewedAt: entry.reviewedAt || "",
      submittedBy: entry.submittedBy || "",
      sourceSubmissionUrl: entry.sourceSubmissionUrl || "",
    },
    recommendations: entryTrustRecommendations(entry),
  };
}

export function entryTrustSignalCoverage(entry) {
  const trust = entryTrustSummary(entry);
  const present = [];
  if (trust.source.status === "available") present.push("source-available");
  if (trust.source.repoUrl) present.push("repo-url");
  if (trust.source.documentationUrl) present.push("documentation-url");
  if (
    trust.package.downloadTrust === "first-party" ||
    trust.package.packageVerified
  ) {
    present.push("trusted-package");
  }
  if (trust.package.checksum) present.push("package-checksum");
  if (trust.disclosures.hasSafetyNotes) present.push("safety-notes");
  if (trust.disclosures.hasPrivacyNotes) present.push("privacy-notes");
  if (trust.review.reviewedBy || trust.review.claimStatus === "verified") {
    present.push("review-provenance");
  }
  const presentSet = new Set(present);
  const presentOrdered = TRUST_SIGNAL_KEYS.filter((key) => presentSet.has(key));
  const missing = TRUST_SIGNAL_KEYS.filter((key) => !presentSet.has(key));
  return {
    score: presentOrdered.length,
    max: TRUST_SIGNAL_KEYS.length,
    present: presentOrdered,
    missing,
  };
}

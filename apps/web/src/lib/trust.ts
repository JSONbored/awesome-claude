import type { Entry } from "@/types/registry";

export type TrustSeverity = "ok" | "info" | "warning" | "blocker";

export interface TrustReason {
  id: string;
  severity: TrustSeverity;
  label: string;
  detail: string;
  /** Section anchor on /quality explaining the check. */
  docHref?: string;
  /** External source link (repo, package, signature). */
  sourceHref?: string;
  sourceLabel?: string;
}

const isFresh = (iso?: string, days = 60) => {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < days * 86_400_000;
};

export function getTrustReasons(entry: Entry): TrustReason[] {
  const reasons: TrustReason[] = [];

  // Trust posture
  reasons.push({
    id: "trust-level",
    severity:
      entry.trust === "trusted"
        ? "ok"
        : entry.trust === "review"
          ? "warning"
          : entry.trust === "limited"
            ? "warning"
            : "blocker",
    label: `Trust posture: ${entry.trust}`,
    detail:
      entry.trust === "trusted"
        ? "Reviewed by a maintainer and source-checked."
        : entry.trust === "review"
          ? "Read the source before installing. Surface-level review only."
          : entry.trust === "limited"
            ? "Limited support — small surface, infrequent updates, or narrow review."
            : "Blocked from automatic install. Do not run without human review.",
    docHref: "/quality#trust-levels",
  });

  // Source provenance
  reasons.push({
    id: "source",
    severity:
      entry.source === "first-party"
        ? "ok"
        : entry.source === "source-backed"
          ? "ok"
          : entry.source === "external"
            ? "info"
            : "warning",
    label: `Source: ${entry.source}`,
    detail:
      entry.source === "first-party"
        ? "Published by the original maintainer."
        : entry.source === "source-backed"
          ? "Has a public repository and visible commit history."
          : entry.source === "external"
            ? "Hosted off-registry. Verify the maintainer before installing."
            : "No source repository linked. Treat as unverified.",
    docHref: "/quality#source-provenance",
    sourceHref: entry.sourceUrl ?? entry.repoUrl,
    sourceLabel: entry.sourceUrl || entry.repoUrl ? "Repository" : undefined,
  });

  // Claim status
  reasons.push({
    id: "claim",
    severity: entry.claimed ? "ok" : "info",
    label: entry.claimed ? "Listing claimed" : "Listing unclaimed",
    detail: entry.claimed
      ? "The maintainer has claimed this listing and can update it."
      : "Anyone can claim this listing with proof of ownership.",
    docHref: "/claim",
  });

  // Reviewer attribution
  reasons.push({
    id: "reviewed",
    severity: entry.reviewed ? "ok" : "warning",
    label: entry.reviewed ? "Maintainer-reviewed" : "Awaiting maintainer review",
    detail: entry.reviewed
      ? "A maintainer signed off on the metadata."
      : "No maintainer has reviewed this entry yet.",
    docHref: "/validators",
  });

  // Safety notes
  reasons.push({
    id: "safety",
    severity: entry.safetyNotes || entry.safetyNotesList?.length ? "ok" : "warning",
    label:
      entry.safetyNotes || entry.safetyNotesList?.length
        ? "Safety notes present"
        : "Safety notes missing",
    detail:
      entry.safetyNotes ||
      (entry.safetyNotesList ?? []).join(" ") ||
      "No safety notes provided. Risk-bearing categories should declare what they execute and which paths they touch.",
    docHref: "/quality#safety-notes",
  });

  // Privacy notes
  reasons.push({
    id: "privacy",
    severity: entry.privacyNotes || entry.privacyNotesList?.length ? "ok" : "info",
    label:
      entry.privacyNotes || entry.privacyNotesList?.length
        ? "Privacy notes present"
        : "Privacy notes missing",
    detail:
      entry.privacyNotes ||
      (entry.privacyNotesList ?? []).join(" ") ||
      "No privacy notes provided. Verify before sending sensitive data through this resource.",
    docHref: "/quality#privacy-notes",
  });

  // Checksum
  if (entry.downloadUrl || entry.downloadSha256) {
    reasons.push({
      id: "checksum",
      severity: entry.downloadSha256 ? "ok" : "warning",
      label: entry.downloadSha256 ? "Package checksum recorded" : "No package checksum",
      detail: entry.downloadSha256
        ? `SHA-256 ${entry.downloadSha256.slice(0, 16)}… pinned for this release.`
        : "Downloads are not pinned to a SHA-256 — cannot verify byte-for-byte integrity.",
      docHref: "/quality#integrity",
    });
  }

  // Package verification
  if (entry.packageVerified !== undefined) {
    reasons.push({
      id: "package-verified",
      severity: entry.packageVerified ? "ok" : "warning",
      label: entry.packageVerified ? "Package verified" : "Package not verified",
      detail: entry.packageVerified
        ? "Published package matches the source repository."
        : "Published package was not cross-checked against the source repo.",
      docHref: "/quality#integrity",
    });
  }

  // Prerequisites
  if (entry.prerequisites?.length) {
    reasons.push({
      id: "prereqs",
      severity: "info",
      label: `${entry.prerequisites.length} prerequisite${entry.prerequisites.length === 1 ? "" : "s"}`,
      detail: entry.prerequisites.join(" · "),
    });
  }

  // Freshness
  const ts = entry.brandVerifiedAt ?? entry.reviewedAt ?? entry.submittedAt;
  if (ts) {
    reasons.push({
      id: "freshness",
      severity: isFresh(ts) ? "ok" : "warning",
      label: isFresh(ts) ? "Recently verified" : "Stale verification",
      detail: `Last verified ${ts}. We flag entries that haven't been re-checked in 60 days.`,
      docHref: "/quality#freshness",
    });
  }

  return reasons;
}

export function summarizeTrust(reasons: TrustReason[]) {
  const counts = { ok: 0, info: 0, warning: 0, blocker: 0 };
  for (const r of reasons) counts[r.severity]++;
  return counts;
}

export type InstallRisk = "low" | "review" | "high";

/**
 * Derive a single install-risk verdict from trust reasons.
 * - high: any blocker, or trust=blocked
 * - review: any warning, or trust !== trusted
 * - low: source-backed or first-party with no warnings
 */
export function installRiskLevel(entry: Entry): InstallRisk {
  const reasons = getTrustReasons(entry);
  const counts = summarizeTrust(reasons);
  if (counts.blocker > 0 || entry.trust === "blocked") return "high";
  if (counts.warning > 0 || entry.trust !== "trusted") return "review";
  return "low";
}

export const INSTALL_RISK_LABEL: Record<InstallRisk, string> = {
  low: "Low risk",
  review: "Review first",
  high: "High risk",
};

export const INSTALL_RISK_DETAIL: Record<InstallRisk, string> = {
  low: "Source-backed and reviewed. Standard caution still applies.",
  review: "Open the source and read safety notes before installing.",
  high: "Do not install without human review.",
};

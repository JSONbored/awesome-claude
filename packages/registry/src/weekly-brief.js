import { generatedAtForEntries, SITE_URL, truncateText } from "./artifacts.js";

export const WEEKLY_BRIEF_SCHEMA_VERSION = 1;

const DEFAULT_LIMITS = {
  newEntries: 8,
  sourceBacked: 6,
  saferInstalls: 6,
  notableChanges: 8,
};

function text(value) {
  return String(value ?? "").trim();
}

function list(values) {
  return Array.isArray(values)
    ? values.map((value) => text(value)).filter(Boolean)
    : [];
}

function keyFor(entry) {
  const category = text(entry.category);
  const slug = text(entry.slug);
  return category && slug ? `${category}:${slug}` : "";
}

function httpUrl(value) {
  const normalized = text(value);
  if (!normalized) return "";
  try {
    const url = new URL(normalized);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function siteUrlBase(siteUrl) {
  return httpUrl(siteUrl).replace(/\/$/, "") || SITE_URL;
}

function entryUrl(entry, siteUrl = SITE_URL) {
  return (
    httpUrl(entry.canonicalUrl) ||
    `${siteUrlBase(siteUrl)}/entry/${encodeURIComponent(
      text(entry.category),
    )}/${encodeURIComponent(text(entry.slug))}`
  );
}

function entryDescription(entry) {
  return truncateText(entry.cardDescription || entry.description || "", 180);
}

function isoDate(value) {
  const normalized = text(value).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return "";
  const parsed = new Date(`${normalized}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === normalized
    ? normalized
    : "";
}

function isoTimestamp(value) {
  const date = isoDate(value);
  return date ? `${date}T00:00:00.000Z` : "";
}

function daysBetween(left, right) {
  const leftTime = Date.parse(`${left}T00:00:00.000Z`);
  const rightTime = Date.parse(`${right}T00:00:00.000Z`);
  if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) return null;
  return Math.floor((rightTime - leftTime) / 86_400_000);
}

function normalizeDays(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(1, Math.min(31, numeric)) : 7;
}

const TERMINAL_CONTROL_PATTERN =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

function markdownText(value) {
  return text(value)
    .replace(TERMINAL_CONTROL_PATTERN, "")
    .replace(/\s+/g, " ")
    .replace(/[\\[\]()`<>]/g, "\\$&");
}

function markdownUrl(value) {
  return `<${httpUrl(value) || SITE_URL}>`;
}

function sourceUrls(entry) {
  const trustSourceUrls = Array.isArray(entry.trustSignals?.sourceUrls)
    ? entry.trustSignals.sourceUrls
    : [];
  return [
    entry.repoUrl,
    entry.githubUrl,
    entry.documentationUrl,
    entry.websiteUrl,
    ...trustSourceUrls,
  ]
    .map(httpUrl)
    .filter(Boolean);
}

function hasSource(entry) {
  return (
    entry.trustSignals?.sourceStatus === "available" ||
    sourceUrls(entry).length > 0
  );
}

function hasInstallSurface(entry) {
  return Boolean(
    entry.installable ||
    entry.installCommand ||
    entry.configSnippet ||
    entry.commandSyntax ||
    entry.downloadUrl,
  );
}

function hasSaferInstallSignal(entry) {
  return (
    entry.downloadTrust === "first-party" ||
    entry.packageVerified === true ||
    entry.trustSignals?.packageVerified === true ||
    Boolean(entry.downloadSha256) ||
    Boolean(entry.trustSignals?.checksumPresent) ||
    (hasSource(entry) && !entry.downloadUrl)
  );
}

function trustScore(entry) {
  return (
    (hasSource(entry) ? 8 : 0) +
    (hasSaferInstallSignal(entry) ? 6 : 0) +
    (list(entry.safetyNotes).length ? 3 : 0) +
    (list(entry.privacyNotes).length ? 3 : 0) +
    (entry.claimStatus === "verified" || entry.reviewedBy ? 2 : 0)
  );
}

function sortEntries(left, right) {
  const dateCompare = isoDate(right.dateAdded).localeCompare(
    isoDate(left.dateAdded),
  );
  if (dateCompare !== 0) return dateCompare;
  const scoreCompare = trustScore(right) - trustScore(left);
  if (scoreCompare !== 0) return scoreCompare;
  return text(left.title).localeCompare(text(right.title));
}

function itemFromEntry(entry, reasons, siteUrl) {
  return {
    key: keyFor(entry),
    category: text(entry.category),
    slug: text(entry.slug),
    title: text(entry.title),
    description: entryDescription(entry),
    url: entryUrl(entry, siteUrl),
    dateAdded: isoDate(entry.dateAdded),
    reasons,
    sourceUrls: sourceUrls(entry).slice(0, 4),
    safetyNotesCount: list(entry.safetyNotes).length,
    privacyNotesCount: list(entry.privacyNotes).length,
    downloadTrust: entry.downloadTrust || null,
    packageVerified: entry.packageVerified === true,
  };
}

function newEntryReasons(entry) {
  const reasons = [];
  const date = isoDate(entry.dateAdded);
  if (date) reasons.push(`added ${date}`);
  if (hasSource(entry)) reasons.push("source-backed");
  if (list(entry.safetyNotes).length) reasons.push("has safety notes");
  if (list(entry.privacyNotes).length) reasons.push("has privacy notes");
  return reasons.length ? reasons : ["new registry entry"];
}

function sourceBackedReasons(entry) {
  const reasons = ["source-backed"];
  if (list(entry.safetyNotes).length) reasons.push("safety notes present");
  if (list(entry.privacyNotes).length) reasons.push("privacy notes present");
  if (entry.claimStatus === "verified") reasons.push("verified claim");
  if (entry.reviewedBy) reasons.push("reviewed metadata");
  return reasons;
}

function saferInstallReasons(entry) {
  const reasons = [];
  if (entry.downloadTrust === "first-party")
    reasons.push("first-party package");
  if (entry.packageVerified === true) reasons.push("package verified");
  if (entry.downloadSha256 || entry.trustSignals?.checksumPresent) {
    reasons.push("checksum present");
  }
  if (hasSource(entry) && !entry.downloadUrl) {
    reasons.push("source-backed copy/install path");
  }
  return reasons.length ? reasons : ["reviewable install metadata"];
}

function selectEntries(entries, predicate, limit, reasonsFor, siteUrl, seen) {
  const selected = [];
  for (const entry of entries.filter(predicate).sort(sortEntries)) {
    const key = keyFor(entry);
    if (!key || seen.has(key)) continue;
    selected.push(itemFromEntry(entry, reasonsFor(entry), siteUrl));
    seen.add(key);
    if (selected.length >= limit) break;
  }
  return selected;
}

function changelogItem(change, siteUrl) {
  return {
    key: keyFor(change),
    type: text(change.type) || "added",
    category: text(change.category),
    slug: text(change.slug),
    title: text(change.title),
    url: httpUrl(change.canonicalUrl) || entryUrl(change, siteUrl),
    dateAdded: isoDate(change.dateAdded),
  };
}

function selectChangelogChanges(changelogEntries, entries, params) {
  const source = Array.isArray(changelogEntries)
    ? changelogEntries
    : entries.map((entry) => ({ ...entry, type: "added" }));
  const referenceDate = params.referenceDate;
  const days = params.days;
  const selected = source
    .filter((change) => {
      const date = isoDate(change.dateAdded);
      if (!date) return false;
      const age = daysBetween(date, referenceDate);
      return age !== null && age >= 0 && age < days;
    })
    .sort((left, right) => {
      const dateCompare = isoDate(right.dateAdded).localeCompare(
        isoDate(left.dateAdded),
      );
      return dateCompare || text(left.title).localeCompare(text(right.title));
    })
    .slice(0, params.limit)
    .map((change) => changelogItem(change, params.siteUrl));
  return selected;
}

export function buildWeeklyBrief(entries, options = {}) {
  const normalizedEntries = Array.isArray(entries)
    ? entries.filter((entry) => keyFor(entry) && text(entry.title))
    : [];
  const generatedAt =
    isoTimestamp(options.generatedAt) ||
    isoTimestamp(generatedAtForEntries(normalizedEntries)) ||
    isoTimestamp(new Date().toISOString());
  const referenceDate = isoDate(generatedAt);
  const days = normalizeDays(options.days ?? 7);
  const siteUrl = text(options.siteUrl) || SITE_URL;
  const limits = { ...DEFAULT_LIMITS, ...(options.limits || {}) };
  const seen = new Set();

  const newEntries = selectEntries(
    normalizedEntries,
    (entry) => {
      const date = isoDate(entry.dateAdded);
      const age = daysBetween(date, referenceDate);
      return age !== null && age >= 0 && age < days;
    },
    limits.newEntries,
    newEntryReasons,
    siteUrl,
    seen,
  );
  const sourceBacked = selectEntries(
    normalizedEntries,
    hasSource,
    limits.sourceBacked,
    sourceBackedReasons,
    siteUrl,
    seen,
  );
  const saferInstalls = selectEntries(
    normalizedEntries,
    (entry) => hasInstallSurface(entry) && hasSaferInstallSignal(entry),
    limits.saferInstalls,
    saferInstallReasons,
    siteUrl,
    seen,
  );
  const notableChanges = selectChangelogChanges(
    options.changelogEntries,
    normalizedEntries,
    {
      days,
      referenceDate,
      limit: limits.notableChanges,
      siteUrl,
    },
  );

  return {
    schemaVersion: WEEKLY_BRIEF_SCHEMA_VERSION,
    kind: "weekly-brief-draft",
    generatedAt,
    title: `Weekly Claude workflow brief - ${referenceDate}`,
    period: {
      days,
      through: referenceDate,
    },
    summary: {
      totalEntries: normalizedEntries.length,
      newEntryCount: newEntries.length,
      sourceBackedCount: sourceBacked.length,
      saferInstallCount: saferInstalls.length,
      notableChangeCount: notableChanges.length,
    },
    sections: {
      newEntries,
      sourceBacked,
      saferInstalls,
      notableChanges,
    },
    publishPolicy: {
      manualReviewRequired: true,
      automatedPublishing: false,
      popularityClaims: false,
      privateScoringIncluded: false,
    },
  };
}

function bullet(item) {
  const description = item.description
    ? ` - ${markdownText(item.description)}`
    : "";
  const reasons = item.reasons?.length
    ? `\n  - Signals: ${item.reasons.map(markdownText).join("; ")}`
    : "";
  return `- [${markdownText(item.title)}](${markdownUrl(item.url)}) (${markdownText(item.category)})${description}${reasons}`;
}

function changeBullet(item) {
  const date = item.dateAdded ? ` on ${markdownText(item.dateAdded)}` : "";
  return `- [${markdownText(item.title)}](${markdownUrl(item.url)}) (${markdownText(item.category)}) - ${markdownText(item.type)}${date}`;
}

function section(lines, title, items, renderItem, emptyText) {
  lines.push("", `## ${title}`);
  if (!items.length) {
    lines.push(`- ${emptyText}`);
    return;
  }
  lines.push(...items.map(renderItem));
}

export function renderWeeklyBriefMarkdown(brief) {
  const lines = [
    `# ${brief.title}`,
    "",
    "> Draft for manual review. Generated from HeyClaude registry artifacts; no email, GitHub post, or social post was created.",
    "",
    `Coverage: ${brief.summary.totalEntries} registry entries, ${brief.period.days}-day window through ${brief.period.through}.`,
  ];

  section(
    lines,
    "New entries",
    brief.sections.newEntries,
    bullet,
    "No new registry entries matched this brief window.",
  );
  section(
    lines,
    "Source-backed picks",
    brief.sections.sourceBacked,
    bullet,
    "No source-backed picks were selected.",
  );
  section(
    lines,
    "Safer install and trust picks",
    brief.sections.saferInstalls,
    bullet,
    "No safer install picks were selected.",
  );
  section(
    lines,
    "Notable registry changes",
    brief.sections.notableChanges,
    changeBullet,
    "No registry changelog entries matched this brief window.",
  );

  lines.push(
    "",
    "## Review notes",
    "- Manual publishing is required.",
    "- Do not describe these picks as high-traffic unless separate measured signals support that claim.",
    "- This draft excludes private maintainer notes and scoring data.",
  );

  return `${lines.join("\n")}\n`;
}

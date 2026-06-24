// Renders a persisted Weekly Brief (buildWeeklyBrief payload) into newsletter
// HTML/text. Used both for the maintainer review-preview (with an approve
// button) and the audience send (no button). Table-based, inline-styled for
// email-client robustness.

type BriefItem = {
  title?: string;
  url?: string;
  description?: string;
  category?: string;
  dateAdded?: string;
  reasons?: string[];
  sourceUrls?: string[];
  safetyNotesCount?: number;
  privacyNotesCount?: number;
  packageVerified?: boolean;
};

type BriefSection = {
  key: "newEntries" | "sourceBacked" | "saferInstalls";
  label: string;
  intro: string;
};

type BriefPayload = {
  title?: string;
  period?: { through?: string };
  summary?: {
    newEntryCount?: number;
    sourceBackedCount?: number;
    saferInstallCount?: number;
  };
  theme?: string;
  note?: string;
  sections?: Record<string, BriefItem[] | undefined>;
};

// How many picks per section render as full cards before the rest collapse to
// compact one-liners — keeps the email scannable without dropping coverage.
const FEATURED_PER_SECTION = 4;

const SECTIONS: BriefSection[] = [
  { key: "newEntries", label: "New this week", intro: "Fresh additions to the registry." },
  {
    key: "sourceBacked",
    label: "Source-backed picks",
    intro: "Backed by primary documentation or upstream source.",
  },
  {
    key: "saferInstalls",
    label: "Safer installs",
    intro: "Source-backed, with a clear and reviewable install path.",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_LABELS: Record<string, string> = {
  mcp: "MCP server",
  agents: "Agent",
  skills: "Skill",
  commands: "Command",
  hooks: "Hook",
  rules: "Rule",
  statuslines: "Statusline",
  guides: "Guide",
  tools: "Tool",
  collections: "Collection",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolute(url: string, siteUrl: string): string {
  if (!url) return siteUrl;
  return url.startsWith("http") ? url : `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

function categoryLabel(category?: string): string {
  if (!category) return "";
  if (Object.hasOwn(CATEGORY_LABELS, category)) {
    return CATEGORY_LABELS[category];
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function shortDate(iso?: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? ""));
  if (!match) return "";
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${Number(match[3])}` : "";
}

function truncate(text: string, limit = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit).replace(/\s+\S*$/, "")}…`;
}

function itemBadges(item: BriefItem): string[] {
  const badges: string[] = [];
  if ((item.sourceUrls?.length ?? 0) > 0) badges.push("source-backed");
  if (item.packageVerified) badges.push("verified package");
  if ((item.safetyNotesCount ?? 0) > 0) badges.push("safety notes");
  const date = shortDate(item.dateAdded);
  if (date) badges.push(`added ${date}`);
  return badges;
}

function cardHtml(item: BriefItem, siteUrl: string): string {
  const href = escapeHtml(absolute(String(item.url ?? ""), siteUrl));
  const title = escapeHtml(String(item.title ?? ""));
  const cat = escapeHtml(categoryLabel(item.category));
  const desc = item.description ? escapeHtml(truncate(String(item.description))) : "";
  const badges = itemBadges(item);

  const catRow = cat
    ? `<div style="font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:#a39e93;font-weight:700;">${cat}</div>`
    : "";
  const descRow = desc
    ? `<p style="margin:6px 0 0;font-size:13px;line-height:1.5;color:#57534e;">${desc}</p>`
    : "";
  const metaRow = badges.length
    ? `<div style="margin-top:9px;font-size:11px;color:#a39e93;">${escapeHtml(badges.join("  ·  "))}</div>`
    : "";

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;border:1px solid #e7e3d8;border-radius:10px;background:#ffffff;">
    <tr><td style="padding:14px 16px;">
      ${catRow}
      <a href="${href}" style="display:inline-block;margin:3px 0 0;font-size:15px;font-weight:600;color:#171614;text-decoration:none;line-height:1.3;">${title}</a>
      ${descRow}
      ${metaRow}
    </td></tr>
  </table>`;
}

function overflowRowHtml(item: BriefItem, siteUrl: string): string {
  const href = escapeHtml(absolute(String(item.url ?? ""), siteUrl));
  const title = escapeHtml(String(item.title ?? ""));
  const cat = escapeHtml(categoryLabel(item.category));
  const catTag = cat
    ? `<span style="font-size:10px;letter-spacing:0.05em;text-transform:uppercase;color:#a39e93;font-weight:700;">${cat}</span> `
    : "";
  return `<tr><td style="padding:8px 16px;border-bottom:1px solid #f0ede4;">
      ${catTag}<a href="${href}" style="font-size:14px;font-weight:600;color:#171614;text-decoration:none;">${title}</a>
    </td></tr>`;
}

function sectionHtml(
  section: BriefSection,
  items: BriefItem[] | undefined,
  siteUrl: string,
): string {
  const rows = (items ?? []).filter((item) => item?.title);
  if (rows.length === 0) return "";
  const featured = rows.slice(0, FEATURED_PER_SECTION);
  const overflow = rows.slice(FEATURED_PER_SECTION);
  const cards = featured.map((item) => cardHtml(item, siteUrl)).join("");
  const more = overflow.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:2px 0 10px;border:1px solid #e7e3d8;border-radius:10px;background:#ffffff;">${overflow
        .map((item) => overflowRowHtml(item, siteUrl))
        .join("")}</table>`
    : "";
  return `<div style="margin:28px 0 12px;">
      <div style="font-size:16px;font-weight:700;color:#171614;">${escapeHtml(section.label)}</div>
      <div style="font-size:12px;color:#a39e93;margin-top:2px;">${escapeHtml(section.intro)}</div>
    </div>${cards}${more}`;
}

function sectionText(
  section: BriefSection,
  items: BriefItem[] | undefined,
  siteUrl: string,
): string {
  const rows = (items ?? []).filter((item) => item?.title);
  if (rows.length === 0) return "";
  const featured = rows.slice(0, FEATURED_PER_SECTION);
  const overflow = rows.slice(FEATURED_PER_SECTION);
  const list = featured
    .map((item) => {
      const desc = item.description ? `\n    ${truncate(String(item.description), 120)}` : "";
      return `• ${item.title} [${categoryLabel(item.category)}]${desc}\n    ${absolute(String(item.url ?? ""), siteUrl)}`;
    })
    .join("\n");
  const more = overflow.length
    ? `\n${overflow
        .map(
          (item) =>
            `• ${item.title} [${categoryLabel(item.category)}] — ${absolute(String(item.url ?? ""), siteUrl)}`,
        )
        .join("\n")}`
    : "";
  return `\n${section.label.toUpperCase()}\n${section.intro}\n${list}${more}\n`;
}

export function buildBriefEmail(options: {
  brief: BriefPayload;
  siteUrl: string;
  dateLabel: string;
  approveUrl?: string;
}): { subject: string; html: string; text: string } {
  const { brief, siteUrl, dateLabel, approveUrl } = options;
  const sections = brief.sections ?? {};
  const summary = brief.summary ?? {};
  const dateLabelNice = shortDate(dateLabel) || dateLabel;
  const title = `What shipped this week on HeyClaude`;
  const subject = approveUrl
    ? `[Review] Weekly Brief — ${dateLabelNice}`
    : `HeyClaude Weekly Brief — ${dateLabelNice}`;

  const summaryLine = `${summary.newEntryCount ?? 0} new this week · ${summary.sourceBackedCount ?? 0} source-backed · ${summary.saferInstallCount ?? 0} safer installs`;

  const theme = String(brief.theme ?? "").trim();
  const themeBlock = theme
    ? `<p style="font-size:15px;line-height:1.55;color:#44403a;margin:0 0 22px;">${escapeHtml(theme)}</p>`
    : "";

  const note = String(brief.note ?? "").trim();
  const noteBlock = note
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-left:3px solid #171614;background:#faf8f2;border-radius:0 8px 8px 0;">
        <tr><td style="padding:14px 18px;">
          <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#a39e93;font-weight:700;margin-bottom:6px;">From the editor</div>
          <div style="font-size:14px;line-height:1.6;color:#44403a;white-space:pre-wrap;">${escapeHtml(note)}</div>
        </td></tr>
      </table>`
    : "";

  const approveBlock = approveUrl
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px;background:#f0ede4;border:1px solid #e3dfd3;border-radius:12px;">
        <tr><td style="padding:18px;">
          <div style="font-size:13px;color:#6b675f;margin-bottom:12px;">Draft for review — nothing is sent to the audience until you approve.</div>
          <a href="${escapeHtml(approveUrl)}" style="display:inline-block;background:#171614;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:8px;">Approve &amp; schedule send →</a>
        </td></tr>
      </table>`
    : "";

  const body = SECTIONS.map((section) => sectionHtml(section, sections[section.key], siteUrl)).join(
    "",
  );

  const html = `<!doctype html><html><body style="margin:0;background:#f7f5ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#171614;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ef;"><tr><td align="center" style="padding:24px 14px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td>
          <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#a39e93;font-weight:600;">HeyClaude Weekly Brief · ${escapeHtml(dateLabelNice)}</div>
          <h1 style="font-size:24px;line-height:1.25;margin:8px 0 6px;color:#171614;">${escapeHtml(title)}</h1>
          <div style="font-size:13px;color:#8a857b;margin-bottom:12px;">${escapeHtml(summaryLine)}</div>
          ${themeBlock}
          ${noteBlock}
          ${approveBlock}
          ${body || '<p style="color:#6b675f;">No notable activity this week.</p>'}
          <p style="margin-top:30px;padding-top:18px;border-top:1px solid #e7e3d8;font-size:12px;color:#a39e93;">Reviewed picks from <a href="${escapeHtml(siteUrl)}" style="color:#6b675f;">heyclau.de</a> — every entry is metadata-reviewed for source &amp; safety. No hype, no listicle filler.</p>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;

  const text =
    `HeyClaude Weekly Brief — ${dateLabelNice}\n${title}\n${summaryLine}\n` +
    (theme ? `\n${theme}\n` : "") +
    (note ? `\nFrom the editor:\n${note}\n` : "") +
    (approveUrl ? `\nApprove & schedule: ${approveUrl}\n` : "") +
    SECTIONS.map((section) => sectionText(section, sections[section.key], siteUrl)).join("") +
    `\n— Reviewed picks from ${siteUrl}\n`;

  return { subject, html, text };
}

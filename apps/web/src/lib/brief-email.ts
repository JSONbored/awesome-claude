// Renders a persisted Weekly Brief (buildWeeklyBrief payload) into newsletter
// HTML/text. Used both for the maintainer review-preview (with an approve
// button) and the audience send (no button).

type BriefItem = {
  title?: string;
  url?: string;
  description?: string;
  reasons?: string[];
};

type BriefPayload = {
  title?: string;
  period?: { through?: string };
  summary?: {
    newEntryCount?: number;
    sourceBackedCount?: number;
    saferInstallCount?: number;
    notableChangeCount?: number;
  };
  sections?: {
    newEntries?: BriefItem[];
    sourceBacked?: BriefItem[];
    saferInstalls?: BriefItem[];
    notableChanges?: BriefItem[];
  };
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

function sectionHtml(label: string, items: BriefItem[] | undefined, siteUrl: string): string {
  const rows = (items ?? []).filter((item) => item?.title);
  if (rows.length === 0) return "";
  const list = rows
    .map((item) => {
      const href = escapeHtml(absolute(String(item.url ?? ""), siteUrl));
      const title = escapeHtml(String(item.title ?? ""));
      const reason = item.reasons?.[0] ?? item.description ?? "";
      const sub = reason
        ? `<div style="color:#6b675f;font-size:13px;margin-top:2px;">${escapeHtml(String(reason))}</div>`
        : "";
      return `<li style="margin:0 0 12px;"><a href="${href}" style="color:#171614;font-weight:600;text-decoration:none;">${title}</a>${sub}</li>`;
    })
    .join("");
  return `<h3 style="font-size:15px;color:#171614;margin:24px 0 10px;">${escapeHtml(label)}</h3><ul style="list-style:none;padding:0;margin:0;">${list}</ul>`;
}

function sectionText(label: string, items: BriefItem[] | undefined, siteUrl: string): string {
  const rows = (items ?? []).filter((item) => item?.title);
  if (rows.length === 0) return "";
  const list = rows
    .map((item) => `- ${item.title} — ${absolute(String(item.url ?? ""), siteUrl)}`)
    .join("\n");
  return `\n${label}\n${list}\n`;
}

export function buildBriefEmail(options: {
  brief: BriefPayload;
  siteUrl: string;
  dateLabel: string;
  approveUrl?: string;
}): { subject: string; html: string; text: string } {
  const { brief, siteUrl, dateLabel, approveUrl } = options;
  const sections = brief.sections ?? {};
  const title = brief.title ?? `Weekly Claude workflow brief — ${dateLabel}`;
  const subject = approveUrl
    ? `[Review] Weekly Brief draft — ${dateLabel}`
    : `Weekly Brief — ${dateLabel}`;

  const approveBlock = approveUrl
    ? `<div style="background:#f0ede4;border:1px solid #e3dfd3;border-radius:10px;padding:16px;margin:0 0 24px;">
        <div style="font-size:13px;color:#6b675f;margin-bottom:10px;">Draft for review — nothing is sent to the audience until you approve.</div>
        <a href="${escapeHtml(approveUrl)}" style="display:inline-block;background:#171614;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;">Approve &amp; schedule send →</a>
      </div>`
    : "";

  const body =
    sectionHtml("New in the registry", sections.newEntries, siteUrl) +
    sectionHtml("Source-backed picks", sections.sourceBacked, siteUrl) +
    sectionHtml("Safer installs", sections.saferInstalls, siteUrl) +
    sectionHtml("Notable changes", sections.notableChanges, siteUrl);

  const html = `<!doctype html><html><body style="margin:0;background:#f7f5ef;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#171614;">
    <div style="max-width:600px;margin:0 auto;padding:28px 22px;">
      <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b675f;">HeyClaude Weekly Brief · ${escapeHtml(dateLabel)}</div>
      <h1 style="font-size:22px;margin:6px 0 18px;">${escapeHtml(title)}</h1>
      ${approveBlock}
      ${body || '<p style="color:#6b675f;">No notable activity this week.</p>'}
      <p style="margin-top:28px;font-size:12px;color:#9b968c;">Reviewed picks from <a href="${escapeHtml(siteUrl)}" style="color:#6b675f;">heyclau.de</a>. No hype, no listicle filler.</p>
    </div></body></html>`;

  const text =
    `HeyClaude Weekly Brief — ${dateLabel}\n${title}\n` +
    (approveUrl ? `\nApprove & schedule: ${approveUrl}\n` : "") +
    sectionText("New in the registry", sections.newEntries, siteUrl) +
    sectionText("Source-backed picks", sections.sourceBacked, siteUrl) +
    sectionText("Safer installs", sections.saferInstalls, siteUrl) +
    sectionText("Notable changes", sections.notableChanges, siteUrl);

  return { subject, html, text };
}

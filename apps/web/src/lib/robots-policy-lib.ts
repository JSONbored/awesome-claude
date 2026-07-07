import { siteConfig } from "@/lib/site";

// Machine endpoints and generated artifacts should not be crawled: they waste crawl budget
// and surface as "crawled - not indexed" / 404 noise in Search Console.
// /_next/ was a Next.js artifact; this app is TanStack Start on Workers and never serves it.
// Hashed build assets live under /assets/* and stay crawlable (Google needs JS/CSS to render).
const DISALLOW_PATHS = ["/api/", "/data/", "/downloads/"];

// AI content-usage preferences (contentsignals.org / draft-romm-aipref-contentsignals).
// Fully open: appear in search + AI answers and allow training.
const CONTENT_SIGNAL = "ai-train=yes, search=yes, ai-input=yes";

export function getRobotsPolicy() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: DISALLOW_PATHS,
      },
    ],
    contentSignal: CONTENT_SIGNAL,
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: new URL(siteConfig.url).host,
  };
}

export function renderRobotsTxt() {
  const policy = getRobotsPolicy();
  const lines: string[] = [];
  for (const rule of policy.rules) {
    const userAgents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
    for (const userAgent of userAgents) {
      lines.push(`User-agent: ${userAgent}`);
    }
    lines.push(`Allow: ${rule.allow}`);
    for (const path of rule.disallow ?? []) {
      lines.push(`Disallow: ${path}`);
    }
    // Content-Signal applies to all crawlers — emit it once, under the catch-all group.
    if (policy.contentSignal && rule.userAgent === "*") {
      lines.push(`Content-Signal: ${policy.contentSignal}`);
    }
    lines.push("");
  }
  lines.push(`Sitemap: ${policy.sitemap}`);
  lines.push(`Host: ${policy.host}`);
  return lines.join("\n");
}

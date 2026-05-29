import { siteConfig } from "@/lib/site";

export function getRobotsPolicy() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
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
      },
    ],
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
    lines.push("");
  }
  lines.push(`Sitemap: ${policy.sitemap}`);
  lines.push(`Host: ${policy.host}`);
  return lines.join("\n");
}

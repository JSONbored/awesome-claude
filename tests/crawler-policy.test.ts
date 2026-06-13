import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getRobotsPolicy, renderRobotsTxt } from "@/lib/robots-policy";
import { applySecurityHeaders } from "@/lib/security-headers";
import { repoRoot } from "./helpers/registry-fixtures";

describe("crawler and AI citation policy", () => {
  it("applies shared security headers to every SSR response", () => {
    const serverSource = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/server.ts"),
      "utf8",
    );

    expect(serverSource).toContain(
      'import { applySecurityHeaders } from "./lib/security-headers"',
    );
    expect(serverSource).toContain(
      "function withSecurityHeaders(response: Response, request: Request): Response",
    );
    expect(serverSource).toContain(
      "applySecurityHeaders(new Headers(response.headers), request)",
    );
    expect(serverSource).toContain(
      "return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response), request);",
    );
  });
  it("keeps legitimate search and AI citation crawlers explicitly allowed", () => {
    const policy = getRobotsPolicy();
    const rules = Array.isArray(policy.rules) ? policy.rules : [policy.rules];
    const userAgents = rules.flatMap((rule) =>
      Array.isArray(rule.userAgent)
        ? rule.userAgent
        : rule.userAgent
          ? [rule.userAgent]
          : [],
    );

    expect(userAgents).toEqual(
      expect.arrayContaining([
        "*",
        "GPTBot",
        "OAI-SearchBot",
        "ChatGPT-User",
        "ClaudeBot",
        "Claude-SearchBot",
        "Google-Extended",
      ]),
    );
    expect(policy.sitemap).toBe("https://heyclau.de/sitemap.xml");

    const robotsTxt = renderRobotsTxt();
    expect(robotsTxt).toContain("Disallow: /api/");
    expect(robotsTxt).toContain("Disallow: /data/");
    expect(robotsTxt).toContain("Disallow: /downloads/");
    expect(robotsTxt).toContain("Content-Signal:");
  });

  it("noindexes non-production hosts and advertises agent discovery on HTML responses", () => {
    const devHeaders = applySecurityHeaders(
      new Headers({ "content-type": "text/html; charset=utf-8" }),
      new Request("https://dev.heyclau.de/"),
    );
    expect(devHeaders.get("x-robots-tag")).toContain("noindex");

    const prodHeaders = applySecurityHeaders(
      new Headers({ "content-type": "text/html; charset=utf-8" }),
      new Request("https://heyclau.de/"),
    );
    expect(prodHeaders.get("x-robots-tag")).toBeNull();
    expect(prodHeaders.get("link")).toContain('rel="api-catalog"');
  });

  it("keeps llms.txt and corpus exports as cacheable security-headered discovery surfaces", () => {
    const routeSource = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/llms[.]txt.ts"),
      "utf8",
    );
    const llmsHelperSource = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/lib/llms.ts"),
      "utf8",
    );
    const fullRouteSource = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/llms-full[.]txt.ts"),
      "utf8",
    );

    expect(routeSource).toContain("respondText");
    expect(fullRouteSource).toContain("buildLlmsFullTxt");
    expect(fullRouteSource).toContain("respondText");
    expect(llmsHelperSource).toContain("applySecurityHeaders");
    expect(llmsHelperSource).toContain("Content-Type");
    expect(llmsHelperSource).toContain("Cache-Control");
    expect(
      fs.existsSync(path.join(repoRoot, "apps/web/public/data/llms-full.txt")),
    ).toBe(false);
  });
});

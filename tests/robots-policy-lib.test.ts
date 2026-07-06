import { describe, expect, it } from "vitest";

import { siteConfig } from "../apps/web/src/lib/site";
import {
  getRobotsPolicy,
  renderRobotsTxt,
} from "../apps/web/src/lib/robots-policy-lib";

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
];
const DISALLOW_PATHS = ["/api/", "/data/", "/downloads/"];
const CONTENT_SIGNAL = "ai-train=yes, search=yes, ai-input=yes";

describe("getRobotsPolicy", () => {
  it("returns exactly two rule groups: the catch-all and the AI-bots group", () => {
    const policy = getRobotsPolicy();
    expect(policy.rules).toHaveLength(2);
  });

  it("first rule is the catch-all `*` group with allow `/` and the disallow paths", () => {
    const [catchAll] = getRobotsPolicy().rules;
    expect(catchAll.userAgent).toBe("*");
    expect(catchAll.allow).toBe("/");
    expect(catchAll.disallow).toEqual(DISALLOW_PATHS);
  });

  it("second rule targets every AI bot with allow `/` and the disallow paths", () => {
    const [, aiRule] = getRobotsPolicy().rules;
    expect(aiRule.userAgent).toEqual(AI_BOTS);
    expect(aiRule.allow).toBe("/");
    expect(aiRule.disallow).toEqual(DISALLOW_PATHS);
  });

  it("exposes the content signal", () => {
    expect(getRobotsPolicy().contentSignal).toBe(CONTENT_SIGNAL);
  });

  it("derives sitemap and host from siteConfig", () => {
    const policy = getRobotsPolicy();
    expect(policy.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    expect(policy.host).toBe(new URL(siteConfig.url).host);
  });
});

describe("renderRobotsTxt", () => {
  const output = renderRobotsTxt();
  const lines = output.split("\n");

  it("emits a User-agent line for the catch-all group", () => {
    expect(lines).toContain("User-agent: *");
  });

  it("emits a User-agent line for every AI bot", () => {
    for (const bot of AI_BOTS) {
      expect(lines).toContain(`User-agent: ${bot}`);
    }
  });

  it("emits an Allow line for each group", () => {
    const allowLines = lines.filter((line) => line === "Allow: /");
    expect(allowLines).toHaveLength(2);
  });

  it("emits each Disallow path once per group (two groups)", () => {
    for (const path of DISALLOW_PATHS) {
      const disallowLines = lines.filter(
        (line) => line === `Disallow: ${path}`,
      );
      expect(disallowLines).toHaveLength(2);
    }
  });

  it("emits the Content-Signal exactly once, under the catch-all group", () => {
    const signalLines = lines.filter(
      (line) => line === `Content-Signal: ${CONTENT_SIGNAL}`,
    );
    expect(signalLines).toHaveLength(1);
    // It must appear within the first group, before the AI-bot User-agent lines.
    const signalIndex = lines.indexOf(`Content-Signal: ${CONTENT_SIGNAL}`);
    const firstAiIndex = lines.indexOf(`User-agent: ${AI_BOTS[0]}`);
    expect(signalIndex).toBeGreaterThan(-1);
    expect(signalIndex).toBeLessThan(firstAiIndex);
  });

  it("emits the trailing Sitemap and Host lines derived from siteConfig", () => {
    const policy = getRobotsPolicy();
    expect(lines).toContain(`Sitemap: ${policy.sitemap}`);
    expect(lines).toContain(`Host: ${policy.host}`);
  });

  it("renders the full deterministic robots.txt document", () => {
    const policy = getRobotsPolicy();
    const expected = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /data/",
      "Disallow: /downloads/",
      `Content-Signal: ${CONTENT_SIGNAL}`,
      "",
      "User-agent: GPTBot",
      "User-agent: OAI-SearchBot",
      "User-agent: ChatGPT-User",
      "User-agent: ClaudeBot",
      "User-agent: Claude-SearchBot",
      "User-agent: Google-Extended",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /data/",
      "Disallow: /downloads/",
      "",
      `Sitemap: ${policy.sitemap}`,
      `Host: ${policy.host}`,
    ].join("\n");
    expect(output).toBe(expected);
  });
});

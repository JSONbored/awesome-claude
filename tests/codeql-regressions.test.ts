import fs from "node:fs";

import { describe, expect, it } from "vitest";

import {
  extractSectionSubitems,
  getEmbeddedSectionType,
  htmlBeforeFirstH3,
  stripSectionTypeComments,
} from "@/lib/content-section-parsing";
import {
  listingLeadBodySchema,
  newsletterSubscribeBodySchema,
} from "@/lib/api/contracts";

describe("CodeQL regression coverage", () => {
  it("parses content section markers and h3 subitems without regex sanitizers", () => {
    const html = [
      "<p>Intro</p>",
      "<!-- Section type: warning -->",
      '<h3 id="first">First issue</h3>',
      "<p>First body</p>",
      '<h3 id="second">Second issue</h3>',
      "<p>Second body</p>",
    ].join("");

    expect(getEmbeddedSectionType(html)).toBe("warning");

    const cleanHtml = stripSectionTypeComments(html);
    expect(cleanHtml).not.toContain("Section type");
    expect(htmlBeforeFirstH3(cleanHtml)).toBe("<p>Intro</p>");

    expect(extractSectionSubitems(cleanHtml, "troubleshooting")).toEqual([
      { id: "first", title: "First issue", html: "<p>First body</p>" },
      { id: "second", title: "Second issue", html: "<p>Second body</p>" },
    ]);
  });

  it("validates email input with bounded linear parsing", () => {
    expect(
      newsletterSubscribeBodySchema.parse({
        email: "Reader@Example.com",
        source: "footer",
      }),
    ).toEqual({ email: "reader@example.com", segments: [], source: "footer" });

    expect(() =>
      newsletterSubscribeBodySchema.parse({
        email: `!@!.${"!. ".repeat(2048)}`,
      }),
    ).toThrow();

    expect(() =>
      listingLeadBodySchema.parse({
        kind: "job",
        contactName: "Jane",
        contactEmail: "not an email",
        companyName: "Example",
        listingTitle: "AI Engineer",
        applyUrl: "https://example.com/jobs/ai-engineer",
      }),
    ).toThrow();
  });

  it("keeps newsletter mutations behind bounded same-origin handlers", () => {
    const repoRoot = new URL("..", import.meta.url);
    const read = (relativePath: string) =>
      fs.readFileSync(new URL(relativePath, repoRoot), "utf8");

    const subscribeRoute = read(
      "apps/web/src/routes/api/public/newsletter/subscribe.ts",
    );
    const unsubscribeRoute = read(
      "apps/web/src/routes/api/public/newsletter/unsubscribe.ts",
    );
    const confirmRoute = read(
      "apps/web/src/routes/api/public/newsletter/confirm.ts",
    );
    const newsletterClient = read("apps/web/src/lib/api/newsletter.ts");

    expect(subscribeRoute).not.toContain("Access-Control-Allow-Origin");
    expect(subscribeRoute).not.toContain("request.json()");
    expect(subscribeRoute).toContain("POST(request, { params })");

    expect(unsubscribeRoute).not.toContain("Access-Control-Allow-Origin");
    expect(unsubscribeRoute).not.toContain("request.json()");
    expect(unsubscribeRoute).toContain("readRequestTextWithinLimit");
    expect(unsubscribeRoute).toContain("isAllowedOrigin");
    expect(unsubscribeRoute).toContain("isRateLimited");

    expect(confirmRoute).not.toContain("request.json()");
    expect(confirmRoute).not.toContain("request.formData()");
    expect(confirmRoute).toContain("readRequestTextWithinLimit");
    expect(confirmRoute).toContain("BodyTooLargeError");
    expect(confirmRoute).toContain('action="/api/public/newsletter/confirm"');

    expect(newsletterClient).toContain('fetch("/api/newsletter/subscribe"');
    expect(newsletterClient).not.toContain(
      'fetch("/api/public/newsletter/subscribe"',
    );
  });
  it("keeps newsletter confirmation defaults provider-safe", () => {
    const repoRoot = new URL("..", import.meta.url);
    const subscribeRoute = fs.readFileSync(
      new URL("apps/web/src/routes/api/newsletter/subscribe.ts", repoRoot),
      "utf8",
    );
    const confirmRoute = fs.readFileSync(
      new URL("apps/web/src/routes/api/public/newsletter/confirm.ts", repoRoot),
      "utf8",
    );

    expect(subscribeRoute).toContain(
      'const DEFAULT_FROM = "HeyClaude <newsletter@mail.heyclau.de>"',
    );
    expect(subscribeRoute).not.toContain(
      'const DEFAULT_FROM = "HeyClaude <newsletter@heyclau.de>"',
    );
    expect(confirmRoute).toContain(
      'method="post" action="/api/public/newsletter/confirm"',
    );
    expect(confirmRoute).not.toContain('<form method="post" style=');
  });
});

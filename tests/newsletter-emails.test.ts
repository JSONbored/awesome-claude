import { describe, expect, it } from "vitest";

import {
  buildDigestEmail,
  buildNewsletterConfirmEmail,
  buildWelcomeEmail,
} from "../apps/web/src/lib/newsletter-emails";

const SITE = "https://heyclau.de";

describe("newsletter email templates", () => {
  describe("shared design-system shell", () => {
    const emails = [
      buildNewsletterConfirmEmail({ confirmUrl: `${SITE}/api/public/newsletter/confirm?token=t`, siteUrl: SITE }),
      buildWelcomeEmail({ siteUrl: SITE }),
      buildDigestEmail({ siteUrl: SITE, items: [{ title: "X", category: "mcp", slug: "x", summary: "" }], dateLabel: "Jun 15, 2026" }),
    ];

    it("forces light mode and uses the brand font stack without remote font loads", () => {
      for (const email of emails) {
        expect(email.html).toContain('name="color-scheme" content="light"');
        expect(email.html).toContain("Space Grotesk");
        expect(email.html).toContain("DM Sans");
        expect(email.html).not.toContain("@font-face");
        expect(email.html).not.toContain("/fonts/");
        expect(email.html).not.toContain(".woff2");
      }
    });

    it("uses the light-mode design tokens (warm paper canvas + ink)", () => {
      for (const email of emails) {
        expect(email.html).toContain("#f8f6ed"); // canvas
        expect(email.html).toContain("#13110d"); // ink
      }
    });
  });

  describe("confirm email", () => {
    const email = buildNewsletterConfirmEmail({
      confirmUrl: `${SITE}/api/public/newsletter/confirm?token=abc`,
      siteUrl: SITE,
    });
    it("links the confirm URL and stays minimal (no marketing CTAs)", () => {
      expect(email.subject).toMatch(/confirm/i);
      expect(email.html).toContain("/api/public/newsletter/confirm?token=abc");
      expect(email.text).toContain("/api/public/newsletter/confirm?token=abc");
      expect(email.html).not.toContain("/jobs/post"); // transactional: no growth footer
    });
  });

  describe("welcome email", () => {
    const email = buildWelcomeEmail({ siteUrl: SITE });
    it("carries the citron accent and the standing CTAs", () => {
      expect(email.html).toContain("#e1f32a"); // citron highlight
      expect(email.html).toContain(`${SITE}/best`);
      expect(email.html).toContain(`${SITE}/submit`);
      expect(email.html).toContain(`${SITE}/jobs/post`);
      expect(email.html).toContain(`${SITE}/advertise`);
      expect(email.html).toContain(`${SITE}/subscriptions`);
    });
  });

  describe("digest email", () => {
    const email = buildDigestEmail({
      siteUrl: SITE,
      dateLabel: "Jun 15, 2026",
      items: [
        { title: "Postgres MCP", category: "mcp", slug: "postgres-mcp", summary: "Query Postgres." },
        { title: '<script>alert(1)</script>', category: "hooks", slug: "x", summary: "<b>raw</b>" },
      ],
    });
    it("renders items, the unsubscribe tag, and escapes untrusted text", () => {
      expect(email.subject).toContain("Jun 15, 2026");
      expect(email.html).toContain(`${SITE}/entry/mcp/postgres-mcp`);
      expect(email.html).toContain("Postgres MCP");
      expect(email.html).toContain("{{{RESEND_UNSUBSCRIBE_URL}}}");
      expect(email.html).toContain(`${SITE}/browse`);
      // XSS-safety: angle brackets in entry data must be escaped.
      expect(email.html).not.toContain("<script>alert(1)</script>");
      expect(email.html).toContain("&lt;script&gt;");
    });
  });
});

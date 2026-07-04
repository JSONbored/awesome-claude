import { describe, expect, it } from "vitest";

import {
  THEME,
  DISPLAY,
  BODY,
  escapeHtml,
  trimUrl,
  siteHostOf,
  emailShell,
  eyebrow,
  primaryButton,
  standingCtasHtml,
  standingCtasText,
  buildNewsletterConfirmEmail,
  buildWelcomeEmail,
  buildListingLeadAckEmail,
  buildDigestEmail,
} from "../apps/web/src/lib/newsletter-emails-lib";

const SITE = "https://heyclau.de/";

describe("design tokens and helpers", () => {
  it("exposes the light-mode theme palette", () => {
    expect(THEME.canvas).toBe("#f8f6ed");
    expect(THEME.card).toBe("#fcfaf4");
    expect(THEME.ink).toBe("#13110d");
    expect(THEME.accent).toBe("#e1f32a");
    expect(DISPLAY).toContain("Space Grotesk");
    expect(BODY).toContain("DM Sans");
  });

  it("escapes HTML metacharacters", () => {
    expect(escapeHtml(`Tom & "Jerry" <script>`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;script&gt;",
    );
  });

  it("normalizes site urls and hosts", () => {
    expect(trimUrl("https://heyclau.de/")).toBe("https://heyclau.de");
    expect(trimUrl("https://heyclau.de")).toBe("https://heyclau.de");
    expect(siteHostOf("https://heyclau.de/")).toBe("heyclau.de");
    expect(siteHostOf("http://localhost:3000/")).toBe("localhost:3000");
  });

  it("builds the shared email shell with a preheader", () => {
    const html = emailShell({
      preheader: "Preview <text>",
      inner: "<tr><td>Body</td></tr>",
    });
    expect(html).toContain('name="color-scheme" content="light"');
    expect(html).toContain("Preview &lt;text&gt;");
    expect(html).toContain(THEME.canvas);
    expect(html).toContain("<tr><td>Body</td></tr>");
  });

  it("renders eyebrow labels and primary buttons", () => {
    expect(eyebrow("HeyClaude")).toContain("HeyClaude");
    expect(eyebrow("HeyClaude")).toContain("text-transform:uppercase");
    expect(primaryButton("https://heyclau.de/best", "Browse")).toContain(
      'href="https://heyclau.de/best"',
    );
    expect(primaryButton("https://heyclau.de/best", "Browse")).toContain(
      "Browse",
    );
  });

  it("renders standing growth CTAs in html and text", () => {
    const html = standingCtasHtml(SITE);
    expect(html).toContain(`${trimUrl(SITE)}/submit`);
    expect(html).toContain(`${trimUrl(SITE)}/jobs/post`);
    expect(html).toContain(`${trimUrl(SITE)}/advertise`);
    expect(html).toContain("Forward it to a teammate");

    const text = standingCtasText(SITE);
    expect(text).toContain("Built something? Submit it:");
    expect(text).toContain("Hiring? Post a role:");
    expect(text).toContain("Sponsor:");
  });
});

describe("buildNewsletterConfirmEmail", () => {
  it("builds a minimal transactional confirm email", () => {
    const confirmUrl = `${trimUrl(SITE)}/api/public/newsletter/confirm?token=abc`;
    const email = buildNewsletterConfirmEmail({
      confirmUrl,
      siteUrl: SITE,
    });

    expect(email.subject).toBe("Confirm your HeyClaude subscription");
    expect(email.html).toContain(confirmUrl);
    expect(email.html).toContain("Confirm subscription");
    expect(email.html).toContain("heyclau.de");
    expect(email.text).toContain(confirmUrl);
    expect(email.html).not.toContain("/jobs/post");
    expect(email.html).toContain('name="color-scheme" content="light"');
  });

  it("escapes unsafe confirm urls in html output", () => {
    const email = buildNewsletterConfirmEmail({
      confirmUrl: 'https://heyclau.de/confirm?x="1"',
      siteUrl: SITE,
    });
    expect(email.html).toContain("&quot;1&quot;");
    expect(email.html).not.toContain('x="1"');
  });
});

describe("buildWelcomeEmail", () => {
  it("builds the post-confirm welcome email with growth CTAs", () => {
    const email = buildWelcomeEmail({ siteUrl: SITE });
    const base = trimUrl(SITE);

    expect(email.subject).toBe("You're in — welcome to HeyClaude");
    expect(email.html).toContain("#e1f32a");
    expect(email.html).toContain(`${base}/best`);
    expect(email.html).toContain(`${base}/state-of-claude-tooling`);
    expect(email.html).toContain(`${base}/browse`);
    expect(email.html).toContain(`${base}/subscriptions`);
    expect(email.text).toContain(`${base}/best`);
    expect(email.text).toContain("Built something? Submit it:");
  });
});

describe("buildListingLeadAckEmail", () => {
  it("routes job inquiries to the jobs CTA", () => {
    const email = buildListingLeadAckEmail({
      siteUrl: SITE,
      contactName: "Ada Lovelace",
      listingTitle: "Senior MCP Engineer",
      kind: "job",
    });

    expect(email.subject).toBe("We got your HeyClaude inquiry");
    expect(email.html).toContain("Thanks, Ada");
    expect(email.html).toContain("Senior MCP Engineer");
    expect(email.html).toContain(`${trimUrl(SITE)}/jobs/post`);
    expect(email.text).toContain("job listing inquiry");
    expect(email.text).toContain("See job listing options:");
  });

  it("routes claim inquiries to listing options", () => {
    const email = buildListingLeadAckEmail({
      siteUrl: SITE,
      contactName: "Maintainer",
      listingTitle: "Existing Listing",
      kind: "claim",
    });

    expect(email.html).toContain(`${trimUrl(SITE)}/advertise`);
    expect(email.text).toContain("listing claim inquiry");
    expect(email.text).toContain("See listing options:");
  });

  it("routes tool inquiries to advertise", () => {
    const email = buildListingLeadAckEmail({
      siteUrl: SITE,
      contactName: "Builder",
      listingTitle: "My Tool",
      kind: "tool",
    });

    expect(email.text).toContain("tool listing inquiry");
    expect(email.html).toContain("tool listing");
  });

  it("falls back for unknown kinds and empty contact fields", () => {
    const email = buildListingLeadAckEmail({
      siteUrl: SITE,
      contactName: "",
      listingTitle: "",
      kind: "sponsorship",
    });

    expect(email.html).toContain("Thanks, there");
    expect(email.html).toContain("your submission");
    expect(email.text).toContain("listing inquiry");
    expect(email.text).toContain("your submission");
  });

  it("escapes unsafe contact and title fields", () => {
    const email = buildListingLeadAckEmail({
      siteUrl: SITE,
      contactName: '<script>alert("x")</script> Person',
      listingTitle: "<b>Senior MCP Builder</b>",
      kind: "job",
    });

    expect(email.html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
    expect(email.html).toContain("&lt;b&gt;Senior MCP Builder&lt;/b&gt;");
    expect(email.html).not.toContain("<b>Senior MCP Builder</b>");
  });
});

describe("buildDigestEmail", () => {
  it("renders digest items with summaries and unsubscribe tag", () => {
    const email = buildDigestEmail({
      siteUrl: SITE,
      dateLabel: "Jun 15, 2026",
      items: [
        {
          title: "Postgres MCP",
          category: "mcp",
          slug: "postgres-mcp",
          summary: "Query Postgres safely.",
        },
        {
          title: "No Summary Skill",
          category: "skills",
          slug: "no-summary",
          summary: "",
        },
      ],
    });

    const base = trimUrl(SITE);
    expect(email.subject).toBe("New on HeyClaude — Jun 15, 2026");
    expect(email.html).toContain(`${base}/entry/mcp/postgres-mcp`);
    expect(email.html).toContain("Postgres MCP");
    expect(email.html).toContain("Query Postgres safely.");
    expect(email.html).toContain(`${base}/entry/skills/no-summary`);
    expect(email.html).toContain("{{{RESEND_UNSUBSCRIBE_URL}}}");
    expect(email.html).toContain(`${base}/browse`);
    expect(email.text).toContain("• [mcp] Postgres MCP");
    expect(email.text).toContain("• [skills] No Summary Skill");
    expect(email.text).toContain("Query Postgres safely.");
    expect(email.text).not.toContain("No Summary Skill\n  \n");
  });

  it("escapes untrusted digest item text", () => {
    const email = buildDigestEmail({
      siteUrl: SITE,
      dateLabel: "Jun 15, 2026",
      items: [
        {
          title: "<script>alert(1)</script>",
          category: "hooks",
          slug: "x",
          summary: "<b>raw</b>",
        },
      ],
    });

    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toContain("&lt;b&gt;raw&lt;/b&gt;");
    expect(email.text).toContain("<script>alert(1)</script>");
  });

  it("includes standing CTAs and encodes entry paths", () => {
    const email = buildDigestEmail({
      siteUrl: SITE,
      dateLabel: "Jul 1, 2026",
      items: [
        {
          title: "Spaced Title",
          category: "mcp servers",
          slug: "spaced slug",
          summary: "Summary",
        },
      ],
    });

    expect(email.html).toContain(
      `${trimUrl(SITE)}/entry/mcp%20servers/spaced%20slug`,
    );
    expect(email.text).toContain("Built something? Submit it:");
    expect(email.html).toContain("1 new Claude tools worth a look.");
  });
});

describe("shared shell across all templates", () => {
  const emails = [
    buildNewsletterConfirmEmail({
      confirmUrl: `${trimUrl(SITE)}/confirm`,
      siteUrl: SITE,
    }),
    buildWelcomeEmail({ siteUrl: SITE }),
    buildListingLeadAckEmail({
      siteUrl: SITE,
      contactName: "Ada",
      listingTitle: "Role",
      kind: "job",
    }),
    buildDigestEmail({
      siteUrl: SITE,
      dateLabel: "Jun 15, 2026",
      items: [{ title: "X", category: "mcp", slug: "x", summary: "" }],
    }),
  ];

  it("uses the brand font stack without remote font loads", () => {
    for (const email of emails) {
      expect(email.html).toContain("Space Grotesk");
      expect(email.html).toContain("DM Sans");
      expect(email.html).not.toContain("@font-face");
      expect(email.html).not.toContain("/fonts/");
      expect(email.html).not.toContain(".woff2");
    }
  });

  it("uses warm paper canvas and ink tokens", () => {
    for (const email of emails) {
      expect(email.html).toContain(THEME.canvas);
      expect(email.html).toContain(THEME.ink);
    }
  });
});

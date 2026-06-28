import { afterEach, describe, expect, it, vi } from "vitest";

import { buildBriefEmail } from "../apps/web/src/lib/brief-email";
import {
  signBriefApproveToken,
  verifyBriefApproveToken,
} from "../apps/web/src/lib/brief-token.server";
import { nextSendSlot } from "../apps/web/src/lib/brief-schedule";
import {
  recordUmamiEvent,
  sendResendBroadcast,
  sendResendEmail,
} from "../apps/web/src/lib/newsletter-send.server";
import { readDownloadAsset } from "../apps/web/src/lib/download-assets.server";
import {
  search,
  getEntry,
  related,
  relatedGroups,
} from "../apps/web/src/data/search";
import { ENTRIES } from "../apps/web/src/data/entries";
import { COMPARISONS } from "../apps/web/src/data/comparisons";
import {
  CONTRIBUTORS,
  contributorAcceptedEntryRole,
  contributorForVerifiedAuthor,
  contributorMatchesIdentity,
  contributorReviewedEntry,
  contributorSlug,
  getContributor,
  githubHandle,
} from "../apps/web/src/data/contributors";
import {
  ECOSYSTEM_FEEDS,
  contentTypeFor,
} from "../apps/web/src/data/ecosystem-feeds";
import {
  PARTNERS,
  PARTNER_ROLE_LABEL,
  SPONSORS,
} from "../apps/web/src/data/sponsors";
import {
  ENDPOINTS,
  OPENAPI_TAGS,
  getEndpoint,
} from "../apps/web/src/data/openapi";
import { getCommercialTool } from "../apps/web/src/data/tools";
import { formatCompact, timeAgo } from "../apps/web/src/lib/format";
import {
  companyTint,
  daysSince,
  isFresh,
  monogram,
  pickDailySpotlight,
  relativePosted,
  sortJobs,
} from "../apps/web/src/lib/jobs-utils";
import {
  buildSubmissionPacket,
  preflight,
  slugify,
} from "../apps/web/src/lib/submission-spec";
import {
  getAllTagGroups,
  getIndexableTagGroups,
  getTagGroup,
  relatedTags,
  tagSlug,
} from "../apps/web/src/lib/tags";
import {
  getPlatformPage,
  getPlatformPageDefinitions,
  getPlatformPages,
} from "../apps/web/src/lib/platform-pages";
import { getTools, getToolBySlug } from "../apps/web/src/lib/tools";
import {
  hubHighlights,
  hubStats,
  trustPosture,
} from "../apps/web/src/lib/hub-highlights";
import {
  breadcrumbScript,
  itemListScript,
} from "../apps/web/src/lib/seo-jsonld";
import {
  isSitemapIndexableEntry,
  safeSitemapDate,
  sitemapEntryLastModified,
} from "../apps/web/src/lib/sitemap-policy";
import {
  entryEventKey,
  outboundHost,
  trackEvent,
} from "../apps/web/src/lib/analytics";
import {
  buildUmamiPayload,
  isAllowedUmamiHost,
  shouldTrackUmamiPage,
} from "../apps/web/src/components/umami-tracker";
import {
  logApiError,
  logApiInfo,
  logApiWarn,
  redactEmail,
  sample,
} from "../apps/web/src/lib/api-logs";
import {
  clearScrollPos,
  readCopyPref,
  readScrollPos,
  writeCopyPref,
  writeScrollPos,
} from "../apps/web/src/lib/dossier-prefs";
import { getServerConfig } from "../apps/web/src/lib/config.server";
import type { Entry, JobListing } from "../apps/web/src/types/registry";

type StorageLike = Storage & {
  data: Map<string, string>;
};

function memoryStorage(): StorageLike {
  const data = new Map<string, string>();
  return {
    data,
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => {
      data.delete(key);
    },
    setItem: (key: string, value: string) => {
      data.set(key, String(value));
    },
  } as StorageLike;
}

const entry = (overrides: Partial<Entry>): Entry =>
  ({
    category: "mcp",
    slug: "example",
    title: "Example",
    description: "Example description",
    author: "Example",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  }) as Entry;

const job = (overrides: Partial<JobListing>): JobListing => ({
  slug: "job",
  title: "AI Engineer",
  company: "Example Labs",
  location: "Remote",
  isRemote: true,
  type: "Full-time",
  postedAt: "2026-01-01T00:00:00.000Z",
  description: "Build useful AI tools.",
  tier: "standard",
  ...overrides,
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetModules();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("web non-UI utility coverage", () => {
  it("formats compact numbers and relative dates across boundary cases", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-10T12:00:00.000Z"));

    expect(formatCompact(null)).toBe("—");
    expect(formatCompact(999)).toBe("999");
    expect(formatCompact(1_200)).toBe("1.2k");
    expect(formatCompact(120_000)).toBe("120k");
    expect(formatCompact(2_000_000)).toBe("2M");
    expect(formatCompact(1_500_000_000)).toBe("1.5B");
    // Boundary rounding: a value that rounds up to the next unit must promote,
    // not render the nonsensical "1000k" / "1000M".
    expect(formatCompact(999_999)).toBe("1M");
    expect(formatCompact(999_500_000)).toBe("1B");
    // Billions keep one decimal at >=100B (no regression to integer "124B").
    expect(formatCompact(123_500_000_000)).toBe("123.5B");
    expect(timeAgo(null)).toBe("—");
    expect(timeAgo("not-a-date")).toBe("—");
    expect(timeAgo("2026-01-10T11:59:45.000Z")).toBe("just now");
    expect(timeAgo("2026-01-10T11:30:00.000Z")).toBe("30m ago");
    expect(timeAgo("2026-01-10T09:00:00.000Z")).toBe("3h ago");
    expect(timeAgo("2025-12-01T00:00:00.000Z")).toBe("1mo ago");
    expect(timeAgo("2027-06-01T00:00:00.000Z")).toBe("—");

    vi.useRealTimers();
  });

  it("sorts jobs and rotates spotlight picks deterministically", () => {
    const now = Date.parse("2026-01-08T00:00:00.000Z");
    const jobs = [
      job({
        slug: "free-old",
        tier: "free",
        postedAt: "2025-12-01T00:00:00.000Z",
      }),
      job({
        slug: "sponsored-fresh",
        tier: "sponsored",
        compensation: "$180k",
        lastVerifiedAt: "2026-01-07T00:00:00.000Z",
      }),
      job({
        slug: "featured-fresh",
        tier: "featured",
        compensation: "$170k",
        lastVerifiedAt: "2026-01-07T00:00:00.000Z",
      }),
    ];

    expect(monogram("Example AI Labs")).toBe("EA");
    expect(companyTint("Example AI Labs")).toEqual(
      companyTint("Example AI Labs"),
    );
    expect(daysSince("not-a-date", now)).toBe(Infinity);
    expect(relativePosted("2026-01-08T00:00:00.000Z", now)).toBe("today");
    expect(relativePosted("2026-01-07T00:00:00.000Z", now)).toBe("1d ago");
    expect(relativePosted("2025-12-08T00:00:00.000Z", now)).toBe("1mo ago");
    expect(isFresh("2026-01-01T00:00:00.000Z", now)).toBe(true);
    expect(sortJobs(jobs).map((item) => item.slug)).toEqual([
      "sponsored-fresh",
      "featured-fresh",
      "free-old",
    ]);
    expect(pickDailySpotlight(jobs, now)).toMatchObject({
      current: { slug: "featured-fresh" },
      next: { slug: "sponsored-fresh" },
    });
    expect(
      pickDailySpotlight([job({ slug: "thin", isRemote: false })], now),
    ).toEqual({
      current: null,
      next: null,
    });
  });

  it("builds review and audience weekly brief emails from persisted payloads", () => {
    const brief = {
      summary: { newEntryCount: 2, sourceBackedCount: 1, saferInstallCount: 1 },
      sections: {
        newEntries: [
          {
            title: "Escaped <MCP>",
            url: "/entry/mcp/escaped",
            category: "mcp",
            description:
              "A very useful MCP server with source-backed setup notes.",
            sourceUrls: ["https://example.com/source"],
            packageVerified: true,
            dateAdded: "2026-01-08",
          },
        ],
        saferInstalls: [],
      },
    };

    const review = buildBriefEmail({
      brief,
      siteUrl: "https://heyclau.de",
      dateLabel: "2026-01-09",
      approveUrl: "https://gate.example/approve",
    });
    expect(review.subject).toBe("[Review] Weekly Brief — Jan 9");
    expect(review.html).toContain("Escaped &lt;MCP&gt;");
    expect(review.html).toContain("Approve &amp; schedule send");
    expect(review.text).toContain("https://heyclau.de/entry/mcp/escaped");

    const audience = buildBriefEmail({
      brief: { sections: {} },
      siteUrl: "https://heyclau.de",
      dateLabel: "not-a-date",
    });
    expect(audience.subject).toBe("HeyClaude Weekly Brief — not-a-date");
    expect(audience.html).toContain("No notable activity this week.");

    // Theme line, editor note, and density: 4 featured cards + compact overflow.
    const full = buildBriefEmail({
      brief: {
        summary: {
          newEntryCount: 6,
          sourceBackedCount: 0,
          saferInstallCount: 0,
        },
        theme: "6 new this week, led by 6 rules.",
        note: "Glad to be back —\nreply and tell me what to cover.",
        sections: {
          newEntries: Array.from({ length: 6 }, (_, i) => ({
            title: `Entry ${i}`,
            url: `/entry/rules/e${i}`,
            category: "rules",
            description: "desc",
          })),
        },
      },
      siteUrl: "https://heyclau.de",
      dateLabel: "2026-06-19",
    });
    expect(full.html).toContain("6 new this week, led by 6 rules.");
    expect(full.html).toContain("From the editor");
    expect(full.html).toContain("reply and tell me what to cover.");
    expect(full.text).toContain("From the editor:");
    // 4 full cards (14px 16px padding) + 2 compact overflow rows.
    expect((full.html.match(/padding:14px 16px/g) ?? []).length).toBe(4);
    expect(
      (full.html.match(/border-bottom:1px solid #f0ede4/g) ?? []).length,
    ).toBe(2);

    const prototypeCategory = buildBriefEmail({
      brief: {
        sections: {
          newEntries: [
            {
              title: "Prototype category label",
              url: "/entry/tools/prototype",
              category: "constructor",
              description: "Should render a human label, not Object.prototype.",
            },
          ],
        },
      },
      siteUrl: "https://heyclau.de",
      dateLabel: "2026-06-19",
    });
    expect(prototypeCategory.text).toContain("[Constructor]");
    expect(prototypeCategory.text).not.toContain("[Function:");
  });

  it("signs brief approval tokens and rejects tampered, malformed, and expired tokens", async () => {
    const token = await signBriefApproveToken("secret", {
      n: 12,
      p: "2026-01-09",
      exp: 2_000,
    });

    await expect(
      verifyBriefApproveToken("secret", token, 1_000),
    ).resolves.toEqual({
      n: 12,
      p: "2026-01-09",
      exp: 2_000,
    });
    await expect(
      verifyBriefApproveToken("wrong", token, 1_000),
    ).resolves.toBeNull();
    await expect(
      verifyBriefApproveToken("secret", `${token}x`, 1_000),
    ).resolves.toBeNull();
    await expect(
      verifyBriefApproveToken("secret", "missing-dot", 1_000),
    ).resolves.toBeNull();
    await expect(
      verifyBriefApproveToken("secret", token, 3_000),
    ).resolves.toBeNull();
  });

  it("schedules weekly brief sends and treats email/analytics delivery as best effort", async () => {
    expect(nextSendSlot(new Date("2026-06-14T15:59:59.000Z"))).toBe(
      "2026-06-14T16:00:00.000Z",
    );
    expect(nextSendSlot(new Date("2026-06-14T16:00:00.000Z"))).toBe(
      "2026-06-21T16:00:00.000Z",
    );
    expect(nextSendSlot(new Date("2026-06-18T09:00:00.000Z"))).toBe(
      "2026-06-21T16:00:00.000Z",
    );

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 202 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { id: "broadcast-1" } }), {
          status: 201,
        }),
      )
      .mockResolvedValueOnce(new Response("ok", { status: 202 }))
      .mockRejectedValueOnce(new Error("email offline"))
      .mockResolvedValueOnce(new Response("not-json", { status: 500 }))
      .mockRejectedValueOnce(new Error("analytics offline"));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("UMAMI_UPSTREAM_URL", "https://analytics.example.com");
    vi.stubEnv("UMAMI_WEBSITE_ID", "site-1");

    const email = {
      apiKey: "resend-key",
      from: "HeyClaude <briefs@example.com>",
      to: "subscriber@example.com",
      subject: "Welcome",
      html: "<p>Welcome</p>",
      text: "Welcome",
    };
    const broadcast = {
      apiKey: "resend-key",
      segmentId: "segment-1",
      from: "HeyClaude <briefs@example.com>",
      subject: "Weekly brief",
      html: "<p>Brief</p>",
      text: "Brief",
      name: "Weekly brief 1",
    };

    await expect(sendResendEmail(email)).resolves.toBe(true);
    await expect(sendResendBroadcast(broadcast)).resolves.toEqual({
      ok: true,
      status: 201,
      id: "broadcast-1",
    });
    await expect(
      recordUmamiEvent("newsletter_sent", { issue: 1 }),
    ).resolves.toBeUndefined();
    await expect(sendResendEmail(email)).resolves.toBe(false);
    await expect(
      sendResendBroadcast({ ...broadcast, name: "Weekly brief 2" }),
    ).resolves.toEqual({ ok: false, status: 500, id: undefined });
    await expect(
      recordUmamiEvent("newsletter_send_failed", { issue: 2 }),
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer resend-key",
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://analytics.example.com/api/send",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "user-agent": "Mozilla/5.0 (compatible; HeyClaude-newsletter)",
        }),
      }),
    );
  });

  it("writes structured API logs with request metadata and redacts email addresses", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.25);
    const request = new Request("https://heyclau.de/api/test?token=secret", {
      method: "POST",
      headers: {
        "cf-ray": "ray-1",
        "user-agent": "vitest",
      },
    });

    logApiInfo(request, "test.info", { count: 1 });
    logApiWarn(request, "test.warn");
    logApiError(request, "test.error");

    expect(JSON.parse(String(infoSpy.mock.calls[0]?.[0]))).toMatchObject({
      level: "info",
      event: "test.info",
      method: "POST",
      path: "/api/test",
      query: "present",
      cfRay: "ray-1",
      userAgent: "vitest",
      count: 1,
    });
    expect(JSON.parse(String(warnSpy.mock.calls[0]?.[0]))).toMatchObject({
      level: "warn",
      event: "test.warn",
    });
    expect(JSON.parse(String(errorSpy.mock.calls[0]?.[0]))).toMatchObject({
      level: "error",
      event: "test.error",
    });
    expect(sample(0.5)).toBe(true);
    expect(sample(0.1)).toBe(false);
    expect(redactEmail("USER@example.COM ")).toBe("us***@example.com");
    expect(redactEmail("not-an-email")).toBe("invalid");

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    randomSpy.mockRestore();
  });

  it("falls back to Cloudflare assets for download files and surfaces precise misses", async () => {
    const globalWithEnv = globalThis as typeof globalThis & {
      __env__?: unknown;
    };
    const previousEnv = globalWithEnv.__env__;
    const fetchAsset = vi.fn(async (request: Request) => {
      expect(request.url).toBe("https://heyclau.de/downloads/demo.txt");
      return new Response("download-body", { status: 200 });
    });

    try {
      globalWithEnv.__env__ = { ASSETS: { fetch: fetchAsset } };
      const body = await readDownloadAsset(
        "/downloads/demo.txt",
        "https://heyclau.de/current",
      );
      expect(new TextDecoder().decode(body)).toBe("download-body");

      globalWithEnv.__env__ = {
        ASSETS: {
          fetch: vi.fn(async () => new Response("missing", { status: 404 })),
        },
      };
      await expect(
        readDownloadAsset(
          "/downloads/missing.txt",
          "https://heyclau.de/current",
        ),
      ).rejects.toThrow("asset_not_found:404");

      globalWithEnv.__env__ = {};
      await expect(
        readDownloadAsset(
          "/downloads/missing.txt",
          "https://heyclau.de/current",
        ),
      ).rejects.toThrow("asset_not_found:no_assets_binding");
    } finally {
      globalWithEnv.__env__ = previousEnv;
    }
  });

  it("validates submission preflight invariants and packet output", () => {
    expect(slugify("Claude's Helpful MCP!")).toBe("claudes-helpful-mcp");
    expect(preflight("", {})).toContainEqual({
      kind: "blocker",
      message: "Pick a category.",
    });
    expect(
      preflight("mcp", {
        title: "Example",
        slug: "Bad Slug",
        github_url: "http://example.com/repo",
      }).map((issue) => issue.message),
    ).toEqual(
      expect.arrayContaining([
        "Slug must be lowercase kebab-case.",
        "github url must be HTTPS.",
        "Safety notes are required for this category.",
        "Privacy notes are required for this category.",
      ]),
    );
    expect(
      preflight("tools", { github_url: "https://example.com" }),
    ).toContainEqual({
      kind: "warning",
      message:
        "This category needs maintainer routing before website import is enabled.",
    });
    expect(
      buildSubmissionPacket("mcp", {
        title: "Example MCP",
        category: "mcp",
        github_url: "https://github.com/example/mcp",
      }),
    ).toContain("### GitHub URL");
  });

  it("searches generated entries and keeps related-entry grouping bounded", () => {
    expect(ENTRIES.length).toBeGreaterThan(0);
    const first = ENTRIES[0];
    expect(getEntry(first.category, first.slug)?.slug).toBe(first.slug);
    expect(search({ q: first.title, sort: "title" })[0]?.title).toBeTruthy();
    expect(
      search({ categories: [first.category], sort: "newest" }).every(
        (item) => item.category === first.category,
      ),
    ).toBe(true);
    expect(
      search({ installable: true, hasSafetyNotes: true }).every(
        (item) => item.installCommand || item.configSnippet || item.fullCopy,
      ),
    ).toBe(true);
    expect(related(first, 3).length).toBeLessThanOrEqual(3);
    expect(
      relatedGroups(first, 2).every((group) => group.entries.length <= 2),
    ).toBe(true);
  });

  it("keeps static comparison, contributor, and sponsor data internally consistent", () => {
    expect(COMPARISONS.length).toBeGreaterThan(10);
    expect(
      COMPARISONS.every(
        (comparison) =>
          comparison.slug &&
          comparison.title &&
          comparison.seoDescription.length >= 80 &&
          comparison.refs.length >= 2,
      ),
    ).toBe(true);
    expect(new Set(COMPARISONS.map((comparison) => comparison.slug)).size).toBe(
      COMPARISONS.length,
    );

    expect(CONTRIBUTORS.length).toBeGreaterThan(0);
    const topContributor = CONTRIBUTORS[0];
    expect(getContributor(topContributor.slug)).toBe(topContributor);
    expect(topContributor.acceptedCount).toBeGreaterThan(0);
    expect(
      topContributor.categories?.reduce((sum, item) => sum + item.count, 0),
    ).toBe(topContributor.acceptedCount);
    expect(topContributor.sourceSubmissionCount ?? 0).toBeLessThanOrEqual(
      topContributor.acceptedCount,
    );
    expect(topContributor.reviewedCount ?? 0).toBeGreaterThanOrEqual(0);
    expect(
      contributorForVerifiedAuthor(topContributor.name, topContributor.name),
    ).toBe(topContributor);
    expect(
      contributorForVerifiedAuthor(topContributor.name, "spoofing-submitter"),
    ).toBeUndefined();

    expect(SPONSORS.map((sponsor) => sponsor.slug)).toEqual([
      "cloudflare",
      "npm-registry",
    ]);
    expect(PARTNERS.every((partner) => PARTNER_ROLE_LABEL[partner.role])).toBe(
      true,
    );
    expect(PARTNERS.some((partner) => partner.slotState === "open")).toBe(true);
  });

  it("builds tag groups and related tags from normalized live entry tags", () => {
    expect(tagSlug(" Claude Code / MCP ")).toBe("claude-code-mcp");
    const groups = getAllTagGroups();
    expect(groups.length).toBeGreaterThan(0);
    expect(
      getIndexableTagGroups().every((group) => group.entries.length >= 2),
    ).toBe(true);
    const group = groups.find((item) => item.entries.length >= 2) ?? groups[0];
    expect(getTagGroup(group.slug)?.name).toBe(group.name);
    expect(relatedTags(group.slug, 3).length).toBeLessThanOrEqual(3);
    expect(relatedTags("definitely-missing-tag")).toEqual([]);
  });

  it("derives hub highlights and stats from real entry fields only", () => {
    const entries = [
      entry({
        slug: "trusted",
        title: "Trusted",
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-01-05",
      }),
      entry({
        slug: "documented",
        title: "Documented",
        source: "source-backed",
        safetyNotes: "Runs local commands.",
        privacyNotes: "Reads local files.",
        reviewed: true,
        dateAdded: "2026-01-06",
      }),
      entry({
        slug: "popular",
        title: "Popular",
        source: "source-backed",
        repoStats: { stars: 42 },
        dateAdded: "2026-01-04",
      }),
      entry({
        slug: "external",
        title: "External",
        source: "external",
        dateAdded: "2026-01-03",
      }),
      entry({ slug: "newest", title: "Newest", dateAdded: "2026-01-07" }),
    ];

    expect(hubHighlights([entries[0]])).toEqual([]);
    expect(hubHighlights(entries).map((item) => item.entry.slug)).toEqual([
      "trusted",
      "newest",
      "documented",
      "popular",
    ]);
    expect(hubStats(entries).map((stat) => stat.key)).toEqual(
      expect.arrayContaining([
        "trusted",
        "sourced",
        "safety",
        "privacy",
        "reviewed",
      ]),
    );
    expect(
      hubStats(entries).find((stat) => stat.key === "sourced"),
    ).toMatchObject({
      label: "Source-backed",
      count: 3,
      pct: 60,
    });
    expect(trustPosture(entries)).toEqual({ trusted: 1, pct: 20 });
    expect(trustPosture([])).toEqual({ trusted: 0, pct: 0 });
  });

  it("returns platform and commercial tool data without thin generated assumptions", async () => {
    expect(getPlatformPageDefinitions().map((item) => item.slug)).toContain(
      "codex",
    );
    const pages = await getPlatformPages();
    expect(pages.length).toBe(getPlatformPageDefinitions().length);
    expect(await getPlatformPage("missing")).toBeNull();
    expect((await getPlatformPage("codex"))?.feedUrl).toContain("codex");

    const tools = await getTools();
    const tool = tools[0];
    expect(tool).toBeDefined();
    if (!tool) {
      throw new Error("Expected at least one tool fixture");
    }
    expect(await getToolBySlug(tool.slug)).toMatchObject({
      slug: tool.slug,
    });
    expect(getCommercialTool(tool.slug)?.slug).toBe(tool.slug);
    expect(await getToolBySlug("missing-tool")).toBeNull();
  });

  it("emits safe analytics keys, JSON-LD script payloads, and browser preferences", () => {
    expect(() => trackEvent("server_noop")).not.toThrow();

    const track = vi.fn();
    const localStorage = memoryStorage();
    const sessionStorage = memoryStorage();
    const dispatchEvent = vi.fn();
    vi.stubGlobal("window", {
      umami: { track },
      localStorage,
      sessionStorage,
      dispatchEvent,
    });

    trackEvent("entry_source_click", { entry: "mcp/example" });
    expect(track).toHaveBeenCalledWith("entry_source_click", {
      entry: "mcp/example",
    });
    vi.stubGlobal("window", {});
    expect(() => trackEvent("missing_tracker")).not.toThrow();
    vi.stubGlobal("window", {
      umami: {},
      localStorage,
      sessionStorage,
      dispatchEvent,
    });
    expect(() => trackEvent("missing_track_fn")).not.toThrow();
    expect(entryEventKey("mcp", "example")).toBe("mcp/example");
    expect(outboundHost("https://www.example.com/path?q=secret")).toBe(
      "example.com",
    );
    expect(outboundHost("not a url")).toBe("unknown");
    vi.stubGlobal("window", {
      location: {
        hostname: "heyclau.de",
        pathname: "/entry/mcp/example",
        search: "?view=full",
      },
      screen: {
        width: 1440,
        height: 900,
      },
      localStorage,
      sessionStorage,
      dispatchEvent,
    });
    vi.stubGlobal("document", { title: "Example MCP" });
    vi.stubGlobal("navigator", { language: "en-US" });
    expect(isAllowedUmamiHost("HeyClau.DE", ["heyclau.de"])).toBe(true);
    expect(isAllowedUmamiHost("preview.heyclau.de", ["heyclau.de"])).toBe(
      false,
    );
    expect(isAllowedUmamiHost("localhost", [])).toBe(true);
    expect(shouldTrackUmamiPage("/brief/approve")).toBe(false);
    expect(shouldTrackUmamiPage("/entry/mcp/example")).toBe(true);
    expect(
      buildUmamiPayload("site-1", "https://referrer.example/docs", "open", {
        category: "mcp",
      }),
    ).toEqual({
      website: "site-1",
      screen: "1440x900",
      language: "en-US",
      title: "Example MCP",
      hostname: "heyclau.de",
      url: "/entry/mcp/example?view=full",
      referrer: "https://referrer.example/docs",
      name: "open",
      data: { category: "mcp" },
    });

    expect(readCopyPref()).toBeNull();
    writeCopyPref("config");
    expect(readCopyPref()).toBe("config");
    writeScrollPos("mcp", "example", 10.8);
    expect(readScrollPos("mcp", "example")).toBe(11);
    clearScrollPos("mcp", "example");
    expect(readScrollPos("mcp", "example")).toBeNull();
    writeScrollPos("mcp", "example", 0);
    expect(dispatchEvent).toHaveBeenCalled();

    const breadcrumbs = breadcrumbScript([{ name: "MCP", path: "/mcp" }]);
    expect(breadcrumbs.type).toBe("application/ld+json");
    expect(String(breadcrumbs.children)).toContain("https://heyclau.de/mcp");
    expect(
      String(
        itemListScript([{ name: "Example", path: "/entry/mcp/example" }], {
          name: "Examples",
        }).children,
      ),
    ).toContain("ItemList");
  });

  it("exposes generated ecosystem feed, OpenAPI, and sitemap metadata defensively", () => {
    expect(ECOSYSTEM_FEEDS.length).toBeGreaterThan(0);
    expect(
      ECOSYSTEM_FEEDS.every((feed) =>
        ["json", "xml", "txt"].includes(feed.contentType),
      ),
    ).toBe(true);
    expect(ECOSYSTEM_FEEDS.map((feed) => feed.path)).toEqual(
      [...ECOSYSTEM_FEEDS.map((feed) => feed.path)].sort(),
    );
    expect(contentTypeFor("/feed.xml")).toBe("xml");
    expect(contentTypeFor("/llms.txt")).toBe("txt");
    expect(contentTypeFor("/data/feed.json")).toBe("json");

    const contributor = {
      slug: "jane-doe",
      handle: "janedoe",
      name: "Jane Doe",
      github: "https://github.com/janedoe",
      acceptedCount: 1,
    };
    expect(contributorMatchesIdentity(contributor, "Jane Doe")).toBe(true);
    expect(contributorMatchesIdentity(contributor, "janedoe")).toBe(true);
    expect(
      contributorMatchesIdentity(
        contributor,
        "Jane",
        "https://github.com/janedoe",
      ),
    ).toBe(true);
    expect(contributorMatchesIdentity(contributor, "Other Person")).toBe(false);
    expect(
      contributorAcceptedEntryRole(
        contributor,
        entry({
          author: "Example",
          submittedBy: "Jane Doe",
          submittedByUrl: "https://github.com/janedoe",
        }),
      ),
    ).toBe("submitted");
    expect(
      contributorAcceptedEntryRole(contributor, entry({ author: "janedoe" })),
    ).toBe("authored");
    expect(
      contributorAcceptedEntryRole(
        contributor,
        entry({
          author: "Jane Doe",
          submittedBy: "Jane Doe",
          submittedByUrl: "https://github.com/janedoe",
        }),
      ),
    ).toBe("submitted-authored");
    expect(
      contributorReviewedEntry(contributor, entry({ reviewedBy: "janedoe" })),
    ).toBe(true);
    expect(contributorSlug(" @Example User! ")).toBe("example-user");
    expect(githubHandle("https://github.com/JSONbored")).toBe("JSONbored");
    expect(githubHandle("https://example.com/JSONbored")).toBeUndefined();
    expect(githubHandle("not a url")).toBeUndefined();

    expect(OPENAPI_TAGS.map((tag) => tag.id)).toContain("registry");
    expect(OPENAPI_TAGS.map((tag) => tag.id)).toContain("admin");
    const searchEndpoint = getEndpoint("registry-search");
    expect(searchEndpoint).toMatchObject({
      method: "GET",
      tag: "registry",
      liveRequest: true,
    });
    expect(searchEndpoint?.parameters?.map((param) => param.name)).toEqual(
      expect.arrayContaining(["q", "limit"]),
    );
    expect(getEndpoint("missing-endpoint")).toBeUndefined();
    expect(
      ENDPOINTS.some(
        (endpoint) =>
          endpoint.body?.contentType === "application/json" &&
          endpoint.responseExample.includes("{"),
      ),
    ).toBe(true);
    expect(
      ENDPOINTS.filter((endpoint) => endpoint.tag === "admin").every(
        (endpoint) => endpoint.liveRequest === false,
      ),
    ).toBe(true);
    expect(
      ENDPOINTS.some((endpoint) =>
        endpoint.clientExamples?.some((example) =>
          example.code.includes("raycast://"),
        ),
      ),
    ).toBe(true);

    expect(safeSitemapDate(null)).toBeUndefined();
    expect(safeSitemapDate("not-a-date")).toBeUndefined();
    expect(safeSitemapDate("2026-01-01")?.toISOString()).toContain(
      "2026-01-01",
    );
    expect(isSitemapIndexableEntry({ category: "tools" })).toBe(true);
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: false }),
    ).toBe(false);
    expect(
      sitemapEntryLastModified({
        category: "mcp",
        slug: "sitemap-entry",
        title: "Sitemap Entry",
        description: "Sitemap entry.",
        dateAdded: "2026-01-01",
        verifiedAt: "2026-01-02",
        repoUpdatedAt: "bad-date",
        contentUpdatedAt: "",
      } as never)?.toISOString(),
    ).toBeUndefined();
    expect(
      sitemapEntryLastModified({
        category: "mcp",
        slug: "sitemap-entry",
        title: "Sitemap Entry",
        description: "Sitemap entry.",
        dateAdded: "2026-01-01",
        verifiedAt: "2026-01-02",
        repoUpdatedAt: "",
        contentUpdatedAt: "",
      } as never)?.toISOString(),
    ).toContain("2026-01-02");
  });

  it("keeps server config reads request-time and brief issue D1 helpers fail-closed", async () => {
    vi.stubEnv("NODE_ENV", "test-env");
    expect(getServerConfig()).toEqual({ nodeEnv: "test-env" });

    vi.resetModules();
    vi.doMock("../apps/web/src/lib/db", () => ({ getSiteDb: () => null }));
    const nullDb = await import("../apps/web/src/lib/brief-issues.server");
    await expect(
      nullDb.upsertBriefDraft({
        slug: "weekly-2026-01-09",
        periodThrough: "2026-01-09",
        payload: { ok: true },
        generatedAt: "2026-01-09T00:00:00.000Z",
      }),
    ).resolves.toBe(false);
    await expect(nullDb.getLatestPublishedBrief()).resolves.toBeNull();
    await expect(nullDb.listPublishedBriefs()).resolves.toEqual([]);
    await expect(nullDb.getBriefByNumber(1.2)).resolves.toBeNull();
    await expect(
      nullDb.approveBrief(Number.NaN, "2026-01-09T12:00:00.000Z"),
    ).resolves.toBe(false);

    const calls: Array<{ sql: string; binds: unknown[] }> = [];
    let currentRow = {
      number: 1,
      slug: "weekly-2026-01-09",
      period_through: "2026-01-09",
      payload: '{"title":"Brief"}',
      status: "approved",
      generated_at: "2026-01-09T00:00:00.000Z",
      scheduled_send_at: null,
      approved_at: null,
      sent_at: null,
    };
    const db = {
      prepare(sql: string) {
        const call = { sql, binds: [] as unknown[] };
        calls.push(call);
        return {
          bind(...binds: unknown[]) {
            call.binds = binds;
            return this;
          },
          async run() {
            return { meta: { changes: 1 } };
          },
          async first() {
            return currentRow;
          },
          async all() {
            return { results: [currentRow] };
          },
        };
      },
    };

    vi.resetModules();
    vi.doMock("../apps/web/src/lib/db", () => ({ getSiteDb: () => db }));
    const withDb = await import("../apps/web/src/lib/brief-issues.server");
    await expect(
      withDb.upsertBriefDraft({
        slug: "weekly-2026-01-09",
        periodThrough: "2026-01-09",
        payload: { ok: true },
        generatedAt: "2026-01-09T00:00:00.000Z",
      }),
    ).resolves.toBe(true);
    await expect(withDb.getLatestPublishedBrief()).resolves.toMatchObject({
      slug: "weekly-2026-01-09",
      payload: { title: "Brief" },
    });
    await expect(withDb.getBriefByNumber(1)).resolves.toMatchObject({
      slug: "weekly-2026-01-09",
      payload: { title: "Brief" },
    });
    await expect(withDb.listPublishedBriefs(250)).resolves.toHaveLength(1);
    await expect(withDb.getLatestDraft()).resolves.toMatchObject({
      slug: "weekly-2026-01-09",
    });
    currentRow = { ...currentRow, payload: "not-json" };
    await expect(withDb.getBriefByNumber(1)).resolves.toMatchObject({
      payload: {},
    });
    await expect(
      withDb.approveBrief(1, "2026-01-09T12:00:00.000Z"),
    ).resolves.toBe(true);
    await expect(
      withDb.getDueApprovedBriefs("2026-01-09T12:00:00.000Z"),
    ).resolves.toHaveLength(1);
    await expect(withDb.markBriefSent(1)).resolves.toBe(true);
    expect(calls.some((call) => call.binds.includes(100))).toBe(true);

    const missingInfraDb = {
      prepare() {
        return {
          bind() {
            return this;
          },
          async run() {
            throw new Error("no such table: brief_issues");
          },
          async first() {
            throw new Error("no such table: brief_issues");
          },
          async all() {
            throw new Error("no such table: brief_issues");
          },
        };
      },
    };
    vi.resetModules();
    vi.doMock("../apps/web/src/lib/db", () => ({
      getSiteDb: () => missingInfraDb,
    }));
    const missingInfra =
      await import("../apps/web/src/lib/brief-issues.server");
    await expect(
      missingInfra.upsertBriefDraft({
        slug: "weekly-2026-01-09",
        periodThrough: "2026-01-09",
        payload: { ok: true },
        generatedAt: "2026-01-09T00:00:00.000Z",
      }),
    ).resolves.toBe(false);
    await expect(missingInfra.getLatestPublishedBrief()).resolves.toBeNull();
    await expect(missingInfra.listPublishedBriefs()).resolves.toEqual([]);
    await expect(missingInfra.getLatestDraft()).resolves.toBeNull();
    await expect(
      missingInfra.approveBrief(1, "2026-01-09T12:00:00.000Z"),
    ).resolves.toBe(false);
    await expect(
      missingInfra.getDueApprovedBriefs("2026-01-09T12:00:00.000Z"),
    ).resolves.toEqual([]);
    await expect(missingInfra.markBriefSent(1)).resolves.toBe(false);

    const failingDb = {
      prepare() {
        return {
          bind() {
            return this;
          },
          async run() {
            throw new Error("d1 offline");
          },
          async first() {
            throw new Error("d1 offline");
          },
          async all() {
            throw new Error("d1 offline");
          },
        };
      },
    };
    vi.resetModules();
    vi.doMock("../apps/web/src/lib/db", () => ({
      getSiteDb: () => failingDb,
    }));
    const failing = await import("../apps/web/src/lib/brief-issues.server");
    await expect(
      failing.upsertBriefDraft({
        slug: "weekly-2026-01-09",
        periodThrough: "2026-01-09",
        payload: { ok: true },
        generatedAt: "2026-01-09T00:00:00.000Z",
      }),
    ).rejects.toThrow("d1 offline");
    await expect(failing.getLatestPublishedBrief()).rejects.toThrow(
      "d1 offline",
    );
    await expect(failing.getBriefByNumber(1)).rejects.toThrow("d1 offline");
    await expect(failing.listPublishedBriefs()).rejects.toThrow("d1 offline");
    await expect(failing.getLatestDraft()).rejects.toThrow("d1 offline");
    await expect(
      failing.approveBrief(1, "2026-01-09T12:00:00.000Z"),
    ).rejects.toThrow("d1 offline");
    await expect(
      failing.getDueApprovedBriefs("2026-01-09T12:00:00.000Z"),
    ).rejects.toThrow("d1 offline");
    await expect(failing.markBriefSent(1)).rejects.toThrow("d1 offline");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

type Counts = Record<string, unknown>;

const state = vi.hoisted(() => ({
  entries: [] as any[],
  votes: { available: true, counts: {} as Counts },
  community: { available: true, counts: {} as Counts },
  intent: { available: true, counts: {} as Counts },
  voteReads: 0,
  communityReads: 0,
  intentReads: 0,
}));

vi.mock("@/data/entries", () => ({ ENTRIES: state.entries }));
vi.mock("@/lib/votes", () => ({
  safeVoteCounts: () => {
    state.voteReads += 1;
    return Promise.resolve(state.votes);
  },
}));
vi.mock("@/lib/community-signals", () => ({
  entryCommunityTarget: (category: string, slug: string) =>
    `entry:${category}/${slug}`,
  safeCommunitySignalCounts: () => {
    state.communityReads += 1;
    return Promise.resolve(state.community);
  },
}));
vi.mock("@/lib/intent-events", () => ({
  safeIntentEventCounts: () => {
    state.intentReads += 1;
    return Promise.resolve(state.intent);
  },
}));

function entry(slug: string, overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug,
    title: `Entry ${slug}`,
    description: "Public trending fixture",
    canonicalUrl: `https://heyclau.de/entry/mcp/${slug}`,
    platforms: ["claude-code"],
    platformCompatibility: [
      { platform: "claude-code", support: "native-skill" },
    ],
    tags: ["fixture"],
    dateAdded: "2026-05-24",
    downloadTrust: "external",
    verificationStatus: "unverified",
    trustSignals: { sourceStatus: "available" },
    ...overrides,
  };
}

const request = (path: string) =>
  new Request(`https://heyclau.de${path}`, {
    headers: { origin: "https://heyclau.de" },
  });

describe("/api/registry/trending", () => {
  beforeEach(() => {
    vi.resetModules();
    state.entries.length = 0;
    state.entries.push(
      entry("alpha"),
      entry("beta"),
      entry("skill", { category: "skills" }),
    );
    state.votes = {
      available: true,
      counts: { "mcp:beta": 3, "mcp:alpha": 1 },
    };
    state.community = {
      available: true,
      counts: { "entry:mcp/beta": { used: 1, works: 2, broken: 0 } },
    };
    state.intent = {
      available: true,
      counts: {
        "mcp:beta": { copy: 1, open: 1, install: 1, download: 0, vote: 0 },
      },
    };
    state.voteReads = 0;
    state.communityReads = 0;
    state.intentReads = 0;
  });

  it("returns bounded privacy-safe trending entries with filters and reasons", async () => {
    const { GET } =
      await import("../apps/web/src/routes/api/registry/trending");
    const response = await GET(
      request(
        "/api/registry/trending?category=mcp&platform=%20Claude%20&limit=2",
      ),
    );
    const body = await response.json();

    expect(body).toMatchObject({
      kind: "registry-trending",
      category: "mcp",
      platform: "claude",
      count: 2,
      signalsAvailable: { votes: true, community: true, intent: true },
    });
    expect(body.entries[0]).toMatchObject({
      slug: "beta",
      reasons: expect.arrayContaining([
        "upvotes",
        "community_works",
        "recent_intent",
      ]),
      trustSignals: { sourceStatus: "available" },
    });
    for (const entry of body.entries) {
      expect(entry).not.toHaveProperty("clientId");
      expect(entry).not.toHaveProperty("sessionId");
    }
  });

  it("degrades to static trust reasons when dynamic state is unavailable", async () => {
    state.entries.length = 0;
    state.entries.push(
      entry("verified", {
        downloadTrust: "first-party",
        verificationStatus: "production",
      }),
    );
    state.votes = { available: false, counts: { "mcp:verified": 0 } };
    state.community = {
      available: false,
      counts: { "entry:mcp/verified": { used: 0, works: 0, broken: 0 } },
    };
    state.intent = {
      available: false,
      counts: {
        "mcp:verified": { copy: 0, open: 0, install: 0, download: 0, vote: 0 },
      },
    };

    const { GET } =
      await import("../apps/web/src/routes/api/registry/trending");
    const body = await (await GET(request("/api/registry/trending"))).json();

    expect(body.signalsAvailable).toEqual({
      votes: false,
      community: false,
      intent: false,
    });
    expect(body.entries).toEqual([
      expect.objectContaining({
        slug: "verified",
        score: 4,
        reasons: ["first_party_package", "production_verified"],
      }),
    ]);
  });

  it("rejects malformed query parameters before route execution", async () => {
    const { GET } =
      await import("../apps/web/src/routes/api/registry/trending");
    const response = await GET(request("/api/registry/trending?limit=1000"));

    expect(response.status).toBe(400);
  });

  it("rejects unknown query parameters before route execution", async () => {
    const { GET } =
      await import("../apps/web/src/routes/api/registry/trending");
    const response = await GET(
      request("/api/registry/trending?limit=1&cachebust=abc123"),
    );

    expect(response.status).toBe(400);
    expect(state.voteReads).toBe(0);
    expect(state.communityReads).toBe(0);
    expect(state.intentReads).toBe(0);
  });
});

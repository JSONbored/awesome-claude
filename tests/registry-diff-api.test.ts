import { beforeEach, describe, expect, it, vi } from "vitest";

const changelogMock = vi.hoisted(() => ({
  value: {
    schemaVersion: 1 as const,
    kind: "registry-changelog" as const,
    generatedAt: "2026-05-24T00:00:00.000Z",
    count: 0,
    signature: "deadbeefdeadbeefdeadbeefdeadbeef",
    entries: [] as Array<{
      key: string;
      type: "added" | "updated" | "removed";
      category: string;
      slug: string;
      title: string;
      dateAdded: string;
      canonicalUrl: string;
      llmsUrl: string;
      apiUrl: string;
      artifactHash: string;
    }>,
  },
}));

vi.mock("@/lib/content.server", () => ({
  getRegistryChangelog: () => Promise.resolve(changelogMock.value),
}));

function makeEntry(
  overrides: Partial<{
    key: string;
    type: "added" | "updated" | "removed";
    dateAdded: string;
  }> = {},
) {
  const key = overrides.key ?? "mcp:fixture";
  const [category, slug] = key.split(":");
  return {
    key,
    type: overrides.type ?? ("added" as const),
    category,
    slug,
    title: `Fixture ${slug}`,
    dateAdded: overrides.dateAdded ?? "2026-05-19",
    canonicalUrl: `https://heyclau.de/entry/${category}/${slug}`,
    llmsUrl: `https://heyclau.de/data/llms/${category}/${slug}.txt`,
    apiUrl: `https://heyclau.de/api/registry/entries/${category}/${slug}`,
    artifactHash: "0".repeat(64),
  };
}

function request(query: string) {
  return new Request(`https://heyclau.de/api/registry/diff${query}`, {
    headers: { origin: "https://heyclau.de" },
  });
}

describe("/api/registry/diff", () => {
  beforeEach(() => {
    vi.resetModules();
    changelogMock.value = {
      schemaVersion: 1,
      kind: "registry-changelog",
      generatedAt: "2026-05-24T00:00:00.000Z",
      count: 5,
      signature: "deadbeefdeadbeefdeadbeefdeadbeef",
      entries: [
        makeEntry({
          key: "skills:new-may",
          type: "added",
          dateAdded: "2026-05-19",
        }),
        makeEntry({
          key: "mcp:new-apr",
          type: "added",
          dateAdded: "2026-04-01",
        }),
        makeEntry({
          key: "hooks:old-2025",
          type: "added",
          dateAdded: "2025-10-10",
        }),
        makeEntry({
          key: "skills:edit-recent",
          type: "updated",
          dateAdded: "2025-12-01",
        }),
        makeEntry({
          key: "mcp:removed-thing",
          type: "removed",
          dateAdded: "2025-09-01",
        }),
      ],
    };
  });

  it("returns the full changelog when no since cursor is given", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request(""));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      kind: "registry-diff",
      since: null,
      hasChanges: true,
      totalAvailable: 5,
    });
    expect(body.entries).toHaveLength(5);
  });

  it("returns an empty result set when since matches currentSignature", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(
      request(`?since=${changelogMock.value.signature}`),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      hasChanges: false,
      count: 0,
      totalAvailable: 0,
      entries: [],
    });
  });

  it("filters added entries by sinceDate and always surfaces updated/removed entries", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2026-01-01&limit=10"));

    expect(response.status).toBe(200);
    const body = await response.json();
    const keys = body.entries.map((entry: { key: string }) => entry.key);
    // `added` entries on or after 2026-01-01 (drops the 2025-10-10 row).
    expect(keys).toContain("skills:new-may");
    expect(keys).toContain("mcp:new-apr");
    expect(keys).not.toContain("hooks:old-2025");
    // Every updated/removed entry passes through regardless of dateAdded.
    expect(keys).toContain("skills:edit-recent");
    expect(keys).toContain("mcp:removed-thing");
    expect(body.totalAvailable).toBe(4);
  });

  it("returns only updated/removed entries when sinceDate is newer than every added entry", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2030-01-01&limit=10"));

    expect(response.status).toBe(200);
    const body = await response.json();
    const keys = body.entries.map((entry: { key: string }) => entry.key);
    expect(keys).toEqual(
      expect.arrayContaining(["skills:edit-recent", "mcp:removed-thing"]),
    );
    expect(keys).not.toContain("skills:new-may");
    expect(keys).not.toContain("mcp:new-apr");
    expect(keys).not.toContain("hooks:old-2025");
  });

  it("returns every entry when sinceDate is older than every added entry", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2024-01-01&limit=10"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.totalAvailable).toBe(5);
  });

  it("preserves entries order (changelog order, not filter-class order)", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2026-01-01&limit=10"));
    const body = await response.json();
    const keys = body.entries.map((entry: { key: string }) => entry.key);
    // Original changelog order: new-may, new-apr, old-2025, edit-recent, removed-thing
    // With old-2025 filtered out, we expect: new-may, new-apr, edit-recent, removed-thing
    expect(keys).toEqual([
      "skills:new-may",
      "mcp:new-apr",
      "skills:edit-recent",
      "mcp:removed-thing",
    ]);
  });

  it("applies limit AFTER filtering", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2026-01-01&limit=2"));
    const body = await response.json();
    expect(body.totalAvailable).toBe(4);
    expect(body.count).toBe(2);
    expect(body.entries).toHaveLength(2);
  });

  it("falls back to the no-filter path when since is unparseable as a date or hash", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=not-a-real-cursor"));
    const body = await response.json();
    // Neither a hash match nor a parseable date — treat as no filter (existing
    // behavior), so all entries come back.
    expect(body.totalAvailable).toBe(5);
    expect(body.entries).toHaveLength(5);
  });

  it("emits the snapshot note for an unknown hash since", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(
      request("?since=ffffffffffffffffffffffffffffffff"),
    );
    const body = await response.json();
    expect(body.note).toMatch(/Unknown hash/);
    expect(body.totalAvailable).toBe(5);
  });

  it("emits the date-cursor note explaining filtered semantics", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2026-01-01"));
    const body = await response.json();
    expect(body.note).toMatch(/Date cursors filter/);
    expect(body.note).toMatch(/updated.*removed/);
  });

  it("still returns response.ok for the e2e smoke shape", async () => {
    // Mirrors tests/e2e/site-regression.spec.ts:95 — the e2e test only checks
    // response.ok, so this regression-pins that contract.
    const { GET } = await import("../apps/web/src/routes/api/registry/diff");
    const response = await GET(request("?since=2026-01-01&limit=5"));
    expect(response.ok).toBe(true);
  });
});

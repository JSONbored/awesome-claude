import { describe, expect, it } from "vitest";

import {
  pickAtlasEntry,
  scrubAtlasCredentialPlaceholders,
} from "../scripts/lib/atlas-entry.mjs";

describe("scrubAtlasCredentialPlaceholders", () => {
  it("replaces known credential placeholders inside strings", () => {
    expect(
      scrubAtlasCredentialPlaceholders(
        "connect via postgresql://user:password@host:port/database now",
      ),
    ).toBe(
      "connect via PostgreSQL connection URI with user, password, host, port, and database now",
    );
    expect(
      scrubAtlasCredentialPlaceholders("redis://:password@host:6379"),
    ).toBe("Redis connection URI with password authentication");
  });

  it("leaves unrelated strings untouched", () => {
    expect(scrubAtlasCredentialPlaceholders("just text")).toBe("just text");
  });

  it("recurses through arrays and plain objects", () => {
    expect(
      scrubAtlasCredentialPlaceholders({
        note: "redis://:password@host:6379",
        list: ["postgresql://user:password@localhost:5432/mydb", "keep"],
      }),
    ).toEqual({
      note: "Redis connection URI with password authentication",
      list: [
        "PostgreSQL connection URI stored in POSTGRES_CONNECTION_STRING",
        "keep",
      ],
    });
  });

  it("passes non-string, non-container values through unchanged", () => {
    expect(scrubAtlasCredentialPlaceholders(42)).toBe(42);
    expect(scrubAtlasCredentialPlaceholders(true)).toBe(true);
    expect(scrubAtlasCredentialPlaceholders(null)).toBe(null);
    expect(scrubAtlasCredentialPlaceholders(undefined)).toBe(undefined);
  });
});

describe("pickAtlasEntry", () => {
  it("derives repoStats from a repoUrl and scrubs nested credentials", () => {
    const result = pickAtlasEntry({
      category: "mcp",
      slug: "example",
      title: "Example",
      description: "uses redis://:password@host:6379 internally",
      repoUrl: "https://github.com/owner/repo",
      githubStars: 12,
      githubForks: 3,
      repoUpdatedAt: "2026-01-01",
    });

    expect(result.description).toBe(
      "uses Redis connection URI with password authentication internally",
    );
    expect(result.repoStats).toEqual({
      repository: "owner/repo",
      url: "https://github.com/owner/repo",
      stars: 12,
      forks: 3,
      updatedAt: "2026-01-01",
      appliesTo: "listing_source_repo",
      label: "Source repo",
    });
  });

  it("builds repoStats from stats alone when there is no repoUrl", () => {
    const result = pickAtlasEntry({ slug: "x", githubStars: 5 });
    expect(result.repoStats).toEqual({
      repository: undefined,
      url: undefined,
      stars: 5,
      forks: undefined,
      updatedAt: undefined,
      appliesTo: "none",
      label: "Source repo",
    });
  });

  it("omits repoStats when there is no repo signal", () => {
    const result = pickAtlasEntry({ slug: "x" });
    expect(result.repoStats).toBeUndefined();
  });

  it("projects trustSignals when present and omits them otherwise", () => {
    const withTrust = pickAtlasEntry({
      slug: "x",
      trustSignals: {
        firstPartyEditorial: true,
        sourceStatus: "verified",
        lastVerifiedAt: "2026-02-02",
        platforms: ["claude"],
        supportLevels: ["full"],
      },
    });
    expect(withTrust.trustSignals).toEqual({
      firstPartyEditorial: true,
      sourceStatus: "verified",
      lastVerifiedAt: "2026-02-02",
      platforms: ["claude"],
      supportLevels: ["full"],
    });

    expect(pickAtlasEntry({ slug: "x" }).trustSignals).toBeUndefined();
  });
});

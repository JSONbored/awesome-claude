import { describe, expect, it } from "vitest";

import {
  enumerateContentVoteKeys,
  findOrphanVoteKeys,
} from "../scripts/lib/enumerate-content-vote-keys.mjs";

describe("d1 vote key helpers", () => {
  it("findOrphanVoteKeys returns keys not in the catalog set", () => {
    const expected = new Set(["mcp:alpha", "skills:beta"]);
    const orphans = findOrphanVoteKeys(
      ["mcp:alpha", "mcp:old-slug", "skills:beta"],
      expected,
    );
    expect(orphans).toEqual(["mcp:old-slug"]);
  });

  it("enumerateContentVoteKeys includes category:slug for mdx entries", () => {
    const keys = enumerateContentVoteKeys(process.cwd());
    expect(keys.size).toBeGreaterThan(0);
    for (const key of keys) {
      expect(key).toMatch(/^[a-z0-9-]+:[a-z0-9-]+$/);
    }
  });

  it("flags orphan votes_by_client entry keys after slug rename", () => {
    const expectedAfterRename = new Set(["skills:new-slug"]);
    const clientVoteKeys = ["skills:old-slug", "skills:new-slug"];
    expect(findOrphanVoteKeys(clientVoteKeys, expectedAfterRename)).toEqual([
      "skills:old-slug",
    ]);
  });

  it("flags orphan votes_by_client entry keys after entry deletion", () => {
    const expectedAfterDelete = new Set(["mcp:kept-entry"]);
    const clientVoteKeys = ["mcp:deleted-entry", "mcp:kept-entry"];
    expect(findOrphanVoteKeys(clientVoteKeys, expectedAfterDelete)).toEqual([
      "mcp:deleted-entry",
    ]);
  });
});

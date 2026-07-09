import { describe, expect, it } from "vitest";

import { classifyRegistryPath } from "../apps/web/src/lib/registry-event-classify-lib";

const COMMIT = "abc123";
const DATE = "2026-07-08T12:00:00.000Z";

const classify = (path: string) =>
  classifyRegistryPath(path, "added", COMMIT, DATE);

describe("classifyRegistryPath", () => {
  it("classifies a content entry, carrying category and slug", () => {
    expect(classify("content/mcp/opensearch.mdx")).toEqual({
      id: `${COMMIT}:content/mcp/opensearch.mdx`,
      kind: "entry",
      category: "mcp",
      slug: "opensearch",
      action: "added",
      commit: COMMIT,
      date: DATE,
    });
  });

  it("accepts .md and .json entry extensions", () => {
    expect(classify("content/agents/x.md")?.kind).toBe("entry");
    expect(classify("content/agents/x.json")?.kind).toBe("entry");
  });

  it("rejects an unsupported entry extension", () => {
    expect(classify("content/agents/x.txt")).toBeNull();
  });

  it("rejects a nested entry path (slug may not contain a slash)", () => {
    expect(classify("content/agents/nested/x.mdx")).toBeNull();
  });

  it("treats a two-segment changelog path as an entry, since the entry rule runs first", () => {
    const ev = classify("content/changelog/x.mdx");
    expect(ev?.kind).toBe("entry");
    expect(ev?.category).toBe("changelog");
  });

  it("classifies a changelog path that does not match the entry rule", () => {
    expect(classify("content/changelog/2026/notes.txt")?.kind).toBe(
      "changelog",
    );
  });

  it("classifies any registry-changelog.json path as changelog", () => {
    const ev = classify("apps/web/public/data/registry-changelog.json");
    expect(ev?.kind).toBe("changelog");
    expect(ev?.category).toBeUndefined();
  });

  it("classifies a validators path as validator", () => {
    expect(classify("apps/web/src/routes/validators.tsx")?.kind).toBe(
      "validator",
    );
  });

  it("returns null for an unrelated path", () => {
    expect(classify("README.md")).toBeNull();
    expect(classify("apps/web/src/lib/utils.ts")).toBeNull();
  });

  it("threads the action, commit and date through", () => {
    const ev = classifyRegistryPath(
      "content/mcp/x.mdx",
      "removed",
      "deadbeef",
      DATE,
    );
    expect(ev).toMatchObject({
      action: "removed",
      commit: "deadbeef",
      date: DATE,
    });
    expect(ev?.id).toBe("deadbeef:content/mcp/x.mdx");
  });
});

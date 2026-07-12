import path from "node:path";

import { describe, expect, it } from "vitest";

import { artifactOutputPath } from "../scripts/lib/artifact-output-path.mjs";

const dataDir = path.resolve("some", "public", "data");

describe("artifactOutputPath", () => {
  it("resolves a relative artifact path under the data dir", () => {
    expect(artifactOutputPath("entries/agents/x.json", dataDir)).toBe(
      path.join(dataDir, "entries", "agents", "x.json"),
    );
  });

  it("normalizes '.'-style segments that stay inside the dir", () => {
    expect(artifactOutputPath("./feeds/index.json", dataDir)).toBe(
      path.join(dataDir, "feeds", "index.json"),
    );
  });

  it("allows the data dir itself as a target", () => {
    expect(artifactOutputPath(".", dataDir)).toBe(dataDir);
  });

  it("rejects a path that escapes the data dir via traversal", () => {
    expect(() => artifactOutputPath("../evil.json", dataDir)).toThrow(
      /outside public data dir/,
    );
  });

  it("rejects an absolute path outside the data dir", () => {
    const outside = path.resolve("some", "other", "place.json");
    expect(() => artifactOutputPath(outside, dataDir)).toThrow(
      /outside public data dir/,
    );
  });

  it("accepts an absolute path that lands inside the data dir", () => {
    const inside = path.join(dataDir, "search-index.json");
    expect(artifactOutputPath(inside, dataDir)).toBe(inside);
  });
});

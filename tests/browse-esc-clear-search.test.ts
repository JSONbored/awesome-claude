import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

const browseSource = () =>
  fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/browse.tsx"),
    "utf8",
  );

describe("browse Escape clears search input (#5716)", () => {
  // Hint strip advertises esc → clear input, but shortcuts only bound "/" and
  // "["/"]". Escape must register with whenTyping so it works inside the
  // search INPUT; keep it on a separate call so density shortcuts stay quiet.
  it("registers Escape with whenTyping and clears qInput when search is focused", () => {
    const source = browseSource();
    expect(source).toMatch(/Escape:\s*\(\)\s*=>/);
    expect(source).toContain("{ whenTyping: true }");
    expect(source).toContain("document.activeElement !== searchRef.current");
    expect(source).toContain('setQInput("")');
    expect(source).toContain(">esc</kbd>");
    expect(source).toContain("clear input");
  });

  it("keeps / and density shortcuts on a registration without whenTyping", () => {
    const source = browseSource();
    // First registration: focus + density only.
    expect(source).toMatch(
      /useKeyboardShortcuts\(\{\s*"\/":[\s\S]*?"\]":[\s\S]*?"\[":[\s\S]*?\}\);/,
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  SITE_URL,
  buildDirectoryEntries,
  truncateText,
} from "@heyclaude/registry";

describe("registry artifacts re-export", () => {
  it("re-exports SITE_URL from artifacts-lib", () => {
    expect(SITE_URL).toBe("https://heyclau.de");
  });

  it("re-exports truncateText through the public registry surface", () => {
    expect(truncateText("Hello world", 5)).toBe("He...");
  });

  it("re-exports buildDirectoryEntries through the public registry surface", () => {
    const rows = buildDirectoryEntries([
      {
        category: "mcp",
        slug: "demo",
        title: "Demo MCP",
        description: "Test server.",
        dateAdded: "2026-01-01",
      },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].slug).toBe("demo");
  });
});

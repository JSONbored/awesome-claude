import { describe, expect, it } from "vitest";

import {
  entryEventKey,
  outboundHost,
  searchEventKey,
  truncateQuery,
} from "@/lib/analytics";

describe("entryEventKey", () => {
  it("returns category/slug as a stable composite key", () => {
    expect(entryEventKey("mcp", "browser-bridge")).toBe("mcp/browser-bridge");
    expect(entryEventKey("skills", "code-review")).toBe("skills/code-review");
  });
});

describe("outboundHost", () => {
  it("strips www. and returns the bare hostname", () => {
    expect(outboundHost("https://www.example.com/path?q=secret")).toBe("example.com");
    expect(outboundHost("https://github.com/user/repo")).toBe("github.com");
  });

  it("returns 'unknown' for non-URL inputs", () => {
    expect(outboundHost("not a url")).toBe("unknown");
    expect(outboundHost("")).toBe("unknown");
  });
});

describe("truncateQuery", () => {
  it("returns short queries unchanged (whitespace collapsed)", () => {
    expect(truncateQuery("browser mcp")).toBe("browser mcp");
    expect(truncateQuery("  multi   space  ")).toBe("multi space");
    expect(truncateQuery("")).toBe("");
  });

  it("truncates at the default 80-character cap", () => {
    const long = "a".repeat(100);
    const result = truncateQuery(long);
    expect(result.length).toBe(80);
  });

  it("respects a custom max", () => {
    const result = truncateQuery("one two three", 7);
    expect(result).toBe("one two");
    expect(result.length).toBeLessThanOrEqual(7);
  });

  it("collapses internal whitespace before measuring length", () => {
    // 10 spaces + 70 'a's → after collapse becomes "a"×70 (< 80 chars)
    const spaced = " ".repeat(10) + "a".repeat(70);
    expect(truncateQuery(spaced)).toBe("a".repeat(70));
  });
});

describe("searchEventKey", () => {
  it("returns the bare truncated query when there are no active filters", () => {
    expect(searchEventKey("mcp servers")).toBe("mcp servers");
    expect(searchEventKey("mcp servers", {})).toBe("mcp servers");
    expect(searchEventKey("mcp servers", { categories: [] })).toBe("mcp servers");
    expect(searchEventKey("mcp servers", { installable: false })).toBe("mcp servers");
  });

  it("appends filter key:value pairs separated by pipes", () => {
    const key = searchEventKey("test", { categories: ["mcp"] });
    expect(key).toBe("test|categories:mcp");
  });

  it("sorts array filter values so ordering does not affect the key", () => {
    const a = searchEventKey("test", { categories: ["skills", "mcp"] });
    const b = searchEventKey("test", { categories: ["mcp", "skills"] });
    expect(a).toBe(b);
    expect(a).toBe("test|categories:mcp,skills");
  });

  it("sorts multiple filter keys so insertion order does not matter", () => {
    const a = searchEventKey("q", { trust: ["trusted"], categories: ["mcp"] });
    const b = searchEventKey("q", { categories: ["mcp"], trust: ["trusted"] });
    expect(a).toBe(b);
    expect(a).toContain("categories:mcp");
    expect(a).toContain("trust:trusted");
  });

  it("includes boolean filters when true but omits them when false or null", () => {
    const withFlag = searchEventKey("q", { hasSafetyNotes: true });
    const withoutFlag = searchEventKey("q", { hasSafetyNotes: false });
    expect(withFlag).toBe("q|hasSafetyNotes:true");
    expect(withoutFlag).toBe("q");
  });

  it("omits null and undefined filter values", () => {
    expect(searchEventKey("q", { categories: undefined, trust: null as never })).toBe("q");
  });

  it("truncates the query portion to the default 80-char cap", () => {
    const longQuery = "x".repeat(100);
    const key = searchEventKey(longQuery, {});
    expect(key.length).toBe(80);
  });
});

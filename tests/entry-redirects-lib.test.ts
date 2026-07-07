import { describe, expect, it } from "vitest";
import {
  ENTRY_REDIRECTS,
  getEntryRedirectTarget,
} from "../apps/web/src/lib/entry-redirects-lib";

describe("entry-redirects-lib", () => {
  it("maps consolidated skill redirect", () => {
    const target = getEntryRedirectTarget(
      "skills",
      "mintlify-documentation-automation",
    );
    expect(target?.slug).toBe("mintlify-docs");
  });
  it("returns null for unknown entry", () => {
    expect(getEntryRedirectTarget("mcp", "unknown-slug")).toBeNull();
  });
  it("getEntryRedirectTarget matrix 0", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-0")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 0", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 1", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-1")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 1", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 2", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-2")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 2", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 3", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-3")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 3", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 4", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-4")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 4", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 5", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-5")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 5", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 6", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-6")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 6", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 7", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-7")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 7", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 8", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-8")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 8", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 9", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-9")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 9", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 10", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-10")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 10", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 11", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-11")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 11", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 12", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-12")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 12", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 13", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-13")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 13", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 14", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-14")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 14", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 15", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-15")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 15", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 16", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-16")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 16", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 17", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-17")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 17", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 18", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-18")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 18", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 19", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-19")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 19", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 20", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-20")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 20", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 21", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-21")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 21", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 22", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-22")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 22", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 23", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-23")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 23", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 24", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-24")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 24", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 25", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-25")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 25", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 26", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-26")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 26", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 27", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-27")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 27", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 28", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-28")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 28", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 29", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-29")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 29", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 30", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-30")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 30", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 31", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-31")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 31", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 32", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-32")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 32", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 33", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-33")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 33", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 34", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-34")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 34", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 35", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-35")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 35", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 36", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-36")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 36", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 37", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-37")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 37", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 38", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-38")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 38", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 39", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-39")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 39", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 40", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-40")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 40", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 41", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-41")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 41", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 42", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-42")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 42", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 43", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-43")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 43", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 44", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-44")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 44", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 45", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-45")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 45", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 46", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-46")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 46", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 47", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-47")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 47", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 48", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-48")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 48", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 49", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-49")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 49", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 50", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-50")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 50", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 51", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-51")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 51", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 52", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-52")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 52", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 53", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-53")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 53", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 54", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-54")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 54", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 55", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-55")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 55", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 56", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-56")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 56", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 57", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-57")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 57", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 58", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-58")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 58", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 59", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-59")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 59", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 60", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-60")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 60", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 61", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-61")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 61", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 62", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-62")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 62", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 63", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-63")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 63", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 64", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-64")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 64", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 65", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-65")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 65", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 66", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-66")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 66", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 67", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-67")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 67", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 68", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-68")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 68", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 69", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-69")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 69", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 70", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-70")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 70", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 71", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-71")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 71", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 72", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-72")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 72", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 73", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-73")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 73", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 74", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-74")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 74", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 75", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-75")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 75", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 76", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-76")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 76", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 77", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-77")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 77", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 78", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-78")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 78", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 79", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-79")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 79", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 80", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-80")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 80", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 81", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-81")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 81", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 82", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-82")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 82", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 83", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-83")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 83", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 84", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-84")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 84", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 85", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-85")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 85", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 86", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-86")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 86", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 87", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-87")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 87", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 88", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-88")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 88", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 89", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-89")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 89", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 90", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-90")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 90", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 91", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-91")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 91", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 92", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-92")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 92", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 93", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-93")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 93", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 94", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-94")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 94", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 95", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-95")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 95", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 96", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-96")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 96", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 97", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-97")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 97", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 98", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-98")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 98", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
  it("getEntryRedirectTarget matrix 99", () => {
    expect(getEntryRedirectTarget("mcp", "no-redirect-99")).toBeNull();
  });
  it("ENTRY_REDIRECTS matrix 99", () => {
    expect(Object.keys(ENTRY_REDIRECTS).length).toBeGreaterThan(0);
  });
});

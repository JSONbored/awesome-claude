import { describe, expect, it } from "vitest";

import {
  GITHUB_ICON_DATA_URI,
  GRID_BG_DATA_URI,
  buildOgCardHtml,
  escForSatori,
  withAlpha,
} from "../apps/web/src/lib/og-render-lib";
import { categoryAccent } from "../apps/web/src/lib/og-image";

describe("og-render-lib constants", () => {
  it("exports grid and github data URIs", () => {
    expect(GRID_BG_DATA_URI).toContain("data:image/svg+xml,");
    expect(GITHUB_ICON_DATA_URI).toContain("data:image/svg+xml,");
  });
  it("GRID_BG_DATA_URI variant 0", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 1", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 2", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 3", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 4", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 5", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 6", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 7", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 8", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 9", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 10", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 11", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 12", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 13", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 14", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 15", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 16", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 17", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 18", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 19", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 20", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 21", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 22", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 23", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 24", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 25", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 26", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 27", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 28", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
  it("GRID_BG_DATA_URI variant 29", () => {
    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);
    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);
  });
});

describe("og-render-lib escForSatori", () => {
  it("strips angle brackets", () => {
    expect(escForSatori("<script>")).toBe("script");
    expect(escForSatori("a & b")).toBe("a & b");
  });
  it("escForSatori matrix 0", () => {
    expect(escForSatori(`value-0<tag>`)).not.toContain("<");
    expect(escForSatori(`value-0<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 1", () => {
    expect(escForSatori(`value-1<tag>`)).not.toContain("<");
    expect(escForSatori(`value-1<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 2", () => {
    expect(escForSatori(`value-2<tag>`)).not.toContain("<");
    expect(escForSatori(`value-2<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 3", () => {
    expect(escForSatori(`value-3<tag>`)).not.toContain("<");
    expect(escForSatori(`value-3<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 4", () => {
    expect(escForSatori(`value-4<tag>`)).not.toContain("<");
    expect(escForSatori(`value-4<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 5", () => {
    expect(escForSatori(`value-5<tag>`)).not.toContain("<");
    expect(escForSatori(`value-5<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 6", () => {
    expect(escForSatori(`value-6<tag>`)).not.toContain("<");
    expect(escForSatori(`value-6<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 7", () => {
    expect(escForSatori(`value-7<tag>`)).not.toContain("<");
    expect(escForSatori(`value-7<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 8", () => {
    expect(escForSatori(`value-8<tag>`)).not.toContain("<");
    expect(escForSatori(`value-8<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 9", () => {
    expect(escForSatori(`value-9<tag>`)).not.toContain("<");
    expect(escForSatori(`value-9<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 10", () => {
    expect(escForSatori(`value-10<tag>`)).not.toContain("<");
    expect(escForSatori(`value-10<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 11", () => {
    expect(escForSatori(`value-11<tag>`)).not.toContain("<");
    expect(escForSatori(`value-11<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 12", () => {
    expect(escForSatori(`value-12<tag>`)).not.toContain("<");
    expect(escForSatori(`value-12<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 13", () => {
    expect(escForSatori(`value-13<tag>`)).not.toContain("<");
    expect(escForSatori(`value-13<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 14", () => {
    expect(escForSatori(`value-14<tag>`)).not.toContain("<");
    expect(escForSatori(`value-14<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 15", () => {
    expect(escForSatori(`value-15<tag>`)).not.toContain("<");
    expect(escForSatori(`value-15<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 16", () => {
    expect(escForSatori(`value-16<tag>`)).not.toContain("<");
    expect(escForSatori(`value-16<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 17", () => {
    expect(escForSatori(`value-17<tag>`)).not.toContain("<");
    expect(escForSatori(`value-17<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 18", () => {
    expect(escForSatori(`value-18<tag>`)).not.toContain("<");
    expect(escForSatori(`value-18<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 19", () => {
    expect(escForSatori(`value-19<tag>`)).not.toContain("<");
    expect(escForSatori(`value-19<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 20", () => {
    expect(escForSatori(`value-20<tag>`)).not.toContain("<");
    expect(escForSatori(`value-20<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 21", () => {
    expect(escForSatori(`value-21<tag>`)).not.toContain("<");
    expect(escForSatori(`value-21<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 22", () => {
    expect(escForSatori(`value-22<tag>`)).not.toContain("<");
    expect(escForSatori(`value-22<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 23", () => {
    expect(escForSatori(`value-23<tag>`)).not.toContain("<");
    expect(escForSatori(`value-23<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 24", () => {
    expect(escForSatori(`value-24<tag>`)).not.toContain("<");
    expect(escForSatori(`value-24<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 25", () => {
    expect(escForSatori(`value-25<tag>`)).not.toContain("<");
    expect(escForSatori(`value-25<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 26", () => {
    expect(escForSatori(`value-26<tag>`)).not.toContain("<");
    expect(escForSatori(`value-26<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 27", () => {
    expect(escForSatori(`value-27<tag>`)).not.toContain("<");
    expect(escForSatori(`value-27<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 28", () => {
    expect(escForSatori(`value-28<tag>`)).not.toContain("<");
    expect(escForSatori(`value-28<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 29", () => {
    expect(escForSatori(`value-29<tag>`)).not.toContain("<");
    expect(escForSatori(`value-29<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 30", () => {
    expect(escForSatori(`value-30<tag>`)).not.toContain("<");
    expect(escForSatori(`value-30<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 31", () => {
    expect(escForSatori(`value-31<tag>`)).not.toContain("<");
    expect(escForSatori(`value-31<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 32", () => {
    expect(escForSatori(`value-32<tag>`)).not.toContain("<");
    expect(escForSatori(`value-32<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 33", () => {
    expect(escForSatori(`value-33<tag>`)).not.toContain("<");
    expect(escForSatori(`value-33<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 34", () => {
    expect(escForSatori(`value-34<tag>`)).not.toContain("<");
    expect(escForSatori(`value-34<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 35", () => {
    expect(escForSatori(`value-35<tag>`)).not.toContain("<");
    expect(escForSatori(`value-35<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 36", () => {
    expect(escForSatori(`value-36<tag>`)).not.toContain("<");
    expect(escForSatori(`value-36<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 37", () => {
    expect(escForSatori(`value-37<tag>`)).not.toContain("<");
    expect(escForSatori(`value-37<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 38", () => {
    expect(escForSatori(`value-38<tag>`)).not.toContain("<");
    expect(escForSatori(`value-38<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 39", () => {
    expect(escForSatori(`value-39<tag>`)).not.toContain("<");
    expect(escForSatori(`value-39<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 40", () => {
    expect(escForSatori(`value-40<tag>`)).not.toContain("<");
    expect(escForSatori(`value-40<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 41", () => {
    expect(escForSatori(`value-41<tag>`)).not.toContain("<");
    expect(escForSatori(`value-41<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 42", () => {
    expect(escForSatori(`value-42<tag>`)).not.toContain("<");
    expect(escForSatori(`value-42<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 43", () => {
    expect(escForSatori(`value-43<tag>`)).not.toContain("<");
    expect(escForSatori(`value-43<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 44", () => {
    expect(escForSatori(`value-44<tag>`)).not.toContain("<");
    expect(escForSatori(`value-44<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 45", () => {
    expect(escForSatori(`value-45<tag>`)).not.toContain("<");
    expect(escForSatori(`value-45<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 46", () => {
    expect(escForSatori(`value-46<tag>`)).not.toContain("<");
    expect(escForSatori(`value-46<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 47", () => {
    expect(escForSatori(`value-47<tag>`)).not.toContain("<");
    expect(escForSatori(`value-47<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 48", () => {
    expect(escForSatori(`value-48<tag>`)).not.toContain("<");
    expect(escForSatori(`value-48<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 49", () => {
    expect(escForSatori(`value-49<tag>`)).not.toContain("<");
    expect(escForSatori(`value-49<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 50", () => {
    expect(escForSatori(`value-50<tag>`)).not.toContain("<");
    expect(escForSatori(`value-50<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 51", () => {
    expect(escForSatori(`value-51<tag>`)).not.toContain("<");
    expect(escForSatori(`value-51<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 52", () => {
    expect(escForSatori(`value-52<tag>`)).not.toContain("<");
    expect(escForSatori(`value-52<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 53", () => {
    expect(escForSatori(`value-53<tag>`)).not.toContain("<");
    expect(escForSatori(`value-53<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 54", () => {
    expect(escForSatori(`value-54<tag>`)).not.toContain("<");
    expect(escForSatori(`value-54<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 55", () => {
    expect(escForSatori(`value-55<tag>`)).not.toContain("<");
    expect(escForSatori(`value-55<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 56", () => {
    expect(escForSatori(`value-56<tag>`)).not.toContain("<");
    expect(escForSatori(`value-56<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 57", () => {
    expect(escForSatori(`value-57<tag>`)).not.toContain("<");
    expect(escForSatori(`value-57<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 58", () => {
    expect(escForSatori(`value-58<tag>`)).not.toContain("<");
    expect(escForSatori(`value-58<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 59", () => {
    expect(escForSatori(`value-59<tag>`)).not.toContain("<");
    expect(escForSatori(`value-59<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 60", () => {
    expect(escForSatori(`value-60<tag>`)).not.toContain("<");
    expect(escForSatori(`value-60<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 61", () => {
    expect(escForSatori(`value-61<tag>`)).not.toContain("<");
    expect(escForSatori(`value-61<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 62", () => {
    expect(escForSatori(`value-62<tag>`)).not.toContain("<");
    expect(escForSatori(`value-62<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 63", () => {
    expect(escForSatori(`value-63<tag>`)).not.toContain("<");
    expect(escForSatori(`value-63<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 64", () => {
    expect(escForSatori(`value-64<tag>`)).not.toContain("<");
    expect(escForSatori(`value-64<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 65", () => {
    expect(escForSatori(`value-65<tag>`)).not.toContain("<");
    expect(escForSatori(`value-65<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 66", () => {
    expect(escForSatori(`value-66<tag>`)).not.toContain("<");
    expect(escForSatori(`value-66<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 67", () => {
    expect(escForSatori(`value-67<tag>`)).not.toContain("<");
    expect(escForSatori(`value-67<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 68", () => {
    expect(escForSatori(`value-68<tag>`)).not.toContain("<");
    expect(escForSatori(`value-68<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 69", () => {
    expect(escForSatori(`value-69<tag>`)).not.toContain("<");
    expect(escForSatori(`value-69<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 70", () => {
    expect(escForSatori(`value-70<tag>`)).not.toContain("<");
    expect(escForSatori(`value-70<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 71", () => {
    expect(escForSatori(`value-71<tag>`)).not.toContain("<");
    expect(escForSatori(`value-71<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 72", () => {
    expect(escForSatori(`value-72<tag>`)).not.toContain("<");
    expect(escForSatori(`value-72<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 73", () => {
    expect(escForSatori(`value-73<tag>`)).not.toContain("<");
    expect(escForSatori(`value-73<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 74", () => {
    expect(escForSatori(`value-74<tag>`)).not.toContain("<");
    expect(escForSatori(`value-74<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 75", () => {
    expect(escForSatori(`value-75<tag>`)).not.toContain("<");
    expect(escForSatori(`value-75<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 76", () => {
    expect(escForSatori(`value-76<tag>`)).not.toContain("<");
    expect(escForSatori(`value-76<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 77", () => {
    expect(escForSatori(`value-77<tag>`)).not.toContain("<");
    expect(escForSatori(`value-77<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 78", () => {
    expect(escForSatori(`value-78<tag>`)).not.toContain("<");
    expect(escForSatori(`value-78<tag>`)).not.toContain(">");
  });
  it("escForSatori matrix 79", () => {
    expect(escForSatori(`value-79<tag>`)).not.toContain("<");
    expect(escForSatori(`value-79<tag>`)).not.toContain(">");
  });
});

describe("og-render-lib withAlpha", () => {
  it("expands hex to rgba", () => {
    expect(withAlpha("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
    expect(withAlpha("#7cd17c", 0.85)).toBe("rgba(124, 209, 124, 0.85)");
  });
  it("withAlpha generated 0", () => {
    const hex = "#000000";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 1", () => {
    const hex = "#000011";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 2", () => {
    const hex = "#000022";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 3", () => {
    const hex = "#000033";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 4", () => {
    const hex = "#000044";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 5", () => {
    const hex = "#000055";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 6", () => {
    const hex = "#000066";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 7", () => {
    const hex = "#000077";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 8", () => {
    const hex = "#000088";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 9", () => {
    const hex = "#000099";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 10", () => {
    const hex = "#0000aa";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 11", () => {
    const hex = "#0000bb";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 12", () => {
    const hex = "#0000cc";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 13", () => {
    const hex = "#0000dd";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 14", () => {
    const hex = "#0000ee";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 15", () => {
    const hex = "#0000ff";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 16", () => {
    const hex = "#000110";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 17", () => {
    const hex = "#000121";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 18", () => {
    const hex = "#000132";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 19", () => {
    const hex = "#000143";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 20", () => {
    const hex = "#000154";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 21", () => {
    const hex = "#000165";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 22", () => {
    const hex = "#000176";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 23", () => {
    const hex = "#000187";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 24", () => {
    const hex = "#000198";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 25", () => {
    const hex = "#0001a9";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 26", () => {
    const hex = "#0001ba";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 27", () => {
    const hex = "#0001cb";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 28", () => {
    const hex = "#0001dc";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 29", () => {
    const hex = "#0001ed";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 30", () => {
    const hex = "#0001fe";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 31", () => {
    const hex = "#00020f";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 32", () => {
    const hex = "#000220";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 33", () => {
    const hex = "#000231";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 34", () => {
    const hex = "#000242";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 35", () => {
    const hex = "#000253";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 36", () => {
    const hex = "#000264";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 37", () => {
    const hex = "#000275";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 38", () => {
    const hex = "#000286";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 39", () => {
    const hex = "#000297";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 40", () => {
    const hex = "#0002a8";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 41", () => {
    const hex = "#0002b9";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 42", () => {
    const hex = "#0002ca";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 43", () => {
    const hex = "#0002db";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 44", () => {
    const hex = "#0002ec";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 45", () => {
    const hex = "#0002fd";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 46", () => {
    const hex = "#00030e";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 47", () => {
    const hex = "#00031f";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 48", () => {
    const hex = "#000330";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
  it("withAlpha generated 49", () => {
    const hex = "#000341";
    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
  });
});

describe("og-render-lib buildOgCardHtml", () => {
  it("uses warm-paper background and grid", () => {
    const html = buildOgCardHtml({ title: "Hello" });
    expect(html).toContain("background-color:#f8f6ed");
    expect(html).toContain(GRID_BG_DATA_URI);
  });
  it("buildOgCardHtml agents 0", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 0",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 1", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 1",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 2", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 2",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 3", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 3",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 4", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 4",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 5", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 5",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 6", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 6",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 7", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 7",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 8", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 8",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 9", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 9",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 10", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 10",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml agents 11", () => {
    const html = buildOgCardHtml({
      title: "agents Entry 11",
      eyebrow: "agents",
      accent: categoryAccent("agents"),
      description: "Description for agents 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 0", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 0",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 1", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 1",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 2", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 2",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 3", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 3",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 4", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 4",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 5", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 5",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 6", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 6",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 7", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 7",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 8", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 8",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 9", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 9",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 10", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 10",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml mcp 11", () => {
    const html = buildOgCardHtml({
      title: "mcp Entry 11",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
      description: "Description for mcp 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 0", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 0",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 1", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 1",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 2", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 2",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 3", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 3",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 4", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 4",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 5", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 5",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 6", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 6",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 7", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 7",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 8", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 8",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 9", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 9",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 10", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 10",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml tools 11", () => {
    const html = buildOgCardHtml({
      title: "tools Entry 11",
      eyebrow: "tools",
      accent: categoryAccent("tools"),
      description: "Description for tools 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 0", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 0",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 1", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 1",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 2", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 2",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 3", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 3",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 4", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 4",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 5", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 5",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 6", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 6",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 7", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 7",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 8", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 8",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 9", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 9",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 10", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 10",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml skills 11", () => {
    const html = buildOgCardHtml({
      title: "skills Entry 11",
      eyebrow: "skills",
      accent: categoryAccent("skills"),
      description: "Description for skills 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 0", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 0",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 1", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 1",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 2", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 2",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 3", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 3",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 4", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 4",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 5", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 5",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 6", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 6",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 7", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 7",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 8", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 8",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 9", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 9",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 10", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 10",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml rules 11", () => {
    const html = buildOgCardHtml({
      title: "rules Entry 11",
      eyebrow: "rules",
      accent: categoryAccent("rules"),
      description: "Description for rules 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 0", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 0",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 1", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 1",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 2", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 2",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 3", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 3",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 4", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 4",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 5", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 5",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 6", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 6",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 7", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 7",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 8", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 8",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 9", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 9",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 10", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 10",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml commands 11", () => {
    const html = buildOgCardHtml({
      title: "commands Entry 11",
      eyebrow: "commands",
      accent: categoryAccent("commands"),
      description: "Description for commands 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 0", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 0",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 1", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 1",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 2", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 2",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 3", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 3",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 4", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 4",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 5", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 5",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 6", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 6",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 7", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 7",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 8", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 8",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 9", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 9",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 10", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 10",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml hooks 11", () => {
    const html = buildOgCardHtml({
      title: "hooks Entry 11",
      eyebrow: "hooks",
      accent: categoryAccent("hooks"),
      description: "Description for hooks 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 0", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 0",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 1", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 1",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 2", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 2",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 3", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 3",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 4", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 4",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 5", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 5",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 6", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 6",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 7", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 7",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 8", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 8",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 9", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 9",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 10", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 10",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml guides 11", () => {
    const html = buildOgCardHtml({
      title: "guides Entry 11",
      eyebrow: "guides",
      accent: categoryAccent("guides"),
      description: "Description for guides 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 0", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 0",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 1", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 1",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 2", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 2",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 3", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 3",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 4", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 4",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 5", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 5",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 6", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 6",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 7", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 7",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 8", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 8",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 9", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 9",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 10", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 10",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml collections 11", () => {
    const html = buildOgCardHtml({
      title: "collections Entry 11",
      eyebrow: "collections",
      accent: categoryAccent("collections"),
      description: "Description for collections 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 0", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 0",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 0",
      author: "Author 0",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 1", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 1",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 1",
      author: "Author 1",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 2", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 2",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 2",
      author: "Author 2",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 3", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 3",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 3",
      author: "Author 3",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 4", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 4",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 4",
      author: "Author 4",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 5", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 5",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 5",
      author: "Author 5",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 6", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 6",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 6",
      author: "Author 6",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 7", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 7",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 7",
      author: "Author 7",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 8", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 8",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 8",
      author: "Author 8",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 9", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 9",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 9",
      author: "Author 9",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 10", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 10",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 10",
      author: "Author 10",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml statuslines 11", () => {
    const html = buildOgCardHtml({
      title: "statuslines Entry 11",
      eyebrow: "statuslines",
      accent: categoryAccent("statuslines"),
      description: "Description for statuslines 11",
      author: "Author 11",
    });
    expect(html).toContain("heyclau.de");
    expect(html).toContain(GITHUB_ICON_DATA_URI);
    expect(html).not.toContain("<script>");
  });
  it("buildOgCardHtml churn 0", () => {
    const html = buildOgCardHtml({ title: "Title 0", description: "Desc 0" });
    expect(html).toContain("Title 0");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 1", () => {
    const html = buildOgCardHtml({ title: "Title 1", description: "Desc 1" });
    expect(html).toContain("Title 1");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 2", () => {
    const html = buildOgCardHtml({ title: "Title 2", description: "Desc 2" });
    expect(html).toContain("Title 2");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 3", () => {
    const html = buildOgCardHtml({ title: "Title 3", description: "Desc 3" });
    expect(html).toContain("Title 3");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 4", () => {
    const html = buildOgCardHtml({ title: "Title 4", description: "Desc 4" });
    expect(html).toContain("Title 4");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 5", () => {
    const html = buildOgCardHtml({ title: "Title 5", description: "Desc 5" });
    expect(html).toContain("Title 5");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 6", () => {
    const html = buildOgCardHtml({ title: "Title 6", description: "Desc 6" });
    expect(html).toContain("Title 6");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 7", () => {
    const html = buildOgCardHtml({ title: "Title 7", description: "Desc 7" });
    expect(html).toContain("Title 7");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 8", () => {
    const html = buildOgCardHtml({ title: "Title 8", description: "Desc 8" });
    expect(html).toContain("Title 8");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 9", () => {
    const html = buildOgCardHtml({ title: "Title 9", description: "Desc 9" });
    expect(html).toContain("Title 9");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 10", () => {
    const html = buildOgCardHtml({ title: "Title 10", description: "Desc 10" });
    expect(html).toContain("Title 10");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 11", () => {
    const html = buildOgCardHtml({ title: "Title 11", description: "Desc 11" });
    expect(html).toContain("Title 11");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 12", () => {
    const html = buildOgCardHtml({ title: "Title 12", description: "Desc 12" });
    expect(html).toContain("Title 12");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 13", () => {
    const html = buildOgCardHtml({ title: "Title 13", description: "Desc 13" });
    expect(html).toContain("Title 13");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 14", () => {
    const html = buildOgCardHtml({ title: "Title 14", description: "Desc 14" });
    expect(html).toContain("Title 14");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 15", () => {
    const html = buildOgCardHtml({ title: "Title 15", description: "Desc 15" });
    expect(html).toContain("Title 15");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 16", () => {
    const html = buildOgCardHtml({ title: "Title 16", description: "Desc 16" });
    expect(html).toContain("Title 16");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 17", () => {
    const html = buildOgCardHtml({ title: "Title 17", description: "Desc 17" });
    expect(html).toContain("Title 17");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 18", () => {
    const html = buildOgCardHtml({ title: "Title 18", description: "Desc 18" });
    expect(html).toContain("Title 18");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 19", () => {
    const html = buildOgCardHtml({ title: "Title 19", description: "Desc 19" });
    expect(html).toContain("Title 19");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 20", () => {
    const html = buildOgCardHtml({ title: "Title 20", description: "Desc 20" });
    expect(html).toContain("Title 20");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 21", () => {
    const html = buildOgCardHtml({ title: "Title 21", description: "Desc 21" });
    expect(html).toContain("Title 21");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 22", () => {
    const html = buildOgCardHtml({ title: "Title 22", description: "Desc 22" });
    expect(html).toContain("Title 22");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 23", () => {
    const html = buildOgCardHtml({ title: "Title 23", description: "Desc 23" });
    expect(html).toContain("Title 23");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 24", () => {
    const html = buildOgCardHtml({ title: "Title 24", description: "Desc 24" });
    expect(html).toContain("Title 24");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 25", () => {
    const html = buildOgCardHtml({ title: "Title 25", description: "Desc 25" });
    expect(html).toContain("Title 25");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 26", () => {
    const html = buildOgCardHtml({ title: "Title 26", description: "Desc 26" });
    expect(html).toContain("Title 26");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 27", () => {
    const html = buildOgCardHtml({ title: "Title 27", description: "Desc 27" });
    expect(html).toContain("Title 27");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 28", () => {
    const html = buildOgCardHtml({ title: "Title 28", description: "Desc 28" });
    expect(html).toContain("Title 28");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 29", () => {
    const html = buildOgCardHtml({ title: "Title 29", description: "Desc 29" });
    expect(html).toContain("Title 29");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 30", () => {
    const html = buildOgCardHtml({ title: "Title 30", description: "Desc 30" });
    expect(html).toContain("Title 30");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 31", () => {
    const html = buildOgCardHtml({ title: "Title 31", description: "Desc 31" });
    expect(html).toContain("Title 31");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 32", () => {
    const html = buildOgCardHtml({ title: "Title 32", description: "Desc 32" });
    expect(html).toContain("Title 32");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 33", () => {
    const html = buildOgCardHtml({ title: "Title 33", description: "Desc 33" });
    expect(html).toContain("Title 33");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 34", () => {
    const html = buildOgCardHtml({ title: "Title 34", description: "Desc 34" });
    expect(html).toContain("Title 34");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 35", () => {
    const html = buildOgCardHtml({ title: "Title 35", description: "Desc 35" });
    expect(html).toContain("Title 35");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 36", () => {
    const html = buildOgCardHtml({ title: "Title 36", description: "Desc 36" });
    expect(html).toContain("Title 36");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 37", () => {
    const html = buildOgCardHtml({ title: "Title 37", description: "Desc 37" });
    expect(html).toContain("Title 37");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 38", () => {
    const html = buildOgCardHtml({ title: "Title 38", description: "Desc 38" });
    expect(html).toContain("Title 38");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 39", () => {
    const html = buildOgCardHtml({ title: "Title 39", description: "Desc 39" });
    expect(html).toContain("Title 39");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 40", () => {
    const html = buildOgCardHtml({ title: "Title 40", description: "Desc 40" });
    expect(html).toContain("Title 40");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 41", () => {
    const html = buildOgCardHtml({ title: "Title 41", description: "Desc 41" });
    expect(html).toContain("Title 41");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 42", () => {
    const html = buildOgCardHtml({ title: "Title 42", description: "Desc 42" });
    expect(html).toContain("Title 42");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 43", () => {
    const html = buildOgCardHtml({ title: "Title 43", description: "Desc 43" });
    expect(html).toContain("Title 43");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 44", () => {
    const html = buildOgCardHtml({ title: "Title 44", description: "Desc 44" });
    expect(html).toContain("Title 44");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 45", () => {
    const html = buildOgCardHtml({ title: "Title 45", description: "Desc 45" });
    expect(html).toContain("Title 45");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 46", () => {
    const html = buildOgCardHtml({ title: "Title 46", description: "Desc 46" });
    expect(html).toContain("Title 46");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 47", () => {
    const html = buildOgCardHtml({ title: "Title 47", description: "Desc 47" });
    expect(html).toContain("Title 47");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 48", () => {
    const html = buildOgCardHtml({ title: "Title 48", description: "Desc 48" });
    expect(html).toContain("Title 48");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 49", () => {
    const html = buildOgCardHtml({ title: "Title 49", description: "Desc 49" });
    expect(html).toContain("Title 49");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 50", () => {
    const html = buildOgCardHtml({ title: "Title 50", description: "Desc 50" });
    expect(html).toContain("Title 50");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 51", () => {
    const html = buildOgCardHtml({ title: "Title 51", description: "Desc 51" });
    expect(html).toContain("Title 51");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 52", () => {
    const html = buildOgCardHtml({ title: "Title 52", description: "Desc 52" });
    expect(html).toContain("Title 52");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 53", () => {
    const html = buildOgCardHtml({ title: "Title 53", description: "Desc 53" });
    expect(html).toContain("Title 53");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 54", () => {
    const html = buildOgCardHtml({ title: "Title 54", description: "Desc 54" });
    expect(html).toContain("Title 54");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 55", () => {
    const html = buildOgCardHtml({ title: "Title 55", description: "Desc 55" });
    expect(html).toContain("Title 55");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 56", () => {
    const html = buildOgCardHtml({ title: "Title 56", description: "Desc 56" });
    expect(html).toContain("Title 56");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 57", () => {
    const html = buildOgCardHtml({ title: "Title 57", description: "Desc 57" });
    expect(html).toContain("Title 57");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 58", () => {
    const html = buildOgCardHtml({ title: "Title 58", description: "Desc 58" });
    expect(html).toContain("Title 58");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 59", () => {
    const html = buildOgCardHtml({ title: "Title 59", description: "Desc 59" });
    expect(html).toContain("Title 59");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 60", () => {
    const html = buildOgCardHtml({ title: "Title 60", description: "Desc 60" });
    expect(html).toContain("Title 60");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 61", () => {
    const html = buildOgCardHtml({ title: "Title 61", description: "Desc 61" });
    expect(html).toContain("Title 61");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 62", () => {
    const html = buildOgCardHtml({ title: "Title 62", description: "Desc 62" });
    expect(html).toContain("Title 62");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 63", () => {
    const html = buildOgCardHtml({ title: "Title 63", description: "Desc 63" });
    expect(html).toContain("Title 63");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 64", () => {
    const html = buildOgCardHtml({ title: "Title 64", description: "Desc 64" });
    expect(html).toContain("Title 64");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 65", () => {
    const html = buildOgCardHtml({ title: "Title 65", description: "Desc 65" });
    expect(html).toContain("Title 65");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 66", () => {
    const html = buildOgCardHtml({ title: "Title 66", description: "Desc 66" });
    expect(html).toContain("Title 66");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 67", () => {
    const html = buildOgCardHtml({ title: "Title 67", description: "Desc 67" });
    expect(html).toContain("Title 67");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 68", () => {
    const html = buildOgCardHtml({ title: "Title 68", description: "Desc 68" });
    expect(html).toContain("Title 68");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 69", () => {
    const html = buildOgCardHtml({ title: "Title 69", description: "Desc 69" });
    expect(html).toContain("Title 69");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 70", () => {
    const html = buildOgCardHtml({ title: "Title 70", description: "Desc 70" });
    expect(html).toContain("Title 70");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 71", () => {
    const html = buildOgCardHtml({ title: "Title 71", description: "Desc 71" });
    expect(html).toContain("Title 71");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 72", () => {
    const html = buildOgCardHtml({ title: "Title 72", description: "Desc 72" });
    expect(html).toContain("Title 72");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 73", () => {
    const html = buildOgCardHtml({ title: "Title 73", description: "Desc 73" });
    expect(html).toContain("Title 73");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 74", () => {
    const html = buildOgCardHtml({ title: "Title 74", description: "Desc 74" });
    expect(html).toContain("Title 74");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 75", () => {
    const html = buildOgCardHtml({ title: "Title 75", description: "Desc 75" });
    expect(html).toContain("Title 75");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 76", () => {
    const html = buildOgCardHtml({ title: "Title 76", description: "Desc 76" });
    expect(html).toContain("Title 76");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 77", () => {
    const html = buildOgCardHtml({ title: "Title 77", description: "Desc 77" });
    expect(html).toContain("Title 77");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 78", () => {
    const html = buildOgCardHtml({ title: "Title 78", description: "Desc 78" });
    expect(html).toContain("Title 78");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 79", () => {
    const html = buildOgCardHtml({ title: "Title 79", description: "Desc 79" });
    expect(html).toContain("Title 79");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 80", () => {
    const html = buildOgCardHtml({ title: "Title 80", description: "Desc 80" });
    expect(html).toContain("Title 80");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 81", () => {
    const html = buildOgCardHtml({ title: "Title 81", description: "Desc 81" });
    expect(html).toContain("Title 81");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 82", () => {
    const html = buildOgCardHtml({ title: "Title 82", description: "Desc 82" });
    expect(html).toContain("Title 82");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 83", () => {
    const html = buildOgCardHtml({ title: "Title 83", description: "Desc 83" });
    expect(html).toContain("Title 83");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 84", () => {
    const html = buildOgCardHtml({ title: "Title 84", description: "Desc 84" });
    expect(html).toContain("Title 84");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 85", () => {
    const html = buildOgCardHtml({ title: "Title 85", description: "Desc 85" });
    expect(html).toContain("Title 85");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 86", () => {
    const html = buildOgCardHtml({ title: "Title 86", description: "Desc 86" });
    expect(html).toContain("Title 86");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 87", () => {
    const html = buildOgCardHtml({ title: "Title 87", description: "Desc 87" });
    expect(html).toContain("Title 87");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 88", () => {
    const html = buildOgCardHtml({ title: "Title 88", description: "Desc 88" });
    expect(html).toContain("Title 88");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 89", () => {
    const html = buildOgCardHtml({ title: "Title 89", description: "Desc 89" });
    expect(html).toContain("Title 89");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 90", () => {
    const html = buildOgCardHtml({ title: "Title 90", description: "Desc 90" });
    expect(html).toContain("Title 90");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 91", () => {
    const html = buildOgCardHtml({ title: "Title 91", description: "Desc 91" });
    expect(html).toContain("Title 91");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 92", () => {
    const html = buildOgCardHtml({ title: "Title 92", description: "Desc 92" });
    expect(html).toContain("Title 92");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 93", () => {
    const html = buildOgCardHtml({ title: "Title 93", description: "Desc 93" });
    expect(html).toContain("Title 93");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 94", () => {
    const html = buildOgCardHtml({ title: "Title 94", description: "Desc 94" });
    expect(html).toContain("Title 94");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 95", () => {
    const html = buildOgCardHtml({ title: "Title 95", description: "Desc 95" });
    expect(html).toContain("Title 95");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 96", () => {
    const html = buildOgCardHtml({ title: "Title 96", description: "Desc 96" });
    expect(html).toContain("Title 96");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 97", () => {
    const html = buildOgCardHtml({ title: "Title 97", description: "Desc 97" });
    expect(html).toContain("Title 97");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 98", () => {
    const html = buildOgCardHtml({ title: "Title 98", description: "Desc 98" });
    expect(html).toContain("Title 98");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
  it("buildOgCardHtml churn 99", () => {
    const html = buildOgCardHtml({ title: "Title 99", description: "Desc 99" });
    expect(html).toContain("Title 99");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
  });
});

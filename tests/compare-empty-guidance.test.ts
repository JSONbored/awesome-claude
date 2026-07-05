import { describe, expect, it } from "vitest";
import {
  compareDrawerEmptyHint,
  compareEmptyStateDescription,
  compareInvalidUrlHint,
  compareSingleItemHintText,
} from "@/lib/compare-empty-guidance";

describe("compare empty guidance", () => {
  it("describes the interactive compare selection range", () => {
    expect(compareEmptyStateDescription()).toBe(
      "Add 2–4 resources from the directory to see them side by side.",
    );
  });

  it("prompts readers to add another resource when only one is selected", () => {
    expect(compareSingleItemHintText(0)).toBeNull();
    expect(compareSingleItemHintText(1)).toBe(
      "Add one more resource to unlock trust and next-step comparisons across the full table.",
    );
    expect(compareSingleItemHintText(2)).toBeNull();
  });

  it("warns when compare URL params do not resolve to entries", () => {
    expect(compareInvalidUrlHint("", 0)).toBeNull();
    expect(compareInvalidUrlHint("   ", 0)).toBeNull();
    expect(compareInvalidUrlHint("mcp/missing", 0)).toBe(
      "The compare link could not be resolved — choose resources from the directory instead.",
    );
    expect(compareInvalidUrlHint("mcp/fixture", 1)).toBeNull();
  });

  it("guides drawer readers to add resources from cards", () => {
    expect(compareDrawerEmptyHint()).toBe(
      "Add resources to compare by tapping the Compare button on any card.",
    );
  });
});

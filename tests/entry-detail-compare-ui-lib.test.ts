import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_COMPARE_MAX,
  entryDetailCompareCtaState,
  entryDetailCompareDisabledReason,
  entryDetailCompareDrawerEnabled,
  entryDetailCompareToggleLabel,
} from "@/lib/entry-detail-compare-ui-lib";

describe("entry detail compare ui lib", () => {
  it("labels compare toggle actions", () => {
    expect(entryDetailCompareToggleLabel(false)).toBe("Add to compare");
    expect(entryDetailCompareToggleLabel(true)).toBe("Remove from compare");
  });

  it("blocks add-to-compare when the tray is full", () => {
    expect(
      entryDetailCompareDisabledReason(false, ENTRY_DETAIL_COMPARE_MAX),
    ).toBe(
      `Compare is full (${ENTRY_DETAIL_COMPARE_MAX}/${ENTRY_DETAIL_COMPARE_MAX}). Remove an entry to add this one.`,
    );
    expect(
      entryDetailCompareDisabledReason(true, ENTRY_DETAIL_COMPARE_MAX),
    ).toBeNull();
    expect(entryDetailCompareDisabledReason(false, 2)).toBeNull();
  });

  it("enables open-compare affordances once two entries are selected", () => {
    expect(entryDetailCompareDrawerEnabled(1)).toBe(false);
    expect(entryDetailCompareDrawerEnabled(2)).toBe(true);
  });

  it("builds command center compare CTA state", () => {
    expect(entryDetailCompareCtaState(false, 1)).toEqual({
      label: "Add to compare",
      disabled: false,
      hint: null,
      showOpenCompare: false,
    });
    expect(entryDetailCompareCtaState(true, 3)).toEqual({
      label: "Remove from compare",
      disabled: false,
      hint: null,
      showOpenCompare: true,
    });
    expect(entryDetailCompareCtaState(false, 4)).toMatchObject({
      label: "Add to compare",
      disabled: true,
      showOpenCompare: true,
    });
  });
});

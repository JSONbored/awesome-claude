import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_COMPARE_MAX,
  entryDetailCompareCtaState,
  entryDetailCompareDisabledReason,
  entryDetailCompareDrawerEnabled,
  entryDetailCompareToggleLabel,
  entryDetailMobileCompareAction,
  entryDetailMobileCompareLabel,
} from "@/lib/entry-detail-compare-ui-lib";

describe("entry detail compare ui lib", () => {
  it("labels compare toggle actions", () => {
    expect(entryDetailCompareToggleLabel(false)).toBe("Add to compare");
    expect(entryDetailCompareToggleLabel(true)).toBe("Remove from compare");
    expect(entryDetailMobileCompareLabel(false)).toBe("Compare");
    expect(entryDetailMobileCompareLabel(true)).toBe("In compare");
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

  it("builds compact mobile compare action metadata", () => {
    expect(entryDetailMobileCompareAction(false, 1)).toEqual({
      id: "compare",
      label: "Compare",
      disabled: false,
      hint: null,
      inCompare: false,
      compareCount: 1,
      maxCount: ENTRY_DETAIL_COMPARE_MAX,
    });
    expect(entryDetailMobileCompareAction(true, 3)).toMatchObject({
      label: "In compare",
      inCompare: true,
      compareCount: 3,
    });
    expect(
      entryDetailMobileCompareAction(false, ENTRY_DETAIL_COMPARE_MAX),
    ).toMatchObject({
      disabled: true,
      hint: expect.stringContaining("Compare is full"),
    });
  });
});

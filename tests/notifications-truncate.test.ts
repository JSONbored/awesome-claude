import { describe, expect, it } from "vitest";

import { truncate } from "../apps/submission-gate/src/notifications";

// Discord embed caps the submission gate stays within (matching the
// DISCORD_MAX_* constants in notifications.ts): field value 220, title 256,
// description 260.
const CAPS = [220, 256, 260];

describe("notifications truncate", () => {
  it("keeps results within the requested cap and appends an ellipsis", () => {
    for (const cap of CAPS) {
      const result = truncate("x".repeat(cap + 50), cap);
      expect(result.length, `cap ${cap}`).toBeLessThanOrEqual(cap);
      expect(result.endsWith("..."), `cap ${cap}`).toBe(true);
    }
  });

  it("returns inputs at or below the cap unchanged", () => {
    expect(truncate("#700 closed · useful guide", 256)).toBe(
      "#700 closed · useful guide",
    );
    expect(truncate("", 220)).toBe("");
  });

  it("does not split a surrogate pair at the truncation boundary", () => {
    for (const cap of CAPS) {
      // Position a non-BMP emoji so its surrogate pair straddles the cut point;
      // a UTF-16 slice would leave a lone surrogate here.
      const input = `${"a".repeat(cap - 2)}😀tail`;
      const result = truncate(input, cap);
      expect(result.length, `cap ${cap}`).toBeLessThanOrEqual(cap);
      expect(result, `cap ${cap}`).not.toContain("�");
      // A lone surrogate makes encodeURIComponent throw a URIError.
      expect(() => encodeURIComponent(result), `cap ${cap}`).not.toThrow();
    }
  });

  it("measures the cap by code point, not UTF-16 unit", () => {
    // 10 emoji = 20 UTF-16 units but 10 code points, so a cap of 12 keeps them
    // intact instead of slicing through a surrogate pair.
    const tenEmoji = "😀".repeat(10);
    expect(truncate(tenEmoji, 12)).toBe(tenEmoji);
  });
});

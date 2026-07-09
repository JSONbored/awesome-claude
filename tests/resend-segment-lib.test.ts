import { describe, expect, it } from "vitest";

import { resendSegmentEnvKey } from "../apps/web/src/lib/resend-segment-lib";

describe("resendSegmentEnvKey", () => {
  it("uppercases and prefixes a simple follow id", () => {
    expect(resendSegmentEnvKey("weekly")).toBe("RESEND_SEGMENT_WEEKLY");
  });

  it("replaces every non-alphanumeric character with an underscore", () => {
    expect(resendSegmentEnvKey("weekly-brief")).toBe(
      "RESEND_SEGMENT_WEEKLY_BRIEF",
    );
    expect(resendSegmentEnvKey("a.b:c")).toBe("RESEND_SEGMENT_A_B_C");
  });

  it("keeps digits and existing underscores", () => {
    expect(resendSegmentEnvKey("list_2")).toBe("RESEND_SEGMENT_LIST_2");
  });
});

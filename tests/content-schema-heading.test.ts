import { describe, expect, it } from "vitest";

import { headingId } from "@heyclaude/registry/content-schema";

describe("headingId", () => {
  it("collapses adjacent separators into a single dash", () => {
    expect(headingId("Setup - Installation")).toBe("setup-installation");
    expect(headingId("A -- B")).toBe("a-b");
    expect(headingId("Pros & Cons")).toBe("pros-cons");
  });

  it("keeps anchor IDs for headings without adjacent hyphens unchanged", () => {
    expect(headingId("normal heading")).toBe("normal-heading");
    expect(headingId("GPT-4 tips")).toBe("gpt-4-tips");
    expect(headingId("co-op mode")).toBe("co-op-mode");
    expect(headingId("hello-world")).toBe("hello-world");
  });

  it("does not emit a leading or trailing dash", () => {
    expect(headingId("  - trimmed - ")).toBe("trimmed");
  });
});

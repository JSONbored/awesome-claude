import { describe, expect, it } from "vitest";

import {
  withRaycastUtm,
  markdownLink,
} from "../integrations/raycast/src/links.js";

describe("withRaycastUtm", () => {
  it("adds raycast utm params to HeyClaude URLs", () => {
    const out = new URL(withRaycastUtm("https://heyclau.de/x"));
    expect(out.searchParams.get("utm_source")).toBe("raycast");
    expect(out.searchParams.get("utm_medium")).toBe("extension");
  });

  it("preserves existing query params and adds optional utm_content", () => {
    const out = new URL(withRaycastUtm("https://heyclau.de/x?a=1", "job-card"));
    expect(out.searchParams.get("a")).toBe("1");
    expect(out.searchParams.get("utm_content")).toBe("job-card");
  });

  it("leaves non-HeyClaude hosts untouched", () => {
    // The utm tagging only applies to first-party links.
    expect(withRaycastUtm("https://example.com/x")).toBe(
      "https://example.com/x",
    );
  });

  it("returns the input unchanged for empty or non-URL values", () => {
    expect(withRaycastUtm("")).toBe("");
    expect(withRaycastUtm("not a url")).toBe("not a url");
  });
});

describe("markdownLink", () => {
  it("formats a markdown link", () => {
    expect(markdownLink("Title", "https://x.com")).toBe(
      "[Title](https://x.com)",
    );
  });
});

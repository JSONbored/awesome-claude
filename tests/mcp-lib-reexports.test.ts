import { describe, expect, it } from "vitest";

import { parseToolArguments } from "../packages/mcp/src/schemas.js";
import { normalizeEndpointUrl } from "../packages/mcp/src/endpoint-url.js";
import { platformFeedSlug } from "../packages/mcp/src/platforms.js";

describe("mcp package re-exports", () => {
  it("re-exports parseToolArguments from schemas-lib", () => {
    const parsed = parseToolArguments("registry.stats", {});
    expect(parsed).toEqual({});
  });

  it("re-exports normalizeEndpointUrl from endpoint-url-lib", () => {
    expect(normalizeEndpointUrl("https://heyclau.de").pathname).toBe(
      "/api/mcp",
    );
  });

  it("re-exports platformFeedSlug from platforms-lib", () => {
    expect(platformFeedSlug("Claude & Cursor")).toBe("claude-and-cursor");
  });
});

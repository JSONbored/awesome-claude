import { describe, expect, it } from "vitest";

import { isHeyClaudePreviewHost } from "../scripts/lib/preview-url-host.mjs";

describe("isHeyClaudePreviewHost", () => {
  it("accepts the production apex and www hosts (case-insensitive)", () => {
    expect(isHeyClaudePreviewHost("heyclau.de")).toBe(true);
    expect(isHeyClaudePreviewHost("www.heyclau.de")).toBe(true);
    expect(isHeyClaudePreviewHost("WWW.HEYCLAU.DE")).toBe(true);
  });

  it("accepts the prod worker and its Workers Builds preview aliases", () => {
    expect(isHeyClaudePreviewHost("heyclaude-prod.example.workers.dev")).toBe(
      true,
    );
    expect(
      isHeyClaudePreviewHost("a1b2c3-heyclaude-prod.example.workers.dev"),
    ).toBe(true);
  });

  it("rejects sibling workers that merely contain the prod label", () => {
    expect(
      isHeyClaudePreviewHost("heyclaude-prod-next.example.workers.dev"),
    ).toBe(false);
    expect(isHeyClaudePreviewHost("heyclaude-prodx.example.workers.dev")).toBe(
      false,
    );
  });

  it("rejects the retired dev worker and dev apex", () => {
    expect(isHeyClaudePreviewHost("heyclaude-dev.example.workers.dev")).toBe(
      false,
    );
    expect(isHeyClaudePreviewHost("dev.heyclau.de")).toBe(false);
  });

  it("rejects non-workers.dev sibling hosts and other domains", () => {
    expect(isHeyClaudePreviewHost("gittensory.aethereal.dev")).toBe(false);
    expect(isHeyClaudePreviewHost("example.com")).toBe(false);
  });

  it("treats the prod label only when it is the first dot-label", () => {
    // "heyclaude-prod" appears but not as the worker (first) label
    expect(isHeyClaudePreviewHost("preview.heyclaude-prod.workers.dev")).toBe(
      false,
    );
  });

  it("rejects empty, nullish, and non-string input", () => {
    expect(isHeyClaudePreviewHost("")).toBe(false);
    expect(isHeyClaudePreviewHost(null)).toBe(false);
    expect(isHeyClaudePreviewHost(undefined)).toBe(false);
  });
});

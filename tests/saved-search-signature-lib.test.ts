import { describe, expect, it } from "vitest";

import type { SavedSearchAlertSearch } from "../apps/web/src/lib/saved-search-alerts";
import { savedSearchSignature } from "../apps/web/src/lib/saved-search-signature-lib";

const search = (over: Record<string, unknown> = {}): SavedSearchAlertSearch =>
  ({ id: "s1", label: "Mine", q: "mcp", ...over }) as SavedSearchAlertSearch;

describe("savedSearchSignature", () => {
  it("is empty for no searches", () => {
    expect(savedSearchSignature([])).toBe("");
  });

  it("joins fields with tabs and searches with newlines", () => {
    const sig = savedSearchSignature([
      search({ id: "a" }),
      search({ id: "b" }),
    ]);
    const lines = sig.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0].split("\t")[0]).toBe("a");
    expect(lines[1].split("\t")[0]).toBe("b");
  });

  it("changes when the alert configuration changes", () => {
    const off = savedSearchSignature([search({ alerts: { enabled: false } })]);
    const on = savedSearchSignature([search({ alerts: { enabled: true } })]);
    expect(on).not.toBe(off);
  });

  it("changes when alert channels change, and tolerates missing alerts", () => {
    const none = savedSearchSignature([search()]);
    const chans = savedSearchSignature([
      search({ alerts: { enabled: true, channels: ["email"] } }),
    ]);
    const more = savedSearchSignature([
      search({ alerts: { enabled: true, channels: ["email", "web"] } }),
    ]);
    expect(none).not.toBe(chans);
    expect(chans).not.toBe(more);
  });

  it("is stable for identical input", () => {
    expect(savedSearchSignature([search()])).toBe(
      savedSearchSignature([search()]),
    );
  });
});

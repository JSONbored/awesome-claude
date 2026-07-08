import { describe, expect, it } from "vitest";

import {
  entryDetailUrl,
  eventTargetId,
  type RegistryEvent,
} from "../apps/web/src/lib/watch-events-lib";

const entryEvent = (over: Partial<RegistryEvent> = {}): RegistryEvent => ({
  kind: "entry",
  category: "agents",
  slug: "my-agent",
  ...over,
});

describe("eventTargetId", () => {
  it("builds a stable id for a complete entry event", () => {
    expect(eventTargetId(entryEvent())).toBe("entry:agents/my-agent");
  });

  it("returns null for non-entry kinds or missing category/slug", () => {
    expect(eventTargetId(entryEvent({ kind: "changelog-stream" }))).toBeNull();
    expect(eventTargetId(entryEvent({ category: undefined }))).toBeNull();
    expect(eventTargetId(entryEvent({ slug: undefined }))).toBeNull();
  });
});

describe("entryDetailUrl", () => {
  it("builds an encoded detail JSON url for an entry event", () => {
    expect(entryDetailUrl(entryEvent({ slug: "a b" }))).toBe(
      "/data/entries/agents/a%20b.json",
    );
  });

  it("returns null for non-entry kinds or missing category/slug", () => {
    expect(entryDetailUrl(entryEvent({ kind: "integration" }))).toBeNull();
    expect(entryDetailUrl(entryEvent({ category: undefined }))).toBeNull();
    expect(entryDetailUrl(entryEvent({ slug: undefined }))).toBeNull();
  });
});

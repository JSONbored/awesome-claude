import type { ContentEntry } from "@heyclaude/registry";
import { describe, expect, it } from "vitest";
import { normalizeEntryDetailPayload } from "../apps/web/src/lib/content.server";
import {
  buildEntry,
  type RegistryEntry,
} from "../apps/web/src/data/entry-normalize";

const trustSignals = {
  firstPartyEditorial: false,
  packageVerified: false,
  packageTrust: null,
  packageChecksum: "",
  checksumPresent: false,
  sourceUrlCount: 1,
  sourceUrls: ["https://github.com/example/source-backed-entry"],
  sourceStatus: "available",
  lastVerifiedAt: "2026-06-01T00:00:00.000Z",
  adapterGenerated: false,
  platforms: ["claude-code"],
  supportLevels: [],
};

describe("entry detail loading", () => {
  it("preserves trust signals from the detail artifact envelope", () => {
    const entry = normalizeEntryDetailPayload({
      schemaVersion: 2,
      entry: {
        category: "agents",
        slug: "source-backed-entry",
        title: "Source Backed Entry",
        description: "Fixture entry with top-level trust signals.",
        author: "Fixture",
        dateAdded: "2026-06-01",
        tags: [],
        body: "",
        sections: [],
        headings: [],
        codeBlocks: [],
      } as ContentEntry,
      trustSignals,
    });

    expect(entry?.trustSignals).toEqual(trustSignals);
  });

  it("keeps detail trust signals available after web entry normalization", () => {
    const entry = buildEntry({
      category: "agents",
      slug: "source-backed-entry",
      title: "Source Backed Entry",
      description: "Fixture entry with source-only trust signals.",
      author: "Fixture",
      dateAdded: "2026-06-01",
      tags: [],
      trustSignals,
    } satisfies RegistryEntry);

    expect(entry.source).toBe("source-backed");
    expect(entry.trustSignals?.sourceStatus).toBe("available");
    expect(entry.trustSignals?.sourceUrlCount).toBe(1);
  });
});

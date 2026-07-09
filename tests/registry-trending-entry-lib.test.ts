import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import {
  entryCanonicalUrl,
  entrySourceStatus,
  isFirstPartyPackage,
} from "../apps/web/src/lib/registry-trending-entry-lib";

const entry = (over: Record<string, unknown> = {}): Entry =>
  ({
    category: "agents",
    slug: "my-agent",
    source: "unverified",
    ...over,
  }) as Entry;

describe("entryCanonicalUrl", () => {
  it("prefers a non-empty embedded canonicalUrl", () => {
    expect(entryCanonicalUrl(entry({ canonicalUrl: "https://x.dev/a" }))).toBe(
      "https://x.dev/a",
    );
  });

  it("derives the detail URL when embedded is missing or blank", () => {
    expect(entryCanonicalUrl(entry())).toBe(
      "https://heyclau.de/entry/agents/my-agent",
    );
    expect(entryCanonicalUrl(entry({ canonicalUrl: "   " }))).toBe(
      "https://heyclau.de/entry/agents/my-agent",
    );
  });
});

describe("entrySourceStatus", () => {
  it("prefers a non-empty embedded sourceStatus", () => {
    expect(
      entrySourceStatus(entry({ trustSignals: { sourceStatus: "verified" } })),
    ).toBe("verified");
  });

  it("derives missing/available from the source field", () => {
    expect(entrySourceStatus(entry({ source: "unverified" }))).toBe("missing");
    expect(entrySourceStatus(entry({ source: "source-backed" }))).toBe(
      "available",
    );
  });
});

describe("isFirstPartyPackage", () => {
  it("is true for a first-party downloadTrust", () => {
    expect(isFirstPartyPackage(entry({ downloadTrust: "first-party" }))).toBe(
      true,
    );
  });

  it("is true for a verified package with a download URL", () => {
    expect(
      isFirstPartyPackage(
        entry({ downloadUrl: "https://x.dev/p.zip", packageVerified: true }),
      ),
    ).toBe(true);
  });

  it("is false otherwise", () => {
    expect(isFirstPartyPackage(entry())).toBe(false);
    expect(
      isFirstPartyPackage(entry({ downloadUrl: "https://x.dev/p.zip" })),
    ).toBe(false);
  });
});

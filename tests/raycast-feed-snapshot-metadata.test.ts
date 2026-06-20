import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  buildFeedSnapshotMetadata,
  parseFeedSnapshotMetadata,
} from "../integrations/raycast/src/feed.js";

describe("buildFeedSnapshotMetadata", () => {
  it("derives the signature from the feed's generatedAt when no manifest is given", () => {
    const meta = buildFeedSnapshotMetadata({ generatedAt: "2026-06-01" });
    expect(meta.generatedAt).toBe("2026-06-01");
    expect(meta.signature).toBe("2026-06-01");
    expect(meta.detailCacheNamespace).toBe("2026-06-01");
  });

  it("prefers the manifest snapshot and verifies a matching content checksum", () => {
    const meta = buildFeedSnapshotMetadata(
      { generatedAt: "feed-gen" },
      {
        generatedAt: "manifest-gen",
        signature: "sig123",
        feedSha256: "sha999",
      } as never,
      "sha999",
    );
    expect(meta.generatedAt).toBe("manifest-gen");
    expect(meta.signature).toBe("sig123");
    // The content checksum is only echoed back when it matches the manifest's.
    expect(meta.verifiedContentSha256).toBe("sha999");
  });

  it("omits verifiedContentSha256 when the checksum does not match", () => {
    const meta = buildFeedSnapshotMetadata(
      { generatedAt: "g" },
      { generatedAt: "g", signature: "s", feedSha256: "sha999" } as never,
      "different",
    );
    expect(meta.verifiedContentSha256).toBeUndefined();
  });
});

describe("parseFeedSnapshotMetadata", () => {
  it("round-trips metadata produced by buildFeedSnapshotMetadata", () => {
    const meta = buildFeedSnapshotMetadata({ generatedAt: "2026-06-01" });
    expect(parseFeedSnapshotMetadata(JSON.stringify(meta))).toEqual(meta);
  });

  it("returns null for empty, malformed, or signature-less input", () => {
    expect(parseFeedSnapshotMetadata("")).toBeNull();
    expect(parseFeedSnapshotMetadata("not json")).toBeNull();
    expect(parseFeedSnapshotMetadata(JSON.stringify({ foo: 1 }))).toBeNull();
  });
});

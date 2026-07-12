import { describe, expect, it } from "vitest";

import {
  DEPENDENCY_FILES,
  hasDependencyManifest,
  parseUnzipSummary,
} from "../scripts/lib/download-package-scan.mjs";

describe("parseUnzipSummary", () => {
  it("parses the footer of unzip -Z -l output", () => {
    const output = [
      "Archive:  pkg.zip",
      "Zip file size: 1234 bytes, number of entries: 3",
      "-rw-r--r--  3.0 unx      100 tx     40 defN 24-Jan-01 00:00 a.txt",
      "3 files, 5000 bytes uncompressed, 1200 bytes compressed:  76.0%",
    ].join("\n");
    expect(parseUnzipSummary(output)).toEqual({
      fileCount: 3,
      uncompressedBytes: 5000,
      compressedBytes: 1200,
    });
  });

  it("handles the singular 'file' wording", () => {
    expect(
      parseUnzipSummary("1 file, 10 bytes uncompressed, 8 bytes compressed"),
    ).toEqual({ fileCount: 1, uncompressedBytes: 10, compressedBytes: 8 });
  });

  it("returns zeroed counts when the footer does not match", () => {
    expect(parseUnzipSummary("totally unrelated line")).toEqual({
      fileCount: 0,
      uncompressedBytes: 0,
      compressedBytes: 0,
    });
    expect(parseUnzipSummary("")).toEqual({
      fileCount: 0,
      uncompressedBytes: 0,
      compressedBytes: 0,
    });
    expect(parseUnzipSummary(null)).toEqual({
      fileCount: 0,
      uncompressedBytes: 0,
      compressedBytes: 0,
    });
  });
});

describe("hasDependencyManifest", () => {
  it("matches a manifest by basename, ignoring directories", () => {
    expect(hasDependencyManifest(["src/index.js", "app/pnpm-lock.yaml"])).toBe(
      true,
    );
    expect(hasDependencyManifest(["nested/deep/requirements.txt"])).toBe(true);
  });

  it("is false when no entry is a known manifest", () => {
    expect(hasDependencyManifest(["readme.md", "src/main.rs"])).toBe(false);
    expect(hasDependencyManifest([])).toBe(false);
  });

  it("exposes the manifest set it checks against", () => {
    expect(DEPENDENCY_FILES.has("Cargo.lock")).toBe(true);
    expect(DEPENDENCY_FILES.has("not-a-lockfile")).toBe(false);
  });
});

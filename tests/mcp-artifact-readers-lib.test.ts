import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content.server", () => ({
  loadTextDataFile: vi.fn(),
  loadJsonDataFile: vi.fn(),
}));

import { loadJsonDataFile, loadTextDataFile } from "@/lib/content.server";
import { createMcpArtifactReaders } from "../apps/web/src/lib/mcp-artifact-readers-lib";

const loadTextDataFileMock = vi.mocked(loadTextDataFile);
const loadJsonDataFileMock = vi.mocked(loadJsonDataFile);

describe("mcp-artifact-readers-lib", () => {
  beforeEach(() => {
    loadTextDataFileMock.mockReset();
    loadJsonDataFileMock.mockReset();
  });

  it("rejects unsafe artifact paths before loading or falling back to assets", async () => {
    const assetsFetch = vi.fn();
    const readers = createMcpArtifactReaders("https://heyclau.de", {
      fetch: assetsFetch,
    });

    await expect(
      readers.readTextArtifact("../registry-manifest.json"),
    ).rejects.toThrow(/Unsafe data artifact path/);
    expect(loadTextDataFileMock).not.toHaveBeenCalled();
    expect(assetsFetch).not.toHaveBeenCalled();
  });

  it("falls back to assets using the sanitized path when local data loading fails", async () => {
    loadTextDataFileMock.mockRejectedValue(new Error("local file missing"));
    const assetsFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      expect(url).toBe("https://heyclau.de/data/search-index.json");
      return new Response("artifact-text", { status: 200 });
    });
    const readers = createMcpArtifactReaders("https://heyclau.de", {
      fetch: assetsFetch,
    });

    await expect(readers.readTextArtifact("search-index.json")).resolves.toBe(
      "artifact-text",
    );
    expect(loadTextDataFileMock).toHaveBeenCalledWith("search-index.json");
    expect(assetsFetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to assets for JSON artifacts using the sanitized path", async () => {
    loadJsonDataFileMock.mockRejectedValue(new Error("local file missing"));
    const assetsFetch = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const readers = createMcpArtifactReaders("https://heyclau.de", {
      fetch: assetsFetch,
    });

    await expect(
      readers.readJsonArtifact<{ ok: boolean }>("search-index.json"),
    ).resolves.toEqual({
      ok: true,
    });
    expect(loadJsonDataFileMock).toHaveBeenCalledWith("search-index.json");
    expect(assetsFetch).toHaveBeenCalledTimes(1);
  });
});

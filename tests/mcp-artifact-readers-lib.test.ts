import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it("falls back to the global fetch when no assets binding is provided", async () => {
    loadTextDataFileMock.mockRejectedValue(new Error("local file missing"));
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      expect(url).toBe("https://heyclau.de/data/search-index.json");
      return new Response("global-fetch-text", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const readers = createMcpArtifactReaders("https://heyclau.de");

    await expect(readers.readTextArtifact("search-index.json")).resolves.toBe(
      "global-fetch-text",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when the asset fallback response is not ok", async () => {
    loadTextDataFileMock.mockRejectedValue(new Error("local file missing"));
    const assetsFetch = vi.fn(
      async () => new Response("not found", { status: 404 }),
    );
    const readers = createMcpArtifactReaders("https://heyclau.de", {
      fetch: assetsFetch,
    });

    await expect(readers.readTextArtifact("search-index.json")).rejects.toThrow(
      /Failed to load search-index\.json asset \(404\)/,
    );
  });
});

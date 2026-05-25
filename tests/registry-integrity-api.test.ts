import { describe, expect, it, vi } from "vitest";

const manifestMock = vi.hoisted(() => ({
  value: {
    generatedAt: "2026-05-24T00:00:00.000Z",
    artifactContracts: {
      "directory-index.json": {
        path: "/data/directory-index.json",
        type: "json",
        sha256:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
      "feeds/index.json": {
        path: "/data/feeds%2Findex.json",
        type: "json",
        sha256:
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      },
    },
  },
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: {} }),
}));

vi.mock("@/lib/content", () => ({
  getRegistryManifest: () => Promise.resolve(manifestMock.value),
}));

function request(path: string) {
  return new Request(`https://heyclau.de${path}`, {
    headers: { origin: "https://heyclau.de" },
  });
}

describe("/api/registry/integrity", () => {
  it("lists current artifact contracts without artifact bodies", async () => {
    const { GET } =
      await import("../apps/web/src/app/api/registry/integrity/route");
    const response = await GET(request("/api/registry/integrity"));

    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      status: "snapshot",
      count: 2,
      current: null,
      artifacts: [
        expect.objectContaining({
          name: "directory-index.json",
          sha256:
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        }),
        expect.objectContaining({ name: "feeds/index.json" }),
      ],
    });
  });

  it("verifies matching, mismatched, and path-normalized artifact hashes", async () => {
    const { GET } =
      await import("../apps/web/src/app/api/registry/integrity/route");
    const match = await GET(
      request(
        "/api/registry/integrity?artifact=directory-index.json&hash=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ),
    );
    const mismatch = await GET(
      request(
        "/api/registry/integrity?artifact=directory-index.json&hash=cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      ),
    );
    const encodedPath = await GET(
      request(
        "/api/registry/integrity?artifact=%2fdata%2ffeeds%2findex.json&hash=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      ),
    );

    await expect(match.json()).resolves.toMatchObject({
      ok: true,
      status: "match",
      current: expect.objectContaining({ name: "directory-index.json" }),
    });
    await expect(mismatch.json()).resolves.toMatchObject({
      ok: false,
      status: "mismatch",
      current: expect.objectContaining({ name: "directory-index.json" }),
    });
    await expect(encodedPath.json()).resolves.toMatchObject({
      ok: true,
      status: "match",
      current: expect.objectContaining({ name: "feeds/index.json" }),
    });
  });

  it("returns clear unknown artifact and malformed hash responses", async () => {
    const { GET } =
      await import("../apps/web/src/app/api/registry/integrity/route");
    const unknown = await GET(
      request(
        "/api/registry/integrity?artifact=missing.json&hash=dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
      ),
    );
    const artifactOnly = await GET(
      request("/api/registry/integrity?artifact=directory-index.json"),
    );
    const hashOnly = await GET(
      request(
        "/api/registry/integrity?hash=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ),
    );
    const malformed = await GET(
      request(
        "/api/registry/integrity?artifact=directory-index.json&hash=nope",
      ),
    );
    const badArtifact = await GET(
      request("/api/registry/integrity?artifact=../registry-manifest.json"),
    );

    await expect(unknown.json()).resolves.toMatchObject({
      ok: false,
      status: "unknown",
      current: null,
    });
    expect(artifactOnly.status).toBe(400);
    await expect(artifactOnly.json()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_payload",
        details: [
          expect.objectContaining({
            path: "hash",
            message: "Provide both artifact and hash together for verification",
            code: "custom",
          }),
        ],
      },
    });
    expect(hashOnly.status).toBe(400);
    await expect(hashOnly.json()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_payload",
        details: [
          expect.objectContaining({
            path: "artifact",
            message: "Provide both artifact and hash together for verification",
            code: "custom",
          }),
        ],
      },
    });
    expect(malformed.status).toBe(400);
    await expect(malformed.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_payload" },
    });
    expect(badArtifact.status).toBe(400);
  });
});

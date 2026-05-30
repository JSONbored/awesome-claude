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

vi.mock("@/lib/content.server", () => ({
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
      await import("../apps/web/src/routes/api/registry/integrity");
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
      await import("../apps/web/src/routes/api/registry/integrity");
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
      await import("../apps/web/src/routes/api/registry/integrity");
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

  it("treats explicit empty artifact and hash as 'snapshot listing'", async () => {
    const { GET } =
      await import("../apps/web/src/routes/api/registry/integrity");
    const emptyArtifact = await GET(
      request("/api/registry/integrity?artifact="),
    );
    const bothEmpty = await GET(
      request("/api/registry/integrity?artifact=&hash="),
    );

    // Empty artifact alone is no longer rejected by the field-level regex,
    // and the pair-check (#516) treats both-falsy as "no verification
    // requested" rather than a partial pair, so it returns the snapshot.
    expect(emptyArtifact.status).toBe(200);
    await expect(emptyArtifact.json()).resolves.toMatchObject({
      ok: true,
      status: "snapshot",
      artifact: null,
      hash: null,
      current: null,
    });

    expect(bothEmpty.status).toBe(200);
    await expect(bothEmpty.json()).resolves.toMatchObject({
      ok: true,
      status: "snapshot",
      artifact: null,
      hash: null,
    });
  });

  it("still pair-rejects a non-empty artifact with an explicit empty hash", async () => {
    // Preserves #516's invariant: a real artifact path must come with a real
    // hash. Explicit-empty hash is treated as "no hash provided", same as
    // omitting the param entirely, so the pair-check still fires.
    const { GET } =
      await import("../apps/web/src/routes/api/registry/integrity");
    const partialPair = await GET(
      request("/api/registry/integrity?artifact=directory-index.json&hash="),
    );
    expect(partialPair.status).toBe(400);
    await expect(partialPair.json()).resolves.toMatchObject({
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
  });
});

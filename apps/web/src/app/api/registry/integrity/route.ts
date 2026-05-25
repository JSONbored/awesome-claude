import { apiError, createApiHandler } from "@/lib/api/router";
import { getRegistryManifest } from "@/lib/content";
import { cachedJsonResponse } from "@/lib/http-cache";

type Contract = { path: string; type: string; sha256: string };

const normalizeArtifact = (value: string) => value.replace(/%2f/gi, "/").replace(/^\/+/, "").replace(/^data\//, "");

export const GET = createApiHandler("registry.integrity", async ({ request, query }) => {
  const { artifact = "", hash = "" } = query as { artifact?: string; hash?: string };
  const manifest = await getRegistryManifest();
  const artifacts = Object.entries(manifest.artifactContracts ?? {}).map(([name, contract]) => ({ name, ...(contract as Contract) })).sort((left, right) => left.name.localeCompare(right.name));
  if ((artifact && !hash) || (!artifact && hash)) {
    return apiError("invalid_payload", 400, { message: "Provide both artifact and hash together for verification" });
  }

  const artifactKey = normalizeArtifact(artifact);
  const current = artifacts.find((item) => item.name === artifactKey || normalizeArtifact(item.path) === artifactKey) ?? null;
  const status = !artifact ? "snapshot" : !current ? "unknown" : current.sha256 === hash ? "match" : "mismatch";
  return cachedJsonResponse(request, { schemaVersion: 1, kind: "registry-integrity", generatedAt: manifest.generatedAt, artifact: artifact || null, hash: hash || null, ok: status === "snapshot" || status === "match", status, count: artifacts.length, current, artifacts });
});

import { apiError, createApiHandler } from "@/lib/api/router";
import { logApiWarn } from "@/lib/api-logs";
import { getRegistryManifest } from "@/lib/content";
import { cachedJsonResponse } from "@/lib/http-cache";

type Contract = { path: string; type: string; sha256: string };
type ArtifactContract = Contract & { name: string };
type IntegrityStatus = "snapshot" | "unknown" | "match" | "mismatch";

const normalizeArtifact = (value: string) =>
  value
    .replace(/%2f/gi, "/")
    .replace(/^\/+/, "")
    .replace(/^data\//, "");

function determineIntegrityStatus(
  artifact: string,
  current: ArtifactContract | null,
  hash: string,
): IntegrityStatus {
  if (!artifact) return "snapshot";
  if (!current) return "unknown";
  return current.sha256 === hash ? "match" : "mismatch";
}

export const GET = createApiHandler(
  "registry.integrity",
  async ({ request, query, route }) => {
    const { artifact = "", hash = "" } = query as {
      artifact?: string;
      hash?: string;
    };
    const manifest = await getRegistryManifest();
    const artifacts: ArtifactContract[] = Object.entries(
      manifest.artifactContracts ?? {},
    )
      .map(([name, contract]) => ({ name, ...(contract as Contract) }))
      .sort((left, right) => left.name.localeCompare(right.name));
    if ((artifact && !hash) || (!artifact && hash)) {
      logApiWarn(request, "registry.integrity.invalid_payload", {
        route: route.path,
        operation: "verify",
        method: request.method,
        reason: "partial_verification_params",
        artifactProvided: Boolean(artifact),
        hashProvided: Boolean(hash),
      });
      return apiError("invalid_payload", 400, {
        message: "Provide both artifact and hash together for verification",
      });
    }

    const artifactKey = normalizeArtifact(artifact);
    const current =
      artifacts.find(
        (item) =>
          item.name === artifactKey ||
          normalizeArtifact(item.path) === artifactKey,
      ) ?? null;
    const status = determineIntegrityStatus(artifact, current, hash);
    const response = {
      schemaVersion: 1,
      kind: "registry-integrity",
      generatedAt: manifest.generatedAt,
      artifact: artifact || null,
      hash: hash || null,
      ok: status === "snapshot" || status === "match",
      status,
      count: artifacts.length,
      current,
      artifacts,
    };

    return cachedJsonResponse(request, response);
  },
);

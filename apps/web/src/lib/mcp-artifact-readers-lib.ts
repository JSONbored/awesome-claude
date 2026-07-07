import { safeDataArtifactPath } from "@/lib/content-artifact-lib";
import { loadJsonDataFile, loadTextDataFile } from "@/lib/content.server";

type StaticAssetsBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

function assetRequest(origin: string, fileName: string) {
  return new Request(`${origin}/data/${fileName}`);
}

export function createMcpArtifactReaders(origin: string, assets?: StaticAssetsBinding) {
  const loadAssetText = async (fileName: string) => {
    const response = await (assets?.fetch(assetRequest(origin, fileName)) ??
      fetch(assetRequest(origin, fileName)));
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName} asset (${response.status})`);
    }
    return response.text();
  };

  const readTextArtifact = async (fileName: string) => {
    const safePath = safeDataArtifactPath(fileName);
    try {
      return await loadTextDataFile(safePath);
    } catch {
      return loadAssetText(safePath);
    }
  };

  return {
    readTextArtifact,
    readJsonArtifact: async <T>(fileName: string): Promise<T> => {
      const safePath = safeDataArtifactPath(fileName);
      try {
        return await loadJsonDataFile<T>(safePath);
      } catch {
        return JSON.parse(await loadAssetText(safePath)) as T;
      }
    },
  };
}

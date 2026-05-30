import { readFile } from "node:fs/promises";
import path from "node:path";

import { getCloudflareBinding } from "@/lib/cloudflare-env.server";

type AssetsBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export async function readDownloadAsset(asset: string, requestUrl: string) {
  try {
    const relativeAssetPath = asset.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", relativeAssetPath);
    return await readFile(filePath);
  } catch {
    const assets = getCloudflareBinding<AssetsBinding>("ASSETS");
    if (!assets) {
      throw new Error("asset_not_found:no_assets_binding");
    }
    const response = await assets.fetch(new Request(new URL(asset, requestUrl)));
    if (!response.ok) {
      throw new Error(`asset_not_found:${response.status}`);
    }
    return response.arrayBuffer();
  }
}

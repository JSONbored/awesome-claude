import { createApiFileRoute } from "@/lib/api/file-route";

import { downloadQuerySchema } from "@/lib/api/contracts";
import { apiError, createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { logApiError, logApiInfo, logApiWarn, sample } from "@/lib/api-logs";
import { readDownloadAsset } from "@/lib/download-assets.server";
import {
  filenameFromAsset,
  getContentType,
  isAllowedAssetPath,
  DOWNLOAD_CACHE_CONTROL,
} from "@/lib/download-asset-lib";

export const GET = createApiHandler("download", async ({ request, query, requestId }) => {
  const { asset } = query as InferApiQuery<typeof downloadQuerySchema>;

  if (asset.length > 256) {
    logApiWarn(request, "download.invalid_asset_length");
    return apiError("invalid_asset", 400, { requestId });
  }

  if (!isAllowedAssetPath(asset)) {
    logApiWarn(request, "download.invalid_asset_pattern");
    return apiError("invalid_asset", 400, { requestId });
  }

  const filename = filenameFromAsset(asset);

  try {
    const body = await readDownloadAsset(asset, request.url);
    if (sample(0.02)) {
      logApiInfo(request, "download.sample", { asset });
    }
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": getContentType(asset),
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": DOWNLOAD_CACHE_CONTROL,
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    logApiError(request, "download.not_found", { asset });
    return apiError("not_found", 404, { requestId });
  }
});

export const Route = createApiFileRoute("/api/download")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});

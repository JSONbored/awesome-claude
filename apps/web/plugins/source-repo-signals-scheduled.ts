import { definePlugin } from "nitro";

import { runWithCloudflareRuntime } from "@/lib/cloudflare-env.server";
import { getDirectoryEntries } from "@/lib/content.server";
import { refreshSourceRepoSignalsForEntries } from "@/lib/source-repo-signals.server";

// 6-hourly source-repo signal refresh. Must match wrangler.jsonc exactly.
const SOURCE_REPO_SIGNALS_CRON = "17 */6 * * *";

type CloudflareScheduledPayload = {
  controller?: { cron?: string };
  env: unknown;
  context: unknown;
};

export default definePlugin((nitroApp) => {
  nitroApp.hooks?.hook(
    "cloudflare:scheduled",
    async ({ controller, env, context }: CloudflareScheduledPayload) => {
      if (controller?.cron !== SOURCE_REPO_SIGNALS_CRON) return;

      const request = new Request("https://heyclau.de/__scheduled/source-repo-signals");
      await runWithCloudflareRuntime(request, env, context, async () => {
        try {
          const entries = await getDirectoryEntries();
          const result = await refreshSourceRepoSignalsForEntries(entries);
          console.log("[source-repo-signals] refresh complete", result);
        } catch (error) {
          console.error("[source-repo-signals] scheduled refresh failed", error);
        }
      });
    },
  );
});

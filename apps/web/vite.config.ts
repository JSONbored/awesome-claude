// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

const SERVER_ONLY_STUBS: Record<string, string> = {
  "\0heyclaude-content-server-client-stub": `
    const fail = () => { throw new Error("Server-only content helpers cannot run in the browser."); };
    export const getRegistryManifest = fail;
    export const getCategorySummaries = fail;
    export const getRegistryChangelog = fail;
    export const getSearchIndex = fail;
    export const getEntryLlmsText = fail;
    export const isSafeContentPathPart = () => false;
    export const getEntry = fail;
    export const loadJsonDataFile = fail;
    export const loadTextDataFile = fail;
    export const getDirectoryEntries = fail;
    export const getDirectoryEntriesByCategory = fail;
    export const getAllEntries = fail;
  `,
  "\0heyclaude-cloudflare-env-client-stub": `
    const fail = () => { throw new Error("Cloudflare runtime bindings cannot run in the browser."); };
    export const getCloudflareBinding = fail;
    export const getCloudflareEnv = fail;
    export const getEnvString = fail;
    export const runWithCloudflareRuntime = fail;
  `,
  "\0heyclaude-download-assets-client-stub": `
    export const readDownloadAsset = () => {
      throw new Error("Download asset readers cannot run in the browser.");
    };
  `,
  "\0heyclaude-mcp-server-client-stub": `
    export const createHeyClaudeMcpServer = () => {
      throw new Error("MCP server creation cannot run in the browser.");
    };
  `,
  "\0heyclaude-mcp-transport-client-stub": `
    export class WebStandardStreamableHTTPServerTransport {
      constructor() {
        throw new Error("MCP HTTP transport cannot run in the browser.");
      }
    }
  `,
  "\0heyclaude-submission-risk-client-stub": `
    export const analyzeSubmissionDraftRisk = () => {
      throw new Error("Submission risk analysis cannot run in the browser.");
    };
  `,
  "\0heyclaude-og-render-client-stub": `
    export const renderOgPng = () => {
      throw new Error("OG PNG rendering (workers-og + WASM) cannot run in the browser.");
    };
  `,
  "\0heyclaude-submission-client-stub": `
    const fail = () => { throw new Error("Submission intake helpers cannot run in the browser."); };
    export const buildSubmissionPrDraft = fail;
    export const validateSubmission = fail;
    export const normalizeSubmissionPayloadFields = fail;
    export const normalizeCategory = fail;
    export const looksLikeSubmissionPrDraft = fail;
    export const parseSubmissionPrBody = fail;
    export const slugify = fail;
    export const submissionActivityState = fail;
  `,
};

function serverOnlyClientStubs(): Plugin {
  return {
    name: "heyclaude-server-only-client-stubs",
    enforce: "pre",
    resolveId(source, _importer, options) {
      if (options?.ssr) return null;
      if (source.endsWith("content.server")) return "\0heyclaude-content-server-client-stub";
      if (source.endsWith("cloudflare-env.server")) {
        return "\0heyclaude-cloudflare-env-client-stub";
      }
      if (source.endsWith("download-assets.server")) {
        return "\0heyclaude-download-assets-client-stub";
      }
      if (source.endsWith("og-render.server")) {
        return "\0heyclaude-og-render-client-stub";
      }
      if (source === "@heyclaude/mcp/server") return "\0heyclaude-mcp-server-client-stub";
      if (source === "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js") {
        return "\0heyclaude-mcp-transport-client-stub";
      }
      if (source === "@heyclaude/registry/submission") {
        return "\0heyclaude-submission-client-stub";
      }
      if (source === "@heyclaude/registry/submission-risk") {
        return "\0heyclaude-submission-risk-client-stub";
      }
      return null;
    },
    load(id) {
      return SERVER_ONLY_STUBS[id] ?? null;
    },
  };
}

// @lovable.dev/vite-tanstack-config keeps the public nitro option type narrow,
// but it forwards unknown Nitro options at runtime. This registers the Cloudflare
// scheduled Worker plugin without changing the wrapper package.
const nitroOptions = {
  plugins: ["./plugins/source-repo-signals-scheduled.ts"],
} as unknown as true;

export default defineConfig({
  plugins: [serverOnlyClientStubs()],
  nitro: nitroOptions,
  tanstackStart: {
    autoCodeSplitting: true,
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

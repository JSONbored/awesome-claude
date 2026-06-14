import { useEffect } from "react";
import { absoluteUrl } from "@/lib/seo";

// WebMCP (navigator.modelContext) — exposes directory search to in-browser AI agents.
// Experimental (Chrome EPP); no-ops where the API is unavailable.
type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (
    args: Record<string, unknown>,
  ) => Promise<{ content: { type: string; text: string }[] }>;
};
type ModelContextNavigator = Navigator & {
  modelContext?: { provideContext: (ctx: { tools: WebMcpTool[] }) => void };
};

export function WebMcpProvider() {
  useEffect(() => {
    const nav = navigator as ModelContextNavigator;
    if (!nav.modelContext?.provideContext) return;
    try {
      nav.modelContext.provideContext({
        tools: [
          {
            name: "search_heyclaude",
            description:
              "Search the HeyClaude directory of Claude Code resources (MCP servers, agents, skills, hooks, commands, rules, collections, tools). Returns matching entries with titles, categories, descriptions, and URLs.",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string", description: "Free-text search query." },
                category: {
                  type: "string",
                  description:
                    "Optional category filter, e.g. mcp, agents, skills, hooks, commands, rules, collections, tools.",
                },
              },
              required: ["query"],
            },
            async execute(args) {
              const query = String(args.query ?? "");
              const category = typeof args.category === "string" ? args.category : "";
              // Lazy-load the dataset only when an agent actually calls the tool.
              const { search } = await import("@/data/search");
              const results = search({ q: query })
                .filter((e) => !category || e.category === category)
                .slice(0, 10)
                .map((e) => ({
                  title: e.title,
                  category: e.category,
                  description: e.description,
                  url: absoluteUrl(`/entry/${e.category}/${e.slug}`),
                }));
              return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
            },
          },
        ],
      });
    } catch {
      // WebMCP is experimental — ignore registration failures.
    }
  }, []);

  return null;
}

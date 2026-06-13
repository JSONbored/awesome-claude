// Curated, bounded set of head-to-head comparison pages. Each `refs` is "category/slug"; the
// route drops missing refs and 404s if fewer than 2 resolve, so a renamed entry can't ship an
// empty page. Keep this list hand-maintained (high-intent pairings only) to avoid thin pages.
export type Comparison = {
  slug: string;
  title: string;
  heading: string;
  seoDescription: string;
  intro: string;
  refs: string[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "payment-mcp-servers",
    title: "Stripe vs PayPal vs Square MCP servers for Claude",
    heading: "Payment MCP servers compared",
    seoDescription:
      "Compare the Stripe, PayPal, and Square MCP servers for Claude Code — trust, install, safety notes, and config, side by side.",
    intro:
      "Three payment MCP servers for Claude Code, side by side — so you can pick the one that matches your stack and risk tolerance.",
    refs: ["mcp/stripe-mcp-server", "mcp/paypal-mcp-server", "mcp/square-mcp-server"],
  },
  {
    slug: "database-mcp-servers",
    title: "PostgreSQL vs Redis vs MongoDB vs Supabase MCP servers for Claude",
    heading: "Database MCP servers compared",
    seoDescription:
      "Compare PostgreSQL, Redis, MongoDB, and Supabase MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro: "The most-used database MCP servers for Claude Code, compared on trust, install, and safety signals.",
    refs: [
      "mcp/postgresql-mcp-server",
      "mcp/redis-mcp-server",
      "mcp/mongodb-mcp-server",
      "mcp/supabase-mcp-server",
    ],
  },
  {
    slug: "devops-mcp-servers",
    title: "GitHub vs GitLab vs Cloudflare vs Netlify MCP servers for Claude",
    heading: "DevOps MCP servers compared",
    seoDescription:
      "Compare GitHub, GitLab, Cloudflare, and Netlify MCP servers for Claude Code side by side.",
    intro: "Ship-and-deploy MCP servers for Claude Code, compared on trust, platforms, and setup.",
    refs: [
      "mcp/github-mcp-server",
      "mcp/gitlab-mcp-server",
      "mcp/cloudflare-mcp-server",
      "mcp/netlify-mcp-server",
    ],
  },
  {
    slug: "ai-coding-agents",
    title: "Cursor vs Aider vs Cline vs Continue for Claude",
    heading: "AI coding agents compared",
    seoDescription:
      "Compare Cursor, Aider, Cline, and Continue — AI coding tools that work with Claude — side by side.",
    intro: "The leading AI coding tools that pair with Claude, compared on platforms, source, and setup.",
    refs: ["tools/cursor", "tools/aider", "tools/cline", "tools/continue"],
  },
  {
    slug: "llm-observability-tools",
    title: "Langfuse vs LangSmith vs Helicone vs Braintrust",
    heading: "LLM observability tools compared",
    seoDescription:
      "Compare Langfuse, LangSmith, Helicone, and Braintrust — LLM observability and eval tools — side by side.",
    intro: "Observability and eval platforms for LLM apps, compared on trust, source, and setup.",
    refs: ["tools/langfuse", "tools/langsmith", "tools/helicone", "tools/braintrust"],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((comparison) => comparison.slug === slug);
}

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
    intro:
      "The most-used database MCP servers for Claude Code, compared on trust, install, and safety signals.",
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
    intro:
      "The leading AI coding tools that pair with Claude, compared on platforms, source, and setup.",
    refs: ["tools/cursor", "tools/aider", "tools/cline", "tools/continue"],
  },
  {
    slug: "llm-observability-tools",
    title: "Phoenix vs Langfuse vs LangSmith vs Helicone vs Braintrust",
    heading: "LLM observability tools compared",
    seoDescription:
      "Compare Arize Phoenix, Langfuse, LangSmith, Helicone, and Braintrust — LLM observability and eval tools — side by side.",
    intro: "Observability and eval platforms for LLM apps, compared on trust, source, and setup.",
    refs: [
      "tools/arize-phoenix",
      "tools/langfuse",
      "tools/langsmith",
      "tools/helicone",
      "tools/braintrust",
    ],
  },
  {
    slug: "search-mcp-servers",
    title: "Brave Search vs Exa vs Perplexity MCP servers for Claude",
    heading: "Web search MCP servers compared",
    seoDescription:
      "Compare the Brave Search, Exa, and Perplexity MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Web-search MCP servers that give Claude live retrieval, compared on trust, setup, and safety signals.",
    refs: ["mcp/brave-search-mcp-server", "mcp/exa-mcp-server", "mcp/perplexity-mcp-server"],
  },
  {
    slug: "vector-database-mcp-servers",
    title: "Pinecone vs Chroma vs Qdrant MCP servers for Claude",
    heading: "Vector database MCP servers compared",
    seoDescription:
      "Compare the Pinecone, Chroma, and Qdrant MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Vector-store MCP servers for retrieval-augmented Claude workflows, compared on trust, setup, and platforms.",
    refs: ["mcp/pinecone-developer-mcp-server", "mcp/chroma-mcp-server", "mcp/qdrant-mcp-server"],
  },
  {
    slug: "browser-automation-mcp-servers",
    title: "Playwright vs Browserbase MCP servers for Claude",
    heading: "Browser automation MCP servers compared",
    seoDescription:
      "Compare the Playwright and Browserbase MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Browser-automation MCP servers that let Claude drive a real browser, compared on trust, setup, and safety.",
    refs: ["mcp/playwright-mcp-server", "mcp/browserbase-mcp-server"],
  },
  {
    slug: "project-management-mcp-servers",
    title: "Linear vs Jira vs Notion vs Asana MCP servers for Claude",
    heading: "Project management MCP servers compared",
    seoDescription:
      "Compare the Linear, Jira, Notion, and Asana MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Project- and issue-tracking MCP servers for Claude Code, compared on trust, platforms, and setup.",
    refs: [
      "mcp/linear-mcp-server",
      "mcp/jira-mcp-server",
      "mcp/notion-mcp-server",
      "mcp/asana-mcp-server",
    ],
  },
  {
    slug: "observability-mcp-servers",
    title: "Datadog vs Grafana vs Sentry MCP servers for Claude",
    heading: "Observability MCP servers compared",
    seoDescription:
      "Compare the Datadog, Grafana, and Sentry MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Monitoring and observability MCP servers that bring metrics and errors into Claude, compared on trust and setup.",
    refs: ["mcp/datadog-mcp-server", "mcp/grafana-mcp-server", "mcp/sentry-mcp-server"],
  },
  {
    slug: "memory-mcp-servers",
    title: "Memory vs Basic Memory vs Codebase Memory MCP servers for Claude",
    heading: "Memory MCP servers compared",
    seoDescription:
      "Compare the Memory, Basic Memory, and Codebase Memory MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Persistent-memory MCP servers that give Claude recall across sessions, compared on trust, setup, and safety.",
    refs: [
      "mcp/memory-mcp-server",
      "mcp/basic-memory-mcp-server",
      "mcp/codebase-memory-mcp-server",
    ],
  },
  {
    slug: "rag-agent-frameworks",
    title: "LlamaIndex vs LangGraph vs CrewAI vs AutoGen",
    heading: "RAG & agent frameworks compared",
    seoDescription:
      "Compare LlamaIndex, LangGraph, CrewAI, and AutoGen — RAG and multi-agent orchestration frameworks for LLM apps — side by side.",
    intro:
      "The leading open-source frameworks for building RAG pipelines and multi-agent systems, compared on focus, source, and setup.",
    refs: ["tools/llamaindex", "tools/langgraph", "tools/crewai", "tools/microsoft-autogen"],
  },
  {
    slug: "llm-security-redteaming-tools",
    title: "Garak vs Lakera Guard vs PyRIT vs Promptfoo",
    heading: "LLM security & red-teaming tools compared",
    seoDescription:
      "Compare Garak, Lakera Guard, PyRIT, and Promptfoo — LLM security scanning, runtime guardrails, and red-teaming — side by side.",
    intro:
      "Tools for probing and protecting LLM applications — vulnerability scanning, runtime guardrails, and adversarial red-teaming — compared.",
    refs: ["tools/garak", "tools/lakera-guard", "tools/pyrit", "tools/promptfoo"],
  },
  {
    slug: "llm-eval-tools",
    title: "Braintrust vs Promptfoo vs DeepEval vs Phoenix",
    heading: "LLM evaluation tools compared",
    seoDescription:
      "Compare Braintrust, Promptfoo, DeepEval, and Arize Phoenix — LLM evaluation and experimentation tools — side by side.",
    intro:
      "Evaluation and experimentation platforms for LLM apps, compared on approach, source, and setup.",
    refs: ["tools/braintrust", "tools/promptfoo", "tools/deepeval", "tools/arize-phoenix"],
  },
  {
    slug: "ai-code-editors",
    title: "Cursor vs Zed vs Windsurf vs Continue",
    heading: "AI code editors compared",
    seoDescription:
      "Compare Cursor, Zed, Windsurf, and Continue — AI-powered code editors and assistants — side by side on trust, install, and platform support.",
    intro:
      "AI-native editors and assistants for day-to-day coding, compared on form factor, source, and setup.",
    refs: ["tools/cursor", "tools/zed", "tools/windsurf", "tools/continue"],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((comparison) => comparison.slug === slug);
}

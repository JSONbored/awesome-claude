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
    title: "Langfuse vs LangSmith vs Helicone vs Braintrust",
    heading: "LLM observability tools compared",
    seoDescription:
      "Compare Langfuse, LangSmith, Helicone, and Braintrust — LLM observability and eval tools — side by side.",
    intro: "Observability and eval platforms for LLM apps, compared on trust, source, and setup.",
    refs: ["tools/langfuse", "tools/langsmith", "tools/helicone", "tools/braintrust"],
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
    slug: "ai-app-builders",
    title: "Bolt vs Lovable vs v0 vs Replit Agent",
    heading: "AI app builders compared",
    seoDescription:
      "Compare Bolt.new, Lovable, Vercel v0, and Replit Agent — AI app and UI builders that generate full-stack apps from prompts — side by side.",
    intro:
      "Prompt-to-app builders that scaffold and deploy full-stack projects, compared on approach, source, and setup.",
    refs: ["tools/bolt-new", "tools/lovable", "tools/vercel-v0", "tools/replit-agent"],
  },
  {
    slug: "autonomous-coding-agents",
    title: "Devin vs OpenHands vs OpenSWE vs Goose",
    heading: "Autonomous coding agents compared",
    seoDescription:
      "Compare Devin, OpenHands, OpenSWE, and Goose — autonomous software-engineering agents — side by side on approach, source, and setup.",
    intro:
      "End-to-end autonomous coding agents that plan and execute multi-step engineering tasks, compared.",
    refs: ["tools/devin", "tools/openhands", "tools/open-swe", "tools/goose"],
  },
  {
    slug: "data-orchestration-tools",
    title: "Airflow vs Dagster vs Prefect vs dbt",
    heading: "Data orchestration tools compared",
    seoDescription:
      "Compare Apache Airflow, Dagster, Prefect, and dbt Core — data pipeline orchestration and transformation tools — side by side.",
    intro:
      "Orchestration and transformation tools for data pipelines, compared on model, source, and setup.",
    refs: ["tools/apache-airflow", "tools/dagster", "tools/prefect", "tools/dbt-core"],
  },
  {
    slug: "llm-serving-tools",
    title: "vLLM vs Ollama vs llama.cpp vs BentoML",
    heading: "LLM serving & inference tools compared",
    seoDescription:
      "Compare vLLM, Ollama, llama.cpp, and BentoML — tools for running and serving LLMs locally and in production — side by side.",
    intro: "Inference and serving runtimes for open models, compared on focus, source, and setup.",
    refs: ["tools/vllm", "tools/ollama", "tools/llama-cpp", "tools/bentoml"],
  },
  {
    slug: "python-agent-frameworks",
    title: "Pydantic AI vs Agno vs DSPy vs Mastra",
    heading: "Agent frameworks compared",
    seoDescription:
      "Compare Pydantic AI, Agno, DSPy, and Mastra — frameworks for building typed, programmatic LLM agents — side by side.",
    intro:
      "Code-first frameworks for building LLM agents, compared on approach, source, and setup.",
    refs: ["tools/pydantic-ai", "tools/agno", "tools/dspy", "tools/mastra"],
  },
  {
    slug: "web-scraping-tools",
    title: "Firecrawl vs Apify vs Exa vs Hyperbrowser",
    heading: "Web scraping & crawling tools compared",
    seoDescription:
      "Compare Firecrawl, Apify, Exa, and Hyperbrowser — web scraping, crawling, and retrieval tools for AI — side by side.",
    intro:
      "Tools for turning the web into LLM-ready data, compared on approach, source, and setup.",
    refs: ["tools/firecrawl", "tools/apify", "tools/exa", "tools/hyperbrowser"],
  },
  {
    slug: "ml-app-ui-frameworks",
    title: "Streamlit vs Gradio vs Chainlit vs Marimo",
    heading: "ML & AI app UI frameworks compared",
    seoDescription:
      "Compare Streamlit, Gradio, Chainlit, and Marimo — Python frameworks for building ML and LLM app UIs — side by side.",
    intro: "Python UI frameworks for data and LLM apps, compared on focus, source, and setup.",
    refs: ["tools/streamlit", "tools/gradio", "tools/chainlit", "tools/marimo"],
  },
  {
    slug: "code-security-scanners",
    title: "Semgrep vs Gitleaks vs Grype vs Kubescape",
    heading: "Code & supply-chain security scanners compared",
    seoDescription:
      "Compare Semgrep, Gitleaks, Grype, and Kubescape — code, secret, dependency, and Kubernetes security scanners — side by side.",
    intro:
      "Static analysis and supply-chain security scanners, compared on focus, source, and setup.",
    refs: ["tools/semgrep", "tools/gitleaks", "tools/grype", "tools/kubescape"],
  },
  {
    slug: "vector-databases",
    title: "Chroma vs Weaviate vs LanceDB vs Milvus",
    heading: "Vector databases compared",
    seoDescription:
      "Compare Chroma, Weaviate, LanceDB, and Milvus — vector databases for embeddings and retrieval-augmented generation — side by side.",
    intro: "Vector databases for embeddings and RAG, compared on approach, source, and setup.",
    refs: ["tools/chroma", "tools/weaviate", "tools/lancedb", "tools/milvus"],
  },
  {
    slug: "rag-evaluation-tools",
    title: "Ragas vs TruLens vs Giskard vs DeepEval",
    heading: "RAG & LLM evaluation tools compared",
    seoDescription:
      "Compare Ragas, TruLens, Giskard, and DeepEval — evaluation tools for RAG pipelines and LLM apps — side by side.",
    intro:
      "Evaluation libraries focused on RAG and LLM quality, compared on approach, source, and setup.",
    refs: ["tools/ragas", "tools/trulens", "tools/giskard", "tools/deepeval"],
  },
  {
    slug: "ml-experiment-tracking",
    title: "MLflow vs Weave vs DVC",
    heading: "ML experiment tracking tools compared",
    seoDescription:
      "Compare MLflow, Weave, and DVC — experiment tracking and ML lifecycle tools — side by side on approach, source, and setup.",
    intro: "Experiment tracking and ML lifecycle tools, compared on focus, source, and setup.",
    refs: ["tools/mlflow", "tools/weave", "tools/dvc"],
  },
  {
    slug: "design-mcp-servers",
    title: "Figma vs Canva vs Zeplin MCP servers for Claude",
    heading: "Design MCP servers compared",
    seoDescription:
      "Compare the Figma, Canva, and Zeplin MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Design-tool MCP servers that connect Claude to your design workflow, compared on trust, setup, and safety.",
    refs: ["mcp/figma-mcp-server", "mcp/canva-mcp-server", "mcp/zeplin-mcp-server"],
  },
  {
    slug: "messaging-mcp-servers",
    title: "Slack vs Discord vs Telegram vs WhatsApp MCP servers for Claude",
    heading: "Messaging MCP servers compared",
    seoDescription:
      "Compare the Slack, Discord, Telegram, and WhatsApp MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Messaging-platform MCP servers that let Claude read and post messages, compared on trust, setup, and safety.",
    refs: [
      "mcp/slack-mcp-server",
      "mcp/discord-mcp-server",
      "mcp/telegram-mcp-server",
      "mcp/whatsapp-mcp-server",
    ],
  },
  {
    slug: "cloud-provider-mcp-servers",
    title: "AWS vs Azure vs Google Cloud MCP servers for Claude",
    heading: "Cloud provider MCP servers compared",
    seoDescription:
      "Compare the AWS, Azure, and Google Cloud MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Cloud-provider MCP servers that let Claude manage cloud resources, compared on trust, platforms, and setup.",
    refs: ["mcp/aws-services-mcp-server", "mcp/azure-mcp-server", "mcp/gcloud-mcp-server"],
  },
  {
    slug: "knowledge-base-mcp-servers",
    title: "Notion vs Obsidian vs AFFiNE MCP servers for Claude",
    heading: "Knowledge base MCP servers compared",
    seoDescription:
      "Compare the Notion, Obsidian, and AFFiNE MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Note and knowledge-base MCP servers that give Claude access to your docs, compared on trust, setup, and safety.",
    refs: ["mcp/notion-mcp-server", "mcp/obsidian-mcp-server", "mcp/affine-mcp-server"],
  },
  {
    slug: "finance-data-mcp-servers",
    title: "Plaid vs Alpaca vs Financial Datasets MCP servers for Claude",
    heading: "Finance data MCP servers compared",
    seoDescription:
      "Compare the Plaid, Alpaca, and Financial Datasets MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Financial-data MCP servers that bring banking and market data into Claude, compared on trust, setup, and safety.",
    refs: ["mcp/plaid-mcp-server", "mcp/alpaca-mcp-server", "mcp/financial-datasets-mcp-server"],
  },
  {
    slug: "docs-mcp-servers",
    title: "Context7 vs Ref Tools vs GitMCP docs servers for Claude",
    heading: "Documentation MCP servers compared",
    seoDescription:
      "Compare the Context7, Ref Tools, and GitMCP documentation MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Documentation-retrieval MCP servers that feed Claude up-to-date library docs, compared on trust, setup, and coverage.",
    refs: ["mcp/context7-mcp-server", "mcp/ref-tools-mcp-server", "mcp/gitmcp-docs-server"],
  },
  {
    slug: "data-warehouse-mcp-servers",
    title: "Snowflake vs BigQuery vs ClickHouse MCP servers for Claude",
    heading: "Data warehouse MCP servers compared",
    seoDescription:
      "Compare the Snowflake, BigQuery, and ClickHouse MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Analytics/warehouse MCP servers that let Claude query large datasets, compared on trust, setup, and safety.",
    refs: ["mcp/snowflake-mcp-server", "mcp/bigquery-mcp-server", "mcp/clickhouse-mcp-server"],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((comparison) => comparison.slug === slug);
}

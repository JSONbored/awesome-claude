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
  {
    slug: "llm-app-libraries",
    title: "Vercel AI SDK vs LiteLLM vs Instructor vs Guardrails AI",
    heading: "LLM application libraries compared",
    seoDescription:
      "Compare the Vercel AI SDK, LiteLLM, Instructor, and Guardrails AI — libraries for building LLM apps with routing, structured output, and validation — side by side.",
    intro:
      "Libraries that handle model routing, structured output, and validation in LLM apps, compared on focus, source, and setup.",
    refs: ["tools/vercel-ai-sdk", "tools/litellm", "tools/instructor", "tools/guardrails-ai"],
  },
  {
    slug: "mcp-development-tools",
    title: "MCP Inspector vs Smithery vs Speakeasy",
    heading: "MCP development tools compared",
    seoDescription:
      "Compare MCP Inspector, Smithery, and Speakeasy — tools for building, testing, and distributing Model Context Protocol servers — side by side.",
    intro: "Tooling for developing and shipping MCP servers, compared on focus, source, and setup.",
    refs: ["tools/mcp-inspector", "tools/smithery", "tools/speakeasy"],
  },
  {
    slug: "testing-mcp-servers",
    title: "Cypress vs BrowserStack vs Postman vs WebdriverIO MCP servers for Claude",
    heading: "Testing & QA MCP servers compared",
    seoDescription:
      "Compare the Cypress, BrowserStack, Postman, and WebdriverIO MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Testing and QA MCP servers that let Claude run and inspect test suites, compared on trust, setup, and safety.",
    refs: [
      "mcp/cypress-cloud-mcp-server",
      "mcp/browserstack-mcp-server",
      "mcp/postman-mcp-server",
      "mcp/webdriverio-mcp-server",
    ],
  },
  {
    slug: "productivity-mcp-servers",
    title: "Todoist vs Trello vs Time MCP servers for Claude",
    heading: "Productivity MCP servers compared",
    seoDescription:
      "Compare the Todoist, Trello, and Time MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Task, board, and time MCP servers that bring everyday productivity into Claude, compared on trust and setup.",
    refs: ["mcp/todoist-mcp-server", "mcp/trello-mcp-server", "mcp/time-mcp-server"],
  },
  {
    slug: "game-3d-dev-mcp-servers",
    title: "Blender vs Unity vs Godot vs Unreal Engine MCP servers for Claude",
    heading: "3D & game dev MCP servers compared",
    seoDescription:
      "Compare the Blender, Unity, Godot, and Unreal Engine MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "3D and game-engine MCP servers that let Claude drive creative and game tooling, compared on trust, setup, and safety.",
    refs: [
      "mcp/blender-mcp-server",
      "mcp/unity-mcp-server",
      "mcp/godot-mcp-server",
      "mcp/unreal-engine-mcp-server",
    ],
  },
  {
    slug: "reverse-engineering-mcp-servers",
    title: "Ghidra vs IDA Pro vs JADX vs WinDbg MCP servers for Claude",
    heading: "Reverse engineering MCP servers compared",
    seoDescription:
      "Compare the Ghidra, IDA Pro, JADX, and WinDbg MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Reverse-engineering and debugging MCP servers that connect Claude to RE tooling, compared on trust, setup, and safety.",
    refs: [
      "mcp/ghidramcp-server",
      "mcp/ida-pro-mcp-server",
      "mcp/jadx-ai-mcp-server",
      "mcp/windbg-mcp-server",
    ],
  },
  {
    slug: "security-testing-mcp-servers",
    title: "Burp Suite vs Pentest AI vs Nuclei vs EnScan MCP servers for Claude",
    heading: "Security testing MCP servers compared",
    seoDescription:
      "Compare the Burp Suite, Pentest AI, Nuclei, and EnScan MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Offensive-security and pentest MCP servers for authorized testing, compared on trust, setup, and safety.",
    refs: [
      "mcp/burp-suite-mcp-server",
      "mcp/pentest-ai-mcp-server",
      "mcp/nuclear-mcp-server",
      "mcp/enscan-go-mcp-server",
    ],
  },
  {
    slug: "code-search-mcp-servers",
    title: "Serena vs Code Index vs CodeGraphContext vs ChunkHound MCP servers for Claude",
    heading: "Code search & indexing MCP servers compared",
    seoDescription:
      "Compare the Serena, Code Index, CodeGraphContext, and ChunkHound MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Code-indexing and semantic-search MCP servers that give Claude codebase context, compared on trust, setup, and approach.",
    refs: [
      "mcp/serena-mcp-server",
      "mcp/code-index-mcp-server",
      "mcp/codegraphcontext-mcp-server",
      "mcp/chunkhound-mcp-server",
    ],
  },
  {
    slug: "hosting-deploy-mcp-servers",
    title: "Render vs Heroku vs Coolify MCP servers for Claude",
    heading: "Hosting & deployment MCP servers compared",
    seoDescription:
      "Compare the Render, Heroku, and Coolify MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Hosting and deployment MCP servers that let Claude ship apps, compared on trust, platforms, and setup.",
    refs: ["mcp/render-mcp-server", "mcp/heroku-mcp-server", "mcp/coolify-mcp-server"],
  },
  {
    slug: "mobile-dev-mcp-servers",
    title: "iOS Simulator vs Mobile MCP vs Expo vs Xcode MCP servers for Claude",
    heading: "Mobile dev MCP servers compared",
    seoDescription:
      "Compare the iOS Simulator, Mobile, Expo, and Xcode MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Mobile-development MCP servers for building and testing apps with Claude, compared on trust, platforms, and setup.",
    refs: [
      "mcp/ios-simulator-mcp-server",
      "mcp/mobile-mcp-server",
      "mcp/expo-mcp-server",
      "mcp/xcodebuildmcp-server",
    ],
  },
  {
    slug: "research-mcp-servers",
    title: "arXiv vs Paper Search vs GPT Researcher vs Deep Research MCP servers for Claude",
    heading: "Research MCP servers compared",
    seoDescription:
      "Compare the arXiv, Paper Search, GPT Researcher, and Deep Research MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Academic and deep-research MCP servers that bring papers and synthesis into Claude, compared on trust and setup.",
    refs: [
      "mcp/arxiv-mcp-server",
      "mcp/paper-search-mcp-server",
      "mcp/gpt-researcher-mcp-server",
      "mcp/deep-research-mcp-server",
    ],
  },
  {
    slug: "auth-identity-mcp-servers",
    title: "Auth0 vs Okta vs Stytch MCP servers for Claude",
    heading: "Auth & identity MCP servers compared",
    seoDescription:
      "Compare the Auth0, Okta, and Stytch MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Identity and authentication MCP servers that let Claude manage auth, compared on trust, setup, and safety.",
    refs: ["mcp/auth0-mcp-server", "mcp/okta-mcp-server", "mcp/stytch-mcp-server"],
  },
  {
    slug: "product-analytics-mcp-servers",
    title: "Amplitude vs PostHog vs Google Analytics MCP servers for Claude",
    heading: "Product analytics MCP servers compared",
    seoDescription:
      "Compare the Amplitude, PostHog, and Google Analytics MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Product-analytics MCP servers that bring usage data into Claude, compared on trust, setup, and safety.",
    refs: ["mcp/amplitude-mcp-server", "mcp/posthog-mcp-server", "mcp/google-analytics-mcp-server"],
  },
  {
    slug: "diagramming-mcp-servers",
    title: "draw.io vs Excalidraw vs AntV Chart MCP servers for Claude",
    heading: "Diagramming MCP servers compared",
    seoDescription:
      "Compare the draw.io, Excalidraw, and AntV Chart MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Diagramming and charting MCP servers that let Claude generate visuals, compared on trust, setup, and output.",
    refs: [
      "mcp/drawio-mcp-server",
      "mcp/excalidraw-canvas-mcp-server",
      "mcp/antv-mcp-server-chart",
    ],
  },
  {
    slug: "office-document-mcp-servers",
    title: "Word vs PowerPoint vs Excel MCP servers for Claude",
    heading: "Office document MCP servers compared",
    seoDescription:
      "Compare the Word, PowerPoint, and Excel MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "Office-document MCP servers that let Claude create and edit documents, compared on trust, setup, and output.",
    refs: [
      "mcp/office-word-mcp-server",
      "mcp/office-powerpoint-mcp-server",
      "mcp/excel-mcp-server",
    ],
  },
  {
    slug: "ci-cd-mcp-servers",
    title: "CircleCI vs Azure DevOps vs Argo CD MCP servers for Claude",
    heading: "CI/CD MCP servers compared",
    seoDescription:
      "Compare the CircleCI, Azure DevOps, and Argo CD MCP servers for Claude Code — trust, install, safety, and config side by side.",
    intro:
      "CI/CD and delivery MCP servers that let Claude manage pipelines and deployments, compared on trust, setup, and safety.",
    refs: ["mcp/circleci-mcp-server", "mcp/azure-devops-mcp-server", "mcp/argocd-mcp-server"],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((comparison) => comparison.slug === slug);
}

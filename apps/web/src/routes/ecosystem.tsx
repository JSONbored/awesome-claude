import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { ArrowRight, Rss } from "lucide-react";
import { INTEGRATIONS } from "@/data/integrations";
import { IntegrationCard } from "@/components/integration-card";
import {
  CompatibilityMatrix,
  type MatrixRow,
  type CellDetail,
} from "@/components/compatibility-matrix";
import { HarnessCoverage } from "@/components/harness-coverage";
import { DropInSetup } from "@/components/drop-in-setup";
import { SponsorsSection } from "@/components/sponsors-section";
import { ECOSYSTEM_FEEDS } from "@/data/ecosystem-feeds";
import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { HARNESSES } from "@/types/registry";
import { CopyButton } from "@/components/copy-button";
import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";

const CLIENTS = [
  { id: "claude-code", label: "Claude Code" },
  { id: "claude-desktop", label: "Claude Desktop" },
  { id: "codex", label: "Codex" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "raycast", label: "Raycast" },
  { id: "web", label: "Web" },
] as const;

const MATRIX: MatrixRow[] = [
  {
    capability: "Search registry",
    blurb: "Query across all categories",
    cells: {
      "claude-code": "native",
      "claude-desktop": "native",
      codex: "native",
      cursor: "adapter",
      windsurf: "adapter",
      raycast: "native",
      web: "native",
    },
  },
  {
    capability: "Install MCP server",
    blurb: "Copy config or one-shot install",
    cells: {
      "claude-code": "native",
      "claude-desktop": "native",
      codex: "native",
      cursor: "native",
      windsurf: "native",
      raycast: "manual",
      web: "manual",
    },
  },
  {
    capability: "Copy slash command",
    blurb: "Drop a /command into the project",
    cells: {
      "claude-code": "native",
      "claude-desktop": "manual",
      codex: "manual",
      cursor: "adapter",
      windsurf: "adapter",
      raycast: "native",
      web: "manual",
    },
  },
  {
    capability: "Cursor .mdc adapter",
    blurb: "Auto-generated rules per Skill",
    cells: {
      "claude-code": "none",
      "claude-desktop": "none",
      codex: "none",
      cursor: "native",
      windsurf: "adapter",
      raycast: "manual",
      web: "manual",
    },
  },
  {
    capability: "RSS / Atom changelog",
    blurb: "Subscribe to registry deltas",
    cells: {
      "claude-code": "manual",
      "claude-desktop": "manual",
      codex: "manual",
      cursor: "manual",
      windsurf: "manual",
      raycast: "native",
      web: "native",
    },
  },
  {
    capability: "llms.txt corpus",
    blurb: "LLM-ingestible directory",
    cells: {
      "claude-code": "native",
      "claude-desktop": "native",
      codex: "native",
      cursor: "native",
      windsurf: "native",
      raycast: "manual",
      web: "native",
    },
  },
  {
    capability: "OpenAPI playground",
    blurb: "Hit the API with real keys",
    cells: {
      "claude-code": "manual",
      "claude-desktop": "manual",
      codex: "manual",
      cursor: "manual",
      windsurf: "manual",
      raycast: "manual",
      web: "native",
    },
  },
];

const MCP_JSON_SNIPPET = `{
  "mcpServers": {
    "heyclaude": { "command": "npx", "args": ["-y", "@heyclaude/mcp"] }
  }
}`;

const CELL_DETAILS: Record<string, CellDetail> = {
  "Install MCP server::claude-desktop": {
    why: "Edit ~/Library/Application Support/Claude/claude_desktop_config.json.",
    snippet: MCP_JSON_SNIPPET,
  },
  "Install MCP server::cursor": {
    why: "Add to ~/.cursor/mcp.json or .cursor/mcp.json in your workspace.",
    snippet: MCP_JSON_SNIPPET,
    docUrl: "https://docs.cursor.com/context/model-context-protocol",
  },
  "Install MCP server::windsurf": {
    why: "Add to ~/.codeium/windsurf/mcp_config.json.",
    snippet: MCP_JSON_SNIPPET,
  },
  "Install MCP server::codex": {
    snippet: `export OPENAI_MCP_SERVERS='[{"name":"heyclaude","command":"npx","args":["-y","@heyclaude/mcp"]}]'`,
  },
  "Install MCP server::claude-code": {
    snippet: `claude mcp add heyclaude -- npx -y @heyclaude/mcp`,
  },
  "Search registry::raycast": {
    why: "Use the Raycast extension's Search command.",
    snippet: `raycast://extensions/jsonbored/heyclaude`,
    docUrl: "https://www.raycast.com/jsonbored/heyclaude",
  },
  "Search registry::web": {
    why: "Hit /api/registry/search with a query string.",
    snippet: `curl -s 'https://heyclau.de/api/registry/search?q=postgres'`,
    docUrl: "/api-docs",
  },
  "Cursor .mdc adapter::cursor": {
    why: "Drop the regenerated .mdc files into .cursor/rules/.",
    snippet: `curl -s https://heyclau.de/data/skill-adapters/cursor/index.json`,
  },
  "RSS / Atom changelog::web": {
    why: "Subscribe to the registry's RSS feed.",
    snippet: `https://heyclau.de/feed.xml`,
  },
  "llms.txt corpus::web": {
    snippet: `curl -s https://heyclau.de/llms-full.txt | head`,
  },
  "OpenAPI playground::web": {
    snippet: `https://heyclau.de/api-docs`,
    docUrl: "/api-docs",
  },
};

const SUB_NAV = [
  { id: "integrations", label: "Integrations" },
  { id: "compatibility", label: "Compatibility" },
  { id: "coverage", label: "Harness coverage" },
  { id: "setup", label: "Drop-in setup" },
  { id: "feeds", label: "Adapter feeds" },
  { id: "sponsors", label: "Sponsors" },
];

export const Route = createFileRoute("/ecosystem")({
  head: () => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "HeyClaude integrations",
      itemListElement: INTEGRATIONS.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: absoluteUrl(`/integrations/${it.slug}`),
      })),
    };
    return {
      meta: [
        { title: "Ecosystem — HeyClaude" },
        {
          name: "description",
          content:
            "Integrations, harness compatibility, drop-in client setup, adapter feeds, and ecosystem sponsors for the HeyClaude registry.",
        },
        { property: "og:title", content: "Ecosystem — HeyClaude" },
        {
          property: "og:description",
          content: "Where the HeyClaude registry runs, how to plug it in, and who's powering it.",
        },
        { property: "og:url", content: absoluteUrl("/ecosystem") },
      ],
      links: [{ rel: "canonical", href: absoluteUrl("/ecosystem") }],
      scripts: [{ type: "application/ld+json", children: stringifyJsonLd(ld) }],
    };
  },
  component: EcosystemPage,
});

function EcosystemPage() {
  const live = INTEGRATIONS.filter((i) => i.status === "live").length;
  const harnessCount = HARNESSES.length;
  const entries = ENTRIES.length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow">Ecosystem</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">One registry, many clients</h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            HeyClaude ships as a website, MCP server, Raycast extension, Cursor adapter, and a
            public REST API. Pick the surface that fits the client you're using.
          </p>
        </div>
        <Link
          to="/api-docs"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90"
        >
          Build on the registry <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Live stats */}
      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        <Stat label="Entries indexed" value={<CountUp value={entries} />} />
        <Stat label="Harnesses supported" value={<CountUp value={harnessCount} />} />
        <Stat label="Integrations live" value={<CountUp value={live} />} />
        <Stat
          label="Last build"
          value={new Date(REGISTRY_GENERATED_AT).toISOString().slice(0, 16).replace("T", " ")}
          mono
        />
      </div>

      {/* Sticky sub-nav */}
      <SubNav />

      {/* Integrations (folds consumption surfaces into matching cards) */}
      <Section
        id="integrations"
        title="Integrations"
        subtitle="Clients, adapters, and feeds — plus the surfaces you consume them through."
      >
        <IntegrationsGrid />
      </Section>

      {/* Compatibility matrix */}
      <Section
        id="compatibility"
        title="Platform compatibility"
        subtitle="What each client supports natively, via adapter, or with a manual copy step. Click any cell with a glyph button for the exact snippet."
      >
        <CompatibilityMatrix clients={CLIENTS} rows={MATRIX} details={CELL_DETAILS} />
      </Section>

      {/* Harness coverage */}
      <Section
        id="coverage"
        title="Harness coverage"
        subtitle="Share of registry entries compatible with each harness. Click any card to browse just that harness."
      >
        <HarnessCoverage />
      </Section>

      {/* Drop-in setup */}
      <Section
        id="setup"
        title="Drop-in setup"
        subtitle="Pick your client. Copy the config. Verify with one command."
      >
        <DropInSetup />
      </Section>

      {/* Adapter feeds */}
      <Section
        id="feeds"
        title="Adapter feeds"
        subtitle="Public artifacts every client consumes. Every file ships with a SHA-256 — verify against /api/registry/integrity."
      >
        <AdapterFeeds />
      </Section>

      {/* Sponsors */}
      <Section
        id="sponsors"
        title="Sponsors + partners"
        subtitle="Credits, infra, and services that keep HeyClaude free + source-backed. Sponsorships never influence ranking or trust."
      >
        <SponsorsSection />
      </Section>

      {/* Build on the registry */}
      <section className="mt-16 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="eyebrow">Build on the registry</div>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
              Public REST + MCP, no auth required for reads
            </h3>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Every artifact carries a SHA-256. Use the manifest to pin builds and the diff endpoint
              to stay incremental.
            </p>
          </div>
          <div className="grid w-full max-w-md gap-2">
            <QuickStart
              label="Pin manifest"
              value="curl https://heyclau.de/api/registry/manifest"
            />
            <QuickStart label="Run MCP" value="npx -y @heyclaude/mcp" />
            <QuickStart label="Install Raycast" value="raycast://extensions/jsonbored/heyclaude" />
          </div>
        </div>
      </section>
    </div>
  );
}

function SubNav() {
  const [active, setActive] = React.useState<string>(SUB_NAV[0].id);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    SUB_NAV.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Ecosystem sections"
      className="sticky top-14 z-30 -mx-4 mt-8 border-y border-border bg-background/85 px-4 backdrop-blur sm:-mx-6 sm:px-6"
    >
      <div className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SUB_NAV.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200 ease-out",
              active === s.id
                ? "bg-ink text-background"
                : "text-ink-muted hover:bg-surface-2 hover:text-ink",
            )}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function Section({
  id,
  title,
  subtitle,
  right,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="h-display-2 text-ink text-balance">{title}</h2>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const KIND_LABEL: Record<string, string> = {
  extension: "Extension",
  "mcp-server": "MCP server",
  adapter: "Adapter",
  api: "API",
  feed: "Feed",
  package: "Package",
};

function IntegrationsGrid() {
  const [kind, setKind] = React.useState<string>("all");
  const kinds = Array.from(new Set(INTEGRATIONS.map((i) => i.kind)));
  const list = kind === "all" ? INTEGRATIONS : INTEGRATIONS.filter((i) => i.kind === kind);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <Chip active={kind === "all"} onClick={() => setKind("all")} count={INTEGRATIONS.length}>
          All
        </Chip>
        {kinds.map((k) => (
          <Chip
            key={k}
            active={kind === k}
            onClick={() => setKind(k)}
            count={INTEGRATIONS.filter((i) => i.kind === k).length}
          >
            {KIND_LABEL[k] ?? k}
          </Chip>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((it) => (
          <IntegrationCard key={it.slug} integration={it} />
        ))}
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-200 ease-out",
        active
          ? "border-ink bg-ink text-background"
          : "border-border bg-surface text-ink-muted hover:text-ink",
      )}
    >
      {children}
      {typeof count === "number" && (
        <span
          className={cn("font-mono text-[10px]", active ? "text-background/70" : "text-ink-subtle")}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function AdapterFeeds() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="hidden grid-cols-[1.6fr_2fr_120px_90px_140px_80px] gap-4 border-b border-border bg-surface-2 px-5 py-2 text-[11px] uppercase tracking-wider text-ink-subtle md:grid">
        <span>Path</span>
        <span>Purpose</span>
        <span>Built</span>
        <span className="text-right">Size</span>
        <span>SHA-256</span>
        <span className="text-right">Copy</span>
      </div>
      {ECOSYSTEM_FEEDS.map((f) => (
        <div
          key={f.path}
          className="grid grid-cols-1 gap-2 border-b border-border px-5 py-3 text-sm last:border-0 md:grid-cols-[1.6fr_2fr_120px_90px_140px_80px] md:items-center md:gap-4"
        >
          <div className="flex items-center gap-2">
            <Rss className="h-3 w-3 text-ink-subtle" />
            <a
              href={f.path}
              target="_blank"
              rel="noreferrer"
              className="truncate font-mono text-xs text-ink hover:underline"
            >
              {f.path}
            </a>
          </div>
          <div className="text-xs text-ink-muted">
            {f.purpose}
            <div className="mt-0.5 flex flex-wrap gap-1">
              {f.consumers.map((c) => (
                <span
                  key={c}
                  className="inline-flex rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <span className="font-mono text-xs text-ink-subtle">
            {new Date(f.lastBuilt).toISOString().slice(0, 16).replace("T", " ")}
          </span>
          <span className="text-right font-mono text-xs text-ink-muted">
            {(f.bytes / 1024).toFixed(1)} KB
          </span>
          <code className="truncate font-mono text-xs text-ink-muted">{f.sha256}</code>
          <div className="flex justify-end">
            <CopyButton value={`https://heyclau.de${f.path}`} label="Copy URL" size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickStart({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5">
      <span className="w-[88px] shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
        {label}
      </span>
      <code className="flex-1 truncate font-mono text-[11px] text-ink">{value}</code>
      <CopyButton value={value} label="Copy" size="sm" />
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="h-1.5 w-1.5 rounded-full bg-trust-trusted" />
        <span className="font-mono text-[11px] text-ink-subtle">{label}</span>
      </div>
      <div
        className={cn(
          "mt-3 font-display text-2xl font-semibold tabular-nums text-ink",
          mono && "font-mono text-base font-medium",
        )}
      >
        {value}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Terminal, Command, FileCode } from "lucide-react";
import { CopyButton } from "./copy-button";
import { trackEvent } from "@/lib/analytics";
import {
  agentNativeStripCopyAnalyticsData,
  agentNativeStripCopyAnalyticsEvent,
  agentNativeStripEgressAnalyticsData,
  agentNativeStripEgressAnalyticsEvent,
  agentNativeStripEgressDestination,
  type AgentNativeStripCardId,
  type AgentNativeStripDestination,
} from "@/lib/agent-native-strip-cta-events";

type Card = {
  id: AgentNativeStripCardId;
  destination: AgentNativeStripDestination;
  Icon: typeof Terminal;
  eyebrow: string;
  title: string;
  body: string;
  snippet: string;
  ctaLabel: string;
};

const CARDS: Card[] = [
  {
    id: "mcp",
    destination: "integrations-mcp",
    Icon: Terminal,
    eyebrow: "MCP endpoint",
    title: "Use HeyClaude inside Claude Code",
    body: "Read-only remote MCP server. Search, plan workflows, inspect trust without leaving the agent.",
    snippet: "npx -y heyclaude/mcp",
    ctaLabel: "MCP setup",
  },
  {
    id: "raycast",
    destination: "integrations-raycast",
    Icon: Command,
    eyebrow: "Raycast extension",
    title: "Search from anywhere",
    body: "Copy install commands, configs, and full assets straight from Raycast. Jobs and submissions included.",
    snippet: "raycast://extensions/heyclaude",
    ctaLabel: "Get the extension",
  },
  {
    id: "llms",
    destination: "api-docs",
    Icon: FileCode,
    eyebrow: "llms.txt & JSON feeds",
    title: "Pipe the registry into your agent",
    body: "Full registry as llms-full.txt, plus JSON indices and per-entry artifacts. Stable, hashed, versioned.",
    snippet: "curl heyclau.de/llms-full.txt",
    ctaLabel: "API docs",
  },
];

export function AgentNativeStrip() {
  const ecosystemDestination = agentNativeStripEgressDestination("ecosystem");

  return (
    <section className="mx-auto max-w-page px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Agent-native</div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            One registry, every surface
          </h2>
        </div>
        {ecosystemDestination ? (
          <Link
            to={ecosystemDestination.to}
            className="text-sm text-ink-muted hover:text-ink"
            onClick={() =>
              trackEvent(
                agentNativeStripEgressAnalyticsEvent(),
                agentNativeStripEgressAnalyticsData("ecosystem"),
              )
            }
          >
            All integrations →
          </Link>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {CARDS.map((c) => {
          const routeDestination = agentNativeStripEgressDestination(c.destination);
          return (
            <div
              key={c.id}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs">
                  <c.Icon className="h-3.5 w-3.5 text-ink-muted" />
                  <span className="eyebrow">{c.eyebrow}</span>
                </span>
              </div>
              <div>
                <div className="font-display text-base font-semibold text-ink">{c.title}</div>
                <p className="mt-1.5 text-sm text-ink-muted">{c.body}</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-ink">
                <span className="flex-1 truncate">{c.snippet}</span>
                <CopyButton
                  value={c.snippet}
                  label="Copy"
                  event={agentNativeStripCopyAnalyticsEvent()}
                  eventData={agentNativeStripCopyAnalyticsData(c.id)}
                />
              </div>
              {routeDestination ? (
                <Link
                  to={routeDestination.to}
                  {...("params" in routeDestination ? { params: routeDestination.params } : {})}
                  className="story-link mt-auto inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-ink-hover"
                  onClick={() =>
                    trackEvent(
                      agentNativeStripEgressAnalyticsEvent(),
                      agentNativeStripEgressAnalyticsData(c.destination),
                    )
                  }
                >
                  {c.ctaLabel} <span aria-hidden>→</span>
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

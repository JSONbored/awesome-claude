import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { IntegrationMark, platformMark } from "@/components/integration-marks";
import { cn } from "@/lib/utils";

interface ClientSetup {
  id: string;
  label: string;
  /** What kind of setup this is — drives the helper text. */
  surface: "mcp-host" | "adapter" | "extension" | "web";
  /** The primary install/config payload to copy. */
  snippet: string;
  /** Optional verification snippet shown below. */
  verify?: string;
  /** Optional inline doc link. */
  docUrl?: string;
  /** Short one-line description above the snippet. */
  description: string;
}

const SETUPS: ClientSetup[] = [
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    surface: "mcp-host",
    description: "Add the HeyClaude MCP server to claude_desktop_config.json.",
    snippet: `{
  "mcpServers": {
    "heyclaude": {
      "command": "npx",
      "args": ["-y", "@heyclaude/mcp"]
    }
  }
}`,
    verify: "curl -s https://heyclau.de/api/registry/integrity | jq",
    docUrl: "https://modelcontextprotocol.io/docs/clients/claude-desktop",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    surface: "mcp-host",
    description: "Register the MCP server via the Claude Code CLI.",
    snippet: `claude mcp add heyclaude -- npx -y @heyclaude/mcp`,
    verify: "claude mcp list",
  },
  {
    id: "cursor",
    label: "Cursor",
    surface: "mcp-host",
    description: "Drop into ~/.cursor/mcp.json or your workspace .cursor/ folder.",
    snippet: `{
  "mcpServers": {
    "heyclaude": {
      "command": "npx",
      "args": ["-y", "@heyclaude/mcp"]
    }
  }
}`,
    docUrl: "https://docs.cursor.com/context/model-context-protocol",
  },
  {
    id: "windsurf",
    label: "Windsurf",
    surface: "mcp-host",
    description: "Add to ~/.codeium/windsurf/mcp_config.json.",
    snippet: `{
  "mcpServers": {
    "heyclaude": {
      "command": "npx",
      "args": ["-y", "@heyclaude/mcp"]
    }
  }
}`,
  },
  {
    id: "codex",
    label: "Codex",
    surface: "mcp-host",
    description: "Codex CLI auto-discovers MCP via the OPENAI_MCP_SERVERS env.",
    snippet: `export OPENAI_MCP_SERVERS='[{"name":"heyclaude","command":"npx","args":["-y","@heyclaude/mcp"]}]'`,
  },
  {
    id: "continue",
    label: "Continue",
    surface: "mcp-host",
    description: "Add to ~/.continue/config.yaml under mcpServers.",
    snippet: `mcpServers:
  heyclaude:
    command: npx
    args: ["-y", "@heyclaude/mcp"]`,
  },
  {
    id: "zed",
    label: "Zed",
    surface: "mcp-host",
    description: "Configure via Zed's context_servers block in settings.json.",
    snippet: `"context_servers": {
  "heyclaude": {
    "command": { "path": "npx", "args": ["-y", "@heyclaude/mcp"] }
  }
}`,
  },
  {
    id: "raycast",
    label: "Raycast",
    surface: "extension",
    description: "Install the official Raycast extension.",
    snippet: `raycast://extensions/jsonbored/heyclaude`,
    docUrl: "https://www.raycast.com/jsonbored/heyclaude",
  },
  {
    id: "web",
    label: "Web / REST",
    surface: "web",
    description: "No setup — pin builds with the SHA-256 manifest.",
    snippet: `curl -s https://heyclau.de/api/registry/manifest | jq '.builtAt, .sha256'`,
    docUrl: "/api-docs",
  },
];

const SURFACE_LABEL: Record<ClientSetup["surface"], string> = {
  "mcp-host": "MCP host",
  adapter: "Adapter",
  extension: "Extension",
  web: "Web / API",
};

export function DropInSetup() {
  const [activeId, setActiveId] = React.useState<string>(SETUPS[0].id);
  const active = SETUPS.find((s) => s.id === activeId) ?? SETUPS[0];
  const mark = platformMark(active.id);

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-[220px_1fr]">
      {/* Client picker */}
      <div className="bg-surface">
        <div className="border-b border-border px-4 py-2 text-[11px] uppercase tracking-wider text-ink-subtle">
          Pick your client
        </div>
        <ul className="max-h-[420px] overflow-y-auto md:max-h-none">
          {SETUPS.map((s) => {
            const isActive = s.id === active.id;
            const m = platformMark(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2 border-b border-border px-4 py-2.5 text-left text-sm transition-colors duration-200 ease-out last:border-0",
                    isActive
                      ? "bg-accent/10 text-ink"
                      : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-background",
                      isActive && "border-accent/40",
                    )}
                  >
                    {m && <IntegrationMark name={m} size={12} />}
                  </span>
                  <span className="flex-1 truncate font-medium">{s.label}</span>
                  {isActive && <span className="font-mono text-[10px] text-ink-subtle">●</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Snippet pane */}
      <div className="bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow">{SURFACE_LABEL[active.surface]}</div>
            <h3 className="mt-1 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink">
              {mark && (
                <span className="flex h-6 w-6 items-center justify-center rounded border border-border bg-surface-2">
                  <IntegrationMark name={mark} size={14} />
                </span>
              )}
              {active.label}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">{active.description}</p>
          </div>
          {active.docUrl && (
            <a
              href={active.docUrl}
              target={active.docUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="shrink-0 text-xs font-medium text-ink-muted hover:text-ink"
            >
              Docs →
            </a>
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-border bg-background">
          <pre className="max-h-[260px] overflow-auto p-3 font-mono text-[12px] leading-relaxed text-ink">
            <code>{active.snippet}</code>
          </pre>
          <div className="border-t border-border bg-surface-2 p-2">
            <CopyButton
              value={active.snippet}
              label={`Copy ${active.label} config`}
              size="md"
              className="w-full justify-center"
            />
          </div>
        </div>

        {active.verify && (
          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-wider text-ink-subtle">Verify</div>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2">
              <code className="flex-1 truncate font-mono text-[11px] text-ink">
                {active.verify}
              </code>
              <CopyButton value={active.verify} label="Copy" size="sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

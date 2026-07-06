/**
 * Pure MCP client setup snippets and response envelope.
 *
 * Shared install/setup config shapes live here. Runtime handlers stay in
 * `registry.js`.
 */

export const CLIENT_SETUP_NOTES = [
  "The public endpoint is read-only and does not need an API key.",
  "Submission tools prepare maintainer-reviewed PR-first drafts; they do not open GitHub issues.",
  "Use --url only when testing a custom preview or deployment.",
];

/**
 * Build the full client setup snippet map for a normalized endpoint URL.
 *
 * @param {string} endpointUrl Normalized streamable HTTP endpoint.
 * @returns {Record<string, unknown>}
 */
export function buildClientSetupSnippets(endpointUrl) {
  return {
    codex: {
      label: "Codex stdio bridge",
      config: {
        mcpServers: {
          heyclaude: {
            command: "npx",
            args: ["-y", "@heyclaude/mcp"],
          },
        },
      },
    },
    "claude-desktop": {
      label: "Claude Desktop stdio bridge",
      config: {
        mcpServers: {
          heyclaude: {
            command: "npx",
            args: ["-y", "@heyclaude/mcp"],
          },
        },
      },
    },
    cursor: {
      label: "Cursor remote MCP",
      config: {
        mcpServers: {
          heyclaude: {
            url: endpointUrl,
          },
        },
      },
    },
    windsurf: {
      label: "Windsurf remote MCP",
      config: {
        mcpServers: {
          heyclaude: {
            serverUrl: endpointUrl,
          },
        },
      },
    },
    "remote-http": {
      label: "Streamable HTTP endpoint",
      endpointUrl,
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
      },
    },
  };
}

/** @type {typeof buildClientSetupSnippets} */
export const CLIENT_SETUP_SNIPPETS = buildClientSetupSnippets;

/**
 * Build the ok envelope for install.setup.
 *
 * @param {{ endpointUrl: string, client?: string }} params
 * @returns {{
 *   ok: true,
 *   endpointUrl: string,
 *   apiKeyRequired: false,
 *   selectedClient: string,
 *   snippets: Record<string, unknown>,
 *   notes: string[],
 * }}
 */
export function buildClientSetupResponse({ endpointUrl, client = "" }) {
  const snippets = buildClientSetupSnippets(endpointUrl);
  return {
    ok: true,
    endpointUrl,
    apiKeyRequired: false,
    selectedClient: client,
    snippets: client ? { [client]: snippets[client] } : snippets,
    notes: CLIENT_SETUP_NOTES,
  };
}

// Keep this Worker-safe: Cloudflare's bundle loader rejects runtime
// package.json specifiers inside the SSR/MCP route bundle.
export const packageName = "@heyclaude/mcp";
export const packageVersion = "0.5.3"; // x-release-please-version

import { describe, expect, it } from "vitest";

import {
  isValidEntryKey,
  getFallbackVoteCounts,
  getFallbackClientVotes,
} from "../apps/web/src/lib/votes-lib";

describe("votes-lib isValidEntryKey", () => {
  it("accepts category:slug keys with lowercase alphanumeric hyphen segments", () => {
    expect(isValidEntryKey("mcp:browser-bridge")).toBe(true);
    expect(isValidEntryKey("skills:demo-skill")).toBe(true);
    expect(isValidEntryKey("agents:agent-1")).toBe(true);
  });
  it("rejects malformed keys", () => {
    expect(isValidEntryKey("")).toBe(false);
    expect(isValidEntryKey("mcp")).toBe(false);
    expect(isValidEntryKey("mcp:")).toBe(false);
    expect(isValidEntryKey(":slug")).toBe(false);
    expect(isValidEntryKey("MCP:browser-bridge")).toBe(false);
    expect(isValidEntryKey("mcp:Browser-Bridge")).toBe(false);
    expect(isValidEntryKey("mcp/browser-bridge")).toBe(false);
  });

  it("isValidEntryKey accepts agents:agents-vote-0", () => {
    expect(isValidEntryKey("agents:agents-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-0", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-0")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-1", () => {
    expect(isValidEntryKey("agents:agents-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-1", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-1")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-2", () => {
    expect(isValidEntryKey("agents:agents-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-2", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-2")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-3", () => {
    expect(isValidEntryKey("agents:agents-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-3", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-3")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-4", () => {
    expect(isValidEntryKey("agents:agents-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-4", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-4")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-5", () => {
    expect(isValidEntryKey("agents:agents-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-5", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-5")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-6", () => {
    expect(isValidEntryKey("agents:agents-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-6", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-6")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-7", () => {
    expect(isValidEntryKey("agents:agents-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-7", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-7")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-8", () => {
    expect(isValidEntryKey("agents:agents-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-8", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-8")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts agents:agents-vote-9", () => {
    expect(isValidEntryKey("agents:agents-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase agents:agents-vote-9", () => {
    expect(isValidEntryKey("AGENTS:agents-vote-9")).toBe(false);
    expect(isValidEntryKey("agents:AGENTS-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-0", () => {
    expect(isValidEntryKey("mcp:mcp-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-0", () => {
    expect(isValidEntryKey("MCP:mcp-vote-0")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-1", () => {
    expect(isValidEntryKey("mcp:mcp-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-1", () => {
    expect(isValidEntryKey("MCP:mcp-vote-1")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-2", () => {
    expect(isValidEntryKey("mcp:mcp-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-2", () => {
    expect(isValidEntryKey("MCP:mcp-vote-2")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-3", () => {
    expect(isValidEntryKey("mcp:mcp-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-3", () => {
    expect(isValidEntryKey("MCP:mcp-vote-3")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-4", () => {
    expect(isValidEntryKey("mcp:mcp-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-4", () => {
    expect(isValidEntryKey("MCP:mcp-vote-4")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-5", () => {
    expect(isValidEntryKey("mcp:mcp-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-5", () => {
    expect(isValidEntryKey("MCP:mcp-vote-5")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-6", () => {
    expect(isValidEntryKey("mcp:mcp-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-6", () => {
    expect(isValidEntryKey("MCP:mcp-vote-6")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-7", () => {
    expect(isValidEntryKey("mcp:mcp-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-7", () => {
    expect(isValidEntryKey("MCP:mcp-vote-7")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-8", () => {
    expect(isValidEntryKey("mcp:mcp-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-8", () => {
    expect(isValidEntryKey("MCP:mcp-vote-8")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts mcp:mcp-vote-9", () => {
    expect(isValidEntryKey("mcp:mcp-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase mcp:mcp-vote-9", () => {
    expect(isValidEntryKey("MCP:mcp-vote-9")).toBe(false);
    expect(isValidEntryKey("mcp:MCP-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-0", () => {
    expect(isValidEntryKey("tools:tools-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-0", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-0")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-1", () => {
    expect(isValidEntryKey("tools:tools-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-1", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-1")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-2", () => {
    expect(isValidEntryKey("tools:tools-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-2", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-2")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-3", () => {
    expect(isValidEntryKey("tools:tools-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-3", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-3")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-4", () => {
    expect(isValidEntryKey("tools:tools-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-4", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-4")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-5", () => {
    expect(isValidEntryKey("tools:tools-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-5", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-5")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-6", () => {
    expect(isValidEntryKey("tools:tools-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-6", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-6")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-7", () => {
    expect(isValidEntryKey("tools:tools-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-7", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-7")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-8", () => {
    expect(isValidEntryKey("tools:tools-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-8", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-8")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts tools:tools-vote-9", () => {
    expect(isValidEntryKey("tools:tools-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase tools:tools-vote-9", () => {
    expect(isValidEntryKey("TOOLS:tools-vote-9")).toBe(false);
    expect(isValidEntryKey("tools:TOOLS-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-0", () => {
    expect(isValidEntryKey("skills:skills-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-0", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-0")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-1", () => {
    expect(isValidEntryKey("skills:skills-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-1", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-1")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-2", () => {
    expect(isValidEntryKey("skills:skills-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-2", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-2")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-3", () => {
    expect(isValidEntryKey("skills:skills-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-3", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-3")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-4", () => {
    expect(isValidEntryKey("skills:skills-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-4", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-4")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-5", () => {
    expect(isValidEntryKey("skills:skills-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-5", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-5")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-6", () => {
    expect(isValidEntryKey("skills:skills-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-6", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-6")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-7", () => {
    expect(isValidEntryKey("skills:skills-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-7", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-7")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-8", () => {
    expect(isValidEntryKey("skills:skills-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-8", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-8")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts skills:skills-vote-9", () => {
    expect(isValidEntryKey("skills:skills-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase skills:skills-vote-9", () => {
    expect(isValidEntryKey("SKILLS:skills-vote-9")).toBe(false);
    expect(isValidEntryKey("skills:SKILLS-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-0", () => {
    expect(isValidEntryKey("rules:rules-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-0", () => {
    expect(isValidEntryKey("RULES:rules-vote-0")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-1", () => {
    expect(isValidEntryKey("rules:rules-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-1", () => {
    expect(isValidEntryKey("RULES:rules-vote-1")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-2", () => {
    expect(isValidEntryKey("rules:rules-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-2", () => {
    expect(isValidEntryKey("RULES:rules-vote-2")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-3", () => {
    expect(isValidEntryKey("rules:rules-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-3", () => {
    expect(isValidEntryKey("RULES:rules-vote-3")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-4", () => {
    expect(isValidEntryKey("rules:rules-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-4", () => {
    expect(isValidEntryKey("RULES:rules-vote-4")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-5", () => {
    expect(isValidEntryKey("rules:rules-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-5", () => {
    expect(isValidEntryKey("RULES:rules-vote-5")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-6", () => {
    expect(isValidEntryKey("rules:rules-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-6", () => {
    expect(isValidEntryKey("RULES:rules-vote-6")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-7", () => {
    expect(isValidEntryKey("rules:rules-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-7", () => {
    expect(isValidEntryKey("RULES:rules-vote-7")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-8", () => {
    expect(isValidEntryKey("rules:rules-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-8", () => {
    expect(isValidEntryKey("RULES:rules-vote-8")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts rules:rules-vote-9", () => {
    expect(isValidEntryKey("rules:rules-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase rules:rules-vote-9", () => {
    expect(isValidEntryKey("RULES:rules-vote-9")).toBe(false);
    expect(isValidEntryKey("rules:RULES-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-0", () => {
    expect(isValidEntryKey("commands:commands-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-0", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-0")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-1", () => {
    expect(isValidEntryKey("commands:commands-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-1", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-1")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-2", () => {
    expect(isValidEntryKey("commands:commands-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-2", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-2")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-3", () => {
    expect(isValidEntryKey("commands:commands-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-3", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-3")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-4", () => {
    expect(isValidEntryKey("commands:commands-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-4", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-4")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-5", () => {
    expect(isValidEntryKey("commands:commands-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-5", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-5")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-6", () => {
    expect(isValidEntryKey("commands:commands-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-6", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-6")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-7", () => {
    expect(isValidEntryKey("commands:commands-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-7", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-7")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-8", () => {
    expect(isValidEntryKey("commands:commands-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-8", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-8")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts commands:commands-vote-9", () => {
    expect(isValidEntryKey("commands:commands-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase commands:commands-vote-9", () => {
    expect(isValidEntryKey("COMMANDS:commands-vote-9")).toBe(false);
    expect(isValidEntryKey("commands:COMMANDS-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-0", () => {
    expect(isValidEntryKey("hooks:hooks-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-0", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-0")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-1", () => {
    expect(isValidEntryKey("hooks:hooks-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-1", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-1")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-2", () => {
    expect(isValidEntryKey("hooks:hooks-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-2", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-2")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-3", () => {
    expect(isValidEntryKey("hooks:hooks-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-3", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-3")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-4", () => {
    expect(isValidEntryKey("hooks:hooks-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-4", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-4")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-5", () => {
    expect(isValidEntryKey("hooks:hooks-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-5", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-5")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-6", () => {
    expect(isValidEntryKey("hooks:hooks-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-6", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-6")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-7", () => {
    expect(isValidEntryKey("hooks:hooks-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-7", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-7")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-8", () => {
    expect(isValidEntryKey("hooks:hooks-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-8", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-8")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts hooks:hooks-vote-9", () => {
    expect(isValidEntryKey("hooks:hooks-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase hooks:hooks-vote-9", () => {
    expect(isValidEntryKey("HOOKS:hooks-vote-9")).toBe(false);
    expect(isValidEntryKey("hooks:HOOKS-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-0", () => {
    expect(isValidEntryKey("guides:guides-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-0", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-0")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-1", () => {
    expect(isValidEntryKey("guides:guides-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-1", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-1")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-2", () => {
    expect(isValidEntryKey("guides:guides-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-2", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-2")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-3", () => {
    expect(isValidEntryKey("guides:guides-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-3", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-3")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-4", () => {
    expect(isValidEntryKey("guides:guides-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-4", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-4")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-5", () => {
    expect(isValidEntryKey("guides:guides-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-5", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-5")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-6", () => {
    expect(isValidEntryKey("guides:guides-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-6", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-6")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-7", () => {
    expect(isValidEntryKey("guides:guides-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-7", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-7")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-8", () => {
    expect(isValidEntryKey("guides:guides-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-8", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-8")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts guides:guides-vote-9", () => {
    expect(isValidEntryKey("guides:guides-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase guides:guides-vote-9", () => {
    expect(isValidEntryKey("GUIDES:guides-vote-9")).toBe(false);
    expect(isValidEntryKey("guides:GUIDES-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-0", () => {
    expect(isValidEntryKey("collections:collections-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-0", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-0")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-1", () => {
    expect(isValidEntryKey("collections:collections-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-1", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-1")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-2", () => {
    expect(isValidEntryKey("collections:collections-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-2", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-2")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-3", () => {
    expect(isValidEntryKey("collections:collections-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-3", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-3")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-4", () => {
    expect(isValidEntryKey("collections:collections-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-4", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-4")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-5", () => {
    expect(isValidEntryKey("collections:collections-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-5", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-5")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-6", () => {
    expect(isValidEntryKey("collections:collections-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-6", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-6")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-7", () => {
    expect(isValidEntryKey("collections:collections-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-7", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-7")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-8", () => {
    expect(isValidEntryKey("collections:collections-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-8", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-8")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts collections:collections-vote-9", () => {
    expect(isValidEntryKey("collections:collections-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase collections:collections-vote-9", () => {
    expect(isValidEntryKey("COLLECTIONS:collections-vote-9")).toBe(false);
    expect(isValidEntryKey("collections:COLLECTIONS-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-0", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-0")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-0", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-0")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-0")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-1", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-1")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-1", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-1")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-1")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-2", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-2")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-2", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-2")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-2")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-3", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-3")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-3", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-3")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-3")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-4", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-4")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-4", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-4")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-4")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-5", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-5")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-5", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-5")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-5")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-6", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-6")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-6", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-6")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-6")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-7", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-7")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-7", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-7")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-7")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-8", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-8")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-8", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-8")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-8")).toBe(false);
  });
  it("isValidEntryKey accepts statuslines:statuslines-vote-9", () => {
    expect(isValidEntryKey("statuslines:statuslines-vote-9")).toBe(true);
  });
  it("isValidEntryKey rejects uppercase statuslines:statuslines-vote-9", () => {
    expect(isValidEntryKey("STATUSLINES:statuslines-vote-9")).toBe(false);
    expect(isValidEntryKey("statuslines:STATUSLINES-VOTE-9")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:under_score", () => {
    expect(isValidEntryKey("mcp:under_score")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:dot.name", () => {
    expect(isValidEntryKey("mcp:dot.name")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:space name", () => {
    expect(isValidEntryKey("mcp:space name")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:emoji-??", () => {
    expect(isValidEntryKey("mcp:emoji-🔥")).toBe(false);
  });
  it("isValidEntryKey rejects under_score:slug", () => {
    expect(isValidEntryKey("under_score:slug")).toBe(false);
  });
  it("isValidEntryKey rejects dot.name:slug", () => {
    expect(isValidEntryKey("dot.name:slug")).toBe(false);
  });
  it("isValidEntryKey rejects space name:slug", () => {
    expect(isValidEntryKey("space name:slug")).toBe(false);
  });
  it("isValidEntryKey rejects mcp::double", () => {
    expect(isValidEntryKey("mcp::double")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug:extra", () => {
    expect(isValidEntryKey("mcp:slug:extra")).toBe(false);
  });
  it("isValidEntryKey rejects mcp\\:slug", () => {
    expect(isValidEntryKey("mcp\\:slug")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\", () => {
    expect(isValidEntryKey("mcp:slug\\")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug/", () => {
    expect(isValidEntryKey("mcp:slug/")).toBe(false);
  });
  it("isValidEntryKey rejects mcp/slug", () => {
    expect(isValidEntryKey("mcp/slug")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug/nested", () => {
    expect(isValidEntryKey("mcp:slug/nested")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug?query=1", () => {
    expect(isValidEntryKey("mcp:slug?query=1")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug#fragment", () => {
    expect(isValidEntryKey("mcp:slug#fragment")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug&param=1", () => {
    expect(isValidEntryKey("mcp:slug&param=1")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug=value", () => {
    expect(isValidEntryKey("mcp:slug=value")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug+plus", () => {
    expect(isValidEntryKey("mcp:slug+plus")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug%20encoded", () => {
    expect(isValidEntryKey("mcp:slug%20encoded")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug@at", () => {
    expect(isValidEntryKey("mcp:slug@at")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug!bang", () => {
    expect(isValidEntryKey("mcp:slug!bang")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug$dollar", () => {
    expect(isValidEntryKey("mcp:slug$dollar")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug^caret", () => {
    expect(isValidEntryKey("mcp:slug^caret")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug*star", () => {
    expect(isValidEntryKey("mcp:slug*star")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug(paren)", () => {
    expect(isValidEntryKey("mcp:slug(paren)")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug[bracket]", () => {
    expect(isValidEntryKey("mcp:slug[bracket]")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug{brace}", () => {
    expect(isValidEntryKey("mcp:slug{brace}")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug'quote", () => {
    expect(isValidEntryKey("mcp:slug'quote")).toBe(false);
  });
  it('isValidEntryKey rejects mcp:slug"quote', () => {
    expect(isValidEntryKey('mcp:slug"quote')).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug;semi", () => {
    expect(isValidEntryKey("mcp:slug;semi")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug,comma", () => {
    expect(isValidEntryKey("mcp:slug,comma")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug<lt", () => {
    expect(isValidEntryKey("mcp:slug<lt")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug>gt", () => {
    expect(isValidEntryKey("mcp:slug>gt")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug|pipe", () => {
    expect(isValidEntryKey("mcp:slug|pipe")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\\\backslash", () => {
    expect(isValidEntryKey("mcp:slug\\\\backslash")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug~tilde", () => {
    expect(isValidEntryKey("mcp:slug~tilde")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug`backtick", () => {
    expect(isValidEntryKey("mcp:slug`backtick")).toBe(false);
  });
  it("isValidEntryKey rejects NaN:NaN", () => {
    expect(isValidEntryKey("NaN:NaN")).toBe(false);
  });
  it("isValidEntryKey rejects Infinity:Infinity", () => {
    expect(isValidEntryKey("Infinity:Infinity")).toBe(false);
  });
  it("isValidEntryKey rejects []:[]", () => {
    expect(isValidEntryKey("[]:[]")).toBe(false);
  });
  it("isValidEntryKey rejects {}:{}", () => {
    expect(isValidEntryKey("{}:{}")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:", () => {
    expect(isValidEntryKey("mcp:")).toBe(false);
  });
  it("isValidEntryKey rejects :mcp", () => {
    expect(isValidEntryKey(":mcp")).toBe(false);
  });
  it("isValidEntryKey rejects ::", () => {
    expect(isValidEntryKey("::")).toBe(false);
  });
  it("isValidEntryKey rejects :::", () => {
    expect(isValidEntryKey(":::")).toBe(false);
  });
  it("isValidEntryKey rejects ::::", () => {
    expect(isValidEntryKey("::::")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug extra", () => {
    expect(isValidEntryKey("mcp:slug extra")).toBe(false);
  });
  it("isValidEntryKey rejects mcp extra:slug", () => {
    expect(isValidEntryKey("mcp extra:slug")).toBe(false);
  });
  it("isValidEntryKey rejects mcp extra:slug extra", () => {
    expect(isValidEntryKey("mcp extra:slug extra")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\nnewline", () => {
    expect(isValidEntryKey("mcp:slug\\nnewline")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\rreturn", () => {
    expect(isValidEntryKey("mcp:slug\\rreturn")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\ttab", () => {
    expect(isValidEntryKey("mcp:slug\\ttab")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\0null", () => {
    expect(isValidEntryKey("mcp:slug\\0null")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u0000null", () => {
    expect(isValidEntryKey("mcp:slug\\u0000null")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2028line", () => {
    expect(isValidEntryKey("mcp:slug\\u2028line")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2029para", () => {
    expect(isValidEntryKey("mcp:slug\\u2029para")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\uFEFFbom", () => {
    expect(isValidEntryKey("mcp:slug\\uFEFFbom")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u200Bzwsp", () => {
    expect(isValidEntryKey("mcp:slug\\u200Bzwsp")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u200Czwnj", () => {
    expect(isValidEntryKey("mcp:slug\\u200Czwnj")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u200Dzwj", () => {
    expect(isValidEntryKey("mcp:slug\\u200Dzwj")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2060wjoin", () => {
    expect(isValidEntryKey("mcp:slug\\u2060wjoin")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u00A0nbsp", () => {
    expect(isValidEntryKey("mcp:slug\\u00A0nbsp")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u1680ogham", () => {
    expect(isValidEntryKey("mcp:slug\\u1680ogham")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2000enquad", () => {
    expect(isValidEntryKey("mcp:slug\\u2000enquad")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2001emquad", () => {
    expect(isValidEntryKey("mcp:slug\\u2001emquad")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2002enspace", () => {
    expect(isValidEntryKey("mcp:slug\\u2002enspace")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2003emspace", () => {
    expect(isValidEntryKey("mcp:slug\\u2003emspace")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2004threeperem", () => {
    expect(isValidEntryKey("mcp:slug\\u2004threeperem")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2005fourperem", () => {
    expect(isValidEntryKey("mcp:slug\\u2005fourperem")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2006sixperem", () => {
    expect(isValidEntryKey("mcp:slug\\u2006sixperem")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2007figure", () => {
    expect(isValidEntryKey("mcp:slug\\u2007figure")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2008punctuation", () => {
    expect(isValidEntryKey("mcp:slug\\u2008punctuation")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u2009thin", () => {
    expect(isValidEntryKey("mcp:slug\\u2009thin")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u200Ahair", () => {
    expect(isValidEntryKey("mcp:slug\\u200Ahair")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u202Fnarrow", () => {
    expect(isValidEntryKey("mcp:slug\\u202Fnarrow")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u205Fmedium", () => {
    expect(isValidEntryKey("mcp:slug\\u205Fmedium")).toBe(false);
  });
  it("isValidEntryKey rejects mcp:slug\\u3000ideographic", () => {
    expect(isValidEntryKey("mcp:slug\\u3000ideographic")).toBe(false);
  });
  it("isValidEntryKey accepts edge-valid mcp:-leading", () => {
    expect(isValidEntryKey("mcp:-leading")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid mcp:trailing-", () => {
    expect(isValidEntryKey("mcp:trailing-")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid mcp:double--dash", () => {
    expect(isValidEntryKey("mcp:double--dash")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid -leading:slug", () => {
    expect(isValidEntryKey("-leading:slug")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid trailing-:slug", () => {
    expect(isValidEntryKey("trailing-:slug")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid 123:456", () => {
    expect(isValidEntryKey("123:456")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid a:b", () => {
    expect(isValidEntryKey("a:b")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid a:bc", () => {
    expect(isValidEntryKey("a:bc")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid ab:c", () => {
    expect(isValidEntryKey("ab:c")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid abc:def", () => {
    expect(isValidEntryKey("abc:def")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid null:null", () => {
    expect(isValidEntryKey("null:null")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid undefined:undefined", () => {
    expect(isValidEntryKey("undefined:undefined")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid true:false", () => {
    expect(isValidEntryKey("true:false")).toBe(true);
  });
  it("isValidEntryKey accepts edge-valid abc:def-ghi-jkl-mno-pqr-stu-vw", () => {
    expect(
      isValidEntryKey("abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-0123456789"),
    ).toBe(true);
  });
  it("isValidEntryKey roundtrip matrix 0", () => {
    const key = "cat-0:slug-0";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 1", () => {
    const key = "cat-1:slug-1";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 2", () => {
    const key = "cat-2:slug-2";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 3", () => {
    const key = "cat-3:slug-3";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 4", () => {
    const key = "cat-4:slug-4";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 5", () => {
    const key = "cat-5:slug-5";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 6", () => {
    const key = "cat-6:slug-6";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 7", () => {
    const key = "cat-7:slug-7";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 8", () => {
    const key = "cat-8:slug-8";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 9", () => {
    const key = "cat-9:slug-9";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 10", () => {
    const key = "cat-0:slug-10";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 11", () => {
    const key = "cat-1:slug-11";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 12", () => {
    const key = "cat-2:slug-12";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 13", () => {
    const key = "cat-3:slug-13";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 14", () => {
    const key = "cat-4:slug-14";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 15", () => {
    const key = "cat-5:slug-15";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 16", () => {
    const key = "cat-6:slug-16";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 17", () => {
    const key = "cat-7:slug-17";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 18", () => {
    const key = "cat-8:slug-18";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 19", () => {
    const key = "cat-9:slug-19";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 20", () => {
    const key = "cat-0:slug-20";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 21", () => {
    const key = "cat-1:slug-21";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 22", () => {
    const key = "cat-2:slug-22";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 23", () => {
    const key = "cat-3:slug-23";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 24", () => {
    const key = "cat-4:slug-24";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 25", () => {
    const key = "cat-5:slug-25";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 26", () => {
    const key = "cat-6:slug-26";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 27", () => {
    const key = "cat-7:slug-27";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 28", () => {
    const key = "cat-8:slug-28";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 29", () => {
    const key = "cat-9:slug-29";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 30", () => {
    const key = "cat-0:slug-30";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 31", () => {
    const key = "cat-1:slug-31";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 32", () => {
    const key = "cat-2:slug-32";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 33", () => {
    const key = "cat-3:slug-33";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 34", () => {
    const key = "cat-4:slug-34";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 35", () => {
    const key = "cat-5:slug-35";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 36", () => {
    const key = "cat-6:slug-36";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 37", () => {
    const key = "cat-7:slug-37";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 38", () => {
    const key = "cat-8:slug-38";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 39", () => {
    const key = "cat-9:slug-39";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 40", () => {
    const key = "cat-0:slug-40";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 41", () => {
    const key = "cat-1:slug-41";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 42", () => {
    const key = "cat-2:slug-42";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 43", () => {
    const key = "cat-3:slug-43";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 44", () => {
    const key = "cat-4:slug-44";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 45", () => {
    const key = "cat-5:slug-45";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 46", () => {
    const key = "cat-6:slug-46";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 47", () => {
    const key = "cat-7:slug-47";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 48", () => {
    const key = "cat-8:slug-48";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 49", () => {
    const key = "cat-9:slug-49";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 50", () => {
    const key = "cat-0:slug-50";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 51", () => {
    const key = "cat-1:slug-51";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 52", () => {
    const key = "cat-2:slug-52";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 53", () => {
    const key = "cat-3:slug-53";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 54", () => {
    const key = "cat-4:slug-54";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 55", () => {
    const key = "cat-5:slug-55";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 56", () => {
    const key = "cat-6:slug-56";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 57", () => {
    const key = "cat-7:slug-57";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 58", () => {
    const key = "cat-8:slug-58";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 59", () => {
    const key = "cat-9:slug-59";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 60", () => {
    const key = "cat-0:slug-60";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 61", () => {
    const key = "cat-1:slug-61";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 62", () => {
    const key = "cat-2:slug-62";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 63", () => {
    const key = "cat-3:slug-63";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 64", () => {
    const key = "cat-4:slug-64";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 65", () => {
    const key = "cat-5:slug-65";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 66", () => {
    const key = "cat-6:slug-66";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 67", () => {
    const key = "cat-7:slug-67";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 68", () => {
    const key = "cat-8:slug-68";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 69", () => {
    const key = "cat-9:slug-69";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 70", () => {
    const key = "cat-0:slug-70";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 71", () => {
    const key = "cat-1:slug-71";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 72", () => {
    const key = "cat-2:slug-72";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 73", () => {
    const key = "cat-3:slug-73";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 74", () => {
    const key = "cat-4:slug-74";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 75", () => {
    const key = "cat-5:slug-75";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 76", () => {
    const key = "cat-6:slug-76";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 77", () => {
    const key = "cat-7:slug-77";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 78", () => {
    const key = "cat-8:slug-78";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
  it("isValidEntryKey roundtrip matrix 79", () => {
    const key = "cat-9:slug-79";
    expect(isValidEntryKey(key)).toBe(true);
    expect(isValidEntryKey(key.toUpperCase())).toBe(false);
  });
});

describe("votes-lib getFallbackVoteCounts", () => {
  it("returns zero counts for every key", () => {
    expect(getFallbackVoteCounts(["mcp:a", "skills:b"])).toEqual({
      "mcp:a": 0,
      "skills:b": 0,
    });
  });
  it("returns empty object for empty keys", () => {
    expect(getFallbackVoteCounts([])).toEqual({});
  });

  it("getFallbackVoteCounts agents:agents-count-0", () => {
    const keys = ["agents:agents-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-0": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-1", () => {
    const keys = ["agents:agents-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-1": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-2", () => {
    const keys = ["agents:agents-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-2": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-3", () => {
    const keys = ["agents:agents-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-3": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-4", () => {
    const keys = ["agents:agents-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-4": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-5", () => {
    const keys = ["agents:agents-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-5": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-6", () => {
    const keys = ["agents:agents-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-6": 0 });
  });
  it("getFallbackVoteCounts agents:agents-count-7", () => {
    const keys = ["agents:agents-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "agents:agents-count-7": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-0", () => {
    const keys = ["mcp:mcp-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-0": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-1", () => {
    const keys = ["mcp:mcp-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-1": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-2", () => {
    const keys = ["mcp:mcp-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-2": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-3", () => {
    const keys = ["mcp:mcp-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-3": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-4", () => {
    const keys = ["mcp:mcp-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-4": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-5", () => {
    const keys = ["mcp:mcp-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-5": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-6", () => {
    const keys = ["mcp:mcp-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-6": 0 });
  });
  it("getFallbackVoteCounts mcp:mcp-count-7", () => {
    const keys = ["mcp:mcp-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "mcp:mcp-count-7": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-0", () => {
    const keys = ["tools:tools-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-0": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-1", () => {
    const keys = ["tools:tools-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-1": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-2", () => {
    const keys = ["tools:tools-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-2": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-3", () => {
    const keys = ["tools:tools-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-3": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-4", () => {
    const keys = ["tools:tools-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-4": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-5", () => {
    const keys = ["tools:tools-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-5": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-6", () => {
    const keys = ["tools:tools-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-6": 0 });
  });
  it("getFallbackVoteCounts tools:tools-count-7", () => {
    const keys = ["tools:tools-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "tools:tools-count-7": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-0", () => {
    const keys = ["skills:skills-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-0": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-1", () => {
    const keys = ["skills:skills-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-1": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-2", () => {
    const keys = ["skills:skills-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-2": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-3", () => {
    const keys = ["skills:skills-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-3": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-4", () => {
    const keys = ["skills:skills-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-4": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-5", () => {
    const keys = ["skills:skills-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-5": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-6", () => {
    const keys = ["skills:skills-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-6": 0 });
  });
  it("getFallbackVoteCounts skills:skills-count-7", () => {
    const keys = ["skills:skills-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "skills:skills-count-7": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-0", () => {
    const keys = ["rules:rules-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-0": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-1", () => {
    const keys = ["rules:rules-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-1": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-2", () => {
    const keys = ["rules:rules-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-2": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-3", () => {
    const keys = ["rules:rules-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-3": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-4", () => {
    const keys = ["rules:rules-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-4": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-5", () => {
    const keys = ["rules:rules-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-5": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-6", () => {
    const keys = ["rules:rules-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-6": 0 });
  });
  it("getFallbackVoteCounts rules:rules-count-7", () => {
    const keys = ["rules:rules-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "rules:rules-count-7": 0 });
  });
  it("getFallbackVoteCounts commands:commands-count-0", () => {
    const keys = ["commands:commands-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-0": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-1", () => {
    const keys = ["commands:commands-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-1": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-2", () => {
    const keys = ["commands:commands-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-2": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-3", () => {
    const keys = ["commands:commands-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-3": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-4", () => {
    const keys = ["commands:commands-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-4": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-5", () => {
    const keys = ["commands:commands-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-5": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-6", () => {
    const keys = ["commands:commands-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-6": 0,
    });
  });
  it("getFallbackVoteCounts commands:commands-count-7", () => {
    const keys = ["commands:commands-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "commands:commands-count-7": 0,
    });
  });
  it("getFallbackVoteCounts hooks:hooks-count-0", () => {
    const keys = ["hooks:hooks-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-0": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-1", () => {
    const keys = ["hooks:hooks-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-1": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-2", () => {
    const keys = ["hooks:hooks-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-2": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-3", () => {
    const keys = ["hooks:hooks-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-3": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-4", () => {
    const keys = ["hooks:hooks-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-4": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-5", () => {
    const keys = ["hooks:hooks-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-5": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-6", () => {
    const keys = ["hooks:hooks-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-6": 0 });
  });
  it("getFallbackVoteCounts hooks:hooks-count-7", () => {
    const keys = ["hooks:hooks-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "hooks:hooks-count-7": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-0", () => {
    const keys = ["guides:guides-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-0": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-1", () => {
    const keys = ["guides:guides-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-1": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-2", () => {
    const keys = ["guides:guides-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-2": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-3", () => {
    const keys = ["guides:guides-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-3": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-4", () => {
    const keys = ["guides:guides-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-4": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-5", () => {
    const keys = ["guides:guides-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-5": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-6", () => {
    const keys = ["guides:guides-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-6": 0 });
  });
  it("getFallbackVoteCounts guides:guides-count-7", () => {
    const keys = ["guides:guides-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({ "guides:guides-count-7": 0 });
  });
  it("getFallbackVoteCounts collections:collections-count-0", () => {
    const keys = ["collections:collections-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-0": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-1", () => {
    const keys = ["collections:collections-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-1": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-2", () => {
    const keys = ["collections:collections-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-2": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-3", () => {
    const keys = ["collections:collections-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-3": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-4", () => {
    const keys = ["collections:collections-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-4": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-5", () => {
    const keys = ["collections:collections-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-5": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-6", () => {
    const keys = ["collections:collections-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-6": 0,
    });
  });
  it("getFallbackVoteCounts collections:collections-count-7", () => {
    const keys = ["collections:collections-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "collections:collections-count-7": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-0", () => {
    const keys = ["statuslines:statuslines-count-0"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-0": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-1", () => {
    const keys = ["statuslines:statuslines-count-1"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-1": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-2", () => {
    const keys = ["statuslines:statuslines-count-2"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-2": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-3", () => {
    const keys = ["statuslines:statuslines-count-3"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-3": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-4", () => {
    const keys = ["statuslines:statuslines-count-4"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-4": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-5", () => {
    const keys = ["statuslines:statuslines-count-5"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-5": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-6", () => {
    const keys = ["statuslines:statuslines-count-6"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-6": 0,
    });
  });
  it("getFallbackVoteCounts statuslines:statuslines-count-7", () => {
    const keys = ["statuslines:statuslines-count-7"];
    expect(getFallbackVoteCounts(keys)).toEqual({
      "statuslines:statuslines-count-7": 0,
    });
  });
  it("getFallbackVoteCounts batch 0", () => {
    const keys = ["mcp:batch-0-a", "skills:batch-0-b", "hooks:batch-0-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 1", () => {
    const keys = ["mcp:batch-1-a", "skills:batch-1-b", "hooks:batch-1-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 2", () => {
    const keys = ["mcp:batch-2-a", "skills:batch-2-b", "hooks:batch-2-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 3", () => {
    const keys = ["mcp:batch-3-a", "skills:batch-3-b", "hooks:batch-3-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 4", () => {
    const keys = ["mcp:batch-4-a", "skills:batch-4-b", "hooks:batch-4-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 5", () => {
    const keys = ["mcp:batch-5-a", "skills:batch-5-b", "hooks:batch-5-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 6", () => {
    const keys = ["mcp:batch-6-a", "skills:batch-6-b", "hooks:batch-6-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 7", () => {
    const keys = ["mcp:batch-7-a", "skills:batch-7-b", "hooks:batch-7-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 8", () => {
    const keys = ["mcp:batch-8-a", "skills:batch-8-b", "hooks:batch-8-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 9", () => {
    const keys = ["mcp:batch-9-a", "skills:batch-9-b", "hooks:batch-9-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 10", () => {
    const keys = ["mcp:batch-10-a", "skills:batch-10-b", "hooks:batch-10-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 11", () => {
    const keys = ["mcp:batch-11-a", "skills:batch-11-b", "hooks:batch-11-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 12", () => {
    const keys = ["mcp:batch-12-a", "skills:batch-12-b", "hooks:batch-12-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 13", () => {
    const keys = ["mcp:batch-13-a", "skills:batch-13-b", "hooks:batch-13-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 14", () => {
    const keys = ["mcp:batch-14-a", "skills:batch-14-b", "hooks:batch-14-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 15", () => {
    const keys = ["mcp:batch-15-a", "skills:batch-15-b", "hooks:batch-15-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 16", () => {
    const keys = ["mcp:batch-16-a", "skills:batch-16-b", "hooks:batch-16-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 17", () => {
    const keys = ["mcp:batch-17-a", "skills:batch-17-b", "hooks:batch-17-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 18", () => {
    const keys = ["mcp:batch-18-a", "skills:batch-18-b", "hooks:batch-18-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 19", () => {
    const keys = ["mcp:batch-19-a", "skills:batch-19-b", "hooks:batch-19-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 20", () => {
    const keys = ["mcp:batch-20-a", "skills:batch-20-b", "hooks:batch-20-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 21", () => {
    const keys = ["mcp:batch-21-a", "skills:batch-21-b", "hooks:batch-21-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 22", () => {
    const keys = ["mcp:batch-22-a", "skills:batch-22-b", "hooks:batch-22-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 23", () => {
    const keys = ["mcp:batch-23-a", "skills:batch-23-b", "hooks:batch-23-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 24", () => {
    const keys = ["mcp:batch-24-a", "skills:batch-24-b", "hooks:batch-24-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 25", () => {
    const keys = ["mcp:batch-25-a", "skills:batch-25-b", "hooks:batch-25-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 26", () => {
    const keys = ["mcp:batch-26-a", "skills:batch-26-b", "hooks:batch-26-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 27", () => {
    const keys = ["mcp:batch-27-a", "skills:batch-27-b", "hooks:batch-27-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 28", () => {
    const keys = ["mcp:batch-28-a", "skills:batch-28-b", "hooks:batch-28-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 29", () => {
    const keys = ["mcp:batch-29-a", "skills:batch-29-b", "hooks:batch-29-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 30", () => {
    const keys = ["mcp:batch-30-a", "skills:batch-30-b", "hooks:batch-30-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 31", () => {
    const keys = ["mcp:batch-31-a", "skills:batch-31-b", "hooks:batch-31-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 32", () => {
    const keys = ["mcp:batch-32-a", "skills:batch-32-b", "hooks:batch-32-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 33", () => {
    const keys = ["mcp:batch-33-a", "skills:batch-33-b", "hooks:batch-33-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 34", () => {
    const keys = ["mcp:batch-34-a", "skills:batch-34-b", "hooks:batch-34-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 35", () => {
    const keys = ["mcp:batch-35-a", "skills:batch-35-b", "hooks:batch-35-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 36", () => {
    const keys = ["mcp:batch-36-a", "skills:batch-36-b", "hooks:batch-36-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 37", () => {
    const keys = ["mcp:batch-37-a", "skills:batch-37-b", "hooks:batch-37-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 38", () => {
    const keys = ["mcp:batch-38-a", "skills:batch-38-b", "hooks:batch-38-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
  it("getFallbackVoteCounts batch 39", () => {
    const keys = ["mcp:batch-39-a", "skills:batch-39-b", "hooks:batch-39-c"];
    const counts = getFallbackVoteCounts(keys);
    expect(Object.keys(counts)).toHaveLength(3);
    for (const key of keys) expect(counts[key]).toBe(0);
  });
});

describe("votes-lib getFallbackClientVotes", () => {
  it("returns false voted state for every key", () => {
    expect(getFallbackClientVotes(["mcp:a", "skills:b"])).toEqual({
      "mcp:a": false,
      "skills:b": false,
    });
  });
  it("returns empty object for empty keys", () => {
    expect(getFallbackClientVotes([])).toEqual({});
  });

  it("getFallbackClientVotes agents:agents-client-0", () => {
    const keys = ["agents:agents-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-0": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-1", () => {
    const keys = ["agents:agents-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-1": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-2", () => {
    const keys = ["agents:agents-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-2": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-3", () => {
    const keys = ["agents:agents-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-3": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-4", () => {
    const keys = ["agents:agents-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-4": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-5", () => {
    const keys = ["agents:agents-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-5": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-6", () => {
    const keys = ["agents:agents-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-6": false,
    });
  });
  it("getFallbackClientVotes agents:agents-client-7", () => {
    const keys = ["agents:agents-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "agents:agents-client-7": false,
    });
  });
  it("getFallbackClientVotes mcp:mcp-client-0", () => {
    const keys = ["mcp:mcp-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-0": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-1", () => {
    const keys = ["mcp:mcp-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-1": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-2", () => {
    const keys = ["mcp:mcp-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-2": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-3", () => {
    const keys = ["mcp:mcp-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-3": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-4", () => {
    const keys = ["mcp:mcp-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-4": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-5", () => {
    const keys = ["mcp:mcp-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-5": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-6", () => {
    const keys = ["mcp:mcp-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-6": false });
  });
  it("getFallbackClientVotes mcp:mcp-client-7", () => {
    const keys = ["mcp:mcp-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({ "mcp:mcp-client-7": false });
  });
  it("getFallbackClientVotes tools:tools-client-0", () => {
    const keys = ["tools:tools-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-0": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-1", () => {
    const keys = ["tools:tools-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-1": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-2", () => {
    const keys = ["tools:tools-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-2": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-3", () => {
    const keys = ["tools:tools-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-3": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-4", () => {
    const keys = ["tools:tools-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-4": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-5", () => {
    const keys = ["tools:tools-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-5": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-6", () => {
    const keys = ["tools:tools-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-6": false,
    });
  });
  it("getFallbackClientVotes tools:tools-client-7", () => {
    const keys = ["tools:tools-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "tools:tools-client-7": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-0", () => {
    const keys = ["skills:skills-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-0": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-1", () => {
    const keys = ["skills:skills-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-1": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-2", () => {
    const keys = ["skills:skills-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-2": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-3", () => {
    const keys = ["skills:skills-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-3": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-4", () => {
    const keys = ["skills:skills-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-4": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-5", () => {
    const keys = ["skills:skills-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-5": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-6", () => {
    const keys = ["skills:skills-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-6": false,
    });
  });
  it("getFallbackClientVotes skills:skills-client-7", () => {
    const keys = ["skills:skills-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "skills:skills-client-7": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-0", () => {
    const keys = ["rules:rules-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-0": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-1", () => {
    const keys = ["rules:rules-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-1": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-2", () => {
    const keys = ["rules:rules-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-2": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-3", () => {
    const keys = ["rules:rules-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-3": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-4", () => {
    const keys = ["rules:rules-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-4": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-5", () => {
    const keys = ["rules:rules-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-5": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-6", () => {
    const keys = ["rules:rules-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-6": false,
    });
  });
  it("getFallbackClientVotes rules:rules-client-7", () => {
    const keys = ["rules:rules-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "rules:rules-client-7": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-0", () => {
    const keys = ["commands:commands-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-0": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-1", () => {
    const keys = ["commands:commands-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-1": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-2", () => {
    const keys = ["commands:commands-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-2": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-3", () => {
    const keys = ["commands:commands-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-3": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-4", () => {
    const keys = ["commands:commands-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-4": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-5", () => {
    const keys = ["commands:commands-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-5": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-6", () => {
    const keys = ["commands:commands-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-6": false,
    });
  });
  it("getFallbackClientVotes commands:commands-client-7", () => {
    const keys = ["commands:commands-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "commands:commands-client-7": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-0", () => {
    const keys = ["hooks:hooks-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-0": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-1", () => {
    const keys = ["hooks:hooks-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-1": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-2", () => {
    const keys = ["hooks:hooks-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-2": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-3", () => {
    const keys = ["hooks:hooks-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-3": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-4", () => {
    const keys = ["hooks:hooks-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-4": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-5", () => {
    const keys = ["hooks:hooks-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-5": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-6", () => {
    const keys = ["hooks:hooks-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-6": false,
    });
  });
  it("getFallbackClientVotes hooks:hooks-client-7", () => {
    const keys = ["hooks:hooks-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "hooks:hooks-client-7": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-0", () => {
    const keys = ["guides:guides-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-0": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-1", () => {
    const keys = ["guides:guides-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-1": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-2", () => {
    const keys = ["guides:guides-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-2": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-3", () => {
    const keys = ["guides:guides-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-3": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-4", () => {
    const keys = ["guides:guides-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-4": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-5", () => {
    const keys = ["guides:guides-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-5": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-6", () => {
    const keys = ["guides:guides-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-6": false,
    });
  });
  it("getFallbackClientVotes guides:guides-client-7", () => {
    const keys = ["guides:guides-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "guides:guides-client-7": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-0", () => {
    const keys = ["collections:collections-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-0": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-1", () => {
    const keys = ["collections:collections-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-1": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-2", () => {
    const keys = ["collections:collections-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-2": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-3", () => {
    const keys = ["collections:collections-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-3": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-4", () => {
    const keys = ["collections:collections-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-4": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-5", () => {
    const keys = ["collections:collections-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-5": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-6", () => {
    const keys = ["collections:collections-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-6": false,
    });
  });
  it("getFallbackClientVotes collections:collections-client-7", () => {
    const keys = ["collections:collections-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "collections:collections-client-7": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-0", () => {
    const keys = ["statuslines:statuslines-client-0"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-0": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-1", () => {
    const keys = ["statuslines:statuslines-client-1"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-1": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-2", () => {
    const keys = ["statuslines:statuslines-client-2"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-2": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-3", () => {
    const keys = ["statuslines:statuslines-client-3"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-3": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-4", () => {
    const keys = ["statuslines:statuslines-client-4"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-4": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-5", () => {
    const keys = ["statuslines:statuslines-client-5"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-5": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-6", () => {
    const keys = ["statuslines:statuslines-client-6"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-6": false,
    });
  });
  it("getFallbackClientVotes statuslines:statuslines-client-7", () => {
    const keys = ["statuslines:statuslines-client-7"];
    expect(getFallbackClientVotes(keys)).toEqual({
      "statuslines:statuslines-client-7": false,
    });
  });
  it("getFallbackClientVotes batch 0", () => {
    const keys = ["agents:client-0-a", "tools:client-0-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 1", () => {
    const keys = ["agents:client-1-a", "tools:client-1-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 2", () => {
    const keys = ["agents:client-2-a", "tools:client-2-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 3", () => {
    const keys = ["agents:client-3-a", "tools:client-3-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 4", () => {
    const keys = ["agents:client-4-a", "tools:client-4-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 5", () => {
    const keys = ["agents:client-5-a", "tools:client-5-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 6", () => {
    const keys = ["agents:client-6-a", "tools:client-6-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 7", () => {
    const keys = ["agents:client-7-a", "tools:client-7-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 8", () => {
    const keys = ["agents:client-8-a", "tools:client-8-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 9", () => {
    const keys = ["agents:client-9-a", "tools:client-9-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 10", () => {
    const keys = ["agents:client-10-a", "tools:client-10-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 11", () => {
    const keys = ["agents:client-11-a", "tools:client-11-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 12", () => {
    const keys = ["agents:client-12-a", "tools:client-12-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 13", () => {
    const keys = ["agents:client-13-a", "tools:client-13-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 14", () => {
    const keys = ["agents:client-14-a", "tools:client-14-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 15", () => {
    const keys = ["agents:client-15-a", "tools:client-15-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 16", () => {
    const keys = ["agents:client-16-a", "tools:client-16-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 17", () => {
    const keys = ["agents:client-17-a", "tools:client-17-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 18", () => {
    const keys = ["agents:client-18-a", "tools:client-18-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 19", () => {
    const keys = ["agents:client-19-a", "tools:client-19-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 20", () => {
    const keys = ["agents:client-20-a", "tools:client-20-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 21", () => {
    const keys = ["agents:client-21-a", "tools:client-21-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 22", () => {
    const keys = ["agents:client-22-a", "tools:client-22-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 23", () => {
    const keys = ["agents:client-23-a", "tools:client-23-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 24", () => {
    const keys = ["agents:client-24-a", "tools:client-24-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 25", () => {
    const keys = ["agents:client-25-a", "tools:client-25-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 26", () => {
    const keys = ["agents:client-26-a", "tools:client-26-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 27", () => {
    const keys = ["agents:client-27-a", "tools:client-27-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 28", () => {
    const keys = ["agents:client-28-a", "tools:client-28-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 29", () => {
    const keys = ["agents:client-29-a", "tools:client-29-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 30", () => {
    const keys = ["agents:client-30-a", "tools:client-30-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 31", () => {
    const keys = ["agents:client-31-a", "tools:client-31-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 32", () => {
    const keys = ["agents:client-32-a", "tools:client-32-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 33", () => {
    const keys = ["agents:client-33-a", "tools:client-33-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 34", () => {
    const keys = ["agents:client-34-a", "tools:client-34-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 35", () => {
    const keys = ["agents:client-35-a", "tools:client-35-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 36", () => {
    const keys = ["agents:client-36-a", "tools:client-36-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 37", () => {
    const keys = ["agents:client-37-a", "tools:client-37-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 38", () => {
    const keys = ["agents:client-38-a", "tools:client-38-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
  it("getFallbackClientVotes batch 39", () => {
    const keys = ["agents:client-39-a", "tools:client-39-b"];
    const voted = getFallbackClientVotes(keys);
    expect(Object.keys(voted)).toHaveLength(2);
    for (const key of keys) expect(voted[key]).toBe(false);
  });
});

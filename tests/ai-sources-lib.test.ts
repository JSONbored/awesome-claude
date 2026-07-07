import { describe, expect, it } from "vitest";

import {
  AI_BOTS,
  matchAiBot,
  matchAiReferrer,
} from "../apps/web/src/lib/ai-sources-lib";

describe("ai-sources-lib matchAiReferrer", () => {
  it("matchAiReferrer matrix 0", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 1", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 2", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 3", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 4", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 5", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 6", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 7", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 8", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 9", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 10", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 11", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 12", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 13", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 14", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 15", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 16", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 17", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 18", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 19", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 20", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 21", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 22", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 23", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 24", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 25", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 26", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 27", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 28", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 29", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 30", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 31", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 32", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 33", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 34", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 35", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 36", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 37", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 38", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 39", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 40", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 41", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 42", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 43", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 44", () => {
    const result = matchAiReferrer("https://claude.ai/chat");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 45", () => {
    const result = matchAiReferrer("https://gemini.google.com/app");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 46", () => {
    const result = matchAiReferrer("https://copilot.microsoft.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 47", () => {
    const result = matchAiReferrer("https://example.com/");
    expect(result).toBeNull();
  });
  it("matchAiReferrer matrix 48", () => {
    const result = matchAiReferrer("https://chatgpt.com/");
    expect(typeof result).toBe("string");
  });
  it("matchAiReferrer matrix 49", () => {
    const result = matchAiReferrer("https://www.perplexity.ai/search");
    expect(typeof result).toBe("string");
  });
});

describe("ai-sources-lib matchAiBot", () => {
  it("exports AI_BOTS list", () => {
    expect(AI_BOTS.length).toBeGreaterThan(10);
  });
  it("matchAiBot matrix 0", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 1", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 2", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 3", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 4", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 5", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 6", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 7", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 8", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 9", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 10", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 11", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 12", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 13", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 14", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 15", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 16", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 17", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 18", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 19", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 20", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 21", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 22", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 23", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 24", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 25", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 26", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 27", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 28", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 29", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 30", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 31", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 32", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 33", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 34", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 35", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 36", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 37", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 38", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 39", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 40", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 41", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 42", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 43", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 44", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
  it("matchAiBot matrix 45", () => {
    const result = matchAiBot("Mozilla/5.0 (OAI-SearchBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 46", () => {
    const result = matchAiBot("Mozilla/5.0 (ClaudeBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 47", () => {
    const result = matchAiBot("Mozilla/5.0 (PerplexityBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 48", () => {
    const result = matchAiBot("Mozilla/5.0 (GPTBot)");
    expect(result?.token).toBeTruthy();
  });
  it("matchAiBot matrix 49", () => {
    const result = matchAiBot("Mozilla/5.0 (Mozilla/5.0)");
    expect(result).toBeNull();
  });
});

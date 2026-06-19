import { describe, expect, it } from "vitest";

import { AI_BOTS, matchAiBot, matchAiReferrer } from "@/lib/ai-sources";

describe("matchAiReferrer", () => {
  it("maps assistant hostnames (incl. subdomains) to a stable source key", () => {
    expect(matchAiReferrer("https://chatgpt.com/")).toBe("chatgpt");
    expect(matchAiReferrer("https://chat.openai.com/c/abc")).toBe("chatgpt");
    expect(matchAiReferrer("https://www.perplexity.ai/search")).toBe(
      "perplexity",
    );
    expect(matchAiReferrer("https://gemini.google.com/app")).toBe("gemini");
    expect(matchAiReferrer("claude.ai")).toBe("claude");
  });

  it("maps newer AI assistant referrers to their stable source keys", () => {
    expect(matchAiReferrer("https://kagi.com/assistant")).toBe("kagi");
    expect(matchAiReferrer("https://search.brave.com/search?q=x")).toBe("brave");
    expect(matchAiReferrer("https://cohere.com/chat")).toBe("cohere");
    expect(matchAiReferrer("https://aistudio.google.com/app/prompts")).toBe("gemini");
    expect(matchAiReferrer("https://chat.mistral.ai/chat")).toBe("mistral");
  });

  it("returns null for non-AI / organic / empty referrers", () => {
    expect(matchAiReferrer("https://www.google.com/search?q=x")).toBeNull();
    expect(matchAiReferrer("https://news.ycombinator.com/")).toBeNull();
    expect(matchAiReferrer("")).toBeNull();
    expect(matchAiReferrer(null)).toBeNull();
    expect(matchAiReferrer("not a url")).toBeNull();
  });

  it("does not match look-alike hostnames", () => {
    // a phishing-style host that merely contains the brand must not match.
    expect(matchAiReferrer("https://chatgpt.com.evil.example/")).toBeNull();
    expect(matchAiReferrer("https://notperplexity.ai/")).toBeNull();
    expect(matchAiReferrer("https://notkagi.com/")).toBeNull();
  });
});

describe("matchAiBot", () => {
  it("classifies search/user/training bots by their UA token", () => {
    expect(
      matchAiBot(
        "Mozilla/5.0 ... OAI-SearchBot/1.3; +https://openai.com/searchbot",
      ),
    ).toMatchObject({ operator: "openai", purpose: "search" });
    expect(
      matchAiBot(
        "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      ),
    ).toMatchObject({ operator: "anthropic", purpose: "train" });
    expect(
      matchAiBot(
        "Mozilla/5.0 ... PerplexityBot/1.0; +https://perplexity.ai/perplexitybot",
      ),
    ).toMatchObject({ operator: "perplexity", purpose: "search" });
  });

  it("classifies newer AI crawlers (Gemini-User, YouBot, PhindBot, cohere-ai, BraveBot)", () => {
    expect(matchAiBot("Mozilla/5.0 (compatible; Gemini-User/1.0)")).toMatchObject({
      operator: "google",
      purpose: "user",
    });
    expect(matchAiBot("Mozilla/5.0 (compatible; YouBot/1.0; +https://you.com/bot)")).toMatchObject({
      operator: "you",
      purpose: "search",
    });
    expect(matchAiBot("Mozilla/5.0 (compatible; PhindBot/1.0)")).toMatchObject({
      operator: "phind",
      purpose: "search",
    });
    expect(matchAiBot("cohere-ai/1.0 (+https://cohere.com/bots)")).toMatchObject({
      operator: "cohere",
      purpose: "train",
    });
    expect(matchAiBot("Mozilla/5.0 (compatible; BraveBot/1.0)")).toMatchObject({
      operator: "brave",
      purpose: "search",
    });
  });

  it("distinguishes Applebot-Extended (train) from the base Applebot (search)", () => {
    expect(
      matchAiBot("Mozilla/5.0 (compatible; Applebot-Extended/0.1; +http://www.apple.com/go/applebot)"),
    ).toMatchObject({ operator: "apple", purpose: "train" });
    expect(
      matchAiBot("Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)"),
    ).toMatchObject({ operator: "apple", purpose: "search" });
  });

  it("classifies Google-Extended as a training bot", () => {
    expect(
      matchAiBot("Mozilla/5.0 (compatible; Google-Extended/1.0)"),
    ).toMatchObject({ operator: "google", purpose: "train" });
  });

  it("prefers the most specific token (ChatGPT-User over the generic GPTBot)", () => {
    expect(
      matchAiBot("Mozilla/5.0 ... ChatGPT-User/1.0; +https://openai.com/bot"),
    ).toMatchObject({
      operator: "openai",
      purpose: "user",
    });
  });

  it("returns null for a normal browser UA", () => {
    expect(
      matchAiBot(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      ),
    ).toBeNull();
    expect(matchAiBot(null)).toBeNull();
  });

  it("keeps bot tokens unique so substring matching can't misclassify", () => {
    const tokens = AI_BOTS.map((b) => b.token);
    expect(new Set(tokens).size).toBe(tokens.length);
  });
});

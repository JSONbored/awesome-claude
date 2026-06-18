// Isomorphic AI-source detection (no server or DOM deps) shared by the server-side
// Analytics Engine tap (ai-signals.server.ts) and the client-side umami event
// (components/ai-referral.tsx). Two concerns live here:
//
//   1. AI *referrers* — humans arriving from an AI assistant/answer engine. Detected
//      by the referring hostname.
//   2. AI *crawlers* — bots fetching our pages. Detected by a user-agent token.
//
// Both lists churn as vendors ship/rename bots; re-audit quarterly against the vendor
// docs (OpenAI/Anthropic/Perplexity/Google crawler pages + Cloudflare's AI Crawl
// Control bot reference).

/**
 * Map of AI-assistant referrer hostnames → a short, stable source key for grouping.
 * Matching is suffix-based (`host === key || host.endsWith("." + key)`) so subdomains
 * like `www.perplexity.ai` resolve to the same source.
 *
 * Note: Google AI Overviews are intentionally absent — those clicks carry a plain
 * `google.com` referrer indistinguishable from normal organic, so they can't be
 * attributed here. Only the standalone `gemini.google.com` assistant is detectable.
 */
const REFERRER_SOURCES: Record<string, string> = {
  "chatgpt.com": "chatgpt",
  "chat.openai.com": "chatgpt",
  "openai.com": "chatgpt",
  "claude.ai": "claude",
  "anthropic.com": "claude",
  "perplexity.ai": "perplexity",
  "gemini.google.com": "gemini",
  "copilot.microsoft.com": "copilot",
  "mistral.ai": "mistral",
  "deepseek.com": "deepseek",
  "poe.com": "poe",
  "you.com": "you",
  "phind.com": "phind",
  "meta.ai": "meta",
  "grok.com": "grok",
  "x.ai": "grok",
};

/**
 * Resolve a referrer URL (or bare hostname) to its AI source key, or null if it is not
 * a known AI assistant. Accepts a full URL string, a hostname, or "" — never throws.
 */
export function matchAiReferrer(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  let host = referrer.trim().toLowerCase();
  if (!host) return null;
  // Accept full URLs as well as bare hostnames.
  if (host.includes("/") || host.includes(":")) {
    try {
      host = new URL(host.includes("://") ? host : `https://${host}`).hostname;
    } catch {
      return null;
    }
  }
  host = host.replace(/^www\./, "");
  for (const [domain, source] of Object.entries(REFERRER_SOURCES)) {
    if (host === domain || host.endsWith(`.${domain}`)) return source;
  }
  return null;
}

/** Purpose of an AI crawler hit — the signal strength for "are we being cited". */
export type AiBotPurpose = "search" | "user" | "train" | "other";

export type AiBot = {
  /** Stable user-agent token to substring-match (e.g. "OAI-SearchBot"). */
  token: string;
  /** Short operator key for grouping (e.g. "openai"). */
  operator: string;
  /** What the fetch is for. `search`/`user` are the high-signal citation proxies. */
  purpose: AiBotPurpose;
};

/**
 * AI crawler user-agent tokens, most-specific first so substring matching never
 * misclassifies (e.g. "ChatGPT-User" is checked before the generic training bots).
 * `search` and `user` bots fetch pages to answer a live query — the closest proxy we
 * have to "we got cited" — and should be read separately from the `train` bots.
 */
export const AI_BOTS: readonly AiBot[] = [
  { token: "OAI-SearchBot", operator: "openai", purpose: "search" },
  { token: "ChatGPT-User", operator: "openai", purpose: "user" },
  { token: "GPTBot", operator: "openai", purpose: "train" },
  { token: "Claude-SearchBot", operator: "anthropic", purpose: "search" },
  { token: "Claude-User", operator: "anthropic", purpose: "user" },
  { token: "ClaudeBot", operator: "anthropic", purpose: "train" },
  { token: "PerplexityBot", operator: "perplexity", purpose: "search" },
  { token: "Perplexity-User", operator: "perplexity", purpose: "user" },
  { token: "Google-CloudVertexBot", operator: "google", purpose: "train" },
  { token: "GoogleOther", operator: "google", purpose: "other" },
  { token: "DuckAssistBot", operator: "duckduckgo", purpose: "search" },
  { token: "MistralAI-User", operator: "mistral", purpose: "user" },
  { token: "Bytespider", operator: "bytedance", purpose: "train" },
  { token: "meta-externalagent", operator: "meta", purpose: "train" },
  { token: "Amazonbot", operator: "amazon", purpose: "other" },
  { token: "Applebot-Extended", operator: "apple", purpose: "train" },
  { token: "CCBot", operator: "commoncrawl", purpose: "train" },
] as const;

/** Match a user-agent string to a known AI crawler, or null. Case-sensitive (tokens are). */
export function matchAiBot(userAgent: string | null | undefined): AiBot | null {
  if (!userAgent) return null;
  return AI_BOTS.find((bot) => userAgent.includes(bot.token)) ?? null;
}

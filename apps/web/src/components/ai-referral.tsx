import * as React from "react";

import { trackEvent } from "@/lib/analytics";
import { matchAiReferrer } from "@/lib/ai-sources";

const SESSION_FLAG = "ai-referral-tracked";

/**
 * Fire a one-per-session umami `ai-referral` event when the visitor arrived from an AI
 * assistant (ChatGPT, Claude, Perplexity, Gemini, Copilot, …). This is the human-facing
 * counterpart to the server-side Analytics Engine tap: umami gives a clean, shareable
 * dashboard of real (JS-running) sessions, grouped by the `source` property.
 *
 * `document.referrer` persists across SPA navigations within a session, so we guard with
 * a sessionStorage flag to avoid re-emitting on every route change. Renders nothing.
 */
export function AiReferral() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    let alreadyTracked = false;
    try {
      alreadyTracked = window.sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      // sessionStorage can throw in private modes; fall through and just track once.
    }
    if (alreadyTracked) return;

    const source = matchAiReferrer(document.referrer);
    if (!source) return;

    try {
      window.sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // ignore — worst case we emit again next mount, which umami dedupes poorly but
      // is rare and harmless.
    }
    trackEvent("ai-referral", { source, landing: window.location.pathname });
  }, []);

  return null;
}

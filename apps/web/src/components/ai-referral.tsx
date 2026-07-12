import * as React from "react";

import { trackEvent } from "@/lib/analytics";
import { aiReferralAnalyticsData, aiReferralAnalyticsEvent } from "@/lib/ai-referral-cta-events";
import { matchAiReferrer } from "@/lib/ai-sources";

const SESSION_FLAG = "ai-referral-tracked";

export function emitAiReferralEvent(source: string, landing: string): boolean {
  if (typeof window === "undefined") return false;
  const umami = (window as Window & { umami?: { track?: (...args: unknown[]) => void } }).umami;
  if (typeof umami?.track !== "function") return false;

  try {
    trackEvent(aiReferralAnalyticsEvent(), aiReferralAnalyticsData(source, landing));
  } catch {
    return false;
  }

  try {
    window.sessionStorage.setItem(SESSION_FLAG, "1");
  } catch {
    // ignore -- worst case we emit again next mount.
  }
  return true;
}

export function shouldWaitForAiReferralLoad(): boolean {
  return typeof document !== "undefined" && document.readyState !== "complete";
}

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

    const emit = () => emitAiReferralEvent(source, window.location.pathname);
    if (emit()) return;
    if (!shouldWaitForAiReferralLoad()) {
      emit();
      return;
    }

    const onLoad = () => {
      emit();
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}

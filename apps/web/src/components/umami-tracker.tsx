import * as React from "react";
import { useRouterState } from "@tanstack/react-router";

import { currentUrlPath, externalReferrer } from "@/lib/umami-nav-lib";

type UmamiPayload = {
  website: string;
  screen: string;
  language: string;
  title: string;
  hostname: string;
  url: string;
  referrer: string;
  name?: string;
  data?: Record<string, unknown>;
  id?: string;
};

type UmamiResponse = {
  cache?: string;
  disabled?: boolean;
};

type UmamiTrackInput =
  | string
  | Partial<UmamiPayload>
  | ((payload: UmamiPayload) => Partial<UmamiPayload> | null | undefined)
  | null
  | undefined;

type FirstPartyUmami = {
  track: (event?: UmamiTrackInput, data?: Record<string, unknown>) => void;
  identify: (idOrData: string | Record<string, unknown>, data?: Record<string, unknown>) => void;
  getSession: () => { cache: string; website: string };
};

const COLLECTOR_URL = "/u/api/send";
const SENSITIVE_PAGEVIEW_PATHS = new Set(["/brief/approve"]);

export function isAllowedUmamiHost(hostname: string, allowedHosts: readonly string[]) {
  if (allowedHosts.length === 0) return true;
  const normalized = hostname.toLowerCase();
  return allowedHosts.some((host) => normalized === host.toLowerCase());
}

export function buildUmamiPayload(
  websiteId: string,
  referrer: string,
  event?: string,
  data?: Record<string, unknown>,
): UmamiPayload {
  return {
    website: websiteId,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    title: document.title,
    hostname: window.location.hostname,
    url: currentUrlPath(window.location),
    referrer,
    ...(event ? { name: event } : {}),
    ...(data ? { data } : {}),
  };
}

export function shouldTrackUmamiPage(pathname: string) {
  return !SENSITIVE_PAGEVIEW_PATHS.has(pathname);
}

export function UmamiTracker({
  websiteId,
  allowedHosts = [],
}: {
  websiteId: string;
  allowedHosts?: readonly string[];
}) {
  const routeKey = useRouterState({
    select: (state) => `${state.location.pathname}:${JSON.stringify(state.location.search)}`,
  });
  const previousUrlRef = React.useRef("");
  const referrerRef = React.useRef("");
  const cacheRef = React.useRef("");
  const disabledRef = React.useRef(false);

  React.useEffect(() => {
    if (!websiteId || !isAllowedUmamiHost(window.location.hostname, allowedHosts)) return;

    const sendPayload = (payload: UmamiPayload, type = "event") => {
      if (disabledRef.current) return;
      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      if (cacheRef.current) {
        headers["x-umami-cache"] = cacheRef.current;
      }

      void fetch(COLLECTOR_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ type, payload }),
        credentials: "omit",
        keepalive: true,
      })
        .then(async (response) => {
          if (!response.ok) return;
          const body = (await response.json().catch(() => ({}))) as UmamiResponse;
          if (body.cache) cacheRef.current = body.cache;
          if (body.disabled) disabledRef.current = true;
        })
        .catch(() => {
          // Analytics is best-effort and must never affect app behavior.
        });
    };

    const track: FirstPartyUmami["track"] = (event, data) => {
      const basePayload = buildUmamiPayload(websiteId, referrerRef.current);
      if (typeof event === "function") {
        const nextPayload = event(basePayload);
        if (nextPayload) sendPayload({ ...basePayload, ...nextPayload });
        return;
      }
      if (event && typeof event === "object") {
        sendPayload({ ...basePayload, ...event });
        return;
      }
      sendPayload(buildUmamiPayload(websiteId, referrerRef.current, event || undefined, data));
    };

    const identify: FirstPartyUmami["identify"] = (idOrData, data) => {
      const payload =
        typeof idOrData === "string"
          ? buildUmamiPayload(websiteId, referrerRef.current, undefined, data)
          : buildUmamiPayload(websiteId, referrerRef.current, undefined, idOrData);
      if (typeof idOrData === "string") payload.id = idOrData;
      sendPayload(payload, "identify");
    };

    window.umami = {
      track,
      identify,
      getSession: () => ({ cache: cacheRef.current, website: websiteId }),
    };
  }, [allowedHosts, websiteId]);

  React.useEffect(() => {
    if (
      !websiteId ||
      !isAllowedUmamiHost(window.location.hostname, allowedHosts) ||
      !shouldTrackUmamiPage(window.location.pathname)
    ) {
      return;
    }

    const current = currentUrlPath(window.location);
    if (previousUrlRef.current === current) return;
    referrerRef.current =
      previousUrlRef.current || externalReferrer(document.referrer, window.location.origin);
    previousUrlRef.current = current;
    window.umami?.track();
    referrerRef.current = current;
  }, [allowedHosts, routeKey, websiteId]);

  return null;
}

/**
 * Cross-component preference helpers for the dossier surface.
 * - Persistent copy variant (install | config | full) — survives refresh + new tabs.
 * - Persistent per-entry harness selection — survives refresh + new tabs.
 * - Session-scoped scroll-position memory (intentional — per-session only).
 *
 * All helpers are SSR/private-mode safe.
 */
import * as React from "react";

export type CopyVariant = "install" | "config" | "full";

const COPY_KEY = "hc:dossier-copy-pref";
const SCROLL_KEY_PREFIX = "hc:dossier-scroll:";
const HARNESS_KEY_PREFIX = "hc:dossier-harness:";

function safeSession(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safeLocal(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Read from localStorage, falling back to (and migrating from) sessionStorage
 * for users who set the pref before persistence was added.
 */
function readPersistent(key: string): string | null {
  const l = safeLocal();
  if (l) {
    try {
      const v = l.getItem(key);
      if (v != null) return v;
    } catch {
      /* noop */
    }
  }
  const s = safeSession();
  if (s) {
    try {
      const v = s.getItem(key);
      if (v != null && l) {
        try {
          l.setItem(key, v);
        } catch {
          /* noop */
        }
      }
      return v;
    } catch {
      /* noop */
    }
  }
  return null;
}

function writePersistent(key: string, value: string) {
  const l = safeLocal();
  if (!l) return;
  try {
    l.setItem(key, value);
  } catch {
    /* noop */
  }
}

export function readCopyPref(): CopyVariant | null {
  const v = readPersistent(COPY_KEY);
  if (v === "install" || v === "config" || v === "full") return v;
  return null;
}

export function writeCopyPref(v: CopyVariant) {
  writePersistent(COPY_KEY, v);
  if (typeof window !== "undefined") {
    // Notify same-tab listeners (storage event only fires cross-tab).
    window.dispatchEvent(new CustomEvent("hc:copy-pref", { detail: v }));
  }
}

/** Subscribe to copy-pref changes (same tab + cross tab). */
export function useCopyPref(): [CopyVariant | null, (v: CopyVariant) => void] {
  const [pref, setPref] = React.useState<CopyVariant | null>(() => readCopyPref());
  React.useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<CopyVariant>).detail;
      if (detail === "install" || detail === "config" || detail === "full") setPref(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== COPY_KEY) return;
      const v = e.newValue;
      if (v === "install" || v === "config" || v === "full") setPref(v);
    };
    window.addEventListener("hc:copy-pref", onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("hc:copy-pref", onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return [pref, writeCopyPref];
}

const scrollKey = (category: string, slug: string) => `${SCROLL_KEY_PREFIX}${category}/${slug}`;

export function readScrollPos(category: string, slug: string): number | null {
  const s = safeSession();
  if (!s) return null;
  try {
    const v = s.getItem(scrollKey(category, slug));
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function writeScrollPos(category: string, slug: string, y: number) {
  const s = safeSession();
  if (!s) return;
  try {
    if (y <= 0) s.removeItem(scrollKey(category, slug));
    else s.setItem(scrollKey(category, slug), String(Math.round(y)));
  } catch {
    /* noop */
  }
}

export function clearScrollPos(category: string, slug: string) {
  const s = safeSession();
  if (!s) return;
  try {
    s.removeItem(scrollKey(category, slug));
  } catch {
    /* noop */
  }
}

/** Per-entry selected harness variant (persisted across tabs + refresh). */
const harnessKey = (category: string, slug: string) => `${HARNESS_KEY_PREFIX}${category}/${slug}`;

export function useHarnessPref(
  category: string,
  slug: string,
  available: string[],
): [string | null, (h: string) => void] {
  const key = harnessKey(category, slug);
  const availableSig = available.join("|");
  const [val, setVal] = React.useState<string | null>(null);

  React.useEffect(() => {
    const v = readPersistent(key);
    if (v && available.includes(v)) setVal(v);
    else if (available.length > 0) setVal(available[0]);
    else setVal(null);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      const nv = e.newValue;
      if (nv && available.includes(nv)) setVal(nv);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, availableSig]);

  const set = React.useCallback(
    (h: string) => {
      setVal(h);
      writePersistent(key, h);
    },
    [key],
  );
  return [val, set];
}

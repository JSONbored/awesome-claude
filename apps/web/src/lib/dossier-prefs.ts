/**
 * Cross-component preference helpers for the dossier surface.
 * - Persistent copy variant (install | config | full) — survives refresh + new tabs.
 * - Persistent per-entry harness selection — survives refresh + new tabs.
 * - Session-scoped scroll-position memory (intentional — per-session only).
 *
 * All helpers are SSR/private-mode safe.
 */
import * as React from "react";

import {
  COPY_KEY,
  type CopyVariant,
  defaultSessionStorage,
  harnessStorageKey,
  isCopyVariant,
  parseScrollPosition,
  readPersistent,
  scrollStorageKey,
  writePersistent,
} from "@/lib/dossier-prefs-lib";

export type { CopyVariant } from "@/lib/dossier-prefs-lib";

export function readCopyPref(): CopyVariant | null {
  const v = readPersistent(COPY_KEY);
  return isCopyVariant(v) ? v : null;
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
      if (isCopyVariant(detail)) setPref(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== COPY_KEY) return;
      if (isCopyVariant(e.newValue)) setPref(e.newValue);
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

export function readScrollPos(category: string, slug: string): number | null {
  const s = defaultSessionStorage();
  if (!s) return null;
  try {
    return parseScrollPosition(s.getItem(scrollStorageKey(category, slug)));
  } catch {
    return null;
  }
}

export function writeScrollPos(category: string, slug: string, y: number) {
  const s = defaultSessionStorage();
  if (!s) return;
  try {
    const key = scrollStorageKey(category, slug);
    if (y <= 0) s.removeItem(key);
    else s.setItem(key, String(Math.round(y)));
  } catch {
    /* noop */
  }
}

export function clearScrollPos(category: string, slug: string) {
  const s = defaultSessionStorage();
  if (!s) return;
  try {
    s.removeItem(scrollStorageKey(category, slug));
  } catch {
    /* noop */
  }
}

/** Per-entry selected harness variant (persisted across tabs + refresh). */
export function useHarnessPref(
  category: string,
  slug: string,
  available: string[],
): [string | null, (h: string) => void] {
  const key = harnessStorageKey(category, slug);
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

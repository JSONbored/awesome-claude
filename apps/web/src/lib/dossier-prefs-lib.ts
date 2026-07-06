/**
 * Pure dossier preference helpers (storage keys, parsing, persistence).
 *
 * React hooks stay in `dossier-prefs.ts`.
 */

export type CopyVariant = "install" | "config" | "full";

export const COPY_KEY = "hc:dossier-copy-pref";
export const SCROLL_KEY_PREFIX = "hc:dossier-scroll:";
export const HARNESS_KEY_PREFIX = "hc:dossier-harness:";

export function scrollStorageKey(category: string, slug: string) {
  return `${SCROLL_KEY_PREFIX}${category}/${slug}`;
}

export function harnessStorageKey(category: string, slug: string) {
  return `${HARNESS_KEY_PREFIX}${category}/${slug}`;
}

export function isCopyVariant(value: unknown): value is CopyVariant {
  return value === "install" || value === "config" || value === "full";
}

export function parseScrollPosition(value: string | null | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export type DossierPrefsStorage = {
  local: Storage | null;
  session: Storage | null;
};

export function defaultSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function defaultLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createDossierPrefsStorage(
  local: Storage | null = defaultLocalStorage(),
  session: Storage | null = defaultSessionStorage(),
): DossierPrefsStorage {
  return { local, session };
}

/**
 * Read from localStorage, falling back to (and migrating from) sessionStorage
 * for users who set the pref before persistence was added.
 */
export function readPersistent(
  key: string,
  storage: DossierPrefsStorage = createDossierPrefsStorage(),
): string | null {
  const { local: l, session: s } = storage;
  if (l) {
    try {
      const v = l.getItem(key);
      if (v != null) return v;
    } catch {
      /* noop */
    }
  }
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

export function writePersistent(
  key: string,
  value: string,
  storage: DossierPrefsStorage = createDossierPrefsStorage(),
) {
  const l = storage.local;
  if (!l) return;
  try {
    l.setItem(key, value);
  } catch {
    /* noop */
  }
}

import * as React from "react";
import {
  compareContextInteractiveSelectionParam,
  compareContextInteractiveShareUrl,
  compareContextSelectionChanged,
} from "@/lib/compare-context-interactive-ui-lib";
import { hasCompareItem, resolveCompareParam, toggleCompareItem } from "@/lib/compare-selection";
import type { EntryIdentity } from "@/lib/entry-identity";
import type { Entry } from "@/types/registry";

interface CompareActions {
  setOpen: (open: boolean) => void;
  toggle: (e: Entry) => boolean;
  clear: () => void;
  has: (entry: EntryIdentity) => boolean;
  /** Hydrate selection from a `cat/slug,cat/slug` URL param string. */
  hydrate: (param: string) => void;
  /** Serialize current selection back to URL param shape. */
  serialize: () => string;
  /** Absolute URL that rehydrates the current selection on /browse. */
  getShareUrl: () => string;
}

interface CompareState {
  items: Entry[];
  open: boolean;
}

interface CompareStore {
  getState: () => CompareState;
  subscribe: (listener: () => void) => () => void;
  actions: CompareActions;
}

/** Full context value: live state spread together with the stable actions. */
export interface CompareCtx extends CompareState, CompareActions {}

const StoreCtx = React.createContext<CompareStore | null>(null);

/**
 * A tiny external store backs the compare selection. Splitting state from the
 * stable `actions` object lets cards subscribe narrowly (see `useIsCompared`):
 * toggling one card only re-renders that card plus the singletons that read the
 * full state, instead of every visible `ResourceCard`.
 */
function createCompareStore(): CompareStore {
  let state: CompareState = { items: [], open: false };
  const listeners = new Set<() => void>();
  const setState = (next: CompareState) => {
    if (next === state) return;
    state = next;
    for (const l of listeners) l();
  };

  const actions: CompareActions = {
    setOpen: (open) => {
      if (state.open === open) return;
      setState({ ...state, open });
    },
    toggle: (e) => {
      const cur = state.items;
      const next = toggleCompareItem(cur, e);
      if (next === cur) return false;
      setState({ ...state, items: next });
      return true;
    },
    clear: () => {
      if (state.items.length === 0 && !state.open) return;
      setState({ items: [], open: false });
    },
    has: (entry) => hasCompareItem(state.items, entry),
    hydrate: (param) => {
      if (!param) {
        if (state.items.length) setState({ ...state, items: [] });
        return;
      }
      // Lazy-load the dataset only when a compare selection is hydrated from the
      // URL, keeping the registry dataset out of the universal client bundle.
      void import("@/data/entries").then(({ ENTRIES }) => {
        const next = resolveCompareParam(ENTRIES, param);
        if (compareContextSelectionChanged(next, state.items)) {
          setState({ ...state, items: next });
        }
      });
    },
    serialize: () => compareContextInteractiveSelectionParam(state.items),
    getShareUrl: () => compareContextInteractiveShareUrl(state.items),
  };

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    actions,
  };
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [store] = React.useState(createCompareStore);
  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>;
}

function useStore(): CompareStore {
  const store = React.useContext(StoreCtx);
  if (!store) throw new Error("useCompare must be used within CompareProvider");
  return store;
}

/** Stable action handlers — never changes identity, so consuming it never
 * triggers a re-render when the selection changes. */
export function useCompareActions(): CompareActions {
  return useStore().actions;
}

/** Narrow per-card subscription: a card re-renders only when its own
 * membership in the compare set flips, not on every selection change. */
export function useIsCompared(entry: EntryIdentity): boolean {
  const store = useStore();
  return React.useSyncExternalStore(
    store.subscribe,
    () => hasCompareItem(store.getState().items, entry),
    () => false,
  );
}

/** Full compare context (live state + actions). Use for the drawer/tray and
 * page-level consumers; per-card components should prefer `useIsCompared` +
 * `useCompareActions` to avoid re-rendering on every selection change. */
export function useCompare(): CompareCtx {
  const store = useStore();
  const state = React.useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return { ...state, ...store.actions };
}

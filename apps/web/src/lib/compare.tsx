import * as React from "react";
import type { Entry } from "@/types/registry";
import { ENTRIES } from "@/data/entries";

interface CompareCtx {
  items: Entry[];
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: (e: Entry) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  /** Hydrate selection from a `cat/slug,cat/slug` URL param string. */
  hydrate: (param: string) => void;
  /** Serialize current selection back to URL param shape. */
  serialize: () => string;
  /** Absolute URL that rehydrates the current selection on /browse. */
  getShareUrl: () => string;
}

const Ctx = React.createContext<CompareCtx | null>(null);

function resolve(param: string): Entry[] {
  if (!param) return [];
  const refs = param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  const seen = new Set<string>();
  const out: Entry[] = [];
  for (const ref of refs) {
    const [cat, slug] = ref.split("/");
    if (!cat || !slug || seen.has(ref)) continue;
    const e = ENTRIES.find((x) => x.category === cat && x.slug === slug);
    if (e) {
      out.push(e);
      seen.add(ref);
    }
  }
  return out;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Entry[]>([]);
  const [open, setOpen] = React.useState(false);

  const value = React.useMemo<CompareCtx>(
    () => ({
      items,
      open,
      setOpen,
      toggle: (e) =>
        setItems((cur) =>
          cur.find((x) => x.slug === e.slug)
            ? cur.filter((x) => x.slug !== e.slug)
            : cur.length >= 4
              ? cur
              : [...cur, e],
        ),
      clear: () => {
        setItems([]);
        setOpen(false);
      },
      has: (slug) => items.some((x) => x.slug === slug),
      hydrate: (param) => {
        const next = resolve(param);
        // Only update if changed to avoid render loops
        const sig = next.map((e) => `${e.category}/${e.slug}`).join(",");
        const curSig = items.map((e) => `${e.category}/${e.slug}`).join(",");
        if (sig !== curSig) setItems(next);
      },
      serialize: () => items.map((e) => `${e.category}/${e.slug}`).join(","),
      getShareUrl: () => {
        const sig = items.map((e) => `${e.category}/${e.slug}`).join(",");
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        return sig ? `${origin}/browse?compare=${encodeURIComponent(sig)}` : `${origin}/browse`;
      },
    }),
    [items, open],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/badges";

interface Shortcut {
  keys: string[];
  label: string;
}

const SHORTCUTS: { group: string; items: Shortcut[] }[] = [
  {
    group: "Search",
    items: [
      { keys: ["⌘", "K"], label: "Focus search" },
      { keys: ["/"], label: "Focus search (alt)" },
      { keys: ["Esc"], label: "Close popovers / dialogs" },
    ],
  },
  {
    group: "Navigate",
    items: [
      { keys: ["g", "h"], label: "Go home" },
      { keys: ["g", "b"], label: "Browse" },
      { keys: ["g", "t"], label: "Trending" },
      { keys: ["g", "e"], label: "Ecosystem" },
      { keys: ["g", "c"], label: "Changelog" },
      { keys: ["g", "v"], label: "Review coverage" },
      { keys: ["g", "q"], label: "Quality" },
      { keys: ["g", "f"], label: "Feeds" },
      { keys: ["g", "s"], label: "Subscriptions" },
      { keys: ["g", "i"], label: "Integrations" },
    ],
  },
  {
    group: "Cards & snippets",
    items: [
      { keys: ["P"], label: "Peek focused/hovered card" },
      { keys: ["←", "→"], label: "Switch Install / Config / Full" },
      { keys: ["C"], label: "Copy active snippet (when segmented is focused)" },
    ],
  },
  {
    group: "Help",
    items: [{ keys: ["?"], label: "Open this dialog" }],
  },
];

interface ShortcutsContextValue {
  open: () => void;
}
const Ctx = React.createContext<ShortcutsContextValue | null>(null);

export function useShortcuts() {
  return React.useContext(Ctx);
}

const G_NAV: Record<string, string> = {
  h: "/",
  b: "/browse",
  t: "/trending",
  e: "/ecosystem",
  c: "/changelog",
  v: "/validators",
  q: "/quality",
  f: "/feeds",
  s: "/subscriptions",
  i: "/integrations",
};

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const gPending = React.useRef<number | null>(null);

  React.useEffect(() => {
    const isTyping = (el: EventTarget | null) =>
      !!(el as HTMLElement | null)?.matches?.("input, textarea, select, [contenteditable='true']");

    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;

      // sequence: g <letter>
      if (gPending.current) {
        const dest = G_NAV[e.key.toLowerCase()];
        window.clearTimeout(gPending.current);
        gPending.current = null;
        if (dest) {
          e.preventDefault();
          navigate({ to: dest });
        }
        return;
      }
      if (e.key === "g") {
        gPending.current = window.setTimeout(() => {
          gPending.current = null;
        }, 600);
        return;
      }
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return (
    <Ctx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription>Built for keyboard-first browsing.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-5">
            {SHORTCUTS.map((g) => (
              <div key={g.group}>
                <div className="eyebrow mb-2">{g.group}</div>
                <ul className="space-y-1.5">
                  {g.items.map((s) => (
                    <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-ink-muted">{s.label}</span>
                      <span className="flex items-center gap-1">
                        {s.keys.map((k, i) => (
                          <Kbd key={i}>{k}</Kbd>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}

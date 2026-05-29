import * as React from "react";

type Theme = "light" | "dark";

const ThemeContext = React.createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem("hc-theme")) as Theme | null;
    const sys =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    const initial = stored ?? "light"; // light-default per project
    setTheme(initial);
    void sys;
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("hc-theme", theme);
    } catch {
      /* noop */
    }
  }, [theme]);

  const value = React.useMemo(() => {
    const swap = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
    return {
      theme,
      toggle: () => {
        // Progressive enhancement: smooth crossfade where supported.
        const doc = typeof document !== "undefined" ? document : null;
        const reduced =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const startVT =
          doc &&
          (doc as Document & { startViewTransition?: (cb: () => void) => unknown })
            .startViewTransition;
        if (!reduced && typeof startVT === "function") {
          startVT.call(doc, swap);
        } else {
          swap();
        }
      },
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) return { theme: "light" as Theme, toggle: () => {} };
  return ctx;
}

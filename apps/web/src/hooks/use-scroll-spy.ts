import * as React from "react";

/**
 * Returns the id of the section currently nearest the top of the viewport.
 * Uses IntersectionObserver; safe under SSR.
 */
export function useScrollSpy(ids: string[], options?: { rootMargin?: string }): string | null {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);

  React.useEffect(() => {
    if (typeof window === "undefined" || ids.length === 0) return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size > 0) {
          // Pick id with the highest visible ratio, ties broken by document order.
          let best: string | null = null;
          let bestRatio = -1;
          for (const id of ids) {
            const r = visible.get(id);
            if (r !== undefined && r > bestRatio) {
              best = id;
              bestRatio = r;
            }
          }
          if (best) setActive(best);
        }
      },
      { rootMargin: options?.rootMargin ?? "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids.join("|"), options?.rootMargin]);

  return active;
}

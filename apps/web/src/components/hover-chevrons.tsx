import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Hover-revealed left/right scroll chevrons for a horizontal scroller.
 * Wrap a scrollable child element. Buttons fade in on hover/focus and
 * scroll the container by ~85% of its visible width.
 *
 *   <HoverChevrons>
 *     <div className="overflow-x-auto snap-x ...">...</div>
 *   </HoverChevrons>
 */
export function HoverChevrons({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const scroller = (): HTMLElement | null => {
    const root = ref.current;
    if (!root) return null;
    // Find first scrollable child (overflow-x-auto)
    return (
      (root.querySelector("[data-scroll-x]") as HTMLElement) ??
      (root.firstElementChild as HTMLElement)
    );
  };

  const update = React.useCallback(() => {
    const el = scroller();
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    const el = scroller();
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const nudge = (dir: 1 | -1) => {
    const el = scroller();
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div ref={ref} className={cn("group/scroll relative", className)}>
      {children}
      <ChevBtn side="left" visible={canLeft} onClick={() => nudge(-1)} />
      <ChevBtn side="right" visible={canRight} onClick={() => nudge(1)} />
    </div>
  );
}

function ChevBtn({
  side,
  visible,
  onClick,
}: {
  side: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-ink shadow-sm backdrop-blur transition-opacity duration-200 ease-out sm:inline-flex",
        "opacity-0 group-hover/scroll:opacity-100 focus-visible:opacity-100",
        side === "left" ? "left-1" : "right-1",
        !visible && "pointer-events-none !opacity-0",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

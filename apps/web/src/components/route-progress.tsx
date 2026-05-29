import * as React from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Top-of-page loading bar that reflects TanStack Router's pending state.
 * Adds a perceived-speed boost when navigating between data-heavy routes.
 */
export function RouteProgress() {
  const isPending = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf: number | undefined;
    let to: number | undefined;
    if (isPending) {
      setVisible(true);
      setProgress(10);
      const tick = () => {
        setProgress((p) => (p < 90 ? p + (90 - p) * 0.08 : p));
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    } else if (visible) {
      setProgress(100);
      to = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (to) window.clearTimeout(to);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  if (!visible) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-accent transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
          boxShadow: "0 0 8px rgb(var(--accent) / 0.5)",
        }}
      />
    </div>
  );
}

import * as React from "react";

/** Thin scroll-progress hairline at the top of long pages. */
export function ScrollProgress() {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, el.scrollTop / total)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent transition-transform duration-150"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

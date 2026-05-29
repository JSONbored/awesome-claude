import * as React from "react";
import { cn } from "@/lib/utils";

/** Deterministic citron-tinted gradient monogram avatar. */
export function Monogram({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = React.useMemo(() => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  // Deterministic hue offset from the name
  const hue = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return Math.abs(h % 60) - 30; // -30..+30 around citron (115)
  }, [name]);

  const bg = `linear-gradient(135deg, oklch(0.94 0.18 ${115 + hue}) 0%, oklch(0.88 0.12 ${115 + hue + 20}) 100%)`;
  const fontPx = Math.round(size * 0.38);

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-display font-semibold text-[color:var(--accent-ink)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: fontPx,
        letterSpacing: "-0.02em",
      }}
    >
      {initials}
    </div>
  );
}

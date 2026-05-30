import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible filter chip.
 * Renders as a checkbox (multi-select) or radio (single-select) button.
 * Active state surfaces with both color *and* a check glyph so it doesn't
 * rely on color alone.
 */
export function FilterChip({
  active,
  onClick,
  children,
  role = "checkbox",
  size = "sm",
  count,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role?: "checkbox" | "radio";
  size?: "sm" | "md";
  /** Optional result count rendered after the label as a muted number. */
  count?: number;
  /** Visually de-emphasize without removing from tab order. */
  disabled?: boolean;
}) {
  const dim = disabled || count === 0;
  return (
    <button
      type="button"
      role={role}
      aria-checked={active}
      aria-disabled={dim || undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border capitalize",
        "transition-[transform,background-color,border-color,color] duration-200 ease-out",
        "motion-safe:active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        size === "sm" ? "h-7 px-2.5 text-xs" : "h-9 px-3 text-sm",
        active
          ? "border-ink bg-ink font-medium text-background"
          : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
        dim && !active && "opacity-50",
      )}
    >
      {active && <Check className="h-3 w-3" aria-hidden />}
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "font-mono text-[10px] tabular-nums",
            active ? "text-background/70" : "text-ink-subtle",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function FilterChipGroup({
  label,
  children,
  multi = true,
}: {
  label: string;
  children: React.ReactNode;
  multi?: boolean;
}) {
  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={label}
      className="flex flex-wrap gap-1.5"
    >
      {children}
    </div>
  );
}

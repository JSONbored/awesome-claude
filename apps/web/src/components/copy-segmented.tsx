import * as React from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { useCopyPref, type CopyVariant } from "@/lib/dossier-prefs";
import { variantsForEntry, type VariantOption } from "@/lib/copy-segmented-lib";
import { cn } from "@/lib/utils";

export { variantsForEntry, type VariantOption };

interface Props {
  variants: VariantOption[];
  /** Used in copy toast / aria-live announcement. */
  entryTitle?: string;
  /** Compact size for sticky bar / peek. */
  size?: "sm" | "md";
  className?: string;
  /** Hide the inline copy button (used when caller renders its own). */
  hideCopy?: boolean;
  /** Optional id for aria-labelledby on the radiogroup. */
  labelId?: string;
  /** Optional hook after a successful clipboard write. */
  onCopied?: (variant: CopyVariant) => void;
  /** Optional hook when the active snippet variant changes. */
  onVariantSelect?: (variant: CopyVariant) => void;
}

/**
 * A11y: WAI-ARIA radiogroup. Left/Right cycle variants (skipping disabled),
 * Home/End jump to first/last available, `c` copies active payload.
 * Selection persists across components via useCopyPref.
 */
export function CopySegmented({
  variants,
  entryTitle,
  size = "sm",
  className,
  hideCopy = false,
  labelId,
  onCopied,
  onVariantSelect,
}: Props) {
  const [pref, setPref] = useCopyPref();
  const available = variants.filter((v) => !!v.value);
  const firstAvailable: CopyVariant = available[0]?.id ?? "install";
  const active: CopyVariant =
    pref && variants.find((v) => v.id === pref)?.value ? pref : firstAvailable;
  const activeOpt = variants.find((v) => v.id === active);
  const payload = activeOpt?.value ?? "";

  const [justCopied, setJustCopied] = React.useState(false);
  const liveRef = React.useRef<HTMLSpanElement>(null);

  const copy = React.useCallback(async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      const msg = `Copied ${active}${entryTitle ? ` — ${entryTitle}` : ""}`;
      toast.success(msg);
      if (liveRef.current) liveRef.current.textContent = msg;
      setJustCopied(true);
      onCopied?.(active);
      window.setTimeout(() => setJustCopied(false), 1200);
    } catch {
      toast.error("Copy failed");
    }
  }, [payload, active, entryTitle, onCopied]);

  const selectVariant = React.useCallback(
    (variant: CopyVariant) => {
      if (variant === active) return;
      setPref(variant);
      onVariantSelect?.(variant);
    },
    [active, onVariantSelect, setPref],
  );

  const moveBy = (delta: number) => {
    const idx = available.findIndex((v) => v.id === active);
    if (idx === -1) return;
    const next = available[(idx + delta + available.length) % available.length];
    if (next) selectVariant(next.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      moveBy(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      moveBy(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (available[0]) selectVariant(available[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = available[available.length - 1];
      if (last) selectVariant(last.id);
    } else if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      void copy();
    }
  };

  const pillH = size === "md" ? "h-8" : "h-7";
  const pillPx = size === "md" ? "px-2.5" : "px-2";
  const text = size === "md" ? "text-xs" : "text-[11px]";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div
        role="radiogroup"
        aria-label={labelId ? undefined : "Choose snippet to copy"}
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className={cn("inline-flex overflow-hidden rounded-md border border-border")}
      >
        {variants.map((v) => {
          const disabled = !v.value;
          const isActive = active === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-disabled={disabled || undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={disabled}
              onClick={() => !disabled && selectVariant(v.id)}
              title={
                disabled
                  ? `No ${v.label.toLowerCase()} payload`
                  : `Use ${v.label.toLowerCase()} (← →, press C to copy)`
              }
              className={cn(
                pillH,
                pillPx,
                text,
                "font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60",
                disabled && "cursor-not-allowed text-ink-subtle/50",
                !disabled && isActive && "bg-ink text-background",
                !disabled && !isActive && "bg-surface text-ink-muted hover:text-ink",
              )}
            >
              {v.label}
            </button>
          );
        })}
      </div>
      {!hideCopy && payload && (
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${active}${entryTitle ? ` for ${entryTitle}` : ""}`}
          className={cn(
            pillH,
            "inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
            text,
          )}
        >
          {justCopied ? (
            <Check className="h-3 w-3" aria-hidden />
          ) : (
            <Copy className="h-3 w-3" aria-hidden />
          )}
          <span>{justCopied ? "Copied" : "Copy"}</span>
        </button>
      )}
      <span ref={liveRef} aria-live="polite" className="sr-only" />
    </div>
  );
}

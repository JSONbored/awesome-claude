import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";

export function CopyButton({
  value,
  label = "Copy",
  className,
  size = "sm",
  disabled = false,
  toastLabel,
  iconOnly = false,
}: {
  value: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  /** Optional override for the toast message. Defaults to "Copied to clipboard". */
  toastLabel?: string;
  /** When true, hide the visible label and render an icon-only square button. */
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      title={label}
      disabled={disabled}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success(toastLabel ?? "Copied to clipboard", {
            description: value.length > 60 ? value.slice(0, 60) + "…" : value,
            duration: 1800,
          });
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Couldn't copy to clipboard");
        }
      }}
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface font-medium text-ink transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-border-strong hover:bg-surface-2 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        iconOnly
          ? size === "sm"
            ? "h-7 w-7 justify-center"
            : "h-9 w-9 justify-center"
          : cn("gap-1.5", size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm"),
        className,
      )}
    >
      {copied ? (
        <Check
          className={cn(
            "h-3.5 w-3.5 text-trust-trusted",
            !reduced && "animate-[scale-in_180ms_ease-out]",
          )}
        />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {iconOnly ? (
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : label}
        </span>
      ) : (
        <span aria-live="polite">{copied ? "Copied" : label}</span>
      )}
    </button>
  );
}

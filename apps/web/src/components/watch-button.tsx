import * as React from "react";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { useWatch, type WatchKind } from "@/lib/watch";
import { cn } from "@/lib/utils";

export function WatchButton({
  id,
  kind,
  label,
  href,
  size = "md",
  variant = "outline",
  fullLabel,
}: {
  id: string;
  kind: WatchKind;
  label: string;
  href?: string;
  size?: "sm" | "md";
  variant?: "outline" | "ghost";
  /** Optional label override displayed in the watching/unwatched states. */
  fullLabel?: { on?: string; off?: string };
}) {
  const watch = useWatch();
  const active = watch.isWatching(id);
  const Icon = active ? BellOff : Bell;
  return (
    <button
      type="button"
      onClick={() => {
        watch.toggle({ id, kind, label, href });
        if (active) toast(`Stopped watching ${label}`);
        else
          toast.success(`Watching ${label}`, {
            description: "You'll see updates in the alerts menu.",
          });
      }}
      aria-pressed={active}
      aria-label={`${active ? "Unwatch" : "Watch"} ${label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm",
        variant === "outline"
          ? "border border-border bg-surface text-ink hover:bg-surface-2"
          : "text-ink-muted hover:text-ink",
        active && "border-accent/60 bg-accent/10 text-ink",
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      <span>{active ? (fullLabel?.on ?? "Watching") : (fullLabel?.off ?? "Watch")}</span>
    </button>
  );
}

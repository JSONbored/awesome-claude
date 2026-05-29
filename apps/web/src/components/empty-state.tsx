import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon?: React.ElementType;
  title: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-ink-muted ring-1 ring-border">
          <Icon className="h-5 w-5" />
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-full bg-accent/[0.06] blur-md"
          />
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="font-display text-base font-semibold tracking-tight text-ink">{title}</h3>
        {body && <p className="mx-auto max-w-md text-pretty text-sm text-ink-muted">{body}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

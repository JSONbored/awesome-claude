import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  to?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search?: any;
}

export function Breadcrumbs({
  items,
  home = false,
  markLastAsCurrent = true,
  className,
}: {
  items: Crumb[];
  home?: boolean;
  /** Treat the final crumb as the current page. Disable for ancestor-only trails. */
  markLastAsCurrent?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0 text-xs", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {home && (
          <li className="flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-subtle transition-colors duration-200 ease-out hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Home"
            >
              <Home className="h-3 w-3" />
            </Link>
            <ChevronRight className="h-3 w-3 text-ink-subtle" aria-hidden />
          </li>
        )}
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          const isCurrent = markLastAsCurrent && isLast;
          return (
            <Fragment key={`${c.label}-${i}`}>
              <li className="min-w-0">
                {c.to && !isCurrent ? (
                  <Link
                    to={c.to}
                    params={c.params}
                    search={c.search}
                    className="rounded-md px-1.5 py-0.5 text-ink-muted transition-colors duration-200 ease-out hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "block truncate px-1.5 py-0.5 font-medium",
                      isCurrent ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {c.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden className="text-ink-subtle">
                  <ChevronRight className="h-3 w-3" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

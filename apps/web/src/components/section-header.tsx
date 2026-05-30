import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
  size?: "lg" | "md";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Standardized section header for consistent rhythm across every route.
 * eyebrow → title → description, with optional right-aligned action.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  size = "md",
  className,
  as = "h2",
}: Props) {
  const Title = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("min-w-0", align === "center" && "mx-auto")}>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <Title
          className={cn("text-ink text-balance", size === "lg" ? "h-display-1" : "h-display-2")}
        >
          {title}
        </Title>
        {description && (
          <p
            className={cn(
              "mt-3 text-pretty text-ink-muted",
              size === "lg" ? "max-w-2xl text-base sm:text-lg" : "max-w-xl text-sm sm:text-base",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

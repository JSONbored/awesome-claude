import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The canonical page frame. Matches the app shell's column (`max-w-page`,
 * `px-4 sm:px-6`) so every route lines up with the header and footer instead of
 * drifting to hand-picked widths. Vertical rhythm defaults to `py-10`; override
 * via `className` for the rare page that needs more or less.
 *
 * Width is intentionally fixed to the design-token column — long-form reading
 * width is handled by capping the inner content (e.g. `prose-editorial`), not by
 * shrinking the frame, so page gutters stay consistent everywhere.
 */
export function PageContainer({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-page px-4 py-10 sm:px-6", className)}>{children}</Tag>
  );
}

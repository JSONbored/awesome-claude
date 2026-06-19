import * as React from "react";
import { brandDisplayName, displayableBrandIconUrl, type BrandIconTarget } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  xs: "h-5 w-5",
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-14 w-14",
} as const;

export function EntryBrandMark({
  entry,
  size = "sm",
  priority = false,
  className,
}: {
  entry: BrandIconTarget;
  size?: keyof typeof SIZE_CLASS;
  priority?: boolean;
  className?: string;
}) {
  const src = displayableBrandIconUrl(entry);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background p-0.5 shadow-sm",
        SIZE_CLASS[size],
        className,
      )}
    >
      <img
        src={src}
        alt={`${brandDisplayName(entry)} logo`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

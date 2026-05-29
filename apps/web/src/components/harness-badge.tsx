import { cn } from "@/lib/utils";
import { IntegrationMark, platformMark } from "./integration-marks";
import { PLATFORM_LABEL, type Harness } from "@/types/registry";

export function HarnessBadge({
  id,
  size = "sm",
  className,
}: {
  id: Harness;
  size?: "xs" | "sm";
  className?: string;
}) {
  const mark = platformMark(id);
  const px = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-surface text-ink-muted",
        px,
        className,
      )}
      title={`Works with ${PLATFORM_LABEL[id]}`}
    >
      {mark && (
        <IntegrationMark name={mark} size={size === "xs" ? 10 : 11} className="opacity-80" />
      )}
      {PLATFORM_LABEL[id]}
    </span>
  );
}

export function HarnessBadgeRow({ ids, className }: { ids: Harness[]; className?: string }) {
  if (!ids?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {ids.map((id) => (
        <HarnessBadge key={id} id={id} />
      ))}
    </div>
  );
}

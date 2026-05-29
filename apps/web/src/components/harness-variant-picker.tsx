import { HARNESSES, type Harness } from "@/types/registry";
import { HarnessBadge } from "./harness-badge";
import { cn } from "@/lib/utils";

interface Props {
  available: Harness[];
  value: Harness | null;
  onChange: (h: Harness) => void;
  className?: string;
  labelId?: string;
}

/**
 * Small radiogroup that scopes install/config/full payloads to a specific
 * harness. Renders nothing when fewer than 2 variants exist.
 */
export function HarnessVariantPicker({ available, value, onChange, className, labelId }: Props) {
  if (!available || available.length < 2) return null;
  const ordered = HARNESSES.map((h) => h.id).filter((id) => available.includes(id));
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-label={labelId ? undefined : "Choose harness for snippet"}
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      {ordered.map((id) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                const idx = ordered.indexOf(value ?? ordered[0]!);
                onChange(ordered[(idx + 1) % ordered.length]!);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                const idx = ordered.indexOf(value ?? ordered[0]!);
                onChange(ordered[(idx - 1 + ordered.length) % ordered.length]!);
              }
            }}
            className={cn(
              "rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
              active ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100",
            )}
          >
            <HarnessBadge id={id} />
          </button>
        );
      })}
    </div>
  );
}

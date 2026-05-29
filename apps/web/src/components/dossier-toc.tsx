import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Right-rail table of contents with scroll-spy. Sections referenced by id
 * should set `scroll-mt-24` so the sticky header doesn't clip the heading.
 */
export function DossierTOC({ items, className }: { items: TocItem[]; className?: string }) {
  const ids = items.map((i) => i.id);
  const active = useScrollSpy(ids);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Section navigation" className={cn("text-sm", className)}>
      <div className="eyebrow mb-3">On this page</div>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                  isActive
                    ? "bg-surface-2 text-ink"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-3 w-0.5 rounded-full transition-colors duration-200 ease-out",
                    isActive ? "bg-accent" : "bg-transparent group-hover:bg-border-strong",
                  )}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

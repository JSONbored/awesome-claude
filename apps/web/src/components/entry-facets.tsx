import { type Entry } from "@/types/registry";
import { facetsFor, type Facet } from "@/lib/entry-facets-lib";
import { cn } from "@/lib/utils";

/**
 * Per-category facet row. Renders the category-specific metadata that the
 * generic card otherwise hides: hook trigger, command syntax, statusline
 * language, skill level, and collection items.
 *
 * `density="card"` is compact (chip row), `density="dossier"` is the richer
 * layout used on the entry page.
 */
export function EntryFacets({
  entry,
  density = "card",
  className,
}: {
  entry: Entry;
  density?: "card" | "dossier";
  className?: string;
}) {
  const facets = facetsFor(entry);
  if (facets.length === 0) return null;

  if (density === "card") {
    return (
      <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
        {facets.map((f, i) => (
          <FacetChip key={i} facet={f} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {facets.map((f, i) => (
        <div key={i} className="flex items-start gap-2 text-sm">
          {f.icon ? (
            <f.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
          ) : null}
          <div className="min-w-0">
            <span className="font-medium text-ink">{f.label}</span>{" "}
            <span className="text-ink-muted">{f.value}</span>
            {f.detail && <div className="mt-0.5 text-xs text-ink-subtle">{f.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FacetChip({ facet }: { facet: Facet }) {
  const Icon = facet.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]",
        facet.tone === "accent"
          ? "border-accent/30 bg-accent/10 text-accent-ink dark:text-accent"
          : "border-border bg-surface text-ink-muted",
        facet.mono && "font-mono",
      )}
      title={`${facet.label}: ${facet.value}`}
    >
      {Icon ? <Icon className="h-3 w-3" aria-hidden /> : null}
      <span className="text-ink-subtle">{facet.label}:</span>
      <span className="text-ink">{facet.value}</span>
    </span>
  );
}

import type { Entry } from "@/types/registry";

function sameIdentity(author: string, submittedBy?: string) {
  if (!submittedBy) return false;
  return author.trim().toLowerCase() === submittedBy.trim().toLowerCase();
}

/** Text-only attribution for compact surfaces that must not import registry data modules. */
export function EntryAttributionLabel({
  entry,
  className = "text-xs text-ink-subtle",
}: {
  entry: Entry;
  className?: string;
}) {
  if (entry.submittedBy && !sameIdentity(entry.author, entry.submittedBy)) {
    return (
      <span className={className}>
        by <span className="text-ink">{entry.author}</span>
        {" · submitted by "}
        <span className="text-ink">{entry.submittedBy}</span>
      </span>
    );
  }

  return (
    <span className={className}>
      by <span className="text-ink">{entry.author}</span>
    </span>
  );
}

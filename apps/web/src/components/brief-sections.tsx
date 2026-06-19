// Renders a persisted Weekly Brief (the buildWeeklyBrief payload shape) for the
// /brief/$number archive pages. Tolerant of partial payloads.

export type BriefSectionItem = {
  title?: string;
  url?: string;
  description?: string;
  reasons?: string[];
};

export type BriefSectionsData = {
  newEntries?: BriefSectionItem[];
  sourceBacked?: BriefSectionItem[];
  saferInstalls?: BriefSectionItem[];
  notableChanges?: BriefSectionItem[];
};

const SECTION_ORDER: Array<{ key: keyof BriefSectionsData; label: string }> = [
  { key: "newEntries", label: "New in the registry" },
  { key: "sourceBacked", label: "Source-backed picks" },
  { key: "saferInstalls", label: "Safer installs" },
  { key: "notableChanges", label: "Notable changes" },
];

function BriefSectionList({ label, items }: { label: string; items: BriefSectionItem[] }) {
  const rows = items.filter((item) => item?.title);
  if (rows.length === 0) return null;
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-base font-semibold text-ink">{label}</h2>
      <ul className="mt-3 space-y-3 text-sm">
        {rows.map((item, index) => {
          const sub = item.reasons?.[0] ?? item.description ?? "";
          return (
            <li key={`${item.url ?? item.title}-${index}`}>
              <a href={item.url || "#"} className="font-medium text-ink hover:underline">
                {item.title}
              </a>
              {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function BriefSections({ sections }: { sections: BriefSectionsData }) {
  const present = SECTION_ORDER.filter((s) => (sections[s.key] ?? []).length > 0);
  if (present.length === 0) {
    return <p className="text-sm text-ink-muted">No notable activity in this issue.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {present.map((s) => (
        <BriefSectionList key={s.key} label={s.label} items={sections[s.key] ?? []} />
      ))}
    </div>
  );
}

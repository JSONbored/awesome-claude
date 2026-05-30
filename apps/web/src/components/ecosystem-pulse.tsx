import { Link } from "@tanstack/react-router";
import { GitCommit, Users } from "lucide-react";
import { CHANGELOG } from "@/data/changelog";
import { CONTRIBUTORS } from "@/data/contributors";
import { CategoryPill } from "./badges";

const KIND_DOT: Record<string, string> = {
  added: "bg-trust-trusted",
  updated: "bg-accent",
  removed: "bg-trust-blocked",
};

export function EcosystemPulse() {
  const recent = CHANGELOG.slice(0, 4);
  const top = [...CONTRIBUTORS]
    .sort((a, b) => (b.acceptedCount ?? 0) - (a.acceptedCount ?? 0))
    .slice(0, 4);
  const counts = CHANGELOG.reduce(
    (acc, c) => {
      acc[c.kind] = (acc[c.kind] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <GitCommit className="h-3.5 w-3.5 text-ink-muted" />
            <div className="eyebrow">Registry pulse</div>
          </div>
          <Link to="/changelog" className="text-xs text-ink-muted hover:text-ink">
            Changelog →
          </Link>
        </div>
        <div className="flex items-center gap-4 border-b border-border px-4 py-3 text-xs tabular-nums">
          <span className="text-ink-muted">
            <span className="font-mono font-semibold text-ink">{counts.added ?? 0}</span> added
          </span>
          <span className="text-ink-muted">
            <span className="font-mono font-semibold text-ink">{counts.updated ?? 0}</span> updated
          </span>
          <span className="text-ink-muted">
            <span className="font-mono font-semibold text-ink">{counts.removed ?? 0}</span> removed
          </span>
          <span className="ml-auto text-ink-subtle">last 14 days</span>
        </div>
        <ul className="divide-y divide-border">
          {recent.map((c) => (
            <li key={c.ref} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span
                aria-hidden
                className={`mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${KIND_DOT[c.kind] ?? "bg-ink-subtle"}`}
              />
              {c.category ? <CategoryPill>{c.category}</CategoryPill> : null}
              <span className="line-clamp-1 flex-1 text-ink">{c.title}</span>
              <span className="font-mono text-[11px] text-ink-subtle">{c.date.slice(5)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-ink-muted" />
            <div className="eyebrow">Top contributors</div>
          </div>
          <Link to="/contributors" className="text-xs text-ink-muted hover:text-ink">
            All →
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {top.map((c) => (
            <li key={c.slug}>
              <Link
                to="/contributors/$slug"
                params={{ slug: c.slug }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-2"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-semibold uppercase text-ink-muted">
                  {c.name.slice(0, 2)}
                </span>
                <span className="flex-1 truncate text-ink">{c.name}</span>
                <span className="font-mono text-[11px] text-ink-subtle">
                  {c.acceptedCount ?? 0} accepted
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

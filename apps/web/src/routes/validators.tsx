import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Github, FileJson, Terminal, ChevronDown } from "lucide-react";
import { VALIDATORS, EXPERTISE_OPTIONS, type Expertise } from "@/mocks/validators";
import { WatchButton } from "@/components/watch-button";
import { FilterChip, FilterChipGroup } from "@/components/filter-chip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/validators")({
  head: () => ({
    meta: [
      { title: "Validators — HeyClaude" },
      { name: "description", content: "The people who read source, check provenance, and sign off on registry entries." },
      { property: "og:title", content: "Validators — HeyClaude" },
      { property: "og:description", content: "Validator profiles, expertise tags, and the resources they've verified." },
      { property: "og:url", content: "/validators" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/validators" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "HeyClaude validators",
          itemListElement: VALIDATORS.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Person",
              name: v.name,
              alternateName: v.handle,
              description: v.bio,
              jobTitle: "Registry validator",
              knowsAbout: v.expertise,
              url: v.github,
            },
          })),
        }),
      },
    ],
  }),
  component: ValidatorsPage,
});

function ValidatorsPage() {
  const [active, setActive] = React.useState<Expertise | "all">("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const list = VALIDATORS.filter((v) => active === "all" || v.expertise.includes(active));

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <div className="eyebrow">Validators</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        Who signs off on what
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        Validators read source, check provenance, and review safety / privacy notes before an entry
        lands. Every approval is attributed.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <FilterChipGroup label="Filter validators by expertise" multi={false}>
          <FilterChip
            role="radio"
            size="md"
            active={active === "all"}
            onClick={() => setActive("all")}
          >
            All
          </FilterChip>
          {EXPERTISE_OPTIONS.map((e) => (
            <FilterChip
              key={e}
              role="radio"
              size="md"
              active={active === e}
              onClick={() => setActive(e)}
            >
              {e}
            </FilterChip>
          ))}
        </FilterChipGroup>
        <span className="ml-1 font-mono text-xs text-ink-subtle" aria-live="polite">
          {list.length} validators
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((v) => {
          const open = expanded === v.slug;
          return (
            <article key={v.slug} className="rounded-xl border border-border bg-surface">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-background font-display text-sm">
                    {v.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {v.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-muted">
                      <span className="font-mono">@{v.handle}</span>
                      <span>active since {v.activeSince}</span>
                    </div>
                  </div>
                  <a
                    href={v.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-ink-muted hover:text-ink"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </div>

                <p className="mt-3 text-sm text-ink-muted">{v.bio}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {v.expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-ink-muted"
                    >
                      {e}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <div className="inline-flex items-center gap-2 text-sm text-ink">
                    <ShieldCheck className="h-4 w-4 text-trust-trusted" />
                    <span className="font-display text-base font-semibold">{v.verifiedCount}</span>
                    <span className="text-xs text-ink-muted">verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WatchButton
                      id={`validator:${v.slug}`}
                      kind="validator"
                      label={v.name}
                      href="/validators"
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : v.slug)}
                      aria-expanded={open}
                      className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-xs font-medium text-ink-muted hover:text-ink"
                    >
                      Recent
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
                    </button>
                  </div>
                </div>
              </div>

              {open && (
                <ul className="border-t border-border">
                  {v.recent.map((r) => (
                    <li key={r.ref} className="flex items-center justify-between gap-3 border-b border-border px-5 py-2.5 last:border-0">
                      <div className="min-w-0">
                        <div className="truncate text-sm text-ink">{r.title}</div>
                        <code className="font-mono text-[11px] text-ink-subtle">{r.ref}</code>
                      </div>
                      <span className="font-mono text-[11px] text-ink-subtle">{r.verifiedAt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <section className="mt-16">
        <div className="eyebrow">Tools validators use</div>
        <h2 className="mt-2 h-display-2 text-ink text-balance">
          Browser-side validators
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Everything runs locally. Nothing is uploaded, logged, or sent to a server.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ToolCard
            icon={FileJson}
            title="SKILL.md package"
            blurb="Frontmatter, package references, checksum facts, submission metadata."
          />
          <ToolCard
            icon={Terminal}
            title="MCP config JSON"
            blurb="Server shape, package targets, placeholders, risky shell syntax, secret-like values."
          />
        </div>
      </section>

      <p className="mt-10 text-xs text-ink-subtle">
        Want to validate? Open a PR on the registry repo with a sign-off and we'll add you to the
        roster. See{" "}
        <Link to="/about" className="text-ink hover:underline">
          how the registry works
        </Link>
        .
      </p>
    </div>
  );
}

function ToolCard({
  icon: Icon,
  title,
  blurb,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-muted" />
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">{blurb}</p>
    </div>
  );
}

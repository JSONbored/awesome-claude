import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, ListChecks } from "lucide-react";
import { ENTRIES } from "@/mocks/entries";
import { MY_CLAIMS, CLAIM_TYPE_LABEL, CLAIM_STATE_META, type ClaimType } from "@/mocks/claims";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/claim")({
  head: () => ({
    meta: [
      { title: "Claim a listing — HeyClaude" },
      { name: "description", content: "Claim a HeyClaude listing, attach proof of ownership, and track claim status." },
    ],
  }),
  component: ClaimPage,
});

const PROOF_FIELDS = [
  { id: "github", label: "GitHub handle", placeholder: "@your-handle", help: "We verify push/admin on the linked repo." },
  { id: "repo", label: "Repo permission", placeholder: "owner/repo", help: "Public repo where you have admin or maintain." },
  { id: "package", label: "Package owner", placeholder: "npm: @scope/pkg or PyPI handle", help: "Optional but speeds up review." },
  { id: "domain", label: "Domain TXT record", placeholder: "heyclaude-claim=…", help: "Optional. Use for brand or domain ownership." },
  { id: "commit", label: "Signed commit", placeholder: "Commit SHA on the source repo", help: "Optional. GPG/SSH-signed commits speed up review." },
  { id: "link", label: "Public link", placeholder: "Tweet, blog post, or company page", help: "Optional. Public attestation from a known account." },
] as const;

const TYPE_OPTIONS: ClaimType[] = ["maintain", "transfer", "correct", "remove"];

function ClaimPage() {
  const [done, setDone] = React.useState(false);
  const [type, setType] = React.useState<ClaimType>("maintain");
  const [query, setQuery] = React.useState("");
  const [picked, setPicked] = React.useState<(typeof ENTRIES)[number] | null>(null);
  const [proof, setProof] = React.useState<Record<string, string>>({});

  const matches = React.useMemo(() => {
    if (!query || picked) return [];
    const q = query.toLowerCase();
    return ENTRIES.filter((e) =>
      e.title.toLowerCase().includes(q) || e.slug.includes(q) || e.author.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query, picked]);

  const filled = PROOF_FIELDS.filter((f) => (proof[f.id] ?? "").trim().length > 0);

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-trust-trusted/15">
          <Check className="h-6 w-6 text-trust-trusted" />
        </div>
        <h1 className="mt-4 h-display-2 text-ink text-balance">Claim submitted</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We'll verify the proof you attached and reply on GitHub. You can watch the status in the table below.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setPicked(null);
            setQuery("");
            setProof({});
          }}
          className="mt-6 inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2"
        >
          File another claim
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <div className="eyebrow">Maintainer</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        Claim a listing
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        Take ownership of an entry, transfer it, request a correction, or pull it down. The more
        proof you attach, the faster review goes.
      </p>

      <form
        className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <div className="space-y-6">
          <Card title="1. Pick the listing">
            <div className="relative">
              {picked ? (
                <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm text-ink">{picked.title}</div>
                    <div className="truncate font-mono text-[11px] text-ink-subtle">
                      {picked.category}/{picked.slug} · @{picked.author}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPicked(null);
                      setQuery("");
                    }}
                    className="text-xs text-ink-muted hover:text-ink"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, slug, or author"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                  />
                  {matches.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-auto rounded-md border border-border bg-surface shadow-sm">
                      {matches.map((m) => (
                        <li key={`${m.category}/${m.slug}`}>
                          <button
                            type="button"
                            onClick={() => setPicked(m)}
                            className="block w-full px-3 py-2 text-left hover:bg-surface-2"
                          >
                            <div className="text-sm text-ink">{m.title}</div>
                            <div className="font-mono text-[11px] text-ink-subtle">
                              {m.category}/{m.slug}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </Card>

          <Card title="2. Claim type">
            <div className="grid gap-2 sm:grid-cols-2">
              {TYPE_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-sm transition-colors duration-200 ease-out",
                    type === t
                      ? "border-ink bg-ink text-background"
                      : "border-border bg-background text-ink hover:bg-surface-2",
                  )}
                >
                  {CLAIM_TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </Card>

          <Card title="3. Proof of ownership">
            <div className="space-y-3">
              {PROOF_FIELDS.map((f) => (
                <label key={f.id} className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink">{f.label}</span>
                    <span className="text-[11px] text-ink-subtle">{f.help}</span>
                  </div>
                  <input
                    value={proof[f.id] ?? ""}
                    onChange={(e) => setProof((p) => ({ ...p, [f.id]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!picked || filled.length === 0}
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              File claim
            </button>
            <span className="text-xs text-ink-subtle">
              {filled.length} of {PROOF_FIELDS.length} proof fields filled
            </span>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-ink-muted" />
              <div className="eyebrow">Reviewer checklist</div>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {PROOF_FIELDS.map((f) => {
                const ok = (proof[f.id] ?? "").trim().length > 0;
                return (
                  <li key={f.id} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border",
                        ok ? "border-trust-trusted bg-trust-trusted/15 text-trust-trusted" : "border-border text-ink-subtle",
                      )}
                    >
                      {ok ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className={cn("text-xs", ok ? "text-ink" : "text-ink-muted")}>{f.label}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-[11px] text-ink-subtle">
              GitHub handle + repo permission is usually enough. Extra proof speeds up review.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-ink-muted" />
              <div className="eyebrow">What we never do</div>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
              <li>· Auto-merge claims without a maintainer review.</li>
              <li>· Email anyone other than the GitHub identity on file.</li>
              <li>· Share proof attachments outside the review thread.</li>
            </ul>
          </div>
        </aside>
      </form>

      <section className="mt-16">
        <h2 className="h-display-2 text-ink text-balance">My claims</h2>
        <p className="mt-2 text-sm text-ink-muted">Mock data for now — wired to /api/claims later.</p>
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="hidden grid-cols-[80px_1fr_160px_120px_120px] gap-4 border-b border-border bg-surface-2 px-5 py-2 text-[11px] uppercase tracking-wider text-ink-subtle md:grid">
            <span>ID</span>
            <span>Listing</span>
            <span>Type</span>
            <span>Submitted</span>
            <span>Status</span>
          </div>
          {MY_CLAIMS.map((c) => {
            const meta = CLAIM_STATE_META[c.state];
            return (
              <div key={c.id} className="border-b border-border px-5 py-4 last:border-0">
                <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[80px_1fr_160px_120px_120px] md:gap-4">
                  <code className="font-mono text-xs text-ink-subtle">{c.id}</code>
                  <div>
                    <div className="text-sm font-medium text-ink">{c.entryTitle}</div>
                    <code className="font-mono text-[11px] text-ink-subtle">{c.entryRef}</code>
                  </div>
                  <span className="text-xs text-ink-muted">{CLAIM_TYPE_LABEL[c.type]}</span>
                  <span className="font-mono text-xs text-ink-subtle">{c.submittedAt}</span>
                  <span className={cn("inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[11px]", meta.tone)}>
                    {meta.label}
                  </span>
                </div>
                {c.reviewerNote && (
                  <div className="mt-2 text-xs text-ink-muted md:pl-[88px]">
                    <span className="font-mono text-ink-subtle">reviewer · </span>
                    {c.reviewerNote}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5 md:pl-[88px]">
                  {c.proof.map((p, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px]",
                        p.verified
                          ? "border-trust-trusted/40 bg-trust-trusted/10 text-ink"
                          : "border-border bg-background text-ink-muted",
                      )}
                    >
                      {p.verified && <Check className="h-3 w-3" />}
                      <span className="font-mono">{p.kind}:</span> {p.value}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-subtle">
          Want to file a fresh submission instead?{" "}
          <Link to="/submit" className="text-ink hover:underline">
            Submit a resource →
          </Link>
        </p>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="eyebrow mb-3">{title}</div>
      {children}
    </div>
  );
}

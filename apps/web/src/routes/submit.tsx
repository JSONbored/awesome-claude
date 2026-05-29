import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Check, Info, ShieldAlert } from "lucide-react";
import { CATEGORIES, type Category } from "@/types/registry";
import { SUBMISSION_SPEC, preflight, buildIssueDraft, type SpecField } from "@/lib/submission-spec";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a resource — HeyClaude" },
      { name: "description", content: "Submit a Claude workflow resource for review. Free, source-backed, useful." },
      { property: "og:title", content: "Submit a resource — HeyClaude" },
      { property: "og:description", content: "Free, source-backed, useful. Paid tools route to the commercial intake." },
    ],
  }),
  component: SubmitPage,
});

const STEPS = ["Category", "Details", "Safety & privacy", "Review"] as const;

function SubmitPage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | "">("");
  const [data, setData] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const spec = category ? SUBMISSION_SPEC[category] : null;
  const issues = useMemo(() => preflight(category, data), [category, data]);
  const blockers = issues.filter((i) => i.kind === "blocker");
  const issueDraft = useMemo(() => buildIssueDraft(category, data), [category, data]);

  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-trust-trusted/15">
          <Check className="h-6 w-6 text-trust-trusted" />
        </div>
        <h1 className="mt-4 h-display-2 text-ink text-balance">Submission received</h1>
        <p className="mt-2 text-sm text-ink-muted">
          A maintainer will review provenance, safety notes, and metadata. Expect a response within a week.
        </p>
      </div>
    );
  }

  const canContinue = step === 0 ? !!category : step === 3 ? blockers.length === 0 : true;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="eyebrow">Contribute</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        Submit a resource
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Free, source-backed, useful. Commercial tools go through{" "}
        <a href="/advertise" className="text-ink underline">advertise</a>. Jobs go through{" "}
        <a href="/jobs/post" className="text-ink underline">post a job</a>.
      </p>

      <ol className="mt-8 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex flex-col gap-1 border-t-2 pt-2 text-xs",
              i <= step ? "border-ink text-ink" : "border-border text-ink-subtle",
            )}
          >
            <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium">{s}</span>
          </li>
        ))}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!canContinue) return;
          if (step < STEPS.length - 1) setStep((s) => s + 1);
          else setDone(true);
        }}
        className="mt-8 rounded-xl border border-border bg-surface p-6"
      >
        {step === 0 && (
          <div>
            <div className="eyebrow mb-3">Category</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.id);
                    setData({});
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-3 text-left text-sm transition-colors duration-200 ease-out",
                    category === c.id
                      ? "border-ink bg-ink text-background"
                      : "border-border bg-background text-ink hover:bg-surface-2",
                  )}
                >
                  <div className="font-medium">{c.label}</div>
                  <div className={cn("mt-0.5 text-[11px]", category === c.id ? "text-background/70" : "text-ink-muted")}>
                    {c.blurb}
                  </div>
                </button>
              ))}
            </div>
            {spec && (
              <p className="mt-4 text-xs text-ink-muted">{spec.blurb}</p>
            )}
            {category === "tools" && (
              <div className="mt-4 rounded-md border border-border bg-background p-3 text-xs text-ink-muted">
                Commercial tools use a separate intake.{" "}
                <a href="/advertise" className="text-ink underline">Go to commercial intake →</a>
              </div>
            )}
          </div>
        )}

        {step === 1 && spec && (
          <div className="space-y-4">
            {spec.fields.map((f) => (
              <FieldRender key={f.key} field={f} value={data[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
            ))}
          </div>
        )}

        {step === 2 && spec && (
          <div className="space-y-4">
            {spec.riskBearing ? (
              <p className="text-sm text-ink-muted">
                This category can affect the user's filesystem, network, or credentials. Reviewers expect
                explicit safety and privacy notes.
              </p>
            ) : (
              <p className="text-sm text-ink-muted">
                Optional for this category, but encouraged if the resource has any runtime side effects.
              </p>
            )}
            <TextArea
              label={spec.riskBearing ? "Safety notes *" : "Safety notes"}
              value={data.safetyNotes ?? ""}
              onChange={(v) => set("safetyNotes", v)}
              examples={spec.exampleSafety}
            />
            <TextArea
              label="Privacy notes"
              value={data.privacyNotes ?? ""}
              onChange={(v) => set("privacyNotes", v)}
              examples={spec.examplePrivacy}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <div className="eyebrow mb-2">Preflight</div>
              {issues.length === 0 ? (
                <div className="flex items-center gap-2 rounded-md border border-trust-trusted/40 bg-trust-trusted/10 px-3 py-2 text-sm text-ink">
                  <Check className="h-4 w-4 text-trust-trusted" /> All checks pass.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {issues.map((it, idx) => (
                    <li
                      key={idx}
                      className={cn(
                        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
                        it.kind === "blocker" && "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
                        it.kind === "warning" && "border-trust-review/40 bg-trust-review/10 text-ink",
                        it.kind === "info" && "border-border bg-background text-ink-muted",
                      )}
                    >
                      {it.kind === "blocker" ? (
                        <ShieldAlert className="mt-0.5 h-4 w-4 text-trust-blocked" />
                      ) : it.kind === "warning" ? (
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-trust-review" />
                      ) : (
                        <Info className="mt-0.5 h-4 w-4 text-ink-muted" />
                      )}
                      <span>{it.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="eyebrow">Issue draft</div>
                <CopyButton value={issueDraft} label="Copy" />
              </div>
              <pre className="overflow-auto rounded-md border border-border bg-background p-3 text-[11px] text-ink"><code>{issueDraft}</code></pre>
              <p className="mt-2 text-xs text-ink-muted">
                Prefer GitHub?{" "}
                <a
                  className="text-ink underline"
                  href="https://github.com/jsonbored/awesome-claude/issues/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open this as an issue
                </a>{" "}
                instead — maintainers pick it up either way.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-ink-muted hover:text-ink disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={!canContinue}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-40"
          >
            {step === STEPS.length - 1 ? "Submit for review" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldRender({ field, value, onChange }: { field: SpecField; value: string; onChange: (v: string) => void }) {
  const id = `f-${field.key}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-1.5 block">
        {field.label}{field.required && " *"}
      </label>
      {field.kind === "textarea" || field.kind === "code" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={field.kind === "code" ? 8 : 3}
          placeholder={field.placeholder}
          maxLength={field.maxLen}
          className={cn(
            "w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40",
            field.kind === "code" && "font-mono text-xs",
          )}
        />
      ) : field.kind === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.kind === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          maxLength={field.maxLen}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      )}
      {field.help && <p className="mt-1 text-[11px] text-ink-subtle">{field.help}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  examples,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  examples?: string[];
}) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      {examples && examples.length > 0 && (
        <div className="mt-1.5 text-[11px] text-ink-subtle">
          Examples: {examples.map((e, i) => (
            <span key={i}>
              <em>{e}</em>{i < examples.length - 1 && " · "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

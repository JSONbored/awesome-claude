import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  GitPullRequest,
  Info,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { CATEGORIES, type Category } from "@/types/registry";
import {
  SUBMISSION_SPEC,
  buildSubmissionPacket,
  preflight,
  slugify,
  type SpecField,
} from "@/lib/submission-spec";
import { logClientError } from "@/lib/client-logs";
import { safeGitHubAuthUrl } from "@/lib/github-auth-url-lib";
import { siteConfig } from "@/lib/site";
import { originFor, safeUrlForOrigins } from "@/lib/submit-url-safety-lib";
import { CopyButton } from "@/components/copy-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a resource - HeyClaude" },
      {
        name: "description",
        content: "Submit a Claude workflow resource for PR-first private-gate review.",
      },
      { property: "og:title", content: "Submit a resource - HeyClaude" },
      {
        property: "og:description",
        content: "Free, source-backed, useful. Paid tools route to the commercial intake.",
      },
      { property: "og:url", content: absoluteUrl("/submit") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/submit") }],
  }),
  component: SubmitPage,
});

const STEPS = ["Category", "Details", "Safety & privacy", "Review"] as const;

type PreflightResponse = {
  ok: true;
  valid: boolean;
  routeSuggestion: "submit_pr" | "fix_required" | "route_away" | "manual_review";
  category?: string;
  slug?: string;
  prPreview?: {
    title: string;
    targetPath: string;
    branchHint: string;
    baseRef: string;
    body: string;
  };
  blockers?: Array<{ code: string; message: string }>;
  warnings?: Array<{ code: string; message: string }>;
  duplicates?: Array<{
    key: string;
    title: string;
    url: string;
    reasons: string[];
    reasonLabels?: string[];
  }>;
  nextAction?: {
    label: string;
    url?: string;
  };
};

function safeGateStatusUrl(value: string | undefined) {
  const gateOrigin = originFor(siteConfig.submissionGateUrl);
  return safeUrlForOrigins(value, new Set(gateOrigin ? [gateOrigin] : []));
}

function sanitizePreflightResponse(payload: PreflightResponse) {
  const siteOrigin = originFor(siteConfig.url);
  if (!payload.nextAction?.url || !siteOrigin) return payload;
  const safeNextUrl = safeUrlForOrigins(
    payload.nextAction.url,
    new Set([siteOrigin]),
    siteConfig.url,
  );
  return {
    ...payload,
    nextAction: {
      ...payload.nextAction,
      ...(safeNextUrl ? { url: safeNextUrl } : { url: undefined }),
    },
  };
}

type SubmitResult = {
  statusUrl?: string;
  manualPr?: {
    targetPath: string;
    branchName: string;
    baseRef: string;
    body: string;
  };
};

function SubmitPage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | "">("");
  const [data, setData] = useState<Record<string, string>>({});
  const [done, setDone] = useState<SubmitResult | null>(null);
  const [preflightResult, setPreflightResult] = useState<PreflightResponse | null>(null);
  const [preflightError, setPreflightError] = useState("");
  const [preflightBusy, setPreflightBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitBusy, setSubmitBusy] = useState(false);

  const spec = category ? SUBMISSION_SPEC[category] : null;
  const issues = useMemo(() => preflight(category, data), [category, data]);
  const blockers = issues.filter((i) => i.kind === "blocker");
  const prPacket = useMemo(
    () => preflightResult?.prPreview?.body ?? buildSubmissionPacket(category, data),
    [category, data, preflightResult],
  );
  const prTitle =
    preflightResult?.prPreview?.title ?? `Add ${category || "Entry"}: ${data.name || "(untitled)"}`;
  const prTarget = preflightResult?.prPreview?.targetPath || "content/<category>/<slug>.mdx";

  const set = (key: string, value: string) => {
    setPreflightResult(null);
    setPreflightError("");
    setSubmitError("");
    setData((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.slug?.trim()) next.slug = slugify(value);
      return next;
    });
  };

  async function runServerPreflight() {
    if (!category) return null;
    setPreflightBusy(true);
    setPreflightError("");
    try {
      const response = await fetch("/api/submissions/preflight", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fields: { ...data, category } }),
      });
      const payload = (await response.json().catch(() => null)) as PreflightResponse | null;
      if (!response.ok || !payload?.ok) {
        throw new Error("Server preflight failed. Retry before continuing to GitHub.");
      }
      const safePayload = sanitizePreflightResponse(payload);
      setPreflightResult(safePayload);
      return safePayload;
    } catch (error) {
      logClientError("submission.preflight.client_error", error, {
        category,
      });
      const message = error instanceof Error ? error.message : "Server preflight failed.";
      setPreflightError(message);
      return null;
    } finally {
      setPreflightBusy(false);
    }
  }

  async function continueWithGitHub() {
    if (!category || submitBusy) return;
    setSubmitBusy(true);
    setSubmitError("");
    trackEvent("submit-start", { category });
    try {
      if (!siteConfig.submissionGateUrl) {
        trackEvent("submit-success", { category, path: "manual" });
        setDone({
          manualPr: {
            targetPath: prTarget,
            branchName:
              preflightResult?.prPreview?.branchHint ||
              `heyclaude/submit-${category}-${data.slug || slugify(data.name || "")}`,
            baseRef: preflightResult?.prPreview?.baseRef || "main",
            body: prPacket,
          },
        });
        return;
      }

      const endpoint = new URL("/drafts", siteConfig.submissionGateUrl).toString();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fields: { ...data, category } }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        configured?: boolean;
        authUrl?: string;
        statusUrl?: string;
        manualPr?: SubmitResult["manualPr"];
        error?: string;
      } | null;
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "The private submission gate rejected the draft.");
      }
      trackEvent("submit-success", { category, path: "gate" });
      const authUrl = payload.authUrl ? safeGitHubAuthUrl(payload.authUrl) : "";
      if (payload.authUrl && !authUrl) {
        throw new Error("The submission gate returned an invalid GitHub auth URL.");
      }
      if (authUrl) {
        window.location.assign(authUrl);
        return;
      }
      const statusUrl = safeGateStatusUrl(payload.statusUrl);
      if (payload.statusUrl && !statusUrl) {
        throw new Error("The submission gate returned an invalid status URL.");
      }
      setDone({ statusUrl, manualPr: payload.manualPr });
    } catch (error) {
      logClientError("submission.submit.client_error", error, {
        category,
      });
      setSubmitError(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setSubmitBusy(false);
    }
  }

  useEffect(() => {
    if (step === 3 && category && blockers.length === 0 && !preflightResult && !preflightBusy) {
      void runServerPreflight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, category, blockers.length]);

  if (done?.statusUrl || done?.manualPr) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-trust-trusted/15">
          <GitPullRequest className="h-6 w-6 text-trust-trusted" />
        </div>
        <h1 className="mt-4 h-display-2 text-ink text-balance">
          {done.statusUrl ? "Submission queued" : "Manual PR draft ready"}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {done.statusUrl
            ? "The private gate is handling the GitHub PR flow. The status page will update as the PR is created and reviewed."
            : "The private gate URL is not configured in this build. Create a single-entry PR with the file below; do not open a GitHub issue."}
        </p>
        {done.statusUrl && (
          <a
            href={done.statusUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
          >
            Open submission status
          </a>
        )}
        {done.manualPr && (
          <div className="mt-6 text-left">
            <div className="mb-2 flex items-center justify-between">
              <div className="eyebrow">{done.manualPr.targetPath}</div>
              <CopyButton value={done.manualPr.body} label="Copy" />
            </div>
            <pre className="max-h-[420px] overflow-auto rounded-md border border-border bg-background p-3 text-[11px] text-ink">
              <code>{done.manualPr.body}</code>
            </pre>
          </div>
        )}
      </div>
    );
  }

  const unsupportedWebCategory = Boolean(spec?.webOnly);
  const canContinue =
    step === 0 ? !!category && !unsupportedWebCategory : step === 3 ? blockers.length === 0 : true;
  const serverBlocked = Boolean(
    preflightResult &&
    (!preflightResult.valid ||
      ["fix_required", "route_away"].includes(preflightResult.routeSuggestion)),
  );
  const finalDisabled =
    !canContinue || preflightBusy || submitBusy || !preflightResult || serverBlocked;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="eyebrow">Contribute</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">Submit a resource</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Free, source-backed, useful. The site opens a single-entry GitHub PR for private-gate
        review. Commercial tools go through{" "}
        <a href="/advertise" className="text-ink underline">
          advertise
        </a>
        . Jobs go through{" "}
        <a href="/jobs/post" className="text-ink underline">
          post a job
        </a>
        .
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
          if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
            return;
          }
          if (!preflightResult) {
            void runServerPreflight();
            return;
          }
          if (!serverBlocked) void continueWithGitHub();
        }}
        className="mt-8 rounded-xl border border-border bg-surface p-6"
      >
        {step === 0 && (
          <div>
            <div className="eyebrow mb-3">Category</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((c) => {
                const categorySpec = SUBMISSION_SPEC[c.id];
                const disabled = Boolean(categorySpec.webOnly);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.id);
                      setData({});
                      setPreflightResult(null);
                      setPreflightError("");
                      setSubmitError("");
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-left text-sm transition-colors duration-200 ease-out",
                      category === c.id
                        ? "border-ink bg-ink text-background"
                        : "border-border bg-background text-ink hover:bg-surface-2",
                      disabled && "opacity-60",
                    )}
                  >
                    <div className="font-medium">{c.label}</div>
                    <div
                      className={cn(
                        "mt-0.5 text-[11px]",
                        category === c.id ? "text-background/70" : "text-ink-muted",
                      )}
                    >
                      {disabled ? "Maintainer-routed" : c.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
            {spec && <p className="mt-4 text-xs text-ink-muted">{spec.blurb}</p>}
            {unsupportedWebCategory && (
              <div className="mt-4 rounded-md border border-border bg-background p-3 text-xs text-ink-muted">
                This category is not enabled for website-created PRs yet. Use{" "}
                <a href="/advertise" className="text-ink underline">
                  commercial intake
                </a>{" "}
                for tools or contact a maintainer for special routing.
              </div>
            )}
          </div>
        )}

        {step === 1 && spec && (
          <div className="space-y-4">
            {spec.fields.map((f) => (
              <FieldRender
                key={f.key}
                field={f}
                value={data[f.key] ?? ""}
                onChange={(v) => set(f.key, v)}
              />
            ))}
          </div>
        )}

        {step === 2 && spec && (
          <div className="space-y-4">
            {spec.riskBearing ? (
              <p className="text-sm text-ink-muted">
                This category can affect files, network access, credentials, or runtime behavior.
                Safety and privacy notes are required, not optional.
              </p>
            ) : (
              <p className="text-sm text-ink-muted">
                Optional for this category, but add notes if the resource has runtime side effects.
              </p>
            )}
            <TextArea
              label={spec.riskBearing ? "Safety notes *" : "Safety notes"}
              value={data.safety_notes ?? ""}
              onChange={(v) => set("safety_notes", v)}
              examples={spec.exampleSafety}
            />
            <TextArea
              label={spec.riskBearing ? "Privacy notes *" : "Privacy notes"}
              value={data.privacy_notes ?? ""}
              onChange={(v) => set("privacy_notes", v)}
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
                  <Check className="h-4 w-4 text-trust-trusted" /> Local checks pass.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {issues.map((it, idx) => (
                    <PreflightRow key={idx} kind={it.kind} message={it.message} />
                  ))}
                </ul>
              )}
            </div>

            <ServerPreflightBlock
              result={preflightResult}
              error={preflightError}
              busy={preflightBusy}
              onRun={() => void runServerPreflight()}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="eyebrow">PR draft</div>
                <CopyButton value={prPacket} label="Copy" />
              </div>
              <div className="mb-2 grid gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ink-muted">
                <span>{prTitle}</span>
                <span>{prTarget}</span>
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-md border border-border bg-background p-3 text-[11px] text-ink">
                <code>{prPacket}</code>
              </pre>
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-ink-muted hover:text-ink disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={step === STEPS.length - 1 ? finalDisabled : !canContinue}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-40"
          >
            {step === STEPS.length - 1 && (preflightBusy || submitBusy) && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {step === STEPS.length - 1
              ? !preflightResult
                ? "Run server preflight"
                : serverBlocked
                  ? "Fix blockers"
                  : "Continue with GitHub"
              : "Continue"}
            {step === STEPS.length - 1 && !serverBlocked && preflightResult && (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function ServerPreflightBlock({
  result,
  error,
  busy,
  onRun,
}: {
  result: PreflightResponse | null;
  error: string;
  busy: boolean;
  onRun: () => void;
}) {
  if (busy) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Running server preflight...
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}{" "}
          <button type="button" onClick={onRun} className="font-medium underline">
            Retry
          </button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!result) {
    return (
      <button
        type="button"
        onClick={onRun}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-ink hover:bg-surface-2"
      >
        Run server preflight <ArrowRight className="h-4 w-4" />
      </button>
    );
  }

  const blockers = result.blockers ?? [];
  const warnings = result.warnings ?? [];
  const duplicates = result.duplicates ?? [];
  return (
    <div className="space-y-2">
      {result.valid && result.routeSuggestion === "submit_pr" ? (
        <div className="flex items-center gap-2 rounded-md border border-trust-trusted/40 bg-trust-trusted/10 px-3 py-2 text-sm text-ink">
          <Check className="h-4 w-4 text-trust-trusted" /> Preflight passed. The next step opens a
          single-entry PR through GitHub.
        </div>
      ) : result.routeSuggestion === "manual_review" ? (
        <div className="flex items-center gap-2 rounded-md border border-trust-review/40 bg-trust-review/10 px-3 py-2 text-sm text-ink">
          <ShieldAlert className="h-4 w-4 text-trust-review" /> This can be submitted, but the
          private gate will route it to manual maintainer review.
        </div>
      ) : (
        <div className="rounded-md border border-trust-blocked/40 bg-trust-blocked/10 px-3 py-2 text-sm text-ink">
          Server preflight found blockers. Fix these before submitting.
        </div>
      )}
      {blockers.map((item) => (
        <PreflightRow key={item.code} kind="blocker" message={item.message} />
      ))}
      {warnings.map((item) => (
        <PreflightRow key={`${item.code}:${item.message}`} kind="warning" message={item.message} />
      ))}
      {duplicates.map((item) => (
        <PreflightRow
          key={item.key}
          kind="warning"
          message={`Possible duplicate: ${item.key} (${(item.reasonLabels ?? item.reasons).join(", ")})`}
        />
      ))}
      {result.nextAction?.url && result.routeSuggestion !== "submit_pr" && (
        <a
          href={result.nextAction.url}
          className="inline-flex text-sm font-medium text-ink underline"
        >
          {result.nextAction.label}
        </a>
      )}
    </div>
  );
}

function PreflightRow({
  kind,
  message,
}: {
  kind: "blocker" | "warning" | "info";
  message: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
        kind === "blocker" && "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
        kind === "warning" && "border-trust-review/40 bg-trust-review/10 text-ink",
        kind === "info" && "border-border bg-background text-ink-muted",
      )}
    >
      {kind === "blocker" ? (
        <ShieldAlert className="mt-0.5 h-4 w-4 text-trust-blocked" />
      ) : kind === "warning" ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 text-trust-review" />
      ) : (
        <Info className="mt-0.5 h-4 w-4 text-ink-muted" />
      )}
      <span>{message}</span>
    </div>
  );
}

function FieldRender({
  field,
  value,
  onChange,
}: {
  field: SpecField;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `f-${field.key}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-1.5 block">
        {field.label}
        {field.required && " *"}
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
          <option value="">Select...</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
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
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-1.5 block">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      {examples && examples.length > 0 && (
        <div className="mt-1.5 text-[11px] text-ink-subtle">
          Examples:{" "}
          {examples.map((e, i) => (
            <span key={i}>
              <em>{e}</em>
              {i < examples.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export type SubmitReadinessItem = {
  label: string;
  ready: boolean;
};

export type SubmissionPreflightSummary = {
  state: "idle" | "loading" | "success" | "error";
  routeSuggestion?: "github_issue" | "fix_required" | "tools_form";
  blockers?: Array<{ code: string; message: string }>;
  warnings?: Array<{ code: string; message: string }>;
  duplicates?: Array<{
    key: string;
    title: string;
    url: string;
    reasons: string[];
  }>;
  risk?: {
    tier?: string;
    policyDecision?: string;
  };
  nextAction?: {
    label: string;
    url?: string;
  };
};

type SubmitReadinessCardProps = {
  category: string;
  items: SubmitReadinessItem[];
  sourceWarning: boolean;
  preflight?: SubmissionPreflightSummary;
};

function safeHttpUrl(value?: string) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export function SubmitReadinessCard({
  category,
  items,
  sourceWarning,
  preflight,
}: SubmitReadinessCardProps) {
  const missingItems = items.filter((item) => !item.ready);
  const blockers = preflight?.blockers ?? [];
  const warnings = preflight?.warnings ?? [];
  const duplicates = preflight?.duplicates ?? [];
  const nextActionLabel = preflight?.nextAction?.label;
  const nextActionHref = safeHttpUrl(preflight?.nextAction?.url);

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3 text-xs leading-6 text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-foreground">
          Submission readiness
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {preflight?.state === "loading" ? (
            <span role="status" aria-live="polite">
              Checking...
            </span>
          ) : null}
          {preflight?.risk?.tier ? (
            <span className="rounded-full border border-border bg-card px-2 py-0.5">
              {preflight.risk.tier} risk
            </span>
          ) : null}
          <span>
            {category
              ? missingItems.length === 0
                ? "Likely to pass required field checks"
                : `${missingItems.length} required field${
                    missingItems.length === 1 ? "" : "s"
                  } missing`
              : "Select a category to preview required fields"}
          </span>
        </div>
      </div>
      {items.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card/70 px-3 py-2"
            >
              <span>{item.label}</span>
              <span
                className={item.ready ? "text-primary" : "text-destructive"}
              >
                {item.ready ? "ready" : "missing"}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {sourceWarning ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Source URL is not currently required by the validator, but submissions
          without GitHub or docs links are harder to review and may need
          follow-up before maintainer review.
        </p>
      ) : null}
      {preflight?.state === "error" ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Live preflight is temporarily unavailable. The final submission
          endpoint will still run the same validation before creating an issue.
        </p>
      ) : null}
      {blockers.length ? (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
          <p className="font-medium text-foreground">Fix before submitting</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {blockers.slice(0, 4).map((item, index) => (
              <li key={`${item.code}-${index}`}>{item.message}</li>
            ))}
            {blockers.length > 4 ? <li>+{blockers.length - 4} more</li> : null}
          </ul>
        </div>
      ) : null}
      {warnings.length ? (
        <div className="mt-3 rounded-lg border border-border bg-card/70 px-3 py-2">
          <p className="font-medium text-foreground">Review notes</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {warnings.slice(0, 5).map((item, index) => (
              <li key={`${item.code}-${index}`}>{item.message}</li>
            ))}
            {warnings.length > 5 ? <li>+{warnings.length - 5} more</li> : null}
          </ul>
        </div>
      ) : null}
      {duplicates.length ? (
        <div className="mt-3 rounded-lg border border-border bg-card/70 px-3 py-2">
          <p className="font-medium text-foreground">Possible duplicates</p>
          <ul className="mt-1 space-y-1">
            {duplicates.map((item) => {
              const href = safeHttpUrl(item.url);
              return (
                <li key={item.key}>
                  {href ? (
                    <a
                      href={href}
                      className="text-primary underline underline-offset-4"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span>{item.title}</span>
                  )}{" "}
                  {item.reasons?.length ? (
                    <span>({item.reasons.join(", ")})</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {nextActionHref ? (
        <p className="mt-3">
          Suggested next step:{" "}
          <a
            href={nextActionHref}
            className="text-primary underline underline-offset-4"
          >
            {nextActionLabel}
          </a>
          .
        </p>
      ) : nextActionLabel ? (
        <p className="mt-3">Suggested next step: {nextActionLabel}.</p>
      ) : null}
    </div>
  );
}

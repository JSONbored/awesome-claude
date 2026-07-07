import { useState, type FormEvent } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/api/newsletter";
import { trackEvent } from "@/lib/analytics";
import {
  newsletterSubscribeAnalyticsData,
  newsletterSubscribeAnalyticsEvent,
} from "@/lib/conversion-cta-events";
import { cn } from "@/lib/utils";

type Variant = "quiet" | "card" | "footer-strip";

interface Props {
  variant?: Variant;
  title?: string;
  description?: string;
  cadence?: string;
  className?: string;
  source?: string;
}

const DEFAULTS = {
  title: "Get the weekly brief",
  description: "One calm read on Claude workflows. Sundays. No tracking pixels.",
  cadence: "Weekly · Sundays",
};

export function NewsletterInline({
  variant = "quiet",
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  cadence = DEFAULTS.cadence,
  className,
  source = "inline",
}: Props) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Double opt-in: a confirmation email was sent; the user must click to finish.
  const successMessage = pending ? "Check your inbox to confirm." : "You're subscribed.";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setBusy(true);
    setError("");
    const result = await subscribeToNewsletter({ email, source });
    setBusy(false);
    if (result.ok) {
      setDone(true);
      setPending(result.pending);
      trackEvent(
        newsletterSubscribeAnalyticsEvent(),
        newsletterSubscribeAnalyticsData(source, result.pending),
      );
      return;
    }
    setError(result.error);
  }

  if (variant === "footer-strip") {
    return (
      <div className={cn("border-t border-border bg-surface", className)}>
        <div className="mx-auto flex max-w-page flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Mail className="h-4 w-4 text-ink" aria-hidden />
            <span>
              <span className="font-medium text-ink">{title}.</span>{" "}
              <span className="text-ink-muted">{description}</span>
            </span>
          </div>
          <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2 sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={busy || done}
              className="inline-flex h-9 items-center gap-1 rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-60"
            >
              {done ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Subscribed
                </>
              ) : (
                <>Subscribe</>
              )}
            </button>
          </form>
          {done ? (
            <p className="text-xs text-ink-muted">{successMessage}</p>
          ) : (
            error && (
              <p role="alert" className="text-xs text-trust-blocked">
                {error}
              </p>
            )
          )}
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-br from-surface to-accent/5 p-6",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-ink" aria-hidden />
          <span className="eyebrow">{cadence}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={busy || done}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-60"
          >
            {done ? (
              <>
                <Check className="h-4 w-4" /> Subscribed
              </>
            ) : (
              <>
                Subscribe <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        <p className="mt-3 text-[11px] text-ink-subtle">
          {done
            ? successMessage
            : error || "Unsubscribe any time. No tracking pixels. No partner blasts."}
        </p>
      </section>
    );
  }

  // quiet
  return (
    <section
      className={cn(
        "rounded-xl border border-dashed border-border bg-surface/60 px-5 py-5",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Mail className="h-3.5 w-3.5 text-ink-muted" aria-hidden />
            {title}
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        </div>
        <form onSubmit={onSubmit} className="flex w-full items-center gap-2 sm:w-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 sm:w-64"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={busy || done}
            className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-medium text-ink hover:bg-surface-2 disabled:opacity-60"
          >
            {done ? (
              <>
                <Check className="h-3.5 w-3.5" /> Done
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
      {done ? (
        <p className="mt-2 text-xs text-ink-muted">{successMessage}</p>
      ) : (
        error && (
          <p role="alert" className="mt-2 text-xs text-trust-blocked">
            {error}
          </p>
        )
      )}
    </section>
  );
}

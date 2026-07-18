import { toolListingTierInterest } from "@/lib/tool-listing-tier-lib";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CommercialDisclosure } from "@/components/commercial-disclosure";
import { trackEvent } from "@/lib/analytics";
import { absoluteUrl } from "@/lib/seo";
import { submitListingLead } from "@/lib/listing-lead-client";
import {
  toolsSubmitAdvertiseAnalyticsData,
  toolsSubmitAdvertiseAnalyticsEvent,
  toolsSubmitChromeDestination,
  toolsSubmitClaimAnalyticsData,
  toolsSubmitClaimAnalyticsEvent,
  toolsSubmitCommunityAnalyticsData,
  toolsSubmitCommunityAnalyticsEvent,
  toolsSubmitListingSubmitAnalyticsData,
  toolsSubmitListingSubmitAnalyticsEvent,
  toolsSubmitReviewSubmitAnalyticsData,
  toolsSubmitReviewSubmitAnalyticsEvent,
  toolsSubmitToolsAnalyticsData,
  toolsSubmitToolsAnalyticsEvent,
} from "@/lib/tools-submit-page-cta-events";

export const Route = createFileRoute("/tools/submit")({
  head: () => ({
    meta: [
      { title: "Submit a commercial tool — HeyClaude" },
      {
        name: "description",
        content:
          "Route commercial Claude tools, sponsorships, listing claims, and paid review interest through HeyClaude lead capture.",
      },
      { property: "og:url", content: absoluteUrl("/tools/submit") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/tools/submit") }],
  }),
  component: SubmitTool,
});

function SubmitTool() {
  const toolsDestination = toolsSubmitChromeDestination("tools");
  const communityDestination = toolsSubmitChromeDestination("community");
  const advertiseDestination = toolsSubmitChromeDestination("advertise");
  const claimDestination = toolsSubmitChromeDestination("claim");

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
      <Breadcrumbs
        home
        items={[
          {
            label: "Tools",
            to: toolsDestination?.to ?? "/tools",
            onClick: () =>
              trackEvent(
                toolsSubmitToolsAnalyticsEvent(),
                toolsSubmitToolsAnalyticsData("breadcrumb"),
              ),
          },
          { label: "Submit" },
        ]}
      />
      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="eyebrow">Commercial routing</div>
        <h1 className="mt-3 h-display-1 text-ink text-balance">Submit a commercial tool</h1>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Free, source-backed resources belong in the community directory via{" "}
          {communityDestination ? (
            <Link
              to={communityDestination.to}
              className="text-ink underline"
              onClick={() =>
                trackEvent(
                  toolsSubmitCommunityAnalyticsEvent(),
                  toolsSubmitCommunityAnalyticsData(),
                )
              }
            >
              /submit
            </Link>
          ) : (
            "/submit"
          )}
          . Use the forms below for commercial listings, paid trust/source review interest, or route
          sponsorship and claim requests through the dedicated lead flows.
        </p>
      </section>

      <div className="mt-8 grid gap-8">
        <CommercialToolListingForm />
        <PaidReviewInterestForm />
        <CommercialDisclosure />
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="eyebrow">Other commercial paths</div>
          <p className="mt-2 text-sm text-ink-muted">
            Sponsorship slots and listing ownership use separate review queues.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {advertiseDestination ? (
              <Link
                to={advertiseDestination.to}
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
                onClick={() =>
                  trackEvent(
                    toolsSubmitAdvertiseAnalyticsEvent(),
                    toolsSubmitAdvertiseAnalyticsData("commercial-paths"),
                  )
                }
              >
                Sponsorship waitlist <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {claimDestination ? (
              <Link
                to={claimDestination.to}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium text-ink hover:bg-surface-2"
                onClick={() =>
                  trackEvent(
                    toolsSubmitClaimAnalyticsEvent(),
                    toolsSubmitClaimAnalyticsData("commercial-paths"),
                  )
                }
              >
                Claim a listing
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function CommercialToolListingForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const tierInterest = toolListingTierInterest(form.get("tierInterest"));
    trackEvent(
      toolsSubmitListingSubmitAnalyticsEvent(),
      toolsSubmitListingSubmitAnalyticsData(tierInterest),
    );
    setSubmitting(true);
    setError("");
    try {
      await submitListingLead({
        kind: "tool",
        tierInterest,
        contactName: String(form.get("contactName") ?? "").trim(),
        contactEmail: String(form.get("email") ?? "").trim(),
        companyName: String(form.get("company") ?? "").trim(),
        listingTitle: String(form.get("toolName") ?? "").trim(),
        websiteUrl: String(form.get("website") ?? "").trim(),
        message: String(form.get("notes") ?? "").trim(),
      });
      setDone(true);
    } catch {
      setError(
        "Tool listing interest could not be submitted. Check required fields and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="eyebrow">Commercial tool listing</div>
      <h2 className="mt-2 font-display text-xl font-semibold text-ink">
        Featured listing interest
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        For paid or commercial Claude tools that need a maintainer-reviewed listing path. This does
        not replace free community submissions.
      </p>
      {done ? (
        <p className="mt-4 text-sm text-trust-trusted">
          Interest received — we'll review fit and reply within two business days.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="contactName" label="Your name" required />
            <Field name="company" label="Company" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="email" label="Work email" type="email" required />
            <Field name="toolName" label="Tool name" required />
          </div>
          <Field
            name="website"
            label="Product URL"
            type="url"
            required
            placeholder="https://example.com"
          />
          <label className="block">
            <div className="eyebrow mb-1.5">Placement interest</div>
            <select
              name="tierInterest"
              defaultValue="featured"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-ink"
            >
              <option value="featured">Featured listing (waitlist)</option>
              <option value="sponsored">Sponsored placement (waitlist)</option>
            </select>
          </label>
          <TextArea name="notes" label="What should maintainers know?" rows={4} />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Submit listing interest"}
          </button>
          {error && <p className="text-sm text-trust-blocked">{error}</p>}
        </form>
      )}
    </section>
  );
}

function PaidReviewInterestForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const entryRef = String(form.get("entryRef") ?? "").trim();
    trackEvent(
      toolsSubmitReviewSubmitAnalyticsEvent(),
      toolsSubmitReviewSubmitAnalyticsData(Boolean(entryRef)),
    );
    setSubmitting(true);
    setError("");
    const notes = String(form.get("notes") ?? "").trim();
    try {
      await submitListingLead({
        kind: "tool",
        tierInterest: "standard",
        contactName: String(form.get("contactName") ?? "").trim(),
        contactEmail: String(form.get("email") ?? "").trim(),
        companyName: String(form.get("company") ?? "").trim(),
        listingTitle: "Paid trust/source review interest",
        websiteUrl: String(form.get("website") ?? "").trim(),
        message: ["interest:paid-trust-source-review", entryRef ? `Entry: ${entryRef}` : "", notes]
          .filter(Boolean)
          .join("\n\n"),
      });
      setDone(true);
    } catch {
      setError("Review interest could not be submitted. Check required fields and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="eyebrow">Paid review</div>
      <h2 className="mt-2 font-display text-xl font-semibold text-ink">
        Trust and source review interest
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Request a maintainer-led trust or source review for an existing or upcoming listing. This is
        separate from free community submissions and does not buy ranking.
      </p>
      {done ? (
        <p className="mt-4 text-sm text-trust-trusted">
          Review interest received — maintainers will confirm scope before any paid step.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="contactName" label="Your name" required />
            <Field name="company" label="Company or project" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="email" label="Work email" type="email" required />
            <Field
              name="entryRef"
              label="Entry reference (optional)"
              placeholder="category/slug or URL"
            />
          </div>
          <Field
            name="website"
            label="Source or product URL"
            type="url"
            required
            placeholder="https://github.com/org/repo"
          />
          <TextArea
            name="notes"
            label="What should the review cover?"
            rows={4}
            placeholder="Trust signals, source reachability, package provenance, or safety notes to verify."
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-ink hover:bg-surface-2 disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Submit review interest"}
          </button>
          {error && <p className="text-sm text-trust-blocked">{error}</p>}
        </form>
      )}
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="eyebrow mb-1.5">
        {label}
        {required && " *"}
      </div>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  rows = 4,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="eyebrow mb-1.5">
        {label}
        {required && " *"}
      </div>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

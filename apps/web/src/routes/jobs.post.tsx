import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { absoluteUrl } from "@/lib/seo";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { JobTier } from "@/types/registry";

export const Route = createFileRoute("/jobs/post")({
  head: () => ({
    meta: [
      { title: "Post a job — HeyClaude" },
      {
        name: "description",
        content: "Reach developers shipping Claude Code, MCP, and agent workflows.",
      },
      { property: "og:url", content: absoluteUrl("/jobs/post") },
    ],
    // ?tier=* variants are duplicates of the same page — consolidate onto the clean URL.
    links: [{ rel: "canonical", href: absoluteUrl("/jobs/post") }],
  }),
  component: PostJobPage,
});

const TIERS: { id: JobTier; label: string; price: string; bullets: string[] }[] = [
  {
    id: "free",
    label: "Community",
    price: "$0",
    bullets: ["Standard listing", "Source-verified", "30-day display"],
  },
  {
    id: "standard",
    label: "Standard",
    price: "$49",
    bullets: ["Everything in Community", "Pinned for 7 days", "Email digest"],
  },
  {
    id: "featured",
    label: "Featured",
    price: "$149",
    bullets: ["Top of the list", "Featured badge", "Cross-posted to Raycast extension"],
  },
  {
    id: "sponsored",
    label: "Sponsored",
    price: "$349",
    bullets: ["Maintainer-reviewed copy", "Long-form description", "Featured in Weekly Brief"],
  },
];

function PostJobPage() {
  const [tier, setTier] = useState<JobTier>("free");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const companyUrl = String(form.get("companyUrl") ?? "").trim();
    const applyUrl = String(form.get("applyUrl") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = [
      `Location: ${String(form.get("location") ?? "").trim()}`,
      `Employment type: ${String(form.get("employmentType") ?? "").trim()}`,
      `Compensation: ${String(form.get("compensation") ?? "").trim() || "Not provided"}`,
      "",
      String(form.get("description") ?? "").trim(),
    ].join("\n");

    try {
      const response = await fetch("/api/listing-leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "job",
          tierInterest: tier,
          contactName: company,
          contactEmail: email,
          companyName: company,
          listingTitle: title,
          websiteUrl: companyUrl,
          applyUrl,
          message,
        }),
      });
      if (!response.ok) throw new Error(`Lead intake returned ${response.status}`);
      setDone(true);
    } catch {
      setError("Job listing could not be submitted. Check required fields and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-trust-trusted/15">
          <Check className="h-6 w-6 text-trust-trusted" />
        </div>
        <h1 className="mt-4 h-display-2 text-ink text-balance">Listing received</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We'll verify the source and reach out within two business days.
        </p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm text-ink hover:bg-surface-2"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="eyebrow">Hiring</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">Post a role</h1>
      <p className="mt-2 text-sm text-ink-muted">
        All listings are reviewed for source authenticity. Featured and Sponsored tiers also get a
        copy pass from a maintainer.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTier(t.id)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors duration-200 ease-out",
              tier === t.id
                ? "border-ink bg-ink text-background"
                : "border-border bg-surface text-ink hover:bg-surface-2",
            )}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display font-semibold">{t.label}</span>
              <span className="font-mono text-sm">{t.price}</span>
            </div>
            <ul
              className={cn(
                "space-y-1 text-xs",
                tier === t.id ? "text-background/80" : "text-ink-muted",
              )}
            >
              {t.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
                  {b}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <form
        onSubmit={submitJob}
        className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6"
      >
        <Field name="title" label="Job title" required />
        <Field name="company" label="Company" required />
        <Field name="companyUrl" label="Company URL" type="url" required />
        <Field name="location" label="Location" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="employmentType"
            label="Employment type"
            placeholder="Full-time, Contract…"
            required
          />
          <Field name="compensation" label="Compensation" placeholder="$210k–$300k" />
        </div>
        <TextArea name="description" label="Description" required />
        <Field name="applyUrl" label="Apply URL" type="url" required />
        <Field
          name="email"
          label="Your email (we'll contact you for verification)"
          type="email"
          required
        />
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-xs text-ink-muted">
            Selected tier:{" "}
            <span className="font-medium text-ink">{TIERS.find((t) => t.id === tier)?.label}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
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

function TextArea({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="eyebrow mb-1.5">
        {label}
        {required && " *"}
      </div>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

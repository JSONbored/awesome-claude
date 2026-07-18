import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { CommercialDisclosure, CommercialLeadSuccess } from "@/components/commercial-disclosure";
import { submitListingLead } from "@/lib/listing-lead-client";
import { trackEvent } from "@/lib/analytics";
import {
  advertisePageEgressAnalyticsData,
  advertisePageEgressAnalyticsEvent,
  advertisePageEgressDestination,
  advertisePagePlanSelectAnalyticsData,
  advertisePagePlanSelectAnalyticsEvent,
  advertisePageSubmitAnalyticsData,
  advertisePageSubmitAnalyticsEvent,
  type AdvertisePagePlanId,
} from "@/lib/advertise-page-cta-events";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise on HeyClaude" },
      {
        name: "description",
        content:
          "Join the waitlist for featured listings, Brief sponsorships, and custom campaigns on HeyClaude.",
      },
      { property: "og:url", content: absoluteUrl("/advertise") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/advertise") }],
  }),
  component: AdvertisePage,
});

const PLANS: {
  id: AdvertisePagePlanId;
  name: string;
  price: string;
  tierInterest: "featured" | "sponsored";
  blurb: string;
  bullets: string[];
}[] = [
  {
    id: "featured",
    name: "Featured listing",
    price: "Waitlist",
    tierInterest: "featured",
    blurb: "Pinned slot in a category, labeled as sponsor. No fake organic placement.",
    bullets: ["One category", "Clear sponsor label", "Trust/source badges still apply"],
  },
  {
    id: "brief",
    name: "Brief sponsor",
    price: "Waitlist",
    tierInterest: "sponsored",
    blurb: "One transparent slot inside the Weekly Brief. Reviewed for fit.",
    bullets: ["Native section", "Topic alignment required", "Audited click reporting"],
  },
  {
    id: "custom",
    name: "Custom",
    price: "Review fit",
    tierInterest: "sponsored",
    blurb: "Hiring drives, launch coverage, MCP catalog placements.",
    bullets: ["Tailored scope", "Direct contact", "No dark patterns"],
  },
];

function AdvertisePage() {
  const [planId, setPlanId] = useState<AdvertisePagePlanId>(PLANS[0].id);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = PLANS.find((plan) => plan.id === planId) ?? PLANS[0];

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    trackEvent(advertisePageSubmitAnalyticsEvent(), advertisePageSubmitAnalyticsData(planId));
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const contactName = String(form.get("contactName") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const website = String(form.get("website") ?? "").trim();
    const launch = String(form.get("launch") ?? "").trim();

    try {
      await submitListingLead({
        kind: "tool",
        tierInterest: selectedPlan.tierInterest,
        contactName,
        contactEmail: email,
        companyName: company,
        listingTitle: `${selectedPlan.name} interest`,
        websiteUrl: website,
        message: [`Plan: ${selectedPlan.name}`, launch ? `Launch context: ${launch}` : ""]
          .filter(Boolean)
          .join("\n\n"),
      });
      setDone(true);
    } catch {
      setError("Sponsorship interest could not be submitted. Check required fields and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <CommercialLeadSuccess
        title="Interest received"
        body="We'll review fit and reply within two business days. Paid placements are labeled and never affect organic ranking."
        action={(() => {
          const destination = advertisePageEgressDestination("retry");
          if (!destination) return null;
          return (
            <Link
              to={destination.to}
              className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm text-ink hover:bg-surface-2"
              onClick={() => {
                trackEvent(
                  advertisePageEgressAnalyticsEvent(),
                  advertisePageEgressAnalyticsData("retry"),
                );
                setDone(false);
              }}
            >
              Submit another request
            </Link>
          );
        })()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="eyebrow">Sponsorship</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        Reach the people building with Claude.
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        Sponsorships are transparent and labeled. We don't sell ranking. Trust badges always reflect
        registry metadata, not payment. Join the waitlist — pricing and scope are confirmed after
        maintainer review.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={planId === p.id}
            onClick={() => {
              setPlanId(p.id);
              trackEvent(
                advertisePagePlanSelectAnalyticsEvent(),
                advertisePagePlanSelectAnalyticsData(p.id),
              );
            }}
            className={`flex flex-col rounded-xl border p-6 text-left transition-colors ${
              planId === p.id
                ? "border-ink bg-surface ring-1 ring-ink/20"
                : "border-border bg-surface hover:border-border-strong"
            }`}
          >
            <div className="eyebrow">{p.name}</div>
            <div className="mt-2 font-display text-2xl font-semibold text-ink">{p.price}</div>
            <p className="mt-2 text-sm text-ink-muted">{p.blurb}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink">
              {p.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-trust-trusted" />
                  {b}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submitLead} className="rounded-xl border border-border bg-surface p-6">
          <div className="eyebrow">Get in touch</div>
          <p className="mt-2 text-sm text-ink-muted">
            Free directory submissions stay on{" "}
            {(() => {
              const destination = advertisePageEgressDestination("submit");
              if (!destination) return "/submit";
              return (
                <Link
                  to={destination.to}
                  onClick={() =>
                    trackEvent(
                      advertisePageEgressAnalyticsEvent(),
                      advertisePageEgressAnalyticsData("submit"),
                    )
                  }
                  className="text-ink underline"
                >
                  /submit
                </Link>
              );
            })()}
            . This form is for paid placement interest only.
          </p>
          <div className="mt-4 space-y-4">
            <Field name="contactName" label="Your name" required />
            <Field name="company" label="Company" required />
            <Field name="email" label="Work email" type="email" required />
            <Field
              name="website"
              label="Product or company URL"
              type="url"
              required
              placeholder="https://example.com"
            />
            <label className="block">
              <div className="eyebrow mb-1.5">What are you launching?</div>
              <textarea
                name="launch"
                rows={4}
                placeholder="Campaign goals, audience, timing, and any category fit notes."
                className="w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
            <p className="text-xs text-ink-subtle">
              Selected plan: <span className="text-ink">{selectedPlan.name}</span> (
              {selectedPlan.price})
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Join waitlist"}
            </button>
            {error && <p className="text-sm text-trust-blocked">{error}</p>}
          </div>
        </form>

        <div className="space-y-4">
          <aside className="rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
            <div className="eyebrow mb-2">What we won't do</div>
            <ul className="space-y-1.5">
              <li>Sell trust or source badges.</li>
              <li>Sponsor-disguised editorial.</li>
              <li>Paid ranking in Best lists.</li>
              <li>Dark patterns or fake scarcity.</li>
            </ul>
          </aside>
          <CommercialDisclosure />
        </div>
      </div>
    </div>
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

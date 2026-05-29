import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise on HeyClaude" },
      { name: "description", content: "Sponsorship and paid listings on HeyClaude." },
    ],
  }),
  component: AdvertisePage,
});

const PLANS = [
  {
    name: "Featured listing",
    price: "$390 / mo",
    blurb: "Pinned slot in a category, labeled as sponsor. No fake organic placement.",
    bullets: ["One category", "Clear sponsor label", "Trust/source badges still apply"],
  },
  {
    name: "Brief sponsor",
    price: "$1,200 / issue",
    blurb: "One transparent slot inside the Weekly Brief. Reviewed for fit.",
    bullets: ["Native section", "Topic alignment required", "Audited click reporting"],
  },
  {
    name: "Custom",
    price: "Let's talk",
    blurb: "Hiring drives, launch coverage, MCP catalog placements.",
    bullets: ["Tailored scope", "Direct contact", "No dark patterns"],
  },
];

function AdvertisePage() {
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="eyebrow">Sponsorship</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        Reach the people building with Claude.
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        Sponsorships are transparent and labeled. We don't sell ranking. Trust badges always reflect
        registry metadata, not payment.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className="flex flex-col rounded-xl border border-border bg-surface p-6">
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
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="rounded-xl border border-border bg-surface p-6"
        >
          <div className="eyebrow">Get in touch</div>
          <div className="mt-4 space-y-4">
            <Field label="Company" required />
            <Field label="Email" type="email" required />
            <Field label="Plan of interest" />
            <label className="block">
              <div className="eyebrow mb-1.5">What are you launching?</div>
              <textarea
                rows={4}
                className="w-full rounded-md border border-border bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              {done ? "Request sent ✓" : "Request details"}
            </button>
          </div>
        </form>

        <aside className="rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
          <div className="eyebrow mb-2">What we won't do</div>
          <ul className="space-y-1.5">
            <li>Sell trust or source badges.</li>
            <li>Sponsor-disguised editorial.</li>
            <li>Paid ranking in Best lists.</li>
            <li>Dark patterns or fake scarcity.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="eyebrow mb-1.5">{label}{required && " *"}</div>
      <input
        type={type}
        required={required}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

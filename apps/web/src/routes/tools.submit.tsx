import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/tools/submit")({
  head: () => ({
    meta: [
      { title: "Submit a commercial tool — HeyClaude" },
      {
        name: "description",
        content:
          "Route commercial Claude tools, sponsorships, listing claims, and paid review interest through HeyClaude lead capture.",
      },
    ],
  }),
  component: SubmitTool,
});

function SubmitTool() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Tools", to: "/tools" }, { label: "Submit" }]} />
      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="eyebrow">Commercial routing</div>
        <h1 className="mt-3 h-display-1 text-ink text-balance">Submit a commercial tool</h1>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Free, source-backed resources belong in the community directory. Commercial tools,
          sponsorships, listing claims, and paid review interest should go through the lead flow so
          the public registry stays useful.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/advertise"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
          >
            Advertising interest <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/claim"
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium text-ink hover:bg-surface-2"
          >
            Claim a listing
          </Link>
        </div>
      </section>
    </div>
  );
}

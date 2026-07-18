import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, GitBranch, Users, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { trackEvent } from "@/lib/analytics";
import {
  aboutPageEgressAnalyticsData,
  aboutPageEgressAnalyticsEvent,
  aboutPageEgressDestination,
  type AboutPageDestination,
} from "@/lib/about-page-cta-events";
import { breadcrumbScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";

function trackAboutEgress(destination: AboutPageDestination) {
  trackEvent(aboutPageEgressAnalyticsEvent(), aboutPageEgressAnalyticsData(destination));
}

function AboutEgressLink({
  destination,
  children,
}: {
  destination: AboutPageDestination;
  children: React.ReactNode;
}) {
  const dest = aboutPageEgressDestination(destination);
  if (!dest) return <>{children}</>;
  return (
    <Link to={dest.to} className="text-ink underline" onClick={() => trackAboutEgress(destination)}>
      {children}
    </Link>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — HeyClaude" },
      {
        name: "description",
        content:
          "HeyClaude is a GitHub-native directory and decision layer for Claude Code, MCP servers, skills, and AI workflow resources.",
      },
      { property: "og:title", content: "About — HeyClaude" },
      {
        property: "og:description",
        content: "The decision layer for Claude Code and AI agent workflows.",
      },
      { property: "og:url", content: absoluteUrl("/about") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
    scripts: [
      breadcrumbScript([
        { name: "HeyClaude", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    icon: GitBranch,
    title: "GitHub-native",
    body: "Every entry points back to a public source. If we can't link to it, we don't list it.",
  },
  {
    icon: ShieldCheck,
    title: "Trust signals, not verdicts",
    body: "We surface the things you'd check yourself — author, install behavior, credentials it touches — not malware scans.",
  },
  {
    icon: Users,
    title: "Contributors keep credit",
    body: "Provenance is preserved on every entry. Maintainers can claim and update their own listings.",
  },
  {
    icon: Sparkles,
    title: "Commercial is labeled, never disguised",
    body: "Sponsored, advertised, and paid roles are clearly marked and kept out of organic ranking.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "About" }]} />
      <div className="mt-4 eyebrow">About</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        The decision layer for AI workflows
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        HeyClaude is a curated, GitHub-native directory for Claude Code, MCP servers, skills, hooks,
        slash commands, rules, guides, statuslines, and the tools that wrap them.
      </p>

      <section className="mt-12">
        <h2 className="h-display-2 text-ink text-balance">What we believe</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-surface p-5">
              <p.icon className="h-4 w-4 text-accent-ink" aria-hidden />
              <div className="mt-3 font-display text-base font-semibold text-ink">{p.title}</div>
              <p className="mt-1 text-sm text-ink-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="h-display-2 text-ink text-balance">Three surfaces, one registry</h2>
        <p className="mt-3 text-sm text-ink-muted">
          The website, the public read-only API, and our{" "}
          <AboutEgressLink destination="integrations">integrations</AboutEgressLink> (Raycast
          extension, MCP server, editor adapters) all read from the same content with the same
          contracts. If you build on one, you can build on all of them — see the{" "}
          <AboutEgressLink destination="api-docs">API docs</AboutEgressLink> and{" "}
          <AboutEgressLink destination="quality">quality dashboard</AboutEgressLink>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="h-display-2 text-ink text-balance">Contribute</h2>
        <p className="mt-3 text-sm text-ink-muted">
          <AboutEgressLink destination="submit">Submit a resource</AboutEgressLink>,{" "}
          <AboutEgressLink destination="claim">claim a listing</AboutEgressLink>, or browse the{" "}
          <AboutEgressLink destination="contributors">contributors page</AboutEgressLink>.
          Commercial paths (<AboutEgressLink destination="advertise">advertise</AboutEgressLink>,{" "}
          <AboutEgressLink destination="jobs-post">post a job</AboutEgressLink>) are deliberately
          separate.
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline variant="card" source="about" />
      </div>
    </div>
  );
}

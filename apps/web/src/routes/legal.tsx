import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { trackEvent } from "@/lib/analytics";
import {
  legalPageEgressAnalyticsData,
  legalPageEgressAnalyticsEvent,
  legalPageEgressDestination,
  legalPageSectionAnalyticsData,
  legalPageSectionAnalyticsEvent,
  legalPageSectionDestination,
  type LegalPageDestination,
  type LegalPageSectionId,
} from "@/lib/legal-page-cta-events";
import { absoluteUrl } from "@/lib/seo";

function trackLegalEgress(destination: LegalPageDestination) {
  trackEvent(legalPageEgressAnalyticsEvent(), legalPageEgressAnalyticsData(destination));
}

function LegalEgressLink({
  destination,
  children,
  className = "text-ink underline",
}: {
  destination: LegalPageDestination;
  children: React.ReactNode;
  className?: string;
}) {
  const dest = legalPageEgressDestination(destination);
  if (!dest) return <>{children}</>;
  if (dest.kind === "href") {
    return (
      <a
        className={className}
        href={dest.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackLegalEgress(destination)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={dest.to} onClick={() => trackLegalEgress(destination)} className={className}>
      {children}
    </Link>
  );
}

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal — HeyClaude" },
      {
        name: "description",
        content: "Terms, privacy, content policy, and trademark notices for HeyClaude.",
      },
      { property: "og:title", content: "Legal — HeyClaude" },
      {
        property: "og:description",
        content: "Plain-English terms, privacy, content policy, and trademarks.",
      },
      { property: "og:url", content: absoluteUrl("/legal") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/legal") }],
  }),
  component: LegalPage,
});

const SECTIONS: { id: LegalPageSectionId; label: string }[] = [
  { id: "terms", label: "Terms of use" },
  { id: "privacy", label: "Privacy" },
  { id: "content", label: "Content policy" },
  { id: "trademarks", label: "Trademarks" },
  { id: "dmca", label: "DMCA & takedown" },
  { id: "contact", label: "Contact" },
];

function LegalPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Legal" }]} />
      <div className="mt-4 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <div className="eyebrow">Legal</div>
          <h1 className="mt-2 h-display-2 text-ink text-balance">Plain-English legal</h1>
          <p className="mt-2 text-xs text-ink-muted">Last updated 2026-05-26.</p>
          <nav className="mt-5 space-y-1 text-sm">
            {SECTIONS.map((s, rowIndex) => {
              const destination = legalPageSectionDestination(s.id);
              if (!destination) return null;
              return (
                <a
                  key={s.id}
                  href={destination.href}
                  onClick={() =>
                    trackEvent(
                      legalPageSectionAnalyticsEvent(),
                      legalPageSectionAnalyticsData(s.id, rowIndex, SECTIONS.length),
                    )
                  }
                  className="block rounded-md px-2 py-1 text-ink-muted hover:bg-surface-2 hover:text-ink"
                >
                  {s.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <Section id="terms" title="Terms of use">
            HeyClaude is provided as-is. We index third-party resources but do not endorse, sandbox,
            or warrant them. Always review the source before installing anything that touches your
            filesystem, network, or credentials.
          </Section>

          <Section id="privacy" title="Privacy">
            We collect minimal analytics: page views, search queries (truncated), and anonymous
            trust votes. No accounts are required to browse or submit. Submission forms collect only
            the metadata you provide. We never sell user data.
          </Section>

          <Section id="content" title="Content policy">
            Submitted resources must be free to use, source-backed, and not malicious. Commercial
            tools go through the{" "}
            <LegalEgressLink destination="advertise">commercial intake</LegalEgressLink> and are
            clearly labeled. Jobs go through{" "}
            <LegalEgressLink destination="jobs-post">post a job</LegalEgressLink>. Maintainers may
            remove anything that violates these rules.
          </Section>

          <Section id="trademarks" title="Trademarks">
            Claude, Anthropic, MCP, Cursor, Raycast, and other product names belong to their
            respective owners. HeyClaude is not affiliated with Anthropic.
          </Section>

          <Section id="dmca" title="DMCA and takedown">
            If you're an author or maintainer and want a listing removed, claimed, or corrected, use{" "}
            <LegalEgressLink destination="claim">claim a listing</LegalEgressLink> or open an issue
            on the public repo.
          </Section>

          <Section id="contact" title="Contact">
            Reach maintainers via the{" "}
            <LegalEgressLink destination="github-issues">GitHub issue tracker</LegalEgressLink>. The
            full policy texts live on{" "}
            <LegalEgressLink destination="github-repo">GitHub</LegalEgressLink>.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-7 first:border-0 first:pt-0">
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{children}</p>
    </section>
  );
}

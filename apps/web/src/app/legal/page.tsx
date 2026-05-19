import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@heyclaude/registry/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Legal and disclaimer",
  description:
    "HeyClaude legal disclaimer for community-submitted AI resources, package downloads, APIs, MCP helpers, and Raycast surfaces.",
  path: "/legal",
  keywords: ["heyclaude legal", "heyclaude disclaimer", "ai directory safety"],
});

const sections = [
  {
    title: "Community directory",
    body: "HeyClaude is an unofficial community directory. Listings can include third-party tools, configuration snippets, packages, links, and instructions. Inclusion is not an endorsement, certification, partnership, or guarantee.",
  },
  {
    title: "No warranty",
    body: "The project is provided as-is under the MIT license. Content may be incomplete, outdated, unsafe for a specific environment, or incompatible with your workflow. You are responsible for reviewing source, permissions, license terms, and operational risk before using anything listed here.",
  },
  {
    title: "Packages and downloads",
    body: "Maintainer-verified package labels mean the package followed the HeyClaude review/build path and has associated metadata such as checksums. They do not guarantee that an artifact is harmless. External package links are unverified unless clearly marked otherwise.",
  },
  {
    title: "Submission and API surfaces",
    body: "Website submission forms, API responses, MCP helpers, Raycast extension data, feeds, and LLM exports are informational surfaces. They may help draft or review contributions, but they do not replace human review or your own security checks.",
  },
  {
    title: "Contributor responsibility",
    body: "Contributors are responsible for submitting accurate metadata, disclosing commercial relationships, crediting sources, and avoiding malware, secrets, private data, deceptive packages, or unsafe instructions.",
  },
  {
    title: "Reports",
    body: "Report security issues through the repository security policy. For listing corrections, use detail-page edit/suggest links, GitHub issues, or the claim/update flow.",
  },
];

type LegalPageLogger = {
  info: (event: string, meta?: Record<string, unknown>) => void;
  error: (event: string, meta?: Record<string, unknown>) => void;
};

function writeLegalPageLog(
  level: "info" | "error",
  event: string,
  requestId: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    requestId,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

function createLegalPageLogger(requestId: string): LegalPageLogger {
  return {
    info(event, meta = {}) {
      writeLegalPageLog("info", event, requestId, meta);
    },
    error(event, meta = {}) {
      writeLegalPageLog("error", event, requestId, meta);
    },
  };
}

async function withDuration<T>(
  callback: (context: {
    getDurationMs: () => number;
    logger: LegalPageLogger;
    requestId: string;
  }) => Promise<T>,
) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const logger = createLegalPageLogger(requestId);
  const getDurationMs = () => Date.now() - startedAt;

  try {
    return await callback({ getDurationMs, logger, requestId });
  } catch (error) {
    logger.error("legal.page.failed", {
      durationMs: getDurationMs(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

export default async function LegalPage() {
  return withDuration(async ({ getDurationMs, logger }) => {
    const jsonLd = [
      buildBreadcrumbJsonLd([
        { name: "Home", url: siteConfig.url },
        { name: "Legal", url: `${siteConfig.url}/legal` },
      ]),
      buildWebPageJsonLd({
        siteUrl: siteConfig.url,
        path: "/legal",
        name: "Legal and disclaimer",
        description:
          "Disclaimer and risk notes for HeyClaude community content.",
        breadcrumbId: `${siteConfig.url}/legal#breadcrumb`,
      }),
    ];

    logger.info("legal.page.summary", {
      durationMs: getDurationMs(),
      sectionCount: sections.length,
    });

    return (
      <div className="container-shell space-y-8 py-12">
        <JsonLd data={jsonLd} />
        <div className="space-y-4 border-b border-border/80 pb-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Legal" }]}
          />
          <span className="eyebrow">Legal</span>
          <h1 className="section-title">Legal and disclaimer</h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            Community content can be useful and still carry risk. Review source,
            permissions, and package behavior before using anything from the
            directory.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-border bg-card/80 p-5"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background px-5 py-4 text-sm leading-7 text-muted-foreground">
          This page is a practical project disclaimer, not legal advice. The
          final policy surface should be reviewed by counsel before relying on
          it as formal terms.
        </div>
      </div>
    );
  });
}

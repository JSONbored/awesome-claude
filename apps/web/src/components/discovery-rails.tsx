import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import type { DirectoryEntry } from "@/lib/content";
import { categoryLabels } from "@/lib/site";

type DiscoveryRail = {
  id: string;
  title: string;
  description: string;
  href: string;
  entries: DirectoryEntry[];
  icon: "new" | "verified" | "source" | "install";
};

type DiscoveryRailsProps = {
  rails: DiscoveryRail[];
};

const icons = {
  new: Clock3,
  verified: CheckCircle2,
  source: ShieldCheck,
  install: PackageCheck,
} as const;

function entryHref(entry: DirectoryEntry) {
  return `/${entry.category}/${entry.slug}`;
}

function entrySignals(entry: DirectoryEntry) {
  return [
    categoryLabels[entry.category] ?? entry.category,
    entry.trustSignals?.sourceStatus === "available" ? "source" : "",
    entry.downloadTrust === "first-party" ? "first-party" : "",
    entry.packageVerified ? "verified package" : "",
  ].filter(Boolean);
}

export function DiscoveryRails({ rails }: DiscoveryRailsProps) {
  return (
    <section className="container-shell space-y-10 py-12">
      {rails.map((rail) => {
        const Icon = icons[rail.icon];

        return (
          <div key={rail.id} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {rail.title}
                  </h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {rail.description}
                </p>
              </div>
              <Link
                href={rail.href}
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {rail.entries.slice(0, 4).map((entry) => (
                <Link
                  key={`${rail.id}-${entry.category}-${entry.slug}`}
                  href={entryHref(entry)}
                  className="surface-panel p-4 transition hover:border-primary/45"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {entrySignals(entry)
                      .slice(0, 3)
                      .map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {signal}
                        </span>
                      ))}
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-foreground">
                    {entry.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-6 text-muted-foreground">
                    {entry.cardDescription || entry.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

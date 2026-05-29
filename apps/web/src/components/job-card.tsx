import { Link } from "@tanstack/react-router";
import { MapPin, BadgeCheck, ArrowUpRight, Star, Sparkles } from "lucide-react";
import type { JobListing } from "@/types/registry";
import { cn } from "@/lib/utils";
import { companyTint, isFresh, monogram, relativePosted } from "@/lib/jobs-utils";

interface Props {
  job: JobListing;
  /** "row" is the standard list card. "rail" is a compact card for the spotlight aside. */
  variant?: "row" | "rail";
}

export function JobCard({ job, variant = "row" }: Props) {
  const tint = companyTint(job.company);
  const fresh = isFresh(job.postedAt);
  const featured = job.tier === "featured";
  const sponsored = job.tier === "sponsored";

  if (variant === "rail") {
    return (
      <Link
        to="/jobs/$slug"
        params={{ slug: job.slug }}
        className="group block rounded-lg border border-border bg-background p-3 transition-[border-color,background-color,color] duration-200 ease-out hover:border-ink/20 hover:bg-surface-2"
      >
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-display text-xs font-semibold"
            style={{ background: tint.bg, color: tint.fg }}
          >
            {monogram(job.company)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] text-ink-muted">{job.company}</div>
            <div className="truncate font-display text-sm font-semibold text-ink transition-colors duration-200 ease-out group-hover:text-ink-hover">
              {job.title}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-ink-subtle">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate">{job.location}</span>
              {job.compensation && (
                <>
                  <span>·</span>
                  <span className="truncate text-ink-muted">{job.compensation}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/jobs/$slug"
      params={{ slug: job.slug }}
      className={cn(
        "group hover-lift surface-raised relative block overflow-hidden rounded-xl border bg-surface p-4 sm:p-5",
        "hover:border-ink/20 hover:bg-surface-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sponsored && "border-accent/40 bg-gradient-to-br from-surface to-accent/[0.06]",
        featured &&
          !sponsored &&
          "border-border bg-gradient-to-r from-accent/[0.05] to-transparent",
        !sponsored && !featured && "border-border",
      )}
      aria-label={`${job.title} at ${job.company}`}
    >
      {featured && !sponsored && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-accent to-accent/40"
        />
      )}
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-display text-base font-semibold"
          style={{ background: tint.bg, color: tint.fg }}
        >
          {monogram(job.company)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
            <span className="font-medium text-ink">{job.company}</span>
            {job.lastVerifiedAt && (
              <span className="inline-flex items-center gap-0.5 text-trust-trusted">
                <BadgeCheck className="h-3 w-3" /> verified
              </span>
            )}
            {sponsored && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-ink dark:text-accent">
                <Sparkles className="h-2.5 w-2.5" /> Sponsored
              </span>
            )}
            {featured && !sponsored && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-ink dark:text-accent">
                <Star className="h-2.5 w-2.5 fill-current" /> Featured
              </span>
            )}
            {fresh && !featured && !sponsored && (
              <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                New
              </span>
            )}
          </div>

          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors duration-200 ease-out group-hover:text-ink-hover sm:text-lg">
            {job.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{job.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {job.location}
            </span>
            {job.isRemote && (
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                Remote{job.isWorldwide ? " · worldwide" : ""}
              </span>
            )}
            <span>·</span>
            <span>{job.type}</span>
            {job.compensation && (
              <>
                <span>·</span>
                <span className="font-medium text-ink">{job.compensation}</span>
              </>
            )}
          </div>

          {job.labels && job.labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {job.labels.slice(0, 4).map((l) => (
                <span
                  key={l}
                  className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] text-ink-muted"
                >
                  {l}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-2 text-right sm:flex">
          <span className="font-mono text-[11px] text-ink-subtle">
            {relativePosted(job.postedAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
            View role{" "}
            <ArrowUpRight className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

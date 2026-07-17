import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  TRUST_LABEL,
  SOURCE_LABEL,
  PLATFORM_LABEL,
  type TrustLevel,
  type SourceStatus,
  type Platform,
  type Entry,
} from "@/types/registry";
import {
  ShieldCheck,
  AlertTriangle,
  OctagonX,
  ShieldAlert,
  GitBranch,
  BadgeCheck,
  Globe,
  HelpCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { IntegrationMark, platformMark } from "./integration-marks";
import { trackEvent } from "@/lib/analytics";
import {
  platformChipAnalyticsData,
  platformChipAnalyticsEvent,
} from "@/lib/platform-chip-cta-events";
import {
  categoryPillAnalyticsData,
  categoryPillAnalyticsEvent,
} from "@/lib/category-pill-cta-events";
import { sourceBadgeAnalyticsData, sourceBadgeAnalyticsEvent } from "@/lib/source-badge-cta-events";
import {
  notesPresenceAnalyticsData,
  notesPresenceAnalyticsEvent,
  notesPresenceBrowseSearch,
} from "@/lib/notes-presence-cta-events";
import {
  installRiskLevel,
  INSTALL_RISK_LABEL,
  INSTALL_RISK_DETAIL,
  type InstallRisk,
} from "@/lib/trust";
import {
  installRiskBadgeAnalyticsData,
  installRiskBadgeAnalyticsEvent,
  installRiskBrowseSearch,
} from "@/lib/install-risk-badge-cta-events";

const trustStyles: Record<TrustLevel, { dot: string; text: string; ring: string }> = {
  trusted: { dot: "bg-trust-trusted", text: "text-trust-trusted", ring: "ring-trust-trusted/30" },
  review: { dot: "bg-trust-review", text: "text-trust-review", ring: "ring-trust-review/30" },
  limited: { dot: "bg-trust-limited", text: "text-trust-limited", ring: "ring-trust-limited/30" },
  blocked: { dot: "bg-trust-blocked", text: "text-trust-blocked", ring: "ring-trust-blocked/30" },
};

const trustIcon: Record<TrustLevel, React.ElementType> = {
  trusted: ShieldCheck,
  review: AlertTriangle,
  limited: ShieldAlert,
  blocked: OctagonX,
};

export function TrustBadge({
  level,
  className,
  asLink = false,
  onNavigate,
}: {
  level: TrustLevel;
  className?: string;
  /** Opt-in browse link — never use inside card `<Link>`s. */
  asLink?: boolean;
  onNavigate?: () => void;
}) {
  const s = trustStyles[level];
  const Icon = trustIcon[level];
  const content = (
    <>
      <Icon className="h-3 w-3" aria-hidden />
      {TRUST_LABEL[level]}
    </>
  );
  const classes = cn(
    "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium leading-none",
    s.text,
    className,
  );
  if (asLink) {
    return (
      <Link
        to="/browse"
        search={{ trust: level }}
        onClick={onNavigate}
        className={cn(classes, "transition-colors hover:border-ink/20")}
        title={`${TRUST_LABEL[level]} — browse by trust`}
      >
        {content}
      </Link>
    );
  }
  return (
    <span className={classes} title={`${TRUST_LABEL[level]} — review before installing`}>
      {content}
    </span>
  );
}

const sourceIcon: Record<SourceStatus, React.ElementType> = {
  "source-backed": GitBranch,
  "first-party": BadgeCheck,
  external: Globe,
  unverified: HelpCircle,
};

export function SourceBadge({
  status,
  className,
  asLink = false,
  surface,
  onNavigate,
}: {
  status: SourceStatus;
  className?: string;
  /** Opt-in browse link — never use inside card `<Link>`s. */
  asLink?: boolean;
  /** Optional analytics surface when asLink is set. */
  surface?: string;
  onNavigate?: () => void;
}) {
  const Icon = sourceIcon[status];
  const content = (
    <>
      <Icon className="h-3 w-3" aria-hidden />
      {SOURCE_LABEL[status]}
    </>
  );
  const classes = cn(
    "inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium leading-none text-ink-muted",
    className,
  );
  if (asLink) {
    return (
      <Link
        to="/browse"
        search={{ source: status }}
        onClick={() => {
          onNavigate?.();
          if (surface) {
            trackEvent(sourceBadgeAnalyticsEvent(), sourceBadgeAnalyticsData(status, surface));
          }
        }}
        className={cn(classes, "transition-colors hover:text-ink")}
        title={`${SOURCE_LABEL[status]} — browse by source`}
      >
        {content}
      </Link>
    );
  }
  return <span className={classes}>{content}</span>;
}

export function PlatformChip({
  id,
  asLink = false,
  surface,
}: {
  id: Platform;
  asLink?: boolean;
  /** Optional analytics surface when asLink is set. */
  surface?: string;
}) {
  const mark = platformMark(id);
  const base =
    "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border px-2 py-0.5 font-mono text-[10px] leading-none text-ink-muted";
  const content = (
    <>
      {mark && <IntegrationMark name={mark} size={10} className="opacity-80" />}
      {PLATFORM_LABEL[id]}
    </>
  );
  // asLink is opt-in: never used inside card <Link>s (would nest anchors); only on detail pages.
  if (asLink) {
    return (
      <Link
        to="/for/$platform"
        params={{ platform: id }}
        className={cn(base, "transition-colors hover:border-ink/20 hover:text-ink")}
        onClick={() =>
          trackEvent(platformChipAnalyticsEvent(), platformChipAnalyticsData(id, surface))
        }
      >
        {content}
      </Link>
    );
  }
  return <span className={base}>{content}</span>;
}

export function CategoryPill({
  children,
  className,
  asLink = false,
  category,
  surface,
  onNavigate,
}: {
  children: React.ReactNode;
  className?: string;
  /** Opt-in browse link — never use inside card `<Link>`s. */
  asLink?: boolean;
  category?: string;
  surface?: "compare-table" | "compare-drawer";
  onNavigate?: () => void;
}) {
  const classes = cn(
    "inline-flex items-center whitespace-nowrap rounded-md bg-ink px-2 py-0.5 font-mono text-[10px] uppercase leading-none tracking-wider text-background",
    className,
  );
  if (asLink && category) {
    return (
      <Link
        to="/browse"
        search={{ category }}
        onClick={() => {
          onNavigate?.();
          if (surface) {
            trackEvent(categoryPillAnalyticsEvent(), categoryPillAnalyticsData(category, surface));
          }
        }}
        className={cn(classes, "transition-opacity hover:opacity-90")}
      >
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1 font-mono text-[10px] text-ink-muted">
      {children}
    </kbd>
  );
}

const installRiskStyles: Record<InstallRisk, { text: string; ring: string; dot: string }> = {
  low: { text: "text-trust-trusted", ring: "ring-trust-trusted/30", dot: "bg-trust-trusted" },
  review: { text: "text-trust-review", ring: "ring-trust-review/30", dot: "bg-trust-review" },
  high: { text: "text-trust-blocked", ring: "ring-trust-blocked/30", dot: "bg-trust-blocked" },
};

const installRiskIcon: Record<InstallRisk, React.ElementType> = {
  low: ShieldCheck,
  review: AlertTriangle,
  high: OctagonX,
};

export function InstallRiskBadge({
  entry,
  className,
  size = "sm",
  asButton = false,
  asLink = false,
  surface,
  onActivate,
}: {
  entry: Entry;
  className?: string;
  size?: "sm" | "xs";
  /** Opt-in scroll control — never use inside card `<Link>`s. */
  asButton?: boolean;
  /** Opt-in browse link — never use inside card `<Link>`s. */
  asLink?: boolean;
  /** Optional analytics surface when asLink is set. */
  surface?: string;
  onActivate?: (risk: InstallRisk) => void;
}) {
  const level = React.useMemo(() => installRiskLevel(entry), [entry]);
  const s = installRiskStyles[level];
  const Icon = installRiskIcon[level];
  const classes = cn(
    "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border bg-surface font-medium leading-none",
    s.text,
    size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
    className,
  );
  const content = (
    <>
      <Icon className={size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      {INSTALL_RISK_LABEL[level]}
    </>
  );
  if (asButton) {
    return (
      <button
        type="button"
        title={`${INSTALL_RISK_LABEL[level]} — jump to install risk`}
        onClick={() => {
          onActivate?.(level);
          document.getElementById("risk-callout")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        className={cn(
          classes,
          "transition-colors hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        )}
      >
        {content}
      </button>
    );
  }
  const browseSearch = asLink ? installRiskBrowseSearch(level) : null;
  if (browseSearch) {
    return (
      <Link
        to="/browse"
        search={browseSearch}
        title={`${INSTALL_RISK_LABEL[level]} — browse by trust`}
        onClick={() => {
          onActivate?.(level);
          if (surface) {
            trackEvent(
              installRiskBadgeAnalyticsEvent(),
              installRiskBadgeAnalyticsData(level, surface),
            );
          }
        }}
        className={cn(classes, "transition-colors hover:border-ink/20")}
      >
        {content}
      </Link>
    );
  }
  return (
    <span
      title={`${INSTALL_RISK_LABEL[level]} — ${INSTALL_RISK_DETAIL[level]}`}
      className={classes}
    >
      {content}
    </span>
  );
}

/** Tiny presence chips for safety/privacy notes — muted when missing. */
export function NotesPresenceChips({
  entry,
  className,
  interactive = false,
  asLink = false,
  surface,
  onNoteClick,
}: {
  entry: Entry;
  className?: string;
  /** Opt-in scroll buttons — never use inside card `<Link>`s. */
  interactive?: boolean;
  /** Opt-in browse links for present notes — never use inside card `<Link>`s. */
  asLink?: boolean;
  /** Optional analytics surface when asLink is set. */
  surface?: string;
  onNoteClick?: (noteKind: "safety" | "privacy", present: boolean) => void;
}) {
  const hasSafety = !!(entry.safetyNotes || entry.safetyNotesList?.length);
  const hasPrivacy = !!(entry.privacyNotes || entry.privacyNotesList?.length);

  const chipClass = (present: boolean) =>
    cn(
      "inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none",
      present ? "border-trust-trusted/30 text-trust-trusted" : "border-border text-ink-subtle/70",
    );

  const activate = (noteKind: "safety" | "privacy", present: boolean, targetId: string) => {
    onNoteClick?.(noteKind, present);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const trackNote = (noteKind: "safety" | "privacy", present: boolean) => {
    onNoteClick?.(noteKind, present);
    if (surface) {
      trackEvent(
        notesPresenceAnalyticsEvent(),
        notesPresenceAnalyticsData(noteKind, present, surface),
      );
    }
  };

  if (interactive) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <button
          type="button"
          title={hasSafety ? "Jump to safety notes" : "Safety notes missing"}
          onClick={() => activate("safety", hasSafety, "safety")}
          className={cn(
            chipClass(hasSafety),
            "transition-colors hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
          )}
        >
          <Lock className="h-2.5 w-2.5" aria-hidden /> Safety {hasSafety ? "✓" : "·"}
        </button>
        <button
          type="button"
          title={hasPrivacy ? "Jump to privacy notes" : "Privacy notes missing"}
          onClick={() => activate("privacy", hasPrivacy, "privacy")}
          className={cn(
            chipClass(hasPrivacy),
            "transition-colors hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
          )}
        >
          {hasPrivacy ? (
            <Eye className="h-2.5 w-2.5" aria-hidden />
          ) : (
            <EyeOff className="h-2.5 w-2.5" aria-hidden />
          )}{" "}
          Privacy {hasPrivacy ? "✓" : "·"}
        </button>
      </span>
    );
  }

  if (asLink) {
    const safetySearch = notesPresenceBrowseSearch("safety", hasSafety);
    const privacySearch = notesPresenceBrowseSearch("privacy", hasPrivacy);
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        {safetySearch ? (
          <Link
            to="/browse"
            search={safetySearch}
            onClick={() => trackNote("safety", true)}
            title="Safety notes present — browse by signal"
            className={cn(chipClass(true), "transition-colors hover:border-ink/20")}
          >
            <Lock className="h-2.5 w-2.5" aria-hidden /> Safety ✓
          </Link>
        ) : (
          <span title="Safety notes missing" className={chipClass(false)}>
            <Lock className="h-2.5 w-2.5" aria-hidden /> Safety ·
          </span>
        )}
        {privacySearch ? (
          <Link
            to="/browse"
            search={privacySearch}
            onClick={() => trackNote("privacy", true)}
            title="Privacy notes present — browse by signal"
            className={cn(chipClass(true), "transition-colors hover:border-ink/20")}
          >
            <Eye className="h-2.5 w-2.5" aria-hidden /> Privacy ✓
          </Link>
        ) : (
          <span title="Privacy notes missing" className={chipClass(false)}>
            <EyeOff className="h-2.5 w-2.5" aria-hidden /> Privacy ·
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span
        title={hasSafety ? "Safety notes present" : "Safety notes missing"}
        className={chipClass(hasSafety)}
      >
        <Lock className="h-2.5 w-2.5" aria-hidden /> Safety {hasSafety ? "✓" : "·"}
      </span>
      <span
        title={hasPrivacy ? "Privacy notes present" : "Privacy notes missing"}
        className={chipClass(hasPrivacy)}
      >
        {hasPrivacy ? (
          <Eye className="h-2.5 w-2.5" aria-hidden />
        ) : (
          <EyeOff className="h-2.5 w-2.5" aria-hidden />
        )}{" "}
        Privacy {hasPrivacy ? "✓" : "·"}
      </span>
    </span>
  );
}

/** Compact readiness dot (used in compare tray, sticky meta). */
export function ReadinessDot({ entry, className }: { entry: Entry; className?: string }) {
  const level = installRiskLevel(entry);
  const s = installRiskStyles[level];
  return (
    <span
      aria-label={INSTALL_RISK_LABEL[level]}
      title={INSTALL_RISK_LABEL[level]}
      className={cn("inline-block h-2 w-2 rounded-full", s.dot, className)}
    />
  );
}

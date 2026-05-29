import * as React from "react";
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
import {
  installRiskLevel,
  INSTALL_RISK_LABEL,
  INSTALL_RISK_DETAIL,
  type InstallRisk,
} from "@/lib/trust";

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

export function TrustBadge({ level, className }: { level: TrustLevel; className?: string }) {
  const s = trustStyles[level];
  const Icon = trustIcon[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium leading-none",
        s.text,
        className,
      )}
      title={`${TRUST_LABEL[level]} — review before installing`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {TRUST_LABEL[level]}
    </span>
  );
}

const sourceIcon: Record<SourceStatus, React.ElementType> = {
  "source-backed": GitBranch,
  "first-party": BadgeCheck,
  external: Globe,
  unverified: HelpCircle,
};

export function SourceBadge({ status, className }: { status: SourceStatus; className?: string }) {
  const Icon = sourceIcon[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium leading-none text-ink-muted",
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {SOURCE_LABEL[status]}
    </span>
  );
}

export function PlatformChip({ id }: { id: Platform }) {
  const mark = platformMark(id);
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border px-2 py-0.5 font-mono text-[10px] leading-none text-ink-muted">
      {mark && <IntegrationMark name={mark} size={10} className="opacity-80" />}
      {PLATFORM_LABEL[id]}
    </span>
  );
}

export function CategoryPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md bg-ink px-2 py-0.5 font-mono text-[10px] uppercase leading-none tracking-wider text-background",
        className,
      )}
    >
      {children}
    </span>
  );
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
}: {
  entry: Entry;
  className?: string;
  size?: "sm" | "xs";
}) {
  const level = React.useMemo(() => installRiskLevel(entry), [entry]);
  const s = installRiskStyles[level];
  const Icon = installRiskIcon[level];
  return (
    <span
      title={`${INSTALL_RISK_LABEL[level]} — ${INSTALL_RISK_DETAIL[level]}`}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border bg-surface font-medium leading-none",
        s.text,
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        className,
      )}
    >
      <Icon className={size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      {INSTALL_RISK_LABEL[level]}
    </span>
  );
}

/** Tiny presence chips for safety/privacy notes — muted when missing. */
export function NotesPresenceChips({ entry, className }: { entry: Entry; className?: string }) {
  const hasSafety = !!(entry.safetyNotes || entry.safetyNotesList?.length);
  const hasPrivacy = !!(entry.privacyNotes || entry.privacyNotesList?.length);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span
        title={hasSafety ? "Safety notes present" : "Safety notes missing"}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none",
          hasSafety
            ? "border-trust-trusted/30 text-trust-trusted"
            : "border-border text-ink-subtle/70",
        )}
      >
        <Lock className="h-2.5 w-2.5" aria-hidden /> Safety {hasSafety ? "✓" : "·"}
      </span>
      <span
        title={hasPrivacy ? "Privacy notes present" : "Privacy notes missing"}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none",
          hasPrivacy
            ? "border-trust-trusted/30 text-trust-trusted"
            : "border-border text-ink-subtle/70",
        )}
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

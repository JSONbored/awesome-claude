import type { LucideIcon } from "lucide-react";
import {
  ClipboardCopy,
  Clock,
  FileCog,
  Gauge,
  ListChecks,
  MonitorSmartphone,
  Package,
  Terminal,
} from "lucide-react";
import type { Entry, InstallType } from "@/types/registry";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { ENTRY_COMMAND_CENTER_ID } from "@/lib/entry-detail-command-center";
import {
  entrySetupSnapshotAnalyticsData,
  entrySetupSnapshotAnalyticsEvent,
  type EntrySetupSnapshotDestination,
  type EntrySetupSnapshotTileId,
} from "@/lib/entry-setup-snapshot-cta-events";

const INSTALL_TYPE_LABEL: Record<InstallType, string> = {
  cli: "CLI install",
  config: "Config edit",
  copy: "Copy & paste",
  package: "Package install",
  manual: "Manual setup",
};

type StatTone = "good" | "watch" | "risk" | "muted";

function toneText(tone: StatTone): string {
  if (tone === "good") return "text-trust-trusted";
  if (tone === "watch") return "text-amber-900";
  if (tone === "risk") return "text-trust-blocked";
  return "text-ink-muted";
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
  href,
  onNavigate,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: StatTone;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="rounded-lg border border-border bg-background p-3 transition-colors duration-200 ease-out hover:border-accent/40 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4 shrink-0", toneText(tone))} aria-hidden />
        <p className="text-xs font-medium text-ink-muted">{label}</p>
      </div>
      <p className={cn("mt-1.5 text-sm font-semibold", toneText(tone))}>{value}</p>
    </a>
  );
}

export function EntrySetupSnapshotPanel({
  entry,
  className,
}: {
  entry: Entry;
  className?: string;
}) {
  const hasCommand = Boolean(entry.installCommand);
  const hasConfig = Boolean(entry.configSnippet);
  const hasCopy = Boolean(entry.copySnippet || entry.fullCopy);
  const setupTime = entry.estimatedSetupTime?.trim();
  const prereqCount = entry.prerequisites?.length ?? 0;
  const platformCount = entry.platforms?.length ?? 0;
  const difficulty =
    typeof entry.difficultyScore === "number" ? Math.round(entry.difficultyScore) : null;

  if (!hasCommand && !hasConfig && !hasCopy && !setupTime && prereqCount === 0) {
    return null;
  }

  const readiness = hasCopy
    ? "Copy-ready — paste the snippet to get started."
    : entry.installType === "cli" || hasCommand
      ? "Run the install command to set up."
      : entry.installType === "config" || hasConfig
        ? "Add the configuration to enable it."
        : "Follow the manual setup steps.";

  const trackTile = (
    tileId: EntrySetupSnapshotTileId,
    destination: EntrySetupSnapshotDestination,
  ) => {
    trackEvent(
      entrySetupSnapshotAnalyticsEvent(),
      entrySetupSnapshotAnalyticsData(entry.category, entry.slug, tileId, destination),
    );
  };

  const commandHref = `#${ENTRY_COMMAND_CENTER_ID}`;
  const prereqHref = "#prerequisites";

  return (
    <section
      id="setup-snapshot"
      aria-label="Setup at a glance"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Setup at a glance</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">
            {INSTALL_TYPE_LABEL[entry.installType]}
          </h3>
          <p className="mt-1.5 text-sm text-ink-muted">{readiness}</p>
        </div>
        {setupTime ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-ink-muted">
            <Clock className="h-3 w-3" aria-hidden />
            {setupTime}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          icon={Terminal}
          label="Install command"
          value={hasCommand ? "Provided" : "Not provided"}
          tone={hasCommand ? "good" : "muted"}
          href={commandHref}
          onNavigate={() => trackTile("install", "entry-command-center")}
        />
        <StatTile
          icon={FileCog}
          label="Config snippet"
          value={hasConfig ? "Provided" : "Not provided"}
          tone={hasConfig ? "good" : "muted"}
          href={commandHref}
          onNavigate={() => trackTile("config", "entry-command-center")}
        />
        <StatTile
          icon={ClipboardCopy}
          label="Copy snippet"
          value={hasCopy ? "Provided" : "Not provided"}
          tone={hasCopy ? "good" : "muted"}
          href={commandHref}
          onNavigate={() => trackTile("copy", "entry-command-center")}
        />
        <StatTile
          icon={ListChecks}
          label="Prerequisites"
          value={prereqCount > 0 ? `${prereqCount} to clear` : "None"}
          tone={prereqCount > 0 ? "watch" : "good"}
          href={prereqHref}
          onNavigate={() => trackTile("prerequisites", "prerequisites")}
        />
        <StatTile
          icon={MonitorSmartphone}
          label="Platforms"
          value={platformCount > 0 ? `${platformCount} listed` : "Not listed"}
          tone="muted"
          href={commandHref}
          onNavigate={() => trackTile("platforms", "entry-command-center")}
        />
        {difficulty !== null ? (
          <StatTile
            icon={Gauge}
            label="Difficulty"
            value={`${difficulty}/100`}
            tone={difficulty >= 66 ? "risk" : difficulty >= 33 ? "watch" : "good"}
            href={commandHref}
            onNavigate={() => trackTile("difficulty", "entry-command-center")}
          />
        ) : (
          <StatTile
            icon={Package}
            label="Install type"
            value={INSTALL_TYPE_LABEL[entry.installType]}
            tone="muted"
            href={commandHref}
            onNavigate={() => trackTile("install-type", "entry-command-center")}
          />
        )}
      </div>
    </section>
  );
}

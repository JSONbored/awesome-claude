import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Pencil,
  Star,
  Trash2,
  X,
  Check,
  ArrowRight,
  Bell,
  BellOff,
  Rss,
  Mail,
  MonitorDot,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useRecents,
  type SavedSearch,
  type AlertChannel,
  type AlertCadence,
  type AlertSchedule,
} from "@/lib/recents";
import { subscribeToNewsletter } from "@/lib/api/newsletter";
import { hashSearch } from "@/lib/saved-search-hash-lib";
import { applyToBrowseSearch } from "@/lib/saved-search-nav-lib";
import { defaultAlerts } from "@/lib/saved-search-default-alerts-lib";
import { savedFeedUrl } from "@/lib/saved-search-feed-url-lib";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  browseSavedSearchManagerAlertsCancelAnalyticsData,
  browseSavedSearchManagerAlertsCancelAnalyticsEvent,
  browseSavedSearchManagerAlertsEditorAnalyticsData,
  browseSavedSearchManagerAlertsEditorAnalyticsEvent,
  browseSavedSearchManagerAlertsSaveAnalyticsData,
  browseSavedSearchManagerAlertsSaveAnalyticsEvent,
  browseSavedSearchManagerAlertsToggleAnalyticsData,
  browseSavedSearchManagerAlertsToggleAnalyticsEvent,
  browseSavedSearchManagerApplyAnalyticsData,
  browseSavedSearchManagerApplyAnalyticsEvent,
  browseSavedSearchManagerCadenceSelectAnalyticsData,
  browseSavedSearchManagerCadenceSelectAnalyticsEvent,
  browseSavedSearchManagerChannelToggleAnalyticsData,
  browseSavedSearchManagerChannelToggleAnalyticsEvent,
  browseSavedSearchManagerFeedCopyAnalyticsData,
  browseSavedSearchManagerFeedCopyAnalyticsEvent,
  browseSavedSearchManagerOpenAnalyticsData,
  browseSavedSearchManagerOpenAnalyticsEvent,
  browseSavedSearchManagerRemoveAnalyticsData,
  browseSavedSearchManagerRemoveAnalyticsEvent,
  browseSavedSearchManagerRenameAnalyticsData,
  browseSavedSearchManagerRenameAnalyticsEvent,
  savedSearchFilterCount,
} from "@/lib/browse-saved-search-cta-events";

interface ManagerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const CHANNEL_META: {
  id: AlertChannel;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "inapp", label: "In-app", Icon: MonitorDot },
  { id: "email", label: "Email", Icon: Mail },
  { id: "rss", label: "RSS", Icon: Rss },
];

const CADENCES: AlertCadence[] = ["instant", "daily", "weekly"];

function AlertEditor({
  search,
  initial,
  onSave,
  onCancel,
}: {
  search: SavedSearch;
  initial: AlertSchedule;
  onSave: (a: AlertSchedule) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = React.useState<AlertSchedule>(initial);
  const [busy, setBusy] = React.useState(false);
  const toggleChannel = (c: AlertChannel) => {
    const enabled = !draft.channels.includes(c);
    const channelCount = enabled
      ? draft.channels.length + 1
      : Math.max(0, draft.channels.length - 1);
    trackEvent(
      browseSavedSearchManagerChannelToggleAnalyticsEvent(),
      browseSavedSearchManagerChannelToggleAnalyticsData(c, enabled, channelCount),
    );
    setDraft((d) => ({
      ...d,
      channels: enabled ? [...d.channels, c] : d.channels.filter((x) => x !== c),
    }));
  };

  const needsEmail = draft.channels.includes("email");
  const feedHref = savedFeedUrl(search);

  return (
    <div className="rounded-md border border-border bg-surface-2 p-3 text-xs">
      <div className="flex flex-wrap items-center gap-1">
        {CHANNEL_META.map(({ id, label, Icon }) => {
          const on = draft.channels.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleChannel(id)}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px]",
                on
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-border bg-surface text-ink-muted hover:text-ink",
              )}
              aria-pressed={on}
            >
              <Icon className="h-3 w-3" /> {label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className="text-[11px] text-ink-subtle">Cadence:</span>
        {CADENCES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              trackEvent(
                browseSavedSearchManagerCadenceSelectAnalyticsEvent(),
                browseSavedSearchManagerCadenceSelectAnalyticsData(c, draft.channels.length),
              );
              setDraft((d) => ({ ...d, cadence: c }));
            }}
            className={cn(
              "inline-flex h-6 items-center rounded-full border px-2 text-[11px] capitalize",
              draft.cadence === c
                ? "border-accent bg-accent/10 text-ink"
                : "border-border bg-surface text-ink-muted hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {needsEmail && (
        <input
          type="email"
          value={draft.email ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
          placeholder="you@domain.com"
          className="mt-2 h-7 w-full rounded-md border border-border bg-background px-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      )}
      {draft.channels.includes("rss") && (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1">
          <Rss className="h-3 w-3 text-accent" />
          <code className="flex-1 truncate font-mono text-[11px] text-ink-muted">{feedHref}</code>
          <CopyButton
            value={feedHref}
            label="Copy"
            event={browseSavedSearchManagerFeedCopyAnalyticsEvent()}
            eventData={browseSavedSearchManagerFeedCopyAnalyticsData(
              savedSearchFilterCount(search),
            )}
          />
        </div>
      )}
      <div className="mt-3 flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => {
            trackEvent(
              browseSavedSearchManagerAlertsCancelAnalyticsEvent(),
              browseSavedSearchManagerAlertsCancelAnalyticsData(savedSearchFilterCount(search)),
            );
            onCancel();
          }}
          className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2 text-[11px] text-ink-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onSave({ ...draft, enabled: true });
            } finally {
              setBusy(false);
            }
          }}
          className="inline-flex h-7 items-center rounded-md bg-ink px-2 text-[11px] font-medium text-background hover:bg-ink/90 disabled:opacity-60"
        >
          Save alerts
        </button>
      </div>
    </div>
  );
}

export function SavedSearchManager({ open, onOpenChange, trigger }: ManagerProps) {
  const recents = useRecents();
  const navigate = useNavigate();
  const wasOpenRef = React.useRef(Boolean(open));
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftLabel, setDraftLabel] = React.useState("");
  const [alertsEditingId, setAlertsEditingId] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<{ id: string; text: string; ok: boolean } | null>(null);

  // Track open for both Dialog-driven and parent-controlled open (e.g. Manage).
  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      trackEvent(
        browseSavedSearchManagerOpenAnalyticsEvent(),
        browseSavedSearchManagerOpenAnalyticsData(recents.saved.length),
      );
    }
    wasOpenRef.current = Boolean(open);
  }, [open, recents.saved.length]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const close = () => handleOpenChange(false);

  const apply = (s: SavedSearch) => {
    trackEvent(
      browseSavedSearchManagerApplyAnalyticsEvent(),
      browseSavedSearchManagerApplyAnalyticsData(s),
    );
    navigate({ to: "/browse", search: applyToBrowseSearch(s) });
    close();
  };

  const renameSaved = (id: string, label: string) => {
    trackEvent(
      browseSavedSearchManagerRenameAnalyticsEvent(),
      browseSavedSearchManagerRenameAnalyticsData(recents.saved.length),
    );
    recents.renameSaved(id, label);
    setEditingId(null);
  };

  const saveAlerts = async (s: SavedSearch, alerts: AlertSchedule) => {
    trackEvent(
      browseSavedSearchManagerAlertsSaveAnalyticsEvent(),
      browseSavedSearchManagerAlertsSaveAnalyticsData(
        alerts.channels.length,
        alerts.cadence,
        alerts.channels.includes("email") && Boolean(alerts.email),
      ),
    );
    recents.updateSavedAlerts(s.id, alerts);
    if (alerts.channels.includes("email") && alerts.email) {
      const res = await subscribeToNewsletter({
        email: alerts.email,
        segments: [`saved-search:${hashSearch(s)}`],
        source: "saved-search",
      });
      setMsg({
        id: s.id,
        ok: res.ok,
        text: res.ok ? "Alerts saved · email confirmed." : `Saved locally, but: ${res.error}`,
      });
    } else {
      setMsg({ id: s.id, ok: true, text: "Alerts saved." });
    }
    setAlertsEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Saved searches</DialogTitle>
          <DialogDescription>
            Reopen, rename, schedule alerts, or remove. Alerts can fire in-app, by email, or via a
            personal RSS feed.
          </DialogDescription>
        </DialogHeader>
        {recents.saved.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-ink-muted">
            <Star className="h-5 w-5 text-ink-subtle" />
            <p>No saved searches yet.</p>
            <p className="text-xs">
              Open <span className="font-mono text-ink">/browse</span>, apply filters, then tap
              “Save this search”.
            </p>
          </div>
        ) : (
          <ul className="max-h-[60vh] divide-y divide-border overflow-auto">
            {recents.saved.map((s) => {
              const isEditing = editingId === s.id;
              const isAlerting = alertsEditingId === s.id;
              const alertsOn = !!s.alerts?.enabled;
              return (
                <li key={s.id} className="flex flex-col gap-2 py-3">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={draftLabel}
                        onChange={(e) => setDraftLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            renameSaved(s.id, draftLabel);
                          } else if (e.key === "Escape") {
                            setEditingId(null);
                          }
                        }}
                        className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                        aria-label="Rename saved search"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => apply(s)}
                        className="flex-1 text-left text-sm font-medium text-ink hover:underline"
                      >
                        {s.label}
                      </button>
                    )}
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <button
                          type="button"
                          aria-label="Save name"
                          onClick={() => renameSaved(s.id, draftLabel)}
                          className="rounded p-1 text-ink-muted hover:text-ink"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label="Rename"
                          onClick={() => {
                            setEditingId(s.id);
                            setDraftLabel(s.label);
                          }}
                          className="rounded p-1 text-ink-muted hover:text-ink"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={alertsOn ? "Disable alerts" : "Enable alerts"}
                        onClick={() => {
                          trackEvent(
                            browseSavedSearchManagerAlertsToggleAnalyticsEvent(),
                            browseSavedSearchManagerAlertsToggleAnalyticsData(
                              !alertsOn,
                              savedSearchFilterCount(s),
                            ),
                          );
                          recents.toggleSavedAlerts(s.id, !alertsOn);
                        }}
                        className={cn(
                          "rounded p-1",
                          alertsOn ? "text-accent" : "text-ink-muted hover:text-ink",
                        )}
                      >
                        {alertsOn ? (
                          <Bell className="h-3.5 w-3.5" />
                        ) : (
                          <BellOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label="Edit alert schedule"
                        onClick={() => {
                          const nextOpen = !isAlerting;
                          trackEvent(
                            browseSavedSearchManagerAlertsEditorAnalyticsEvent(),
                            browseSavedSearchManagerAlertsEditorAnalyticsData(
                              nextOpen,
                              savedSearchFilterCount(s),
                            ),
                          );
                          setAlertsEditingId(nextOpen ? s.id : null);
                        }}
                        className="rounded p-1 text-ink-muted hover:text-ink"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => {
                          trackEvent(
                            browseSavedSearchManagerRemoveAnalyticsEvent(),
                            browseSavedSearchManagerRemoveAnalyticsData(recents.saved.length),
                          );
                          recents.removeSaved(s.id);
                          toast(`Removed “${s.label}”`);
                        }}
                        className="rounded p-1 text-ink-muted hover:text-trust-blocked"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => apply(s)}
                        aria-label="Open"
                        className="rounded p-1 text-ink-muted hover:text-ink"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-ink-subtle">
                    {s.q && (
                      <span>
                        q: <span className="font-mono text-ink-muted">{s.q}</span>
                      </span>
                    )}
                    {s.category && <span>· {s.category}</span>}
                    {s.trust && <span>· {s.trust}</span>}
                    {s.source && <span>· {s.source}</span>}
                    {s.platform && <span>· {s.platform}</span>}
                    {alertsOn && s.alerts && (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 text-[10px] text-ink">
                        <Bell className="h-2.5 w-2.5" />
                        {s.alerts.channels.join(" · ")} · {s.alerts.cadence}
                      </span>
                    )}
                  </div>
                  {isAlerting && (
                    <AlertEditor
                      search={s}
                      initial={s.alerts ?? defaultAlerts()}
                      onSave={(a) => saveAlerts(s, a)}
                      onCancel={() => setAlertsEditingId(null)}
                    />
                  )}
                  {msg?.id === s.id && (
                    <p
                      className={cn(
                        "text-[11px]",
                        msg.ok ? "text-trust-trusted" : "text-trust-blocked",
                      )}
                    >
                      {msg.text}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={close}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-surface px-2.5 text-xs text-ink hover:bg-surface-2"
          >
            <X className="h-3.5 w-3.5" /> Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Hook that wires Cmd/Ctrl+Shift+S to toggle the manager. */
export function useSavedSearchShortcut(setOpen: (b: boolean) => void) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

import * as React from "react";
import { Bell, CheckCheck, AlertTriangle, Info, OctagonX } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWatch } from "@/lib/watch";
import { groupAlertsByBucket } from "@/lib/alerts-group-lib";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  alertsDropdownItemClickAnalyticsData,
  alertsDropdownItemClickAnalyticsEvent,
  alertsDropdownMarkAllReadAnalyticsData,
  alertsDropdownMarkAllReadAnalyticsEvent,
  alertsDropdownOpenAnalyticsData,
  alertsDropdownOpenAnalyticsEvent,
} from "@/lib/alerts-dropdown-cta-events";

const SEV_ICON = {
  info: { Icon: Info, cls: "text-ink-muted" },
  warning: { Icon: AlertTriangle, cls: "text-trust-review" },
  blocker: { Icon: OctagonX, cls: "text-trust-blocked" },
};

export function AlertsDropdown() {
  const { alerts, unreadCount, lastSeenAt, markAllRead, targets, savedSearchAlertCount } =
    useWatch();
  const grouped = React.useMemo(
    () => groupAlertsByBucket(alerts, Date.now()),
    [alerts, lastSeenAt],
  );
  const [open, setOpen] = React.useState(false);
  const openRef = React.useRef(open);
  openRef.current = open;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next && !openRef.current) {
        trackEvent(
          alertsDropdownOpenAnalyticsEvent(),
          alertsDropdownOpenAnalyticsData(
            unreadCount,
            alerts.length,
            targets.length,
            savedSearchAlertCount,
          ),
        );
      }
      setOpen(next);
    },
    [alerts.length, savedSearchAlertCount, targets.length, unreadCount],
  );

  const onMarkAllRead = React.useCallback(() => {
    if (unreadCount === 0) return;
    trackEvent(
      alertsDropdownMarkAllReadAnalyticsEvent(),
      alertsDropdownMarkAllReadAnalyticsData(unreadCount),
    );
    markAllRead();
  }, [markAllRead, unreadCount]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Alerts${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-accent-ink"
              aria-hidden
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[380px] max-w-[92vw] p-0">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="eyebrow">Alerts</div>
            <div className="mt-0.5 text-xs text-ink-muted">
              {targets.length} watched · {savedSearchAlertCount} saved · {alerts.length} total
            </div>
          </div>
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-ink disabled:opacity-40"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        </header>

        {alerts.length === 0 ? (
          <div className="px-5 py-10 text-center text-xs text-ink-muted">
            No alerts yet - watch a listing or enable in-app alerts on a saved search.
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            {(Object.keys(grouped) as Array<keyof typeof grouped>).map((k) =>
              grouped[k].length === 0 ? null : (
                <section key={k}>
                  <div className="border-b border-border bg-surface-2 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                    {k}
                  </div>
                  <ul>
                    {grouped[k].map((a) => {
                      const meta = SEV_ICON[a.severity];
                      const Icon = meta.Icon;
                      const unread = a.date > lastSeenAt;
                      const body = (
                        <div className="flex gap-3 px-4 py-3">
                          <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.cls)} aria-hidden />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-ink">{a.title}</span>
                              {unread && (
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{a.body}</p>
                            <div className="mt-0.5 font-mono text-[10px] text-ink-subtle">
                              {a.date}
                            </div>
                          </div>
                        </div>
                      );
                      return (
                        <li
                          key={a.id}
                          className="border-b border-border last:border-0 hover:bg-surface-2"
                        >
                          {a.href ? (
                            <Link
                              to={a.href}
                              className="block"
                              onClick={() =>
                                trackEvent(
                                  alertsDropdownItemClickAnalyticsEvent(),
                                  alertsDropdownItemClickAnalyticsData(
                                    a.severity,
                                    k,
                                    a.kind,
                                    unread,
                                  ),
                                )
                              }
                            >
                              {body}
                            </Link>
                          ) : (
                            body
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ),
            )}
          </div>
        )}

        <footer className="border-t border-border px-4 py-2.5 text-[11px] text-ink-muted">
          Alerts are read from the public registry event feed; watched targets and saved searches
          stay in this browser.
        </footer>
      </PopoverContent>
    </Popover>
  );
}

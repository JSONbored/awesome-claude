import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { Bell, Mail, Rss, Trash2, Pencil, Check, X, MailX, Compass } from "lucide-react";
import { useRecents } from "@/lib/recents";
import { SavedSearchManager } from "@/components/saved-search-manager";
import { EmptyState } from "@/components/empty-state";
import { unsubscribeFromNewsletter } from "@/lib/api/newsletter";
import { trackEvent } from "@/lib/analytics";
import {
  subscriptionsPageConfirmAnalyticsData,
  subscriptionsPageConfirmAnalyticsEvent,
  subscriptionsPageEgressAnalyticsData,
  subscriptionsPageEgressAnalyticsEvent,
  subscriptionsPageManageAlertsAnalyticsData,
  subscriptionsPageManageAlertsAnalyticsEvent,
} from "@/lib/subscriptions-page-cta-events";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscriptions — HeyClaude" },
      {
        name: "description",
        content:
          "Manage your followed categories, email segments, and saved-search alerts on HeyClaude.",
      },
      { property: "og:title", content: "Subscriptions — HeyClaude" },
      {
        property: "og:description",
        content: "Followed categories, email segments, and saved-search alerts.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/subscriptions") }],
  }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const recents = useRecents();
  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameDraft, setRenameDraft] = React.useState("");
  const [managerOpen, setManagerOpen] = React.useState(false);
  const [pending, setPending] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  const followCount = recents.follows.length;
  const segmentCount = recents.segments.length;
  const alertCount = recents.saved.filter((s) => s.alerts?.enabled).length;

  const [confirm, setConfirm] = React.useState<
    | { kind: "follow"; id: string; label: string }
    | { kind: "segment"; id: string; label: string; email?: string }
    | null
  >(null);

  const doRemoveFollow = async (id: string) => {
    const f = recents.follows.find((x) => x.id === id);
    recents.removeFollow(id);
    if (f?.email) {
      setPending(id);
      const res = await unsubscribeFromNewsletter({
        email: f.email,
        segments: [f.followId],
      });
      setPending(null);
      setMsg({
        ok: res.ok,
        text: res.ok ? `Unfollowed ${f.label}.` : `Removed locally, but: ${res.error}`,
      });
    }
  };

  const doRemoveSegment = async (id: string) => {
    const seg = recents.segments.find((x) => x.id === id);
    recents.removeSegment(id);
    if (seg?.email) {
      setPending(id);
      const res = await unsubscribeFromNewsletter({
        email: seg.email,
        segments: [seg.id],
      });
      setPending(null);
      setMsg({
        ok: res.ok,
        text: res.ok
          ? `Unsubscribed ${seg.email} from ${seg.label}.`
          : `Removed locally, but: ${res.error}`,
      });
    }
  };

  const removeFollow = (id: string) => {
    const f = recents.follows.find((x) => x.id === id);
    setConfirm({ kind: "follow", id, label: f?.label ?? "this stream" });
  };
  const removeSegment = (id: string) => {
    const s = recents.segments.find((x) => x.id === id);
    setConfirm({ kind: "segment", id, label: s?.label ?? "this segment", email: s?.email });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="eyebrow">Subscriptions</div>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
        Your subscriptions
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Everything you follow, by email and RSS. Subscriptions are stored locally on this device;
        unsubscribe also notifies Resend.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={<Bell className="h-4 w-4" />} label="Saved alerts" value={alertCount} />
        <Stat icon={<Rss className="h-4 w-4" />} label="Followed streams" value={followCount} />
        <Stat
          icon={<Mail className="h-4 w-4" />}
          label="Active email segments"
          value={segmentCount}
        />
      </div>

      {msg && (
        <p
          className={cn("mt-4 text-xs", msg.ok ? "text-trust-trusted" : "text-trust-blocked")}
          role="status"
        >
          {msg.text}
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">
          Followed categories &amp; streams
        </h2>
        <p className="text-xs text-ink-muted">
          Rename for your own reference, or unfollow at any time.
        </p>
        <div className="mt-3 rounded-xl border border-border bg-surface">
          {recents.follows.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={Rss}
                title="No followed streams yet"
                body="Follow categories or changelog streams to get email or RSS alerts when they update."
                action={
                  <div className="flex gap-2">
                    <Link
                      to="/feeds"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 text-xs font-medium text-background hover:bg-ink/90"
                      onClick={() =>
                        trackEvent(
                          subscriptionsPageEgressAnalyticsEvent(),
                          subscriptionsPageEgressAnalyticsData("feeds"),
                        )
                      }
                    >
                      <Rss className="h-3.5 w-3.5" /> Browse feeds
                    </Link>
                    <Link
                      to="/browse"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink hover:bg-surface-2"
                      onClick={() =>
                        trackEvent(
                          subscriptionsPageEgressAnalyticsEvent(),
                          subscriptionsPageEgressAnalyticsData("browse"),
                        )
                      }
                    >
                      <Compass className="h-3.5 w-3.5" /> Browse directory
                    </Link>
                  </div>
                }
                className="border-0 bg-transparent p-4"
              />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recents.follows.map((f) => {
                const isRenaming = renameId === f.id;
                return (
                  <li key={f.id} className="flex items-center gap-2 px-4 py-3">
                    <Rss className="h-3.5 w-3.5 text-accent" />
                    <div className="flex-1 min-w-0">
                      {isRenaming ? (
                        <input
                          autoFocus
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              recents.renameFollow(f.id, renameDraft);
                              setRenameId(null);
                            } else if (e.key === "Escape") setRenameId(null);
                          }}
                          className="h-7 w-full rounded-md border border-border bg-background px-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                        />
                      ) : (
                        <div className="truncate text-sm text-ink">{f.label}</div>
                      )}
                      <div className="truncate text-[11px] text-ink-subtle">
                        <span className="font-mono">{f.followId}</span>
                        {f.email && <span> · {f.email}</span>}
                      </div>
                    </div>
                    {isRenaming ? (
                      <button
                        type="button"
                        aria-label="Save"
                        onClick={() => {
                          recents.renameFollow(f.id, renameDraft);
                          setRenameId(null);
                        }}
                        className="rounded p-1 text-ink-muted hover:text-ink"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label="Rename"
                        onClick={() => {
                          setRenameId(f.id);
                          setRenameDraft(f.label);
                        }}
                        className="rounded p-1 text-ink-muted hover:text-ink"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Unfollow"
                      disabled={pending === f.id}
                      onClick={() => void removeFollow(f.id)}
                      className="rounded p-1 text-ink-muted hover:text-trust-blocked disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">Email segments</h2>
        <p className="text-xs text-ink-muted">
          Emails Resend has on file for this device. Removing here also unsubscribes you.
        </p>
        <div className="mt-3 rounded-xl border border-border bg-surface">
          {recents.segments.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-ink-muted">
              No email segments yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recents.segments.map((s) => (
                <li key={`${s.id}:${s.email}`} className="flex items-center gap-2 px-4 py-3">
                  <Mail className="h-3.5 w-3.5 text-ink-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm text-ink">{s.label}</div>
                    <div className="truncate text-[11px] text-ink-subtle">
                      <span className="font-mono">{s.id}</span> · {s.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Unsubscribe"
                    disabled={pending === s.id}
                    onClick={() => void removeSegment(s.id)}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-xs text-ink-muted hover:text-trust-blocked disabled:opacity-50"
                  >
                    <MailX className="h-3.5 w-3.5" /> Unsubscribe
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Saved-search alerts</h2>
          <button
            type="button"
            onClick={() => {
              trackEvent(
                subscriptionsPageManageAlertsAnalyticsEvent(),
                subscriptionsPageManageAlertsAnalyticsData(alertCount, recents.saved.length),
              );
              setManagerOpen(true);
            }}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-surface px-2.5 text-xs text-ink hover:bg-surface-2"
          >
            <Pencil className="h-3.5 w-3.5" /> Manage
          </button>
        </div>
        <p className="text-xs text-ink-muted">
          {alertCount} of {recents.saved.length} saved searches have alerts enabled.
        </p>
        {alertCount > 0 && (
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
            {recents.saved
              .filter((s) => s.alerts?.enabled)
              .map((s) => (
                <li key={s.id} className="flex items-center gap-2 px-4 py-3 text-sm">
                  <Bell className="h-3.5 w-3.5 text-accent" />
                  <span className="flex-1 truncate text-ink">{s.label}</span>
                  <span className="text-[11px] text-ink-subtle">
                    {s.alerts?.channels.join(" · ")} · {s.alerts?.cadence}
                  </span>
                </li>
              ))}
          </ul>
        )}
        <SavedSearchManager open={managerOpen} onOpenChange={setManagerOpen} />
      </section>

      <p className="mt-10 flex items-center gap-2 text-xs text-ink-subtle">
        <X className="h-3 w-3" />
        Subscriptions are stored on this device. Clearing browser data will remove them locally but
        won't unsubscribe you from email — visit this page to manage.
      </p>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "follow" ? "Unfollow this stream?" : "Unsubscribe this email?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "follow"
                ? `You'll stop receiving updates for "${confirm.label}". You can re-follow at any time from /feeds.`
                : `${confirm && "email" in confirm && confirm.email ? confirm.email : "This email"} will be removed from "${confirm?.label}". Resend will be notified.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirm) return;
                trackEvent(
                  subscriptionsPageConfirmAnalyticsEvent(),
                  subscriptionsPageConfirmAnalyticsData(confirm.kind),
                );
                if (confirm.kind === "follow") void doRemoveFollow(confirm.id);
                else void doRemoveSegment(confirm.id);
                setConfirm(null);
              }}
              className="bg-trust-blocked text-background hover:bg-trust-blocked/90"
            >
              {confirm?.kind === "follow" ? "Unfollow" : "Unsubscribe"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">{value}</div>
    </div>
  );
}

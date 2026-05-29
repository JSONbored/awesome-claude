import { AlertTriangle, ArrowBigUp, Check, Eye, LoaderCircle } from "lucide-react";
import * as React from "react";

import type { Category } from "@/types/registry";
import { cn } from "@/lib/utils";

type CommunityCounts = {
  used: number;
  works: number;
  broken: number;
};

type SignalState = {
  loading: boolean;
  votesAvailable: boolean;
  communityAvailable: boolean;
  voteCount: number;
  voted: boolean;
  community: CommunityCounts;
  activeCommunity: Partial<Record<keyof CommunityCounts, boolean>>;
};

const ZERO_COMMUNITY: CommunityCounts = { used: 0, works: 0, broken: 0 };
const CLIENT_STORAGE_KEY = "hc:client-id";
const COMMUNITY_STORAGE_PREFIX = "hc:community:";

function entryKey(category: Category, slug: string) {
  return `${category}:${slug}`;
}

function communityTargetKey(category: Category, slug: string) {
  return `entry:${category}/${slug}`;
}

function getClientId() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(CLIENT_STORAGE_KEY);
  if (existing && /^[a-zA-Z0-9_-]{16,96}$/.test(existing)) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `hc-${crypto.randomUUID()}`
      : `hc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 18)}`;
  window.localStorage.setItem(CLIENT_STORAGE_KEY, generated);
  return generated;
}

function readActiveCommunity(targetKey: string): SignalState["activeCommunity"] {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(`${COMMUNITY_STORAGE_PREFIX}${targetKey}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      used: parsed.used === true,
      works: parsed.works === true,
      broken: parsed.broken === true,
    };
  } catch {
    return {};
  }
}

function writeActiveCommunity(targetKey: string, active: SignalState["activeCommunity"]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${COMMUNITY_STORAGE_PREFIX}${targetKey}`, JSON.stringify(active));
}

async function postJson(path: string, payload: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

function asCommunityCounts(value: unknown): CommunityCounts {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    used: Number(source.used ?? 0) || 0,
    works: Number(source.works ?? 0) || 0,
    broken: Number(source.broken ?? 0) || 0,
  };
}

export function EntrySignalsPanel({ category, slug }: { category: Category; slug: string }) {
  const key = entryKey(category, slug);
  const targetKey = communityTargetKey(category, slug);
  const [state, setState] = React.useState<SignalState>({
    loading: true,
    votesAvailable: false,
    communityAvailable: false,
    voteCount: 0,
    voted: false,
    community: ZERO_COMMUNITY,
    activeCommunity: {},
  });

  React.useEffect(() => {
    let cancelled = false;
    const clientId = getClientId();
    setState((current) => ({
      ...current,
      loading: true,
      activeCommunity: readActiveCommunity(targetKey),
    }));

    Promise.allSettled([
      postJson("/api/votes/query", { keys: [key], clientId }),
      postJson("/api/community-signals/query", {
        targets: [{ targetKind: "entry", targetKey }],
      }),
    ]).then(([votesResult, communityResult]) => {
      if (cancelled) return;

      const votes = votesResult.status === "fulfilled" ? votesResult.value : undefined;
      const community = communityResult.status === "fulfilled" ? communityResult.value : undefined;
      const voteCounts =
        votes?.counts && typeof votes.counts === "object"
          ? (votes.counts as Record<string, unknown>)
          : {};
      const votedRows =
        votes?.voted && typeof votes.voted === "object"
          ? (votes.voted as Record<string, unknown>)
          : {};
      const communityCounts =
        community?.counts && typeof community.counts === "object"
          ? (community.counts as Record<string, unknown>)
          : {};

      setState((current) => ({
        ...current,
        loading: false,
        votesAvailable: votes?.available === true,
        communityAvailable: community?.available === true,
        voteCount: Number(voteCounts[key] ?? 0) || 0,
        voted: votedRows[key] === true,
        community: asCommunityCounts(communityCounts[targetKey]),
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [key, targetKey]);

  const toggleVote = async () => {
    const clientId = getClientId();
    const nextVote = !state.voted;
    setState((current) => ({
      ...current,
      voted: nextVote,
      voteCount: Math.max(0, current.voteCount + (nextVote ? 1 : -1)),
    }));
    try {
      const result = await postJson("/api/votes/toggle", {
        key,
        clientId,
        vote: nextVote,
      });
      setState((current) => ({
        ...current,
        votesAvailable: true,
        voteCount: Number(result.count ?? current.voteCount) || 0,
        voted: result.voted === true,
      }));
    } catch {
      setState((current) => ({
        ...current,
        votesAvailable: false,
        voted: !nextVote,
        voteCount: Math.max(0, current.voteCount + (nextVote ? -1 : 1)),
      }));
    }
  };

  const toggleCommunity = async (signalType: keyof CommunityCounts) => {
    const clientId = getClientId();
    const active = !state.activeCommunity[signalType];
    const nextActive = { ...state.activeCommunity, [signalType]: active };
    writeActiveCommunity(targetKey, nextActive);
    setState((current) => ({
      ...current,
      activeCommunity: nextActive,
      community: {
        ...current.community,
        [signalType]: Math.max(0, current.community[signalType] + (active ? 1 : -1)),
      },
    }));

    try {
      const result = await postJson("/api/community-signals", {
        targetKind: "entry",
        targetKey,
        signalType,
        clientId,
        active,
      });
      setState((current) => ({
        ...current,
        communityAvailable: result.available === true,
        community: asCommunityCounts(result.counts),
      }));
    } catch {
      const rolledBack = { ...state.activeCommunity };
      writeActiveCommunity(targetKey, rolledBack);
      setState((current) => ({
        ...current,
        communityAvailable: false,
        activeCommunity: rolledBack,
        community: {
          ...current.community,
          [signalType]: Math.max(0, current.community[signalType] + (active ? -1 : 1)),
        },
      }));
    }
  };

  const live = state.votesAvailable || state.communityAvailable;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SignalButton
          active={state.voted}
          disabled={state.loading}
          icon={ArrowBigUp}
          label="Upvote"
          count={state.voteCount}
          tone="accent"
          onClick={toggleVote}
        />
        <SignalButton
          active={state.activeCommunity.used}
          disabled={state.loading}
          icon={Eye}
          label="Used"
          count={state.community.used}
          tone="neutral"
          onClick={() => toggleCommunity("used")}
        />
        <SignalButton
          active={state.activeCommunity.works}
          disabled={state.loading}
          icon={Check}
          label="Works"
          count={state.community.works}
          tone="trusted"
          onClick={() => toggleCommunity("works")}
        />
        <SignalButton
          active={state.activeCommunity.broken}
          disabled={state.loading}
          icon={AlertTriangle}
          label="Broken"
          count={state.community.broken}
          tone="warn"
          onClick={() => toggleCommunity("broken")}
        />
      </div>
      <p className="text-xs text-ink-muted">
        {state.loading ? (
          <span className="inline-flex items-center gap-1">
            <LoaderCircle className="h-3 w-3 animate-spin" /> Loading live community signals…
          </span>
        ) : live ? (
          "Live aggregate signals from D1. These are popularity/usage hints, not safety approvals."
        ) : (
          "Live signal storage is unavailable right now, so no popularity or usage claims are shown."
        )}
      </p>
    </div>
  );
}

function SignalButton({
  icon: Icon,
  label,
  count,
  active,
  disabled,
  onClick,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  tone: "accent" | "trusted" | "warn" | "neutral";
}) {
  const toneClass =
    tone === "accent"
      ? "data-[active=true]:bg-accent data-[active=true]:text-accent-ink data-[active=true]:border-accent"
      : tone === "trusted"
        ? "data-[active=true]:bg-trust-trusted/10 data-[active=true]:border-trust-trusted/50 data-[active=true]:text-trust-trusted"
        : tone === "warn"
          ? "data-[active=true]:bg-trust-review/10 data-[active=true]:border-trust-review/50 data-[active=true]:text-trust-review"
          : "data-[active=true]:bg-surface-raised data-[active=true]:border-ink-muted data-[active=true]:text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-active={active || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors duration-200 ease-out hover:text-ink disabled:cursor-wait disabled:opacity-60",
        toneClass,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
      <span className="font-mono text-ink">{count.toLocaleString()}</span>
    </button>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { z } from "zod";

const tokenInput = z.object({ token: z.string() });

// Verify the signed link and return the draft it points at (read-only — the
// approval itself is a separate POST so an email link-scanner can't auto-approve).
const verifyApprove = createServerFn({ method: "GET" })
  .inputValidator(tokenInput)
  .handler(async ({ data }) => {
    const { getEnvString } = await import("@/lib/cloudflare-env.server");
    const { verifyBriefApproveToken } = await import("@/lib/brief-token.server");
    const secret = getEnvString("NEWSLETTER_CONFIRM_SECRET");
    if (!secret) return { ok: false as const, reason: "unconfigured" as const };
    const payload = await verifyBriefApproveToken(secret, data.token, Date.now());
    if (!payload) return { ok: false as const, reason: "invalid" as const };
    return { ok: true as const, number: payload.n, periodThrough: payload.p };
  });

const confirmApprove = createServerFn({ method: "POST" })
  .inputValidator(tokenInput)
  .handler(async ({ data }) => {
    const { getEnvString } = await import("@/lib/cloudflare-env.server");
    const { verifyBriefApproveToken } = await import("@/lib/brief-token.server");
    const { approveBrief } = await import("@/lib/brief-issues.server");
    const { nextSendSlot } = await import("@/lib/brief-schedule");
    const secret = getEnvString("NEWSLETTER_CONFIRM_SECRET");
    if (!secret) return { ok: false as const, reason: "unconfigured" as const };
    const payload = await verifyBriefApproveToken(secret, data.token, Date.now());
    if (!payload) return { ok: false as const, reason: "invalid" as const };
    const scheduledSendAt = nextSendSlot(new Date());
    const changed = await approveBrief(payload.n, scheduledSendAt);
    return changed
      ? { ok: true as const, scheduledSendAt }
      : { ok: false as const, reason: "already" as const };
  });

export const Route = createFileRoute("/brief/approve")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: String(search.token ?? ""),
  }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: ({ deps }) => verifyApprove({ data: { token: deps.token } }),
  head: () => ({
    meta: [{ title: "Approve Weekly Brief — HeyClaude" }, { name: "robots", content: "noindex" }],
  }),
  component: ApprovePage,
});

function ApprovePage() {
  const result = Route.useLoaderData();
  const { token } = Route.useSearch();
  const [state, setState] = useState<
    | { phase: "idle" }
    | { phase: "working" }
    | { phase: "done"; scheduledSendAt: string }
    | { phase: "error"; reason: string }
  >({ phase: "idle" });

  if (!result.ok) {
    return (
      <Shell heading="Link not valid">
        {result.reason === "unconfigured"
          ? "Brief approval isn't configured right now."
          : "This approval link is invalid or has expired. Generate a fresh draft and try again."}
      </Shell>
    );
  }

  if (state.phase === "done") {
    const when = new Date(state.scheduledSendAt).toUTCString();
    return (
      <Shell heading="Approved — scheduled to send">
        Weekly Brief #{result.number} (week of {result.periodThrough}) is approved and will be sent
        to the newsletter audience at <strong>{when}</strong>.
      </Shell>
    );
  }

  return (
    <Shell heading={`Approve Weekly Brief #${result.number}`}>
      Approving the draft for the week of <strong>{result.periodThrough}</strong> schedules it to
      send to the newsletter audience at the next Tuesday 15:00 UTC slot. Review the full draft in
      your preview email first.
      {state.phase === "error" && (
        <p style={{ color: "#b4541f", marginTop: 12 }}>
          {state.reason === "already"
            ? "That issue was already approved or sent."
            : "Could not approve — please try the link again."}
        </p>
      )}
      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          disabled={state.phase === "working"}
          onClick={async () => {
            setState({ phase: "working" });
            try {
              const res = await confirmApprove({ data: { token } });
              if (res.ok) setState({ phase: "done", scheduledSendAt: res.scheduledSendAt });
              else setState({ phase: "error", reason: res.reason });
            } catch {
              setState({ phase: "error", reason: "error" });
            }
          }}
          className="inline-flex h-10 items-center rounded-md bg-ink px-5 font-medium text-background hover:opacity-90 disabled:opacity-60"
        >
          {state.phase === "working" ? "Approving…" : "Approve & schedule send"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="eyebrow text-ink-subtle">Weekly Brief</div>
      <h1 className="mt-2 h-display-2 text-ink">{heading}</h1>
      <p className="mt-4 text-pretty text-ink-muted">{children}</p>
      <Link to="/brief" className="mt-8 inline-block text-sm text-ink-muted hover:text-ink">
        ← Back to the Weekly Brief
      </Link>
    </div>
  );
}

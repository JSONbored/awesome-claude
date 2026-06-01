import { Container } from "@cloudflare/containers";
import { DurableObject } from "cloudflare:workers";

import {
  DEFAULT_REVIEW_MARKER,
  LABELS,
  PILOT_LABEL,
  REVIEWABLE_PR_ACTIONS,
} from "./constants";
import {
  buildContributorMdx,
  buildDraftTarget,
  draftFieldsFromBody,
} from "./drafts";
import {
  addLabels,
  buildGitHubAppAuthorizeUrl,
  closeIssueOrPullRequest,
  createUserForkContentPr,
  exchangeGitHubUserCode,
  getInstallationToken,
  parseRepo,
  upsertMarkerComment,
} from "./github";
import {
  defaultManualDecision,
  markerComment,
  type GateDecision,
} from "./review";
import {
  decryptText,
  encryptText,
  randomToken,
  signInternalPayload,
  verifyGitHubWebhookSignature,
  verifyInternalSignature,
} from "./security";
import {
  consumeDraftUserToken,
  createDraft,
  getDraft,
  insertAudit,
  storeDraftUserToken,
  updateDraftAuthState,
  updateDraftStatus,
  upsertPrState,
  verifyDraftState,
} from "./storage";

type Env = {
  PUBLIC_SITE_URL: string;
  PUBLIC_REPO: string;
  PILOT_BASE_REF: string;
  GITHUB_API_VERSION: string;
  REVIEW_MARKER: string;
  GITHUB_APP_CLIENT_ID?: string;
  GITHUB_APP_CLIENT_SECRET?: string;
  GITHUB_APP_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  GITHUB_WEBHOOK_SECRET?: string;
  INTERNAL_SHARED_SECRET?: string;
  PRIVATE_GATE_REVIEW_URL?: string;
  SUBMISSION_GATE_DB: D1Database;
  SUBMISSION_GATE_AUDIT: R2Bucket;
  SUBMISSION_REVIEW_QUEUE: Queue<Record<string, unknown>>;
  SUBMISSION_IMPORT_QUEUE: Queue<Record<string, unknown>>;
  SUBMISSION_LOCK: DurableObjectNamespace<SubmissionLock>;
  SUBMISSION_IMPORT_RUNNER: DurableObjectNamespace<SubmissionImportRunner>;
};

type QueueMessage = {
  kind: "review_pr" | "submit_draft" | "import_pr";
  targetKey: string;
  payload: Record<string, unknown>;
};

function json(payload: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set(
    "access-control-allow-headers",
    "content-type,x-github-event,x-github-delivery,x-hub-signature-256,x-heyclaude-internal-signature",
  );
  return Response.json(payload, { ...init, headers });
}

function textResponse(body: string, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(body, { ...init, headers });
}

function callbackUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.origin}/auth/github/callback`;
}

function draftStatusUrl(request: Request, id: string) {
  const url = new URL(request.url);
  return `${url.origin}/drafts/${id}`;
}

async function putAuditObject(env: Env, key: string, payload: unknown) {
  await env.SUBMISSION_GATE_AUDIT.put(key, JSON.stringify(payload, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
}

async function createDraftRoute(request: Request, env: Env) {
  const body = await request.json().catch(() => null);
  const fields = draftFieldsFromBody(body);
  const baseRef = env.PILOT_BASE_REF || "submission-gate-pilot";
  let target: ReturnType<typeof buildDraftTarget>;
  try {
    target = buildDraftTarget(fields, baseRef);
  } catch (error) {
    return json(
      {
        ok: false,
        error: "invalid_draft",
        message:
          error instanceof Error
            ? error.message
            : "Draft requires a supported category and slug.",
      },
      { status: 400 },
    );
  }
  const id = `draft_${crypto.randomUUID()}`;
  const state = randomToken();
  await createDraft(env.SUBMISSION_GATE_DB, {
    id,
    status: "auth_required",
    ...target,
    fields,
    authState: state,
  });
  await putAuditObject(env, `drafts/${id}.json`, { id, target, fields });

  const configured = Boolean(
    env.GITHUB_APP_CLIENT_ID && env.GITHUB_APP_CLIENT_SECRET,
  );
  const authUrl = configured
    ? buildGitHubAppAuthorizeUrl({
        clientId: env.GITHUB_APP_CLIENT_ID || "",
        callbackUrl: callbackUrl(request),
        state: `${id}.${state}`,
      })
    : "";

  return json({
    ok: true,
    configured,
    draftId: id,
    statusUrl: draftStatusUrl(request, id),
    authUrl: authUrl || undefined,
    target,
    manualPr: configured
      ? undefined
      : {
          targetPath: target.targetPath,
          branchName: target.branchName,
          baseRef: target.baseRef,
          body: buildContributorMdx(fields),
        },
  });
}

async function getDraftRoute(env: Env, id: string) {
  const draft = await getDraft(env.SUBMISSION_GATE_DB, id);
  if (!draft) return json({ ok: false, error: "not_found" }, { status: 404 });
  const fields = JSON.parse(String(draft.fieldsJson || "{}"));
  return json({
    ok: true,
    draft: {
      ...draft,
      fields,
      fieldsJson: undefined,
      authStateHash: undefined,
    },
  });
}

async function githubCallbackRoute(request: Request, env: Env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const [draftId, stateToken] = state.split(".");
  if (
    !draftId ||
    !stateToken ||
    !(await verifyDraftState(env.SUBMISSION_GATE_DB, draftId, stateToken))
  ) {
    return textResponse("Invalid or expired submission state.", {
      status: 400,
    });
  }
  if (!env.GITHUB_APP_CLIENT_ID || !env.GITHUB_APP_CLIENT_SECRET) {
    return textResponse("GitHub App user auth is not configured.", {
      status: 503,
    });
  }
  if (!env.INTERNAL_SHARED_SECRET) {
    return textResponse("Submission token handoff is not configured.", {
      status: 503,
    });
  }

  const userToken = await exchangeGitHubUserCode({
    clientId: env.GITHUB_APP_CLIENT_ID,
    clientSecret: env.GITHUB_APP_CLIENT_SECRET,
    code,
    callbackUrl: callbackUrl(request),
  });
  await storeDraftUserToken(env.SUBMISSION_GATE_DB, {
    draftId,
    encryptedToken: await encryptText(env.INTERNAL_SHARED_SECRET, userToken),
    ttlSeconds: 900,
  });
  await updateDraftStatus(env.SUBMISSION_GATE_DB, draftId, "queued");
  await env.SUBMISSION_REVIEW_QUEUE.send({
    kind: "submit_draft",
    targetKey: `draft:${draftId}`,
    payload: { draftId },
  });

  return textResponse(
    `<meta http-equiv="refresh" content="0; url=${draftStatusUrl(request, draftId)}">Submission queued.`,
  );
}

function isPilotPr(payload: Record<string, unknown>, env: Env) {
  const pull = payload.pull_request as
    | {
        number?: number;
        draft?: boolean;
        base?: { ref?: string; repo?: { full_name?: string } };
        labels?: Array<{ name?: string }>;
      }
    | undefined;
  if (!pull || pull.draft) return false;
  const labels = pull.labels?.map((label) => label.name) || [];
  return pull.base?.ref === env.PILOT_BASE_REF || labels.includes(PILOT_LABEL);
}

async function installationTokenForPayload(
  env: Env,
  payload: Record<string, unknown>,
) {
  const installationId = Number(
    (payload.installation as { id?: number } | undefined)?.id || 0,
  );
  if (!installationId || !env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY)
    return "";
  return getInstallationToken({
    appId: env.GITHUB_APP_ID,
    privateKeyPem: env.GITHUB_APP_PRIVATE_KEY,
    installationId,
    apiVersion: env.GITHUB_API_VERSION,
  });
}

async function applyUnderReview(env: Env, payload: Record<string, unknown>) {
  const pull = payload.pull_request as
    | {
        number?: number;
        base?: { repo?: { full_name?: string } };
      }
    | undefined;
  if (!pull?.number || !pull.base?.repo?.full_name) return;
  const token = await installationTokenForPayload(env, payload);
  if (!token) return;
  const repo = parseRepo(pull.base.repo.full_name);
  await addLabels({
    token,
    repo,
    issueNumber: pull.number,
    labels: [LABELS.underReview],
    apiVersion: env.GITHUB_API_VERSION,
  });
  await upsertMarkerComment({
    token,
    repo,
    issueNumber: pull.number,
    marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
    body: markerComment(undefined, env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER),
    apiVersion: env.GITHUB_API_VERSION,
  });
}

async function githubWebhookRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const raw = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const valid = await verifyGitHubWebhookSignature({
    secret: env.GITHUB_WEBHOOK_SECRET || "",
    payload: raw,
    signatureHeader: signature,
  });
  if (!valid)
    return json({ ok: false, error: "invalid_signature" }, { status: 401 });

  const payload = JSON.parse(raw) as Record<string, unknown>;
  const eventName = request.headers.get("x-github-event") || "";
  const deliveryId =
    request.headers.get("x-github-delivery") || crypto.randomUUID();
  await putAuditObject(
    env,
    `webhooks/${eventName}/${deliveryId}.json`,
    payload,
  );

  if (eventName === "pull_request") {
    const action = String(payload.action || "");
    const pull = payload.pull_request as
      | {
          number?: number;
          base?: { ref?: string; repo?: { full_name?: string } };
          head?: { ref?: string; repo?: { full_name?: string } };
        }
      | undefined;
    if (
      !REVIEWABLE_PR_ACTIONS.has(action) ||
      !pull?.number ||
      !pull.base?.repo?.full_name
    ) {
      return json({ ok: true, ignored: true });
    }
    if (!isPilotPr(payload, env))
      return json({ ok: true, ignored: true, reason: "outside_pilot" });
    const targetKey = `${pull.base.repo.full_name}#${pull.number}`;
    ctx.waitUntil(applyUnderReview(env, payload));
    await upsertPrState(env.SUBMISSION_GATE_DB, {
      repo: pull.base.repo.full_name,
      number: pull.number,
      headRepo: pull.head?.repo?.full_name,
      headRef: pull.head?.ref,
      baseRef: pull.base.ref || env.PILOT_BASE_REF,
      status: "queued",
      deliveryId,
    });
    await env.SUBMISSION_REVIEW_QUEUE.send({
      kind: "review_pr",
      targetKey,
      payload: { eventName, deliveryId, webhook: payload },
    });
    return json({ ok: true, queued: true, targetKey });
  }

  return json({ ok: true, ignored: true });
}

async function reviewWithPrivateGate(env: Env, message: QueueMessage) {
  if (!env.PRIVATE_GATE_REVIEW_URL || !env.INTERNAL_SHARED_SECRET) {
    return defaultManualDecision();
  }
  const body = JSON.stringify(message);
  const signature = await signInternalPayload(env.INTERNAL_SHARED_SECRET, body);
  const response = await fetch(env.PRIVATE_GATE_REVIEW_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-heyclaude-internal-signature": signature,
    },
    body,
  });
  if (!response.ok) {
    return defaultManualDecision(
      `Private corpus review returned ${response.status}.`,
    );
  }
  return (await response.json()) as GateDecision;
}

async function withSubmissionLock(
  env: Env,
  targetKey: string,
  fn: () => Promise<void>,
) {
  const stub = env.SUBMISSION_LOCK.getByName(targetKey);
  const response = await stub.fetch("https://lock.local/acquire", {
    method: "POST",
    body: JSON.stringify({ ttlSeconds: 120 }),
  });
  if (response.status === 423) return;
  await fn();
}

async function handleReviewMessage(env: Env, message: QueueMessage) {
  await withSubmissionLock(env, message.targetKey, async () => {
    if (message.kind === "submit_draft") {
      const draftId = String(message.payload.draftId || "");
      const encryptedToken = await consumeDraftUserToken(
        env.SUBMISSION_GATE_DB,
        draftId,
      );
      const userToken =
        encryptedToken && env.INTERNAL_SHARED_SECRET
          ? await decryptText(env.INTERNAL_SHARED_SECRET, encryptedToken)
          : "";
      const draft = await getDraft(env.SUBMISSION_GATE_DB, draftId);
      if (!draft || !userToken) return;
      const fields = JSON.parse(String(draft.fieldsJson || "{}")) as Record<
        string,
        unknown
      >;
      const title = `Add ${String(draft.category)}: ${String(fields.name || fields.title || draft.slug)}`;
      const content = buildContributorMdx(fields);
      const pr = await createUserForkContentPr({
        userToken,
        publicRepo: env.PUBLIC_REPO,
        baseRef: String(draft.baseRef || env.PILOT_BASE_REF),
        branchName: String(draft.branchName),
        targetPath: String(draft.targetPath),
        content,
        title,
        body: [
          "PR-first submission created by the HeyClaude website.",
          "",
          "The private submission gate will review category fit, source truth, duplicate history, safety/privacy, provenance, and generated-artifact scope.",
        ].join("\n"),
        apiVersion: env.GITHUB_API_VERSION,
      });
      await updateDraftStatus(env.SUBMISSION_GATE_DB, draftId, "pr_open", pr);
      await insertAudit(env.SUBMISSION_GATE_DB, {
        id: crypto.randomUUID(),
        targetKey: message.targetKey,
        eventType: "submit_draft",
        decision: "pr_open",
        summary: pr.pullRequestUrl,
      });
      return;
    }

    const decision = await reviewWithPrivateGate(env, message);
    await insertAudit(env.SUBMISSION_GATE_DB, {
      id: crypto.randomUUID(),
      targetKey: message.targetKey,
      eventType: message.kind,
      decision: decision.verdict,
      summary: decision.summary,
    });

    if (message.kind === "review_pr") {
      const webhook = message.payload.webhook as Record<string, unknown>;
      const pull = webhook.pull_request as
        | {
            number?: number;
            base?: { repo?: { full_name?: string }; ref?: string };
          }
        | undefined;
      if (!pull?.number || !pull.base?.repo?.full_name) return;
      const token = await installationTokenForPayload(env, webhook);
      if (!token) return;
      const repo = parseRepo(pull.base.repo.full_name);
      await upsertPrState(env.SUBMISSION_GATE_DB, {
        repo: pull.base.repo.full_name,
        number: pull.number,
        baseRef: pull.base.ref || env.PILOT_BASE_REF,
        status: decision.verdict,
        verdict: decision.verdict,
        verdictSummary: decision.summary,
      });
      if (decision.labels.length) {
        await addLabels({
          token,
          repo,
          issueNumber: pull.number,
          labels: decision.labels,
          apiVersion: env.GITHUB_API_VERSION,
        });
      }
      await upsertMarkerComment({
        token,
        repo,
        issueNumber: pull.number,
        marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
        body: markerComment(
          decision,
          env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
        ),
        apiVersion: env.GITHUB_API_VERSION,
      });
      if (decision.verdict === "close" && decision.close) {
        await closeIssueOrPullRequest({
          token,
          repo,
          issueNumber: pull.number,
          apiVersion: env.GITHUB_API_VERSION,
        });
      }
      if (decision.verdict === "import" && decision.importJob) {
        await env.SUBMISSION_IMPORT_QUEUE.send({
          kind: "import_pr",
          targetKey: message.targetKey,
          payload: {
            ...decision.importJob,
            repo: pull.base.repo.full_name,
            baseRef: pull.base.ref || env.PILOT_BASE_REF,
            githubToken: token,
            source: {
              repo: pull.base.repo.full_name,
              number: pull.number,
              baseRef: pull.base.ref || env.PILOT_BASE_REF,
              installationId: Number(
                (webhook.installation as { id?: number } | undefined)?.id || 0,
              ),
            },
          },
        });
      }
    }
  });
}

async function handleImportMessage(env: Env, message: QueueMessage) {
  const body = JSON.stringify(message.payload);
  const signature = env.INTERNAL_SHARED_SECRET
    ? await signInternalPayload(env.INTERNAL_SHARED_SECRET, body)
    : "";
  const stub = env.SUBMISSION_IMPORT_RUNNER.getByName(message.targetKey);
  const response = await stub.fetch("https://container.local/import", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-heyclaude-internal-signature": signature,
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`Import runner failed: ${response.status}`);
  }
  const result = (await response.json().catch(() => ({}))) as {
    pullRequestUrl?: string;
    pullRequestNumber?: number;
  };
  const payload = message.payload as {
    repo?: string;
    number?: number;
    source?: {
      repo?: string;
      number?: number;
      baseRef?: string;
      installationId?: number;
    };
  };
  const sourceRepo = payload.source?.repo || payload.repo || "";
  const sourceNumber = Number(payload.source?.number || payload.number || 0);
  const sourceInstallationId = Number(payload.source?.installationId || 0);
  if (sourceRepo && sourceNumber && result.pullRequestUrl) {
    await upsertPrState(env.SUBMISSION_GATE_DB, {
      repo: sourceRepo,
      number: sourceNumber,
      baseRef: payload.source?.baseRef || env.PILOT_BASE_REF,
      status: "import_pr_open",
      verdict: "import",
      verdictSummary: "Maintainer-owned import PR opened.",
      importPrUrl: result.pullRequestUrl,
    });
    const token =
      sourceInstallationId && env.GITHUB_APP_ID && env.GITHUB_APP_PRIVATE_KEY
        ? await getInstallationToken({
            appId: env.GITHUB_APP_ID,
            privateKeyPem: env.GITHUB_APP_PRIVATE_KEY,
            installationId: sourceInstallationId,
            apiVersion: env.GITHUB_API_VERSION,
          })
        : "";
    if (token) {
      const repo = parseRepo(sourceRepo);
      await addLabels({
        token,
        repo,
        issueNumber: sourceNumber,
        labels: [LABELS.importOpen, LABELS.superseded],
        apiVersion: env.GITHUB_API_VERSION,
      });
      await upsertMarkerComment({
        token,
        repo,
        issueNumber: sourceNumber,
        marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
        body: markerComment(
          {
            verdict: "import",
            summary: [
              `Maintainer-owned import PR opened: ${result.pullRequestUrl}`,
              "",
              "This contributor PR is closed as superseded so generated artifacts and final validation stay maintainer-owned.",
            ].join("\n"),
            labels: [LABELS.importOpen, LABELS.superseded],
          },
          env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
        ),
        apiVersion: env.GITHUB_API_VERSION,
      });
      await closeIssueOrPullRequest({
        token,
        repo,
        issueNumber: sourceNumber,
        apiVersion: env.GITHUB_API_VERSION,
      });
    }
  }
}

async function importCompleteRoute(request: Request, env: Env) {
  const body = await request.text();
  const valid = await verifyInternalSignature({
    secret: env.INTERNAL_SHARED_SECRET || "",
    payload: body,
    signatureHeader: request.headers.get("x-heyclaude-internal-signature"),
  });
  if (!valid)
    return json({ ok: false, error: "invalid_signature" }, { status: 401 });
  const payload = JSON.parse(body) as {
    targetKey?: string;
    repo?: string;
    number?: number;
    importPrUrl?: string;
    summary?: string;
  };
  if (payload.repo && payload.number) {
    await upsertPrState(env.SUBMISSION_GATE_DB, {
      repo: payload.repo,
      number: payload.number,
      baseRef: env.PILOT_BASE_REF,
      status: "import_pr_open",
      verdict: "import",
      verdictSummary: payload.summary || "Maintainer-owned import PR opened.",
      importPrUrl: payload.importPrUrl,
    });
  }
  await insertAudit(env.SUBMISSION_GATE_DB, {
    id: crypto.randomUUID(),
    targetKey:
      payload.targetKey ||
      `${payload.repo || "unknown"}#${payload.number || 0}`,
    eventType: "import_complete",
    decision: "import",
    summary: payload.summary || payload.importPrUrl || "Import completed.",
  });
  return json({ ok: true });
}

async function route(request: Request, env: Env, ctx: ExecutionContext) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return json({ ok: true });
  if (request.method === "GET" && url.pathname === "/health") {
    return json({ ok: true, service: "heyclaude-submission-gate" });
  }
  if (request.method === "POST" && url.pathname === "/drafts") {
    return createDraftRoute(request, env);
  }
  if (request.method === "GET" && url.pathname.startsWith("/drafts/")) {
    return getDraftRoute(env, url.pathname.split("/").pop() || "");
  }
  if (request.method === "GET" && url.pathname === "/auth/github/start") {
    const draftId = url.searchParams.get("draftId") || "";
    const state = randomToken();
    const draft = draftId
      ? await getDraft(env.SUBMISSION_GATE_DB, draftId)
      : null;
    if (!draft) return json({ ok: false, error: "not_found" }, { status: 404 });
    await updateDraftAuthState(env.SUBMISSION_GATE_DB, draftId, state);
    return json({
      ok: true,
      authUrl:
        env.GITHUB_APP_CLIENT_ID && draftId
          ? buildGitHubAppAuthorizeUrl({
              clientId: env.GITHUB_APP_CLIENT_ID,
              callbackUrl: callbackUrl(request),
              state: `${draftId}.${state}`,
            })
          : "",
    });
  }
  if (request.method === "GET" && url.pathname === "/auth/github/callback") {
    return githubCallbackRoute(request, env);
  }
  if (request.method === "POST" && url.pathname === "/webhooks/github") {
    return githubWebhookRoute(request, env, ctx);
  }
  if (
    request.method === "POST" &&
    url.pathname === "/internal/import-complete"
  ) {
    return importCompleteRoute(request, env);
  }
  return json({ ok: false, error: "not_found" }, { status: 404 });
}

export class SubmissionLock extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request) {
    if (new URL(request.url).pathname !== "/acquire") {
      return json({ ok: false, error: "not_found" }, { status: 404 });
    }
    const body = (await request.json().catch(() => ({}))) as {
      ttlSeconds?: number;
    };
    const expiresAt = Number((await this.ctx.storage.get("expiresAt")) || 0);
    const nowMs = Date.now();
    if (expiresAt > nowMs) {
      return json({ ok: false, locked: true }, { status: 423 });
    }
    const ttlMs = Math.max(10, Math.min(600, body.ttlSeconds || 120)) * 1000;
    await this.ctx.storage.put("expiresAt", nowMs + ttlMs);
    return json({ ok: true, locked: false, expiresAt: nowMs + ttlMs });
  }
}

export class SubmissionImportRunner extends Container {
  defaultPort = 8080;
  sleepAfter = "10m";
}

export default {
  async fetch(request, env, ctx) {
    return route(request, env, ctx);
  },
  async queue(batch, env) {
    for (const message of batch.messages) {
      const body = message.body as QueueMessage;
      try {
        if (body.kind === "import_pr") {
          await handleImportMessage(env, body);
        } else {
          await handleReviewMessage(env, body);
        }
        message.ack();
      } catch (error) {
        console.error("submission gate queue failure", error);
        message.retry();
      }
    }
  },
} satisfies ExportedHandler<Env, QueueMessage>;

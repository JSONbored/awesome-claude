import { DurableObject } from "cloudflare:workers";

import {
  CONTENT_CATEGORY_LABEL_PREFIX,
  DEFAULT_REVIEW_MARKER,
  LABELS,
  REVIEWABLE_PR_ACTIONS,
} from "./constants";
import {
  buildContributorMdx,
  buildDraftTarget,
  draftFieldsFromBody,
  slugify,
} from "./drafts";
import {
  buildContentDuplicateReview,
  extractContentDuplicateSignals,
  findContentDuplicateMatch,
  protectedFrontmatterChanges,
  type ContentDuplicateReview,
  type ContentDuplicateSignals,
} from "./duplicates";
import {
  addLabels,
  approvePullRequest,
  buildGitHubAppAuthorizeUrl,
  closeIssueOrPullRequest,
  createUserForkContentPr,
  exchangeGitHubUserCode,
  getCommitValidationState,
  githubRetryDelaySeconds,
  getInstallationToken,
  getPullRequest,
  getRepositoryInstallationId,
  getRepositoryFileContent,
  isGitHubRateLimitError,
  listOpenPullRequests,
  listPullRequestFiles,
  listPullRequestsForCommit,
  mergePullRequest,
  parseRepo,
  removeLabels,
  upsertMarkerComment,
} from "./github";
import {
  defaultManualDecision,
  markerComment,
  type GateDecision,
  type GateVerdict,
} from "./review";
import { postDiscordDecisionNotification } from "./notifications";
import {
  decryptText,
  encryptText,
  randomToken,
  signInternalPayload,
  verifyGitHubWebhookSignature,
} from "./security";
import {
  consumeDraftUserToken,
  createDraft,
  getDraftUserToken,
  getDraft,
  getPrState,
  insertAudit,
  listDuePrStates,
  listRecentPrStates,
  markPrNotificationSent,
  storeDraftUserToken,
  updateDraftAuthState,
  updateDraftStatus,
  upsertPrState,
  verifyDraftState,
} from "./storage";

type Env = {
  PUBLIC_SITE_URL: string;
  SUBMISSION_GATE_URL?: string;
  PUBLIC_REPO: string;
  ALLOWED_IMPORT_REPOS?: string;
  CONTENT_GATE_BASE_REF?: string;
  GITHUB_API_VERSION: string;
  REVIEW_MARKER: string;
  GITHUB_APP_CLIENT_ID?: string;
  GITHUB_APP_CLIENT_SECRET?: string;
  GITHUB_APP_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  GITHUB_WEBHOOK_SECRET?: string;
  INTERNAL_SHARED_SECRET?: string;
  PRIVATE_GATE_REVIEW_URL?: string;
  DISCORD_SUBMISSION_WEBHOOK_URL?: string;
  REQUIRED_VALIDATION_CHECKS?: string;
  REQUIRED_STATUS_CONTEXTS?: string;
  SUBMISSION_GATE_DB: D1Database;
  SUBMISSION_GATE_AUDIT: R2Bucket;
  SUBMISSION_REVIEW_QUEUE: Queue<Record<string, unknown>>;
  SUBMISSION_LOCK: DurableObjectNamespace<SubmissionLock>;
  ALLOWED_CORS_ORIGINS?: string;
  SUBMISSION_DRAFT_RATE_LIMIT?: RateLimitBinding;
};

type RateLimitBinding = {
  limit: (params: { key: string }) => Promise<{ success: boolean }>;
};

type QueueMessage = {
  kind: "review_pr" | "submit_draft";
  targetKey: string;
  payload: Record<string, unknown>;
};

class DraftBodyTooLargeError extends Error {
  constructor() {
    super("Draft request body is too large.");
    this.name = "DraftBodyTooLargeError";
  }
}

class RequestBodyTooLargeError extends Error {
  constructor(limitBytes: number) {
    super(`Request body exceeds ${limitBytes} bytes.`);
    this.name = "RequestBodyTooLargeError";
  }
}

class SubmissionLockBusyError extends Error {
  constructor(targetKey: string) {
    super(`Submission lock is busy for ${targetKey}.`);
    this.name = "SubmissionLockBusyError";
  }
}

class SubmissionMergePendingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubmissionMergePendingError";
  }
}

const GATE_VERDICTS = new Set<GateVerdict>([
  "merge",
  "request_changes",
  "close",
  "manual",
  "ignore",
]);
const TERMINAL_GATE_VERDICTS = new Set(["close", "manual", "ignore"]);
const TERMINAL_PR_STATUSES = new Set(["merged", "closed", "manual", "ignored"]);
const VALIDATION_REQUEUE_SECONDS = 90;
const QUEUED_STALE_SECONDS = 60;
const REVIEWING_STALE_SECONDS = 180;
const MERGE_RETRY_SECONDS = 30;
const RETRYABLE_ERROR_SECONDS = 60;
const GITHUB_RATE_LIMIT_FALLBACK_SECONDS = 15 * 60;
const PRIVATE_REVIEW_TIMEOUT_MS = 45_000;
const SWEEP_LIMIT = 25;
const OPEN_PR_DISCOVERY_LIMIT = 25;
const SUPPORTED_CONTENT_CATEGORIES = new Set([
  "agents",
  "collections",
  "commands",
  "guides",
  "hooks",
  "mcp",
  "rules",
  "skills",
  "statuslines",
  "tools",
]);
const CATEGORY_REVIEW_RUBRICS: Record<string, string[]> = {
  agents: [
    "Verify the agent has a concrete source or documentation trail, a practical Claude/AI workflow use case, and no hidden paid-service routing.",
    "Require clear safety and privacy notes for agent autonomy, tool calls, repository writes, credentials, or external services.",
  ],
  collections: [
    "Verify the collection has a coherent curation purpose and is not a thin bundle of unrelated promotional links.",
    "Require each referenced resource to be source-backed enough for the collection to be useful without overclaiming quality.",
  ],
  commands: [
    "Verify commands are executable, scoped, and useful for Claude/AI development workflows.",
    "Fail closed on unsafe shell behavior, destructive defaults, credential leakage, or missing prerequisites.",
  ],
  guides: [
    "Verify factual claims against the cited sources and require enough detail to be useful without being generic filler.",
    "Fail closed on stale, unsupported, affiliate, or paid-placement style guidance.",
  ],
  hooks: [
    "Verify hook trigger behavior, permissions, filesystem/network effects, and failure modes are disclosed.",
    "Fail closed on unsafe automation, hidden telemetry, or missing privacy notes.",
  ],
  mcp: [
    "Verify the MCP server exists, is source-backed, has clear install/use guidance, and matches the MCP category.",
    "Require explicit safety and privacy notes for credentials, local file access, browser control, network calls, and write actions.",
  ],
  rules: [
    "Verify rules are concrete, reusable, and grounded in a real development workflow rather than generic prompt advice.",
    "Fail closed on rules that encourage unsafe code execution, weak security posture, or unsupported claims.",
  ],
  skills: [
    "Verify the skill has a source-backed workflow, install/use guidance, and no community-submitted package verification claims.",
    "Require safety and privacy notes for generated files, shell commands, credentials, external APIs, and automation scope.",
  ],
  statuslines: [
    "Verify statusline commands are safe to run repeatedly and do not expose sensitive terminal, repository, or account data.",
    "Require clear prerequisites and privacy notes for GitHub/API calls, local paths, tokens, and shared-screen contexts.",
  ],
  tools: [
    "Verify the tool exists, has a canonical source, and is useful to Claude/AI workflow users without being a paid listing.",
    "Fail closed on hidden affiliate/referral links, commercial promo, unsafe install patterns, or weak provenance.",
  ],
};

const MAX_DRAFT_BODY_BYTES = 64 * 1024;
const GITHUB_WEBHOOK_BODY_LIMIT_BYTES = 1024 * 1024;

const PUBLIC_DRAFT_FIELD_REDACTIONS = new Set([
  "address",
  "address_1",
  "address_2",
  "address_line_1",
  "address_line_2",
  "city",
  "contact_email",
  "contact_phone",
  "email",
  "phone",
  "postal_code",
  "state",
  "street_address",
  "full_name",
  "name_full",
  "zip",
  "zip_code",
]);

const DEFAULT_REQUIRED_VALIDATION_CHECKS = [
  "validate-content",
  "Superagent Security Scan",
];
const VALIDATION_WEBHOOK_EVENTS = new Set([
  "check_run",
  "check_suite",
  "status",
]);
const REVIEWABLE_CHECK_ACTIONS = new Set([
  "completed",
  "rerequested",
  "requested",
]);
const TRUSTED_RECHECK_ASSOCIATIONS = new Set([
  "OWNER",
  "MEMBER",
  "COLLABORATOR",
]);
const DECISION_LABELS = [
  LABELS.underReview,
  LABELS.manual,
  LABELS.close,
  LABELS.merged,
];
const CONTENT_CATEGORY_LABELS = [
  "agents",
  "collections",
  "commands",
  "guides",
  "hooks",
  "mcp",
  "rules",
  "skills",
  "statuslines",
  "tools",
].map(categoryLabel);
const RECONCILED_GATE_LABELS = [...DECISION_LABELS, ...CONTENT_CATEGORY_LABELS];

type ReviewTarget = {
  repoFullName: string;
  number: number;
  baseRef: string;
  headRepo?: string;
  headRef?: string;
  headSha?: string;
  installationId?: number;
};

type PrQueueState = Record<string, unknown> & {
  repo?: string;
  number?: number;
  headRepo?: string;
  headRef?: string;
  headSha?: string;
  baseRef?: string;
  installationId?: number;
  status?: string;
  verdict?: string;
  lastReviewKey?: string;
  updatedAt?: string;
};

type DirectContentScope = {
  filePath: string;
  category: string;
  slug: string;
  status: string;
  rawUrl?: string;
};

type DirectContentReviewability =
  | { kind: "review"; scope: DirectContentScope }
  | { kind: "scope_failure"; decision: GateDecision; category?: string }
  | { kind: "ignore"; reason: string };

type DirectContentReviewContext = {
  headRepo?: string;
  baseRepo?: string;
};

function json(payload: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set(
    "access-control-allow-headers",
    "content-type,x-github-event,x-github-delivery,x-hub-signature-256,x-heyclaude-internal-signature",
  );
  return Response.json(payload, { ...init, headers });
}

function nowIso() {
  return new Date().toISOString();
}

function isoAfter(seconds: number) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

function isoBefore(seconds: number) {
  return new Date(Date.now() - seconds * 1000).toISOString();
}

function contentGateBaseRef(env: Env) {
  return env.CONTENT_GATE_BASE_REF || "main";
}

function truncateForQueue(value: unknown, maxLength = 500) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

function decisionStatus(verdict: GateVerdict) {
  if (verdict === "merge") return "merge_pending";
  if (verdict === "manual") return "manual";
  if (verdict === "ignore") return "ignored";
  return "closed";
}

function nextReviewForStatus(status: string) {
  if (status === "validation_pending") {
    return isoAfter(VALIDATION_REQUEUE_SECONDS);
  }
  if (status === "merge_pending") {
    return isoAfter(MERGE_RETRY_SECONDS);
  }
  if (status === "error_retryable") {
    return isoAfter(RETRYABLE_ERROR_SECONDS);
  }
  return null;
}

function retryDelayForError(error: unknown) {
  if (isGitHubRateLimitError(error)) {
    return githubRetryDelaySeconds(error, GITHUB_RATE_LIMIT_FALLBACK_SECONDS);
  }
  return RETRYABLE_ERROR_SECONDS;
}

function nextReviewForError(error: unknown) {
  return isoAfter(retryDelayForError(error));
}

function normalizeOneShotDecision(decision: GateDecision): GateDecision {
  if (decision.verdict === "close" && !decision.close) {
    return {
      ...decision,
      close: true,
      labels: decision.labels.length ? decision.labels : [LABELS.close],
    };
  }
  if (decision.verdict !== "request_changes") return decision;
  return {
    ...decision,
    verdict: "close",
    labels: [LABELS.close],
    close: true,
    summary: [
      decision.summary.trim(),
      "",
      "One-shot Review:",
      "- This submission needs changes, so the maintainer agent is closing it instead of keeping an iterative review open.",
      "- Please resubmit a new focused one-file content PR after fixing the issue.",
    ].join("\n"),
  };
}

function isRetryablePrivateReviewerDecision(decision: GateDecision) {
  if (decision.verdict !== "manual") return false;
  const summary = decision.summary.toLowerCase();
  return (
    summary.includes("could not determine the github app installation") ||
    summary.includes("ai maintainer review returned an unexpected payload") ||
    summary.includes("private corpus review request failed") ||
    summary.includes("private corpus review returned") ||
    summary.includes("private corpus review returned an unexpected payload")
  );
}

function retryingReviewComment(marker = DEFAULT_REVIEW_MARKER) {
  return [
    marker,
    "Review retrying",
    "",
    "The public validation lane is green, but the private reviewer returned a retryable infrastructure result. The submission gate will retry automatically.",
    "",
    "No contributor action is needed yet.",
  ].join("\n");
}

function allowedCorsOrigins(env: Env) {
  const configured = String(
    env.ALLOWED_CORS_ORIGINS || env.PUBLIC_SITE_URL || "",
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured.length ? configured : ["https://heyclau.de"];
}

function isAllowedRequestOrigin(request: Request, env: Env) {
  const requestOrigin = request.headers.get("origin") || "";
  return Boolean(
    requestOrigin && allowedCorsOrigins(env).includes(requestOrigin),
  );
}

function isJsonContentType(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const mediaType = contentType.split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json" || mediaType.endsWith("+json");
}

function clientRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    forwardedFor.split(",")[0]?.trim() ||
    "unknown";
  return `draft:${clientIp}`;
}

async function enforceDraftRateLimit(request: Request, env: Env) {
  const binding = env.SUBMISSION_DRAFT_RATE_LIMIT;
  if (!binding) return null;
  const result = await binding.limit({ key: clientRateLimitKey(request) });
  if (result.success === false) {
    return json(
      {
        ok: false,
        error: "rate_limited",
        message: "Too many draft submissions. Please try again later.",
      },
      { status: 429 },
    );
  }
  return null;
}

async function readJsonBodyWithLimit(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_DRAFT_BODY_BYTES) {
    throw new DraftBodyTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) return JSON.parse("");

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_DRAFT_BODY_BYTES) {
      await reader.cancel();
      throw new DraftBodyTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(body));
}

function withCors(response: Response, request: Request, env: Env) {
  const headers = new Headers(response.headers);
  const allowedOrigins = allowedCorsOrigins(env);
  const requestOrigin = request.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0];
  headers.set("access-control-allow-origin", allowOrigin);
  headers.set(
    "vary",
    headers.has("vary") ? `${headers.get("vary")}, Origin` : "Origin",
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function redactPublicDraftFields(fields: unknown) {
  if (!isRecord(fields)) return {};
  const scrubbed: Record<string, unknown> = { ...fields };
  for (const key of Object.keys(scrubbed)) {
    if (PUBLIC_DRAFT_FIELD_REDACTIONS.has(key.toLowerCase())) {
      scrubbed[key] = "[redacted]";
    }
  }
  return scrubbed;
}

function parseStoredDraftFields(
  draftId: string,
  fieldsJson: unknown,
  fallback: Record<string, unknown> = {},
) {
  try {
    const parsed = JSON.parse(String(fieldsJson || "{}"));
    return isRecord(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn("malformed draft fields json", { draftId, error });
    return fallback;
  }
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

function requestBodyTooLarge(limitBytes: number) {
  return json(
    {
      ok: false,
      error: "body_too_large",
      message: `Request body must be ${limitBytes} bytes or smaller.`,
    },
    { status: 413 },
  );
}

function enforceContentLengthLimit(request: Request, limitBytes: number) {
  const contentLength = request.headers.get("content-length");
  if (contentLength === null) return;
  const parsedLength = Number(contentLength);
  if (!Number.isFinite(parsedLength) || parsedLength < 0) {
    throw new RequestBodyTooLargeError(limitBytes);
  }
  if (parsedLength > limitBytes) {
    throw new RequestBodyTooLargeError(limitBytes);
  }
}

async function readRequestTextWithLimit(request: Request, limitBytes: number) {
  enforceContentLengthLimit(request, limitBytes);
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > limitBytes) {
        throw new RequestBodyTooLargeError(limitBytes);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } finally {
    reader.releaseLock();
  }
}

async function putAuditObject(env: Env, key: string, payload: unknown) {
  await env.SUBMISSION_GATE_AUDIT.put(key, JSON.stringify(payload, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
}

async function createDraftRoute(request: Request, env: Env) {
  if (!isAllowedRequestOrigin(request, env)) {
    return json(
      {
        ok: false,
        error: "origin_not_allowed",
        message:
          "Draft submissions must originate from an allowed HeyClaude site.",
      },
      { status: 403 },
    );
  }
  if (!isJsonContentType(request)) {
    return json(
      {
        ok: false,
        error: "unsupported_media_type",
        message: "Draft request body must use application/json.",
      },
      { status: 415 },
    );
  }
  const rateLimitResponse = await enforceDraftRateLimit(request, env);
  if (rateLimitResponse) return rateLimitResponse;

  let body: unknown;
  try {
    body = await readJsonBodyWithLimit(request);
  } catch (error) {
    if (error instanceof DraftBodyTooLargeError) {
      return json(
        {
          ok: false,
          error: "request_too_large",
          message: "Draft request body must be 64 KiB or smaller.",
        },
        { status: 413 },
      );
    }
    return json(
      {
        ok: false,
        error: "invalid_json",
        message: "Draft request body must be valid JSON.",
      },
      { status: 400 },
    );
  }
  if (!isRecord(body)) {
    return json(
      {
        ok: false,
        error: "invalid_draft",
        message: "Draft request body must be a JSON object.",
      },
      { status: 400 },
    );
  }
  if (
    Object.hasOwn(body, "fields") &&
    body.fields !== undefined &&
    !isRecord(body.fields)
  ) {
    return json(
      {
        ok: false,
        error: "invalid_draft",
        message: "Draft fields must be a JSON object when provided.",
      },
      { status: 400 },
    );
  }
  const fields = draftFieldsFromBody(body);
  const baseRef = contentGateBaseRef(env);
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
  await putAuditObject(env, `drafts/${id}.json`, {
    id,
    target,
    fields: redactPublicDraftFields(fields),
  });

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
  const fields = redactPublicDraftFields(
    parseStoredDraftFields(id, draft.fieldsJson),
  );
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
  const providerError = url.searchParams.get("error") || "";
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
  if (providerError || !code) {
    return textResponse("GitHub authorization was not completed.", {
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

function isContentGatePr(payload: Record<string, unknown>, env: Env) {
  const pull = payload.pull_request as
    | {
        number?: number;
        draft?: boolean;
        base?: { ref?: string; repo?: { full_name?: string } };
      }
    | undefined;
  if (!pull || pull.draft) return false;
  return pull.base?.ref === contentGateBaseRef(env);
}

function parseCsv(value: string | undefined, fallback: string[] = []) {
  const parsed = (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return parsed.length ? parsed : fallback;
}

function requiredValidationChecks(env: Env) {
  return parseCsv(
    env.REQUIRED_VALIDATION_CHECKS,
    DEFAULT_REQUIRED_VALIDATION_CHECKS,
  );
}

function requiredStatusContexts(env: Env) {
  return parseCsv(env.REQUIRED_STATUS_CONTEXTS);
}

function installationIdFromPayload(payload: Record<string, unknown>) {
  return Number((payload.installation as { id?: number } | undefined)?.id || 0);
}

function editedPayloadHasBaseRefChange(payload: Record<string, unknown>) {
  const changes = payload.changes;
  if (!isRecord(changes) || !isRecord(changes.base)) return false;
  const refChange = changes.base.ref;
  return isRecord(refChange) && typeof refChange.from === "string";
}

function isReviewablePullRequestPayload(payload: Record<string, unknown>) {
  const action = String(payload.action || "");
  if (!REVIEWABLE_PR_ACTIONS.has(action)) return false;
  if (action !== "edited") return true;
  return editedPayloadHasBaseRefChange(payload);
}

function isReopenedPullRequestEvent(
  eventName: string,
  webhook?: Record<string, unknown>,
) {
  return (
    eventName === "pull_request" && String(webhook?.action || "") === "reopened"
  );
}

function reviewScanKeyForTarget(target: ReviewTarget) {
  return target.headSha
    ? `${target.headSha}:${target.baseRef || "unknown-base"}`
    : "";
}

async function recordReviewedScanKey(params: {
  env: Env;
  target: ReviewTarget;
  deliveryId: string;
  status: string;
}) {
  const reviewScanKey = reviewScanKeyForTarget(params.target);
  if (!reviewScanKey) return;
  await upsertPrState(params.env.SUBMISSION_GATE_DB, {
    repo: params.target.repoFullName,
    number: params.target.number,
    headRepo: params.target.headRepo,
    headRef: params.target.headRef,
    headSha: params.target.headSha,
    baseRef: params.target.baseRef || contentGateBaseRef(params.env),
    installationId: params.target.installationId,
    status: params.status,
    deliveryId: params.deliveryId,
    lastReviewKey: reviewScanKey,
  });
}

async function shouldInspectPullRequestFilesForWebhook(
  env: Env,
  target: ReviewTarget,
) {
  const existing = await getPrState(env.SUBMISSION_GATE_DB, {
    repo: target.repoFullName,
    number: target.number,
  });
  const reviewScanKey = reviewScanKeyForTarget(target);
  const existingReviewKey = String(existing?.lastReviewKey || "");
  if (
    hasTerminalGateDecision(existing) &&
    String(existing?.status || "") !== "closed" &&
    !(
      String(existing?.status || "") === "ignored" &&
      reviewScanKey &&
      existingReviewKey !== reviewScanKey
    )
  ) {
    return false;
  }
  return !reviewScanKey || existingReviewKey !== reviewScanKey;
}

function reviewTargetFromPullPayload(
  payload: Record<string, unknown>,
): ReviewTarget | null {
  const pull = payload.pull_request as
    | {
        number?: number;
        base?: { ref?: string; repo?: { full_name?: string } };
        head?: {
          sha?: string;
          ref?: string;
          repo?: { full_name?: string };
        };
      }
    | undefined;
  if (!pull?.number || !pull.base?.repo?.full_name) return null;
  return {
    repoFullName: pull.base.repo.full_name,
    number: pull.number,
    baseRef: pull.base.ref || "",
    headRepo: pull.head?.repo?.full_name,
    headRef: pull.head?.ref,
    headSha: pull.head?.sha,
    installationId: installationIdFromPayload(payload),
  };
}

function reviewTargetFromPullRecord(
  pull: {
    number?: number;
    base?: { ref?: string; repo?: { full_name?: string } };
    head?: {
      sha?: string;
      ref?: string;
      repo?: { full_name?: string };
    };
  },
  installationId?: number,
): ReviewTarget | null {
  if (!pull?.number || !pull.base?.repo?.full_name) return null;
  return {
    repoFullName: pull.base.repo.full_name,
    number: pull.number,
    baseRef: pull.base.ref || "",
    headRepo: pull.head?.repo?.full_name,
    headRef: pull.head?.ref,
    headSha: pull.head?.sha,
    installationId,
  };
}

function reviewTargetFromMessage(message: QueueMessage): ReviewTarget | null {
  if (isRecord(message.payload.target)) {
    const target = message.payload.target as Record<string, unknown>;
    const repoFullName = String(target.repoFullName || "");
    const number = Number(target.number || 0);
    if (!repoFullName || !number) return null;
    return {
      repoFullName,
      number,
      baseRef: String(target.baseRef || ""),
      headRepo:
        typeof target.headRepo === "string" ? target.headRepo : undefined,
      headRef: typeof target.headRef === "string" ? target.headRef : undefined,
      headSha: typeof target.headSha === "string" ? target.headSha : undefined,
      installationId: Number(target.installationId || 0) || undefined,
    };
  }
  const webhook = message.payload.webhook as
    | Record<string, unknown>
    | undefined;
  return webhook ? reviewTargetFromPullPayload(webhook) : null;
}

async function installationTokenForInstallationId(
  env: Env,
  installationId: number,
) {
  if (!installationId || !env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY)
    return "";
  return getInstallationToken({
    appId: env.GITHUB_APP_ID,
    privateKeyPem: env.GITHUB_APP_PRIVATE_KEY,
    installationId,
    apiVersion: env.GITHUB_API_VERSION,
  });
}

async function installationTokenForTarget(env: Env, target: ReviewTarget) {
  if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY) return "";
  let installationId = Number(target.installationId || 0);
  if (!installationId) {
    const repo = parseRepo(target.repoFullName);
    installationId = await getRepositoryInstallationId({
      appId: env.GITHUB_APP_ID,
      privateKeyPem: env.GITHUB_APP_PRIVATE_KEY,
      repo,
      apiVersion: env.GITHUB_API_VERSION,
    });
    if (installationId) target.installationId = installationId;
  }
  return installationTokenForInstallationId(env, installationId);
}

async function applyUnderReviewToTarget(
  env: Env,
  target: ReviewTarget,
  scope?: DirectContentScope,
) {
  const token = await installationTokenForTarget(env, target);
  if (!token) return;
  const repo = parseRepo(target.repoFullName);
  await addLabels({
    token,
    repo,
    issueNumber: target.number,
    labels: [LABELS.underReview, ...gateLabelsForCategory(scope?.category)],
    apiVersion: env.GITHUB_API_VERSION,
  });
  await upsertMarkerComment({
    token,
    repo,
    issueNumber: target.number,
    marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
    body: markerComment(undefined, env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER),
    apiVersion: env.GITHUB_API_VERSION,
  });
}

async function directContentReviewabilityForTarget(
  env: Env,
  target: ReviewTarget,
) {
  const token = await installationTokenForTarget(env, target);
  if (!token) {
    return {
      kind: "ignore" as const,
      reason: "No installation token available for PR file inspection.",
    };
  }
  const repo = parseRepo(target.repoFullName);
  return directContentReviewabilityForPr({
    token,
    repo,
    number: target.number,
    apiVersion: env.GITHUB_API_VERSION,
    context: {
      headRepo: target.headRepo,
      baseRepo: target.repoFullName,
    },
  });
}

function isRecheckCommand(body: unknown) {
  return (
    String(body || "")
      .trim()
      .split(/\s+/)[0] === "/recheck"
  );
}

async function targetFromIssueCommentRecheck(
  env: Env,
  payload: Record<string, unknown>,
) {
  if (String(payload.action || "") !== "created") return null;
  const comment = payload.comment as
    | { body?: string; author_association?: string }
    | undefined;
  const issue = payload.issue as
    | {
        number?: number;
        pull_request?: Record<string, unknown>;
      }
    | undefined;
  const repository = payload.repository as { full_name?: string } | undefined;
  const installationId = installationIdFromPayload(payload);
  if (!isRecheckCommand(comment?.body)) return null;
  if (
    !TRUSTED_RECHECK_ASSOCIATIONS.has(String(comment?.author_association || ""))
  ) {
    return null;
  }
  if (!issue?.number || !issue.pull_request || !repository?.full_name) {
    return null;
  }
  const token = await installationTokenForInstallationId(env, installationId);
  if (!token) return null;
  const repo = parseRepo(repository.full_name);
  const pull = await getPullRequest({
    token,
    repo,
    number: issue.number,
    apiVersion: env.GITHUB_API_VERSION,
  });
  if (pull.draft) return null;
  const target = reviewTargetFromPullRecord(pull, installationId);
  if (!target) return null;
  if (target.baseRef !== contentGateBaseRef(env)) {
    return null;
  }
  return target;
}

function targetKeyForReview(target: ReviewTarget) {
  return `${target.repoFullName}#${target.number}`;
}

function hasTerminalGateDecision(
  state:
    | {
        status?: unknown;
        verdict?: unknown;
      }
    | null
    | undefined,
) {
  if (!state) return false;
  if (TERMINAL_PR_STATUSES.has(String(state.status || ""))) return true;
  return TERMINAL_GATE_VERDICTS.has(String(state.verdict || ""));
}

function isOpenPullRequest(pull: { state?: string }) {
  return String(pull.state || "").toLowerCase() === "open";
}

function terminalStatusFromPullRequest(pull: {
  state?: string;
  merged_at?: string | null;
}) {
  if (isOpenPullRequest(pull)) return null;
  return pull.merged_at ? "merged" : "closed";
}

async function reconcileTerminalPullRequest(params: {
  env: Env;
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  message: QueueMessage;
  pull: {
    state?: string;
    merged_at?: string | null;
    head?: { sha?: string; ref?: string; repo?: { full_name?: string } };
    base?: { ref?: string };
  };
}) {
  const status = terminalStatusFromPullRequest(params.pull);
  if (!status) return false;
  await removeLabels({
    token: params.token,
    repo: params.repo,
    issueNumber: params.target.number,
    labels: [LABELS.underReview],
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  await upsertPrState(params.env.SUBMISSION_GATE_DB, {
    repo: params.target.repoFullName,
    number: params.target.number,
    headRepo: params.pull.head?.repo?.full_name || params.target.headRepo,
    headRef: params.pull.head?.ref || params.target.headRef,
    headSha: params.pull.head?.sha || params.target.headSha,
    baseRef:
      params.pull.base?.ref ||
      params.target.baseRef ||
      contentGateBaseRef(params.env),
    installationId: params.target.installationId,
    status,
    verdict: status === "merged" ? "merge" : undefined,
    deliveryId: String(params.message.payload.deliveryId || ""),
    nextReviewAt: null,
    lastError: "GitHub terminal state verified.",
    terminalAt: nowIso(),
  });
  await insertAudit(params.env.SUBMISSION_GATE_DB, {
    id: crypto.randomUUID(),
    targetKey: params.message.targetKey,
    eventType: params.message.kind,
    decision: "github_terminal_reconciled",
    summary:
      status === "merged"
        ? "GitHub PR was already merged; removed transient review label and skipped review continuation."
        : "GitHub PR was already closed; removed transient review label and skipped review continuation.",
  });
  return true;
}

async function ignoreOutOfScopeReviewTarget(params: {
  env: Env;
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  message: QueueMessage;
  summary: string;
}) {
  await removeLabels({
    token: params.token,
    repo: params.repo,
    issueNumber: params.target.number,
    labels: RECONCILED_GATE_LABELS,
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  await upsertPrState(params.env.SUBMISSION_GATE_DB, {
    repo: params.target.repoFullName,
    number: params.target.number,
    headRepo: params.target.headRepo,
    headRef: params.target.headRef,
    headSha: params.target.headSha,
    baseRef: params.target.baseRef || contentGateBaseRef(params.env),
    installationId: params.target.installationId,
    status: "ignored",
    deliveryId: String(params.message.payload.deliveryId || ""),
    lastError: params.summary,
  });
  await insertAudit(params.env.SUBMISSION_GATE_DB, {
    id: crypto.randomUUID(),
    targetKey: params.message.targetKey,
    eventType: params.message.kind,
    decision: "ignored",
    summary: params.summary,
  });
}

function isRetryableMergeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  return /required status check|required approving review|not mergeable|merge conflict|base branch was modified|head branch was modified|sha does not match|review_required|status check/i.test(
    message,
  );
}

function importContentPathParts(filePath: string) {
  const match = /^content\/([^/]+)\/([^/]+)\.mdx$/i.exec(filePath);
  if (!match) return null;
  return {
    category: match[1].toLowerCase(),
    slug: slugify(match[2]),
  };
}

function categoryLabel(category: string) {
  return `${CONTENT_CATEGORY_LABEL_PREFIX}${category}`;
}

function gateLabelsForCategory(category?: string) {
  return category ? [categoryLabel(category)] : [];
}

function classifyPullRequestFilesForContentReview(
  files: Array<{ filename?: string; status?: string }>,
  context: DirectContentReviewContext = {},
): DirectContentReviewability {
  const entryFiles = files
    .map((file) => ({
      file,
      filePath: String(file.filename || ""),
      pathParts: importContentPathParts(String(file.filename || "")),
    }))
    .filter((item) => Boolean(item.pathParts));

  if (entryFiles.length === 0) {
    return {
      kind: "ignore",
      reason: "No source content entry file changed.",
    };
  }

  if (files.length !== 1 || entryFiles.length !== 1) {
    if (
      context.headRepo &&
      context.baseRepo &&
      context.headRepo.toLowerCase() === context.baseRepo.toLowerCase()
    ) {
      return {
        kind: "ignore",
        reason:
          "Mixed same-repository maintenance PR; content gate only reviews exact one-file content submissions.",
      };
    }

    return {
      kind: "scope_failure",
      category: entryFiles[0]?.pathParts?.category,
      decision: scopeFailureDecision(
        "Direct content submissions must change exactly one source content file and no generated artifacts, README, workflows, scripts, packages, or additional entries.",
      ),
    };
  }

  const entry = entryFiles[0];
  if (!SUPPORTED_CONTENT_CATEGORIES.has(entry.pathParts!.category)) {
    return {
      kind: "scope_failure",
      category: entry.pathParts?.category,
      decision: scopeFailureDecision(
        `Unsupported content category \`${entry.pathParts!.category}\`. Supported categories are ${[
          ...SUPPORTED_CONTENT_CATEGORIES,
        ]
          .sort()
          .join(", ")}.`,
      ),
    };
  }

  const status = String(entry.file.status || "");
  if (!["added", "modified"].includes(status)) {
    return {
      kind: "scope_failure",
      category: entry.pathParts?.category,
      decision: scopeFailureDecision(
        "Direct content submissions can only add a new content file or edit one existing content file. Deletes, renames, and generated-artifact updates are not accepted in this path.",
      ),
    };
  }

  return {
    kind: "review",
    scope: {
      filePath: entry.filePath,
      category: entry.pathParts!.category,
      slug: entry.pathParts!.slug,
      status,
      rawUrl: String(entry.file.raw_url || ""),
    },
  };
}

async function directContentReviewabilityForPr(params: {
  token: string;
  repo: ReturnType<typeof parseRepo>;
  number: number;
  apiVersion?: string;
  context?: DirectContentReviewContext;
}): Promise<DirectContentReviewability> {
  const files = await listPullRequestFiles({
    token: params.token,
    repo: params.repo,
    number: params.number,
    apiVersion: params.apiVersion,
  });
  return classifyPullRequestFilesForContentReview(files, params.context);
}

async function directContentScopeForPr(params: {
  token: string;
  repo: ReturnType<typeof parseRepo>;
  number: number;
  apiVersion?: string;
}): Promise<DirectContentScope> {
  const classification = await directContentReviewabilityForPr(params);
  if (classification.kind === "review") return classification.scope;
  if (classification.kind === "scope_failure") {
    throw new Error(classification.decision.summary);
  }
  throw new Error(classification.reason);
}

async function assertDirectContentAutoMergeEligibility(params: {
  env: Env;
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  expectedScope?: DirectContentScope | null;
  expectedHeadSha?: string;
}) {
  const pull = await getPullRequest({
    token: params.token,
    repo: params.repo,
    number: params.target.number,
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  if (pull.draft) {
    throw new Error(
      "Draft pull requests are not eligible for content auto-merge.",
    );
  }

  const baseRef = pull.base?.ref || "";
  const gateBaseRef = contentGateBaseRef(params.env);
  if (baseRef !== gateBaseRef) {
    throw new Error(
      `Direct content auto-merge is only allowed for PRs targeting \`${gateBaseRef}\`.`,
    );
  }

  const currentHeadSha = pull.head?.sha || "";
  if (
    params.expectedHeadSha &&
    currentHeadSha &&
    currentHeadSha !== params.expectedHeadSha
  ) {
    throw new Error("head branch was modified during content gate review");
  }

  params.target.baseRef = baseRef;
  params.target.headSha = currentHeadSha || params.target.headSha;
  params.target.headRef = pull.head?.ref || params.target.headRef;
  params.target.headRepo = pull.head?.repo?.full_name || params.target.headRepo;

  const classification = await directContentReviewabilityForPr({
    token: params.token,
    repo: params.repo,
    number: params.target.number,
    apiVersion: params.env.GITHUB_API_VERSION,
    context: {
      headRepo: params.target.headRepo,
      baseRepo: params.target.repoFullName,
    },
  });
  if (classification.kind === "scope_failure") {
    throw new Error(classification.decision.summary);
  }
  if (classification.kind === "ignore") {
    throw new Error(classification.reason);
  }

  const scope = classification.scope;
  const expected = params.expectedScope;
  if (
    expected &&
    (scope.filePath !== expected.filePath ||
      scope.category !== expected.category ||
      scope.slug !== expected.slug ||
      scope.status !== expected.status)
  ) {
    throw new Error("Direct content scope changed during review.");
  }
  return scope;
}

function scopeFailureDecision(error: unknown): GateDecision {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string" && error.trim()
        ? error.trim()
        : "Direct content scope validation failed.";
  return {
    verdict: "close" as const,
    summary: [
      "Summary:",
      `- ${message}`,
      "",
      "Required Shape:",
      "- Submit exactly one raw `content/<category>/<slug>.mdx` file.",
      "- Do not edit generated artifacts, README, registry data, workflows, scripts, packages, or multiple entries.",
      "",
      "Recommended Action:",
      "- Close this PR and resubmit a focused single-entry content PR.",
      "- If this branch was polluted by updating from another branch, a clean rescue PR can preserve the original contributor attribution.",
    ].join("\n"),
    labels: [LABELS.close],
    close: true,
  };
}

function validationGateDecision(validation: {
  summary: string;
  checks: Array<{ name: string; status: string; details?: string }>;
}): GateDecision {
  const superagentFailures = validation.checks.filter(
    (check) =>
      check.status === "failed" &&
      /superagent/i.test(`${check.name} ${check.details || ""}`),
  );
  if (superagentFailures.length) {
    const inconclusive = superagentFailures.some((check) =>
      /action_required|neutral|skipped|cancelled/i.test(check.details || ""),
    );
    if (inconclusive) {
      return defaultManualDecision(
        `${validation.summary} Superagent did not return a clear pass/fail result.`,
      );
    }
    return {
      verdict: "close" as const,
      summary: [
        "Summary:",
        `- ${validation.summary}`,
        "",
        "Security Review:",
        "- Superagent did not pass, so this content PR is not eligible for automated merge.",
        "",
        "Recommended Action:",
        "- Close this PR and resubmit only after the flagged issue is resolved.",
      ].join("\n"),
      labels: [LABELS.close],
      close: true,
    };
  }
  return {
    verdict: "close" as const,
    summary: [
      "Summary:",
      `- ${validation.summary}`,
      "",
      "Validation Review:",
      "- Required public validation did not pass, so this direct content PR is not eligible for automated merge.",
      "- HeyClaude uses one-shot review for content submissions; hard validation failures are closed instead of iterated in place.",
      "",
      "Recommended Action:",
      "- Close this PR and resubmit a clean single-entry content PR after fixing the validation failure.",
    ].join("\n"),
    labels: [LABELS.close],
    close: true,
  };
}

function validationSummaryForNotification(
  validation:
    | {
        summary?: string;
        checks?: Array<{ name: string; status: string; details?: string }>;
      }
    | null
    | undefined,
) {
  if (!validation) return "";
  const checks = validation.checks || [];
  if (!checks.length) return validation.summary || "";
  return checks
    .map((check) =>
      [check.name, check.status, check.details ? `(${check.details})` : ""]
        .filter(Boolean)
        .join(" "),
    )
    .join("; ");
}

function notificationKeyForDecision(params: {
  target: ReviewTarget;
  decision: GateDecision;
  status: string;
}) {
  return [
    params.target.headSha || params.target.headRef || "unknown-head",
    params.status,
    params.decision.verdict,
  ].join(":");
}

async function insertNotificationAuditSafe(
  env: Env,
  params: {
    targetKey: string;
    decision: string;
    summary: string;
  },
) {
  try {
    await insertAudit(env.SUBMISSION_GATE_DB, {
      id: crypto.randomUUID(),
      targetKey: params.targetKey,
      eventType: "discord_notification",
      decision: params.decision,
      summary: params.summary,
    });
  } catch (error) {
    console.warn("submission gate discord notification audit failed", {
      targetKey: params.targetKey,
      error,
    });
  }
}

async function notifyGateDecision(
  env: Env,
  params: {
    target: ReviewTarget;
    targetKey: string;
    decision: GateDecision;
    status: string;
    scope?: DirectContentScope | null;
    validation?: {
      summary?: string;
      checks?: Array<{ name: string; status: string; details?: string }>;
    } | null;
    pull?: {
      title?: string;
      html_url?: string;
      user?: { login?: string };
    } | null;
  },
) {
  if (params.decision.verdict === "ignore") return;
  const notificationKey = notificationKeyForDecision({
    target: params.target,
    decision: params.decision,
    status: params.status,
  });
  try {
    const state = await getPrState(env.SUBMISSION_GATE_DB, {
      repo: params.target.repoFullName,
      number: params.target.number,
    });
    const lastNotificationKey = String(state?.lastNotificationKey || "");
    if (lastNotificationKey === notificationKey) return;
    const headSha = params.target.headSha || "unknown";
    if (
      headSha !== "unknown" &&
      lastNotificationKey.startsWith(`${headSha}:`)
    ) {
      await insertNotificationAuditSafe(env, {
        targetKey: params.targetKey,
        decision: "discord_notification_skipped",
        summary:
          "Skipped Discord notification because this PR head already has a terminal gate notification.",
      });
      return;
    }

    const result = await postDiscordDecisionNotification({
      webhookUrl: env.DISCORD_SUBMISSION_WEBHOOK_URL,
      repoFullName: params.target.repoFullName,
      prNumber: params.target.number,
      prTitle: params.pull?.title,
      prUrl:
        params.pull?.html_url ||
        `https://github.com/${params.target.repoFullName}/pull/${params.target.number}`,
      author: params.pull?.user?.login,
      verdict: params.decision.verdict,
      category: params.scope?.category,
      changedFile: params.scope?.filePath,
      ciSummary: validationSummaryForNotification(params.validation),
      summary: params.decision.summary,
    });

    if (result.ok) {
      await markPrNotificationSent(env.SUBMISSION_GATE_DB, {
        repo: params.target.repoFullName,
        number: params.target.number,
        notificationKey,
      });
      await insertNotificationAuditSafe(env, {
        targetKey: params.targetKey,
        decision: "discord_notified",
        summary: `${params.decision.verdict} notification sent.`,
      });
      return;
    }

    if (!result.skipped) {
      console.warn("submission gate discord notification failed", {
        targetKey: params.targetKey,
        reason: result.reason,
        status: result.status,
      });
      await insertNotificationAuditSafe(env, {
        targetKey: params.targetKey,
        decision: "discord_notification_failed",
        summary: `${result.reason}${result.status ? ` (${result.status})` : ""}`,
      });
    }
  } catch (error) {
    console.warn("submission gate discord notification error", {
      targetKey: params.targetKey,
      error,
    });
  }
}

async function applyTerminalGateDecision(params: {
  env: Env;
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  targetKey: string;
  decision: GateDecision;
  status: string;
  labelsToApply: string[];
  scope?: DirectContentScope | null;
  validation?: {
    summary?: string;
    checks?: Array<{ name: string; status: string; details?: string }>;
  } | null;
  pull?: {
    title?: string;
    html_url?: string;
    user?: { login?: string };
  } | null;
  deliveryId?: string;
}) {
  await upsertPrState(params.env.SUBMISSION_GATE_DB, {
    repo: params.target.repoFullName,
    number: params.target.number,
    headRepo: params.target.headRepo,
    headRef: params.target.headRef,
    headSha: params.target.headSha,
    baseRef: params.target.baseRef || contentGateBaseRef(params.env),
    installationId: params.target.installationId,
    status: "reviewing",
    deliveryId: params.deliveryId,
    nextReviewAt: null,
    clearVerdict: true,
    clearTerminal: true,
  });
  await removeLabels({
    token: params.token,
    repo: params.repo,
    issueNumber: params.target.number,
    labels: RECONCILED_GATE_LABELS.filter(
      (label) => !params.labelsToApply.includes(label),
    ),
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  if (params.labelsToApply.length) {
    await addLabels({
      token: params.token,
      repo: params.repo,
      issueNumber: params.target.number,
      labels: params.labelsToApply,
      apiVersion: params.env.GITHUB_API_VERSION,
    });
  }
  await upsertMarkerComment({
    token: params.token,
    repo: params.repo,
    issueNumber: params.target.number,
    marker: params.env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
    body: markerComment(
      params.decision,
      params.env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
    ),
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  if (
    (params.decision.verdict === "close" ||
      params.decision.verdict === "request_changes") &&
    params.decision.close
  ) {
    await closeIssueOrPullRequest({
      token: params.token,
      repo: params.repo,
      issueNumber: params.target.number,
      apiVersion: params.env.GITHUB_API_VERSION,
    });
  }
  await notifyGateDecision(params.env, {
    target: params.target,
    targetKey: params.targetKey,
    decision: params.decision,
    status: params.status,
    scope: params.scope,
    validation: params.validation,
    pull: params.pull,
  });
  await upsertPrState(params.env.SUBMISSION_GATE_DB, {
    repo: params.target.repoFullName,
    number: params.target.number,
    headRepo: params.target.headRepo,
    headRef: params.target.headRef,
    headSha: params.target.headSha,
    baseRef: params.target.baseRef || contentGateBaseRef(params.env),
    installationId: params.target.installationId,
    status: params.status,
    verdict: params.decision.verdict,
    verdictSummary: params.decision.summary,
    nextReviewAt: null,
    terminalAt: TERMINAL_PR_STATUSES.has(params.status) ? nowIso() : null,
  });
}

async function mergeAcceptedPullRequest(params: {
  env: Env;
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  decision: GateDecision;
  scope: DirectContentScope;
}) {
  const expectedHeadSha = params.target.headSha || "";
  if (!expectedHeadSha) {
    throw new Error("Direct merge requires the current PR head SHA.");
  }
  const scope = await assertDirectContentAutoMergeEligibility({
    env: params.env,
    token: params.token,
    repo: params.repo,
    target: params.target,
    expectedScope: params.scope,
    expectedHeadSha,
  });
  const reviewBody = [
    "Automated review by HeyClaude Maintainer Agent.",
    "",
    "This content-only PR passed content validation, Superagent, duplicate/history review, source/provenance review, category-fit review, and safety/privacy review.",
    "",
    "The agent is approving and merging this PR directly. Generated artifacts are produced during build/deploy and are not committed by contributors.",
  ].join("\n");
  await approvePullRequest({
    token: params.token,
    repo: params.repo,
    number: params.target.number,
    body: reviewBody,
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  const result = await mergePullRequest({
    token: params.token,
    repo: params.repo,
    number: params.target.number,
    expectedHeadSha,
    commitTitle: `feat(content): ${
      scope.status === "modified" ? "update" : "add"
    } ${scope.category} ${scope.slug}`,
    commitMessage: [
      `Accepted by HeyClaude Maintainer Agent from PR #${params.target.number}.`,
      "",
      params.decision.summary.trim(),
    ].join("\n"),
    apiVersion: params.env.GITHUB_API_VERSION,
  });
  if (result.merged === false) {
    throw new Error(result.message || "GitHub did not merge the pull request.");
  }
  return result;
}

async function fetchRawPullRequestFileContent(rawUrl: unknown) {
  const url = new URL(String(rawUrl || ""));
  if (
    url.protocol !== "https:" ||
    !["github.com", "raw.githubusercontent.com"].includes(url.hostname)
  ) {
    throw new Error("Direct content raw file URL is not a GitHub HTTPS URL.");
  }
  const response = await fetch(url.toString(), {
    headers: { "user-agent": "heyclaude-submission-gate" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`GitHub raw file fetch returned ${response.status}.`);
  }
  const content = await response.text();
  if (content.length > 100_000) {
    throw new Error("Direct content raw file is too large.");
  }
  return content;
}

async function fetchDirectContentScopeContent(scope: DirectContentScope) {
  if (!scope.rawUrl) {
    throw new Error("Direct content PR file did not include a raw GitHub URL.");
  }
  return fetchRawPullRequestFileContent(scope.rawUrl);
}

function duplicateCloseDecision(
  match: ReturnType<typeof findContentDuplicateMatch>,
  candidate: ContentDuplicateSignals,
): GateDecision | null {
  if (!match) return null;
  const existing = match.existing;
  const existingTarget = existing.url
    ? `${existing.label || existing.filePath}: ${existing.url}`
    : existing.label || existing.filePath;
  return {
    verdict: "close" as const,
    summary: [
      "Summary:",
      `- This submission overlaps an existing or earlier pending content item: ${existingTarget}.`,
      "- HeyClaude closes strict duplicates in one shot so the directory does not accumulate redundant listings.",
      "",
      "Duplicate / History Review:",
      ...match.reasons.map((reason) => `- ${reason}.`),
      "",
      "Recommended Action:",
      "- Close this PR. If this is genuinely a distinct resource, resubmit with a clearly different canonical source, title, scope, and value proposition.",
      "",
      `Changed file: \`${candidate.filePath}\``,
    ].join("\n"),
    labels: [LABELS.close],
    close: true,
  };
}

function summarizeDuplicateReview(review: ContentDuplicateReview) {
  return {
    legacyDuplicate: review.legacyDuplicate
      ? {
          target:
            review.legacyDuplicate.existing.label ||
            review.legacyDuplicate.existing.filePath,
          url: review.legacyDuplicate.existing.url,
          reasons: review.legacyDuplicate.reasons,
        }
      : null,
    strictDuplicate: review.strictDuplicate
      ? {
          target:
            review.strictDuplicate.existing.label ||
            review.strictDuplicate.existing.filePath,
          url: review.strictDuplicate.existing.url,
          reasons: review.strictDuplicate.reasons,
        }
      : null,
    relatedCandidates: review.relatedCandidates.map((match) => ({
      target: match.existing.label || match.existing.filePath,
      url: match.existing.url,
      reasons: match.reasons,
    })),
  };
}

function protectedEditCloseDecision(changedFields: string[]): GateDecision {
  return {
    verdict: "close" as const,
    summary: [
      "Summary:",
      "- This PR edits protected content identity, provenance, review, disclosure, source, or verification metadata.",
      "- HeyClaude allows one-file content edits through this gate only when they avoid protected fields and keep the entry identity intact.",
      "",
      "Protected fields changed:",
      ...changedFields.map((field) => `- \`${field}\``),
      "",
      "Recommended Action:",
      "- Close this PR. Resubmit as a focused content edit that only changes safe descriptive copy, safety notes, privacy notes, usage text, tags, or factual body content.",
      "- For source, attribution, disclosure, or verification changes, open a maintainer-reviewed issue or PR with explicit rationale.",
    ].join("\n"),
    labels: [LABELS.close],
    close: true,
  };
}

function publicSiteUrl(env: Env) {
  let url = env.PUBLIC_SITE_URL || "https://heyclau.de";
  while (url.endsWith("/")) url = url.slice(0, -1);
  return url;
}

function yamlScalar(value: unknown) {
  return JSON.stringify(String(value || ""));
}

function contentSignalSourceFromDirectoryEntry(entry: Record<string, unknown>) {
  const lines = [
    "---",
    `title: ${yamlScalar(entry.title)}`,
    `description: ${yamlScalar(entry.description)}`,
    `category: ${yamlScalar(entry.category)}`,
    `slug: ${yamlScalar(entry.slug)}`,
  ];
  for (const [field, value] of [
    ["documentationUrl", entry.documentationUrl],
    ["downloadUrl", entry.downloadUrl],
    ["repoUrl", entry.repoUrl],
    ["websiteUrl", entry.websiteUrl],
  ] as const) {
    if (value) lines.push(`${field}: ${yamlScalar(value)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

async function acceptedContentSignals(params: {
  env: Env;
  currentFilePath: string;
}) {
  const siteUrl = publicSiteUrl(params.env);
  const response = await fetch(`${siteUrl}/data/directory-index.json`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(
      `Public directory index fetch failed during duplicate scan: ${response.status}.`,
    );
  }
  const payload = (await response.json().catch(() => null)) as {
    entries?: Array<Record<string, unknown>>;
  } | null;
  const entries = Array.isArray(payload?.entries) ? payload.entries : [];
  return entries
    .map((entry) => {
      const category = String(entry.category || "").trim();
      const slug = String(entry.slug || "").trim();
      if (!category || !slug) return null;
      const filePath = `content/${category}/${slug}.mdx`;
      return { entry, filePath };
    })
    .filter(
      (item): item is { entry: Record<string, unknown>; filePath: string } =>
        Boolean(item),
    )
    .filter(({ filePath }) => filePath !== params.currentFilePath)
    .map(({ entry, filePath }) =>
      extractContentDuplicateSignals({
        filePath,
        content: contentSignalSourceFromDirectoryEntry(entry),
        label: `accepted entry ${filePath}`,
        url:
          String(entry.canonicalUrl || "") ||
          `${siteUrl}/entry/${String(entry.category)}/${String(entry.slug)}`,
      }),
    );
}

function isEarlierPullRequest(
  pull: { number?: number; created_at?: string },
  target: ReviewTarget,
) {
  const pullNumber = Number(pull.number || 0);
  if (!pullNumber || pullNumber === target.number) return false;
  return pullNumber < target.number;
}

async function earlierOpenContentPrSignals(params: {
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  baseRef: string;
  apiVersion?: string;
}) {
  const pulls = await listOpenPullRequests({
    token: params.token,
    repo: params.repo,
    baseRef: params.baseRef,
    apiVersion: params.apiVersion,
  });
  const signals: ContentDuplicateSignals[] = [];
  for (const pull of pulls) {
    if (!isEarlierPullRequest(pull, params.target) || pull.draft) continue;
    const number = Number(pull.number || 0);
    const files = await listPullRequestFiles({
      token: params.token,
      repo: params.repo,
      number,
      apiVersion: params.apiVersion,
    });
    const reviewability = classifyPullRequestFilesForContentReview(files);
    if (reviewability.kind !== "review") continue;
    let content = "";
    try {
      content = await fetchDirectContentScopeContent(reviewability.scope);
    } catch {
      continue;
    }
    signals.push(
      extractContentDuplicateSignals({
        filePath: reviewability.scope.filePath,
        content,
        label: `earlier open PR #${number}`,
        url:
          pull.html_url ||
          `https://github.com/${params.repo.owner}/${params.repo.repo}/pull/${number}`,
      }),
    );
  }
  return signals;
}

async function deterministicContentPrecheck(params: {
  env: Env;
  token: string;
  repo: ReturnType<typeof parseRepo>;
  target: ReviewTarget;
  scope: DirectContentScope;
}) {
  const baseRef = params.target.baseRef || contentGateBaseRef(params.env);
  const candidateContent = await fetchDirectContentScopeContent(params.scope);

  if (params.scope.status === "modified") {
    const baseContent = await getRepositoryFileContent({
      token: params.token,
      repo: params.repo,
      path: params.scope.filePath,
      ref: baseRef,
      apiVersion: params.env.GITHUB_API_VERSION,
    });
    const protectedChanges = protectedFrontmatterChanges(
      baseContent,
      candidateContent,
    );
    if (protectedChanges.length) {
      return {
        content: candidateContent,
        decision: protectedEditCloseDecision(protectedChanges),
      };
    }
  }

  const candidate = extractContentDuplicateSignals({
    filePath: params.scope.filePath,
    content: candidateContent,
    label: `PR #${params.target.number}`,
    url: `https://github.com/${params.target.repoFullName}/pull/${params.target.number}`,
  });
  const existing = [
    ...(await acceptedContentSignals({
      env: params.env,
      currentFilePath: params.scope.filePath,
    })),
    ...(await earlierOpenContentPrSignals({
      token: params.token,
      repo: params.repo,
      target: params.target,
      baseRef,
      apiVersion: params.env.GITHUB_API_VERSION,
    })),
  ];
  const duplicateReview = buildContentDuplicateReview(candidate, existing);
  return {
    content: candidateContent,
    decision: duplicateCloseDecision(
      duplicateReview.strictDuplicate,
      candidate,
    ),
    duplicateReview: summarizeDuplicateReview(duplicateReview),
  };
}

async function enqueueReviewTarget(
  env: Env,
  target: ReviewTarget,
  deliveryId: string,
  eventName: string,
  webhook?: Record<string, unknown>,
  forceRecheck = false,
) {
  if (target.baseRef !== contentGateBaseRef(env)) return false;
  const targetKey = targetKeyForReview(target);
  const reviewScanKey = reviewScanKeyForTarget(target);
  const existing = await getPrState(env.SUBMISSION_GATE_DB, {
    repo: target.repoFullName,
    number: target.number,
  });
  const existingReviewKey = String(existing?.lastReviewKey || "");
  const shouldResetIgnoredScan =
    String(existing?.status || "") === "ignored" &&
    reviewScanKey &&
    existingReviewKey !== reviewScanKey;
  const shouldResetClosedTerminal =
    String(existing?.status || "") === "closed" &&
    (isReopenedPullRequestEvent(eventName, webhook) ||
      eventName === "scheduled");
  if (
    !hasTerminalGateDecision(existing) ||
    shouldResetIgnoredScan ||
    shouldResetClosedTerminal
  ) {
    await upsertPrState(env.SUBMISSION_GATE_DB, {
      repo: target.repoFullName,
      number: target.number,
      headRepo: target.headRepo,
      headRef: target.headRef,
      headSha: target.headSha,
      baseRef: target.baseRef || contentGateBaseRef(env),
      installationId: target.installationId,
      status: "queued",
      deliveryId,
      nextReviewAt: null,
      incrementAttempt: true,
      lastReviewKey: reviewScanKey || undefined,
      clearVerdict: shouldResetIgnoredScan || shouldResetClosedTerminal,
      clearTerminal: shouldResetIgnoredScan || shouldResetClosedTerminal,
    });
  }
  await env.SUBMISSION_REVIEW_QUEUE.send({
    kind: "review_pr",
    targetKey,
    payload: { eventName, deliveryId, target, webhook, forceRecheck },
  });
  return true;
}

async function recordRetryableTargetError(
  env: Env,
  target: ReviewTarget,
  deliveryId: string,
  error: unknown,
) {
  await upsertPrState(env.SUBMISSION_GATE_DB, {
    repo: target.repoFullName,
    number: target.number,
    headRepo: target.headRepo,
    headRef: target.headRef,
    headSha: target.headSha,
    baseRef: target.baseRef || contentGateBaseRef(env),
    installationId: target.installationId,
    status: "error_retryable",
    nextReviewAt: nextReviewForError(error),
    lastError: truncateForQueue(
      error instanceof Error ? error.message : String(error),
    ),
    deliveryId,
    clearVerdict: true,
    clearTerminal: true,
  });
}

function targetsFromWebhookPullRefs(
  payload: Record<string, unknown>,
  refs: Array<Record<string, unknown>>,
  headSha: string,
) {
  const repository = payload.repository as { full_name?: string } | undefined;
  const fallbackRepoFullName = repository?.full_name || "";
  const installationId = installationIdFromPayload(payload);
  return refs
    .map((item): ReviewTarget | null => {
      const number = Number(item.number || 0);
      const base = item.base as
        | { ref?: string; repo?: { full_name?: string } }
        | undefined;
      const head = item.head as
        | { ref?: string; sha?: string; repo?: { full_name?: string } }
        | undefined;
      const repoFullName = base?.repo?.full_name || fallbackRepoFullName;
      if (!number || !repoFullName) return null;
      return {
        repoFullName,
        number,
        baseRef: base?.ref || "",
        headRepo: head?.repo?.full_name,
        headRef: head?.ref,
        headSha: head?.sha || headSha,
        installationId,
      };
    })
    .filter((target): target is ReviewTarget => Boolean(target));
}

async function targetsFromCommitSha(
  env: Env,
  payload: Record<string, unknown>,
  sha: string,
) {
  const repository = payload.repository as { full_name?: string } | undefined;
  const repoFullName = repository?.full_name || "";
  const installationId = installationIdFromPayload(payload);
  if (!repoFullName || !sha || !installationId) return [];
  const token = await installationTokenForInstallationId(env, installationId);
  if (!token) return [];
  const repo = parseRepo(repoFullName);
  const pulls = await listPullRequestsForCommit({
    token,
    repo,
    sha,
    apiVersion: env.GITHUB_API_VERSION,
  });
  return pulls
    .map((pull): ReviewTarget | null => {
      if (!pull.number || !pull.base?.repo?.full_name) return null;
      return {
        repoFullName: pull.base.repo.full_name,
        number: pull.number,
        baseRef: pull.base.ref || "",
        headRepo: pull.head?.repo?.full_name,
        headRef: pull.head?.ref,
        headSha: pull.head?.sha || sha,
        installationId,
      };
    })
    .filter((target): target is ReviewTarget => Boolean(target));
}

async function targetsFromValidationWebhook(
  env: Env,
  eventName: string,
  payload: Record<string, unknown>,
) {
  if (eventName === "check_run") {
    const action = String(payload.action || "");
    if (!REVIEWABLE_CHECK_ACTIONS.has(action)) return [];
    const checkRun = payload.check_run as
      | { head_sha?: string; pull_requests?: Array<Record<string, unknown>> }
      | undefined;
    const targets = targetsFromWebhookPullRefs(
      payload,
      checkRun?.pull_requests || [],
      checkRun?.head_sha || "",
    );
    if (targets.length) return targets;
    return targetsFromCommitSha(env, payload, checkRun?.head_sha || "");
  }

  if (eventName === "check_suite") {
    const action = String(payload.action || "");
    if (!REVIEWABLE_CHECK_ACTIONS.has(action)) return [];
    const checkSuite = payload.check_suite as
      | { head_sha?: string; pull_requests?: Array<Record<string, unknown>> }
      | undefined;
    const targets = targetsFromWebhookPullRefs(
      payload,
      checkSuite?.pull_requests || [],
      checkSuite?.head_sha || "",
    );
    if (targets.length) return targets;
    return targetsFromCommitSha(env, payload, checkSuite?.head_sha || "");
  }

  if (eventName === "status") {
    return targetsFromCommitSha(env, payload, String(payload.sha || ""));
  }

  return [];
}

async function githubWebhookRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const signature = request.headers.get("x-hub-signature-256");
  const deliveryId =
    request.headers.get("x-github-delivery") || crypto.randomUUID();
  if (!env.GITHUB_WEBHOOK_SECRET) {
    return json(
      { ok: false, error: "webhook_secret_not_configured" },
      { status: 503 },
    );
  }
  if (!signature) {
    return json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let raw: string;
  try {
    raw = await readRequestTextWithLimit(
      request,
      GITHUB_WEBHOOK_BODY_LIMIT_BYTES,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return requestBodyTooLarge(GITHUB_WEBHOOK_BODY_LIMIT_BYTES);
    }
    throw error;
  }
  const valid = await verifyGitHubWebhookSignature({
    secret: env.GITHUB_WEBHOOK_SECRET,
    payload: raw,
    signatureHeader: signature,
  });
  if (!valid)
    return json({ ok: false, error: "invalid_signature" }, { status: 401 });

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch (error) {
    console.warn("invalid GitHub webhook payload", { deliveryId, error });
    return json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
  const eventName = request.headers.get("x-github-event") || "";
  await putAuditObject(
    env,
    `webhooks/${eventName}/${deliveryId}.json`,
    payload,
  );

  if (eventName === "pull_request") {
    const target = reviewTargetFromPullPayload(payload);
    if (!isReviewablePullRequestPayload(payload) || !target) {
      return json({ ok: true, ignored: true });
    }
    if (!isContentGatePr(payload, env))
      return json({ ok: true, ignored: true, reason: "outside_content_gate" });
    const shouldInspect = await shouldInspectPullRequestFilesForWebhook(
      env,
      target,
    );
    if (!shouldInspect) {
      return json({ ok: true, ignored: true, reason: "already_reviewed" });
    }
    let reviewability: Awaited<
      ReturnType<typeof directContentReviewabilityForTarget>
    >;
    try {
      reviewability = await directContentReviewabilityForTarget(env, target);
    } catch (error) {
      await recordRetryableTargetError(env, target, deliveryId, error);
      return json({
        ok: true,
        queued: false,
        retryScheduled: true,
        reason: isGitHubRateLimitError(error)
          ? "github_rate_limited"
          : "inspection_retryable",
      });
    }
    if (reviewability.kind === "ignore") {
      await recordReviewedScanKey({
        env,
        target,
        deliveryId,
        status: "ignored",
      });
      return json({ ok: true, ignored: true, reason: reviewability.reason });
    }
    const reviewScope =
      reviewability.kind === "review" ? reviewability.scope : undefined;
    ctx.waitUntil(applyUnderReviewToTarget(env, target, reviewScope));
    await enqueueReviewTarget(
      env,
      target,
      deliveryId,
      eventName,
      payload,
      true,
    );
    const targetKey = targetKeyForReview(target);
    return json({ ok: true, queued: true, targetKey });
  }

  if (eventName === "issue_comment") {
    const target = await targetFromIssueCommentRecheck(env, payload);
    if (!target) return json({ ok: true, ignored: true });
    let reviewability: Awaited<
      ReturnType<typeof directContentReviewabilityForTarget>
    >;
    try {
      reviewability = await directContentReviewabilityForTarget(env, target);
    } catch (error) {
      await recordRetryableTargetError(env, target, deliveryId, error);
      return json({
        ok: true,
        queued: false,
        retryScheduled: true,
        reason: isGitHubRateLimitError(error)
          ? "github_rate_limited"
          : "inspection_retryable",
      });
    }
    if (reviewability.kind === "ignore") {
      return json({ ok: true, ignored: true, reason: reviewability.reason });
    }
    const reviewScope =
      reviewability.kind === "review" ? reviewability.scope : undefined;
    await applyUnderReviewToTarget(env, target, reviewScope);
    await enqueueReviewTarget(
      env,
      target,
      deliveryId,
      eventName,
      payload,
      true,
    );
    const targetKey = targetKeyForReview(target);
    return json({ ok: true, queued: true, targetKey });
  }

  if (VALIDATION_WEBHOOK_EVENTS.has(eventName)) {
    const targets = await targetsFromValidationWebhook(env, eventName, payload);
    let queued = 0;
    for (const target of targets) {
      let reviewability: Awaited<
        ReturnType<typeof directContentReviewabilityForTarget>
      >;
      try {
        reviewability = await directContentReviewabilityForTarget(env, target);
      } catch (error) {
        await recordRetryableTargetError(env, target, deliveryId, error);
        continue;
      }
      if (reviewability.kind === "ignore") continue;
      if (
        await enqueueReviewTarget(env, target, deliveryId, eventName, payload)
      ) {
        queued += 1;
      }
    }
    return json({ ok: true, queued, ignored: queued === 0 });
  }

  return json({ ok: true, ignored: true });
}

async function reviewWithPrivateGate(env: Env, message: QueueMessage) {
  if (!env.PRIVATE_GATE_REVIEW_URL || !env.INTERNAL_SHARED_SECRET) {
    return defaultManualDecision();
  }
  const body = JSON.stringify(message);
  const signature = await signInternalPayload(env.INTERNAL_SHARED_SECRET, body);
  let response: Response;
  try {
    response = await fetch(env.PRIVATE_GATE_REVIEW_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-heyclaude-internal-signature": signature,
      },
      body,
      signal: AbortSignal.timeout(PRIVATE_REVIEW_TIMEOUT_MS),
    });
  } catch {
    return defaultManualDecision("Private corpus review request failed.");
  }
  if (!response.ok) {
    return defaultManualDecision(
      `Private corpus review returned ${response.status}.`,
    );
  }
  const raw = (await response
    .json()
    .catch(() => null)) as Partial<GateDecision> | null;
  if (!raw || !GATE_VERDICTS.has(raw.verdict as GateVerdict)) {
    return defaultManualDecision(
      "Private corpus review returned an unexpected payload.",
    );
  }
  return {
    verdict: raw.verdict as GateVerdict,
    summary: typeof raw.summary === "string" ? raw.summary : "",
    labels: Array.isArray(raw.labels)
      ? raw.labels.filter((label): label is string => typeof label === "string")
      : [],
    close: raw.close === true,
  };
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
  if (response.status === 423) throw new SubmissionLockBusyError(targetKey);
  if (!response.ok) {
    throw new Error(`Submission lock acquire failed: ${response.status}`);
  }
  const lock = (await response.json().catch(() => ({}))) as {
    fenceToken?: string;
  };
  if (!lock.fenceToken) {
    throw new Error("Submission lock acquire did not return a fence token.");
  }
  try {
    await fn();
  } finally {
    try {
      await stub.fetch("https://lock.local/release", {
        method: "POST",
        body: JSON.stringify({ fenceToken: lock.fenceToken }),
      });
    } catch (error) {
      console.error("submission lock release failed", {
        targetKey,
        fenceToken: lock.fenceToken,
        error,
      });
    }
  }
}

async function handleReviewMessage(env: Env, message: QueueMessage) {
  await withSubmissionLock(env, message.targetKey, async () => {
    if (message.kind === "submit_draft") {
      const draftId = String(message.payload.draftId || "");
      const draft = await getDraft(env.SUBMISSION_GATE_DB, draftId);
      if (!draft) {
        console.debug("submit_draft skipped", {
          draftId,
          hasDraft: false,
        });
        return;
      }
      if (draft.status === "pr_open" && draft.pullRequestUrl) return;
      const encryptedToken = await getDraftUserToken(
        env.SUBMISSION_GATE_DB,
        draftId,
      );
      const userToken =
        encryptedToken && env.INTERNAL_SHARED_SECRET
          ? await decryptText(env.INTERNAL_SHARED_SECRET, encryptedToken)
          : "";
      if (!userToken) {
        console.debug("submit_draft skipped", {
          draftId,
          hasDraft: true,
          hasToken: false,
        });
        return;
      }
      const fields = parseStoredDraftFields(draftId, draft.fieldsJson, {
        category: draft.category,
        slug: draft.slug,
        name: draft.slug,
      });
      const title = `Add ${String(draft.category)}: ${String(fields.name || fields.title || draft.slug)}`;
      const content = buildContributorMdx(fields);
      const pr = await createUserForkContentPr({
        userToken,
        publicRepo: env.PUBLIC_REPO,
        baseRef: String(draft.baseRef || contentGateBaseRef(env)),
        branchName: String(draft.branchName),
        targetPath: String(draft.targetPath),
        content,
        title,
        body: [
          "PR-first submission created by the HeyClaude website.",
          "",
          "The private submission gate will review category fit, source of truth, duplicate history, safety/privacy, provenance, and generated-artifact scope.",
        ].join("\n"),
        apiVersion: env.GITHUB_API_VERSION,
      });
      await updateDraftStatus(env.SUBMISSION_GATE_DB, draftId, "pr_open", pr);
      await consumeDraftUserToken(env.SUBMISSION_GATE_DB, draftId);
      await insertAudit(env.SUBMISSION_GATE_DB, {
        id: crypto.randomUUID(),
        targetKey: message.targetKey,
        eventType: "submit_draft",
        decision: "pr_open",
        summary: pr.pullRequestUrl,
      });
      return;
    }

    if (message.kind === "review_pr") {
      const target = reviewTargetFromMessage(message);
      if (!target) return;
      const forceRecheck =
        message.payload.forceRecheck === true ||
        String(message.payload.eventName || "") === "issue_comment";
      const existing = await getPrState(env.SUBMISSION_GATE_DB, {
        repo: target.repoFullName,
        number: target.number,
      });
      const token = await installationTokenForTarget(env, target);
      if (!token) {
        await upsertPrState(env.SUBMISSION_GATE_DB, {
          repo: target.repoFullName,
          number: target.number,
          headRepo: target.headRepo,
          headRef: target.headRef,
          headSha: target.headSha,
          baseRef: target.baseRef || contentGateBaseRef(env),
          installationId: target.installationId,
          status: "error_retryable",
          nextReviewAt: nextReviewForStatus("error_retryable"),
          lastError: "No installation token available for PR review.",
          deliveryId: String(message.payload.deliveryId || ""),
          clearVerdict: true,
          clearTerminal: true,
        });
        return;
      }
      const repo = parseRepo(target.repoFullName);
      if (hasTerminalGateDecision(existing)) {
        const existingStatus = String(existing?.status || "");
        if (existingStatus !== "closed") {
          await insertAudit(env.SUBMISSION_GATE_DB, {
            id: crypto.randomUUID(),
            targetKey: message.targetKey,
            eventType: message.kind,
            decision: "ignored",
            summary: forceRecheck
              ? "Skipped trusted recheck because this submission already has a terminal gate decision."
              : "Skipped because this submission already has a terminal gate decision.",
          });
          return;
        }
        try {
          const pull = await getPullRequest({
            token,
            repo,
            number: target.number,
            apiVersion: env.GITHUB_API_VERSION,
          });
          if (!isOpenPullRequest(pull)) {
            await upsertPrState(env.SUBMISSION_GATE_DB, {
              repo: target.repoFullName,
              number: target.number,
              headRepo: pull.head?.repo?.full_name || target.headRepo,
              headRef: pull.head?.ref || target.headRef,
              headSha: pull.head?.sha || target.headSha,
              baseRef:
                pull.base?.ref || target.baseRef || contentGateBaseRef(env),
              installationId: target.installationId,
              status: String(existing?.status || "closed"),
              deliveryId: String(message.payload.deliveryId || ""),
              lastError: "GitHub terminal state verified.",
              terminalAt:
                typeof existing?.terminalAt === "string"
                  ? existing.terminalAt
                  : nowIso(),
            });
            await insertAudit(env.SUBMISSION_GATE_DB, {
              id: crypto.randomUUID(),
              targetKey: message.targetKey,
              eventType: message.kind,
              decision: "ignored",
              summary: forceRecheck
                ? "Skipped trusted recheck because this submission already has a terminal gate decision and GitHub is terminal."
                : "Skipped because this submission already has a terminal gate decision and GitHub is terminal.",
            });
            return;
          }
          await upsertPrState(env.SUBMISSION_GATE_DB, {
            repo: target.repoFullName,
            number: target.number,
            headRepo: pull.head?.repo?.full_name || target.headRepo,
            headRef: pull.head?.ref || target.headRef,
            headSha: pull.head?.sha || target.headSha,
            baseRef:
              pull.base?.ref || target.baseRef || contentGateBaseRef(env),
            installationId: target.installationId,
            status: "error_retryable",
            nextReviewAt: null,
            lastError: "Terminal gate state did not match open GitHub PR.",
            deliveryId: String(message.payload.deliveryId || ""),
            clearVerdict: true,
            clearTerminal: true,
          });
          target.headSha = pull.head?.sha || target.headSha;
          target.headRef = pull.head?.ref || target.headRef;
          target.headRepo = pull.head?.repo?.full_name || target.headRepo;
          target.baseRef = pull.base?.ref || target.baseRef || "";
          await insertAudit(env.SUBMISSION_GATE_DB, {
            id: crypto.randomUUID(),
            targetKey: message.targetKey,
            eventType: message.kind,
            decision: "terminal_reconciled",
            summary:
              "Terminal gate state did not match open GitHub PR; requeued for reconciliation.",
          });
        } catch (error) {
          await upsertPrState(env.SUBMISSION_GATE_DB, {
            repo: target.repoFullName,
            number: target.number,
            headRepo: target.headRepo,
            headRef: target.headRef,
            headSha: target.headSha,
            baseRef: target.baseRef || contentGateBaseRef(env),
            installationId: target.installationId,
            status: "error_retryable",
            nextReviewAt: nextReviewForError(error),
            lastError: truncateForQueue(
              error instanceof Error ? error.message : String(error),
            ),
            deliveryId: String(message.payload.deliveryId || ""),
            clearVerdict: true,
            clearTerminal: true,
          });
          return;
        }
      }
      await upsertPrState(env.SUBMISSION_GATE_DB, {
        repo: target.repoFullName,
        number: target.number,
        headRepo: target.headRepo,
        headRef: target.headRef,
        headSha: target.headSha,
        baseRef: target.baseRef || contentGateBaseRef(env),
        installationId: target.installationId,
        status: "reviewing",
        deliveryId: String(message.payload.deliveryId || ""),
        nextReviewAt: null,
      });
      let pullForNotification: {
        title?: string;
        html_url?: string;
        user?: { login?: string };
        merged_at?: string | null;
        base?: { ref?: string };
        head?: { sha?: string; ref?: string; repo?: { full_name?: string } };
      } | null = null;
      try {
        pullForNotification = await getPullRequest({
          token,
          repo,
          number: target.number,
          apiVersion: env.GITHUB_API_VERSION,
        });
        if (pullForNotification.head?.sha) {
          target.headSha = pullForNotification.head.sha;
        }
        target.headRef = pullForNotification.head?.ref || target.headRef;
        target.headRepo =
          pullForNotification.head?.repo?.full_name || target.headRepo;
        target.baseRef = pullForNotification.base?.ref || target.baseRef || "";
        if (
          await reconcileTerminalPullRequest({
            env,
            token,
            repo,
            target,
            message,
            pull: pullForNotification,
          })
        ) {
          return;
        }
        if (target.baseRef !== contentGateBaseRef(env)) {
          await ignoreOutOfScopeReviewTarget({
            env,
            token,
            repo,
            target,
            message,
            summary:
              "Skipped because this PR no longer targets the configured content gate base.",
          });
          return;
        }
        await upsertPrState(env.SUBMISSION_GATE_DB, {
          repo: target.repoFullName,
          number: target.number,
          headRepo: target.headRepo,
          headRef: target.headRef,
          headSha: target.headSha,
          baseRef: target.baseRef || contentGateBaseRef(env),
          installationId: target.installationId,
          status: "reviewing",
          deliveryId: String(message.payload.deliveryId || ""),
          nextReviewAt: null,
        });
      } catch (error) {
        console.warn("submission gate could not refresh PR metadata", {
          targetKey: message.targetKey,
          error,
        });
      }
      let decision: GateDecision | null = null;
      let validationForPrivateReview: unknown = null;
      let validationForNotification: {
        summary?: string;
        checks?: Array<{ name: string; status: string; details?: string }>;
      } | null = null;
      let contentScopeForPrivateReview: DirectContentScope | null = null;
      const reviewability = await directContentReviewabilityForPr({
        token,
        repo,
        number: target.number,
        apiVersion: env.GITHUB_API_VERSION,
        context: {
          headRepo: target.headRepo,
          baseRepo: target.repoFullName,
        },
      });
      if (reviewability.kind === "ignore") {
        await removeLabels({
          token,
          repo,
          issueNumber: target.number,
          labels: RECONCILED_GATE_LABELS,
          apiVersion: env.GITHUB_API_VERSION,
        });
        await upsertPrState(env.SUBMISSION_GATE_DB, {
          repo: target.repoFullName,
          number: target.number,
          headRepo: target.headRepo,
          headRef: target.headRef,
          headSha: target.headSha,
          baseRef: target.baseRef || contentGateBaseRef(env),
          installationId: target.installationId,
          status: "ignored",
          deliveryId: String(message.payload.deliveryId || ""),
        });
        await insertAudit(env.SUBMISSION_GATE_DB, {
          id: crypto.randomUUID(),
          targetKey: message.targetKey,
          eventType: message.kind,
          decision: "ignored",
          summary: reviewability.reason,
        });
        return;
      }
      if (reviewability.kind === "scope_failure") {
        decision = reviewability.decision;
      } else {
        contentScopeForPrivateReview = reviewability.scope;
      }
      if (!decision && contentScopeForPrivateReview) {
        try {
          contentScopeForPrivateReview =
            await assertDirectContentAutoMergeEligibility({
              env,
              token,
              repo,
              target,
              expectedScope: contentScopeForPrivateReview,
            });
        } catch (error) {
          decision = scopeFailureDecision(error);
          contentScopeForPrivateReview = null;
        }
      }
      try {
        const validation = await getCommitValidationState({
          token,
          repo,
          ref: target.headSha || target.headRef || "",
          requiredChecks: requiredValidationChecks(env),
          requiredStatusContexts: requiredStatusContexts(env),
          apiVersion: env.GITHUB_API_VERSION,
        });
        validationForNotification = validation;
        if (!decision && validation.state === "pending") {
          await upsertPrState(env.SUBMISSION_GATE_DB, {
            repo: target.repoFullName,
            number: target.number,
            headRepo: target.headRepo,
            headRef: target.headRef,
            headSha: target.headSha,
            baseRef: target.baseRef || contentGateBaseRef(env),
            installationId: target.installationId,
            status: "validation_pending",
            deliveryId: String(message.payload.deliveryId || ""),
            nextReviewAt: nextReviewForStatus("validation_pending"),
            lastCheckSummary: validation.summary,
          });
          await upsertMarkerComment({
            token,
            repo,
            issueNumber: target.number,
            marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
            body: markerComment(
              undefined,
              env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
            ),
            apiVersion: env.GITHUB_API_VERSION,
          });
          await insertAudit(env.SUBMISSION_GATE_DB, {
            id: crypto.randomUUID(),
            targetKey: message.targetKey,
            eventType: message.kind,
            decision: "validation_pending",
            summary: validation.summary,
          });
          return;
        }
        if (!decision && validation.state === "failed") {
          decision = validationGateDecision(validation);
        } else if (!decision) {
          validationForPrivateReview = {
            state: validation.state,
            summary: validation.summary,
            checks: validation.checks,
          };
          await upsertPrState(env.SUBMISSION_GATE_DB, {
            repo: target.repoFullName,
            number: target.number,
            headRepo: target.headRepo,
            headRef: target.headRef,
            headSha: target.headSha,
            baseRef: target.baseRef || contentGateBaseRef(env),
            installationId: target.installationId,
            status: "reviewing",
            deliveryId: String(message.payload.deliveryId || ""),
            nextReviewAt: null,
            lastCheckSummary: validation.summary,
          });
        }
      } catch {
        decision = defaultManualDecision(
          "Submission gate could not read public validation checks.",
        );
      }

      if (!decision && contentScopeForPrivateReview) {
        try {
          const precheck = await deterministicContentPrecheck({
            env,
            token,
            repo,
            target,
            scope: contentScopeForPrivateReview,
          });
          if (precheck.duplicateReview) {
            validationForPrivateReview = {
              ...(isRecord(validationForPrivateReview)
                ? validationForPrivateReview
                : {}),
              deterministicDuplicateReview: precheck.duplicateReview,
            };
            if (
              precheck.duplicateReview.legacyDuplicate &&
              !precheck.duplicateReview.strictDuplicate
            ) {
              await insertAudit(env.SUBMISSION_GATE_DB, {
                id: crypto.randomUUID(),
                targetKey: message.targetKey,
                eventType: "duplicate_shadow_review",
                decision: "related_not_strict_duplicate",
                summary:
                  "Legacy duplicate classifier matched, but strict duplicate classifier only found related-content context.",
              });
            }
          }
          if (precheck.decision) {
            decision = precheck.decision;
          } else {
            validationForPrivateReview = {
              ...(isRecord(validationForPrivateReview)
                ? validationForPrivateReview
                : {}),
              deterministicPrecheck: {
                status: "passed",
                contentStatus: contentScopeForPrivateReview.status,
              },
            };
          }
        } catch (error) {
          decision = defaultManualDecision(
            `Submission gate could not complete deterministic duplicate/edit review: ${
              error instanceof Error ? error.message : "unknown error"
            }.`,
          );
        }
      }

      if (!decision) {
        decision = await reviewWithPrivateGate(env, {
          ...message,
          payload: {
            ...message.payload,
            target: {
              repoFullName: target.repoFullName,
              number: target.number,
              baseRef: target.baseRef || contentGateBaseRef(env),
              headRepo: target.headRepo,
              headRef: target.headRef,
              headSha: target.headSha,
              installationId: target.installationId,
            },
            validation: validationForPrivateReview,
            contentScope: contentScopeForPrivateReview,
            privateReviewRequirements: {
              finalAction: "merge_or_close",
              duplicateHistoryRequired: true,
              categoryReviewRequired: true,
              categoryReviewRubric:
                contentScopeForPrivateReview?.category &&
                CATEGORY_REVIEW_RUBRICS[contentScopeForPrivateReview.category],
              duplicateSignals: [
                "slug",
                "title",
                "source_url",
                "github_url",
                "docs_url",
                "package_url",
                "domain",
                "aliases",
                "normalized_description",
                "accepted_history",
                "rejected_history",
              ],
              strictDuplicatePolicy:
                "Only same path, same category+slug, same category+canonical URL/repo, same category+title, or same category+normalized description should block as a duplicate.",
              relatedContentPolicy:
                "Cross-category source overlap, same ecosystem/project ownership, and collection-member overlap are related/complementary context, not automatic duplicates.",
              collectionPolicy:
                "Collections may bundle existing entries when they add distinct workflow value, ordering, prerequisites, source-backed rationale, and safety/privacy guidance; repeated same-scope collection variants can still close as duplicates.",
            },
          },
        });
        if (isRetryablePrivateReviewerDecision(decision)) {
          await upsertPrState(env.SUBMISSION_GATE_DB, {
            repo: target.repoFullName,
            number: target.number,
            headRepo: target.headRepo,
            headRef: target.headRef,
            headSha: target.headSha,
            baseRef: target.baseRef || contentGateBaseRef(env),
            installationId: target.installationId,
            status: "error_retryable",
            nextReviewAt: nextReviewForStatus("error_retryable"),
            lastError: truncateForQueue(decision.summary),
            deliveryId: String(message.payload.deliveryId || ""),
            clearVerdict: true,
            clearTerminal: true,
          });
          await upsertMarkerComment({
            token,
            repo,
            issueNumber: target.number,
            marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
            body: retryingReviewComment(
              env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
            ),
            apiVersion: env.GITHUB_API_VERSION,
          });
          await insertAudit(env.SUBMISSION_GATE_DB, {
            id: crypto.randomUUID(),
            targetKey: message.targetKey,
            eventType: message.kind,
            decision: "private_review_retryable",
            summary: decision.summary,
          });
          return;
        }
      }
      decision = normalizeOneShotDecision(decision);
      if (decision.verdict === "merge" && !contentScopeForPrivateReview) {
        try {
          contentScopeForPrivateReview = await directContentScopeForPr({
            token,
            repo,
            number: target.number,
            apiVersion: env.GITHUB_API_VERSION,
          });
        } catch (error) {
          decision = scopeFailureDecision(error);
        }
      }
      const status = decisionStatus(decision.verdict);
      const categoryLabels = gateLabelsForCategory(
        contentScopeForPrivateReview?.category ||
          (reviewability.kind === "scope_failure"
            ? reviewability.category
            : undefined),
      );
      const decisionLabelsToApply =
        decision.verdict === "merge"
          ? decision.labels.filter((label) => label !== LABELS.merged)
          : decision.labels;
      const labelsToApply = [
        ...new Set([...decisionLabelsToApply, ...categoryLabels]),
      ];

      await insertAudit(env.SUBMISSION_GATE_DB, {
        id: crypto.randomUUID(),
        targetKey: message.targetKey,
        eventType: message.kind,
        decision: decision.verdict,
        summary: decision.summary,
      });
      if (decision.verdict !== "merge") {
        await applyTerminalGateDecision({
          env,
          token,
          repo,
          target,
          targetKey: message.targetKey,
          decision,
          status,
          labelsToApply,
          scope: contentScopeForPrivateReview,
          validation: validationForNotification,
          pull: pullForNotification,
          deliveryId: String(message.payload.deliveryId || ""),
        });
        return;
      }
      if (decision.verdict === "merge" && contentScopeForPrivateReview) {
        let mergeResult: Awaited<ReturnType<typeof mergeAcceptedPullRequest>>;
        try {
          const latestPull = await getPullRequest({
            token,
            repo,
            number: target.number,
            apiVersion: env.GITHUB_API_VERSION,
          });
          if (
            await reconcileTerminalPullRequest({
              env,
              token,
              repo,
              target,
              message,
              pull: latestPull,
            })
          ) {
            return;
          }
          mergeResult = await mergeAcceptedPullRequest({
            env,
            token,
            repo,
            target,
            decision,
            scope: contentScopeForPrivateReview,
          });
        } catch (error) {
          if (isRetryableMergeError(error)) {
            const pendingSummary = [
              decision.summary.trim(),
              "",
              "Merge Result:",
              `- Accepted by private review, but GitHub is not merge-ready yet: ${
                error instanceof Error ? error.message : "unknown merge state"
              }`,
              "- The gate will retry after branch protection and required review state settle.",
            ].join("\n");
            await upsertPrState(env.SUBMISSION_GATE_DB, {
              repo: target.repoFullName,
              number: target.number,
              headRepo: target.headRepo,
              headRef: target.headRef,
              headSha: target.headSha,
              baseRef: target.baseRef || contentGateBaseRef(env),
              installationId: target.installationId,
              status: "merge_pending",
              verdict: "merge",
              verdictSummary: pendingSummary,
              nextReviewAt: nextReviewForStatus("merge_pending"),
              lastError: error instanceof Error ? error.message : "unknown",
            });
            await insertAudit(env.SUBMISSION_GATE_DB, {
              id: crypto.randomUUID(),
              targetKey: message.targetKey,
              eventType: message.kind,
              decision: "merge_pending",
              summary: pendingSummary,
            });
            throw new SubmissionMergePendingError(pendingSummary);
          }
          const manualDecision = defaultManualDecision(
            `Private review accepted this PR, but direct merge failed: ${
              error instanceof Error ? error.message : "unknown error"
            }.`,
          );
          await applyTerminalGateDecision({
            env,
            token,
            repo,
            target,
            targetKey: message.targetKey,
            decision: manualDecision,
            status: "manual",
            labelsToApply: [
              ...new Set([...manualDecision.labels, ...categoryLabels]),
            ],
            scope: contentScopeForPrivateReview,
            validation: validationForNotification,
            pull: pullForNotification,
            deliveryId: String(message.payload.deliveryId || ""),
          });
          await insertAudit(env.SUBMISSION_GATE_DB, {
            id: crypto.randomUUID(),
            targetKey: message.targetKey,
            eventType: message.kind,
            decision: "merge_failed",
            summary: manualDecision.summary,
          });
          return;
        }
        const mergedSummary = [
          decision.summary.trim(),
          "",
          "Merge Result:",
          `- Merged this PR directly at \`${mergeResult.sha || target.headSha || "unknown"}\`.`,
        ].join("\n");
        const mergedDecision: GateDecision = {
          ...decision,
          summary: mergedSummary,
          labels: [LABELS.merged, ...categoryLabels],
        };
        await removeLabels({
          token,
          repo,
          issueNumber: target.number,
          labels: RECONCILED_GATE_LABELS.filter(
            (label) =>
              label !== LABELS.merged && !categoryLabels.includes(label),
          ),
          apiVersion: env.GITHUB_API_VERSION,
        });
        await addLabels({
          token,
          repo,
          issueNumber: target.number,
          labels: [LABELS.merged, ...categoryLabels],
          apiVersion: env.GITHUB_API_VERSION,
        });
        await upsertMarkerComment({
          token,
          repo,
          issueNumber: target.number,
          marker: env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
          body: markerComment(
            mergedDecision,
            env.REVIEW_MARKER || DEFAULT_REVIEW_MARKER,
          ),
          apiVersion: env.GITHUB_API_VERSION,
        });
        await insertAudit(env.SUBMISSION_GATE_DB, {
          id: crypto.randomUUID(),
          targetKey: message.targetKey,
          eventType: message.kind,
          decision: "merged",
          summary: mergedSummary,
        });
        await notifyGateDecision(env, {
          target,
          targetKey: message.targetKey,
          decision: mergedDecision,
          status: "merged",
          scope: contentScopeForPrivateReview,
          validation: validationForNotification,
          pull: pullForNotification,
        });
        await upsertPrState(env.SUBMISSION_GATE_DB, {
          repo: target.repoFullName,
          number: target.number,
          headRepo: target.headRepo,
          headRef: target.headRef,
          headSha: target.headSha,
          baseRef: target.baseRef || contentGateBaseRef(env),
          installationId: target.installationId,
          status: "merged",
          verdict: "merge",
          verdictSummary: mergedSummary,
          nextReviewAt: null,
          terminalAt: nowIso(),
        });
        return;
      }
    }
  });
}

function reviewTargetFromQueueState(state: PrQueueState): ReviewTarget | null {
  const repoFullName = String(state.repo || "");
  const number = Number(state.number || 0);
  if (!repoFullName || !number) return null;
  return {
    repoFullName,
    number,
    baseRef: String(state.baseRef || ""),
    headRepo: typeof state.headRepo === "string" ? state.headRepo : undefined,
    headRef: typeof state.headRef === "string" ? state.headRef : undefined,
    headSha: typeof state.headSha === "string" ? state.headSha : undefined,
    installationId: Number(state.installationId || 0) || undefined,
  };
}

async function recordRetryableQueueError(
  env: Env,
  message: QueueMessage,
  error: unknown,
) {
  if (message.kind !== "review_pr") return;
  const target = reviewTargetFromMessage(message);
  if (!target) return;
  const errorMessage = error instanceof Error ? error.message : String(error);
  await upsertPrState(env.SUBMISSION_GATE_DB, {
    repo: target.repoFullName,
    number: target.number,
    headRepo: target.headRepo,
    headRef: target.headRef,
    headSha: target.headSha,
    baseRef: target.baseRef || contentGateBaseRef(env),
    installationId: target.installationId,
    status: "error_retryable",
    nextReviewAt: nextReviewForError(error),
    lastError: truncateForQueue(errorMessage),
    deliveryId: String(message.payload.deliveryId || ""),
    clearVerdict: true,
    clearTerminal: true,
  });
}

async function sweepSubmissionQueue(env: Env) {
  const result = await listDuePrStates(env.SUBMISSION_GATE_DB, {
    nowIso: nowIso(),
    staleBeforeIso: isoBefore(VALIDATION_REQUEUE_SECONDS),
    queuedStaleBeforeIso: isoBefore(QUEUED_STALE_SECONDS),
    reviewingStaleBeforeIso: isoBefore(REVIEWING_STALE_SECONDS),
    limit: SWEEP_LIMIT,
  });
  const rows = result.results || [];
  let queued = 0;
  for (const row of rows) {
    const target = reviewTargetFromQueueState(row as PrQueueState);
    if (!target) continue;
    const deliveryId = `scheduled-${Date.now()}-${target.number}`;
    if (
      await enqueueReviewTarget(
        env,
        target,
        deliveryId,
        "scheduled",
        undefined,
        false,
      )
    ) {
      queued += 1;
    }
  }
  const discovered = await discoverOpenContentPullRequests(env, queued);
  return { scanned: rows.length, queued, discovered };
}

async function discoverOpenContentPullRequests(
  env: Env,
  alreadyQueued: number,
) {
  if (alreadyQueued >= OPEN_PR_DISCOVERY_LIMIT) return 0;
  const repo = parseRepo(env.PUBLIC_REPO);
  let installationId = 0;
  try {
    installationId = await getRepositoryInstallationId({
      appId: env.GITHUB_APP_ID,
      privateKeyPem: env.GITHUB_APP_PRIVATE_KEY,
      repo,
      apiVersion: env.GITHUB_API_VERSION,
    });
  } catch (error) {
    console.warn(
      "submission gate open PR discovery could not resolve installation",
      {
        error,
      },
    );
    return 0;
  }
  let token = "";
  try {
    token = await installationTokenForInstallationId(env, installationId);
  } catch (error) {
    console.warn(
      "submission gate open PR discovery could not create installation token",
      { error },
    );
    return 0;
  }
  if (!token) return 0;

  let pulls: Awaited<ReturnType<typeof listOpenPullRequests>>;
  try {
    pulls = await listOpenPullRequests({
      token,
      repo,
      baseRef: contentGateBaseRef(env),
      apiVersion: env.GITHUB_API_VERSION,
    });
  } catch (error) {
    console.warn("submission gate open PR discovery could not list PRs", {
      error,
    });
    return 0;
  }

  let discovered = 0;
  for (const pull of pulls) {
    if (discovered + alreadyQueued >= OPEN_PR_DISCOVERY_LIMIT) break;
    if (pull.draft) continue;
    const target = reviewTargetFromPullRecord(pull, installationId);
    if (!target || target.baseRef !== contentGateBaseRef(env)) continue;
    const state = await getPrState(env.SUBMISSION_GATE_DB, {
      repo: target.repoFullName,
      number: target.number,
    });
    const closedTerminalButOpen = String(state?.status || "") === "closed";
    if (hasTerminalGateDecision(state) && !closedTerminalButOpen) continue;
    const reviewScanKey = reviewScanKeyForTarget(target);
    if (
      state &&
      !closedTerminalButOpen &&
      String(state.status || "") !== "error_retryable" &&
      (!reviewScanKey || String(state.lastReviewKey || "") === reviewScanKey)
    ) {
      continue;
    }

    let reviewability: Awaited<
      ReturnType<typeof directContentReviewabilityForTarget>
    >;
    try {
      reviewability = await directContentReviewabilityForTarget(env, target);
    } catch (error) {
      await recordRetryableTargetError(
        env,
        target,
        `scheduled-discovery-${Date.now()}-${target.number}`,
        error,
      );
      continue;
    }
    if (reviewability.kind === "ignore") {
      await recordReviewedScanKey({
        env,
        target,
        deliveryId: `scheduled-discovery-${Date.now()}-${target.number}`,
        status: "ignored",
      });
      continue;
    }
    const reviewScope =
      reviewability.kind === "review" ? reviewability.scope : undefined;
    const deliveryId = `scheduled-discovery-${Date.now()}-${target.number}`;
    try {
      await applyUnderReviewToTarget(env, target, reviewScope);
      const queued = await enqueueReviewTarget(
        env,
        target,
        deliveryId,
        "scheduled",
        undefined,
        false,
      );
      if (queued) discovered += 1;
    } catch (error) {
      await recordRetryableTargetError(env, target, deliveryId, error);
    }
  }
  return discovered;
}

function hasInternalBearer(request: Request, env: Env) {
  const authorization = request.headers.get("authorization") || "";
  return (
    Boolean(env.INTERNAL_SHARED_SECRET) &&
    authorization === `Bearer ${env.INTERNAL_SHARED_SECRET}`
  );
}

async function queueStatusRoute(request: Request, env: Env) {
  if (!hasInternalBearer(request, env)) {
    return json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const url = new URL(request.url);
  const limit = Math.max(
    1,
    Math.min(100, Number(url.searchParams.get("limit") || 25)),
  );
  const counts = await env.SUBMISSION_GATE_DB.prepare(
    `SELECT status, COUNT(*) AS count
     FROM submission_prs
     GROUP BY status
     ORDER BY status ASC`,
  ).all<Record<string, unknown>>();
  const recent = await listRecentPrStates(env.SUBMISSION_GATE_DB, { limit });
  return json({
    ok: true,
    counts: counts.results || [],
    recent: (recent.results || []).map((row) => ({
      repo: row.repo,
      number: row.number,
      status: row.status,
      verdict: row.verdict,
      baseRef: row.baseRef,
      headRepo: row.headRepo,
      headRef: row.headRef,
      headSha: row.headSha,
      nextReviewAt: row.nextReviewAt,
      attemptCount: row.attemptCount,
      lastError: truncateForQueue(row.lastError, 240),
      lastCheckSummary: truncateForQueue(row.lastCheckSummary, 240),
      terminalAt: row.terminalAt,
      updatedAt: row.updatedAt,
    })),
  });
}

async function route(request: Request, env: Env, ctx: ExecutionContext) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return json({ ok: true });
  if (request.method === "GET" && url.pathname === "/health") {
    return json({ ok: true, service: "heyclaude-submission-gate" });
  }
  if (request.method === "GET" && url.pathname === "/queue") {
    return queueStatusRoute(request, env);
  }
  if (request.method === "POST" && url.pathname === "/drafts") {
    return createDraftRoute(request, env);
  }
  if (request.method === "GET" && url.pathname.startsWith("/drafts/")) {
    const id = url.pathname.split("/").pop() || "";
    if (!/^draft_[0-9a-f-]{36}$/i.test(id)) {
      return json({ ok: false, error: "invalid_id" }, { status: 400 });
    }
    return getDraftRoute(env, id);
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
  return json({ ok: false, error: "not_found" }, { status: 404 });
}

export class SubmissionLock extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/release") {
      const body = (await request.json().catch(() => ({}))) as {
        fenceToken?: string;
      };
      const storedToken = await this.ctx.storage.get<string>("fenceToken");
      if (!body.fenceToken || body.fenceToken !== storedToken) {
        return json(
          { ok: false, error: "lock_token_mismatch" },
          { status: 409 },
        );
      }
      await this.ctx.storage.delete(["expiresAt", "fenceToken"]);
      return json({ ok: true, released: true });
    }
    if (pathname !== "/acquire") {
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
    const fenceToken = crypto.randomUUID();
    await this.ctx.storage.put("expiresAt", nowMs + ttlMs);
    await this.ctx.storage.put("fenceToken", fenceToken);
    return json({
      ok: true,
      locked: false,
      expiresAt: nowMs + ttlMs,
      fenceToken,
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    return withCors(await route(request, env, ctx), request, env);
  },
  async queue(batch, env) {
    for (const message of batch.messages) {
      const body = message.body as QueueMessage;
      try {
        await handleReviewMessage(env, body);
        message.ack();
      } catch (error) {
        if (error instanceof SubmissionLockBusyError) {
          console.debug("submission lock contention, retrying", {
            targetKey: body.targetKey,
          });
          message.retry({ delaySeconds: 5 });
        } else if (error instanceof SubmissionMergePendingError) {
          console.debug("submission merge pending, retrying", {
            targetKey: body.targetKey,
          });
          message.retry({ delaySeconds: 30 });
        } else {
          await recordRetryableQueueError(env, body, error);
          console.error("submission gate queue failure", error);
          message.retry({ delaySeconds: retryDelayForError(error) });
        }
      }
    }
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(sweepSubmissionQueue(env));
  },
} satisfies ExportedHandler<Env, QueueMessage>;

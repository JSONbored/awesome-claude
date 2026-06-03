import { sha256Hex } from "./security";

type DraftInsert = {
  id: string;
  status: string;
  category: string;
  slug: string;
  targetPath: string;
  branchName: string;
  baseRef: string;
  fields: Record<string, unknown>;
  authState?: string;
};

function now() {
  return new Date().toISOString();
}

function isTerminalPrStatus(status: string) {
  return ["merged", "closed", "manual", "ignored"].includes(status);
}

function hexToBytes(value: string) {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) return null;
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes;
}

// Compares 64-character SHA-256 hex digests; non-32-byte inputs fail closed.
function timingSafeHexEqual(left: string, right: string) {
  const leftBytes = hexToBytes(left);
  const rightBytes = hexToBytes(right);
  if (!leftBytes || !rightBytes) return false;
  if (leftBytes.length !== 32 || rightBytes.length !== 32) return false;
  const subtle = crypto.subtle as SubtleCrypto & {
    timingSafeEqual?: (left: Uint8Array, right: Uint8Array) => boolean;
  };
  if (typeof subtle.timingSafeEqual === "function") {
    return subtle.timingSafeEqual(leftBytes, rightBytes);
  }
  let diff = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index];
  }
  return diff === 0;
}

export async function createDraft(db: D1Database, draft: DraftInsert) {
  const timestamp = now();
  const authStateHash = draft.authState
    ? await sha256Hex(draft.authState)
    : null;
  await db
    .prepare(
      `INSERT INTO submission_drafts
        (id, status, category, slug, target_path, branch_name, base_ref, fields_json, auth_state_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      draft.id,
      draft.status,
      draft.category,
      draft.slug,
      draft.targetPath,
      draft.branchName,
      draft.baseRef,
      JSON.stringify(draft.fields),
      authStateHash,
      timestamp,
      timestamp,
    )
    .run();
}

export async function getDraft(db: D1Database, id: string) {
  return db
    .prepare(
      `SELECT id, status, category, slug, target_path AS targetPath, branch_name AS branchName,
        base_ref AS baseRef, fields_json AS fieldsJson, auth_state_hash AS authStateHash,
        github_login AS githubLogin, fork_full_name AS forkFullName,
        pull_request_url AS pullRequestUrl, pull_request_number AS pullRequestNumber,
        verdict, verdict_summary AS verdictSummary, created_at AS createdAt, updated_at AS updatedAt
       FROM submission_drafts WHERE id = ?`,
    )
    .bind(id)
    .first<Record<string, unknown>>();
}

export async function verifyDraftState(
  db: D1Database,
  draftId: string,
  state: string,
) {
  const draft = await getDraft(db, draftId);
  if (!draft?.authStateHash) return false;
  return timingSafeHexEqual(
    String(draft.authStateHash),
    await sha256Hex(state),
  );
}

export async function updateDraftAuthState(
  db: D1Database,
  draftId: string,
  state: string,
) {
  await db
    .prepare(
      `UPDATE submission_drafts
       SET status = 'auth_required', auth_state_hash = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(await sha256Hex(state), now(), draftId)
    .run();
}

export async function storeDraftUserToken(
  db: D1Database,
  params: { draftId: string; encryptedToken: string; ttlSeconds?: number },
) {
  const timestamp = now();
  const expiresAt = new Date(
    Date.parse(timestamp) + Math.max(60, params.ttlSeconds ?? 900) * 1000,
  ).toISOString();
  await db
    .prepare(
      `INSERT INTO submission_user_tokens
        (draft_id, encrypted_token, expires_at, consumed_at, created_at, updated_at)
       VALUES (?, ?, ?, NULL, ?, ?)
       ON CONFLICT(draft_id) DO UPDATE SET
        encrypted_token = excluded.encrypted_token,
        expires_at = excluded.expires_at,
        consumed_at = NULL,
        updated_at = excluded.updated_at`,
    )
    .bind(
      params.draftId,
      params.encryptedToken,
      expiresAt,
      timestamp,
      timestamp,
    )
    .run();
}

export async function consumeDraftUserToken(db: D1Database, draftId: string) {
  const timestamp = now();
  const row = await db
    .prepare(
      `UPDATE submission_user_tokens
       SET consumed_at = ?, updated_at = ?
       WHERE draft_id = ? AND consumed_at IS NULL AND expires_at > ?
       RETURNING encrypted_token AS encryptedToken`,
    )
    .bind(timestamp, timestamp, draftId, timestamp)
    .first<{ encryptedToken?: string }>();
  return row?.encryptedToken ?? null;
}

export async function getDraftUserToken(db: D1Database, draftId: string) {
  const timestamp = now();
  const row = await db
    .prepare(
      `SELECT encrypted_token AS encryptedToken
       FROM submission_user_tokens
       WHERE draft_id = ? AND consumed_at IS NULL AND expires_at > ?`,
    )
    .bind(draftId, timestamp)
    .first<{ encryptedToken?: string }>();
  return row?.encryptedToken ?? null;
}

export async function updateDraftStatus(
  db: D1Database,
  id: string,
  status: string,
  values: Record<string, unknown> = {},
) {
  const timestamp = now();
  // Patch-style update: omitted or null values intentionally keep existing metadata.
  await db
    .prepare(
      `UPDATE submission_drafts
       SET status = ?, github_login = COALESCE(?, github_login),
         fork_full_name = COALESCE(?, fork_full_name),
         pull_request_url = COALESCE(?, pull_request_url),
         pull_request_number = COALESCE(?, pull_request_number),
         verdict = COALESCE(?, verdict),
         verdict_summary = COALESCE(?, verdict_summary),
         updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      status,
      values.githubLogin ?? null,
      values.forkFullName ?? null,
      values.pullRequestUrl ?? null,
      values.pullRequestNumber ?? null,
      values.verdict ?? null,
      values.verdictSummary ?? null,
      timestamp,
      id,
    )
    .run();
}

export async function upsertPrState(
  db: D1Database,
  params: {
    repo: string;
    number: number;
    headRepo?: string;
    headRef?: string;
    headSha?: string;
    baseRef: string;
    installationId?: number;
    status: string;
    verdict?: string;
    verdictSummary?: string;
    deliveryId?: string;
    nextReviewAt?: string | null;
    incrementAttempt?: boolean;
    lastError?: string | null;
    lastCheckSummary?: string | null;
    terminalAt?: string | null;
  },
) {
  const timestamp = now();
  const terminalAt =
    params.terminalAt === undefined
      ? isTerminalPrStatus(params.status)
        ? timestamp
        : null
      : params.terminalAt;
  await db
    .prepare(
      `INSERT INTO submission_prs
        (repo, number, head_repo, head_ref, head_sha, base_ref, installation_id, status, verdict, verdict_summary, last_delivery_id, next_review_at, attempt_count, last_error, last_check_summary, terminal_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(repo, number) DO UPDATE SET
        head_repo = COALESCE(excluded.head_repo, submission_prs.head_repo),
        head_ref = COALESCE(excluded.head_ref, submission_prs.head_ref),
        head_sha = COALESCE(excluded.head_sha, submission_prs.head_sha),
        base_ref = excluded.base_ref,
        installation_id = COALESCE(excluded.installation_id, submission_prs.installation_id),
        status = excluded.status,
        verdict = COALESCE(excluded.verdict, submission_prs.verdict),
        verdict_summary = COALESCE(excluded.verdict_summary, submission_prs.verdict_summary),
        last_delivery_id = COALESCE(excluded.last_delivery_id, submission_prs.last_delivery_id),
        next_review_at = excluded.next_review_at,
        attempt_count = CASE
          WHEN ? THEN submission_prs.attempt_count + 1
          ELSE submission_prs.attempt_count
        END,
        last_error = CASE
          WHEN excluded.last_error IS NOT NULL THEN excluded.last_error
          WHEN excluded.status IN ('queued', 'validation_pending', 'reviewing') THEN NULL
          ELSE submission_prs.last_error
        END,
        last_check_summary = COALESCE(excluded.last_check_summary, submission_prs.last_check_summary),
        terminal_at = CASE
          WHEN excluded.terminal_at IS NOT NULL THEN excluded.terminal_at
          ELSE submission_prs.terminal_at
        END,
        updated_at = excluded.updated_at`,
    )
    .bind(
      params.repo,
      params.number,
      params.headRepo ?? null,
      params.headRef ?? null,
      params.headSha ?? null,
      params.baseRef,
      params.installationId ?? null,
      params.status,
      params.verdict ?? null,
      params.verdictSummary ?? null,
      params.deliveryId ?? null,
      params.nextReviewAt ?? null,
      params.incrementAttempt ? 1 : 0,
      params.lastError ?? null,
      params.lastCheckSummary ?? null,
      terminalAt,
      timestamp,
      timestamp,
      params.incrementAttempt ? 1 : 0,
    )
    .run();
}

export async function getPrState(
  db: D1Database,
  params: { repo: string; number: number },
) {
  return db
    .prepare(
      `SELECT repo, number, head_repo AS headRepo, head_ref AS headRef,
        head_sha AS headSha, base_ref AS baseRef, installation_id AS installationId,
        status, verdict, verdict_summary AS verdictSummary,
        last_delivery_id AS lastDeliveryId, next_review_at AS nextReviewAt,
        attempt_count AS attemptCount, last_error AS lastError,
        last_check_summary AS lastCheckSummary, terminal_at AS terminalAt,
        last_notification_key AS lastNotificationKey,
        created_at AS createdAt, updated_at AS updatedAt
       FROM submission_prs
       WHERE repo = ? AND number = ?`,
    )
    .bind(params.repo, params.number)
    .first<Record<string, unknown>>();
}

export async function listDuePrStates(
  db: D1Database,
  params: {
    nowIso: string;
    staleBeforeIso: string;
    queuedStaleBeforeIso: string;
    reviewingStaleBeforeIso: string;
    limit?: number;
  },
) {
  return db
    .prepare(
      `SELECT repo, number, head_repo AS headRepo, head_ref AS headRef,
        head_sha AS headSha, base_ref AS baseRef, installation_id AS installationId,
        status, verdict, verdict_summary AS verdictSummary,
        last_delivery_id AS lastDeliveryId, next_review_at AS nextReviewAt,
        attempt_count AS attemptCount, last_error AS lastError,
        last_check_summary AS lastCheckSummary, terminal_at AS terminalAt,
        last_notification_key AS lastNotificationKey,
        created_at AS createdAt, updated_at AS updatedAt
       FROM submission_prs
       WHERE terminal_at IS NULL
         AND (
           (
             status IN ('validation_pending', 'merge_pending', 'error_retryable')
             AND (
               next_review_at IS NULL
               OR next_review_at <= ?
               OR updated_at <= ?
             )
           )
           OR (
             status = 'queued'
             AND updated_at <= ?
           )
           OR (
             status = 'reviewing'
             AND updated_at <= ?
           )
         )
       ORDER BY COALESCE(next_review_at, updated_at) ASC, updated_at ASC
       LIMIT ?`,
    )
    .bind(
      params.nowIso,
      params.staleBeforeIso,
      params.queuedStaleBeforeIso,
      params.reviewingStaleBeforeIso,
      params.limit ?? 25,
    )
    .all<Record<string, unknown>>();
}

export async function listRecentPrStates(
  db: D1Database,
  params: { limit?: number },
) {
  return db
    .prepare(
      `SELECT repo, number, head_repo AS headRepo, head_ref AS headRef,
        head_sha AS headSha, base_ref AS baseRef, installation_id AS installationId,
        status, verdict, verdict_summary AS verdictSummary,
        last_delivery_id AS lastDeliveryId, next_review_at AS nextReviewAt,
        attempt_count AS attemptCount, last_error AS lastError,
        last_check_summary AS lastCheckSummary, terminal_at AS terminalAt,
        last_notification_key AS lastNotificationKey,
        created_at AS createdAt, updated_at AS updatedAt
       FROM submission_prs
       ORDER BY updated_at DESC
       LIMIT ?`,
    )
    .bind(params.limit ?? 25)
    .all<Record<string, unknown>>();
}

export async function markPrNotificationSent(
  db: D1Database,
  params: { repo: string; number: number; notificationKey: string },
) {
  await db
    .prepare(
      `UPDATE submission_prs
       SET last_notification_key = ?, updated_at = ?
       WHERE repo = ? AND number = ?`,
    )
    .bind(params.notificationKey, now(), params.repo, params.number)
    .run();
}

export async function insertAudit(
  db: D1Database,
  params: {
    id: string;
    targetKey: string;
    eventType: string;
    decision?: string;
    summary?: string;
    r2Key?: string;
  },
) {
  await db
    .prepare(
      `INSERT INTO submission_audit
        (id, target_key, event_type, decision, summary, r2_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      params.id,
      params.targetKey,
      params.eventType,
      params.decision ?? null,
      params.summary ?? null,
      params.r2Key ?? null,
      now(),
    )
    .run();
}

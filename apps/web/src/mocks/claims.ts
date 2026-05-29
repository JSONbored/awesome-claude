export type ClaimType = "maintain" | "transfer" | "correct" | "remove";
export type ClaimState = "submitted" | "verifying" | "approved" | "returned";

export interface ClaimRecord {
  id: string;
  entryRef: string;
  entryTitle: string;
  type: ClaimType;
  state: ClaimState;
  submittedBy: string;
  submittedAt: string;
  reviewerNote?: string;
  proof: { kind: string; value: string; verified?: boolean }[];
}

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  maintain: "Maintain ownership",
  transfer: "Transfer to new maintainer",
  correct: "Correct metadata",
  remove: "Request removal",
};

export const CLAIM_STATE_META: Record<ClaimState, { label: string; tone: string }> = {
  submitted: { label: "Submitted", tone: "border-border bg-surface text-ink-muted" },
  verifying: { label: "Verifying", tone: "border-accent/40 bg-accent/15 text-ink" },
  approved: { label: "Approved", tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink" },
  returned: { label: "Returned", tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink" },
};

export const MY_CLAIMS: ClaimRecord[] = [
  {
    id: "C-118",
    entryRef: "mcp/postgres-mcp",
    entryTitle: "Postgres MCP",
    type: "maintain",
    state: "verifying",
    submittedBy: "wong2",
    submittedAt: "2026-05-26",
    reviewerNote: "GitHub identity confirmed; awaiting npm scope check.",
    proof: [
      { kind: "GitHub handle", value: "@wong2", verified: true },
      { kind: "Repo permission", value: "wong2/postgres-mcp · admin", verified: true },
      { kind: "npm scope", value: "@wong2/postgres-mcp" },
    ],
  },
  {
    id: "C-117",
    entryRef: "hooks/pre-edit-test",
    entryTitle: "Run tests before edits",
    type: "correct",
    state: "approved",
    submittedBy: "jzombie",
    submittedAt: "2026-05-24",
    reviewerNote: "Updated safety notes and command snippet.",
    proof: [
      { kind: "GitHub handle", value: "@jzombie", verified: true },
      { kind: "Signed commit", value: "9e1a…02 · verified", verified: true },
    ],
  },
  {
    id: "C-116",
    entryRef: "tools/legacy-cli",
    entryTitle: "Legacy CLI",
    type: "remove",
    state: "returned",
    submittedBy: "unknown",
    submittedAt: "2026-05-22",
    reviewerNote: "Proof of ownership did not resolve. Resubmit with a domain TXT record or signed commit.",
    proof: [{ kind: "External link", value: "https://example.com/legacy-cli-owner" }],
  },
];

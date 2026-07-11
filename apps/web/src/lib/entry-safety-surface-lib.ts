/**
 * Pure entry safety & privacy surface helpers.
 *
 * Turns an entry's declared `safetyNotes` / `privacyNotes` (today rendered as
 * flat note lists) into a categorized risk surface so a reader can see, at a
 * glance, what kinds of behavior the resource discloses — execution, network,
 * filesystem, credentials, permissions, data retention, telemetry, or
 * third-party handling — and how broadly those areas are covered. Purely
 * descriptive of the entry's own declared notes; no scoring of the resource.
 */

import type { Entry } from "@/types/registry";

export type SafetySurfaceSource = "safety" | "privacy";

export type SafetyRiskKind =
  | "execution"
  | "network"
  | "filesystem"
  | "credentials"
  | "permissions"
  | "retention"
  | "telemetry"
  | "third-party"
  | "general";

export type SafetySurfaceItem = {
  id: string;
  text: string;
  source: SafetySurfaceSource;
  kind: SafetyRiskKind;
  kindLabel: string;
};

export type SafetyKindSummary = {
  kind: SafetyRiskKind;
  kindLabel: string;
  count: number;
};

export type EntrySafetySurfaceState = {
  showPanel: boolean;
  heading: string;
  summary: string;
  items: SafetySurfaceItem[];
  kinds: SafetyKindSummary[];
  safetyCount: number;
  privacyCount: number;
  coverageCount: number;
  sensitiveKinds: SafetyRiskKind[];
  disclosure: string | null;
};

export const SAFETY_RISK_KIND_LABEL: Record<SafetyRiskKind, string> = {
  execution: "Execution & processes",
  network: "Network access",
  filesystem: "Local files",
  credentials: "Credentials & tokens",
  permissions: "Permissions & scopes",
  retention: "Data retention",
  telemetry: "Telemetry",
  "third-party": "Third-party handling",
  general: "General",
};

/** Kinds a reader should pay closer attention to when present. */
const SENSITIVE_KINDS: SafetyRiskKind[] = ["credentials", "permissions", "network", "third-party"];

const KIND_DISPLAY_ORDER: SafetyRiskKind[] = [
  "execution",
  "network",
  "filesystem",
  "credentials",
  "permissions",
  "retention",
  "telemetry",
  "third-party",
  "general",
];

/**
 * Classification precedence — first matching group wins. Ordered so the more
 * specific / higher-attention categories are matched before broad ones.
 */
const KIND_MATCHERS: Array<[SafetyRiskKind, string[]]> = [
  [
    "credentials",
    [
      "credential",
      "api key",
      "api-key",
      "apikey",
      "token",
      "secret",
      "password",
      "oauth",
      "access key",
      "private key",
      "session",
    ],
  ],
  [
    "permissions",
    [
      "permission",
      "scope",
      "grant",
      "role",
      "authoriz",
      "access control",
      "elevated",
      "sudo",
      "admin",
    ],
  ],
  [
    "network",
    [
      "network",
      "http",
      "request",
      "endpoint",
      "remote",
      "outbound",
      "connect to",
      "api call",
      "webhook",
      "download",
      "upload",
    ],
  ],
  [
    "third-party",
    [
      "third-party",
      "third party",
      "external service",
      "vendor",
      "shares data",
      "sends data",
      "sent to",
      "provider",
    ],
  ],
  [
    "filesystem",
    [
      "file",
      "filesystem",
      "disk",
      "directory",
      "folder",
      "write to",
      "read from",
      "local storage",
      "path",
    ],
  ],
  [
    "execution",
    [
      "execute",
      "run",
      "shell",
      "command",
      "script",
      "process",
      "background worker",
      "spawn",
      "install",
      "destructive",
    ],
  ],
  [
    "retention",
    ["retention", "retain", "stored", "store", "logged", "log", "history", "cache", "persist"],
  ],
  ["telemetry", ["telemetry", "analytics", "tracking", "usage data", "metrics", "report usage"]],
];

/** Classify a single note line into a risk kind. Deterministic, first-match-wins. */
export function classifySafetyNote(text: string): SafetyRiskKind {
  const value = text.toLowerCase();
  for (const [kind, needles] of KIND_MATCHERS) {
    if (needles.some((needle) => value.includes(needle))) {
      return kind;
    }
  }
  return "general";
}

function notesFor(single: string | undefined, list: string[] | undefined): string[] {
  const source = list && list.length > 0 ? list : single ? [single] : [];
  return source.map((line) => line.trim()).filter((line) => line.length > 0);
}

function buildSummary(
  safetyCount: number,
  privacyCount: number,
  coverageCount: number,
  sensitiveKinds: SafetyRiskKind[],
): string {
  const total = safetyCount + privacyCount;
  if (total === 0) {
    return "No safety or privacy behavior is declared for this resource.";
  }
  const parts: string[] = [];
  if (safetyCount > 0) {
    parts.push(`${safetyCount} safety`);
  }
  if (privacyCount > 0) {
    parts.push(`${privacyCount} privacy`);
  }
  let summary = `${parts.join(" and ")} note${total === 1 ? "" : "s"} across ${coverageCount} risk area${coverageCount === 1 ? "" : "s"}.`;
  if (sensitiveKinds.length > 0) {
    const labels = sensitiveKinds.map((kind) => SAFETY_RISK_KIND_LABEL[kind].toLowerCase());
    summary += ` Review closely: ${labels.join(", ")}.`;
  }
  return summary;
}

/**
 * Build the safety & privacy surface state for the detail page from an entry's
 * declared notes. Safety notes are listed before privacy notes; item ids are
 * stable within each source (`safety-1`, `privacy-1`, …).
 */
export function entrySafetySurfaceState(entry: Entry): EntrySafetySurfaceState {
  const safetyNotes = notesFor(entry.safetyNotes, entry.safetyNotesList);
  const privacyNotes = notesFor(entry.privacyNotes, entry.privacyNotesList);

  const items: SafetySurfaceItem[] = [
    ...safetyNotes.map((text, index) => {
      const kind = classifySafetyNote(text);
      return {
        id: `safety-${index + 1}`,
        text,
        source: "safety" as const,
        kind,
        kindLabel: SAFETY_RISK_KIND_LABEL[kind],
      };
    }),
    ...privacyNotes.map((text, index) => {
      const kind = classifySafetyNote(text);
      return {
        id: `privacy-${index + 1}`,
        text,
        source: "privacy" as const,
        kind,
        kindLabel: SAFETY_RISK_KIND_LABEL[kind],
      };
    }),
  ];

  const counts = new Map<SafetyRiskKind, number>();
  for (const item of items) {
    counts.set(item.kind, (counts.get(item.kind) ?? 0) + 1);
  }

  const kinds: SafetyKindSummary[] = KIND_DISPLAY_ORDER.filter((kind) => counts.has(kind)).map(
    (kind) => ({
      kind,
      kindLabel: SAFETY_RISK_KIND_LABEL[kind],
      count: counts.get(kind) ?? 0,
    }),
  );

  const sensitiveKinds = SENSITIVE_KINDS.filter((kind) => counts.has(kind));
  const coverageCount = kinds.length;
  const trimmedDisclosure = entry.disclosure?.trim();

  return {
    showPanel: items.length > 0,
    heading: "Safety & privacy surface",
    summary: buildSummary(safetyNotes.length, privacyNotes.length, coverageCount, sensitiveKinds),
    items,
    kinds,
    safetyCount: safetyNotes.length,
    privacyCount: privacyNotes.length,
    coverageCount,
    sensitiveKinds,
    disclosure: trimmedDisclosure ? trimmedDisclosure : null,
  };
}

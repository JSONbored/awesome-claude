import type { Alert, WatchTarget } from "@/lib/watch";
import { RELEASE_NOTES } from "@/mocks/changelog";

const SEED_BY_ENTRY: Array<Omit<Alert, "targetId">> = [
  {
    id: "seed-entry-integrity",
    kind: "entry",
    severity: "warning",
    title: "Checksum drift detected",
    body: "Upstream npm tag was re-published with a different SHA-256. Re-verify before re-installing.",
    href: "/quality#integrity",
    date: "2026-05-26",
  },
  {
    id: "seed-entry-policy",
    kind: "entry",
    severity: "info",
    title: "Safety notes were updated",
    body: "Maintainer clarified which paths the hook touches and added a privacy note.",
    date: "2026-05-22",
  },
];

const SEED_BY_VALIDATOR: Array<Omit<Alert, "targetId">> = [
  {
    id: "seed-validator-signed",
    kind: "validator",
    severity: "info",
    title: "New entries signed",
    body: "Three new entries were signed off this week.",
    href: "/validators",
    date: "2026-05-25",
  },
];

export function generateAlerts(targets: WatchTarget[]): Alert[] {
  const out: Alert[] = [];

  for (const t of targets) {
    if (t.kind === "changelog-stream") {
      const stream = t.id.replace("changelog:", "");
      const matches = RELEASE_NOTES.filter((n) => n.stream === stream).slice(0, 4);
      for (const n of matches) {
        out.push({
          id: `${t.id}:${n.date}:${n.title}`,
          targetId: t.id,
          kind: "changelog-stream",
          severity: n.stream === "security" ? "warning" : "info",
          title: n.title,
          body: n.body,
          href: n.href ?? "/changelog",
          date: n.date,
        });
      }
    } else if (t.kind === "entry") {
      for (const seed of SEED_BY_ENTRY) {
        out.push({ ...seed, id: `${t.id}:${seed.id}`, targetId: t.id });
      }
    } else if (t.kind === "validator") {
      for (const seed of SEED_BY_VALIDATOR) {
        out.push({ ...seed, id: `${t.id}:${seed.id}`, targetId: t.id });
      }
    } else if (t.kind === "integration") {
      out.push({
        id: `${t.id}:availability`,
        targetId: t.id,
        kind: "integration",
        severity: "info",
        title: `${t.label} status check`,
        body: "Latest health probe completed without errors.",
        href: t.href,
        date: "2026-05-26",
      });
    }
  }

  // newest first
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

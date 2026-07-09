// Pure conversion of a registry feed event into a watch Alert, split out of the
// watch provider so the target matching, action mapping and severity/copy
// selection can be unit-tested without React.

import type { Alert, WatchTarget } from "@/lib/watch-types-lib";
import { eventTargetId, type RegistryEvent } from "@/lib/watch-events-lib";

/**
 * Build the Alert a watched target should show for a registry event, or null
 * when the event does not belong to that target (or carries no date).
 */
export function eventToAlert(event: RegistryEvent, target: WatchTarget): Alert | null {
  const targetId = eventTargetId(event);
  if (!targetId || targetId !== target.id || !event.date) return null;
  const action =
    event.action === "removed" ? "removed" : event.action === "added" ? "added" : "updated";
  const label = event.title || target.label;
  return {
    id: event.id || `${target.id}:${event.date}:${action}`,
    targetId: target.id,
    kind: target.kind,
    title: `${label} ${action}`,
    body:
      action === "removed"
        ? "This watched registry entry was removed from the source content."
        : "This watched registry entry changed in the source content.",
    severity: action === "removed" ? "warning" : "info",
    href: target.href,
    date: event.date,
  };
}

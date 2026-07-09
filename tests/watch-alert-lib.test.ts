import { describe, expect, it } from "vitest";

import { eventToAlert } from "../apps/web/src/lib/watch-alert-lib";
import type { RegistryEvent } from "../apps/web/src/lib/watch-events-lib";
import type { WatchTarget } from "../apps/web/src/lib/watch-types-lib";

const target: WatchTarget = {
  id: "entry:agents/my-agent",
  kind: "entry",
  label: "My Agent",
  href: "/entry/agents/my-agent",
  addedAt: "2026-01-01",
};

const event = (over: Partial<RegistryEvent> = {}): RegistryEvent => ({
  kind: "entry",
  category: "agents",
  slug: "my-agent",
  date: "2026-02-02",
  ...over,
});

describe("eventToAlert", () => {
  it("returns null when the event is not for this target", () => {
    expect(eventToAlert(event({ slug: "other" }), target)).toBeNull();
    expect(eventToAlert(event({ kind: "changelog" }), target)).toBeNull();
  });

  it("returns null when the event has no date", () => {
    expect(eventToAlert(event({ date: undefined }), target)).toBeNull();
  });

  it("maps removed events to a warning with removal copy", () => {
    const alert = eventToAlert(event({ action: "removed" }), target);
    expect(alert?.severity).toBe("warning");
    expect(alert?.title).toBe("My Agent removed");
    expect(alert?.body).toContain("removed from the source content");
  });

  it("maps added and unknown actions to info alerts", () => {
    expect(eventToAlert(event({ action: "added" }), target)?.title).toBe(
      "My Agent added",
    );
    expect(eventToAlert(event({ action: "wat" }), target)?.title).toBe(
      "My Agent updated",
    );
    expect(eventToAlert(event(), target)?.severity).toBe("info");
  });

  it("prefers the event title over the target label", () => {
    expect(eventToAlert(event({ title: "Renamed" }), target)?.title).toBe(
      "Renamed updated",
    );
  });

  it("uses the event id when present, else a derived id", () => {
    expect(eventToAlert(event({ id: "evt-1" }), target)?.id).toBe("evt-1");
    expect(eventToAlert(event(), target)?.id).toBe(
      "entry:agents/my-agent:2026-02-02:updated",
    );
  });

  it("carries the target's kind/href and the event date through", () => {
    const alert = eventToAlert(event(), target);
    expect(alert?.kind).toBe("entry");
    expect(alert?.href).toBe("/entry/agents/my-agent");
    expect(alert?.targetId).toBe(target.id);
    expect(alert?.date).toBe("2026-02-02");
  });
});

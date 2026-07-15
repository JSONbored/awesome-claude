import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  detailMobileActionIds,
  detailSafetyGateMessage,
  entryDetailSuggestChangeUrl,
  resolveDetailCommunityAnchors,
  resolveDetailMobileActions,
  resolveDetailQuickLinks,
  resolveDetailReadinessItems,
  shouldElevateDetailSafetyGate,
} from "@/lib/entry-detail-command-center-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
    slug: "fixture",
    title: "Fixture Skill",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("entry detail command center lib", () => {
  it("builds readiness rows from trust metadata", () => {
    expect(
      resolveDetailReadinessItems(entry({ trust: "trusted", reviewed: true })),
    ).toEqual([
      { id: "trust", label: "Trust", value: "Trusted", ok: true },
      { id: "source", label: "Source", value: "unverified", ok: false },
      { id: "safety", label: "Safety notes", value: "Missing", ok: false },
      { id: "reviewed", label: "Reviewed", value: "Yes", ok: true },
    ]);
  });

  it("orders quick links with docs and source before registry helpers", () => {
    const links = resolveDetailQuickLinks(
      entry({
        docsUrl: "https://example.com/docs",
        sourceUrl: "https://github.com/example/repo",
      }),
    );
    expect(links.map((link) => link.id)).toEqual(["docs", "source", "browse"]);
    expect(links[0]).toMatchObject({ external: true });
    expect(links[2]).toMatchObject({ href: "/browse", external: false });
  });

  it("builds a GitHub issue URL for suggest-change actions", () => {
    const url = entryDetailSuggestChangeUrl(
      entry({ title: "Fixture Skill" }),
      "https://heyclau.de/entry/skills/fixture",
      "https://github.com/JSONbored/awesome-claude",
    );
    expect(url).toContain("/issues/new?");
    expect(url).toContain(encodeURIComponent("Suggest change: Fixture Skill"));
    expect(url).toContain(encodeURIComponent("skills/fixture"));
  });

  it("surfaces install, copy, source, and suggest actions on mobile", () => {
    const actions = resolveDetailMobileActions(
      entry({
        installCommand: "npm i fixture",
        sourceUrl: "https://github.com/example/repo",
      }),
      "npm i fixture",
      "https://heyclau.de/entry/skills/fixture",
      "https://github.com/JSONbored/awesome-claude",
    );
    expect(detailMobileActionIds(actions)).toEqual([
      "install",
      "copy",
      "llms",
      "source",
      "suggest",
      "claim",
    ]);
    expect(actions[0]).toMatchObject({ kind: "scroll", primary: true });
    expect(actions[1]).toMatchObject({
      kind: "copy",
      copyValue: "npm i fixture",
    });
  });

  it("omits copy and claim actions when payload or claim state is absent", () => {
    const actions = resolveDetailMobileActions(
      entry({ claimed: true }),
      undefined,
      "https://heyclau.de/entry/skills/fixture",
      "https://github.com/JSONbored/awesome-claude",
    );
    expect(detailMobileActionIds(actions)).toEqual([
      "install",
      "llms",
      "suggest",
    ]);
  });

  it("elevates the safety gate for risky or note-missing installable entries", () => {
    expect(shouldElevateDetailSafetyGate("high", entry())).toBe(true);
    expect(
      shouldElevateDetailSafetyGate(
        "low",
        entry({ installCommand: "npm i fixture" }),
      ),
    ).toBe(true);
    expect(
      shouldElevateDetailSafetyGate(
        "low",
        entry({
          installCommand: "npm i fixture",
          safetyNotes: "Read carefully",
          privacyNotes: "No telemetry",
        }),
      ),
    ).toBe(false);
  });

  it("returns contextual safety gate copy", () => {
    expect(detailSafetyGateMessage("high", entry())).toContain(
      "High install risk",
    );
    expect(
      detailSafetyGateMessage(
        "low",
        entry({ installCommand: "npm i fixture" }),
      ),
    ).toContain("Missing safety and privacy notes");
    expect(
      detailSafetyGateMessage(
        "review",
        entry({
          safetyNotes: "ok",
          privacyNotes: "ok",
          installCommand: "npm i fixture",
        }),
      ),
    ).toContain("Review safety and privacy notes");
  });

  it("builds community anchor links without overwhelming empty pages", () => {
    expect(resolveDetailCommunityAnchors(0, 0, false)).toEqual([]);
    expect(resolveDetailCommunityAnchors(3, 2, true)).toEqual([
      {
        id: "related",
        label: "Related entries",
        targetId: "related",
        count: 3,
      },
      { id: "guides", label: "Related guides", targetId: "guides", count: 2 },
      { id: "signals", label: "Community signals", targetId: "signals" },
    ]);
  });

  it("keeps browse as the only quick link when docs and source are absent", () => {
    expect(resolveDetailQuickLinks(entry()).map((link) => link.id)).toEqual([
      "browse",
    ]);
  });

  it("treats list-only safety and privacy notes as present for the safety gate", () => {
    const installable = entry({ installCommand: "npm i fixture" });
    expect(
      shouldElevateDetailSafetyGate(
        "low",
        entry({
          ...installable,
          safetyNotesList: ["Runs locally"],
          privacyNotesList: ["No telemetry"],
        }),
      ),
    ).toBe(false);
    expect(
      detailSafetyGateMessage(
        "low",
        entry({ ...installable, safetyNotesList: ["Runs locally"] }),
      ),
    ).toContain("Missing privacy notes");
    expect(
      detailSafetyGateMessage(
        "low",
        entry({ ...installable, privacyNotesList: ["No telemetry"] }),
      ),
    ).toContain("Missing safety notes");
  });

  it("does not elevate low-risk entries without install payloads", () => {
    expect(shouldElevateDetailSafetyGate("low", entry())).toBe(false);
    expect(detailSafetyGateMessage("low", entry())).toBeNull();
  });

  it("falls back to generic trust review copy when notes exist but risk still elevates", () => {
    expect(
      detailSafetyGateMessage(
        "review",
        entry({
          installCommand: "npm i fixture",
          safetyNotes: "ok",
          privacyNotes: "ok",
        }),
      ),
    ).toContain("Review safety and privacy notes");
  });

  it("builds partial community anchors when only one section has content", () => {
    expect(resolveDetailCommunityAnchors(2, 0, false)).toEqual([
      {
        id: "related",
        label: "Related entries",
        targetId: "related",
        count: 2,
      },
    ]);
    expect(resolveDetailCommunityAnchors(0, 1, true)).toEqual([
      { id: "guides", label: "Related guides", targetId: "guides", count: 1 },
      { id: "signals", label: "Community signals", targetId: "signals" },
    ]);
  });
});

import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  PREREQUISITE_KIND_LABEL,
  classifyPrerequisite,
  entryPrerequisiteReadinessState,
} from "@/lib/entry-prerequisite-readiness-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "tools",
    slug: "fixture",
    title: "Fixture",
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

describe("classifyPrerequisite", () => {
  it("routes account and credential phrasing to account", () => {
    expect(classifyPrerequisite("Create an account and API key")).toBe(
      "account",
    );
    expect(classifyPrerequisite("OAuth credentials for the workspace")).toBe(
      "account",
    );
  });

  it("prefers review over permission when both appear", () => {
    expect(
      classifyPrerequisite("Review policy for which flows are permitted"),
    ).toBe("review");
  });

  it("classifies permission, network, install, and config lines", () => {
    expect(classifyPrerequisite("Grant the required scopes and roles")).toBe(
      "permission",
    );
    expect(classifyPrerequisite("Open the firewall port for ingress")).toBe(
      "network",
    );
    expect(classifyPrerequisite("Install via Docker or npm")).toBe("install");
    expect(
      classifyPrerequisite("Set the endpoint and environment variables"),
    ).toBe("config");
  });

  it("falls back to general for unmatched lines", () => {
    expect(classifyPrerequisite("A modern web browser")).toBe("general");
  });

  it("is case-insensitive", () => {
    expect(classifyPrerequisite("INSTALL DOCKER")).toBe("install");
  });

  it("exposes a label for every kind", () => {
    for (const kind of [
      "account",
      "install",
      "config",
      "permission",
      "network",
      "review",
      "general",
    ] as const) {
      expect(PREREQUISITE_KIND_LABEL[kind]).toBeTruthy();
    }
  });
});

describe("entryPrerequisiteReadinessState", () => {
  it("hides the panel when there are no prerequisites", () => {
    const state = entryPrerequisiteReadinessState(entry({ prerequisites: [] }));
    expect(state.showPanel).toBe(false);
    expect(state.total).toBe(0);
    expect(state.summary).toContain("No prerequisites");
  });

  it("hides the panel when prerequisites is undefined", () => {
    const state = entryPrerequisiteReadinessState(entry());
    expect(state.showPanel).toBe(false);
    expect(state.steps).toEqual([]);
  });

  it("ignores blank lines and assigns stable ids", () => {
    const state = entryPrerequisiteReadinessState(
      entry({
        prerequisites: ["  Create an account  ", "   ", "Install the CLI"],
      }),
    );
    expect(state.total).toBe(2);
    expect(state.steps.map((step) => step.id)).toEqual([
      "prereq-1",
      "prereq-2",
    ]);
    expect(state.steps[0]?.label).toBe("Create an account");
  });

  it("builds a categorized checklist with kind summary counts", () => {
    const state = entryPrerequisiteReadinessState(
      entry({
        prerequisites: [
          "Create an account and API key",
          "Install the runtime via Docker",
          "Configure the endpoint in your .env",
          "Review approval policy with your security team",
        ],
      }),
    );
    expect(state.showPanel).toBe(true);
    expect(state.total).toBe(4);
    expect(state.steps.map((step) => step.kind)).toEqual([
      "account",
      "install",
      "config",
      "review",
    ]);
    // display order groups account -> install -> config -> review
    expect(state.kinds.map((kind) => kind.kind)).toEqual([
      "account",
      "install",
      "config",
      "review",
    ]);
    expect(state.kinds.every((kind) => kind.count === 1)).toBe(true);
    expect(state.hasCredentialStep).toBe(true);
    expect(state.hasReviewStep).toBe(true);
    expect(state.summary).toContain("credentials");
    expect(state.summary).toContain("review");
  });

  it("collapses duplicate kinds into a single summary entry with counts", () => {
    const state = entryPrerequisiteReadinessState(
      entry({
        prerequisites: ["Create an account", "Get an API token"],
      }),
    );
    expect(state.kinds).toHaveLength(1);
    expect(state.kinds[0]).toMatchObject({ kind: "account", count: 2 });
    expect(state.hasReviewStep).toBe(false);
  });

  it("surfaces setup time when present and null otherwise", () => {
    const withTime = entryPrerequisiteReadinessState(
      entry({
        prerequisites: ["Create an account"],
        estimatedSetupTime: "~15 minutes",
      }),
    );
    expect(withTime.setupTime).toBe("~15 minutes");

    const noTime = entryPrerequisiteReadinessState(
      entry({ prerequisites: ["Create an account"] }),
    );
    expect(noTime.setupTime).toBeNull();
  });

  it("uses singular wording for a single prerequisite", () => {
    const state = entryPrerequisiteReadinessState(
      entry({ prerequisites: ["A modern web browser"] }),
    );
    expect(state.summary).toContain("1 prerequisite to line up");
    expect(state.summary).not.toContain("prerequisites to line up");
  });
});

import { describe, expect, it } from "vitest";

import {
  buildSubmissionFieldModel,
  SUBMISSION_SPEC_SCHEMA_VERSION,
} from "@heyclaude/registry/submission-spec";

// Categories whose submission form must collect a runtime config snippet.
const CONFIG_SNIPPET_CATEGORIES = ["mcp", "hooks", "statuslines"];
// Categories that execute, install, or carry permissions and therefore must
// disclose structured safety/privacy notes at submission time.
const RISK_BEARING_CATEGORIES = [
  "mcp",
  "hooks",
  "statuslines",
  "commands",
  "skills",
];

const fieldIds = (category: string) =>
  buildSubmissionFieldModel(category)?.fields.map((field) => field.id) ?? [];

describe("buildSubmissionFieldModel", () => {
  it("returns null for an unknown category", () => {
    // Unknown categories have no spec entry, so the model is intentionally null
    // rather than an empty/partial form.
    expect(buildSubmissionFieldModel("nonexistent")).toBeNull();
  });

  it("returns a versioned model with category metadata and fields", () => {
    const model = buildSubmissionFieldModel("agents");
    expect(model).not.toBeNull();
    // Schema version is pinned so consumers can detect form-shape changes.
    expect(model!.schemaVersion).toBe(SUBMISSION_SPEC_SCHEMA_VERSION);
    expect(model!.category).toBe("agents");
    expect(typeof model!.label).toBe("string");
    expect(typeof model!.description).toBe("string");
    expect(model).toHaveProperty("template");
    expect(model!.fields.length).toBeGreaterThan(0);
  });

  it("adds a config_snippet field only for config-bearing categories", () => {
    // mcp/hooks/statuslines install via a config snippet; other categories must
    // not surface that field so submitters aren't asked for irrelevant data.
    for (const category of CONFIG_SNIPPET_CATEGORIES) {
      expect(fieldIds(category)).toContain("config_snippet");
    }
    for (const category of ["agents", "commands", "skills"]) {
      expect(fieldIds(category)).not.toContain("config_snippet");
    }
  });

  it("adds safety/privacy notes for risk-bearing categories but not for agents", () => {
    // Risk-bearing categories must disclose execution/permission and data-access
    // behavior; agents are content-only and therefore omit both note fields.
    for (const category of RISK_BEARING_CATEGORIES) {
      const ids = fieldIds(category);
      expect(ids).toContain("safety_notes");
      expect(ids).toContain("privacy_notes");
    }
    const agentIds = fieldIds("agents");
    expect(agentIds).not.toContain("safety_notes");
    expect(agentIds).not.toContain("privacy_notes");
  });

  it("includes skill-specific packaging fields for the skills category", () => {
    // Skills ship a downloadable package, so the form collects install/download
    // and copyable-content provenance fields unique to that category.
    const ids = fieldIds("skills");
    expect(ids).toEqual(
      expect.arrayContaining([
        "install_command",
        "download_url",
        "full_copyable_content",
        "retrieval_sources",
        "tested_platforms",
      ]),
    );
  });

  it("does not emit duplicate field ids and marks safety notes as required", () => {
    const skills = buildSubmissionFieldModel("skills")!;
    const ids = skills.fields.map((field) => field.id);
    // Field ids feed React keys and server-side validation, so they must be
    // unique even though several rule paths can request the same field.
    expect(ids.length).toBe(new Set(ids).size);

    const safety = skills.fields.find((field) => field.id === "safety_notes");
    expect(safety?.required).toBe(true);
  });
});

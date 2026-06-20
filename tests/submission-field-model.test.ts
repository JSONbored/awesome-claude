import { describe, expect, it } from "vitest";

import {
  buildSubmissionFieldModel,
  SUBMISSION_SPEC_SCHEMA_VERSION,
} from "@heyclaude/registry/submission-spec";

const fieldIds = (category: string) =>
  buildSubmissionFieldModel(category)?.fields.map((field) => field.id) ?? [];

describe("buildSubmissionFieldModel", () => {
  it("returns null for an unknown category", () => {
    expect(buildSubmissionFieldModel("nonexistent")).toBeNull();
  });

  it("returns a versioned model with category metadata and fields", () => {
    const model = buildSubmissionFieldModel("agents");
    expect(model).not.toBeNull();
    expect(model!.schemaVersion).toBe(SUBMISSION_SPEC_SCHEMA_VERSION);
    expect(model!.category).toBe("agents");
    expect(typeof model!.label).toBe("string");
    expect(typeof model!.description).toBe("string");
    expect(model).toHaveProperty("template");
    expect(model!.fields.length).toBeGreaterThan(0);
  });

  it("adds a config_snippet field only for config-bearing categories", () => {
    for (const category of ["mcp", "hooks", "statuslines"]) {
      expect(fieldIds(category)).toContain("config_snippet");
    }
    for (const category of ["agents", "commands", "skills"]) {
      expect(fieldIds(category)).not.toContain("config_snippet");
    }
  });

  it("adds safety/privacy notes for risk-bearing categories but not for agents", () => {
    for (const category of [
      "mcp",
      "hooks",
      "statuslines",
      "commands",
      "skills",
    ]) {
      const ids = fieldIds(category);
      expect(ids).toContain("safety_notes");
      expect(ids).toContain("privacy_notes");
    }
    const agentIds = fieldIds("agents");
    expect(agentIds).not.toContain("safety_notes");
    expect(agentIds).not.toContain("privacy_notes");
  });

  it("includes skill-specific packaging fields for the skills category", () => {
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
    expect(ids.length).toBe(new Set(ids).size);

    const safety = skills.fields.find((field) => field.id === "safety_notes");
    expect(safety?.required).toBe(true);
  });
});

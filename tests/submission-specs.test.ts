import { describe, expect, it } from "vitest";

import {
  buildSubmissionSpecs,
  SUBMISSION_SPEC_SCHEMA_VERSION,
} from "@heyclaude/registry/submission-spec";

describe("buildSubmissionSpecs", () => {
  it("returns a versioned spec with a field model for every submission category", () => {
    const specs = buildSubmissionSpecs();
    expect(specs.schemaVersion).toBe(SUBMISSION_SPEC_SCHEMA_VERSION);
    expect(Object.keys(specs.categories).length).toBeGreaterThan(0);
    for (const model of Object.values(specs.categories)) {
      expect(model).not.toBeNull();
      expect(Array.isArray(model!.fields)).toBe(true);
    }
  });

  it("describes the fork-PR intake mode and gate base ref", () => {
    const { prIntake } = buildSubmissionSpecs();
    expect(prIntake.mode).toBe("github_app_user_fork_pr");
    expect(prIntake.contentGateBaseRef).toBe("main");
  });

  it("omits submitUrl when no origin is provided", () => {
    const { prIntake } = buildSubmissionSpecs();
    expect(prIntake).not.toHaveProperty("submitUrl");
  });

  it("derives the submit URL from siteUrl or origin", () => {
    expect(
      buildSubmissionSpecs({ siteUrl: "https://heyclau.de" }).prIntake
        .submitUrl,
    ).toBe("https://heyclau.de/submit");
    expect(
      buildSubmissionSpecs({ origin: "https://example.com" }).prIntake
        .submitUrl,
    ).toBe("https://example.com/submit");
  });

  it("rejects non-http(s) origins instead of emitting an unsafe submit URL", () => {
    const { prIntake } = buildSubmissionSpecs({ siteUrl: "ftp://bad.example" });
    expect(prIntake).not.toHaveProperty("submitUrl");
  });
});

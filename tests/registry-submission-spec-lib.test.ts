import { describe, expect, it } from "vitest";

import categorySpec from "../packages/registry/src/category-spec.json" with { type: "json" };

import {
  SUBMISSION_SPEC_SCHEMA_VERSION,
  RISK_BEARING_SUBMISSION_CATEGORIES,
  BASE_FIELDS,
  FIELD_LIBRARY,
  OPTIONAL_FIELDS,
  fieldFor,
  buildSubmissionFieldModel,
  submitUrlForOrigin,
  buildSubmissionSpecs,
} from "../packages/registry/src/submission-spec-lib.js";

function fieldIds(
  model: NonNullable<ReturnType<typeof buildSubmissionFieldModel>>,
) {
  return model.fields.map((field) => field.id);
}

function requiredIds(
  model: NonNullable<ReturnType<typeof buildSubmissionFieldModel>>,
) {
  return model.fields
    .filter((field) => field.required)
    .map((field) => field.id);
}

describe("constants", () => {
  it("exposes schema version and risk-bearing categories", () => {
    expect(SUBMISSION_SPEC_SCHEMA_VERSION).toBe(3);
    expect([...RISK_BEARING_SUBMISSION_CATEGORIES].sort()).toEqual([
      "commands",
      "hooks",
      "mcp",
      "skills",
      "statuslines",
    ]);
  });

  it("exposes base, library, and optional field definitions", () => {
    expect(BASE_FIELDS.some((field) => field.id === "name")).toBe(true);
    expect(BASE_FIELDS.some((field) => field.id === "description")).toBe(true);
    expect(FIELD_LIBRARY.install_command?.required).toBe(true);
    expect(FIELD_LIBRARY.trigger?.options).toContain("PreToolUse");
    expect(OPTIONAL_FIELDS.some((field) => field.id === "safety_notes")).toBe(
      true,
    );
    expect(OPTIONAL_FIELDS.some((field) => field.id === "privacy_notes")).toBe(
      true,
    );
  });
});

describe("fieldFor", () => {
  it("returns library fields with required overrides", () => {
    expect(fieldFor("install_command", true)).toMatchObject({
      id: "install_command",
      label: "Install command",
      required: true,
    });
    expect(fieldFor("install_command", false).required).toBe(false);
  });

  it("returns optional fields from the optional library", () => {
    expect(fieldFor("config_snippet", true)).toMatchObject({
      id: "config_snippet",
      type: "textarea",
      required: true,
    });
  });

  it("falls back to a generated text field for unknown ids", () => {
    expect(fieldFor("custom_field_name", false)).toEqual({
      id: "custom_field_name",
      label: "custom field name",
      type: "text",
      required: false,
    });
  });
});

describe("submitUrlForOrigin", () => {
  it("builds https submit urls from site origins", () => {
    expect(submitUrlForOrigin("https://heyclau.de")).toBe(
      "https://heyclau.de/submit",
    );
    expect(submitUrlForOrigin("https://example.com/path")).toBe(
      "https://example.com/submit",
    );
    expect(submitUrlForOrigin("http://localhost:3000")).toBe(
      "http://localhost:3000/submit",
    );
  });

  it("rejects empty, invalid, and non-http(s) origins", () => {
    expect(submitUrlForOrigin("")).toBe("");
    expect(submitUrlForOrigin("not-a-url")).toBe("");
    expect(submitUrlForOrigin("ftp://bad.example")).toBe("");
    expect(submitUrlForOrigin("javascript:alert(1)")).toBe("");
  });
});

describe("buildSubmissionFieldModel", () => {
  it("returns null for unknown categories", () => {
    expect(buildSubmissionFieldModel("unknown")).toBeNull();
    expect(buildSubmissionFieldModel("")).toBeNull();
  });

  it("includes common required base fields for every submission category", () => {
    for (const category of categorySpec.submissionOrder) {
      const model = buildSubmissionFieldModel(category);
      expect(model, category).not.toBeNull();
      for (const id of categorySpec.commonIssueRequiredFields) {
        expect(requiredIds(model!), id).toContain(id);
      }
      expect(model!.schemaVersion).toBe(SUBMISSION_SPEC_SCHEMA_VERSION);
      expect(model!.label).toBe(categorySpec.categories[category].label);
      expect(model!.description).toBe(
        categorySpec.categories[category].description,
      );
    }
  });

  it("marks category-specific submission fields as required", () => {
    expect(requiredIds(buildSubmissionFieldModel("agents")!)).toContain(
      "full_copyable_content",
    );
    expect(requiredIds(buildSubmissionFieldModel("rules")!)).toContain(
      "full_copyable_content",
    );
    expect(requiredIds(buildSubmissionFieldModel("mcp")!)).toEqual(
      expect.arrayContaining(["install_command", "usage_snippet"]),
    );
    expect(requiredIds(buildSubmissionFieldModel("skills")!)).toEqual(
      expect.arrayContaining([
        "usage_snippet",
        "skill_type",
        "skill_level",
        "verification_status",
      ]),
    );
    expect(requiredIds(buildSubmissionFieldModel("commands")!)).toEqual(
      expect.arrayContaining([
        "command_syntax",
        "usage_snippet",
        "full_copyable_content",
      ]),
    );
    expect(requiredIds(buildSubmissionFieldModel("hooks")!)).toEqual(
      expect.arrayContaining([
        "trigger",
        "usage_snippet",
        "full_copyable_content",
      ]),
    );
    expect(requiredIds(buildSubmissionFieldModel("guides")!)).toContain(
      "guide_content",
    );
    expect(requiredIds(buildSubmissionFieldModel("collections")!)).toContain(
      "items",
    );
    expect(requiredIds(buildSubmissionFieldModel("statuslines")!)).toEqual(
      expect.arrayContaining([
        "script_language",
        "usage_snippet",
        "full_copyable_content",
      ]),
    );
  });

  it("requires safety and privacy notes for risk-bearing categories", () => {
    for (const category of RISK_BEARING_SUBMISSION_CATEGORIES) {
      const model = buildSubmissionFieldModel(category);
      expect(requiredIds(model!), category).toEqual(
        expect.arrayContaining(["safety_notes", "privacy_notes"]),
      );
    }
  });

  it("does not require safety and privacy notes for non-risk categories", () => {
    for (const category of ["agents", "rules", "guides", "collections"]) {
      const model = buildSubmissionFieldModel(category);
      expect(requiredIds(model!), category).not.toContain("safety_notes");
      expect(requiredIds(model!), category).not.toContain("privacy_notes");
    }
  });

  it("adds skill-specific optional fields", () => {
    const ids = fieldIds(buildSubmissionFieldModel("skills")!);
    expect(ids).toEqual(
      expect.arrayContaining([
        "install_command",
        "download_url",
        "full_copyable_content",
        "retrieval_sources",
        "tested_platforms",
      ]),
    );
    expect(requiredIds(buildSubmissionFieldModel("skills")!)).not.toContain(
      "install_command",
    );
  });

  it("adds config snippets for mcp, hooks, and statuslines", () => {
    for (const category of ["mcp", "hooks", "statuslines"]) {
      expect(fieldIds(buildSubmissionFieldModel(category)!)).toContain(
        "config_snippet",
      );
      expect(requiredIds(buildSubmissionFieldModel(category)!)).not.toContain(
        "config_snippet",
      );
    }
  });

  it("deduplicates field ids while preserving first occurrence order", () => {
    const model = buildSubmissionFieldModel("skills")!;
    const ids = fieldIds(model);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.indexOf("name")).toBeLessThan(ids.indexOf("usage_snippet"));
    expect(ids.indexOf("usage_snippet")).toBeLessThan(
      ids.indexOf("install_command"),
    );
  });

  it("uses base field metadata for shared ids", () => {
    const model = buildSubmissionFieldModel("mcp")!;
    const name = model.fields.find((field) => field.id === "name");
    const install = model.fields.find(
      (field) => field.id === "install_command",
    );
    expect(name?.label).toBe("Name");
    expect(name?.type).toBe("text");
    expect(install?.label).toBe("Install command");
  });

  it("exposes select options for skill and hook fields", () => {
    const skills = buildSubmissionFieldModel("skills")!;
    expect(
      skills.fields.find((field) => field.id === "skill_type")?.options,
    ).toEqual(categorySpec.skillTypeValues);
    expect(
      skills.fields.find((field) => field.id === "skill_level")?.options,
    ).toEqual(categorySpec.skillLevelValues);
    expect(
      skills.fields.find((field) => field.id === "verification_status")
        ?.options,
    ).toEqual(categorySpec.verificationStatusValues);

    const hooks = buildSubmissionFieldModel("hooks")!;
    expect(
      hooks.fields.find((field) => field.id === "trigger")?.options,
    ).toContain("SessionStart");
  });

  it("keeps optional github and brand fields available but not required", () => {
    const model = buildSubmissionFieldModel("agents")!;
    expect(fieldIds(model)).toEqual(
      expect.arrayContaining(["github_url", "brand_name", "brand_domain"]),
    );
    expect(requiredIds(model)).not.toContain("github_url");
    expect(requiredIds(model)).not.toContain("brand_name");
  });
});

describe("buildSubmissionSpecs", () => {
  it("returns a versioned spec with a model for every submission category", () => {
    const specs = buildSubmissionSpecs();
    expect(specs.schemaVersion).toBe(SUBMISSION_SPEC_SCHEMA_VERSION);
    expect(Object.keys(specs.categories).sort()).toEqual(
      [...categorySpec.submissionOrder].sort(),
    );
    for (const category of categorySpec.submissionOrder) {
      expect(specs.categories[category]).not.toBeNull();
      expect(specs.categories[category]!.fields.length).toBeGreaterThan(0);
    }
  });

  it("describes fork-PR intake and optional submit urls", () => {
    expect(buildSubmissionSpecs().prIntake).toEqual({
      mode: "github_app_user_fork_pr",
      contentGateBaseRef: "main",
    });
    expect(
      buildSubmissionSpecs({ siteUrl: "https://heyclau.de" }).prIntake,
    ).toEqual({
      mode: "github_app_user_fork_pr",
      submitUrl: "https://heyclau.de/submit",
      contentGateBaseRef: "main",
    });
    expect(
      buildSubmissionSpecs({ origin: "https://example.com" }).prIntake
        .submitUrl,
    ).toBe("https://example.com/submit");
  });

  it("omits submitUrl for invalid origins", () => {
    expect(
      buildSubmissionSpecs({ siteUrl: "ftp://bad.example" }).prIntake,
    ).not.toHaveProperty("submitUrl");
    expect(buildSubmissionSpecs({ siteUrl: "" }).prIntake).not.toHaveProperty(
      "submitUrl",
    );
  });

  it("prefers siteUrl over origin when both are provided", () => {
    expect(
      buildSubmissionSpecs({
        siteUrl: "https://heyclau.de",
        origin: "https://example.com",
      }).prIntake.submitUrl,
    ).toBe("https://heyclau.de/submit");
  });
});

describe("category field coverage matrix", () => {
  const cases: Array<{
    category: string;
    mustInclude: string[];
    mustRequire: string[];
  }> = [
    {
      category: "agents",
      mustInclude: ["full_copyable_content"],
      mustRequire: ["full_copyable_content"],
    },
    {
      category: "rules",
      mustInclude: ["full_copyable_content"],
      mustRequire: ["full_copyable_content"],
    },
    {
      category: "mcp",
      mustInclude: [
        "install_command",
        "usage_snippet",
        "config_snippet",
        "safety_notes",
        "privacy_notes",
      ],
      mustRequire: [
        "install_command",
        "usage_snippet",
        "safety_notes",
        "privacy_notes",
      ],
    },
    {
      category: "skills",
      mustInclude: [
        "usage_snippet",
        "skill_type",
        "skill_level",
        "verification_status",
        "install_command",
        "download_url",
        "retrieval_sources",
        "tested_platforms",
      ],
      mustRequire: [
        "usage_snippet",
        "skill_type",
        "skill_level",
        "verification_status",
        "safety_notes",
        "privacy_notes",
      ],
    },
    {
      category: "hooks",
      mustInclude: [
        "trigger",
        "usage_snippet",
        "full_copyable_content",
        "config_snippet",
      ],
      mustRequire: [
        "trigger",
        "usage_snippet",
        "full_copyable_content",
        "safety_notes",
        "privacy_notes",
      ],
    },
    {
      category: "commands",
      mustInclude: ["command_syntax", "usage_snippet", "full_copyable_content"],
      mustRequire: [
        "command_syntax",
        "usage_snippet",
        "full_copyable_content",
        "safety_notes",
        "privacy_notes",
      ],
    },
    {
      category: "statuslines",
      mustInclude: [
        "script_language",
        "usage_snippet",
        "full_copyable_content",
        "config_snippet",
      ],
      mustRequire: [
        "script_language",
        "usage_snippet",
        "full_copyable_content",
        "safety_notes",
        "privacy_notes",
      ],
    },
    {
      category: "collections",
      mustInclude: ["items"],
      mustRequire: ["items"],
    },
    {
      category: "guides",
      mustInclude: ["guide_content"],
      mustRequire: ["guide_content"],
    },
  ];

  for (const { category, mustInclude, mustRequire } of cases) {
    it(`covers ${category} submission fields`, () => {
      const model = buildSubmissionFieldModel(category)!;
      expect(fieldIds(model)).toEqual(expect.arrayContaining(mustInclude));
      expect(requiredIds(model)).toEqual(expect.arrayContaining(mustRequire));
    });
  }
});

describe("field help text and render hints", () => {
  it("marks markdown render fields in the library", () => {
    expect(FIELD_LIBRARY.full_copyable_content.render).toBe("markdown");
    expect(FIELD_LIBRARY.usage_snippet.render).toBe("markdown");
    expect(FIELD_LIBRARY.guide_content.render).toBe("markdown");
    expect(
      OPTIONAL_FIELDS.find((field) => field.id === "config_snippet")?.render,
    ).toBe("markdown");
  });

  it("documents safety and privacy note limits", () => {
    const safety = OPTIONAL_FIELDS.find((field) => field.id === "safety_notes");
    const privacy = OPTIONAL_FIELDS.find(
      (field) => field.id === "privacy_notes",
    );
    expect(safety?.helpText).toContain("risk-bearing");
    expect(privacy?.helpText).toContain("risk-bearing");
    expect(safety?.placeholder).toContain("permissions");
    expect(privacy?.placeholder).toContain("telemetry");
  });

  it("warns against using download_url for local hosting", () => {
    const download = OPTIONAL_FIELDS.find(
      (field) => field.id === "download_url",
    );
    expect(download?.helpText).toContain("Community submissions");
    expect(download?.helpText).toContain("/downloads");
  });
});

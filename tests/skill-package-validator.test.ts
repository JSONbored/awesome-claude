import { describe, expect, it } from "vitest";

import { validateSkillPackageFiles } from "@/lib/skill-package-validator";
import { validateSubmission } from "@heyclaude/registry/submission";

describe("skill package validator", () => {
  it("accepts a review-ready Agent Skill package shape", () => {
    const result = validateSkillPackageFiles({
      githubUrl: "https://github.com/JSONbored/awesome-claude",
      siteUrl: "https://heyclau.de",
      packageSha256: "a".repeat(64),
      files: [
        {
          path: "sample-skill/SKILL.md",
          size: 220,
          text: `---
name: Sample Skill
description: Validate packages before submitting them to the HeyClaude registry.
---

# Sample Skill

Use the helper in \`scripts/check.sh\` before submitting.
`,
        },
        {
          path: "sample-skill/scripts/check.sh",
          size: 20,
          text: "#!/usr/bin/env bash\n",
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.entrypoint).toBe("sample-skill/SKILL.md");
    expect(result.slug).toBe("sample-skill");
    expect(result.submissionUrl).toContain("https://heyclau.de/submit?");
    expect(result.pullRequestUrl).toBe(result.submissionUrl);
    expect(result.submissionFields).toMatchObject({
      category: "skills",
      install_command:
        "Install the zip package into your AI client skill directory.",
      usage_snippet: expect.stringContaining("sample-skill/SKILL.md"),
    });
    expect(result.prTitle).toBe("Add Skill: Sample Skill");
    expect(result.prBody).toContain("### Usage snippet");
    expect(result.prBody).toContain("Package SHA256");
    expect(
      validateSubmission({
        title: result.prTitle,
        body: result.prBody,
      }).ok,
    ).toBe(true);
  });

  it("rejects missing frontmatter and missing referenced resources", () => {
    const result = validateSkillPackageFiles({
      githubUrl: "https://github.com/JSONbored/awesome-claude",
      files: [
        {
          path: "SKILL.md",
          size: 80,
          text: "# Missing Metadata\n\nRun [setup](scripts/setup.sh).",
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "SKILL.md must start with frontmatter.",
        "SKILL.md frontmatter must include name.",
        "Referenced resource is missing: scripts/setup.sh",
      ]),
    );
  });

  it("resolves ./ relative references to present package files", () => {
    const result = validateSkillPackageFiles({
      githubUrl: "https://github.com/JSONbored/awesome-claude",
      files: [
        {
          path: "sample-skill/SKILL.md",
          size: 220,
          text: `---
name: Sample Skill
description: Validate packages before submitting them to the HeyClaude registry.
---

# Sample Skill

Run the helper in [check](./scripts/check.sh) before submitting.
`,
        },
        {
          path: "sample-skill/scripts/check.sh",
          size: 20,
          text: "#!/usr/bin/env bash\n",
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.errors).not.toContain(
      "Referenced resource is missing: ./scripts/check.sh",
    );
  });
});

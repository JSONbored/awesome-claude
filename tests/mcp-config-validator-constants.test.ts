import { describe, expect, it } from "vitest";

import { SECRET_VALUE_PATTERN } from "../apps/web/src/lib/mcp-config-validator-constants";

// SECRET_VALUE_PATTERN is the credential-format detector the MCP config redactor uses to decide
// whether an otherwise-innocuously-named value still needs masking (mcp-config-validator-lib.ts
// calls it in redactEnvValue / redactUrlValue / sanitizeConfigValue). These are contract tests
// for the token shapes it must recognize and, just as importantly, the ordinary strings it must
// NOT flag — a false positive would redact harmless config, a false negative would leak a secret.

describe("SECRET_VALUE_PATTERN", () => {
  // The pattern is used with .test() in several call sites; guard against the lastIndex drift
  // that a stray /g flag would introduce (repeated .test() on the same regex would then alternate).
  it("is not a global regex (stateless .test across calls)", () => {
    expect(SECRET_VALUE_PATTERN.global).toBe(false);
    const token = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123";
    expect(SECRET_VALUE_PATTERN.test(token)).toBe(true);
    expect(SECRET_VALUE_PATTERN.test(token)).toBe(true);
  });

  describe("matches real credential formats", () => {
    const secrets: Array<[string, string]> = [
      ["GitHub classic PAT (ghp_)", "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123"],
      ["GitHub OAuth token (gho_)", "gho_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123"],
      ["GitHub user-to-server (ghu_)", "ghu_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123"],
      ["GitHub server-to-server (ghs_)", "ghs_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123"],
      ["GitHub refresh token (ghr_)", "ghr_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123"],
      [
        "GitHub fine-grained PAT (github_pat_)",
        "github_pat_" + "A".repeat(22) + "_" + "B".repeat(20),
      ],
      ["GitLab PAT (glpat-)", "glpat-ABCDEFGHIJKLMNOPQRSTU"],
      ["OpenAI key (sk-)", "sk-ABCDEFGHIJKLMNOPQRSTUVWX"],
      ["OpenAI project key (sk-proj-)", "sk-proj-ABCDEFGHIJKLMNOPQRSTUVWX"],
      ["Slack bot token (xoxb-)", "xoxb-ABCDEFGHIJKLMNOPQRSTU-more"],
      ["Slack user token (xoxp-)", "xoxp-ABCDEFGHIJKLMNOPQRSTU-more"],
      ["AWS access key id (AKIA)", "AKIA1234567890ABCDEF"],
      ["Google API key (AIza)", "AIzaSyABCDEFGHIJKLMNOPQRSTUVWX_1234"],
      ["Bearer header value", "Bearer abcdefghijklmnopqrstuvwx"],
    ];

    it.each(secrets)("flags a %s", (_label, value) => {
      expect(SECRET_VALUE_PATTERN.test(value)).toBe(true);
    });

    it("finds a secret embedded in surrounding text (not anchored)", () => {
      expect(
        SECRET_VALUE_PATTERN.test(
          "token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123 trailing",
        ),
      ).toBe(true);
    });
  });

  describe("does not flag ordinary, non-secret values", () => {
    const benign = [
      "",
      "postgres://localhost:5432/app",
      "https://example.com/path?a=1",
      "just-a-normal-config-value",
      "node",
      "npx",
      "@modelcontextprotocol/server-filesystem",
      "ghp_short", // ghp_ prefix but far under the 20-char body minimum
      "sk-tiny", // sk- prefix but too short
      "AKIAlowercasexxxxxxx", // AKIA must be followed by 16 uppercase/digits
      "Bearer short", // token body under the 16-char minimum
    ];

    it.each(benign)("leaves %j unflagged", (value) => {
      expect(SECRET_VALUE_PATTERN.test(value)).toBe(false);
    });
  });

  describe("enforces the exact length thresholds of each token shape", () => {
    // Pin the {20,} / {40,} / {16} quantifiers at their boundary: one char short must
    // not match, the threshold length must. This guards against a future edit loosening
    // (false positives on short look-alikes) or tightening (leaking a real credential) a
    // minimum length.
    const boundaries: Array<[string, string, boolean]> = [
      ["ghp_ at the 20-char body minimum", "ghp_" + "A".repeat(20), true],
      ["ghp_ one char under the minimum", "ghp_" + "A".repeat(19), false],
      [
        "github_pat_ at the 40-char body minimum",
        "github_pat_" + "A".repeat(40),
        true,
      ],
      [
        "github_pat_ one char under the minimum",
        "github_pat_" + "A".repeat(39),
        false,
      ],
      ["glpat- at the 20-char body minimum", "glpat-" + "A".repeat(20), true],
      ["glpat- one char under the minimum", "glpat-" + "A".repeat(19), false],
      ["AKIA with its exact 16-char body", "AKIA" + "1234567890ABCDEF", true],
      ["AKIA one char short of 16", "AKIA" + "1234567890ABCDE", false],
      ["Bearer at the 16-char token minimum", "Bearer " + "A".repeat(16), true],
      ["Bearer one char under the minimum", "Bearer " + "A".repeat(15), false],
    ];

    it.each(boundaries)("%s -> %j", (_label, value, expected) => {
      expect(SECRET_VALUE_PATTERN.test(value)).toBe(expected);
    });
  });
});

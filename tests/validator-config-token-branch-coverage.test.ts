import { describe, expect, it } from "vitest";

import { validateMcpConfigText } from "@/lib/mcp-config-validator";
import {
  buildIndexNowPayload,
  normalizeSubmittedUrls,
} from "../scripts/lib/indexnow.mjs";
import {
  claimStatusValue,
  entryMatchesFilters,
  hasPrivacyNotes,
  matchesPlatform,
  packageTrustValue,
  sourceStatusValue,
  type RegistrySearchFilterState,
} from "../apps/web/src/lib/api/registry-search-filters-lib";
import { REVIEW_SUMMARY } from "../apps/web/src/data/validators";
import {
  signConfirmToken,
  verifyConfirmToken,
} from "../apps/web/src/lib/newsletter-token-lib";

describe("mcp-config-validator paste and JSON edges", () => {
  it("requires pasted JSON and reports invalid JSON parse errors", () => {
    const empty = validateMcpConfigText("   ");
    expect(empty.ok).toBe(false);
    expect(empty.errors).toEqual(["Paste a JSON MCP configuration."]);
    expect(empty.reportText).toContain("Errors: 1");

    const invalid = validateMcpConfigText("{not-json");
    expect(invalid.ok).toBe(false);
    expect(invalid.errors[0]).toMatch(/^Invalid JSON:/);
  });

  it("wraps bare server maps into mcpServers output", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        demo: {
          command: "npx",
          args: ["-y", "@example/mcp"],
        },
      }),
    );

    expect(result.warnings).toContain(
      "Input looked like a bare servers object; output wraps it in mcpServers.",
    );
    expect(result.fixedConfigText).toContain("mcpServers");
    expect(result.fixedConfigText).toContain("demo");
  });
});

describe("indexnow payload branch edges", () => {
  it("requires host, https keyLocation, and a non-empty url list", () => {
    expect(() =>
      buildIndexNowPayload({
        host: "",
        key: "48486ebc7ddc47af875118345161ae70",
        keyLocation: "https://heyclau.de/key.txt",
        urlList: ["https://heyclau.de/skills"],
      }),
    ).toThrow(/host is required/i);

    expect(() =>
      buildIndexNowPayload({
        host: "heyclau.de",
        key: "48486ebc7ddc47af875118345161ae70",
        keyLocation: "http://heyclau.de/key.txt",
        urlList: ["https://heyclau.de/skills"],
      }),
    ).toThrow(/keyLocation must be an HTTPS URL/i);

    expect(() =>
      buildIndexNowPayload({
        host: "heyclau.de",
        key: "48486ebc7ddc47af875118345161ae70",
        keyLocation: "https://heyclau.de/key.txt",
        urlList: [],
      }),
    ).toThrow(/urlList cannot be empty/i);

    expect(
      normalizeSubmittedUrls(
        ["https://heyclau.de/a", "not-a-url", "https://heyclau.de/a"],
        "heyclau.de",
      ),
    ).toEqual(["https://heyclau.de/a"]);
  });
});

describe("registry-search-filters branch edges", () => {
  const baseFilters: RegistrySearchFilterState = {
    query: "",
    category: "",
    platform: "",
    installable: "all",
    hasSafetyNotes: "all",
    hasPrivacyNotes: "all",
    downloadTrust: "all",
    claimStatus: "all",
    sourceStatus: "all",
  };

  const entry = {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Playwright automation",
    tags: ["browser"],
    keywords: ["playwright"],
    author: "example",
    platforms: ["claude-code"],
    dateAdded: "2026-01-01",
    privacyNotes: "Local only",
    claimStatus: "verified",
    downloadTrust: "first-party",
    downloadUrl: "https://example.com/pkg.zip",
    sourceUrl: "https://github.com/example/browser-bridge",
  } as never;

  it("rejects platform, privacy, claim, and source mismatches", () => {
    expect(matchesPlatform(entry, "cursor")).toBe(false);
    expect(hasPrivacyNotes(entry)).toBe(true);
    expect(
      entryMatchesFilters(entry, {
        ...baseFilters,
        hasPrivacyNotes: "false",
      }),
    ).toBe(false);
    expect(claimStatusValue(entry)).toBe("verified");
    expect(
      entryMatchesFilters(entry, {
        ...baseFilters,
        claimStatus: "pending",
      }),
    ).toBe(false);
    expect(sourceStatusValue(entry)).toBe("available");
    expect(
      entryMatchesFilters(entry, {
        ...baseFilters,
        sourceStatus: "missing",
      }),
    ).toBe(false);
    expect(packageTrustValue(entry)).toBe("first-party");
    expect(
      entryMatchesFilters(entry, {
        ...baseFilters,
        downloadTrust: "external",
      }),
    ).toBe(false);
  });
});

describe("validators review summary helpers", () => {
  it("exposes review totals and a zero-safe percentage helper", () => {
    expect(REVIEW_SUMMARY.total).toBeGreaterThan(0);
    expect(REVIEW_SUMMARY.pct(0, 0)).toBe(0);
    expect(REVIEW_SUMMARY.pct(1, 2)).toBe(50);
    expect(REVIEW_SUMMARY.needsAttention).toBeGreaterThanOrEqual(0);
  });
});

describe("newsletter-token verification branch edges", () => {
  const secret = "unit-test-newsletter-signing-key";

  it("rejects empty secrets, malformed tokens, bad signatures, and expiry", async () => {
    const payload = {
      email: "user@example.com",
      segments: ["weekly"],
      source: "test",
      exp: Date.now() + 60_000,
    };
    const token = await signConfirmToken(secret, payload);

    expect(await verifyConfirmToken("", token, Date.now())).toBeNull();
    expect(await verifyConfirmToken(secret, "no-dot", Date.now())).toBeNull();
    expect(await verifyConfirmToken(secret, ".sig", Date.now())).toBeNull();
    expect(await verifyConfirmToken(secret, "body.", Date.now())).toBeNull();
    expect(
      await verifyConfirmToken(secret, `${token}tampered`, Date.now()),
    ).toBeNull();
    expect(
      await verifyConfirmToken("other-secret", token, Date.now()),
    ).toBeNull();
    expect(await verifyConfirmToken(secret, token, payload.exp + 1)).toBeNull();
  });

  it("rejects tokens whose payload is missing required fields", async () => {
    expect(
      await verifyConfirmToken(secret, null as never, Date.now()),
    ).toBeNull();
    expect(await verifyConfirmToken(secret, "bad.%", Date.now())).toBeNull();
  });
});

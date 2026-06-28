import { beforeEach, describe, expect, it, vi } from "vitest";

import { TOOL_LISTING_FORM_URL } from "@/lib/submission-preflight-lib";

const directoryEntriesMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/content.server", () => ({
  getDirectoryEntries: directoryEntriesMock,
}));

function validFields(overrides: Record<string, string> = {}) {
  return {
    name: "Direct Submit API Asset",
    slug: "direct-submit-api-asset",
    category: "mcp",
    contact_email: "dev@example.com",
    docs_url: "https://example.com/docs",
    description:
      "MCP server that exercises the direct website submission path.",
    card_description: "Exercises direct website submission.",
    install_command: "npx -y direct-submit-api-asset",
    usage_snippet:
      "claude mcp add direct-submit-api-asset -- npx -y direct-submit-api-asset",
    safety_notes:
      "Installs and runs an MCP server process from the submitted package.",
    privacy_notes:
      "Not applicable: this fixture does not access user files or credentials.",
    ...overrides,
  };
}

describe("buildSubmissionPreflight", () => {
  beforeEach(() => {
    directoryEntriesMock.mockReset();
    directoryEntriesMock.mockResolvedValue([]);
  });

  it("returns route-specific next actions and PR preview only for submit_pr", async () => {
    const { buildSubmissionPreflight } =
      await import("@/lib/submission-preflight");

    const submit = await buildSubmissionPreflight(validFields());
    expect(submit.routeSuggestion).toBe("submit_pr");
    expect(submit.nextAction).toEqual({
      label: "Prepare a single-entry content PR",
    });
    expect(submit).toHaveProperty("prPreview");

    const commercial = await buildSubmissionPreflight(
      validFields({
        name: "Paid Hosted Platform",
        slug: "paid-hosted-platform",
        description:
          "Paid SaaS platform with pricing, enterprise plans, and listing-style claims.",
      }),
    );
    expect(commercial.routeSuggestion).toBe("route_away");
    expect(commercial.nextAction).toEqual({
      label: "Use the paid/editorial tool listing flow",
      url: TOOL_LISTING_FORM_URL,
    });
    expect(commercial).not.toHaveProperty("prPreview");

    const fixRequired = await buildSubmissionPreflight({ name: "Incomplete" });
    expect(fixRequired.routeSuggestion).toBe("fix_required");
    expect(fixRequired.nextAction).toEqual({
      label: "Fix blockers before opening a submission",
    });
    expect(fixRequired).not.toHaveProperty("prPreview");

    const manualReview = await buildSubmissionPreflight(
      validFields({
        name: "Wallet Attestation MCP",
        slug: "wallet-attestation-mcp",
        description:
          "MCP server that uses OAuth and API keys to help users manage wallet attestations and on-chain identity workflows.",
        usage_snippet:
          "Set OAUTH_CLIENT_ID and API_KEY, then run claude mcp add wallet-attestation-mcp -- npx -y wallet-attestation-mcp",
        safety_notes:
          "Requires credential setup and should only be used with scoped test accounts.",
        privacy_notes:
          "Stores OAuth tokens locally and sends requests to the configured API provider.",
      }),
    );
    expect(manualReview.routeSuggestion).toBe("manual_review");
    expect(manualReview.nextAction).toEqual({
      label: "Prepare a single-entry PR with extra source and safety context",
    });
    expect(manualReview).not.toHaveProperty("prPreview");
  });

  it("continues preflight when duplicate lookup rejects with a non-Error value", async () => {
    directoryEntriesMock.mockRejectedValueOnce("directory offline");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { buildSubmissionPreflight } =
      await import("@/lib/submission-preflight");
    const result = await buildSubmissionPreflight(validFields());

    expect(result.routeSuggestion).toBe("submit_pr");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("submissions.preflight.directory_entries_failed"),
    );
  });
});

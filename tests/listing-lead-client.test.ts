import { afterEach, describe, expect, it, vi } from "vitest";

import { submitListingLead } from "@/lib/listing-lead-client";

const originalFetch = globalThis.fetch;

const samplePayload = {
  kind: "tool" as const,
  tierInterest: "featured" as const,
  contactName: "Ada Lovelace",
  contactEmail: "ada@example.com",
  companyName: "Analytical Engines",
  listingTitle: "Claude Workflow Studio",
  websiteUrl: "https://example.com",
  message: "Interested in a featured listing.",
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("submitListingLead", () => {
  it("posts the lead payload to the listing-leads API", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 201 }));
    globalThis.fetch = fetchMock as typeof fetch;

    const response = await submitListingLead(samplePayload);

    expect(response.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledWith("/api/listing-leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(samplePayload),
    });
  });

  it("throws when the listing-leads API returns a non-OK status", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response(null, { status: 429 }),
    ) as typeof fetch;

    await expect(submitListingLead(samplePayload)).rejects.toThrow(
      "Lead intake returned 429",
    );
  });
});

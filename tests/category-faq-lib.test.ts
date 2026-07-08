import { describe, expect, it } from "vitest";

import {
  categoryDescriptions,
  categoryUsageHints,
} from "../apps/web/src/lib/site";
import { faqFor } from "../apps/web/src/lib/category-faq-lib";

describe("faqFor", () => {
  it("builds three questions that embed the label", () => {
    const faqs = faqFor("mcp", "MCP servers");
    expect(faqs).toHaveLength(3);
    expect(faqs[0].q).toBe("What are Claude MCP servers?");
    expect(faqs[1].q).toBe("How do I use MCP servers from HeyClaude?");
    expect(faqs[2].q).toContain("reviewed before they are listed");
  });

  it("uses the category description and usage hint when available", () => {
    const faqs = faqFor("mcp", "MCP servers");
    expect(faqs[0].a).toBe(categoryDescriptions.mcp);
    expect(faqs[1].a).toBe(categoryUsageHints.mcp);
  });

  it("falls back to generic answers for an unknown category id", () => {
    const faqs = faqFor("totally-unknown", "Widgets");
    expect(faqs[0].a).toContain("community-submitted resources");
    expect(faqs[1].a).toContain("Open any entry");
  });
});

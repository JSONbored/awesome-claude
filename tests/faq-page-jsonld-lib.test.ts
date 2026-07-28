import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { faqPageJsonLd } from "../apps/web/src/lib/faq-page-jsonld-lib";
import { faqFor } from "../apps/web/src/lib/category-faq-lib";
import { categoryLabels } from "../apps/web/src/lib/site";
import { CATEGORIES } from "../apps/web/src/types/registry";
import { repoRoot } from "./helpers/registry-fixtures";

describe("faqPageJsonLd", () => {
  it("builds a FAQPage with one Question per pair, in order", () => {
    const ld = faqPageJsonLd([
      { q: "What is this?", a: "A directory." },
      { q: "How do I use it?", a: "Open an entry." },
    ]);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "What is this?",
        acceptedAnswer: { "@type": "Answer", text: "A directory." },
      },
      {
        "@type": "Question",
        name: "How do I use it?",
        acceptedAnswer: { "@type": "Answer", text: "Open an entry." },
      },
    ]);
  });

  it("returns an empty mainEntity for no pairs", () => {
    expect(faqPageJsonLd([]).mainEntity).toEqual([]);
  });

  it("drops pairs missing a question or an answer", () => {
    // A Question with an empty acceptedAnswer is invalid structured data, so
    // these are omitted rather than emitted with blank text.
    const ld = faqPageJsonLd([
      { q: "Kept?", a: "Yes." },
      { q: "", a: "Orphan answer." },
      { q: "Orphan question?", a: "" },
      { q: "   ", a: "   " },
    ]);
    expect(ld.mainEntity).toHaveLength(1);
    expect(ld.mainEntity[0].name).toBe("Kept?");
  });
});

describe("/$category FAQPage JSON-LD (#5594)", () => {
  const routeSource = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/$category.tsx"),
    "utf8",
  );

  it("emits a FAQPage script from the shared builder in head()", () => {
    expect(routeSource).toContain("faqPageJsonLd");
    expect(routeSource).toContain('from "@/lib/faq-page-jsonld-lib"');
    // Built from the same helper the visible <dl> renders, not a second copy.
    expect(routeSource).toContain("faqPageJsonLd(faqFor(id, label))");
    // Drift guard: the pre-existing ItemList/BreadcrumbList scripts stay.
    expect(routeSource).toContain("categoryItemListJsonLd");
    expect(routeSource).toContain("breadcrumbListJsonLd");
  });

  it("matches the rendered FAQ block for every category hub", () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    for (const category of CATEGORIES) {
      const id = category.id;
      const label = categoryLabels[id] ?? id;
      const faqs = faqFor(id, label);
      const ld = faqPageJsonLd(faqs);

      expect(ld["@type"], id).toBe("FAQPage");
      // Every rendered question is present, with its exact answer text.
      expect(ld.mainEntity, id).toHaveLength(faqs.length);
      expect(
        ld.mainEntity.map((entity) => entity.name),
        id,
      ).toEqual(faqs.map((faq) => faq.q));
      expect(
        ld.mainEntity.map((entity) => entity.acceptedAnswer.text),
        id,
      ).toEqual(faqs.map((faq) => faq.a));
      // No empty questions or answers reach the schema.
      for (const entity of ld.mainEntity) {
        expect(entity.name.trim(), id).not.toBe("");
        expect(entity.acceptedAnswer.text.trim(), id).not.toBe("");
      }
    }
  });
});

// Pure builder for schema.org FAQPage JSON-LD from the same { q, a } pairs a
// page already renders, split out so route head() functions share one tested
// implementation instead of open-coding the Question/Answer nesting.

export type FaqPair = {
  q: string;
  a: string;
};

/**
 * schema.org FAQPage JSON-LD. Only pairs with both a question and an answer are
 * emitted: a Question with an empty acceptedAnswer is invalid structured data,
 * and rich results must never claim content the page does not actually show.
 */
export function faqPageJsonLd(faqs: FaqPair[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => faq.q?.trim() && faq.a?.trim())
      .map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
  };
}

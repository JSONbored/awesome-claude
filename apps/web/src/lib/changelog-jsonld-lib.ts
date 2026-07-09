// Pure builder for the changelog page's schema.org ItemList of NewsArticles,
// split out of the route head() so the note mapping and stream->section labels
// can be unit-tested without rendering the route.

type ReleaseNoteLike = {
  title: string;
  date: string;
  body: string;
  stream: string;
};

/** schema.org ItemList JSON-LD of NewsArticles for the changelog release notes. */
export function changelogItemListJsonLd(notes: ReleaseNoteLike[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "HeyClaude registry changelog",
    itemListElement: notes.map((note, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "NewsArticle",
        headline: note.title,
        datePublished: note.date,
        articleSection:
          note.stream === "release" ? "Releases" : note.stream === "policy" ? "Policy" : "Security",
        description: note.body,
      },
    })),
  };
}

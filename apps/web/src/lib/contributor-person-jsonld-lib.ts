// Pure builder for a contributor page's schema.org Person JSON-LD, split out of
// the route head() so the conditional alternateName/description/sameAs fields
// can be unit-tested without rendering the route.

type ContributorLike = {
  handle?: string | null;
  bio?: string | null;
  github?: string | null;
};

/** schema.org Person JSON-LD for a contributor at the given url + display name. */
export function contributorPersonJsonLd(contributor: ContributorLike, url: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name,
    url,
    ...(contributor.handle ? { alternateName: `@${contributor.handle}` } : {}),
    ...(contributor.bio ? { description: contributor.bio } : {}),
    ...(contributor.github ? { sameAs: [contributor.github] } : {}),
  };
}

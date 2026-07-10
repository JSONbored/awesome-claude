// Pure text-analysis helpers behind scripts/report-thin-content.mjs: field
// extraction, tokenization, shingling and Jaccard similarity. Split out so the
// thin/duplicate-content signals can be unit-tested without reading the registry
// or exiting the process. Deterministic; no I/O.

// Fields the registry exposes to crawlers / LLMs, in priority order. These are
// the "intro/body" surface of an entry inside atlas-registry.json.
export const TEXT_FIELDS = [
  "description",
  "cardDescription",
  "seoDescription",
  "trigger",
  "usageSnippet",
];

/** Coerce to a string and trim; null/undefined become "". */
export const collapseWhitespace = (value) => String(value ?? "").trim();

/**
 * The primary "intro" we de-duplicate on: the description is what shows up in
 * listings and meta tags, so duplicate descriptions are the real SEO risk.
 */
export const introOf = (entry) =>
  collapseWhitespace(entry.description) ||
  collapseWhitespace(entry.cardDescription) ||
  collapseWhitespace(entry.seoDescription);

/** Combined, de-duplicated text used for the thin / low-uniqueness signals. */
export const combinedTextOf = (entry) => {
  const seen = new Set();
  const parts = [];
  for (const field of TEXT_FIELDS) {
    const text = collapseWhitespace(entry[field]);
    if (text && !seen.has(text)) {
      seen.add(text);
      parts.push(text);
    }
  }
  return parts.join(" ");
};

/** Lowercase alphanumeric tokens. */
export const tokenize = (text) =>
  collapseWhitespace(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

/** Normalized single-space token string, for exact-ish comparison. */
export const normalizeForCompare = (text) => tokenize(text).join(" ");

/** Set of `size`-word shingles; a token list shorter than `size` yields one shingle. */
export const shinglesOf = (tokens, size) => {
  const set = new Set();
  if (tokens.length === 0) return set;
  if (tokens.length < size) {
    set.add(tokens.join(" "));
    return set;
  }
  for (let i = 0; i + size <= tokens.length; i += 1) {
    set.add(tokens.slice(i, i + size).join(" "));
  }
  return set;
};

/** Jaccard similarity of two sets; two empty sets are treated as 0. */
export const jaccard = (a, b) => {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const item of small) {
    if (large.has(item)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
};

/** Round to `digits` decimal places. */
export const round = (value, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

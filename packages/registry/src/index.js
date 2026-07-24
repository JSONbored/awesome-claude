export {
  default as categorySpec,
  categorySpec as registryCategorySpec,
} from "./category-spec.js";
export { generatedAtForEntries } from "./artifacts.js";
// Explicit re-exports rescue names that collide across two or more of the
// `export *` modules below — ECMAScript silently drops such names from the
// aggregate namespace (the same reason generatedAtForEntries needs its own line
// above). Each points at the general-purpose canonical implementation:
//   clean       — identical in brand-assets/quality/llms
//   entryUrl    — relationships' relative /entry/<cat>/<slug> (vs weekly-brief's
//                 newsletter-specific absolute form)
//   sourceUrls  — relationships' full source-link gatherer (vs weekly-brief's)
//   listValue   — commercial's general list parser (vs llms' citation-fact join)
export { clean } from "./quality.js";
export { entryUrl, sourceUrls } from "./relationships.js";
export { listValue } from "./commercial.js";
export * from "./artifacts.js";
export * from "./brand-assets.js";
export * from "./commercial.js";
export * from "./content-schema.js";
export * from "./frontmatter.js";
export * from "./presentation.js";
export * from "./quality.js";
export * from "./relationships.js";
export * from "./seo.js";
export * from "./submission.js";
export * from "./draft-risk.js";
export * from "./submission-spec.js";
export * from "./llms.js";
export * from "./mcp-install-config.js";
export * from "./platforms.js";
export * from "./weekly-brief.js";

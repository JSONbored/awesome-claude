// The variants getSectionVariant can classify a title into. Downstream helpers
// take `variant: string` rather than this union because a section's variant can
// also come from an embedded `<!-- section type: ... -->` comment (e.g.
// "quick_reference", "related_content"), which getSectionVariant never emits.
export type SectionVariant =
  | "prerequisites"
  | "warning"
  | "troubleshooting"
  | "default";

// Order matters: warning is checked first so that safety/security/privacy
// content is never reclassified as a lower-priority variant and buried.
const WARNING_KEYWORDS = [
  "warning",
  "critical",
  "security",
  "safety",
  "privacy",
  "danger",
  "caution",
];

const PREREQUISITE_KEYWORDS = [
  "prerequisite",
  "requirement",
  "before you start",
  "before you begin",
  "getting started",
  "setup",
  "set up",
  "installation",
  "install",
];

const TROUBLESHOOTING_KEYWORDS = [
  "troubleshooting",
  "common issues",
  "known issues",
  "faq",
];

// Match keywords only at a word boundary so glued prefixes like "uninstall" or
// "insecurity" are not misclassified. A leading boundary (not a trailing one)
// is used so inflections such as "installation" and "prerequisites" still match.
function compileKeywords(keywords: string[]): RegExp {
  const escaped = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  return new RegExp(`\\b(?:${escaped.join("|")})`, "i");
}

const WARNING_PATTERN = compileKeywords(WARNING_KEYWORDS);
const PREREQUISITE_PATTERN = compileKeywords(PREREQUISITE_KEYWORDS);
const TROUBLESHOOTING_PATTERN = compileKeywords(TROUBLESHOOTING_KEYWORDS);

export function getSectionVariant(title: string): SectionVariant {
  if (WARNING_PATTERN.test(title)) {
    return "warning";
  }
  if (PREREQUISITE_PATTERN.test(title)) {
    return "prerequisites";
  }
  if (TROUBLESHOOTING_PATTERN.test(title)) {
    return "troubleshooting";
  }
  return "default";
}

// Essential sections carry setup or safety/privacy content that must stay
// scan-friendly, so they render expanded regardless of their position.
const ESSENTIAL_VARIANTS = new Set<string>(["warning", "prerequisites"]);

export function isEssentialVariant(variant: string): boolean {
  return ESSENTIAL_VARIANTS.has(variant);
}

export function shouldOpenSection(params: {
  index: number;
  variant: string;
}): boolean {
  const { index, variant } = params;
  return (
    index < 2 || isEssentialVariant(variant) || variant === "quick_reference"
  );
}

export function getSectionEyebrow(variant: string): string {
  switch (variant) {
    case "prerequisites":
      return "Setup";
    case "warning":
      return "Important";
    case "troubleshooting":
      return "Troubleshooting";
    case "quick_reference":
      return "Reference";
    case "related_content":
      return "Related";
    default:
      return "Section";
  }
}

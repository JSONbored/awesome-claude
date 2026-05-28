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

export function getSectionVariant(title: string): SectionVariant {
  const normalized = title.toLowerCase();
  if (WARNING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "warning";
  }
  if (PREREQUISITE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "prerequisites";
  }
  if (TROUBLESHOOTING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
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

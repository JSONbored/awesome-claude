import { pctOf, type DistRow } from "@/components/data-report";
import { tagDistribution, type ReportDimension, type ReportModel } from "@/lib/data-reports";
import {
  type Entry,
  type SkillLevel,
  type SkillType,
  type VerificationStatus,
} from "@/types/registry";

// Category/mechanism tags that describe *what a skill is* rather than what it
// does — excluded so the use-case chart surfaces real tasks.
const MECHANISM_TAGS = new Set([
  "skills",
  "skill",
  "agent-skills",
  "claude",
  "claude-code",
  "anthropic",
  "agent",
  "agents",
]);

const SKILL_TYPE_LABEL: Record<SkillType, string> = {
  "capability-pack": "Capability pack",
  general: "General",
};
const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  foundational: "Foundational",
  advanced: "Advanced",
  expert: "Expert",
};
const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  draft: "Draft",
  validated: "Validated",
  production: "Production",
};

const SKILL_TYPE_ORDER: SkillType[] = ["capability-pack", "general"];
const SKILL_LEVEL_ORDER: SkillLevel[] = ["foundational", "advanced", "expert"];
const VERIFICATION_ORDER: VerificationStatus[] = ["draft", "validated", "production"];

function labelledDistribution<T extends string>(
  skills: ReadonlyArray<Entry>,
  order: readonly T[],
  valueOf: (entry: Entry) => T | undefined,
  labelOf: (value: T) => string,
): DistRow[] {
  const total = skills.length;
  return order
    .map((value) => {
      const count = skills.filter((skill) => valueOf(skill) === value).length;
      return { label: labelOf(value), count, pct: pctOf(count, total) };
    })
    .filter((row) => row.count > 0);
}

/**
 * Build the "State of Agent Skills" report model from the full registry.
 * Deterministic: identical input always yields identical output. Degenerate
 * single-value dimensions are dropped so the report never shows an
 * uninformative one-row chart.
 */
export function buildSkillsReport(entries: ReadonlyArray<Entry>, asOf: string): ReportModel {
  const skills = entries.filter((entry) => entry.category === "skills");
  const total = skills.length;

  const validated = skills.filter(
    (s) => s.verificationStatus === "validated" || s.verificationStatus === "production",
  ).length;
  const packs = skills.filter((s) => s.skillType === "capability-pack").length;
  const packageVerified = skills.filter((s) => s.packageVerified).length;

  const candidateDimensions: ReportDimension[] = [
    {
      key: "use-cases",
      title: "Most common skill use cases",
      help: "The tasks skills give agents, from their registry tags (mechanism tags like “skills” excluded). A skill can cover several use cases.",
      rows: tagDistribution(skills, { exclude: MECHANISM_TAGS }),
    },
    {
      key: "skill-type",
      title: "Skill type",
      help: "Capability packs bundle multiple related abilities; general skills do one focused thing.",
      rows: labelledDistribution(
        skills,
        SKILL_TYPE_ORDER,
        (s) => s.skillType,
        (value) => SKILL_TYPE_LABEL[value],
      ),
    },
    {
      key: "maturity",
      title: "Maturity level",
      help: "Author-declared depth, from foundational building blocks to expert workflows.",
      rows: labelledDistribution(
        skills,
        SKILL_LEVEL_ORDER,
        (s) => s.skillLevel,
        (value) => SKILL_LEVEL_LABEL[value],
      ),
    },
    {
      key: "verification",
      title: "Verification status",
      help: "How far each skill has progressed through registry review, from draft to production.",
      rows: labelledDistribution(
        skills,
        VERIFICATION_ORDER,
        (s) => s.verificationStatus,
        (value) => VERIFICATION_LABEL[value],
      ),
    },
    {
      key: "packaging",
      title: "Package verification",
      help: "Whether a skill ships a maintainer-verified, checksum-pinned package or is installed from source.",
      rows: [
        {
          label: "Verified package",
          count: packageVerified,
          pct: pctOf(packageVerified, total),
        },
        {
          label: "Source only",
          count: total - packageVerified,
          pct: pctOf(total - packageVerified, total),
        },
      ].filter((row) => row.count > 0),
    },
  ];

  // Drop degenerate dimensions (a single bucket carries no information).
  const dimensions = candidateDimensions.filter((d) => d.rows.length > 1);

  return {
    slug: "/state-of-agent-skills",
    exportSlug: "agent-skills",
    title: "State of Agent Skills 2026",
    description:
      "A data report on agent skills for Claude and other AI coding agents: how many there are, what they do, whether they are capability packs or focused single-purpose skills, how mature and verified they are, and how they are packaged — computed from the HeyClaude registry.",
    keywords: [
      "agent skills",
      "Claude skills",
      "capability packs",
      "AI agent capabilities",
      "Claude Code",
      "AI tooling",
    ],
    asOf,
    total,
    stats: [
      { key: "total", label: "Total skills", value: total, hint: "registry" },
      {
        key: "validated",
        label: "Validated or production",
        value: pctOf(validated, total),
        hint: "%",
      },
      {
        key: "packs",
        label: "Capability packs",
        value: pctOf(packs, total),
        hint: "%",
      },
      {
        key: "packaged",
        label: "Verified package",
        value: pctOf(packageVerified, total),
        hint: "%",
      },
    ],
    dimensions,
  };
}

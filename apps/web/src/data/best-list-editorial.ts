// Optional editorial overrides for high-intent best-list pages. A best list
// renders fine from generated data alone; when an entry here matches its slug,
// the page also shows a source-backed "short answer" and decision criteria that
// help readers (and AI answer engines) choose. Keep claims factual and tied to
// registry signals (trust, source, safety/privacy disclosure, install
// footprint) — no popularity or rating claims that are not measured.

export type BestListDecisionCriterion = {
  label: string;
  detail: string;
};

export type BestListEditorial = {
  /** Must match a slug in seoClusterDefinitions / BEST_LISTS. */
  slug: string;
  /** One- or two-sentence "what to pick and why" answer. */
  shortAnswer: string;
  /** Factual criteria to weigh when choosing from this list. */
  decisionCriteria: BestListDecisionCriterion[];
};

export const BEST_LIST_EDITORIAL: BestListEditorial[] = [
  {
    slug: "claude-code-hooks",
    shortAnswer:
      "Pick a hook by the event it fires on and what it executes. Most hooks run on PostToolUse — ideal for linting, tests, and formatting after Claude edits a file — while Stop and Notification hooks gate or announce session events. Favor hooks that document their safety and privacy behavior and install as a project-local shell script you can read before enabling.",
    decisionCriteria: [
      {
        label: "Hook event",
        detail:
          "Match the trigger to your workflow: PostToolUse for checks after edits, Stop to gate session end, Notification for alerts.",
      },
      {
        label: "Disclosed behavior",
        detail:
          "Hooks run shell commands automatically. Read the documented safety and privacy notes — what each hook executes and what data it reads — before enabling it.",
      },
      {
        label: "Source you can verify",
        detail: "Prefer source-backed hooks whose script is in a public repository you can review.",
      },
      {
        label: "Setup footprint",
        detail:
          "Most install as a single project-local .claude/hooks script with no extra prerequisites.",
      },
    ],
  },
  {
    slug: "mcp-servers-for-databases",
    shortAnswer:
      "Choose a database MCP server by the database you run and how much write access you want to grant. Prefer source-backed servers with documented safety and privacy behavior, and confirm whether the server exposes read-only queries or full read/write before connecting it to anything that matters.",
    decisionCriteria: [
      {
        label: "Your database",
        detail: "Match the server to PostgreSQL, MySQL, MongoDB, Redis, or your managed provider.",
      },
      {
        label: "Read vs read/write",
        detail:
          "Check whether the server allows mutations, and scope the credentials you give it to least privilege.",
      },
      {
        label: "Source & trust",
        detail:
          "Prefer first-party or source-backed servers with a verifiable repository over unverified ones.",
      },
      {
        label: "Safety & privacy notes",
        detail:
          "Confirm the server documents what data it reads and what it sends before granting database access.",
      },
    ],
  },
];

export function getBestListEditorial(slug: string): BestListEditorial | undefined {
  return BEST_LIST_EDITORIAL.find((editorial) => editorial.slug === slug);
}

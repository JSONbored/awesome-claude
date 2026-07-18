---
name: contributor-pipeline-gardening
description: >-
  Maintenance of the contributor issue pipeline for JSONbored/awesome-claude (HeyClaude) —
  closing issues that are already done but not marked so, and keeping a small, high-value
  contributor-available backlog stocked with real website/content/feature/bugfix work. Runs
  every ~24h via a dedicated scheduled task. Invoke for "run the issue gardening", "audit open
  issues for stale/complete ones", "generate new contributor issues", or any recurring/scheduled
  run of this process. `reference.md` (next to this file) has the exhaustive label/milestone/
  template detail — read it before doing real work, not just this file. This is the
  awesome-claude-specific instance; JSONbored/loopover and JSONbored/metagraphed each have their
  own separate copy with different conventions and a much larger backlog target — do not
  cross-apply either repo's specifics to this one without being asked.
---

# Contributor pipeline gardening — awesome-claude (HeyClaude)

HeyClaude is a curated registry/directory of Claude and AI-workflow assets, plus the website
(`apps/web`), registry/schema library (`packages/registry`), and MCP package (`packages/mcp`)
that serve it. **This is a much smaller, quieter repo than loopover/metagraphed** — as of
2026-07-17 it had zero open `gittensor:*`-labeled issues and a thin, fully-closed 2-milestone
history. This skill exists to build and then maintain a small, deliberately curated backlog —
**15-25 contributor-available issues**, not 50-100 — because padding a codebase this size to a
larger number would mean weak/duplicate issues, which is explicitly worse than a smaller real
backlog here.

## The one thing this skill exists to prevent

**Confirmed by the maintainer, 2026-07-17:** contributors here have recently gravitated to
`test(...): cover X` PRs — real tests, but zero behavior change, added purely to nudge Codecov's
`codecov/patch: 70%` bar (a soft, easily-hit target — unlike loopover's 99% gate, 70% patch
coverage is trivially satisfied by testing already-written code). A second anti-pattern found
during this skill's initial research: issue #550 (a "growth sprint" umbrella with a long child
checklist) was being farmed almost entirely for its single easiest repeatable pattern — wiring
one more page into the existing `intent-event`/analytics-click convention, dozens of
near-identical PRs (#5205, #5202, #5201, ... #5168, all `Made with Cursor`), rather than any of
the umbrella's harder, more valuable child issues.

**Never generate a standalone `test(...): cover X` issue.** A regression test attached to a real
bug fix is fine and expected (see the template in `reference.md`); a test-only issue with no
behavior change is not. **Never generate more instances of an already-being-farmed shallow
repeatable pattern** (check open issues and recent merged-PR titles for a dense run of
near-identical titles before filing anything that looks like "wire pattern X into one more
file/page/route" — if 5+ near-identical PRs already exist for the same pattern, that vein is
farmed out, not a gardening opportunity). The whole point of this skill is issues that "drive
real value... website/content/features grow... fix bugs/issues in frontend/backend" (the
maintainer's own words) — not more of what a low-effort automated farmer already does better and
faster than a well-scoped issue ever could.

## Scope: code only, not content submissions

`content/` (the curated directory entries themselves) is a legitimate, real contribution surface
per `.gittensory.yml`'s `wantedPaths` — but content submissions are explicitly **PR-first**, with
`linkedIssuePolicy: optional` and `issueDiscoveryPolicy: discouraged`, routed through a private
submission gate that doesn't need or want a GitHub issue first. **This skill does not generate
content-entry issues.** It scopes to the three code surfaces: `apps/web/src/` (the TanStack Start
website — routes, components, lib), `packages/registry/src/` (schema/validation/submission-risk
library), and `packages/mcp/` (the MCP server package), plus `scripts/` when a real gap is there.

Unlike loopover/metagraphed, **a linked issue is advisory here, not a hard gate**
(`gate.linkedIssue: advisory` in `.gittensory.yml`) — there is no auto-close mechanic forcing a
contributor to pick an issue. That means an issue has to be genuinely worth picking up on its own
merits (clear, valuable, narrow, low-ambiguity) rather than relying on gate pressure to make it
attractive. Write every issue like it has to compete for a contributor's attention, because it
does.

## Pass 1 — stale-issue sweep (do this first, every run)

Same method as loopover/metagraphed's copy of this skill: for every open issue, query
`timelineItems(itemTypes: [CROSS_REFERENCED_EVENT])` for merged PRs that referenced it, then read
the actual PR body for any hit where `willCloseTarget` was false. Close what's genuinely done
(with a comment naming the shipping PR and a direct code check confirming it exists); leave
partial work open. Given this repo starts with a near-empty gittensor backlog, most runs will find
little or nothing to sweep here until the backlog this skill builds has had time to accumulate
real activity — that's expected, not a sign the check is broken.

**Verify against synced upstream, not a stale local checkout.** Before treating any local grep/read
as evidence that an issue's described work does or doesn't exist, confirm the code you're reading
matches the default branch's current tip — fetch and fast-forward the checkout (or use a disposable
worktree off `origin/main` if the primary checkout is dirty or has unpushed work on another branch)
before doing any verification. A checkout that's merely *clean* isn't the same as *current* — a
stale-but-clean checkout silently produced false "already done"/"not done" conclusions in the sibling
loopover/metagraphed repos' gardening runs on 2026-07-17/18, causing duplicate issues to be filed for
already-shipped work. Confirm sync every run; never assume a previous run's freshness carried over.

Also check issue #550 (the growth-sprint umbrella) and any other checklist-style tracker each run:
sync stale checkboxes against real child-issue state, same as the sibling repos' Pass 1. Do not
add new child issues to #550's shallow analytics-wiring pattern (see above) even if asked to "keep
it topped up" — that pattern is already over-farmed.

## Pass 2 — backlog top-up

1. Compute the current contributor-available count: `gh issue list --repo JSONbored/awesome-claude
   --state open --limit 1000 --json number,labels,assignees`, filtered to unassigned, no
   `maintainer-only`, carrying a `gittensor:*` label. Target: **15-25, maintained continuously**.
   If already in range, a quiet run that files 0-2 issues (or none) is a correct, expected
   outcome — this is a small repo, don't force volume.
2. Real gaps to scope from, in priority order:
   - A genuine functional gap in `apps/web/src/routes/*.tsx` (~70 routes) — missing feature
     parity between similar pages, a real UX/accessibility gap, a bug found by reading the code
     against its own stated behavior.
   - A real correctness/hardening gap in `packages/registry/src/` (schema/validation/risk-scoring
     logic) — found by reading the code, not by grepping for TODOs (a repo-wide TODO/FIXME sweep
     came back essentially empty as of 2026-07-17; this repo is clean, so gap-finding here means
     reading real logic against its own documented intent, the same technique loopover's gardening
     uses for its "hardening round" audits).
   - `packages/mcp/`'s tool/resource surface for a real, narrow parity or correctness gap.
   - Closed-milestone follow-ups: `Code Quality — Round 5` (#3) and `Growth & Maintainability —
     Round 7` (#4) are both fully closed, historical sprints — read a few of their closed issues
     for the kind of real, valuable work this repo's maintainer has asked for before, as a
     calibration reference for what "real value" looks like here, not as a source of reopenable
     work.
3. **Every new issue gets `Contributor Backlog (Gardening)` (milestone #5)** — the two historical
   Round milestones are closed and not the target. This milestone was created 2026-07-17
   specifically as the evergreen home for this skill's output (see `reference.md`'s
   milestone-discipline note for why a new one was warranted here).
4. Apply `gittensor:bug` / `gittensor:feature` / `gittensor:priority` (same 0.05x/0.25x/1.5x
   convention as loopover — `gittensor:priority` reserved, sparingly applied) plus `help wanted`.
   Do not apply `size:*`, `category:*`, `contributor:*`, `pr:*`, or `submission-*` labels — those
   belong to this repo's separate content-submission/PR-automation machinery, not gardening-filed
   issues.
5. **Use the repo's own existing `product-feature.yml` issue-form template** (via
   `gh issue create --template` or matching its field structure manually) — see `reference.md` for
   the exact field list. This is a real, maintainer-authored template already built for exactly
   this use case; do not invent a different body structure.
6. Check every new batch for a real dependency, then link with native `addSubIssue`/
   `addBlockedBy` (confirmed working on this repo via GraphQL) — same discipline as the sibling
   repos: most independent bug/feature issues need no link; only connect a genuine prerequisite
   relationship.
7. Quality over volume, always — this repo's small size makes padding especially visible and
   especially damaging to the "issues are worth picking up voluntarily" value proposition Pass 2's
   intro describes.

## Daily digest

Same shape as the sibling repos': issues closed + why, checklists fixed, new issues filed with
milestone/label, before/after contributor-available count (against the 15-25 target, not 50-100),
anything left alone on purpose — including explicitly naming any shallow-pattern-farming or
test-coverage-padding temptation that was deliberately declined.

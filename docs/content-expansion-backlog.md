# Content expansion backlog

A demand-guided backlog for adding free, source-backed entries and guides. It is
generated from registry coverage gaps, then filled with specific, verified
candidates so follow-up content issues can be opened without rediscovering the
evidence.

## How to regenerate the priority groups

```sh
pnpm audit:coverage-gaps            # per-category intents that are thin/absent
pnpm audit:coverage-gaps -- --json  # machine-readable
```

The tool ranks, per category, the high-demand intents (tags well-represented
across the catalog) that have ≤1 entry in that category. That is the **demand
evidence** — where the directory under-serves a real intent.

## Acceptance criteria (a candidate is in-scope only if all hold)

- **Free and source-backed.** Open-source or first-party, with a verifiable
  repository or official documentation URL. No paywalled-only tools.
- **Category fit.** Maps cleanly to an existing category (mcp, hooks, skills,
  commands, rules, statuslines, agents, guides, tools, collections).
- **Not commercial intake.** Paid listings, sponsorships, jobs, affiliate, and
  claim requests go through the website lead flows, never this backlog (see
  `AGENTS.md`).
- **Not thin promo.** Real, practical utility — not a landing page, wrapper, or
  duplicate of an existing entry.
- **One source content entry per eventual PR.** Submissions stay PR-first and
  one file per change; this backlog does not alter submission policy.

## Candidate template

Each backlog candidate records exactly these fields so a content issue can be
opened from it directly:

```md
- **Name:** <tool/server/skill/guide name>
  - **Category:** <mcp | hooks | skills | commands | rules | statuslines | agents | guides | tools | collections>
  - **Source URL:** <official repo or docs URL>
  - **Intent / gap:** <which coverage gap it fills, from audit:coverage-gaps>
  - **Rationale:** <why it serves a real user intent>
  - **Policy fit:** <in-scope (free + source-backed) | route to lead flow | reject + reason>
```

## Priority groups

Run `pnpm audit:coverage-gaps` for the current ranked gaps, then fill candidates
under the relevant group below. Suggested ordering by leverage:

1. **Guides** — testing, database, devops, analytics, python workflows (guides
   convert intent that tool entries alone do not answer).
2. **Hooks** — observability, oauth, code-review automation.
3. **Skills** — analytics, documentation, rag, monitoring.
4. **Agents** — rag, deployment, workflow starters.
5. **Commands / rules / statuslines** — database, observability, analytics.

> Keep candidates verified before adding — an unverified source URL is not yet a
> backlog item.

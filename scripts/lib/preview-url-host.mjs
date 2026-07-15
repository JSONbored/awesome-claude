// Pure host matching behind scripts/resolve-pr-preview-url.mjs: deciding whether
// a candidate deployment host is a HeyClaude PRODUCTION preview host. Split out
// so the (fiddly) worker-label rules can be unit-tested without the GitHub API /
// filesystem layers the resolver uses to gather candidate URLs.

// A preview URL for this project must be a HeyClaude PRODUCTION host. This
// Cloudflare account hosts several unrelated projects, so GitHub
// deployment/status lookups can surface a sibling project's URL (e.g.
// gittensory.aethereal.dev) — running the artifact contract against that is
// wrong. Accept only the production site and Cloudflare Workers Builds preview
// aliases for the prod worker (<version>-heyclaude-prod.<subdomain>.workers.dev).
// Deliberately excludes the retired dev worker (heyclaude-dev.*.workers.dev and
// dev.heyclau.de).
export function isHeyClaudePreviewHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  if (host === "heyclau.de" || host === "www.heyclau.de") return true;
  if (!host.endsWith(".workers.dev")) return false;
  // The worker name is the first dot-label of the host: "heyclaude-prod" or a
  // Workers Builds preview alias "<version>-heyclaude-prod". Match the label
  // exactly so a sibling worker whose name merely CONTAINS the substring (e.g.
  // "heyclaude-prod-next") or a "…heyclaude-prod…" subdomain is not selected.
  const workerLabel = host.split(".")[0];
  return (
    workerLabel === "heyclaude-prod" || workerLabel.endsWith("-heyclaude-prod")
  );
}

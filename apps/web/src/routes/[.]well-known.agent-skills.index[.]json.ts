import { createFileRoute } from "@tanstack/react-router";
import { ENTRIES } from "@/data/entries";
import { absoluteUrl } from "@/lib/seo";
import { applySecurityHeaders } from "@/lib/security-headers";

// Agent Skills Discovery index (RFC v0.2.0): advertises checksummed skill packages.
function skillsIndex() {
  const skills = ENTRIES.filter(
    (e) => e.category === "skills" && e.downloadUrl && e.downloadSha256,
  ).map((e) => ({
    name: e.title,
    type: "skill",
    description: e.description,
    // url must point at the artifact whose bytes match sha256 (not the HTML entry page).
    url: absoluteUrl(String(e.downloadUrl)),
    sha256: e.downloadSha256,
  }));
  return {
    $schema: "https://agentskills.io/schemas/index.json",
    skills,
  };
}

export const Route = createFileRoute("/.well-known/agent-skills/index.json")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(`${JSON.stringify(skillsIndex(), null, 2)}\n`, {
          headers: applySecurityHeaders(
            new Headers({
              "content-type": "application/json; charset=utf-8",
              "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            }),
            request,
          ),
        }),
    },
  },
});

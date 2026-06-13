# AI Agent Discovery

HeyClaude publishes machine-discoverable metadata so AI agents can find the registry API,
the hosted MCP server, and the skill catalog. This complements (and is separate from) the
classic SEO surface (`sitemap.xml`, `robots.txt`, JSON-LD).

## Implemented in this repo

| Feature | Where | Endpoint |
| --- | --- | --- |
| RFC 8288 `Link` headers (HTML responses) | `apps/web/src/lib/security-headers.ts` | advertises `api-catalog`, `service-desc`, `service-doc`, MCP card |
| Content-Signal AI preferences | `apps/web/src/lib/robots-policy.ts` | `robots.txt` (`ai-train=yes, search=yes, ai-input=yes`) |
| RFC 9727 API catalog | `apps/web/src/routes/[.]well-known.api-catalog.ts` | `/.well-known/api-catalog` (`application/linkset+json`) |
| MCP Server Card (SEP-1649) | `apps/web/src/routes/[.]well-known.mcp.server-card[.]json.ts` | `/.well-known/mcp/server-card.json` |
| Agent Skills index (Discovery RFC v0.2.0) | `apps/web/src/routes/[.]well-known.agent-skills.index[.]json.ts` | `/.well-known/agent-skills/index.json` |
| WebMCP in-page tool | `apps/web/src/components/webmcp-provider.tsx` | `navigator.modelContext` → `search_heyclaude` |

Notes:
- The MCP server card's `MCP_VERSION` and tool list must be kept in sync with
  `packages/mcp/package.json` and `packages/mcp/src/registry.js` on each MCP release.
- The agent-skills index is generated from the registry: only `skills` entries that have a
  built package (`downloadUrl` + `downloadSha256`) are listed.
- OAuth/OIDC discovery (`/.well-known/openid-configuration`,
  `/.well-known/oauth-protected-resource`, `auth.md`) is intentionally **not** published: the
  registry API is public and unauthenticated, so there is nothing to describe. Revisit if/when
  protected endpoints are added.

## DNS-AID (DNS for AI Discovery) — ops task, not in this repo

DNS records cannot be committed here; publish them on the `heyclau.de` zone (Cloudflare DNS).
Per draft-mozleywilliams-dnsop-dnsaid + RFC 9460 (SVCB/HTTPS), publish ServiceMode records
that point agents at the discovery entrypoints, then sign the zone with DNSSEC.

Suggested records:

```dns
; MCP endpoint (Streamable HTTP)
_a2a._agents.heyclau.de.   3600 IN SVCB 1 api.heyclau.de. (
                                  alpn="h2"
                                  endpoint="/api/mcp" )

; General discovery entrypoint -> api-catalog
_index._agents.heyclau.de. 3600 IN SVCB 1 heyclau.de. (
                                  alpn="h2"
                                  endpoint="/.well-known/api-catalog" )
```

Steps:
1. Add the SVCB records above on the Cloudflare DNS zone for `heyclau.de`. **Done** —
   `_index._agents` and `_a2a._agents` SVCB records are published.
2. **DNSSEC: blocked for this domain.** DENIC (the `.de` registry) supports DNSSEC, but the current
   registrar (Namecheap) does not expose DS-record submission for `.de`, so the chain of trust
   cannot be anchored. Toggling Cloudflare's DNSSEC on is inert without a DS record at the
   registrar (it signs the zone but resolvers see no DS and treat it as unsigned — no breakage,
   no validation). Options:
   - **(a) Accept it (recommended).** DNS-AID is a draft spec and the lowest-value readiness item;
     the SVCB records still publish discovery hints. The substantive agent-readiness surfaces
     (Link headers, api-catalog, MCP card, agent-skills index, Content-Signal, WebMCP) do not
     depend on DNSSEC and are fully live.
   - **(b) Move the registrar** to one that supports `.de` DS submission (e.g. INWX or another
     `.de`-capable registrar — Cloudflare Registrar does NOT support `.de`), then anchor DNSSEC
     end-to-end. Only worth it if the DNS-AID check specifically matters.
3. Verify the records with `dig _index._agents.heyclau.de SVCB +short`.

## Verification

```sh
curl -s https://heyclau.de/.well-known/api-catalog | jq .
curl -s https://heyclau.de/.well-known/mcp/server-card.json | jq .
curl -s https://heyclau.de/.well-known/agent-skills/index.json | jq '.skills | length'
curl -sI https://heyclau.de/ | grep -i '^link:'
curl -s https://heyclau.de/robots.txt | grep -i 'content-signal'
```

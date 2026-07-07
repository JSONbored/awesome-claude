/**
 * Pure MCP registry copyable asset helpers.
 *
 * Asset list shaping, type filtering, primary selection, and response envelopes
 * live here. Runtime registry handlers stay in `registry.js`.
 */
import { categoryPrimaryAsset, contentAsset } from "./registry-asset-lib.js";
import { notes } from "./registry-response-lib.js";

/**
 * Build the full list of copyable content assets for an entry.
 *
 * @param {Record<string, unknown>} entry
 * @returns {Array<Record<string, unknown>>}
 */
export function buildEntryContentAssets(entry) {
  return [
    contentAsset(
      "full_content",
      "Full usable entry content",
      entry.fullCopyableContent || entry.copySnippet || entry.body,
    ),
    contentAsset(
      "install_command",
      "Install command",
      entry.installCommand,
      "shell",
    ),
    contentAsset(
      "config_snippet",
      "Configuration snippet",
      entry.configSnippet,
      "text",
    ),
    contentAsset("script", "Script body", entry.scriptBody, "text"),
    contentAsset(
      "command_syntax",
      "Command syntax",
      entry.commandSyntax,
      "text",
    ),
    contentAsset("usage", "Usage snippet", entry.usageSnippet, "markdown"),
    contentAsset("items", "Collection items", entry.items, "json"),
  ].filter(Boolean);
}

/**
 * Filter assets to a requested type when provided.
 *
 * @param {Array<Record<string, unknown>>} assets
 * @param {string} requestedType
 * @returns {Array<Record<string, unknown>>}
 */
export function filterAssetsByType(assets, requestedType) {
  return requestedType
    ? assets.filter((asset) => asset.type === requestedType)
    : assets;
}

/**
 * Select the primary asset for a copyable-asset response.
 *
 * @param {Array<Record<string, unknown>>} assets
 * @param {Record<string, unknown>} entry
 * @param {string} requestedType
 * @returns {Record<string, unknown> | null}
 */
export function selectPrimaryAsset(assets, entry, requestedType) {
  return requestedType ? assets[0] || null : categoryPrimaryAsset(entry);
}

/**
 * Build the ok envelope for entry.asset.
 *
 * @param {{
 *   entry: Record<string, unknown>,
 *   platform: string,
 *   requestedType: string,
 *   assets: Array<Record<string, unknown>>,
 *   primary: Record<string, unknown> | null,
 *   compatibility: unknown,
 *   source: unknown,
 *   trust: unknown,
 *   canonicalUrl: string,
 * }} args
 * @returns {Record<string, unknown>}
 */
export function buildCopyableAssetResponse({
  entry,
  platform,
  requestedType,
  assets,
  primary,
  compatibility,
  source,
  trust,
  canonicalUrl,
}) {
  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    canonicalUrl,
    platform: platform || "",
    requestedAssetType: requestedType || "",
    primaryAsset: primary,
    assets,
    installCommand: entry.installCommand || "",
    configSnippet: entry.configSnippet || "",
    usageSnippet: entry.usageSnippet || "",
    downloadUrl: entry.downloadUrl || "",
    safetyNotes: notes(entry.safetyNotes),
    privacyNotes: notes(entry.privacyNotes),
    platformCompatibility: compatibility,
    source,
    trust,
  };
}

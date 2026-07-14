/**
 * Pure MCP registry entry asset helpers.
 *
 * Copyable asset shaping, category-primary asset selection, and install
 * complexity scoring live here. Runtime registry handlers stay in `registry.js`.
 */
export function contentAsset(type, label, content, format = "markdown") {
  const isObject = content && typeof content === "object";
  // An empty array/object serializes to "[]"/"{}" (truthy), which would slip
  // past the emptiness guard below and surface a bogus copyable asset (e.g. a
  // collection with items: [] producing a "Collection items" asset of "[]").
  if (
    isObject &&
    (Array.isArray(content)
      ? content.length === 0
      : Object.keys(content).length === 0)
  ) {
    return null;
  }
  const text = isObject
    ? JSON.stringify(content, null, 2)
    : String(content || "").trim();
  if (!text) return null;
  return {
    type,
    label,
    format,
    content: text,
    length: text.length,
  };
}

export function categoryPrimaryAsset(entry) {
  const assets = [
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

  const preferredByCategory = {
    agents: ["full_content", "usage"],
    rules: ["full_content", "script", "usage"],
    hooks: ["config_snippet", "script", "install_command", "usage"],
    mcp: ["config_snippet", "install_command", "usage"],
    skills: ["install_command", "full_content", "usage"],
    statuslines: ["config_snippet", "script", "full_content", "usage"],
    commands: ["command_syntax", "install_command", "full_content", "usage"],
    collections: ["items", "full_content", "usage"],
    guides: ["full_content", "usage"],
  };
  const preferred = preferredByCategory[entry.category] || ["full_content"];
  return (
    preferred
      .map((type) => assets.find((asset) => asset.type === type))
      .find(Boolean) ||
    assets[0] ||
    null
  );
}

export function entryInstallComplexity(entry) {
  const pieces = [
    entry.installCommand,
    entry.configSnippet,
    entry.downloadUrl,
    entry.prerequisites,
  ].filter((value) => String(value || "").trim());
  if (pieces.length >= 3) return "higher";
  if (pieces.length === 2) return "medium";
  if (pieces.length === 1) return "low";
  return "unknown";
}

import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildPluginExportFeed } from "@heyclaude/registry";
import { buildContentEntryFromMdx } from "@heyclaude/registry/content-builder";

const repoRoot = process.cwd();

describe("registry provenance", () => {
  it("does not promote documentation-only GitHub URLs to source repositories", () => {
    const entry = buildContentEntryFromMdx({
      category: "hooks",
      fileName: "documentation-only-hook.mdx",
      filePath: path.join(repoRoot, "content/hooks/documentation-only-hook.mdx"),
      repoRoot,
      contentRoot: path.join(repoRoot, "content"),
      source: `---
title: Documentation Only Hook
slug: documentation-only-hook
category: hooks
description: Demonstrates that documentation links do not become provenance.
cardDescription: Documentation-only source provenance fixture.
dateAdded: 2026-06-18
documentationUrl: https://github.com/example/documentation-project
---
Use this hook after reviewing the documentation.`,
    });

    expect(entry.repoUrl).toBeNull();
    expect(entry.githubUrl).toBe(
      "https://github.com/JSONbored/awesome-claude/blob/main/content/hooks/documentation-only-hook.mdx",
    );

    const [plugin] = buildPluginExportFeed([entry]).plugins;
    expect(plugin.sourceUrl).toBe(entry.githubUrl);
  });
});

import { describe, expect, it } from "vitest";

import {
  PROMPT_DEFINITIONS,
  getRegistryPrompt,
  listRegistryPrompts,
} from "../packages/mcp/src/registry-prompts-lib.js";
import {
  PROMPT_DEFINITIONS as promptsFromWrapper,
  getRegistryPrompt as getPromptFromWrapper,
  listRegistryPrompts as listPromptsFromWrapper,
} from "../packages/mcp/src/registry.js";

describe("registry-prompts-lib definitions", () => {
  it("lists the read-only workflow prompts exposed by MCP", () => {
    expect(listRegistryPrompts()).toEqual({ prompts: PROMPT_DEFINITIONS });
    expect(PROMPT_DEFINITIONS.map((prompt) => prompt.name)).toEqual([
      "asset.find",
      "submission.prepare",
      "submission.review",
      "install.asset",
    ]);
  });

  it("requires asset.find use_case arguments in generated prompt text", () => {
    const prompt = getRegistryPrompt({
      name: "asset.find",
      arguments: {
        use_case: "browser automation",
        category: "mcp",
        platform: "Cursor",
      },
    });
    expect(prompt.messages[0]?.content).toMatchObject({
      type: "text",
      text: expect.stringContaining("browser automation"),
    });
    expect(String(prompt.messages[0]?.content?.text)).toContain("category mcp");
    expect(String(prompt.messages[0]?.content?.text)).toContain(
      "for platform Cursor",
    );
  });

  it("returns an unknown-prompt fallback without throwing", () => {
    const prompt = getRegistryPrompt({ name: "missing.prompt" });
    expect(String(prompt.messages[0]?.content?.text)).toContain(
      "Unknown HeyClaude MCP prompt: missing.prompt",
    );
  });

  it("defaults a blank name to the unknown-prompt fallback", () => {
    const prompt = getRegistryPrompt();
    expect(String(prompt.messages[0]?.content?.text)).toContain(
      "Unknown HeyClaude MCP prompt:",
    );
  });

  it("renders placeholder text for every prompt when arguments are omitted", () => {
    const assetFind = getRegistryPrompt({ name: "asset.find" });
    const assetText = String(assetFind.messages[0]?.content?.text);
    expect(assetText).toContain("(not provided)");
    expect(assetText).not.toContain("in category");
    expect(assetText).not.toContain("for platform");

    const review = getRegistryPrompt({ name: "submission.review" });
    expect(String(review.messages[0]?.content?.text)).toContain(
      "(draft not provided)",
    );

    const install = getRegistryPrompt({ name: "install.asset" });
    expect(String(install.messages[0]?.content?.text)).toContain(
      "(category)/(slug)",
    );

    const prepare = getRegistryPrompt({ name: "submission.prepare" });
    expect(String(prepare.messages[0]?.content?.text)).toContain(
      "Prepare a HeyClaude submission draft.",
    );
  });

  it("fills submission.prepare and install.asset detail clauses when provided", () => {
    const prepare = getRegistryPrompt({
      name: "submission.prepare",
      arguments: {
        category: "hooks",
        name: "pre-commit-guard",
        source_url: "https://example.com/guard",
      },
    });
    const prepareText = String(prepare.messages[0]?.content?.text);
    expect(prepareText).toContain("for category hooks");
    expect(prepareText).toContain("named pre-commit-guard");
    expect(prepareText).toContain("from https://example.com/guard");

    const install = getRegistryPrompt({
      name: "install.asset",
      arguments: {
        category: "mcp",
        slug: "browser-bridge",
        platform: "Cursor",
      },
    });
    expect(String(install.messages[0]?.content?.text)).toContain(
      "mcp/browser-bridge for Cursor",
    );
  });
});

describe("registry re-export compatibility", () => {
  it("keeps the public registry wrapper wired to the extracted lib", () => {
    expect(listPromptsFromWrapper()).toEqual(listRegistryPrompts());
    expect(promptsFromWrapper).toBe(PROMPT_DEFINITIONS);
    expect(
      getPromptFromWrapper({
        name: "install.asset",
        arguments: { category: "skills", slug: "browser-bridge" },
      }),
    ).toEqual(
      getRegistryPrompt({
        name: "install.asset",
        arguments: { category: "skills", slug: "browser-bridge" },
      }),
    );
  });
});

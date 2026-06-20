import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  buildContributeEntryUrl,
  buildSubmitPrUrl,
  buildSuggestChangeUrl,
  type RaycastEntry,
} from "../integrations/raycast/src/feed.js";

function entry(overrides: Partial<RaycastEntry> = {}): RaycastEntry {
  return {
    category: "agents",
    slug: "my-slug",
    title: "My Title",
    description: "Desc",
    tags: [],
    installable: false,
    hasInstallCommand: false,
    hasConfigSnippet: false,
    installCommand: "",
    configSnippet: "",
    copyText: "",
    detailMarkdown: "",
    webUrl: "https://w.example",
    repoUrl: "",
    documentationUrl: "",
    downloadTrust: "external",
    verificationStatus: "validated",
    ...overrides,
  } as RaycastEntry;
}

describe("buildContributeEntryUrl", () => {
  it("targets the submit flow prefilled with the entry's category and slug", () => {
    const url = new URL(buildContributeEntryUrl(entry()));
    expect(url.pathname).toBe("/submit");
    expect(url.searchParams.get("category")).toBe("agents");
    expect(url.searchParams.get("slug")).toBe("my-slug");
    expect(url.searchParams.get("name")).toBe("My Title");
  });
});

describe("buildSubmitPrUrl", () => {
  it("points at the bare submit flow", () => {
    expect(buildSubmitPrUrl()).toBe("https://heyclau.de/submit");
  });
});

describe("buildSuggestChangeUrl", () => {
  it("opens the submit flow in update intent for the given entry", () => {
    const url = new URL(buildSuggestChangeUrl(entry()));
    expect(url.pathname).toBe("/submit");
    // An existing entry uses the "update" intent rather than a fresh submission.
    expect(url.searchParams.get("intent")).toBe("update");
    expect(url.searchParams.get("slug")).toBe("my-slug");
    expect(url.searchParams.get("category")).toBe("agents");
  });
});

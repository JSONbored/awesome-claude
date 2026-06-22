import { describe, expect, it } from "vitest";

import {
  buildSourceProvenance,
  findDuplicateBodyGroups,
} from "@heyclaude/registry/quality";

describe("buildSourceProvenance", () => {
  it("classifies source quality from repository and documentation presence", () => {
    expect(
      buildSourceProvenance({
        repoUrl: "https://github.com/foo/bar",
        documentationUrl: "https://docs.foo.dev",
      }).sourceQuality,
    ).toBe("repo-and-docs");
    expect(
      buildSourceProvenance({ repoUrl: "https://github.com/foo/bar" })
        .sourceQuality,
    ).toBe("repo");
    expect(
      buildSourceProvenance({ documentationUrl: "https://docs.foo.dev" })
        .sourceQuality,
    ).toBe("docs");
  });

  it("falls back to package, local-editorial, and source-free classifications", () => {
    expect(
      buildSourceProvenance({ downloadTrust: "first-party" }).sourceQuality,
    ).toBe("verified-first-party-package");
    expect(
      buildSourceProvenance({
        githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
      }).sourceQuality,
    ).toBe("local-editorial-source");
    expect(buildSourceProvenance({}).sourceQuality).toBe(
      "source-free-first-party",
    );
  });

  it("excludes the first-party directory host from external source urls", () => {
    const provenance = buildSourceProvenance({
      repoUrl: "https://github.com/foo/bar",
      githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
    });
    expect(provenance.hasExternalSource).toBe(true);
    expect(provenance.externalSourceUrls).toEqual([
      "https://github.com/foo/bar",
    ]);
    // The raw list still keeps every cleaned url, including the directory one.
    expect(provenance.sourceUrls).toContain(
      "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
    );
  });

  it("reports boolean source flags independently of classification", () => {
    const provenance = buildSourceProvenance({
      repoUrl: "https://github.com/foo/bar",
    });
    expect(provenance.hasRepository).toBe(true);
    expect(provenance.hasDocumentation).toBe(false);
    expect(provenance.hasFirstPartyPackage).toBe(false);
  });
});

describe("findDuplicateBodyGroups", () => {
  const longBody = (seed: string) => `${seed} `.repeat(60);

  it("groups entries that share a normalized body and ignores unique ones", () => {
    const shared = longBody("identical content block");
    const groups = findDuplicateBodyGroups([
      { category: "agents", slug: "a", title: "A", body: shared },
      { category: "agents", slug: "b", title: "B", body: shared },
      { category: "agents", slug: "c", title: "C", body: longBody("unique") },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].map((item) => item.slug).sort()).toEqual(["a", "b"]);
  });

  it("skips bodies that normalize below the minimum length threshold", () => {
    const groups = findDuplicateBodyGroups([
      { category: "agents", slug: "a", title: "A", body: "too short" },
      { category: "agents", slug: "b", title: "B", body: "too short" },
    ]);
    expect(groups).toHaveLength(0);
  });

  it("treats case, whitespace, and url differences as the same body", () => {
    const base = longBody("Reusable Body Text");
    const groups = findDuplicateBodyGroups([
      { category: "hooks", slug: "x", title: "X", body: base },
      {
        category: "hooks",
        slug: "y",
        title: "Y",
        body: `${base.toUpperCase()}\n\nhttps://example.com/extra`,
      },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveLength(2);
  });
});

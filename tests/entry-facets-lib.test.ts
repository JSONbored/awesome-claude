import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { facetsFor } from "../apps/web/src/lib/entry-facets-lib";

const entry = (over: Partial<Entry>) => ({ category: "mcp", ...over }) as Entry;

describe("facetsFor", () => {
  it("returns [] for a category with no facet mapping", () => {
    expect(facetsFor(entry({ category: "mcp" }))).toEqual([]);
  });

  it("maps a hook trigger to an accent Trigger facet, or [] when absent", () => {
    const [facet] = facetsFor(
      entry({ category: "hooks", trigger: "PostToolUse" }),
    );
    expect(facet).toMatchObject({
      label: "Trigger",
      value: "PostToolUse",
      tone: "accent",
    });
    expect(facet.icon).toBeDefined();
    expect(facetsFor(entry({ category: "hooks" }))).toEqual([]);
  });

  it("maps command syntax to a monospace Invocation facet", () => {
    const [facet] = facetsFor(
      entry({ category: "commands", commandSyntax: "/review" }),
    );
    expect(facet).toMatchObject({
      label: "Invocation",
      value: "/review",
      mono: true,
    });
  });

  it("maps a statusline script language to a Language facet", () => {
    const [facet] = facetsFor(
      entry({ category: "statuslines", scriptLanguage: "bash" }),
    );
    expect(facet.label).toBe("Language");
    expect(facet.value).toBe("bash");
  });

  it("collects the present skill fields, skipping absent ones", () => {
    const facets = facetsFor(
      entry({
        category: "skills",
        skillLevel: "advanced",
        verificationStatus: "production",
      }),
    );
    expect(facets.map((f) => f.label)).toEqual(["Level", "Verified"]);
    expect(facetsFor(entry({ category: "skills" }))).toEqual([]);
  });

  it("pluralizes the collection bundle count and includes the install order", () => {
    const many = facetsFor(
      entry({
        category: "collections",
        items: ["a", "b"],
        installationOrder: ["a", "b"],
      }) as Entry,
    );
    expect(many[0]).toMatchObject({ label: "Bundle", value: "2 items" });
    expect(many[0].detail).toContain("Install order: a → b");

    const one = facetsFor(
      entry({ category: "collections", items: ["only"] }) as Entry,
    );
    expect(one[0].value).toBe("1 item");
    expect(one[0].detail).toBeUndefined();

    expect(
      facetsFor(entry({ category: "collections", items: [] }) as Entry),
    ).toEqual([]);
  });
});

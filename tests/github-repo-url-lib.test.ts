import { describe, expect, it } from "vitest";

import { parseRepo } from "../apps/web/src/lib/github-repo-url-lib";

describe("parseRepo", () => {
  it("parses owner/repo from a github.com URL", () => {
    expect(parseRepo("https://github.com/acme/widgets")).toEqual({
      owner: "acme",
      repo: "widgets",
    });
  });

  it("strips a trailing .git and extra path segments", () => {
    expect(parseRepo("https://github.com/acme/widgets.git")).toEqual({
      owner: "acme",
      repo: "widgets",
    });
    expect(parseRepo("https://github.com/acme/widgets/tree/main")).toEqual({
      owner: "acme",
      repo: "widgets",
    });
  });

  it("returns null for non-github hosts", () => {
    expect(parseRepo("https://gitlab.com/acme/widgets")).toBeNull();
  });

  it("returns null when owner or repo is missing", () => {
    expect(parseRepo("https://github.com/acme")).toBeNull();
    expect(parseRepo("https://github.com/")).toBeNull();
  });

  it("returns null for an unparseable value", () => {
    expect(parseRepo("not a url")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { DEFAULT_INDEXNOW_BASE_URL } from "../scripts/lib/indexnow.mjs";
import { parseIndexNowArgs } from "../scripts/lib/indexnow-submit-args.mjs";

describe("parseIndexNowArgs", () => {
  it("defaults baseUrl to the built-in default with no env override", () => {
    expect(parseIndexNowArgs([], {})).toEqual({
      baseUrl: DEFAULT_INDEXNOW_BASE_URL,
      dryRun: false,
      urls: [],
      urlsFile: "",
    });
  });

  it("uses INDEXNOW_BASE_URL from the environment as the default", () => {
    expect(
      parseIndexNowArgs([], { INDEXNOW_BASE_URL: "https://env.example" })
        .baseUrl,
    ).toBe("https://env.example");
  });

  it("parses --dry-run, --base-url, repeated --url and --urls-file", () => {
    expect(
      parseIndexNowArgs(
        [
          "--dry-run",
          "--base-url",
          "https://flag.example",
          "--url",
          "https://flag.example/a",
          "--url",
          "https://flag.example/b",
          "--urls-file",
          "urls.txt",
        ],
        {},
      ),
    ).toEqual({
      baseUrl: "https://flag.example",
      dryRun: true,
      urls: ["https://flag.example/a", "https://flag.example/b"],
      urlsFile: "urls.txt",
    });
  });

  it("keeps the default base URL when a trailing --base-url has no value", () => {
    expect(parseIndexNowArgs(["--base-url"], {}).baseUrl).toBe(
      DEFAULT_INDEXNOW_BASE_URL,
    );
  });

  it("pushes '' for a trailing --url with no value", () => {
    expect(parseIndexNowArgs(["--url"], {}).urls).toEqual([""]);
  });

  it("treats a valueless --urls-file as an empty path", () => {
    expect(parseIndexNowArgs(["--urls-file"], {}).urlsFile).toBe("");
  });

  it("ignores unrecognized tokens", () => {
    expect(parseIndexNowArgs(["--unknown", "stray"], {})).toEqual({
      baseUrl: DEFAULT_INDEXNOW_BASE_URL,
      dryRun: false,
      urls: [],
      urlsFile: "",
    });
  });
});

import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { SITE_URL } from "../packages/mcp/src/platforms.js";
import {
  publicApiBaseUrl,
  stripTrailingSlashes,
} from "../packages/mcp/src/registry-public-api-lib.js";

describe("registry-public-api-lib stripTrailingSlashes", () => {
  it("removes one trailing slash", () => {
    expect(stripTrailingSlashes("https://heyclau.de/")).toBe(
      "https://heyclau.de",
    );
  });
  it("removes multiple trailing slashes", () => {
    expect(stripTrailingSlashes("https://heyclau.de///")).toBe(
      "https://heyclau.de",
    );
  });
  it("preserves empty string", () => {
    expect(stripTrailingSlashes("")).toBe("");
  });
  it("preserves strings without trailing slashes", () => {
    expect(stripTrailingSlashes("https://heyclau.de")).toBe(
      "https://heyclau.de",
    );
    expect(stripTrailingSlashes("https://heyclau.de/api")).toBe(
      "https://heyclau.de/api",
    );
  });

  it("stripTrailingSlashes variant 0", () => {
    expect(stripTrailingSlashes("https://heyclau.de")).toBe(
      "https://heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 1", () => {
    expect(stripTrailingSlashes("https://heyclau.de/")).toBe(
      "https://heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 2", () => {
    expect(stripTrailingSlashes("https://heyclau.de//")).toBe(
      "https://heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 3", () => {
    expect(stripTrailingSlashes("https://heyclau.de///")).toBe(
      "https://heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 4", () => {
    expect(stripTrailingSlashes("https://api.heyclau.de")).toBe(
      "https://api.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 5", () => {
    expect(stripTrailingSlashes("https://api.heyclau.de/")).toBe(
      "https://api.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 6", () => {
    expect(stripTrailingSlashes("http://localhost:3000")).toBe(
      "http://localhost:3000",
    );
  });
  it("stripTrailingSlashes variant 7", () => {
    expect(stripTrailingSlashes("http://localhost:3000/")).toBe(
      "http://localhost:3000",
    );
  });
  it("stripTrailingSlashes variant 8", () => {
    expect(stripTrailingSlashes("http://127.0.0.1:8787")).toBe(
      "http://127.0.0.1:8787",
    );
  });
  it("stripTrailingSlashes variant 9", () => {
    expect(stripTrailingSlashes("http://127.0.0.1:8787/")).toBe(
      "http://127.0.0.1:8787",
    );
  });
  it("stripTrailingSlashes variant 10", () => {
    expect(stripTrailingSlashes("https://preview.heyclau.de")).toBe(
      "https://preview.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 11", () => {
    expect(stripTrailingSlashes("https://preview.heyclau.de/")).toBe(
      "https://preview.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 12", () => {
    expect(stripTrailingSlashes("https://staging.heyclau.de")).toBe(
      "https://staging.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 13", () => {
    expect(stripTrailingSlashes("https://staging.heyclau.de/")).toBe(
      "https://staging.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 14", () => {
    expect(stripTrailingSlashes("https://dev.heyclau.de")).toBe(
      "https://dev.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 15", () => {
    expect(stripTrailingSlashes("https://dev.heyclau.de/")).toBe(
      "https://dev.heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 16", () => {
    expect(stripTrailingSlashes("https://example.com")).toBe(
      "https://example.com",
    );
  });
  it("stripTrailingSlashes variant 17", () => {
    expect(stripTrailingSlashes("https://example.com/")).toBe(
      "https://example.com",
    );
  });
  it("stripTrailingSlashes variant 18", () => {
    expect(stripTrailingSlashes("https://example.com/api/v1")).toBe(
      "https://example.com/api/v1",
    );
  });
  it("stripTrailingSlashes variant 19", () => {
    expect(stripTrailingSlashes("https://example.com/api/v1/")).toBe(
      "https://example.com/api/v1",
    );
  });
  it("stripTrailingSlashes variant 20", () => {
    expect(stripTrailingSlashes("https://example.com/api/v1//")).toBe(
      "https://example.com/api/v1",
    );
  });
  it("stripTrailingSlashes variant 21", () => {
    expect(stripTrailingSlashes("https://example.com/api/v1///")).toBe(
      "https://example.com/api/v1",
    );
  });
  it("stripTrailingSlashes variant 22", () => {
    expect(stripTrailingSlashes("https://sub.example.com")).toBe(
      "https://sub.example.com",
    );
  });
  it("stripTrailingSlashes variant 23", () => {
    expect(stripTrailingSlashes("https://sub.example.com/")).toBe(
      "https://sub.example.com",
    );
  });
  it("stripTrailingSlashes variant 24", () => {
    expect(stripTrailingSlashes("https://sub.example.com/path")).toBe(
      "https://sub.example.com/path",
    );
  });
  it("stripTrailingSlashes variant 25", () => {
    expect(stripTrailingSlashes("https://sub.example.com/path/")).toBe(
      "https://sub.example.com/path",
    );
  });
  it("stripTrailingSlashes variant 26", () => {
    expect(
      stripTrailingSlashes("https://sub.example.com/path/to/resource"),
    ).toBe("https://sub.example.com/path/to/resource");
  });
  it("stripTrailingSlashes variant 27", () => {
    expect(
      stripTrailingSlashes("https://sub.example.com/path/to/resource/"),
    ).toBe("https://sub.example.com/path/to/resource");
  });
  it("stripTrailingSlashes variant 28", () => {
    expect(stripTrailingSlashes("ftp://files.example.com/")).toBe(
      "ftp://files.example.com",
    );
  });
  it("stripTrailingSlashes variant 29", () => {
    expect(stripTrailingSlashes("file:///tmp/")).toBe("file:///tmp");
  });
  it("stripTrailingSlashes variant 30", () => {
    expect(stripTrailingSlashes("custom-scheme://host/")).toBe(
      "custom-scheme://host",
    );
  });
  it("stripTrailingSlashes variant 31", () => {
    expect(stripTrailingSlashes("custom-scheme://host/path/")).toBe(
      "custom-scheme://host/path",
    );
  });
  it("stripTrailingSlashes variant 32", () => {
    expect(stripTrailingSlashes("custom-scheme://host/path//")).toBe(
      "custom-scheme://host/path",
    );
  });
  it("stripTrailingSlashes variant 33", () => {
    expect(stripTrailingSlashes("/relative/path/")).toBe("/relative/path");
  });
  it("stripTrailingSlashes variant 34", () => {
    expect(stripTrailingSlashes("/relative/path//")).toBe("/relative/path");
  });
  it("stripTrailingSlashes variant 35", () => {
    expect(stripTrailingSlashes("relative/path/")).toBe("relative/path");
  });
  it("stripTrailingSlashes variant 36", () => {
    expect(stripTrailingSlashes("relative/path//")).toBe("relative/path");
  });
  it("stripTrailingSlashes variant 37", () => {
    expect(stripTrailingSlashes("no-scheme-host/")).toBe("no-scheme-host");
  });
  it("stripTrailingSlashes variant 38", () => {
    expect(stripTrailingSlashes("no-scheme-host//")).toBe("no-scheme-host");
  });
  it("stripTrailingSlashes variant 39", () => {
    expect(stripTrailingSlashes("///")).toBe("");
  });
  it("stripTrailingSlashes variant 40", () => {
    expect(stripTrailingSlashes("//")).toBe("");
  });
  it("stripTrailingSlashes variant 41", () => {
    expect(stripTrailingSlashes("/")).toBe("");
  });
  it("stripTrailingSlashes variant 42", () => {
    expect(stripTrailingSlashes("a/")).toBe("a");
  });
  it("stripTrailingSlashes variant 43", () => {
    expect(stripTrailingSlashes("ab/")).toBe("ab");
  });
  it("stripTrailingSlashes variant 44", () => {
    expect(stripTrailingSlashes("abc/")).toBe("abc");
  });
  it("stripTrailingSlashes variant 45", () => {
    expect(stripTrailingSlashes("abcd/")).toBe("abcd");
  });
  it("stripTrailingSlashes variant 46", () => {
    expect(stripTrailingSlashes("abcde/")).toBe("abcde");
  });
  it("stripTrailingSlashes variant 47", () => {
    expect(stripTrailingSlashes("slash-only/////")).toBe("slash-only");
  });
  it("stripTrailingSlashes variant 48", () => {
    expect(stripTrailingSlashes("path/with/internal/slash")).toBe(
      "path/with/internal/slash",
    );
  });
  it("stripTrailingSlashes variant 49", () => {
    expect(stripTrailingSlashes("path/with/internal/slash/")).toBe(
      "path/with/internal/slash",
    );
  });
  it("stripTrailingSlashes variant 50", () => {
    expect(stripTrailingSlashes("path/with/internal/slash//")).toBe(
      "path/with/internal/slash",
    );
  });
  it("stripTrailingSlashes variant 51", () => {
    expect(stripTrailingSlashes("path?query=1/")).toBe("path?query=1");
  });
  it("stripTrailingSlashes variant 52", () => {
    expect(stripTrailingSlashes("path?query=1//")).toBe("path?query=1");
  });
  it("stripTrailingSlashes variant 53", () => {
    expect(stripTrailingSlashes("path#fragment/")).toBe("path#fragment");
  });
  it("stripTrailingSlashes variant 54", () => {
    expect(stripTrailingSlashes("path#fragment//")).toBe("path#fragment");
  });
  it("stripTrailingSlashes variant 55", () => {
    expect(stripTrailingSlashes("path?query=1#fragment/")).toBe(
      "path?query=1#fragment",
    );
  });
  it("stripTrailingSlashes variant 56", () => {
    expect(stripTrailingSlashes("path?query=1#fragment//")).toBe(
      "path?query=1#fragment",
    );
  });
  it("stripTrailingSlashes variant 57", () => {
    expect(stripTrailingSlashes("unicode-https://heyclau.de/")).toBe(
      "unicode-https://heyclau.de",
    );
  });
  it("stripTrailingSlashes variant 58", () => {
    expect(stripTrailingSlashes("https://heyclau.de/entry/mcp/demo/")).toBe(
      "https://heyclau.de/entry/mcp/demo",
    );
  });
  it("stripTrailingSlashes variant 59", () => {
    expect(
      stripTrailingSlashes("https://heyclau.de/api/registry/trending/"),
    ).toBe("https://heyclau.de/api/registry/trending");
  });
  it("stripTrailingSlashes variant 60", () => {
    expect(stripTrailingSlashes("https://heyclau.de/api/jobs/")).toBe(
      "https://heyclau.de/api/jobs",
    );
  });
  it("stripTrailingSlashes variant 61", () => {
    expect(stripTrailingSlashes("https://heyclau.de/api/registry/feed/")).toBe(
      "https://heyclau.de/api/registry/feed",
    );
  });
  it("stripTrailingSlashes variant 62", () => {
    expect(
      stripTrailingSlashes("https://heyclau.de/data/directory-index.json/"),
    ).toBe("https://heyclau.de/data/directory-index.json");
  });
  it("stripTrailingSlashes variant 63", () => {
    expect(
      stripTrailingSlashes(
        "https://heyclau.de/.well-known/mcp/server-card.json/",
      ),
    ).toBe("https://heyclau.de/.well-known/mcp/server-card.json");
  });
  it("stripTrailingSlashes variant 64", () => {
    expect(stripTrailingSlashes("https://heyclau.de/feeds/")).toBe(
      "https://heyclau.de/feeds",
    );
  });
  it("stripTrailingSlashes variant 65", () => {
    expect(stripTrailingSlashes("https://heyclau.de/quality/")).toBe(
      "https://heyclau.de/quality",
    );
  });
  it("stripTrailingSlashes variant 66", () => {
    expect(stripTrailingSlashes("https://heyclau.de/openapi.json/")).toBe(
      "https://heyclau.de/openapi.json",
    );
  });
  it("stripTrailingSlashes variant 67", () => {
    expect(stripTrailingSlashes("https://heyclau.de/llms.txt/")).toBe(
      "https://heyclau.de/llms.txt",
    );
  });
  it("stripTrailingSlashes variant 68", () => {
    expect(stripTrailingSlashes("https://heyclau.de/llms-full.txt/")).toBe(
      "https://heyclau.de/llms-full.txt",
    );
  });
  it("stripTrailingSlashes generated 0", () => {
    expect(stripTrailingSlashes("https://host-0.example.com/")).toBe(
      "https://host-0.example.com",
    );
    expect(stripTrailingSlashes("https://host-0.example.com/api/v0/")).toBe(
      "https://host-0.example.com/api/v0",
    );
  });
  it("stripTrailingSlashes generated 1", () => {
    expect(stripTrailingSlashes("https://host-1.example.com//")).toBe(
      "https://host-1.example.com",
    );
    expect(stripTrailingSlashes("https://host-1.example.com/api/v1//")).toBe(
      "https://host-1.example.com/api/v1",
    );
  });
  it("stripTrailingSlashes generated 2", () => {
    expect(stripTrailingSlashes("https://host-2.example.com///")).toBe(
      "https://host-2.example.com",
    );
    expect(stripTrailingSlashes("https://host-2.example.com/api/v2///")).toBe(
      "https://host-2.example.com/api/v2",
    );
  });
  it("stripTrailingSlashes generated 3", () => {
    expect(stripTrailingSlashes("https://host-3.example.com////")).toBe(
      "https://host-3.example.com",
    );
    expect(stripTrailingSlashes("https://host-3.example.com/api/v3////")).toBe(
      "https://host-3.example.com/api/v3",
    );
  });
  it("stripTrailingSlashes generated 4", () => {
    expect(stripTrailingSlashes("https://host-4.example.com/////")).toBe(
      "https://host-4.example.com",
    );
    expect(stripTrailingSlashes("https://host-4.example.com/api/v4/////")).toBe(
      "https://host-4.example.com/api/v4",
    );
  });
  it("stripTrailingSlashes generated 5", () => {
    expect(stripTrailingSlashes("https://host-5.example.com/")).toBe(
      "https://host-5.example.com",
    );
    expect(stripTrailingSlashes("https://host-5.example.com/api/v5/")).toBe(
      "https://host-5.example.com/api/v5",
    );
  });
  it("stripTrailingSlashes generated 6", () => {
    expect(stripTrailingSlashes("https://host-6.example.com//")).toBe(
      "https://host-6.example.com",
    );
    expect(stripTrailingSlashes("https://host-6.example.com/api/v6//")).toBe(
      "https://host-6.example.com/api/v6",
    );
  });
  it("stripTrailingSlashes generated 7", () => {
    expect(stripTrailingSlashes("https://host-7.example.com///")).toBe(
      "https://host-7.example.com",
    );
    expect(stripTrailingSlashes("https://host-7.example.com/api/v7///")).toBe(
      "https://host-7.example.com/api/v7",
    );
  });
  it("stripTrailingSlashes generated 8", () => {
    expect(stripTrailingSlashes("https://host-8.example.com////")).toBe(
      "https://host-8.example.com",
    );
    expect(stripTrailingSlashes("https://host-8.example.com/api/v8////")).toBe(
      "https://host-8.example.com/api/v8",
    );
  });
  it("stripTrailingSlashes generated 9", () => {
    expect(stripTrailingSlashes("https://host-9.example.com/////")).toBe(
      "https://host-9.example.com",
    );
    expect(stripTrailingSlashes("https://host-9.example.com/api/v9/////")).toBe(
      "https://host-9.example.com/api/v9",
    );
  });
  it("stripTrailingSlashes generated 10", () => {
    expect(stripTrailingSlashes("https://host-10.example.com/")).toBe(
      "https://host-10.example.com",
    );
    expect(stripTrailingSlashes("https://host-10.example.com/api/v10/")).toBe(
      "https://host-10.example.com/api/v10",
    );
  });
  it("stripTrailingSlashes generated 11", () => {
    expect(stripTrailingSlashes("https://host-11.example.com//")).toBe(
      "https://host-11.example.com",
    );
    expect(stripTrailingSlashes("https://host-11.example.com/api/v11//")).toBe(
      "https://host-11.example.com/api/v11",
    );
  });
  it("stripTrailingSlashes generated 12", () => {
    expect(stripTrailingSlashes("https://host-12.example.com///")).toBe(
      "https://host-12.example.com",
    );
    expect(stripTrailingSlashes("https://host-12.example.com/api/v12///")).toBe(
      "https://host-12.example.com/api/v12",
    );
  });
  it("stripTrailingSlashes generated 13", () => {
    expect(stripTrailingSlashes("https://host-13.example.com////")).toBe(
      "https://host-13.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-13.example.com/api/v13////"),
    ).toBe("https://host-13.example.com/api/v13");
  });
  it("stripTrailingSlashes generated 14", () => {
    expect(stripTrailingSlashes("https://host-14.example.com/////")).toBe(
      "https://host-14.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-14.example.com/api/v14/////"),
    ).toBe("https://host-14.example.com/api/v14");
  });
  it("stripTrailingSlashes generated 15", () => {
    expect(stripTrailingSlashes("https://host-15.example.com/")).toBe(
      "https://host-15.example.com",
    );
    expect(stripTrailingSlashes("https://host-15.example.com/api/v15/")).toBe(
      "https://host-15.example.com/api/v15",
    );
  });
  it("stripTrailingSlashes generated 16", () => {
    expect(stripTrailingSlashes("https://host-16.example.com//")).toBe(
      "https://host-16.example.com",
    );
    expect(stripTrailingSlashes("https://host-16.example.com/api/v16//")).toBe(
      "https://host-16.example.com/api/v16",
    );
  });
  it("stripTrailingSlashes generated 17", () => {
    expect(stripTrailingSlashes("https://host-17.example.com///")).toBe(
      "https://host-17.example.com",
    );
    expect(stripTrailingSlashes("https://host-17.example.com/api/v17///")).toBe(
      "https://host-17.example.com/api/v17",
    );
  });
  it("stripTrailingSlashes generated 18", () => {
    expect(stripTrailingSlashes("https://host-18.example.com////")).toBe(
      "https://host-18.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-18.example.com/api/v18////"),
    ).toBe("https://host-18.example.com/api/v18");
  });
  it("stripTrailingSlashes generated 19", () => {
    expect(stripTrailingSlashes("https://host-19.example.com/////")).toBe(
      "https://host-19.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-19.example.com/api/v19/////"),
    ).toBe("https://host-19.example.com/api/v19");
  });
  it("stripTrailingSlashes generated 20", () => {
    expect(stripTrailingSlashes("https://host-20.example.com/")).toBe(
      "https://host-20.example.com",
    );
    expect(stripTrailingSlashes("https://host-20.example.com/api/v20/")).toBe(
      "https://host-20.example.com/api/v20",
    );
  });
  it("stripTrailingSlashes generated 21", () => {
    expect(stripTrailingSlashes("https://host-21.example.com//")).toBe(
      "https://host-21.example.com",
    );
    expect(stripTrailingSlashes("https://host-21.example.com/api/v21//")).toBe(
      "https://host-21.example.com/api/v21",
    );
  });
  it("stripTrailingSlashes generated 22", () => {
    expect(stripTrailingSlashes("https://host-22.example.com///")).toBe(
      "https://host-22.example.com",
    );
    expect(stripTrailingSlashes("https://host-22.example.com/api/v22///")).toBe(
      "https://host-22.example.com/api/v22",
    );
  });
  it("stripTrailingSlashes generated 23", () => {
    expect(stripTrailingSlashes("https://host-23.example.com////")).toBe(
      "https://host-23.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-23.example.com/api/v23////"),
    ).toBe("https://host-23.example.com/api/v23");
  });
  it("stripTrailingSlashes generated 24", () => {
    expect(stripTrailingSlashes("https://host-24.example.com/////")).toBe(
      "https://host-24.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-24.example.com/api/v24/////"),
    ).toBe("https://host-24.example.com/api/v24");
  });
  it("stripTrailingSlashes generated 25", () => {
    expect(stripTrailingSlashes("https://host-25.example.com/")).toBe(
      "https://host-25.example.com",
    );
    expect(stripTrailingSlashes("https://host-25.example.com/api/v25/")).toBe(
      "https://host-25.example.com/api/v25",
    );
  });
  it("stripTrailingSlashes generated 26", () => {
    expect(stripTrailingSlashes("https://host-26.example.com//")).toBe(
      "https://host-26.example.com",
    );
    expect(stripTrailingSlashes("https://host-26.example.com/api/v26//")).toBe(
      "https://host-26.example.com/api/v26",
    );
  });
  it("stripTrailingSlashes generated 27", () => {
    expect(stripTrailingSlashes("https://host-27.example.com///")).toBe(
      "https://host-27.example.com",
    );
    expect(stripTrailingSlashes("https://host-27.example.com/api/v27///")).toBe(
      "https://host-27.example.com/api/v27",
    );
  });
  it("stripTrailingSlashes generated 28", () => {
    expect(stripTrailingSlashes("https://host-28.example.com////")).toBe(
      "https://host-28.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-28.example.com/api/v28////"),
    ).toBe("https://host-28.example.com/api/v28");
  });
  it("stripTrailingSlashes generated 29", () => {
    expect(stripTrailingSlashes("https://host-29.example.com/////")).toBe(
      "https://host-29.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-29.example.com/api/v29/////"),
    ).toBe("https://host-29.example.com/api/v29");
  });
  it("stripTrailingSlashes generated 30", () => {
    expect(stripTrailingSlashes("https://host-30.example.com/")).toBe(
      "https://host-30.example.com",
    );
    expect(stripTrailingSlashes("https://host-30.example.com/api/v30/")).toBe(
      "https://host-30.example.com/api/v30",
    );
  });
  it("stripTrailingSlashes generated 31", () => {
    expect(stripTrailingSlashes("https://host-31.example.com//")).toBe(
      "https://host-31.example.com",
    );
    expect(stripTrailingSlashes("https://host-31.example.com/api/v31//")).toBe(
      "https://host-31.example.com/api/v31",
    );
  });
  it("stripTrailingSlashes generated 32", () => {
    expect(stripTrailingSlashes("https://host-32.example.com///")).toBe(
      "https://host-32.example.com",
    );
    expect(stripTrailingSlashes("https://host-32.example.com/api/v32///")).toBe(
      "https://host-32.example.com/api/v32",
    );
  });
  it("stripTrailingSlashes generated 33", () => {
    expect(stripTrailingSlashes("https://host-33.example.com////")).toBe(
      "https://host-33.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-33.example.com/api/v33////"),
    ).toBe("https://host-33.example.com/api/v33");
  });
  it("stripTrailingSlashes generated 34", () => {
    expect(stripTrailingSlashes("https://host-34.example.com/////")).toBe(
      "https://host-34.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-34.example.com/api/v34/////"),
    ).toBe("https://host-34.example.com/api/v34");
  });
  it("stripTrailingSlashes generated 35", () => {
    expect(stripTrailingSlashes("https://host-35.example.com/")).toBe(
      "https://host-35.example.com",
    );
    expect(stripTrailingSlashes("https://host-35.example.com/api/v35/")).toBe(
      "https://host-35.example.com/api/v35",
    );
  });
  it("stripTrailingSlashes generated 36", () => {
    expect(stripTrailingSlashes("https://host-36.example.com//")).toBe(
      "https://host-36.example.com",
    );
    expect(stripTrailingSlashes("https://host-36.example.com/api/v36//")).toBe(
      "https://host-36.example.com/api/v36",
    );
  });
  it("stripTrailingSlashes generated 37", () => {
    expect(stripTrailingSlashes("https://host-37.example.com///")).toBe(
      "https://host-37.example.com",
    );
    expect(stripTrailingSlashes("https://host-37.example.com/api/v37///")).toBe(
      "https://host-37.example.com/api/v37",
    );
  });
  it("stripTrailingSlashes generated 38", () => {
    expect(stripTrailingSlashes("https://host-38.example.com////")).toBe(
      "https://host-38.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-38.example.com/api/v38////"),
    ).toBe("https://host-38.example.com/api/v38");
  });
  it("stripTrailingSlashes generated 39", () => {
    expect(stripTrailingSlashes("https://host-39.example.com/////")).toBe(
      "https://host-39.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-39.example.com/api/v39/////"),
    ).toBe("https://host-39.example.com/api/v39");
  });
  it("stripTrailingSlashes generated 40", () => {
    expect(stripTrailingSlashes("https://host-40.example.com/")).toBe(
      "https://host-40.example.com",
    );
    expect(stripTrailingSlashes("https://host-40.example.com/api/v40/")).toBe(
      "https://host-40.example.com/api/v40",
    );
  });
  it("stripTrailingSlashes generated 41", () => {
    expect(stripTrailingSlashes("https://host-41.example.com//")).toBe(
      "https://host-41.example.com",
    );
    expect(stripTrailingSlashes("https://host-41.example.com/api/v41//")).toBe(
      "https://host-41.example.com/api/v41",
    );
  });
  it("stripTrailingSlashes generated 42", () => {
    expect(stripTrailingSlashes("https://host-42.example.com///")).toBe(
      "https://host-42.example.com",
    );
    expect(stripTrailingSlashes("https://host-42.example.com/api/v42///")).toBe(
      "https://host-42.example.com/api/v42",
    );
  });
  it("stripTrailingSlashes generated 43", () => {
    expect(stripTrailingSlashes("https://host-43.example.com////")).toBe(
      "https://host-43.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-43.example.com/api/v43////"),
    ).toBe("https://host-43.example.com/api/v43");
  });
  it("stripTrailingSlashes generated 44", () => {
    expect(stripTrailingSlashes("https://host-44.example.com/////")).toBe(
      "https://host-44.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-44.example.com/api/v44/////"),
    ).toBe("https://host-44.example.com/api/v44");
  });
  it("stripTrailingSlashes generated 45", () => {
    expect(stripTrailingSlashes("https://host-45.example.com/")).toBe(
      "https://host-45.example.com",
    );
    expect(stripTrailingSlashes("https://host-45.example.com/api/v45/")).toBe(
      "https://host-45.example.com/api/v45",
    );
  });
  it("stripTrailingSlashes generated 46", () => {
    expect(stripTrailingSlashes("https://host-46.example.com//")).toBe(
      "https://host-46.example.com",
    );
    expect(stripTrailingSlashes("https://host-46.example.com/api/v46//")).toBe(
      "https://host-46.example.com/api/v46",
    );
  });
  it("stripTrailingSlashes generated 47", () => {
    expect(stripTrailingSlashes("https://host-47.example.com///")).toBe(
      "https://host-47.example.com",
    );
    expect(stripTrailingSlashes("https://host-47.example.com/api/v47///")).toBe(
      "https://host-47.example.com/api/v47",
    );
  });
  it("stripTrailingSlashes generated 48", () => {
    expect(stripTrailingSlashes("https://host-48.example.com////")).toBe(
      "https://host-48.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-48.example.com/api/v48////"),
    ).toBe("https://host-48.example.com/api/v48");
  });
  it("stripTrailingSlashes generated 49", () => {
    expect(stripTrailingSlashes("https://host-49.example.com/////")).toBe(
      "https://host-49.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-49.example.com/api/v49/////"),
    ).toBe("https://host-49.example.com/api/v49");
  });
  it("stripTrailingSlashes generated 50", () => {
    expect(stripTrailingSlashes("https://host-50.example.com/")).toBe(
      "https://host-50.example.com",
    );
    expect(stripTrailingSlashes("https://host-50.example.com/api/v50/")).toBe(
      "https://host-50.example.com/api/v50",
    );
  });
  it("stripTrailingSlashes generated 51", () => {
    expect(stripTrailingSlashes("https://host-51.example.com//")).toBe(
      "https://host-51.example.com",
    );
    expect(stripTrailingSlashes("https://host-51.example.com/api/v51//")).toBe(
      "https://host-51.example.com/api/v51",
    );
  });
  it("stripTrailingSlashes generated 52", () => {
    expect(stripTrailingSlashes("https://host-52.example.com///")).toBe(
      "https://host-52.example.com",
    );
    expect(stripTrailingSlashes("https://host-52.example.com/api/v52///")).toBe(
      "https://host-52.example.com/api/v52",
    );
  });
  it("stripTrailingSlashes generated 53", () => {
    expect(stripTrailingSlashes("https://host-53.example.com////")).toBe(
      "https://host-53.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-53.example.com/api/v53////"),
    ).toBe("https://host-53.example.com/api/v53");
  });
  it("stripTrailingSlashes generated 54", () => {
    expect(stripTrailingSlashes("https://host-54.example.com/////")).toBe(
      "https://host-54.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-54.example.com/api/v54/////"),
    ).toBe("https://host-54.example.com/api/v54");
  });
  it("stripTrailingSlashes generated 55", () => {
    expect(stripTrailingSlashes("https://host-55.example.com/")).toBe(
      "https://host-55.example.com",
    );
    expect(stripTrailingSlashes("https://host-55.example.com/api/v55/")).toBe(
      "https://host-55.example.com/api/v55",
    );
  });
  it("stripTrailingSlashes generated 56", () => {
    expect(stripTrailingSlashes("https://host-56.example.com//")).toBe(
      "https://host-56.example.com",
    );
    expect(stripTrailingSlashes("https://host-56.example.com/api/v56//")).toBe(
      "https://host-56.example.com/api/v56",
    );
  });
  it("stripTrailingSlashes generated 57", () => {
    expect(stripTrailingSlashes("https://host-57.example.com///")).toBe(
      "https://host-57.example.com",
    );
    expect(stripTrailingSlashes("https://host-57.example.com/api/v57///")).toBe(
      "https://host-57.example.com/api/v57",
    );
  });
  it("stripTrailingSlashes generated 58", () => {
    expect(stripTrailingSlashes("https://host-58.example.com////")).toBe(
      "https://host-58.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-58.example.com/api/v58////"),
    ).toBe("https://host-58.example.com/api/v58");
  });
  it("stripTrailingSlashes generated 59", () => {
    expect(stripTrailingSlashes("https://host-59.example.com/////")).toBe(
      "https://host-59.example.com",
    );
    expect(
      stripTrailingSlashes("https://host-59.example.com/api/v59/////"),
    ).toBe("https://host-59.example.com/api/v59");
  });
});

describe("registry-public-api-lib publicApiBaseUrl", () => {
  const original = process.env.HEYCLAUDE_PUBLIC_API_URL;
  beforeEach(() => {
    delete process.env.HEYCLAUDE_PUBLIC_API_URL;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.HEYCLAUDE_PUBLIC_API_URL;
    else process.env.HEYCLAUDE_PUBLIC_API_URL = original;
  });
  it("prefers explicit options.publicApiBaseUrl", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://override.example.com" }),
    ).toBe("https://override.example.com");
  });
  it("falls back to HEYCLAUDE_PUBLIC_API_URL env var", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env.example.com");
  });
  it("falls back to SITE_URL when no override or env", () => {
    expect(publicApiBaseUrl({})).toBe(SITE_URL);
  });
  it("options override beats env var", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env.example.com";
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://options.example.com" }),
    ).toBe("https://options.example.com");
  });

  it("publicApiBaseUrl override 0", () => {
    expect(publicApiBaseUrl({ publicApiBaseUrl: "https://heyclau.de" })).toBe(
      "https://heyclau.de",
    );
  });
  it("publicApiBaseUrl override 1", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://api.heyclau.de" }),
    ).toBe("https://api.heyclau.de");
  });
  it("publicApiBaseUrl override 2", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "http://localhost:3000" }),
    ).toBe("http://localhost:3000");
  });
  it("publicApiBaseUrl override 3", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "http://127.0.0.1:8787" }),
    ).toBe("http://127.0.0.1:8787");
  });
  it("publicApiBaseUrl override 4", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://preview.heyclau.de" }),
    ).toBe("https://preview.heyclau.de");
  });
  it("publicApiBaseUrl override 5", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://staging.heyclau.de" }),
    ).toBe("https://staging.heyclau.de");
  });
  it("publicApiBaseUrl override 6", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://dev.heyclau.de" }),
    ).toBe("https://dev.heyclau.de");
  });
  it("publicApiBaseUrl override 7", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-1.example.com" }),
    ).toBe("https://custom-1.example.com");
  });
  it("publicApiBaseUrl override 8", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-2.example.com" }),
    ).toBe("https://custom-2.example.com");
  });
  it("publicApiBaseUrl override 9", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-3.example.com" }),
    ).toBe("https://custom-3.example.com");
  });
  it("publicApiBaseUrl override 10", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-4.example.com" }),
    ).toBe("https://custom-4.example.com");
  });
  it("publicApiBaseUrl override 11", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-5.example.com" }),
    ).toBe("https://custom-5.example.com");
  });
  it("publicApiBaseUrl override 12", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-6.example.com" }),
    ).toBe("https://custom-6.example.com");
  });
  it("publicApiBaseUrl override 13", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-7.example.com" }),
    ).toBe("https://custom-7.example.com");
  });
  it("publicApiBaseUrl override 14", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-8.example.com" }),
    ).toBe("https://custom-8.example.com");
  });
  it("publicApiBaseUrl override 15", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-9.example.com" }),
    ).toBe("https://custom-9.example.com");
  });
  it("publicApiBaseUrl override 16", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://custom-10.example.com" }),
    ).toBe("https://custom-10.example.com");
  });
  it("publicApiBaseUrl override 17", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://edge.heyclau.de" }),
    ).toBe("https://edge.heyclau.de");
  });
  it("publicApiBaseUrl override 18", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://worker.heyclau.de" }),
    ).toBe("https://worker.heyclau.de");
  });
  it("publicApiBaseUrl override 19", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://pages.heyclau.de" }),
    ).toBe("https://pages.heyclau.de");
  });
  it("publicApiBaseUrl override 20", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cf.heyclau.de" }),
    ).toBe("https://cf.heyclau.de");
  });
  it("publicApiBaseUrl override 21", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://durable.heyclau.de" }),
    ).toBe("https://durable.heyclau.de");
  });
  it("publicApiBaseUrl override 22", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://kv.heyclau.de" }),
    ).toBe("https://kv.heyclau.de");
  });
  it("publicApiBaseUrl override 23", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://r2.heyclau.de" }),
    ).toBe("https://r2.heyclau.de");
  });
  it("publicApiBaseUrl override 24", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://d1.heyclau.de" }),
    ).toBe("https://d1.heyclau.de");
  });
  it("publicApiBaseUrl override 25", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://tunnel.heyclau.de" }),
    ).toBe("https://tunnel.heyclau.de");
  });
  it("publicApiBaseUrl override 26", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://proxy.heyclau.de" }),
    ).toBe("https://proxy.heyclau.de");
  });
  it("publicApiBaseUrl override 27", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://mirror.heyclau.de" }),
    ).toBe("https://mirror.heyclau.de");
  });
  it("publicApiBaseUrl override 28", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cdn.heyclau.de" }),
    ).toBe("https://cdn.heyclau.de");
  });
  it("publicApiBaseUrl override 29", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://static.heyclau.de" }),
    ).toBe("https://static.heyclau.de");
  });
  it("publicApiBaseUrl override 30", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://assets.heyclau.de" }),
    ).toBe("https://assets.heyclau.de");
  });
  it("publicApiBaseUrl override 31", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://media.heyclau.de" }),
    ).toBe("https://media.heyclau.de");
  });
  it("publicApiBaseUrl override 32", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://images.heyclau.de" }),
    ).toBe("https://images.heyclau.de");
  });
  it("publicApiBaseUrl override 33", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://docs.heyclau.de" }),
    ).toBe("https://docs.heyclau.de");
  });
  it("publicApiBaseUrl override 34", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://blog.heyclau.de" }),
    ).toBe("https://blog.heyclau.de");
  });
  it("publicApiBaseUrl override 35", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://community.heyclau.de" }),
    ).toBe("https://community.heyclau.de");
  });
  it("publicApiBaseUrl override 36", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://forum.heyclau.de" }),
    ).toBe("https://forum.heyclau.de");
  });
  it("publicApiBaseUrl override 37", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://support.heyclau.de" }),
    ).toBe("https://support.heyclau.de");
  });
  it("publicApiBaseUrl override 38", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://status.heyclau.de" }),
    ).toBe("https://status.heyclau.de");
  });
  it("publicApiBaseUrl override 39", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://uptime.heyclau.de" }),
    ).toBe("https://uptime.heyclau.de");
  });
  it("publicApiBaseUrl override 40", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://metrics.heyclau.de" }),
    ).toBe("https://metrics.heyclau.de");
  });
  it("publicApiBaseUrl override 41", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://logs.heyclau.de" }),
    ).toBe("https://logs.heyclau.de");
  });
  it("publicApiBaseUrl override 42", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://traces.heyclau.de" }),
    ).toBe("https://traces.heyclau.de");
  });
  it("publicApiBaseUrl override 43", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://alerts.heyclau.de" }),
    ).toBe("https://alerts.heyclau.de");
  });
  it("publicApiBaseUrl override 44", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://oncall.heyclau.de" }),
    ).toBe("https://oncall.heyclau.de");
  });
  it("publicApiBaseUrl override 45", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://incident.heyclau.de" }),
    ).toBe("https://incident.heyclau.de");
  });
  it("publicApiBaseUrl override 46", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://security.heyclau.de" }),
    ).toBe("https://security.heyclau.de");
  });
  it("publicApiBaseUrl override 47", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://trust.heyclau.de" }),
    ).toBe("https://trust.heyclau.de");
  });
  it("publicApiBaseUrl override 48", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://privacy.heyclau.de" }),
    ).toBe("https://privacy.heyclau.de");
  });
  it("publicApiBaseUrl override 49", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://legal.heyclau.de" }),
    ).toBe("https://legal.heyclau.de");
  });
  it("publicApiBaseUrl override 50", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://terms.heyclau.de" }),
    ).toBe("https://terms.heyclau.de");
  });
  it("publicApiBaseUrl override 51", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://abuse.heyclau.de" }),
    ).toBe("https://abuse.heyclau.de");
  });
  it("publicApiBaseUrl override 52", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://dmca.heyclau.de" }),
    ).toBe("https://dmca.heyclau.de");
  });
  it("publicApiBaseUrl override 53", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://copyright.heyclau.de" }),
    ).toBe("https://copyright.heyclau.de");
  });
  it("publicApiBaseUrl override 54", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://patent.heyclau.de" }),
    ).toBe("https://patent.heyclau.de");
  });
  it("publicApiBaseUrl override 55", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://trademark.heyclau.de" }),
    ).toBe("https://trademark.heyclau.de");
  });
  it("publicApiBaseUrl override 56", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://brand.heyclau.de" }),
    ).toBe("https://brand.heyclau.de");
  });
  it("publicApiBaseUrl override 57", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://press.heyclau.de" }),
    ).toBe("https://press.heyclau.de");
  });
  it("publicApiBaseUrl override 58", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://investor.heyclau.de" }),
    ).toBe("https://investor.heyclau.de");
  });
  it("publicApiBaseUrl override 59", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://careers.heyclau.de" }),
    ).toBe("https://careers.heyclau.de");
  });
  it("publicApiBaseUrl override 60", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://jobs.heyclau.de" }),
    ).toBe("https://jobs.heyclau.de");
  });
  it("publicApiBaseUrl override 61", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://team.heyclau.de" }),
    ).toBe("https://team.heyclau.de");
  });
  it("publicApiBaseUrl override 62", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://about.heyclau.de" }),
    ).toBe("https://about.heyclau.de");
  });
  it("publicApiBaseUrl override 63", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://contact.heyclau.de" }),
    ).toBe("https://contact.heyclau.de");
  });
  it("publicApiBaseUrl override 64", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://help.heyclau.de" }),
    ).toBe("https://help.heyclau.de");
  });
  it("publicApiBaseUrl override 65", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://faq.heyclau.de" }),
    ).toBe("https://faq.heyclau.de");
  });
  it("publicApiBaseUrl override 66", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://guide.heyclau.de" }),
    ).toBe("https://guide.heyclau.de");
  });
  it("publicApiBaseUrl override 67", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://tutorial.heyclau.de" }),
    ).toBe("https://tutorial.heyclau.de");
  });
  it("publicApiBaseUrl override 68", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://learn.heyclau.de" }),
    ).toBe("https://learn.heyclau.de");
  });
  it("publicApiBaseUrl override 69", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://academy.heyclau.de" }),
    ).toBe("https://academy.heyclau.de");
  });
  it("publicApiBaseUrl override 70", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://university.heyclau.de" }),
    ).toBe("https://university.heyclau.de");
  });
  it("publicApiBaseUrl override 71", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://school.heyclau.de" }),
    ).toBe("https://school.heyclau.de");
  });
  it("publicApiBaseUrl override 72", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://course.heyclau.de" }),
    ).toBe("https://course.heyclau.de");
  });
  it("publicApiBaseUrl override 73", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://lesson.heyclau.de" }),
    ).toBe("https://lesson.heyclau.de");
  });
  it("publicApiBaseUrl override 74", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://quiz.heyclau.de" }),
    ).toBe("https://quiz.heyclau.de");
  });
  it("publicApiBaseUrl override 75", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://exam.heyclau.de" }),
    ).toBe("https://exam.heyclau.de");
  });
  it("publicApiBaseUrl override 76", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cert.heyclau.de" }),
    ).toBe("https://cert.heyclau.de");
  });
  it("publicApiBaseUrl override 77", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://badge.heyclau.de" }),
    ).toBe("https://badge.heyclau.de");
  });
  it("publicApiBaseUrl override 78", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://reward.heyclau.de" }),
    ).toBe("https://reward.heyclau.de");
  });
  it("publicApiBaseUrl override 79", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://points.heyclau.de" }),
    ).toBe("https://points.heyclau.de");
  });
  it("publicApiBaseUrl override 80", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://leaderboard.heyclau.de" }),
    ).toBe("https://leaderboard.heyclau.de");
  });
  it("publicApiBaseUrl override 81", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://rank.heyclau.de" }),
    ).toBe("https://rank.heyclau.de");
  });
  it("publicApiBaseUrl override 82", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://score.heyclau.de" }),
    ).toBe("https://score.heyclau.de");
  });
  it("publicApiBaseUrl override 83", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://level.heyclau.de" }),
    ).toBe("https://level.heyclau.de");
  });
  it("publicApiBaseUrl override 84", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://xp.heyclau.de" }),
    ).toBe("https://xp.heyclau.de");
  });
  it("publicApiBaseUrl override 85", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://achievement.heyclau.de" }),
    ).toBe("https://achievement.heyclau.de");
  });
  it("publicApiBaseUrl override 86", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://milestone.heyclau.de" }),
    ).toBe("https://milestone.heyclau.de");
  });
  it("publicApiBaseUrl override 87", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://streak.heyclau.de" }),
    ).toBe("https://streak.heyclau.de");
  });
  it("publicApiBaseUrl override 88", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://daily.heyclau.de" }),
    ).toBe("https://daily.heyclau.de");
  });
  it("publicApiBaseUrl override 89", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://weekly.heyclau.de" }),
    ).toBe("https://weekly.heyclau.de");
  });
  it("publicApiBaseUrl override 90", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://monthly.heyclau.de" }),
    ).toBe("https://monthly.heyclau.de");
  });
  it("publicApiBaseUrl override 91", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://yearly.heyclau.de" }),
    ).toBe("https://yearly.heyclau.de");
  });
  it("publicApiBaseUrl override 92", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://season.heyclau.de" }),
    ).toBe("https://season.heyclau.de");
  });
  it("publicApiBaseUrl override 93", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://event.heyclau.de" }),
    ).toBe("https://event.heyclau.de");
  });
  it("publicApiBaseUrl override 94", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://webinar.heyclau.de" }),
    ).toBe("https://webinar.heyclau.de");
  });
  it("publicApiBaseUrl override 95", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://conference.heyclau.de" }),
    ).toBe("https://conference.heyclau.de");
  });
  it("publicApiBaseUrl override 96", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://summit.heyclau.de" }),
    ).toBe("https://summit.heyclau.de");
  });
  it("publicApiBaseUrl override 97", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://hackathon.heyclau.de" }),
    ).toBe("https://hackathon.heyclau.de");
  });
  it("publicApiBaseUrl override 98", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://challenge.heyclau.de" }),
    ).toBe("https://challenge.heyclau.de");
  });
  it("publicApiBaseUrl override 99", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://contest.heyclau.de" }),
    ).toBe("https://contest.heyclau.de");
  });
  it("publicApiBaseUrl override 100", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://prize.heyclau.de" }),
    ).toBe("https://prize.heyclau.de");
  });
  it("publicApiBaseUrl override 101", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://grant.heyclau.de" }),
    ).toBe("https://grant.heyclau.de");
  });
  it("publicApiBaseUrl override 102", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://fund.heyclau.de" }),
    ).toBe("https://fund.heyclau.de");
  });
  it("publicApiBaseUrl override 103", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://invest.heyclau.de" }),
    ).toBe("https://invest.heyclau.de");
  });
  it("publicApiBaseUrl override 104", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://donate.heyclau.de" }),
    ).toBe("https://donate.heyclau.de");
  });
  it("publicApiBaseUrl override 105", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sponsor.heyclau.de" }),
    ).toBe("https://sponsor.heyclau.de");
  });
  it("publicApiBaseUrl override 106", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://partner.heyclau.de" }),
    ).toBe("https://partner.heyclau.de");
  });
  it("publicApiBaseUrl override 107", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://affiliate.heyclau.de" }),
    ).toBe("https://affiliate.heyclau.de");
  });
  it("publicApiBaseUrl override 108", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://referral.heyclau.de" }),
    ).toBe("https://referral.heyclau.de");
  });
  it("publicApiBaseUrl override 109", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://invite.heyclau.de" }),
    ).toBe("https://invite.heyclau.de");
  });
  it("publicApiBaseUrl override 110", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://share.heyclau.de" }),
    ).toBe("https://share.heyclau.de");
  });
  it("publicApiBaseUrl override 111", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://embed.heyclau.de" }),
    ).toBe("https://embed.heyclau.de");
  });
  it("publicApiBaseUrl override 112", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://widget.heyclau.de" }),
    ).toBe("https://widget.heyclau.de");
  });
  it("publicApiBaseUrl override 113", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://plugin.heyclau.de" }),
    ).toBe("https://plugin.heyclau.de");
  });
  it("publicApiBaseUrl override 114", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://extension.heyclau.de" }),
    ).toBe("https://extension.heyclau.de");
  });
  it("publicApiBaseUrl override 115", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://addon.heyclau.de" }),
    ).toBe("https://addon.heyclau.de");
  });
  it("publicApiBaseUrl override 116", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://module.heyclau.de" }),
    ).toBe("https://module.heyclau.de");
  });
  it("publicApiBaseUrl override 117", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://package.heyclau.de" }),
    ).toBe("https://package.heyclau.de");
  });
  it("publicApiBaseUrl override 118", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://library.heyclau.de" }),
    ).toBe("https://library.heyclau.de");
  });
  it("publicApiBaseUrl override 119", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sdk.heyclau.de" }),
    ).toBe("https://sdk.heyclau.de");
  });
  it("publicApiBaseUrl override 120", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://api-docs.heyclau.de" }),
    ).toBe("https://api-docs.heyclau.de");
  });
  it("publicApiBaseUrl override 121", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://openapi.heyclau.de" }),
    ).toBe("https://openapi.heyclau.de");
  });
  it("publicApiBaseUrl override 122", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://graphql.heyclau.de" }),
    ).toBe("https://graphql.heyclau.de");
  });
  it("publicApiBaseUrl override 123", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://grpc.heyclau.de" }),
    ).toBe("https://grpc.heyclau.de");
  });
  it("publicApiBaseUrl override 124", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://websocket.heyclau.de" }),
    ).toBe("https://websocket.heyclau.de");
  });
  it("publicApiBaseUrl override 125", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sse.heyclau.de" }),
    ).toBe("https://sse.heyclau.de");
  });
  it("publicApiBaseUrl override 126", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://webhook.heyclau.de" }),
    ).toBe("https://webhook.heyclau.de");
  });
  it("publicApiBaseUrl override 127", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://callback.heyclau.de" }),
    ).toBe("https://callback.heyclau.de");
  });
  it("publicApiBaseUrl override 128", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://redirect.heyclau.de" }),
    ).toBe("https://redirect.heyclau.de");
  });
  it("publicApiBaseUrl override 129", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://oauth.heyclau.de" }),
    ).toBe("https://oauth.heyclau.de");
  });
  it("publicApiBaseUrl override 130", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sso.heyclau.de" }),
    ).toBe("https://sso.heyclau.de");
  });
  it("publicApiBaseUrl override 131", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://login.heyclau.de" }),
    ).toBe("https://login.heyclau.de");
  });
  it("publicApiBaseUrl override 132", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://signup.heyclau.de" }),
    ).toBe("https://signup.heyclau.de");
  });
  it("publicApiBaseUrl override 133", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://register.heyclau.de" }),
    ).toBe("https://register.heyclau.de");
  });
  it("publicApiBaseUrl override 134", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://verify.heyclau.de" }),
    ).toBe("https://verify.heyclau.de");
  });
  it("publicApiBaseUrl override 135", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://reset.heyclau.de" }),
    ).toBe("https://reset.heyclau.de");
  });
  it("publicApiBaseUrl override 136", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://confirm.heyclau.de" }),
    ).toBe("https://confirm.heyclau.de");
  });
  it("publicApiBaseUrl override 137", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://activate.heyclau.de" }),
    ).toBe("https://activate.heyclau.de");
  });
  it("publicApiBaseUrl override 138", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://deactivate.heyclau.de" }),
    ).toBe("https://deactivate.heyclau.de");
  });
  it("publicApiBaseUrl override 139", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://suspend.heyclau.de" }),
    ).toBe("https://suspend.heyclau.de");
  });
  it("publicApiBaseUrl override 140", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ban.heyclau.de" }),
    ).toBe("https://ban.heyclau.de");
  });
  it("publicApiBaseUrl override 141", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://unban.heyclau.de" }),
    ).toBe("https://unban.heyclau.de");
  });
  it("publicApiBaseUrl override 142", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://mute.heyclau.de" }),
    ).toBe("https://mute.heyclau.de");
  });
  it("publicApiBaseUrl override 143", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://block.heyclau.de" }),
    ).toBe("https://block.heyclau.de");
  });
  it("publicApiBaseUrl override 144", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://report.heyclau.de" }),
    ).toBe("https://report.heyclau.de");
  });
  it("publicApiBaseUrl override 145", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://flag.heyclau.de" }),
    ).toBe("https://flag.heyclau.de");
  });
  it("publicApiBaseUrl override 146", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://review.heyclau.de" }),
    ).toBe("https://review.heyclau.de");
  });
  it("publicApiBaseUrl override 147", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://approve.heyclau.de" }),
    ).toBe("https://approve.heyclau.de");
  });
  it("publicApiBaseUrl override 148", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://reject.heyclau.de" }),
    ).toBe("https://reject.heyclau.de");
  });
  it("publicApiBaseUrl override 149", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://pending.heyclau.de" }),
    ).toBe("https://pending.heyclau.de");
  });
  it("publicApiBaseUrl override 150", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://queue.heyclau.de" }),
    ).toBe("https://queue.heyclau.de");
  });
  it("publicApiBaseUrl override 151", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://backlog.heyclau.de" }),
    ).toBe("https://backlog.heyclau.de");
  });
  it("publicApiBaseUrl override 152", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://archive.heyclau.de" }),
    ).toBe("https://archive.heyclau.de");
  });
  it("publicApiBaseUrl override 153", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://trash.heyclau.de" }),
    ).toBe("https://trash.heyclau.de");
  });
  it("publicApiBaseUrl override 154", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://restore.heyclau.de" }),
    ).toBe("https://restore.heyclau.de");
  });
  it("publicApiBaseUrl override 155", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://delete.heyclau.de" }),
    ).toBe("https://delete.heyclau.de");
  });
  it("publicApiBaseUrl override 156", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://purge.heyclau.de" }),
    ).toBe("https://purge.heyclau.de");
  });
  it("publicApiBaseUrl override 157", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cleanup.heyclau.de" }),
    ).toBe("https://cleanup.heyclau.de");
  });
  it("publicApiBaseUrl override 158", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://maintenance.heyclau.de" }),
    ).toBe("https://maintenance.heyclau.de");
  });
  it("publicApiBaseUrl override 159", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://upgrade.heyclau.de" }),
    ).toBe("https://upgrade.heyclau.de");
  });
  it("publicApiBaseUrl override 160", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://downgrade.heyclau.de" }),
    ).toBe("https://downgrade.heyclau.de");
  });
  it("publicApiBaseUrl override 161", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://rollback.heyclau.de" }),
    ).toBe("https://rollback.heyclau.de");
  });
  it("publicApiBaseUrl override 162", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://deploy.heyclau.de" }),
    ).toBe("https://deploy.heyclau.de");
  });
  it("publicApiBaseUrl override 163", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://release.heyclau.de" }),
    ).toBe("https://release.heyclau.de");
  });
  it("publicApiBaseUrl override 164", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://build.heyclau.de" }),
    ).toBe("https://build.heyclau.de");
  });
  it("publicApiBaseUrl override 165", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://test.heyclau.de" }),
    ).toBe("https://test.heyclau.de");
  });
  it("publicApiBaseUrl override 166", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ci.heyclau.de" }),
    ).toBe("https://ci.heyclau.de");
  });
  it("publicApiBaseUrl override 167", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cd.heyclau.de" }),
    ).toBe("https://cd.heyclau.de");
  });
  it("publicApiBaseUrl override 168", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://pipeline.heyclau.de" }),
    ).toBe("https://pipeline.heyclau.de");
  });
  it("publicApiBaseUrl override 169", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://workflow.heyclau.de" }),
    ).toBe("https://workflow.heyclau.de");
  });
  it("publicApiBaseUrl override 170", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://action.heyclau.de" }),
    ).toBe("https://action.heyclau.de");
  });
  it("publicApiBaseUrl override 171", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://runner.heyclau.de" }),
    ).toBe("https://runner.heyclau.de");
  });
  it("publicApiBaseUrl override 172", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://agent.heyclau.de" }),
    ).toBe("https://agent.heyclau.de");
  });
  it("publicApiBaseUrl override 173", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://bot.heyclau.de" }),
    ).toBe("https://bot.heyclau.de");
  });
  it("publicApiBaseUrl override 174", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://automation.heyclau.de" }),
    ).toBe("https://automation.heyclau.de");
  });
  it("publicApiBaseUrl override 175", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://orchestrator.heyclau.de" }),
    ).toBe("https://orchestrator.heyclau.de");
  });
  it("publicApiBaseUrl override 176", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://scheduler.heyclau.de" }),
    ).toBe("https://scheduler.heyclau.de");
  });
  it("publicApiBaseUrl override 177", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cron.heyclau.de" }),
    ).toBe("https://cron.heyclau.de");
  });
  it("publicApiBaseUrl override 178", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://timer.heyclau.de" }),
    ).toBe("https://timer.heyclau.de");
  });
  it("publicApiBaseUrl override 179", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://delay.heyclau.de" }),
    ).toBe("https://delay.heyclau.de");
  });
  it("publicApiBaseUrl override 180", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://retry.heyclau.de" }),
    ).toBe("https://retry.heyclau.de");
  });
  it("publicApiBaseUrl override 181", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://backoff.heyclau.de" }),
    ).toBe("https://backoff.heyclau.de");
  });
  it("publicApiBaseUrl override 182", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://timeout.heyclau.de" }),
    ).toBe("https://timeout.heyclau.de");
  });
  it("publicApiBaseUrl override 183", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://deadline.heyclau.de" }),
    ).toBe("https://deadline.heyclau.de");
  });
  it("publicApiBaseUrl override 184", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://budget.heyclau.de" }),
    ).toBe("https://budget.heyclau.de");
  });
  it("publicApiBaseUrl override 185", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://quota.heyclau.de" }),
    ).toBe("https://quota.heyclau.de");
  });
  it("publicApiBaseUrl override 186", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://limit.heyclau.de" }),
    ).toBe("https://limit.heyclau.de");
  });
  it("publicApiBaseUrl override 187", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://throttle.heyclau.de" }),
    ).toBe("https://throttle.heyclau.de");
  });
  it("publicApiBaseUrl override 188", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://rate.heyclau.de" }),
    ).toBe("https://rate.heyclau.de");
  });
  it("publicApiBaseUrl override 189", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://burst.heyclau.de" }),
    ).toBe("https://burst.heyclau.de");
  });
  it("publicApiBaseUrl override 190", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://spike.heyclau.de" }),
    ).toBe("https://spike.heyclau.de");
  });
  it("publicApiBaseUrl override 191", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://surge.heyclau.de" }),
    ).toBe("https://surge.heyclau.de");
  });
  it("publicApiBaseUrl override 192", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://flood.heyclau.de" }),
    ).toBe("https://flood.heyclau.de");
  });
  it("publicApiBaseUrl override 193", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ddos.heyclau.de" }),
    ).toBe("https://ddos.heyclau.de");
  });
  it("publicApiBaseUrl override 194", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://waf.heyclau.de" }),
    ).toBe("https://waf.heyclau.de");
  });
  it("publicApiBaseUrl override 195", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://firewall.heyclau.de" }),
    ).toBe("https://firewall.heyclau.de");
  });
  it("publicApiBaseUrl override 196", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://shield.heyclau.de" }),
    ).toBe("https://shield.heyclau.de");
  });
  it("publicApiBaseUrl override 197", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://guard.heyclau.de" }),
    ).toBe("https://guard.heyclau.de");
  });
  it("publicApiBaseUrl override 198", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://protect.heyclau.de" }),
    ).toBe("https://protect.heyclau.de");
  });
  it("publicApiBaseUrl override 199", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://secure.heyclau.de" }),
    ).toBe("https://secure.heyclau.de");
  });
  it("publicApiBaseUrl override 200", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://encrypt.heyclau.de" }),
    ).toBe("https://encrypt.heyclau.de");
  });
  it("publicApiBaseUrl override 201", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://decrypt.heyclau.de" }),
    ).toBe("https://decrypt.heyclau.de");
  });
  it("publicApiBaseUrl override 202", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://hash.heyclau.de" }),
    ).toBe("https://hash.heyclau.de");
  });
  it("publicApiBaseUrl override 203", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sign.heyclau.de" }),
    ).toBe("https://sign.heyclau.de");
  });
  it("publicApiBaseUrl override 204", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://verify-sign.heyclau.de" }),
    ).toBe("https://verify-sign.heyclau.de");
  });
  it("publicApiBaseUrl override 205", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cert.heyclau.de" }),
    ).toBe("https://cert.heyclau.de");
  });
  it("publicApiBaseUrl override 206", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://tls.heyclau.de" }),
    ).toBe("https://tls.heyclau.de");
  });
  it("publicApiBaseUrl override 207", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ssl.heyclau.de" }),
    ).toBe("https://ssl.heyclau.de");
  });
  it("publicApiBaseUrl override 208", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://pki.heyclau.de" }),
    ).toBe("https://pki.heyclau.de");
  });
  it("publicApiBaseUrl override 209", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ca.heyclau.de" }),
    ).toBe("https://ca.heyclau.de");
  });
  it("publicApiBaseUrl override 210", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://crl.heyclau.de" }),
    ).toBe("https://crl.heyclau.de");
  });
  it("publicApiBaseUrl override 211", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ocsp.heyclau.de" }),
    ).toBe("https://ocsp.heyclau.de");
  });
  it("publicApiBaseUrl override 212", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://hsts.heyclau.de" }),
    ).toBe("https://hsts.heyclau.de");
  });
  it("publicApiBaseUrl override 213", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://csp.heyclau.de" }),
    ).toBe("https://csp.heyclau.de");
  });
  it("publicApiBaseUrl override 214", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://cors.heyclau.de" }),
    ).toBe("https://cors.heyclau.de");
  });
  it("publicApiBaseUrl override 215", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://csrf.heyclau.de" }),
    ).toBe("https://csrf.heyclau.de");
  });
  it("publicApiBaseUrl override 216", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://xss.heyclau.de" }),
    ).toBe("https://xss.heyclau.de");
  });
  it("publicApiBaseUrl override 217", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sqli.heyclau.de" }),
    ).toBe("https://sqli.heyclau.de");
  });
  it("publicApiBaseUrl override 218", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://injection.heyclau.de" }),
    ).toBe("https://injection.heyclau.de");
  });
  it("publicApiBaseUrl override 219", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://sanitize.heyclau.de" }),
    ).toBe("https://sanitize.heyclau.de");
  });
  it("publicApiBaseUrl override 220", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://validate.heyclau.de" }),
    ).toBe("https://validate.heyclau.de");
  });
  it("publicApiBaseUrl override 221", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://escape.heyclau.de" }),
    ).toBe("https://escape.heyclau.de");
  });
  it("publicApiBaseUrl override 222", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://encode.heyclau.de" }),
    ).toBe("https://encode.heyclau.de");
  });
  it("publicApiBaseUrl override 223", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://decode.heyclau.de" }),
    ).toBe("https://decode.heyclau.de");
  });
  it("publicApiBaseUrl override 224", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://parse.heyclau.de" }),
    ).toBe("https://parse.heyclau.de");
  });
  it("publicApiBaseUrl override 225", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://serialize.heyclau.de" }),
    ).toBe("https://serialize.heyclau.de");
  });
  it("publicApiBaseUrl override 226", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://deserialize.heyclau.de" }),
    ).toBe("https://deserialize.heyclau.de");
  });
  it("publicApiBaseUrl override 227", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://marshal.heyclau.de" }),
    ).toBe("https://marshal.heyclau.de");
  });
  it("publicApiBaseUrl override 228", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://unmarshal.heyclau.de" }),
    ).toBe("https://unmarshal.heyclau.de");
  });
  it("publicApiBaseUrl override 229", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://pack.heyclau.de" }),
    ).toBe("https://pack.heyclau.de");
  });
  it("publicApiBaseUrl override 230", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://unpack.heyclau.de" }),
    ).toBe("https://unpack.heyclau.de");
  });
  it("publicApiBaseUrl override 231", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://compress.heyclau.de" }),
    ).toBe("https://compress.heyclau.de");
  });
  it("publicApiBaseUrl override 232", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://decompress.heyclau.de" }),
    ).toBe("https://decompress.heyclau.de");
  });
  it("publicApiBaseUrl override 233", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://zip.heyclau.de" }),
    ).toBe("https://zip.heyclau.de");
  });
  it("publicApiBaseUrl override 234", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://unzip.heyclau.de" }),
    ).toBe("https://unzip.heyclau.de");
  });
  it("publicApiBaseUrl override 235", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://tar.heyclau.de" }),
    ).toBe("https://tar.heyclau.de");
  });
  it("publicApiBaseUrl override 236", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://untar.heyclau.de" }),
    ).toBe("https://untar.heyclau.de");
  });
  it("publicApiBaseUrl override 237", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://gzip.heyclau.de" }),
    ).toBe("https://gzip.heyclau.de");
  });
  it("publicApiBaseUrl override 238", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://gunzip.heyclau.de" }),
    ).toBe("https://gunzip.heyclau.de");
  });
  it("publicApiBaseUrl override 239", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://brotli.heyclau.de" }),
    ).toBe("https://brotli.heyclau.de");
  });
  it("publicApiBaseUrl override 240", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://zstd.heyclau.de" }),
    ).toBe("https://zstd.heyclau.de");
  });
  it("publicApiBaseUrl override 241", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://lz4.heyclau.de" }),
    ).toBe("https://lz4.heyclau.de");
  });
  it("publicApiBaseUrl override 242", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://snappy.heyclau.de" }),
    ).toBe("https://snappy.heyclau.de");
  });
  it("publicApiBaseUrl override 243", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://base64.heyclau.de" }),
    ).toBe("https://base64.heyclau.de");
  });
  it("publicApiBaseUrl override 244", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://hex.heyclau.de" }),
    ).toBe("https://hex.heyclau.de");
  });
  it("publicApiBaseUrl override 245", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://binary.heyclau.de" }),
    ).toBe("https://binary.heyclau.de");
  });
  it("publicApiBaseUrl override 246", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://octal.heyclau.de" }),
    ).toBe("https://octal.heyclau.de");
  });
  it("publicApiBaseUrl override 247", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://decimal.heyclau.de" }),
    ).toBe("https://decimal.heyclau.de");
  });
  it("publicApiBaseUrl override 248", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://float.heyclau.de" }),
    ).toBe("https://float.heyclau.de");
  });
  it("publicApiBaseUrl override 249", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://double.heyclau.de" }),
    ).toBe("https://double.heyclau.de");
  });
  it("publicApiBaseUrl override 250", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://bigint.heyclau.de" }),
    ).toBe("https://bigint.heyclau.de");
  });
  it("publicApiBaseUrl override 251", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://uuid.heyclau.de" }),
    ).toBe("https://uuid.heyclau.de");
  });
  it("publicApiBaseUrl override 252", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://guid.heyclau.de" }),
    ).toBe("https://guid.heyclau.de");
  });
  it("publicApiBaseUrl override 253", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://nanoid.heyclau.de" }),
    ).toBe("https://nanoid.heyclau.de");
  });
  it("publicApiBaseUrl override 254", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://ulid.heyclau.de" }),
    ).toBe("https://ulid.heyclau.de");
  });
  it("publicApiBaseUrl override 255", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://snowflake.heyclau.de" }),
    ).toBe("https://snowflake.heyclau.de");
  });
  it("publicApiBaseUrl override 256", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://timestamp.heyclau.de" }),
    ).toBe("https://timestamp.heyclau.de");
  });
  it("publicApiBaseUrl override 257", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://epoch.heyclau.de" }),
    ).toBe("https://epoch.heyclau.de");
  });
  it("publicApiBaseUrl override 258", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://iso8601.heyclau.de" }),
    ).toBe("https://iso8601.heyclau.de");
  });
  it("publicApiBaseUrl override 259", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://rfc3339.heyclau.de" }),
    ).toBe("https://rfc3339.heyclau.de");
  });
  it("publicApiBaseUrl override 260", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://timezone.heyclau.de" }),
    ).toBe("https://timezone.heyclau.de");
  });
  it("publicApiBaseUrl override 261", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://locale.heyclau.de" }),
    ).toBe("https://locale.heyclau.de");
  });
  it("publicApiBaseUrl override 262", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://i18n.heyclau.de" }),
    ).toBe("https://i18n.heyclau.de");
  });
  it("publicApiBaseUrl override 263", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://l10n.heyclau.de" }),
    ).toBe("https://l10n.heyclau.de");
  });
  it("publicApiBaseUrl override 264", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://translation.heyclau.de" }),
    ).toBe("https://translation.heyclau.de");
  });
  it("publicApiBaseUrl override 265", () => {
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://localization.heyclau.de" }),
    ).toBe("https://localization.heyclau.de");
  });
  it("publicApiBaseUrl override 266", () => {
    expect(
      publicApiBaseUrl({
        publicApiBaseUrl: "https://globalization.heyclau.de",
      }),
    ).toBe("https://globalization.heyclau.de");
  });
  it("publicApiBaseUrl override 267", () => {
    expect(
      publicApiBaseUrl({
        publicApiBaseUrl: "https://internationalization.heyclau.de",
      }),
    ).toBe("https://internationalization.heyclau.de");
  });
  it("publicApiBaseUrl env matrix 0", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-0.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-0.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-0.example.com" }),
    ).toBe("https://opt-0.example.com");
  });
  it("publicApiBaseUrl env matrix 1", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-1.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-1.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-1.example.com" }),
    ).toBe("https://opt-1.example.com");
  });
  it("publicApiBaseUrl env matrix 2", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-2.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-2.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-2.example.com" }),
    ).toBe("https://opt-2.example.com");
  });
  it("publicApiBaseUrl env matrix 3", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-3.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-3.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-3.example.com" }),
    ).toBe("https://opt-3.example.com");
  });
  it("publicApiBaseUrl env matrix 4", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-4.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-4.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-4.example.com" }),
    ).toBe("https://opt-4.example.com");
  });
  it("publicApiBaseUrl env matrix 5", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-5.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-5.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-5.example.com" }),
    ).toBe("https://opt-5.example.com");
  });
  it("publicApiBaseUrl env matrix 6", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-6.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-6.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-6.example.com" }),
    ).toBe("https://opt-6.example.com");
  });
  it("publicApiBaseUrl env matrix 7", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-7.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-7.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-7.example.com" }),
    ).toBe("https://opt-7.example.com");
  });
  it("publicApiBaseUrl env matrix 8", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-8.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-8.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-8.example.com" }),
    ).toBe("https://opt-8.example.com");
  });
  it("publicApiBaseUrl env matrix 9", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-9.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-9.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-9.example.com" }),
    ).toBe("https://opt-9.example.com");
  });
  it("publicApiBaseUrl env matrix 10", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-10.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-10.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-10.example.com" }),
    ).toBe("https://opt-10.example.com");
  });
  it("publicApiBaseUrl env matrix 11", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-11.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-11.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-11.example.com" }),
    ).toBe("https://opt-11.example.com");
  });
  it("publicApiBaseUrl env matrix 12", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-12.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-12.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-12.example.com" }),
    ).toBe("https://opt-12.example.com");
  });
  it("publicApiBaseUrl env matrix 13", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-13.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-13.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-13.example.com" }),
    ).toBe("https://opt-13.example.com");
  });
  it("publicApiBaseUrl env matrix 14", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-14.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-14.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-14.example.com" }),
    ).toBe("https://opt-14.example.com");
  });
  it("publicApiBaseUrl env matrix 15", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-15.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-15.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-15.example.com" }),
    ).toBe("https://opt-15.example.com");
  });
  it("publicApiBaseUrl env matrix 16", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-16.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-16.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-16.example.com" }),
    ).toBe("https://opt-16.example.com");
  });
  it("publicApiBaseUrl env matrix 17", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-17.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-17.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-17.example.com" }),
    ).toBe("https://opt-17.example.com");
  });
  it("publicApiBaseUrl env matrix 18", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-18.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-18.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-18.example.com" }),
    ).toBe("https://opt-18.example.com");
  });
  it("publicApiBaseUrl env matrix 19", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-19.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-19.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-19.example.com" }),
    ).toBe("https://opt-19.example.com");
  });
  it("publicApiBaseUrl env matrix 20", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-20.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-20.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-20.example.com" }),
    ).toBe("https://opt-20.example.com");
  });
  it("publicApiBaseUrl env matrix 21", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-21.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-21.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-21.example.com" }),
    ).toBe("https://opt-21.example.com");
  });
  it("publicApiBaseUrl env matrix 22", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-22.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-22.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-22.example.com" }),
    ).toBe("https://opt-22.example.com");
  });
  it("publicApiBaseUrl env matrix 23", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-23.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-23.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-23.example.com" }),
    ).toBe("https://opt-23.example.com");
  });
  it("publicApiBaseUrl env matrix 24", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-24.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-24.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-24.example.com" }),
    ).toBe("https://opt-24.example.com");
  });
  it("publicApiBaseUrl env matrix 25", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-25.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-25.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-25.example.com" }),
    ).toBe("https://opt-25.example.com");
  });
  it("publicApiBaseUrl env matrix 26", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-26.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-26.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-26.example.com" }),
    ).toBe("https://opt-26.example.com");
  });
  it("publicApiBaseUrl env matrix 27", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-27.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-27.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-27.example.com" }),
    ).toBe("https://opt-27.example.com");
  });
  it("publicApiBaseUrl env matrix 28", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-28.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-28.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-28.example.com" }),
    ).toBe("https://opt-28.example.com");
  });
  it("publicApiBaseUrl env matrix 29", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-29.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-29.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-29.example.com" }),
    ).toBe("https://opt-29.example.com");
  });
  it("publicApiBaseUrl env matrix 30", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-30.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-30.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-30.example.com" }),
    ).toBe("https://opt-30.example.com");
  });
  it("publicApiBaseUrl env matrix 31", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-31.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-31.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-31.example.com" }),
    ).toBe("https://opt-31.example.com");
  });
  it("publicApiBaseUrl env matrix 32", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-32.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-32.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-32.example.com" }),
    ).toBe("https://opt-32.example.com");
  });
  it("publicApiBaseUrl env matrix 33", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-33.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-33.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-33.example.com" }),
    ).toBe("https://opt-33.example.com");
  });
  it("publicApiBaseUrl env matrix 34", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-34.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-34.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-34.example.com" }),
    ).toBe("https://opt-34.example.com");
  });
  it("publicApiBaseUrl env matrix 35", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-35.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-35.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-35.example.com" }),
    ).toBe("https://opt-35.example.com");
  });
  it("publicApiBaseUrl env matrix 36", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-36.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-36.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-36.example.com" }),
    ).toBe("https://opt-36.example.com");
  });
  it("publicApiBaseUrl env matrix 37", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-37.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-37.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-37.example.com" }),
    ).toBe("https://opt-37.example.com");
  });
  it("publicApiBaseUrl env matrix 38", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-38.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-38.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-38.example.com" }),
    ).toBe("https://opt-38.example.com");
  });
  it("publicApiBaseUrl env matrix 39", () => {
    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-39.example.com";
    expect(publicApiBaseUrl({})).toBe("https://env-39.example.com");
    expect(
      publicApiBaseUrl({ publicApiBaseUrl: "https://opt-39.example.com" }),
    ).toBe("https://opt-39.example.com");
  });
});

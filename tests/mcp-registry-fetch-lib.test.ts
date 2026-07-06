import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { SITE_URL } from "../packages/mcp/src/platforms.js";
import {
  buildPublicApiRequestUrl,
  DISCOVERY_FETCH_TIMEOUT_MS,
  fetchPublicApiJson,
  JSON_MIME_TYPE,
} from "../packages/mcp/src/registry-fetch-lib.js";

describe("registry-fetch-lib constants", () => {
  it("exports JSON mime type", () => {
    expect(JSON_MIME_TYPE).toBe("application/json");
  });
  it("exports discovery fetch timeout", () => {
    expect(DISCOVERY_FETCH_TIMEOUT_MS).toBe(5000);
  });
});

describe("registry-fetch-lib buildPublicApiRequestUrl", () => {
  const original = process.env.HEYCLAUDE_PUBLIC_API_URL;
  beforeEach(() => {
    delete process.env.HEYCLAUDE_PUBLIC_API_URL;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.HEYCLAUDE_PUBLIC_API_URL;
    else process.env.HEYCLAUDE_PUBLIC_API_URL = original;
  });
  it("joins base URL and absolute api path", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/registry/trending");
  });
  it("prefixes slash for relative api paths", () => {
    expect(
      buildPublicApiRequestUrl("api/jobs", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/jobs");
  });
  it("strips trailing slashes from base URL", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://heyclau.de///",
      }),
    ).toBe("https://heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 0", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 1", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 2", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 3", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 4", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 5", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 6", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 7", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/health");
  });
  it("buildPublicApiRequestUrl combo 8", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 9", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 10", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 11", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 12", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 13", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 14", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 15", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 16", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 17", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/health");
  });
  it("buildPublicApiRequestUrl combo 18", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 19", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "https://heyclau.de/",
      }),
    ).toBe("https://heyclau.de/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 20", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 21", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 22", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 23", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 24", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 25", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 26", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 27", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/health");
  });
  it("buildPublicApiRequestUrl combo 28", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 29", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "https://api.heyclau.de",
      }),
    ).toBe("https://api.heyclau.de/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 30", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 31", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 32", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 33", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 34", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 35", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 36", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 37", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/health");
  });
  it("buildPublicApiRequestUrl combo 38", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 39", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 40", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 41", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 42", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 43", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 44", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 45", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 46", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 47", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/health");
  });
  it("buildPublicApiRequestUrl combo 48", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 49", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "http://127.0.0.1:8787",
      }),
    ).toBe("http://127.0.0.1:8787/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 50", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 51", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 52", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 53", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 54", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 55", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 56", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 57", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/health");
  });
  it("buildPublicApiRequestUrl combo 58", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 59", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "https://preview.heyclau.de",
      }),
    ).toBe("https://preview.heyclau.de/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 60", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 61", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 62", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 63", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 64", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 65", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 66", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 67", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/health");
  });
  it("buildPublicApiRequestUrl combo 68", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 69", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "https://staging.heyclau.de",
      }),
    ).toBe("https://staging.heyclau.de/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl combo 70", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 71", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/registry/trending?limit=25");
  });
  it("buildPublicApiRequestUrl combo 72", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/jobs");
  });
  it("buildPublicApiRequestUrl combo 73", () => {
    expect(
      buildPublicApiRequestUrl("/api/jobs?limit=25", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/jobs?limit=25");
  });
  it("buildPublicApiRequestUrl combo 74", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/feed", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/registry/feed");
  });
  it("buildPublicApiRequestUrl combo 75", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/recent", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/registry/recent");
  });
  it("buildPublicApiRequestUrl combo 76", () => {
    expect(
      buildPublicApiRequestUrl("/api/registry/stats", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/registry/stats");
  });
  it("buildPublicApiRequestUrl combo 77", () => {
    expect(
      buildPublicApiRequestUrl("/api/health", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/health");
  });
  it("buildPublicApiRequestUrl combo 78", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/registry/trending", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/v1/registry/trending");
  });
  it("buildPublicApiRequestUrl combo 79", () => {
    expect(
      buildPublicApiRequestUrl("/api/v1/jobs/active", {
        publicApiBaseUrl: "https://dev.heyclau.de",
      }),
    ).toBe("https://dev.heyclau.de/api/v1/jobs/active");
  });
  it("buildPublicApiRequestUrl generated 0", () => {
    const base = "https://host-0.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=0", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-0.example.com/api/registry/trending?limit=0`,
    );
  });
  it("buildPublicApiRequestUrl generated 1", () => {
    const base = "https://host-1.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=1", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-1.example.com/api/registry/trending?limit=1`,
    );
  });
  it("buildPublicApiRequestUrl generated 2", () => {
    const base = "https://host-2.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=2", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-2.example.com/api/registry/trending?limit=2`,
    );
  });
  it("buildPublicApiRequestUrl generated 3", () => {
    const base = "https://host-3.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=3", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-3.example.com/api/registry/trending?limit=3`,
    );
  });
  it("buildPublicApiRequestUrl generated 4", () => {
    const base = "https://host-4.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=4", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-4.example.com/api/registry/trending?limit=4`,
    );
  });
  it("buildPublicApiRequestUrl generated 5", () => {
    const base = "https://host-5.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=5", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-5.example.com/api/registry/trending?limit=5`,
    );
  });
  it("buildPublicApiRequestUrl generated 6", () => {
    const base = "https://host-6.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=6", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-6.example.com/api/registry/trending?limit=6`,
    );
  });
  it("buildPublicApiRequestUrl generated 7", () => {
    const base = "https://host-7.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=7", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-7.example.com/api/registry/trending?limit=7`,
    );
  });
  it("buildPublicApiRequestUrl generated 8", () => {
    const base = "https://host-8.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=8", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-8.example.com/api/registry/trending?limit=8`,
    );
  });
  it("buildPublicApiRequestUrl generated 9", () => {
    const base = "https://host-9.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=9", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-9.example.com/api/registry/trending?limit=9`,
    );
  });
  it("buildPublicApiRequestUrl generated 10", () => {
    const base = "https://host-10.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=10", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-10.example.com/api/registry/trending?limit=10`,
    );
  });
  it("buildPublicApiRequestUrl generated 11", () => {
    const base = "https://host-11.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=11", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-11.example.com/api/registry/trending?limit=11`,
    );
  });
  it("buildPublicApiRequestUrl generated 12", () => {
    const base = "https://host-12.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=12", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-12.example.com/api/registry/trending?limit=12`,
    );
  });
  it("buildPublicApiRequestUrl generated 13", () => {
    const base = "https://host-13.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=13", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-13.example.com/api/registry/trending?limit=13`,
    );
  });
  it("buildPublicApiRequestUrl generated 14", () => {
    const base = "https://host-14.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=14", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-14.example.com/api/registry/trending?limit=14`,
    );
  });
  it("buildPublicApiRequestUrl generated 15", () => {
    const base = "https://host-15.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=15", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-15.example.com/api/registry/trending?limit=15`,
    );
  });
  it("buildPublicApiRequestUrl generated 16", () => {
    const base = "https://host-16.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=16", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-16.example.com/api/registry/trending?limit=16`,
    );
  });
  it("buildPublicApiRequestUrl generated 17", () => {
    const base = "https://host-17.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=17", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-17.example.com/api/registry/trending?limit=17`,
    );
  });
  it("buildPublicApiRequestUrl generated 18", () => {
    const base = "https://host-18.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=18", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-18.example.com/api/registry/trending?limit=18`,
    );
  });
  it("buildPublicApiRequestUrl generated 19", () => {
    const base = "https://host-19.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=19", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-19.example.com/api/registry/trending?limit=19`,
    );
  });
  it("buildPublicApiRequestUrl generated 20", () => {
    const base = "https://host-20.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=20", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-20.example.com/api/registry/trending?limit=20`,
    );
  });
  it("buildPublicApiRequestUrl generated 21", () => {
    const base = "https://host-21.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=21", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-21.example.com/api/registry/trending?limit=21`,
    );
  });
  it("buildPublicApiRequestUrl generated 22", () => {
    const base = "https://host-22.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=22", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-22.example.com/api/registry/trending?limit=22`,
    );
  });
  it("buildPublicApiRequestUrl generated 23", () => {
    const base = "https://host-23.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=23", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-23.example.com/api/registry/trending?limit=23`,
    );
  });
  it("buildPublicApiRequestUrl generated 24", () => {
    const base = "https://host-24.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=24", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-24.example.com/api/registry/trending?limit=24`,
    );
  });
  it("buildPublicApiRequestUrl generated 25", () => {
    const base = "https://host-25.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=25", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-25.example.com/api/registry/trending?limit=25`,
    );
  });
  it("buildPublicApiRequestUrl generated 26", () => {
    const base = "https://host-26.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=26", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-26.example.com/api/registry/trending?limit=26`,
    );
  });
  it("buildPublicApiRequestUrl generated 27", () => {
    const base = "https://host-27.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=27", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-27.example.com/api/registry/trending?limit=27`,
    );
  });
  it("buildPublicApiRequestUrl generated 28", () => {
    const base = "https://host-28.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=28", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-28.example.com/api/registry/trending?limit=28`,
    );
  });
  it("buildPublicApiRequestUrl generated 29", () => {
    const base = "https://host-29.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=29", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-29.example.com/api/registry/trending?limit=29`,
    );
  });
  it("buildPublicApiRequestUrl generated 30", () => {
    const base = "https://host-30.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=30", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-30.example.com/api/registry/trending?limit=30`,
    );
  });
  it("buildPublicApiRequestUrl generated 31", () => {
    const base = "https://host-31.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=31", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-31.example.com/api/registry/trending?limit=31`,
    );
  });
  it("buildPublicApiRequestUrl generated 32", () => {
    const base = "https://host-32.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=32", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-32.example.com/api/registry/trending?limit=32`,
    );
  });
  it("buildPublicApiRequestUrl generated 33", () => {
    const base = "https://host-33.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=33", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-33.example.com/api/registry/trending?limit=33`,
    );
  });
  it("buildPublicApiRequestUrl generated 34", () => {
    const base = "https://host-34.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=34", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-34.example.com/api/registry/trending?limit=34`,
    );
  });
  it("buildPublicApiRequestUrl generated 35", () => {
    const base = "https://host-35.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=35", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-35.example.com/api/registry/trending?limit=35`,
    );
  });
  it("buildPublicApiRequestUrl generated 36", () => {
    const base = "https://host-36.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=36", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-36.example.com/api/registry/trending?limit=36`,
    );
  });
  it("buildPublicApiRequestUrl generated 37", () => {
    const base = "https://host-37.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=37", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-37.example.com/api/registry/trending?limit=37`,
    );
  });
  it("buildPublicApiRequestUrl generated 38", () => {
    const base = "https://host-38.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=38", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-38.example.com/api/registry/trending?limit=38`,
    );
  });
  it("buildPublicApiRequestUrl generated 39", () => {
    const base = "https://host-39.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=39", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-39.example.com/api/registry/trending?limit=39`,
    );
  });
  it("buildPublicApiRequestUrl generated 40", () => {
    const base = "https://host-40.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=40", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-40.example.com/api/registry/trending?limit=40`,
    );
  });
  it("buildPublicApiRequestUrl generated 41", () => {
    const base = "https://host-41.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=41", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-41.example.com/api/registry/trending?limit=41`,
    );
  });
  it("buildPublicApiRequestUrl generated 42", () => {
    const base = "https://host-42.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=42", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-42.example.com/api/registry/trending?limit=42`,
    );
  });
  it("buildPublicApiRequestUrl generated 43", () => {
    const base = "https://host-43.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=43", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-43.example.com/api/registry/trending?limit=43`,
    );
  });
  it("buildPublicApiRequestUrl generated 44", () => {
    const base = "https://host-44.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=44", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-44.example.com/api/registry/trending?limit=44`,
    );
  });
  it("buildPublicApiRequestUrl generated 45", () => {
    const base = "https://host-45.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=45", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-45.example.com/api/registry/trending?limit=45`,
    );
  });
  it("buildPublicApiRequestUrl generated 46", () => {
    const base = "https://host-46.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=46", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-46.example.com/api/registry/trending?limit=46`,
    );
  });
  it("buildPublicApiRequestUrl generated 47", () => {
    const base = "https://host-47.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=47", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-47.example.com/api/registry/trending?limit=47`,
    );
  });
  it("buildPublicApiRequestUrl generated 48", () => {
    const base = "https://host-48.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=48", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-48.example.com/api/registry/trending?limit=48`,
    );
  });
  it("buildPublicApiRequestUrl generated 49", () => {
    const base = "https://host-49.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=49", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-49.example.com/api/registry/trending?limit=49`,
    );
  });
  it("buildPublicApiRequestUrl generated 50", () => {
    const base = "https://host-50.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=50", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-50.example.com/api/registry/trending?limit=50`,
    );
  });
  it("buildPublicApiRequestUrl generated 51", () => {
    const base = "https://host-51.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=51", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-51.example.com/api/registry/trending?limit=51`,
    );
  });
  it("buildPublicApiRequestUrl generated 52", () => {
    const base = "https://host-52.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=52", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-52.example.com/api/registry/trending?limit=52`,
    );
  });
  it("buildPublicApiRequestUrl generated 53", () => {
    const base = "https://host-53.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=53", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-53.example.com/api/registry/trending?limit=53`,
    );
  });
  it("buildPublicApiRequestUrl generated 54", () => {
    const base = "https://host-54.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=54", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-54.example.com/api/registry/trending?limit=54`,
    );
  });
  it("buildPublicApiRequestUrl generated 55", () => {
    const base = "https://host-55.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=55", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-55.example.com/api/registry/trending?limit=55`,
    );
  });
  it("buildPublicApiRequestUrl generated 56", () => {
    const base = "https://host-56.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=56", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-56.example.com/api/registry/trending?limit=56`,
    );
  });
  it("buildPublicApiRequestUrl generated 57", () => {
    const base = "https://host-57.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=57", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-57.example.com/api/registry/trending?limit=57`,
    );
  });
  it("buildPublicApiRequestUrl generated 58", () => {
    const base = "https://host-58.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=58", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-58.example.com/api/registry/trending?limit=58`,
    );
  });
  it("buildPublicApiRequestUrl generated 59", () => {
    const base = "https://host-59.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=59", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-59.example.com/api/registry/trending?limit=59`,
    );
  });
  it("buildPublicApiRequestUrl generated 60", () => {
    const base = "https://host-60.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=60", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-60.example.com/api/registry/trending?limit=60`,
    );
  });
  it("buildPublicApiRequestUrl generated 61", () => {
    const base = "https://host-61.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=61", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-61.example.com/api/registry/trending?limit=61`,
    );
  });
  it("buildPublicApiRequestUrl generated 62", () => {
    const base = "https://host-62.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=62", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-62.example.com/api/registry/trending?limit=62`,
    );
  });
  it("buildPublicApiRequestUrl generated 63", () => {
    const base = "https://host-63.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=63", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-63.example.com/api/registry/trending?limit=63`,
    );
  });
  it("buildPublicApiRequestUrl generated 64", () => {
    const base = "https://host-64.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=64", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-64.example.com/api/registry/trending?limit=64`,
    );
  });
  it("buildPublicApiRequestUrl generated 65", () => {
    const base = "https://host-65.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=65", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-65.example.com/api/registry/trending?limit=65`,
    );
  });
  it("buildPublicApiRequestUrl generated 66", () => {
    const base = "https://host-66.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=66", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-66.example.com/api/registry/trending?limit=66`,
    );
  });
  it("buildPublicApiRequestUrl generated 67", () => {
    const base = "https://host-67.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=67", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-67.example.com/api/registry/trending?limit=67`,
    );
  });
  it("buildPublicApiRequestUrl generated 68", () => {
    const base = "https://host-68.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=68", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-68.example.com/api/registry/trending?limit=68`,
    );
  });
  it("buildPublicApiRequestUrl generated 69", () => {
    const base = "https://host-69.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=69", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-69.example.com/api/registry/trending?limit=69`,
    );
  });
  it("buildPublicApiRequestUrl generated 70", () => {
    const base = "https://host-70.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=70", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-70.example.com/api/registry/trending?limit=70`,
    );
  });
  it("buildPublicApiRequestUrl generated 71", () => {
    const base = "https://host-71.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=71", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-71.example.com/api/registry/trending?limit=71`,
    );
  });
  it("buildPublicApiRequestUrl generated 72", () => {
    const base = "https://host-72.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=72", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-72.example.com/api/registry/trending?limit=72`,
    );
  });
  it("buildPublicApiRequestUrl generated 73", () => {
    const base = "https://host-73.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=73", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-73.example.com/api/registry/trending?limit=73`,
    );
  });
  it("buildPublicApiRequestUrl generated 74", () => {
    const base = "https://host-74.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=74", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-74.example.com/api/registry/trending?limit=74`,
    );
  });
  it("buildPublicApiRequestUrl generated 75", () => {
    const base = "https://host-75.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=75", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-75.example.com/api/registry/trending?limit=75`,
    );
  });
  it("buildPublicApiRequestUrl generated 76", () => {
    const base = "https://host-76.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=76", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-76.example.com/api/registry/trending?limit=76`,
    );
  });
  it("buildPublicApiRequestUrl generated 77", () => {
    const base = "https://host-77.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=77", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-77.example.com/api/registry/trending?limit=77`,
    );
  });
  it("buildPublicApiRequestUrl generated 78", () => {
    const base = "https://host-78.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=78", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-78.example.com/api/registry/trending?limit=78`,
    );
  });
  it("buildPublicApiRequestUrl generated 79", () => {
    const base = "https://host-79.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=79", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-79.example.com/api/registry/trending?limit=79`,
    );
  });
  it("buildPublicApiRequestUrl generated 80", () => {
    const base = "https://host-80.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=80", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-80.example.com/api/registry/trending?limit=80`,
    );
  });
  it("buildPublicApiRequestUrl generated 81", () => {
    const base = "https://host-81.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=81", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-81.example.com/api/registry/trending?limit=81`,
    );
  });
  it("buildPublicApiRequestUrl generated 82", () => {
    const base = "https://host-82.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=82", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-82.example.com/api/registry/trending?limit=82`,
    );
  });
  it("buildPublicApiRequestUrl generated 83", () => {
    const base = "https://host-83.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=83", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-83.example.com/api/registry/trending?limit=83`,
    );
  });
  it("buildPublicApiRequestUrl generated 84", () => {
    const base = "https://host-84.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=84", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-84.example.com/api/registry/trending?limit=84`,
    );
  });
  it("buildPublicApiRequestUrl generated 85", () => {
    const base = "https://host-85.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=85", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-85.example.com/api/registry/trending?limit=85`,
    );
  });
  it("buildPublicApiRequestUrl generated 86", () => {
    const base = "https://host-86.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=86", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-86.example.com/api/registry/trending?limit=86`,
    );
  });
  it("buildPublicApiRequestUrl generated 87", () => {
    const base = "https://host-87.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=87", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-87.example.com/api/registry/trending?limit=87`,
    );
  });
  it("buildPublicApiRequestUrl generated 88", () => {
    const base = "https://host-88.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=88", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-88.example.com/api/registry/trending?limit=88`,
    );
  });
  it("buildPublicApiRequestUrl generated 89", () => {
    const base = "https://host-89.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=89", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-89.example.com/api/registry/trending?limit=89`,
    );
  });
  it("buildPublicApiRequestUrl generated 90", () => {
    const base = "https://host-90.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=90", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-90.example.com/api/registry/trending?limit=90`,
    );
  });
  it("buildPublicApiRequestUrl generated 91", () => {
    const base = "https://host-91.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=91", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-91.example.com/api/registry/trending?limit=91`,
    );
  });
  it("buildPublicApiRequestUrl generated 92", () => {
    const base = "https://host-92.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=92", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-92.example.com/api/registry/trending?limit=92`,
    );
  });
  it("buildPublicApiRequestUrl generated 93", () => {
    const base = "https://host-93.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=93", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-93.example.com/api/registry/trending?limit=93`,
    );
  });
  it("buildPublicApiRequestUrl generated 94", () => {
    const base = "https://host-94.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=94", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-94.example.com/api/registry/trending?limit=94`,
    );
  });
  it("buildPublicApiRequestUrl generated 95", () => {
    const base = "https://host-95.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=95", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-95.example.com/api/registry/trending?limit=95`,
    );
  });
  it("buildPublicApiRequestUrl generated 96", () => {
    const base = "https://host-96.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=96", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-96.example.com/api/registry/trending?limit=96`,
    );
  });
  it("buildPublicApiRequestUrl generated 97", () => {
    const base = "https://host-97.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=97", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-97.example.com/api/registry/trending?limit=97`,
    );
  });
  it("buildPublicApiRequestUrl generated 98", () => {
    const base = "https://host-98.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=98", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-98.example.com/api/registry/trending?limit=98`,
    );
  });
  it("buildPublicApiRequestUrl generated 99", () => {
    const base = "https://host-99.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=99", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-99.example.com/api/registry/trending?limit=99`,
    );
  });
  it("buildPublicApiRequestUrl generated 100", () => {
    const base = "https://host-100.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=100", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-100.example.com/api/registry/trending?limit=100`,
    );
  });
  it("buildPublicApiRequestUrl generated 101", () => {
    const base = "https://host-101.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=101", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-101.example.com/api/registry/trending?limit=101`,
    );
  });
  it("buildPublicApiRequestUrl generated 102", () => {
    const base = "https://host-102.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=102", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-102.example.com/api/registry/trending?limit=102`,
    );
  });
  it("buildPublicApiRequestUrl generated 103", () => {
    const base = "https://host-103.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=103", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-103.example.com/api/registry/trending?limit=103`,
    );
  });
  it("buildPublicApiRequestUrl generated 104", () => {
    const base = "https://host-104.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=104", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-104.example.com/api/registry/trending?limit=104`,
    );
  });
  it("buildPublicApiRequestUrl generated 105", () => {
    const base = "https://host-105.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=105", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-105.example.com/api/registry/trending?limit=105`,
    );
  });
  it("buildPublicApiRequestUrl generated 106", () => {
    const base = "https://host-106.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=106", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-106.example.com/api/registry/trending?limit=106`,
    );
  });
  it("buildPublicApiRequestUrl generated 107", () => {
    const base = "https://host-107.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=107", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-107.example.com/api/registry/trending?limit=107`,
    );
  });
  it("buildPublicApiRequestUrl generated 108", () => {
    const base = "https://host-108.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=108", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-108.example.com/api/registry/trending?limit=108`,
    );
  });
  it("buildPublicApiRequestUrl generated 109", () => {
    const base = "https://host-109.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=109", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-109.example.com/api/registry/trending?limit=109`,
    );
  });
  it("buildPublicApiRequestUrl generated 110", () => {
    const base = "https://host-110.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=110", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-110.example.com/api/registry/trending?limit=110`,
    );
  });
  it("buildPublicApiRequestUrl generated 111", () => {
    const base = "https://host-111.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=111", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-111.example.com/api/registry/trending?limit=111`,
    );
  });
  it("buildPublicApiRequestUrl generated 112", () => {
    const base = "https://host-112.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=112", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-112.example.com/api/registry/trending?limit=112`,
    );
  });
  it("buildPublicApiRequestUrl generated 113", () => {
    const base = "https://host-113.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=113", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-113.example.com/api/registry/trending?limit=113`,
    );
  });
  it("buildPublicApiRequestUrl generated 114", () => {
    const base = "https://host-114.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=114", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-114.example.com/api/registry/trending?limit=114`,
    );
  });
  it("buildPublicApiRequestUrl generated 115", () => {
    const base = "https://host-115.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=115", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-115.example.com/api/registry/trending?limit=115`,
    );
  });
  it("buildPublicApiRequestUrl generated 116", () => {
    const base = "https://host-116.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=116", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-116.example.com/api/registry/trending?limit=116`,
    );
  });
  it("buildPublicApiRequestUrl generated 117", () => {
    const base = "https://host-117.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=117", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-117.example.com/api/registry/trending?limit=117`,
    );
  });
  it("buildPublicApiRequestUrl generated 118", () => {
    const base = "https://host-118.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=118", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-118.example.com/api/registry/trending?limit=118`,
    );
  });
  it("buildPublicApiRequestUrl generated 119", () => {
    const base = "https://host-119.example.com/";
    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=119", {
      publicApiBaseUrl: base,
    });
    expect(url).toBe(
      `https://host-119.example.com/api/registry/trending?limit=119`,
    );
  });
});

describe("registry-fetch-lib fetchPublicApiJson", () => {
  it("delegates to injected fetchPublicApi", async () => {
    const payload = await fetchPublicApiJson("/api/jobs", {
      fetchPublicApi: async (apiPath) => ({ apiPath, entries: [] }),
    });
    expect(payload).toEqual({ apiPath: "/api/jobs", entries: [] });
  });
  it("throws when upstream response is not ok", async () => {
    await expect(
      fetchPublicApiJson("/api/jobs", {
        publicApiBaseUrl: "https://example.test",
        fetchPublicApi: async () => {
          throw new Error("Public API /api/jobs returned 503.");
        },
      }),
    ).rejects.toThrow(/503/);
  });
  it("fetchPublicApiJson injected matrix 0", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=0", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 0 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=0",
      count: 0,
    });
  });
  it("fetchPublicApiJson injected matrix 1", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=1", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 1 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=1",
      count: 1,
    });
  });
  it("fetchPublicApiJson injected matrix 2", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=2", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 2 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=2",
      count: 2,
    });
  });
  it("fetchPublicApiJson injected matrix 3", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=3", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 3 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=3",
      count: 3,
    });
  });
  it("fetchPublicApiJson injected matrix 4", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=4", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 4 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=4",
      count: 4,
    });
  });
  it("fetchPublicApiJson injected matrix 5", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=5", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 5 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=5",
      count: 5,
    });
  });
  it("fetchPublicApiJson injected matrix 6", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=6", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 6 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=6",
      count: 6,
    });
  });
  it("fetchPublicApiJson injected matrix 7", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=7", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 7 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=7",
      count: 7,
    });
  });
  it("fetchPublicApiJson injected matrix 8", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=8", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 8 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=8",
      count: 8,
    });
  });
  it("fetchPublicApiJson injected matrix 9", async () => {
    const payload = await fetchPublicApiJson("/api/registry/trending?limit=9", {
      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 9 }),
    });
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=9",
      count: 9,
    });
  });
  it("fetchPublicApiJson injected matrix 10", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=10",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 10 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=10",
      count: 10,
    });
  });
  it("fetchPublicApiJson injected matrix 11", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=11",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 11 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=11",
      count: 11,
    });
  });
  it("fetchPublicApiJson injected matrix 12", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=12",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 12 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=12",
      count: 12,
    });
  });
  it("fetchPublicApiJson injected matrix 13", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=13",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 13 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=13",
      count: 13,
    });
  });
  it("fetchPublicApiJson injected matrix 14", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=14",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 14 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=14",
      count: 14,
    });
  });
  it("fetchPublicApiJson injected matrix 15", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=15",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 15 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=15",
      count: 15,
    });
  });
  it("fetchPublicApiJson injected matrix 16", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=16",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 16 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=16",
      count: 16,
    });
  });
  it("fetchPublicApiJson injected matrix 17", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=17",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 17 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=17",
      count: 17,
    });
  });
  it("fetchPublicApiJson injected matrix 18", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=18",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 18 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=18",
      count: 18,
    });
  });
  it("fetchPublicApiJson injected matrix 19", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=19",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 19 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=19",
      count: 19,
    });
  });
  it("fetchPublicApiJson injected matrix 20", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=20",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 20 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=20",
      count: 20,
    });
  });
  it("fetchPublicApiJson injected matrix 21", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=21",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 21 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=21",
      count: 21,
    });
  });
  it("fetchPublicApiJson injected matrix 22", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=22",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 22 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=22",
      count: 22,
    });
  });
  it("fetchPublicApiJson injected matrix 23", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=23",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 23 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=23",
      count: 23,
    });
  });
  it("fetchPublicApiJson injected matrix 24", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=24",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 24 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=24",
      count: 24,
    });
  });
  it("fetchPublicApiJson injected matrix 25", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=25",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 25 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=25",
      count: 25,
    });
  });
  it("fetchPublicApiJson injected matrix 26", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=26",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 26 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=26",
      count: 26,
    });
  });
  it("fetchPublicApiJson injected matrix 27", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=27",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 27 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=27",
      count: 27,
    });
  });
  it("fetchPublicApiJson injected matrix 28", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=28",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 28 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=28",
      count: 28,
    });
  });
  it("fetchPublicApiJson injected matrix 29", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=29",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 29 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=29",
      count: 29,
    });
  });
  it("fetchPublicApiJson injected matrix 30", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=30",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 30 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=30",
      count: 30,
    });
  });
  it("fetchPublicApiJson injected matrix 31", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=31",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 31 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=31",
      count: 31,
    });
  });
  it("fetchPublicApiJson injected matrix 32", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=32",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 32 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=32",
      count: 32,
    });
  });
  it("fetchPublicApiJson injected matrix 33", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=33",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 33 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=33",
      count: 33,
    });
  });
  it("fetchPublicApiJson injected matrix 34", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=34",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 34 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=34",
      count: 34,
    });
  });
  it("fetchPublicApiJson injected matrix 35", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=35",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 35 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=35",
      count: 35,
    });
  });
  it("fetchPublicApiJson injected matrix 36", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=36",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 36 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=36",
      count: 36,
    });
  });
  it("fetchPublicApiJson injected matrix 37", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=37",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 37 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=37",
      count: 37,
    });
  });
  it("fetchPublicApiJson injected matrix 38", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=38",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 38 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=38",
      count: 38,
    });
  });
  it("fetchPublicApiJson injected matrix 39", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=39",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 39 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=39",
      count: 39,
    });
  });
  it("fetchPublicApiJson injected matrix 40", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=40",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 40 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=40",
      count: 40,
    });
  });
  it("fetchPublicApiJson injected matrix 41", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=41",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 41 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=41",
      count: 41,
    });
  });
  it("fetchPublicApiJson injected matrix 42", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=42",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 42 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=42",
      count: 42,
    });
  });
  it("fetchPublicApiJson injected matrix 43", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=43",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 43 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=43",
      count: 43,
    });
  });
  it("fetchPublicApiJson injected matrix 44", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=44",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 44 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=44",
      count: 44,
    });
  });
  it("fetchPublicApiJson injected matrix 45", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=45",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 45 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=45",
      count: 45,
    });
  });
  it("fetchPublicApiJson injected matrix 46", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=46",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 46 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=46",
      count: 46,
    });
  });
  it("fetchPublicApiJson injected matrix 47", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=47",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 47 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=47",
      count: 47,
    });
  });
  it("fetchPublicApiJson injected matrix 48", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=48",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 48 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=48",
      count: 48,
    });
  });
  it("fetchPublicApiJson injected matrix 49", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=49",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 49 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=49",
      count: 49,
    });
  });
  it("fetchPublicApiJson injected matrix 50", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=50",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 50 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=50",
      count: 50,
    });
  });
  it("fetchPublicApiJson injected matrix 51", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=51",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 51 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=51",
      count: 51,
    });
  });
  it("fetchPublicApiJson injected matrix 52", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=52",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 52 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=52",
      count: 52,
    });
  });
  it("fetchPublicApiJson injected matrix 53", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=53",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 53 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=53",
      count: 53,
    });
  });
  it("fetchPublicApiJson injected matrix 54", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=54",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 54 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=54",
      count: 54,
    });
  });
  it("fetchPublicApiJson injected matrix 55", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=55",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 55 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=55",
      count: 55,
    });
  });
  it("fetchPublicApiJson injected matrix 56", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=56",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 56 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=56",
      count: 56,
    });
  });
  it("fetchPublicApiJson injected matrix 57", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=57",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 57 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=57",
      count: 57,
    });
  });
  it("fetchPublicApiJson injected matrix 58", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=58",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 58 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=58",
      count: 58,
    });
  });
  it("fetchPublicApiJson injected matrix 59", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=59",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 59 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=59",
      count: 59,
    });
  });
  it("fetchPublicApiJson injected matrix 60", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=60",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 60 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=60",
      count: 60,
    });
  });
  it("fetchPublicApiJson injected matrix 61", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=61",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 61 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=61",
      count: 61,
    });
  });
  it("fetchPublicApiJson injected matrix 62", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=62",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 62 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=62",
      count: 62,
    });
  });
  it("fetchPublicApiJson injected matrix 63", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=63",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 63 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=63",
      count: 63,
    });
  });
  it("fetchPublicApiJson injected matrix 64", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=64",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 64 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=64",
      count: 64,
    });
  });
  it("fetchPublicApiJson injected matrix 65", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=65",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 65 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=65",
      count: 65,
    });
  });
  it("fetchPublicApiJson injected matrix 66", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=66",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 66 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=66",
      count: 66,
    });
  });
  it("fetchPublicApiJson injected matrix 67", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=67",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 67 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=67",
      count: 67,
    });
  });
  it("fetchPublicApiJson injected matrix 68", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=68",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 68 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=68",
      count: 68,
    });
  });
  it("fetchPublicApiJson injected matrix 69", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=69",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 69 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=69",
      count: 69,
    });
  });
  it("fetchPublicApiJson injected matrix 70", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=70",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 70 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=70",
      count: 70,
    });
  });
  it("fetchPublicApiJson injected matrix 71", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=71",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 71 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=71",
      count: 71,
    });
  });
  it("fetchPublicApiJson injected matrix 72", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=72",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 72 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=72",
      count: 72,
    });
  });
  it("fetchPublicApiJson injected matrix 73", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=73",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 73 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=73",
      count: 73,
    });
  });
  it("fetchPublicApiJson injected matrix 74", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=74",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 74 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=74",
      count: 74,
    });
  });
  it("fetchPublicApiJson injected matrix 75", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=75",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 75 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=75",
      count: 75,
    });
  });
  it("fetchPublicApiJson injected matrix 76", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=76",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 76 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=76",
      count: 76,
    });
  });
  it("fetchPublicApiJson injected matrix 77", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=77",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 77 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=77",
      count: 77,
    });
  });
  it("fetchPublicApiJson injected matrix 78", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=78",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 78 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=78",
      count: 78,
    });
  });
  it("fetchPublicApiJson injected matrix 79", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?limit=79",
      {
        fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: 79 }),
      },
    );
    expect(payload).toEqual({
      ok: true,
      apiPath: "/api/registry/trending?limit=79",
      count: 79,
    });
  });
  it("fetchPublicApiJson trending agents 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=agents&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "agents",
          entries: [{ slug: "agents-0" }],
        }),
      },
    );
    expect(payload.category).toBe("agents");
  });
  it("fetchPublicApiJson trending agents 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=agents&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "agents",
          entries: [{ slug: "agents-1" }],
        }),
      },
    );
    expect(payload.category).toBe("agents");
  });
  it("fetchPublicApiJson trending agents 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=agents&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "agents",
          entries: [{ slug: "agents-2" }],
        }),
      },
    );
    expect(payload.category).toBe("agents");
  });
  it("fetchPublicApiJson trending agents 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=agents&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "agents",
          entries: [{ slug: "agents-3" }],
        }),
      },
    );
    expect(payload.category).toBe("agents");
  });
  it("fetchPublicApiJson trending agents 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=agents&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "agents",
          entries: [{ slug: "agents-4" }],
        }),
      },
    );
    expect(payload.category).toBe("agents");
  });
  it("fetchPublicApiJson trending mcp 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=mcp&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "mcp",
          entries: [{ slug: "mcp-0" }],
        }),
      },
    );
    expect(payload.category).toBe("mcp");
  });
  it("fetchPublicApiJson trending mcp 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=mcp&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "mcp",
          entries: [{ slug: "mcp-1" }],
        }),
      },
    );
    expect(payload.category).toBe("mcp");
  });
  it("fetchPublicApiJson trending mcp 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=mcp&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "mcp",
          entries: [{ slug: "mcp-2" }],
        }),
      },
    );
    expect(payload.category).toBe("mcp");
  });
  it("fetchPublicApiJson trending mcp 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=mcp&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "mcp",
          entries: [{ slug: "mcp-3" }],
        }),
      },
    );
    expect(payload.category).toBe("mcp");
  });
  it("fetchPublicApiJson trending mcp 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=mcp&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "mcp",
          entries: [{ slug: "mcp-4" }],
        }),
      },
    );
    expect(payload.category).toBe("mcp");
  });
  it("fetchPublicApiJson trending tools 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=tools&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "tools",
          entries: [{ slug: "tools-0" }],
        }),
      },
    );
    expect(payload.category).toBe("tools");
  });
  it("fetchPublicApiJson trending tools 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=tools&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "tools",
          entries: [{ slug: "tools-1" }],
        }),
      },
    );
    expect(payload.category).toBe("tools");
  });
  it("fetchPublicApiJson trending tools 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=tools&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "tools",
          entries: [{ slug: "tools-2" }],
        }),
      },
    );
    expect(payload.category).toBe("tools");
  });
  it("fetchPublicApiJson trending tools 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=tools&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "tools",
          entries: [{ slug: "tools-3" }],
        }),
      },
    );
    expect(payload.category).toBe("tools");
  });
  it("fetchPublicApiJson trending tools 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=tools&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "tools",
          entries: [{ slug: "tools-4" }],
        }),
      },
    );
    expect(payload.category).toBe("tools");
  });
  it("fetchPublicApiJson trending skills 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=skills&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "skills",
          entries: [{ slug: "skills-0" }],
        }),
      },
    );
    expect(payload.category).toBe("skills");
  });
  it("fetchPublicApiJson trending skills 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=skills&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "skills",
          entries: [{ slug: "skills-1" }],
        }),
      },
    );
    expect(payload.category).toBe("skills");
  });
  it("fetchPublicApiJson trending skills 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=skills&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "skills",
          entries: [{ slug: "skills-2" }],
        }),
      },
    );
    expect(payload.category).toBe("skills");
  });
  it("fetchPublicApiJson trending skills 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=skills&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "skills",
          entries: [{ slug: "skills-3" }],
        }),
      },
    );
    expect(payload.category).toBe("skills");
  });
  it("fetchPublicApiJson trending skills 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=skills&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "skills",
          entries: [{ slug: "skills-4" }],
        }),
      },
    );
    expect(payload.category).toBe("skills");
  });
  it("fetchPublicApiJson trending rules 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=rules&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "rules",
          entries: [{ slug: "rules-0" }],
        }),
      },
    );
    expect(payload.category).toBe("rules");
  });
  it("fetchPublicApiJson trending rules 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=rules&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "rules",
          entries: [{ slug: "rules-1" }],
        }),
      },
    );
    expect(payload.category).toBe("rules");
  });
  it("fetchPublicApiJson trending rules 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=rules&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "rules",
          entries: [{ slug: "rules-2" }],
        }),
      },
    );
    expect(payload.category).toBe("rules");
  });
  it("fetchPublicApiJson trending rules 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=rules&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "rules",
          entries: [{ slug: "rules-3" }],
        }),
      },
    );
    expect(payload.category).toBe("rules");
  });
  it("fetchPublicApiJson trending rules 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=rules&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "rules",
          entries: [{ slug: "rules-4" }],
        }),
      },
    );
    expect(payload.category).toBe("rules");
  });
  it("fetchPublicApiJson trending commands 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=commands&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "commands",
          entries: [{ slug: "commands-0" }],
        }),
      },
    );
    expect(payload.category).toBe("commands");
  });
  it("fetchPublicApiJson trending commands 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=commands&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "commands",
          entries: [{ slug: "commands-1" }],
        }),
      },
    );
    expect(payload.category).toBe("commands");
  });
  it("fetchPublicApiJson trending commands 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=commands&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "commands",
          entries: [{ slug: "commands-2" }],
        }),
      },
    );
    expect(payload.category).toBe("commands");
  });
  it("fetchPublicApiJson trending commands 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=commands&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "commands",
          entries: [{ slug: "commands-3" }],
        }),
      },
    );
    expect(payload.category).toBe("commands");
  });
  it("fetchPublicApiJson trending commands 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=commands&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "commands",
          entries: [{ slug: "commands-4" }],
        }),
      },
    );
    expect(payload.category).toBe("commands");
  });
  it("fetchPublicApiJson trending hooks 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=hooks&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "hooks",
          entries: [{ slug: "hooks-0" }],
        }),
      },
    );
    expect(payload.category).toBe("hooks");
  });
  it("fetchPublicApiJson trending hooks 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=hooks&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "hooks",
          entries: [{ slug: "hooks-1" }],
        }),
      },
    );
    expect(payload.category).toBe("hooks");
  });
  it("fetchPublicApiJson trending hooks 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=hooks&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "hooks",
          entries: [{ slug: "hooks-2" }],
        }),
      },
    );
    expect(payload.category).toBe("hooks");
  });
  it("fetchPublicApiJson trending hooks 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=hooks&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "hooks",
          entries: [{ slug: "hooks-3" }],
        }),
      },
    );
    expect(payload.category).toBe("hooks");
  });
  it("fetchPublicApiJson trending hooks 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=hooks&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "hooks",
          entries: [{ slug: "hooks-4" }],
        }),
      },
    );
    expect(payload.category).toBe("hooks");
  });
  it("fetchPublicApiJson trending guides 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=guides&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "guides",
          entries: [{ slug: "guides-0" }],
        }),
      },
    );
    expect(payload.category).toBe("guides");
  });
  it("fetchPublicApiJson trending guides 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=guides&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "guides",
          entries: [{ slug: "guides-1" }],
        }),
      },
    );
    expect(payload.category).toBe("guides");
  });
  it("fetchPublicApiJson trending guides 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=guides&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "guides",
          entries: [{ slug: "guides-2" }],
        }),
      },
    );
    expect(payload.category).toBe("guides");
  });
  it("fetchPublicApiJson trending guides 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=guides&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "guides",
          entries: [{ slug: "guides-3" }],
        }),
      },
    );
    expect(payload.category).toBe("guides");
  });
  it("fetchPublicApiJson trending guides 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=guides&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "guides",
          entries: [{ slug: "guides-4" }],
        }),
      },
    );
    expect(payload.category).toBe("guides");
  });
  it("fetchPublicApiJson trending collections 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=collections&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "collections",
          entries: [{ slug: "collections-0" }],
        }),
      },
    );
    expect(payload.category).toBe("collections");
  });
  it("fetchPublicApiJson trending collections 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=collections&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "collections",
          entries: [{ slug: "collections-1" }],
        }),
      },
    );
    expect(payload.category).toBe("collections");
  });
  it("fetchPublicApiJson trending collections 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=collections&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "collections",
          entries: [{ slug: "collections-2" }],
        }),
      },
    );
    expect(payload.category).toBe("collections");
  });
  it("fetchPublicApiJson trending collections 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=collections&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "collections",
          entries: [{ slug: "collections-3" }],
        }),
      },
    );
    expect(payload.category).toBe("collections");
  });
  it("fetchPublicApiJson trending collections 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=collections&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "collections",
          entries: [{ slug: "collections-4" }],
        }),
      },
    );
    expect(payload.category).toBe("collections");
  });
  it("fetchPublicApiJson trending statuslines 0", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=statuslines&limit=0",
      {
        fetchPublicApi: async () => ({
          category: "statuslines",
          entries: [{ slug: "statuslines-0" }],
        }),
      },
    );
    expect(payload.category).toBe("statuslines");
  });
  it("fetchPublicApiJson trending statuslines 1", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=statuslines&limit=1",
      {
        fetchPublicApi: async () => ({
          category: "statuslines",
          entries: [{ slug: "statuslines-1" }],
        }),
      },
    );
    expect(payload.category).toBe("statuslines");
  });
  it("fetchPublicApiJson trending statuslines 2", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=statuslines&limit=2",
      {
        fetchPublicApi: async () => ({
          category: "statuslines",
          entries: [{ slug: "statuslines-2" }],
        }),
      },
    );
    expect(payload.category).toBe("statuslines");
  });
  it("fetchPublicApiJson trending statuslines 3", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=statuslines&limit=3",
      {
        fetchPublicApi: async () => ({
          category: "statuslines",
          entries: [{ slug: "statuslines-3" }],
        }),
      },
    );
    expect(payload.category).toBe("statuslines");
  });
  it("fetchPublicApiJson trending statuslines 4", async () => {
    const payload = await fetchPublicApiJson(
      "/api/registry/trending?category=statuslines&limit=4",
      {
        fetchPublicApi: async () => ({
          category: "statuslines",
          entries: [{ slug: "statuslines-4" }],
        }),
      },
    );
    expect(payload.category).toBe("statuslines");
  });
  it("defaults base URL to SITE_URL when no override", () => {
    expect(buildPublicApiRequestUrl("/api/jobs", {})).toBe(
      `${SITE_URL.replace(/\/$/, "")}/api/jobs`,
    );
  });
});

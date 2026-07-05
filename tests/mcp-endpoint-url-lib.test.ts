import { describe, expect, it } from "vitest";

import {
  DEFAULT_REMOTE_MCP_URL,
  DEFAULT_REQUEST_TIMEOUT_MS,
  normalizeEndpointUrl,
  normalizeTimeoutMs,
} from "../packages/mcp/src/endpoint-url-lib.js";

const HTTPS_ERROR = "MCP endpoint URL must use HTTPS outside localhost.";
const REQUIRED_ERROR = "MCP endpoint URL is required.";
const TIMEOUT_ERROR = "Timeout must be between 1000 and 300000 milliseconds.";

const HTTPS_HOSTS = [
  "example.com",
  "api.example.com",
  "mcp.heyclau.de",
  "sub.domain.example.org",
  "xn--bcher-kva.example",
] as const;

describe("endpoint-url-lib constants", () => {
  it("exports the production default remote MCP URL", () => {
    expect(DEFAULT_REMOTE_MCP_URL).toBe("https://heyclau.de/api/mcp");
  });

  it("exports the default request timeout in milliseconds", () => {
    expect(DEFAULT_REQUEST_TIMEOUT_MS).toBe(30000);
  });
});

describe("normalizeEndpointUrl defaults", () => {
  it("returns the default production URL when called with no arguments", () => {
    expect(normalizeEndpointUrl().toString()).toBe(DEFAULT_REMOTE_MCP_URL);
  });

  it("preserves the default URL pathname without rewriting /api/mcp", () => {
    const url = normalizeEndpointUrl();
    expect(url.pathname).toBe("/api/mcp");
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("heyclau.de");
  });

  it("accepts the explicit default URL string", () => {
    expect(normalizeEndpointUrl(DEFAULT_REMOTE_MCP_URL).toString()).toBe(
      DEFAULT_REMOTE_MCP_URL,
    );
  });
});

describe("normalizeEndpointUrl HTTPS enforcement", () => {
  it.each(HTTPS_HOSTS)("accepts https://%s", (host) => {
    const url = normalizeEndpointUrl(`https://${host}`);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe(host.replace(/^\[|\]$/g, ""));
    expect(url.pathname).toBe("/api/mcp");
  });

  it.each(HTTPS_HOSTS)(
    "accepts https://%s with an explicit /api/mcp path",
    (host) => {
      const url = normalizeEndpointUrl(`https://${host}/api/mcp`);
      expect(url.toString()).toBe(`https://${host}/api/mcp`);
    },
  );

  it.each(HTTPS_HOSTS)("accepts https://%s with a custom path", (host) => {
    const url = normalizeEndpointUrl(`https://${host}/custom/mcp`);
    expect(url.pathname).toBe("/custom/mcp");
  });

  it.each(HTTPS_HOSTS)("rejects http://%s outside localhost", (host) => {
    expect(() => normalizeEndpointUrl(`http://${host}`)).toThrow(HTTPS_ERROR);
  });

  it("accepts https URLs with non-default ports", () => {
    expect(normalizeEndpointUrl("https://example.com:8443").toString()).toBe(
      "https://example.com:8443/api/mcp",
    );
    expect(
      normalizeEndpointUrl("https://example.com:443/api/mcp").toString(),
    ).toBe("https://example.com/api/mcp");
  });

  it("preserves query strings on HTTPS URLs", () => {
    expect(
      normalizeEndpointUrl("https://example.com/api/mcp?token=abc").search,
    ).toBe("?token=abc");
    expect(normalizeEndpointUrl("https://example.com?debug=1").search).toBe(
      "?debug=1",
    );
  });

  it("preserves URL fragments on HTTPS URLs", () => {
    expect(
      normalizeEndpointUrl("https://example.com/api/mcp#section").hash,
    ).toBe("#section");
  });
});

describe("normalizeEndpointUrl localhost exceptions", () => {
  it.each([
    ["127.0.0.1", "127.0.0.1"],
    ["localhost", "localhost"],
    ["[::1]", "[::1]"],
    ["0.0.0.0", "0.0.0.0"],
  ] as const)(
    "allows http://%s without HTTPS enforcement",
    (host, expectedHostname) => {
      const url = normalizeEndpointUrl(`http://${host}:3000`);
      expect(url.protocol).toBe("http:");
      expect(url.hostname).toBe(expectedHostname);
      expect(url.port).toBe("3000");
      expect(url.pathname).toBe("/api/mcp");
    },
  );

  it.each([
    ["127.0.0.1", "127.0.0.1"],
    ["localhost", "localhost"],
    ["[::1]", "[::1]"],
    ["0.0.0.0", "0.0.0.0"],
  ] as const)("allows https://%s as well", (host, expectedHostname) => {
    const url = normalizeEndpointUrl(`https://${host}:8080/mcp`);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe(expectedHostname);
    expect(url.pathname).toBe("/mcp");
  });

  it("allows http://127.0.0.1 without a port", () => {
    expect(normalizeEndpointUrl("http://127.0.0.1").toString()).toBe(
      "http://127.0.0.1/api/mcp",
    );
  });

  it("allows http://localhost without a port", () => {
    expect(normalizeEndpointUrl("http://localhost").toString()).toBe(
      "http://localhost/api/mcp",
    );
  });

  it("allows http://[::1] bracketed IPv6 localhost", () => {
    expect(normalizeEndpointUrl("http://[::1]:3845").toString()).toBe(
      "http://[::1]:3845/api/mcp",
    );
  });

  it("rejects unbracketed http://::1 with a port as an invalid URL", () => {
    expect(() => normalizeEndpointUrl("http://::1:3845")).toThrow();
  });

  it("allows http://0.0.0.0 bind-all localhost alias", () => {
    expect(normalizeEndpointUrl("http://0.0.0.0:3845").toString()).toBe(
      "http://0.0.0.0:3845/api/mcp",
    );
  });
});

describe("normalizeEndpointUrl path defaulting", () => {
  it.each([
    ["https://example.com", "https://example.com/api/mcp"],
    ["https://example.com/", "https://example.com/api/mcp"],
    ["http://localhost", "http://localhost/api/mcp"],
    ["http://localhost/", "http://localhost/api/mcp"],
    ["http://127.0.0.1:3000", "http://127.0.0.1:3000/api/mcp"],
    ["http://127.0.0.1:3000/", "http://127.0.0.1:3000/api/mcp"],
    ["http://[::1]:8080", "http://[::1]:8080/api/mcp"],
    ["http://[::1]:8080/", "http://[::1]:8080/api/mcp"],
  ])("defaults empty root path for %s", (input, expected) => {
    expect(normalizeEndpointUrl(input).toString()).toBe(expected);
  });

  it.each([
    "/api/mcp",
    "/custom/mcp",
    "/v1/mcp",
    "/nested/path/mcp",
    "/api/mcp/extra",
  ])("preserves an existing path segment %s", (pathname) => {
    const url = normalizeEndpointUrl(`https://example.com${pathname}`);
    expect(url.pathname).toBe(pathname);
    expect(url.toString()).toBe(`https://example.com${pathname}`);
  });

  it("does not rewrite the default production path when already /api/mcp", () => {
    expect(normalizeEndpointUrl("https://heyclau.de/api/mcp").toString()).toBe(
      "https://heyclau.de/api/mcp",
    );
  });

  it("preserves trailing path segments without adding /api/mcp", () => {
    expect(normalizeEndpointUrl("https://example.com/mcp/v2").pathname).toBe(
      "/mcp/v2",
    );
  });
});

describe("normalizeEndpointUrl trimming and input coercion", () => {
  it.each([
    "  https://example.com  ",
    "\thttps://example.com\n",
    " https://example.com/api/mcp ",
  ])("trims surrounding whitespace from %j", (input) => {
    const url = normalizeEndpointUrl(input);
    expect(url.hostname).toBe("example.com");
  });

  it("coerces non-string-like empty values through String()", () => {
    expect(() => normalizeEndpointUrl(0 as unknown as string)).toThrow(
      REQUIRED_ERROR,
    );
    expect(() => normalizeEndpointUrl(false as unknown as string)).toThrow(
      REQUIRED_ERROR,
    );
  });
});

describe("normalizeEndpointUrl validation errors", () => {
  it.each(["", "   ", "\t", "\n"])(
    "throws when input is blank: %j",
    (input) => {
      expect(() => normalizeEndpointUrl(input)).toThrow(REQUIRED_ERROR);
    },
  );

  it.each([
    "not-a-url",
    "example.com",
    "://missing-scheme",
    "https://",
    "http://",
    "ftp://example.com",
    "javascript:alert(1)",
  ])("throws for invalid URL input: %j", (input) => {
    expect(() => normalizeEndpointUrl(input)).toThrow();
  });

  it.each([
    "http://example.com",
    "http://api.example.com/mcp",
    "http://192.168.1.10",
    "http://10.0.0.5:8080",
    "http://internal.corp",
  ])("rejects insecure remote host: %j", (input) => {
    expect(() => normalizeEndpointUrl(input)).toThrow(HTTPS_ERROR);
  });

  it("returns a URL object rather than a plain string", () => {
    expect(normalizeEndpointUrl("https://example.com")).toBeInstanceOf(URL);
  });
});

describe("normalizeTimeoutMs fallback behavior", () => {
  it.each([undefined, null, ""])("returns fallback for %j", (value) => {
    expect(normalizeTimeoutMs(value, 5000)).toBe(5000);
    expect(normalizeTimeoutMs(value, 12000)).toBe(12000);
  });

  it("defaults to DEFAULT_REQUEST_TIMEOUT_MS when fallback is omitted", () => {
    expect(normalizeTimeoutMs(undefined)).toBe(DEFAULT_REQUEST_TIMEOUT_MS);
    expect(normalizeTimeoutMs(null)).toBe(DEFAULT_REQUEST_TIMEOUT_MS);
    expect(normalizeTimeoutMs("")).toBe(DEFAULT_REQUEST_TIMEOUT_MS);
  });

  it("uses a custom fallback without touching DEFAULT_REQUEST_TIMEOUT_MS", () => {
    expect(normalizeTimeoutMs(undefined, 45000)).toBe(45000);
    expect(DEFAULT_REQUEST_TIMEOUT_MS).toBe(30000);
  });
});

describe("normalizeTimeoutMs valid in-range values", () => {
  it.each([
    1000, 1500, 2000, 5000, 10000, 15000, 30000, 60000, 120000, 180000, 240000,
    300000,
  ])("accepts numeric timeout %i", (value) => {
    expect(normalizeTimeoutMs(value)).toBe(value);
  });

  it.each(["1000", "2500", "30000", "120000", "300000"])(
    "accepts numeric string timeout %j",
    (value) => {
      expect(normalizeTimeoutMs(value)).toBe(Number(value));
    },
  );

  it.each([
    [1000.4, 1000],
    [2500.9, 2500],
    [30000.1, 30000],
    [99999.99, 99999],
    [299999.75, 299999],
  ])("truncates fractional timeout %i to %i", (input, expected) => {
    expect(normalizeTimeoutMs(input)).toBe(expected);
  });

  it("rejects fractional values above the maximum before truncation", () => {
    expect(() => normalizeTimeoutMs(300000.75)).toThrow(TIMEOUT_ERROR);
  });

  it("accepts boundary values exactly at 1000 and 300000", () => {
    expect(normalizeTimeoutMs(1000)).toBe(1000);
    expect(normalizeTimeoutMs(300000)).toBe(300000);
    expect(normalizeTimeoutMs("1000")).toBe(1000);
    expect(normalizeTimeoutMs("300000")).toBe(300000);
  });
});

describe("normalizeTimeoutMs invalid values", () => {
  it.each([0, 1, 100, 500, 999, -1, -1000])(
    "rejects timeout below minimum: %i",
    (value) => {
      expect(() => normalizeTimeoutMs(value)).toThrow(TIMEOUT_ERROR);
    },
  );

  it.each([300001, 300100, 400000, 600000, 1000000])(
    "rejects timeout above maximum: %i",
    (value) => {
      expect(() => normalizeTimeoutMs(value)).toThrow(TIMEOUT_ERROR);
    },
  );

  it.each([
    "abc",
    "30s",
    "1m",
    "NaN",
    "Infinity",
    "null",
    "undefined",
    "1,000",
    "30_000",
  ])("rejects non-numeric string %j", (value) => {
    expect(() => normalizeTimeoutMs(value)).toThrow(TIMEOUT_ERROR);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects non-finite numeric value %s",
    (value) => {
      expect(() => normalizeTimeoutMs(value)).toThrow(TIMEOUT_ERROR);
    },
  );

  it("rejects boolean values after coercion", () => {
    expect(() => normalizeTimeoutMs(true as unknown as number)).toThrow(
      TIMEOUT_ERROR,
    );
    expect(() => normalizeTimeoutMs(false as unknown as number)).toThrow(
      TIMEOUT_ERROR,
    );
  });

  it("rejects object values that do not parse as in-range numbers", () => {
    expect(() => normalizeTimeoutMs({} as unknown as number)).toThrow(
      TIMEOUT_ERROR,
    );
    expect(() => normalizeTimeoutMs([] as unknown as number)).toThrow(
      TIMEOUT_ERROR,
    );
  });
});

describe("normalizeTimeoutMs error message contract", () => {
  it("throws the documented range error for out-of-bounds values", () => {
    expect(() => normalizeTimeoutMs(999)).toThrow(TIMEOUT_ERROR);
    expect(() => normalizeTimeoutMs(300001)).toThrow(TIMEOUT_ERROR);
    expect(() => normalizeTimeoutMs("not-a-number")).toThrow(TIMEOUT_ERROR);
  });
});

describe("endpoint-url-lib integration scenarios", () => {
  it("normalizes a remote HTTPS endpoint and timeout together", () => {
    const url = normalizeEndpointUrl("https://mcp.example.com");
    const timeout = normalizeTimeoutMs("15000");

    expect(url.toString()).toBe("https://mcp.example.com/api/mcp");
    expect(timeout).toBe(15000);
  });

  it("normalizes a local dev endpoint with HTTP and custom timeout", () => {
    const url = normalizeEndpointUrl("http://localhost:6277");
    const timeout = normalizeTimeoutMs(5000);

    expect(url.toString()).toBe("http://localhost:6277/api/mcp");
    expect(timeout).toBe(5000);
  });

  it("keeps explicit remote paths while defaulting unset timeouts", () => {
    const url = normalizeEndpointUrl("https://example.com/prod/mcp");
    const timeout = normalizeTimeoutMs(undefined, DEFAULT_REQUEST_TIMEOUT_MS);

    expect(url.pathname).toBe("/prod/mcp");
    expect(timeout).toBe(30000);
  });

  it("supports IPv6 localhost dev servers with bracket notation", () => {
    const url = normalizeEndpointUrl("http://[::1]:3845/mcp");
    expect(url.toString()).toBe("http://[::1]:3845/mcp");
  });
});

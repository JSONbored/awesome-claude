import { describe, expect, it } from "vitest";

import {
  DEFAULT_REMOTE_MCP_URL,
  DEFAULT_REQUEST_TIMEOUT_MS,
  normalizeEndpointUrl,
  normalizeTimeoutMs,
} from "../packages/mcp/src/endpoint-url-lib.js";
import {
  DEFAULT_REMOTE_MCP_URL as defaultUrlFromWrapper,
  DEFAULT_REQUEST_TIMEOUT_MS as defaultTimeoutFromWrapper,
  normalizeEndpointUrl as normalizeEndpointUrlFromWrapper,
  normalizeTimeoutMs as normalizeTimeoutMsFromWrapper,
} from "../packages/mcp/src/endpoint-url.js";

describe("endpoint-url-lib endpoint normalization", () => {
  it("defaults to the production MCP endpoint path", () => {
    expect(DEFAULT_REMOTE_MCP_URL).toBe("https://heyclau.de/api/mcp");
    expect(normalizeEndpointUrl().toString()).toBe(DEFAULT_REMOTE_MCP_URL);
  });

  it("appends /api/mcp for bare HTTPS origins", () => {
    expect(normalizeEndpointUrl("https://example.com").toString()).toBe(
      "https://example.com/api/mcp",
    );
    expect(
      normalizeEndpointUrl("https://example.com/custom/mcp").toString(),
    ).toBe("https://example.com/custom/mcp");
  });

  it("allows localhost and loopback HTTP endpoints", () => {
    expect(normalizeEndpointUrl("http://localhost:3000").toString()).toBe(
      "http://localhost:3000/api/mcp",
    );
    expect(normalizeEndpointUrl("http://0.0.0.0:3845").toString()).toBe(
      "http://0.0.0.0:3845/api/mcp",
    );
  });

  it("rejects empty and non-HTTPS remote endpoints", () => {
    expect(() => normalizeEndpointUrl("")).toThrow(/endpoint URL is required/i);
    expect(() => normalizeEndpointUrl("http://example.com")).toThrow(
      /HTTPS outside localhost/i,
    );
    expect(() =>
      normalizeEndpointUrl("https://token@example.com/api/mcp"),
    ).toThrow(/must not embed credentials/i);
  });
});

describe("endpoint-url-lib timeout normalization", () => {
  it("returns fallback values for nullish input", () => {
    expect(normalizeTimeoutMs(undefined, 5000)).toBe(5000);
    expect(normalizeTimeoutMs(null, 5000)).toBe(5000);
    expect(normalizeTimeoutMs("", 5000)).toBe(5000);
    expect(normalizeTimeoutMs(undefined)).toBe(DEFAULT_REQUEST_TIMEOUT_MS);
  });

  it("accepts in-range numbers and rejects invalid values", () => {
    expect(normalizeTimeoutMs(2500)).toBe(2500);
    expect(normalizeTimeoutMs("3000")).toBe(3000);
    expect(() => normalizeTimeoutMs(999)).toThrow(
      /Timeout must be between 1000 and 300000 milliseconds/i,
    );
  });
});

describe("endpoint-url re-export compatibility", () => {
  it("keeps the public wrapper wired to the extracted lib", () => {
    expect(defaultUrlFromWrapper).toBe(DEFAULT_REMOTE_MCP_URL);
    expect(defaultTimeoutFromWrapper).toBe(DEFAULT_REQUEST_TIMEOUT_MS);
    expect(normalizeEndpointUrlFromWrapper).toBe(normalizeEndpointUrl);
    expect(normalizeTimeoutMsFromWrapper).toBe(normalizeTimeoutMs);
  });
});

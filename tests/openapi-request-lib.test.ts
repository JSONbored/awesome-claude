import { describe, expect, it } from "vitest";

import type {
  OpenApiEndpoint,
  OpenApiParam,
} from "../apps/web/src/data/openapi";
import {
  buildCurlCommand,
  buildRequestUrl,
} from "../apps/web/src/lib/openapi-request-lib";

const param = (
  over: Partial<OpenApiParam> & Pick<OpenApiParam, "name" | "in">,
) => ({ ...over }) as OpenApiParam;

const endpoint = (over: Partial<OpenApiEndpoint>): OpenApiEndpoint =>
  ({ path: "/", ...over }) as OpenApiEndpoint;

describe("buildRequestUrl", () => {
  it("returns a plain path unchanged when there is nothing to substitute", () => {
    expect(buildRequestUrl(endpoint({ path: "/api/v1/health" }), {})).toBe(
      "/api/v1/health",
    );
  });

  it("substitutes a path param from the provided values", () => {
    const ep = endpoint({
      path: "/api/v1/subnets/{netuid}",
      parameters: [param({ name: "netuid", in: "path" })],
    });
    expect(buildRequestUrl(ep, { netuid: "64" })).toBe("/api/v1/subnets/64");
  });

  it("falls back to the parameter example when no value is provided", () => {
    const ep = endpoint({
      path: "/api/v1/subnets/{netuid}",
      parameters: [param({ name: "netuid", in: "path", example: "1" })],
    });
    expect(buildRequestUrl(ep, {})).toBe("/api/v1/subnets/1");
  });

  it("url-encodes substituted path segments", () => {
    const ep = endpoint({
      path: "/api/v1/search/{q}",
      parameters: [param({ name: "q", in: "path" })],
    });
    expect(buildRequestUrl(ep, { q: "a b/c" })).toBe(
      "/api/v1/search/a%20b%2Fc",
    );
  });

  it("substitutes an unknown path param with an empty segment", () => {
    expect(buildRequestUrl(endpoint({ path: "/x/{missing}" }), {})).toBe("/x/");
  });

  it("appends non-empty query params and skips empty ones", () => {
    const ep = endpoint({
      path: "/api/v1/entries",
      parameters: [
        param({ name: "category", in: "query" }),
        param({ name: "limit", in: "query", example: "10" }),
        param({ name: "cursor", in: "query" }),
      ],
    });
    expect(buildRequestUrl(ep, { category: "mcp" })).toBe(
      "/api/v1/entries?category=mcp&limit=10",
    );
  });

  it("ignores non-query params when building the query string", () => {
    const ep = endpoint({
      path: "/api/v1/subnets/{netuid}",
      parameters: [
        param({ name: "netuid", in: "path", example: "7" }),
        param({ name: "x-key", in: "header", example: "secret" }),
      ],
    });
    expect(buildRequestUrl(ep, {})).toBe("/api/v1/subnets/7");
  });
});

describe("buildCurlCommand", () => {
  it("builds a simple GET curl from documented path/query examples", () => {
    const ep = endpoint({
      method: "GET",
      path: "/api/v1/entries",
      parameters: [param({ name: "category", in: "query", example: "mcp" })],
    });
    expect(buildCurlCommand(ep)).toBe(
      "curl 'https://heyclau.de/api/v1/entries?category=mcp'",
    );
  });

  it("uses the live playground body for POST curl -d payload", () => {
    const ep = endpoint({
      id: "votes.toggle",
      method: "POST",
      path: "/api/v1/votes/toggle",
      body: {
        contentType: "application/json",
        example: '{\n  "key": "mcp:old",\n  "vote": true\n}',
      },
    });
    const edited =
      '{"key":"mcp:github-mcp-server","clientId":"anon","vote":false}';
    expect(buildCurlCommand(ep, edited)).toBe(
      'curl -X POST \'https://heyclau.de/api/v1/votes/toggle\' \\\n  -H \'content-type: application/json\' \\\n  -d \'{"key":"mcp:github-mcp-server","clientId":"anon","vote":false}\'',
    );
  });

  it("falls back to the documented body example when no live body is passed", () => {
    const ep = endpoint({
      method: "PATCH",
      path: "/api/v1/example",
      body: {
        contentType: "application/json",
        example: '{\n  "status": "active"\n}',
      },
    });
    expect(buildCurlCommand(ep)).toBe(
      "curl -X PATCH 'https://heyclau.de/api/v1/example' \\\n  -H 'content-type: application/json' \\\n  -d '{  \"status\": \"active\"}'",
    );
  });

  it("strips newlines from the live body the same way the static example did", () => {
    const ep = endpoint({
      method: "POST",
      path: "/api/v1/newsletter/subscribe",
      body: {
        contentType: "application/json",
        example: '{"email":"a@b.c"}',
      },
    });
    expect(buildCurlCommand(ep, '{\n  "email": "reader@example.com"\n}')).toBe(
      "curl -X POST 'https://heyclau.de/api/v1/newsletter/subscribe' \\\n  -H 'content-type: application/json' \\\n  -d '{  \"email\": \"reader@example.com\"}'",
    );
  });
});

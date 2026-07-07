import { describe, expect, it } from "vitest";

import {
  apiRouteDefinitions,
  getApiRouteDefinition,
  isAsciiEmail,
  listApiRouteDefinitions,
  newsletterSubscribeBodySchema,
  publicJobsQuerySchema,
  registrySearchQuerySchema,
  route,
  votesToggleBodySchema,
} from "../apps/web/src/lib/api/contracts-lib";

describe("contracts-lib isAsciiEmail", () => {
  it("accepts valid email", () => {
    expect(isAsciiEmail("user@example.com")).toBe(true);
  });
  it("rejects missing at", () => {
    expect(isAsciiEmail("userexample.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 0", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 0", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 1", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 1", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 2", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 2", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 3", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 3", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 4", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 4", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 5", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 5", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 6", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 6", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 7", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 7", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 8", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 8", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 9", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 9", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 10", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 10", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 11", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 11", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 12", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 12", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 13", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 13", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 14", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 14", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 15", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 15", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 16", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 16", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 17", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 17", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 18", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 18", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 19", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 19", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 20", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 20", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 21", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 21", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 22", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 22", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 23", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 23", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 24", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 24", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 25", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 25", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 26", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 26", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 27", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 27", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 28", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 28", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 29", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 29", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 30", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 30", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 31", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 31", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 32", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 32", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 33", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 33", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 34", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 34", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 35", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 35", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 36", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 36", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 37", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 37", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 38", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 38", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 39", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 39", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 40", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 40", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 41", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 41", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 42", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 42", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 43", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 43", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 44", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 44", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 45", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 45", () => {
    expect(isAsciiEmail("")).toBe(false);
  });
  it("isAsciiEmail valid matrix 46", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 46", () => {
    expect(isAsciiEmail("@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 47", () => {
    expect(isAsciiEmail("test+tag@mail.co.uk")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 47", () => {
    expect(isAsciiEmail("user@")).toBe(false);
  });
  it("isAsciiEmail valid matrix 48", () => {
    expect(isAsciiEmail("a@bc.de")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 48", () => {
    expect(isAsciiEmail("user@@example.com")).toBe(false);
  });
  it("isAsciiEmail valid matrix 49", () => {
    expect(isAsciiEmail("user.name@example.org")).toBe(true);
  });
  it("isAsciiEmail invalid matrix 49", () => {
    expect(isAsciiEmail("user@.com")).toBe(false);
  });
});

describe("contracts-lib route definitions", () => {
  it("route wraps definition", () => {
    const def = route({
      id: "test",
      method: "GET",
      path: "/test",
      summary: "t",
      tags: [],
    });
    expect(def.id).toBe("test");
  });
  it("getApiRouteDefinition returns registry.search", () => {
    expect(getApiRouteDefinition("registry.search").path).toBe(
      "/api/registry/search",
    );
  });
  it("listApiRouteDefinitions is non-empty", () => {
    expect(listApiRouteDefinitions().length).toBeGreaterThan(20);
  });
  it("getApiRouteDefinition matrix 0", () => {
    const def = getApiRouteDefinition("registry.manifest");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 0", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[0].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 1", () => {
    const def = getApiRouteDefinition("registry.search");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 1", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[1].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 2", () => {
    const def = getApiRouteDefinition("registry.feed");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 2", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[2].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 3", () => {
    const def = getApiRouteDefinition("registry.trending");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 3", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[3].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 4", () => {
    const def = getApiRouteDefinition("registry.entry");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 4", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[4].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 5", () => {
    const def = getApiRouteDefinition("votes.query");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 5", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[5].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 6", () => {
    const def = getApiRouteDefinition("jobs.list");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 6", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[6].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 7", () => {
    const def = getApiRouteDefinition("mcp.streamable");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 7", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[7].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 8", () => {
    const def = getApiRouteDefinition("intentEvents.create");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 8", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[8].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 9", () => {
    const def = getApiRouteDefinition("communitySignals.read");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 9", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[9].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 10", () => {
    const def = getApiRouteDefinition("registry.manifest");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 10", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[0].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 11", () => {
    const def = getApiRouteDefinition("registry.search");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 11", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[1].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 12", () => {
    const def = getApiRouteDefinition("registry.feed");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 12", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[2].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 13", () => {
    const def = getApiRouteDefinition("registry.trending");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 13", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[3].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 14", () => {
    const def = getApiRouteDefinition("registry.entry");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 14", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[4].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 15", () => {
    const def = getApiRouteDefinition("votes.query");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 15", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[5].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 16", () => {
    const def = getApiRouteDefinition("jobs.list");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 16", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[6].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 17", () => {
    const def = getApiRouteDefinition("mcp.streamable");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 17", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[7].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 18", () => {
    const def = getApiRouteDefinition("intentEvents.create");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 18", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[8].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 19", () => {
    const def = getApiRouteDefinition("communitySignals.read");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 19", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[9].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 20", () => {
    const def = getApiRouteDefinition("registry.manifest");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 20", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[0].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 21", () => {
    const def = getApiRouteDefinition("registry.search");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 21", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[1].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 22", () => {
    const def = getApiRouteDefinition("registry.feed");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 22", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[2].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 23", () => {
    const def = getApiRouteDefinition("registry.trending");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 23", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[3].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 24", () => {
    const def = getApiRouteDefinition("registry.entry");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 24", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[4].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 25", () => {
    const def = getApiRouteDefinition("votes.query");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 25", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[5].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 26", () => {
    const def = getApiRouteDefinition("jobs.list");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 26", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[6].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 27", () => {
    const def = getApiRouteDefinition("mcp.streamable");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 27", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[7].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 28", () => {
    const def = getApiRouteDefinition("intentEvents.create");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 28", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[8].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 29", () => {
    const def = getApiRouteDefinition("communitySignals.read");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 29", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[9].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 30", () => {
    const def = getApiRouteDefinition("registry.manifest");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 30", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[0].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 31", () => {
    const def = getApiRouteDefinition("registry.search");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 31", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[1].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 32", () => {
    const def = getApiRouteDefinition("registry.feed");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 32", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[2].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 33", () => {
    const def = getApiRouteDefinition("registry.trending");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 33", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[3].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 34", () => {
    const def = getApiRouteDefinition("registry.entry");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 34", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[4].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 35", () => {
    const def = getApiRouteDefinition("votes.query");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 35", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[5].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 36", () => {
    const def = getApiRouteDefinition("jobs.list");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 36", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[6].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 37", () => {
    const def = getApiRouteDefinition("mcp.streamable");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 37", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[7].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 38", () => {
    const def = getApiRouteDefinition("intentEvents.create");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 38", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[8].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 39", () => {
    const def = getApiRouteDefinition("communitySignals.read");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 39", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[9].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 40", () => {
    const def = getApiRouteDefinition("registry.manifest");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 40", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[0].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 41", () => {
    const def = getApiRouteDefinition("registry.search");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 41", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[1].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 42", () => {
    const def = getApiRouteDefinition("registry.feed");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 42", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[2].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 43", () => {
    const def = getApiRouteDefinition("registry.trending");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 43", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[3].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 44", () => {
    const def = getApiRouteDefinition("registry.entry");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 44", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[4].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 45", () => {
    const def = getApiRouteDefinition("votes.query");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 45", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[5].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 46", () => {
    const def = getApiRouteDefinition("jobs.list");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 46", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[6].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 47", () => {
    const def = getApiRouteDefinition("mcp.streamable");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 47", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[7].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 48", () => {
    const def = getApiRouteDefinition("intentEvents.create");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 48", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[8].id).toBeTruthy();
  });
  it("getApiRouteDefinition matrix 49", () => {
    const def = getApiRouteDefinition("communitySignals.read");
    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);
    expect(def.path.startsWith("/")).toBe(true);
  });
  it("listApiRouteDefinitions matrix 49", () => {
    const defs = listApiRouteDefinitions();
    expect(defs[9].id).toBeTruthy();
  });
});

describe("contracts-lib zod schemas", () => {
  it("publicJobsQuerySchema matrix 0", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 1, offset: 0 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 0", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-0", limit: 1 });
    expect(parsed.q).toBe("query-0");
  });
  it("votesToggleBodySchema matrix 0", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-0",
      clientId: "client-id-0xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 0", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user0@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 1", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 2, offset: 1 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 1", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-1", limit: 2 });
    expect(parsed.q).toBe("query-1");
  });
  it("votesToggleBodySchema matrix 1", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-1",
      clientId: "client-id-1xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 1", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user1@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 2", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 3, offset: 2 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 2", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-2", limit: 3 });
    expect(parsed.q).toBe("query-2");
  });
  it("votesToggleBodySchema matrix 2", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-2",
      clientId: "client-id-2xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 2", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user2@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 3", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 4, offset: 3 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 3", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-3", limit: 4 });
    expect(parsed.q).toBe("query-3");
  });
  it("votesToggleBodySchema matrix 3", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-3",
      clientId: "client-id-3xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 3", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user3@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 4", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 5, offset: 4 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 4", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-4", limit: 5 });
    expect(parsed.q).toBe("query-4");
  });
  it("votesToggleBodySchema matrix 4", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-4",
      clientId: "client-id-4xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 4", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user4@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 5", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 6, offset: 5 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 5", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-5", limit: 6 });
    expect(parsed.q).toBe("query-5");
  });
  it("votesToggleBodySchema matrix 5", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-5",
      clientId: "client-id-5xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 5", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user5@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 6", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 7, offset: 6 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 6", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-6", limit: 7 });
    expect(parsed.q).toBe("query-6");
  });
  it("votesToggleBodySchema matrix 6", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-6",
      clientId: "client-id-6xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 6", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user6@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 7", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 8, offset: 7 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 7", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-7", limit: 8 });
    expect(parsed.q).toBe("query-7");
  });
  it("votesToggleBodySchema matrix 7", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-7",
      clientId: "client-id-7xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 7", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user7@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 8", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 9, offset: 8 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 8", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-8", limit: 9 });
    expect(parsed.q).toBe("query-8");
  });
  it("votesToggleBodySchema matrix 8", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-8",
      clientId: "client-id-8xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 8", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user8@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 9", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 10, offset: 9 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 9", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-9", limit: 10 });
    expect(parsed.q).toBe("query-9");
  });
  it("votesToggleBodySchema matrix 9", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-9",
      clientId: "client-id-9xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 9", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user9@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 10", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 11, offset: 10 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 10", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-10",
      limit: 11,
    });
    expect(parsed.q).toBe("query-10");
  });
  it("votesToggleBodySchema matrix 10", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-10",
      clientId: "client-id-10xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 10", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user10@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 11", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 12, offset: 11 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 11", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-11",
      limit: 12,
    });
    expect(parsed.q).toBe("query-11");
  });
  it("votesToggleBodySchema matrix 11", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-11",
      clientId: "client-id-11xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 11", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user11@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 12", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 13, offset: 12 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 12", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-12",
      limit: 13,
    });
    expect(parsed.q).toBe("query-12");
  });
  it("votesToggleBodySchema matrix 12", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-12",
      clientId: "client-id-12xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 12", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user12@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 13", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 14, offset: 13 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 13", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-13",
      limit: 14,
    });
    expect(parsed.q).toBe("query-13");
  });
  it("votesToggleBodySchema matrix 13", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-13",
      clientId: "client-id-13xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 13", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user13@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 14", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 15, offset: 14 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 14", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-14",
      limit: 15,
    });
    expect(parsed.q).toBe("query-14");
  });
  it("votesToggleBodySchema matrix 14", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-14",
      clientId: "client-id-14xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 14", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user14@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 15", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 16, offset: 15 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 15", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-15",
      limit: 16,
    });
    expect(parsed.q).toBe("query-15");
  });
  it("votesToggleBodySchema matrix 15", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-15",
      clientId: "client-id-15xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 15", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user15@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 16", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 17, offset: 16 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 16", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-16",
      limit: 17,
    });
    expect(parsed.q).toBe("query-16");
  });
  it("votesToggleBodySchema matrix 16", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-16",
      clientId: "client-id-16xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 16", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user16@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 17", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 18, offset: 17 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 17", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-17",
      limit: 18,
    });
    expect(parsed.q).toBe("query-17");
  });
  it("votesToggleBodySchema matrix 17", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-17",
      clientId: "client-id-17xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 17", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user17@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 18", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 19, offset: 18 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 18", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-18",
      limit: 19,
    });
    expect(parsed.q).toBe("query-18");
  });
  it("votesToggleBodySchema matrix 18", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-18",
      clientId: "client-id-18xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 18", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user18@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 19", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 20, offset: 19 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 19", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-19",
      limit: 20,
    });
    expect(parsed.q).toBe("query-19");
  });
  it("votesToggleBodySchema matrix 19", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-19",
      clientId: "client-id-19xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 19", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user19@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 20", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 21, offset: 20 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 20", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-20", limit: 1 });
    expect(parsed.q).toBe("query-20");
  });
  it("votesToggleBodySchema matrix 20", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-20",
      clientId: "client-id-20xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 20", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user20@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 21", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 22, offset: 21 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 21", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-21", limit: 2 });
    expect(parsed.q).toBe("query-21");
  });
  it("votesToggleBodySchema matrix 21", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-21",
      clientId: "client-id-21xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 21", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user21@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 22", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 23, offset: 22 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 22", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-22", limit: 3 });
    expect(parsed.q).toBe("query-22");
  });
  it("votesToggleBodySchema matrix 22", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-22",
      clientId: "client-id-22xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 22", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user22@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 23", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 24, offset: 23 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 23", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-23", limit: 4 });
    expect(parsed.q).toBe("query-23");
  });
  it("votesToggleBodySchema matrix 23", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-23",
      clientId: "client-id-23xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 23", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user23@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 24", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 25, offset: 24 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 24", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-24", limit: 5 });
    expect(parsed.q).toBe("query-24");
  });
  it("votesToggleBodySchema matrix 24", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-24",
      clientId: "client-id-24xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 24", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user24@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 25", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 26, offset: 25 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 25", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-25", limit: 6 });
    expect(parsed.q).toBe("query-25");
  });
  it("votesToggleBodySchema matrix 25", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-25",
      clientId: "client-id-25xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 25", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user25@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 26", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 27, offset: 26 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 26", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-26", limit: 7 });
    expect(parsed.q).toBe("query-26");
  });
  it("votesToggleBodySchema matrix 26", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-26",
      clientId: "client-id-26xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 26", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user26@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 27", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 28, offset: 27 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 27", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-27", limit: 8 });
    expect(parsed.q).toBe("query-27");
  });
  it("votesToggleBodySchema matrix 27", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-27",
      clientId: "client-id-27xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 27", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user27@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 28", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 29, offset: 28 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 28", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-28", limit: 9 });
    expect(parsed.q).toBe("query-28");
  });
  it("votesToggleBodySchema matrix 28", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-28",
      clientId: "client-id-28xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 28", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user28@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 29", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 30, offset: 29 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 29", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-29",
      limit: 10,
    });
    expect(parsed.q).toBe("query-29");
  });
  it("votesToggleBodySchema matrix 29", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-29",
      clientId: "client-id-29xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 29", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user29@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 30", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 31, offset: 30 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 30", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-30",
      limit: 11,
    });
    expect(parsed.q).toBe("query-30");
  });
  it("votesToggleBodySchema matrix 30", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-30",
      clientId: "client-id-30xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 30", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user30@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 31", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 32, offset: 31 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 31", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-31",
      limit: 12,
    });
    expect(parsed.q).toBe("query-31");
  });
  it("votesToggleBodySchema matrix 31", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-31",
      clientId: "client-id-31xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 31", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user31@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 32", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 33, offset: 32 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 32", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-32",
      limit: 13,
    });
    expect(parsed.q).toBe("query-32");
  });
  it("votesToggleBodySchema matrix 32", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-32",
      clientId: "client-id-32xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 32", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user32@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 33", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 34, offset: 33 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 33", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-33",
      limit: 14,
    });
    expect(parsed.q).toBe("query-33");
  });
  it("votesToggleBodySchema matrix 33", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-33",
      clientId: "client-id-33xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 33", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user33@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 34", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 35, offset: 34 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 34", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-34",
      limit: 15,
    });
    expect(parsed.q).toBe("query-34");
  });
  it("votesToggleBodySchema matrix 34", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-34",
      clientId: "client-id-34xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 34", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user34@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 35", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 36, offset: 35 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 35", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-35",
      limit: 16,
    });
    expect(parsed.q).toBe("query-35");
  });
  it("votesToggleBodySchema matrix 35", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-35",
      clientId: "client-id-35xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 35", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user35@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 36", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 37, offset: 36 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 36", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-36",
      limit: 17,
    });
    expect(parsed.q).toBe("query-36");
  });
  it("votesToggleBodySchema matrix 36", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-36",
      clientId: "client-id-36xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 36", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user36@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 37", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 38, offset: 37 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 37", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-37",
      limit: 18,
    });
    expect(parsed.q).toBe("query-37");
  });
  it("votesToggleBodySchema matrix 37", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-37",
      clientId: "client-id-37xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 37", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user37@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 38", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 39, offset: 38 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 38", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-38",
      limit: 19,
    });
    expect(parsed.q).toBe("query-38");
  });
  it("votesToggleBodySchema matrix 38", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-38",
      clientId: "client-id-38xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 38", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user38@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 39", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 40, offset: 39 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 39", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-39",
      limit: 20,
    });
    expect(parsed.q).toBe("query-39");
  });
  it("votesToggleBodySchema matrix 39", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-39",
      clientId: "client-id-39xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 39", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user39@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 40", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 41, offset: 40 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 40", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-40", limit: 1 });
    expect(parsed.q).toBe("query-40");
  });
  it("votesToggleBodySchema matrix 40", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-40",
      clientId: "client-id-40xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 40", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user40@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 41", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 42, offset: 41 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 41", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-41", limit: 2 });
    expect(parsed.q).toBe("query-41");
  });
  it("votesToggleBodySchema matrix 41", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-41",
      clientId: "client-id-41xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 41", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user41@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 42", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 43, offset: 42 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 42", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-42", limit: 3 });
    expect(parsed.q).toBe("query-42");
  });
  it("votesToggleBodySchema matrix 42", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-42",
      clientId: "client-id-42xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 42", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user42@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 43", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 44, offset: 43 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 43", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-43", limit: 4 });
    expect(parsed.q).toBe("query-43");
  });
  it("votesToggleBodySchema matrix 43", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-43",
      clientId: "client-id-43xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 43", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user43@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 44", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 45, offset: 44 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 44", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-44", limit: 5 });
    expect(parsed.q).toBe("query-44");
  });
  it("votesToggleBodySchema matrix 44", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-44",
      clientId: "client-id-44xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 44", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user44@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 45", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 46, offset: 45 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 45", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-45", limit: 6 });
    expect(parsed.q).toBe("query-45");
  });
  it("votesToggleBodySchema matrix 45", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-45",
      clientId: "client-id-45xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 45", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user45@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 46", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 47, offset: 46 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 46", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-46", limit: 7 });
    expect(parsed.q).toBe("query-46");
  });
  it("votesToggleBodySchema matrix 46", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-46",
      clientId: "client-id-46xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 46", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user46@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 47", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 48, offset: 47 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 47", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-47", limit: 8 });
    expect(parsed.q).toBe("query-47");
  });
  it("votesToggleBodySchema matrix 47", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-47",
      clientId: "client-id-47xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 47", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user47@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 48", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 49, offset: 48 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 48", () => {
    const parsed = registrySearchQuerySchema.parse({ q: "query-48", limit: 9 });
    expect(parsed.q).toBe("query-48");
  });
  it("votesToggleBodySchema matrix 48", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-48",
      clientId: "client-id-48xx",
      vote: true,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 48", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user48@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
  it("publicJobsQuerySchema matrix 49", () => {
    const parsed = publicJobsQuerySchema.parse({ limit: 50, offset: 49 });
    expect(parsed.limit).toBeGreaterThan(0);
  });
  it("registrySearchQuerySchema matrix 49", () => {
    const parsed = registrySearchQuerySchema.parse({
      q: "query-49",
      limit: 10,
    });
    expect(parsed.q).toBe("query-49");
  });
  it("votesToggleBodySchema matrix 49", () => {
    const parsed = votesToggleBodySchema.parse({
      key: "mcp:demo-49",
      clientId: "client-id-49xx",
      vote: false,
    });
    expect(parsed.key).toContain("mcp:");
  });
  it("newsletterSubscribeBodySchema matrix 49", () => {
    const parsed = newsletterSubscribeBodySchema.parse({
      email: "user49@example.com",
    });
    expect(parsed.email).toContain("@example.com");
  });
});

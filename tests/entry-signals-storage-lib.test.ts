import { describe, expect, it } from "vitest";

import {
  defaultClientId,
  getClientId,
  readActiveCommunity,
  writeActiveCommunity,
} from "../apps/web/src/lib/entry-signals-storage-lib";

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    _map: map,
  };
}

const CLIENT_KEY = "hc:client-id";
const VALID_ID = "hc-0123456789abcdef";

describe("getClientId", () => {
  it("returns '' without storage", () => {
    expect(getClientId(null, () => VALID_ID)).toBe("");
  });

  it("generates and persists a new id when none is stored", () => {
    const storage = fakeStorage();
    expect(getClientId(storage, () => VALID_ID)).toBe(VALID_ID);
    expect(storage._map.get(CLIENT_KEY)).toBe(VALID_ID);
  });

  it("reuses a stored id that matches the expected shape", () => {
    const storage = fakeStorage({ [CLIENT_KEY]: VALID_ID });
    expect(getClientId(storage, () => "hc-REGENERATED-000000")).toBe(VALID_ID);
  });

  it("regenerates when the stored id is malformed", () => {
    const storage = fakeStorage({ [CLIENT_KEY]: "short" });
    expect(getClientId(storage, () => VALID_ID)).toBe(VALID_ID);
    expect(storage._map.get(CLIENT_KEY)).toBe(VALID_ID);
  });
});

describe("defaultClientId", () => {
  it("produces an id of the expected shape", () => {
    expect(defaultClientId()).toMatch(/^hc-[a-zA-Z0-9_-]{13,}$/);
  });
});

describe("readActiveCommunity / writeActiveCommunity", () => {
  it("returns {} without storage or when nothing is stored", () => {
    expect(readActiveCommunity(null, "entry:mcp/foo")).toEqual({});
    expect(readActiveCommunity(fakeStorage(), "entry:mcp/foo")).toEqual({});
  });

  it("normalizes the stored flags to booleans", () => {
    const storage = fakeStorage({
      "hc:community:entry:mcp/foo": JSON.stringify({ used: true, works: 1 }),
    });
    expect(readActiveCommunity(storage, "entry:mcp/foo")).toEqual({
      used: true,
      works: false,
      broken: false,
    });
  });

  it("returns {} for malformed stored JSON", () => {
    const storage = fakeStorage({ "hc:community:entry:mcp/foo": "{not json" });
    expect(readActiveCommunity(storage, "entry:mcp/foo")).toEqual({});
  });

  it("round-trips through writeActiveCommunity", () => {
    const storage = fakeStorage();
    writeActiveCommunity(storage, "entry:mcp/foo", {
      used: true,
      broken: true,
    });
    expect(readActiveCommunity(storage, "entry:mcp/foo")).toEqual({
      used: true,
      works: false,
      broken: true,
    });
  });

  it("is a no-op on write without storage", () => {
    expect(() =>
      writeActiveCommunity(null, "entry:mcp/foo", { used: true }),
    ).not.toThrow();
  });
});

import { describe, expect, it } from "vitest";

import {
  normalizeError,
  type NormalizedError,
} from "../apps/web/src/lib/client-logs-lib";

describe("normalizeError", () => {
  it("keeps the name and message of a plain Error", () => {
    expect(normalizeError(new Error("boom"))).toEqual({
      name: "Error",
      message: "boom",
    });
  });

  it("preserves the subclass name of a built-in Error subtype", () => {
    expect(normalizeError(new TypeError("bad type"))).toEqual({
      name: "TypeError",
      message: "bad type",
    });
  });

  it("preserves a custom Error subclass name", () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = "CustomError";
      }
    }
    expect(normalizeError(new CustomError("nope"))).toEqual({
      name: "CustomError",
      message: "nope",
    });
  });

  it("keeps an empty Error message as an empty string", () => {
    expect(normalizeError(new Error(""))).toEqual({
      name: "Error",
      message: "",
    });
  });

  it("coerces a non-Error string to a generic Error message", () => {
    expect(normalizeError("oops")).toEqual({
      name: "Error",
      message: "oops",
    });
  });

  it("stringifies a non-Error number", () => {
    expect(normalizeError(42)).toEqual({ name: "Error", message: "42" });
  });

  it("stringifies a non-Error object", () => {
    expect(normalizeError({ code: 500 })).toEqual({
      name: "Error",
      message: "[object Object]",
    });
  });

  it("reports null as Unknown error", () => {
    expect(normalizeError(null)).toEqual({
      name: "Error",
      message: "Unknown error",
    });
  });

  it("reports undefined as Unknown error", () => {
    expect(normalizeError(undefined)).toEqual({
      name: "Error",
      message: "Unknown error",
    });
  });

  it("reports an empty string as Unknown error (falsy input)", () => {
    expect(normalizeError("")).toEqual({
      name: "Error",
      message: "Unknown error",
    });
  });

  it("reports 0 as Unknown error (falsy input)", () => {
    expect(normalizeError(0)).toEqual({
      name: "Error",
      message: "Unknown error",
    });
  });

  it("reports false as Unknown error (falsy input)", () => {
    expect(normalizeError(false)).toEqual({
      name: "Error",
      message: "Unknown error",
    });
  });

  it("returns the NormalizedError shape", () => {
    const result: NormalizedError = normalizeError(new Error("shape"));
    expect(Object.keys(result).sort()).toEqual(["message", "name"]);
  });
});

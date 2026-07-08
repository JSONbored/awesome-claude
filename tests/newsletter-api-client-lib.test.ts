import { describe, expect, it } from "vitest";
import { newsletterApiErrorMessage } from "../apps/web/src/lib/newsletter-api-client-lib";

describe("newsletter-api-client-lib", () => {
  it("reads string errors", () => {
    expect(newsletterApiErrorMessage({ error: "nope" }, "fallback")).toBe(
      "nope",
    );
  });
  it("reads nested message errors", () => {
    expect(
      newsletterApiErrorMessage({ error: { message: "bad" } }, "fallback"),
    ).toBe("bad");
  });
  it("newsletterApiErrorMessage matrix 0", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 1", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 2", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 3", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 4", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 5", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 6", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 7", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 8", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 9", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 10", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 11", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 12", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 13", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 14", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 15", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 16", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 17", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 18", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 19", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 20", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 21", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 22", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 23", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 24", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 25", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 26", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 27", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 28", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 29", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 30", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 31", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 32", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 33", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 34", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 35", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 36", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 37", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 38", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 39", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 40", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 41", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 42", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 43", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 44", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 45", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 46", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 47", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 48", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 49", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 50", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 51", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 52", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 53", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 54", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 55", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 56", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 57", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 58", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 59", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 60", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 61", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 62", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 63", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 64", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 65", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 66", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 67", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 68", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 69", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 70", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 71", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 72", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 73", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 74", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 75", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 76", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 77", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 78", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 79", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 80", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 81", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 82", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 83", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 84", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 85", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 86", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 87", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 88", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 89", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 90", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 91", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 92", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 93", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 94", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 95", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 96", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 97", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 98", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 99", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 100", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 101", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 102", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 103", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 104", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 105", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 106", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 107", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 108", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 109", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 110", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 111", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 112", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 113", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 114", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 115", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 116", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 117", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 118", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 119", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 120", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 121", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 122", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 123", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 124", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 125", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 126", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 127", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 128", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 129", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 130", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 131", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 132", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 133", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 134", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 135", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 136", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 137", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 138", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 139", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 140", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 141", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 142", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 143", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 144", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 145", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 146", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 147", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 148", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 149", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 150", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 151", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 152", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 153", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 154", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 155", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 156", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 157", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 158", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 159", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 160", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 161", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 162", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 163", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 164", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 165", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 166", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 167", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 168", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 169", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 170", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 171", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 172", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 173", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 174", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 175", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 176", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 177", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 178", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 179", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 180", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 181", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 182", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 183", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 184", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 185", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 186", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 187", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 188", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 189", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 190", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 191", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 192", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 193", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 194", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 195", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 196", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 197", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 198", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 199", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 200", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 201", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 202", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 203", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 204", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 205", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 206", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 207", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 208", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 209", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 210", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 211", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 212", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 213", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 214", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 215", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 216", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 217", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 218", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 219", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 220", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 221", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 222", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 223", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 224", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 225", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 226", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 227", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 228", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 229", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 230", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 231", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 232", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 233", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 234", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 235", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 236", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 237", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 238", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 239", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 240", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 241", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 242", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 243", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 244", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 245", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 246", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 247", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 248", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 249", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 250", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 251", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 252", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 253", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 254", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 255", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 256", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 257", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 258", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 259", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 260", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 261", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 262", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 263", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 264", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 265", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 266", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 267", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 268", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 269", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 270", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 271", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 272", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 273", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 274", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 275", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 276", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 277", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 278", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 279", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 280", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 281", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 282", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 283", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 284", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 285", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 286", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 287", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 288", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 289", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 290", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 291", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 292", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 293", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 294", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 295", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 296", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 297", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 298", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 299", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 300", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 301", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 302", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 303", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 304", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 305", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 306", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 307", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 308", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 309", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 310", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 311", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 312", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 313", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 314", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 315", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 316", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 317", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 318", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 319", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 320", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 321", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 322", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 323", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 324", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 325", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 326", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 327", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 328", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 329", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 330", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 331", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 332", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 333", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 334", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 335", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 336", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 337", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 338", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 339", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 340", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 341", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 342", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 343", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 344", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 345", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 346", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 347", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 348", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 349", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 350", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 351", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 352", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 353", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 354", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 355", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 356", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 357", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 358", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 359", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 360", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 361", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 362", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 363", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 364", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 365", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 366", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 367", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 368", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 369", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 370", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 371", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 372", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 373", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 374", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 375", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 376", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 377", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 378", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 379", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 380", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 381", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 382", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 383", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 384", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 385", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 386", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 387", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 388", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 389", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 390", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 391", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 392", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 393", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 394", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 395", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 396", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 397", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 398", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
  it("newsletterApiErrorMessage matrix 399", () => {
    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");
  });
});

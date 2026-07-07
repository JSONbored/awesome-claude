import { describe, expect, it } from "vitest";
import {
  buildIntentEventEntryKey,
  buildIntentEventRequestBody,
  intentEventWasStored,
} from "@/lib/intent-event-client-lib";

describe("intent event client lib", () => {
  it("builds privacy-light intent event request bodies", () => {
    expect(buildIntentEventEntryKey("skills", "demo")).toBe("skills:demo");
    expect(buildIntentEventRequestBody("install", "skills:demo")).toBe(
      JSON.stringify({ type: "install", entryKey: "skills:demo" }),
    );
  });

  it("interprets stored intent-event API responses", () => {
    expect(intentEventWasStored({ stored: true })).toBe(true);
    expect(
      intentEventWasStored({ stored: false, reason: "insert_failed" }),
    ).toBe(false);
    expect(intentEventWasStored(null)).toBe(false);
  });
});

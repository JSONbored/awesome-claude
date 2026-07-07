import { describe, expect, it, vi } from "vitest";

import {
  INTENT_EVENT_TYPES,
  ZERO_INTENT_EVENT_COUNTS,
  getFallbackIntentEventCounts,
  normalizeIntentEntryKey,
  normalizeIntentEventType,
  normalizeIntentSessionId,
  queryIntentEventCounts,
} from "../apps/web/src/lib/intent-events-lib";

describe("intent-events-lib normalizers", () => {
  it("normalizeIntentEventType matrix 0", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-0")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 0", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-0")).toBe("mcp:demo-0");
    expect(normalizeIntentEntryKey("bad key 0")).toBe("");
  });
  it("normalizeIntentSessionId matrix 0", () => {
    expect(normalizeIntentSessionId("session-0")).toBe("session-0");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 1", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-1")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 1", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-1")).toBe("mcp:demo-1");
    expect(normalizeIntentEntryKey("bad key 1")).toBe("");
  });
  it("normalizeIntentSessionId matrix 1", () => {
    expect(normalizeIntentSessionId("session-1")).toBe("session-1");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 2", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-2")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 2", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-2")).toBe("mcp:demo-2");
    expect(normalizeIntentEntryKey("bad key 2")).toBe("");
  });
  it("normalizeIntentSessionId matrix 2", () => {
    expect(normalizeIntentSessionId("session-2")).toBe("session-2");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 3", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-3")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 3", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-3")).toBe("mcp:demo-3");
    expect(normalizeIntentEntryKey("bad key 3")).toBe("");
  });
  it("normalizeIntentSessionId matrix 3", () => {
    expect(normalizeIntentSessionId("session-3")).toBe("session-3");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 4", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-4")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 4", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-4")).toBe("mcp:demo-4");
    expect(normalizeIntentEntryKey("bad key 4")).toBe("");
  });
  it("normalizeIntentSessionId matrix 4", () => {
    expect(normalizeIntentSessionId("session-4")).toBe("session-4");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 5", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-5")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 5", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-5")).toBe("mcp:demo-5");
    expect(normalizeIntentEntryKey("bad key 5")).toBe("");
  });
  it("normalizeIntentSessionId matrix 5", () => {
    expect(normalizeIntentSessionId("session-5")).toBe("session-5");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 6", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-6")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 6", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-6")).toBe("mcp:demo-6");
    expect(normalizeIntentEntryKey("bad key 6")).toBe("");
  });
  it("normalizeIntentSessionId matrix 6", () => {
    expect(normalizeIntentSessionId("session-6")).toBe("session-6");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 7", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-7")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 7", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-7")).toBe("mcp:demo-7");
    expect(normalizeIntentEntryKey("bad key 7")).toBe("");
  });
  it("normalizeIntentSessionId matrix 7", () => {
    expect(normalizeIntentSessionId("session-7")).toBe("session-7");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 8", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-8")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 8", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-8")).toBe("mcp:demo-8");
    expect(normalizeIntentEntryKey("bad key 8")).toBe("");
  });
  it("normalizeIntentSessionId matrix 8", () => {
    expect(normalizeIntentSessionId("session-8")).toBe("session-8");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 9", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-9")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 9", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-9")).toBe("mcp:demo-9");
    expect(normalizeIntentEntryKey("bad key 9")).toBe("");
  });
  it("normalizeIntentSessionId matrix 9", () => {
    expect(normalizeIntentSessionId("session-9")).toBe("session-9");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 10", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-10")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 10", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-10")).toBe("mcp:demo-10");
    expect(normalizeIntentEntryKey("bad key 10")).toBe("");
  });
  it("normalizeIntentSessionId matrix 10", () => {
    expect(normalizeIntentSessionId("session-10")).toBe("session-10");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 11", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-11")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 11", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-11")).toBe("mcp:demo-11");
    expect(normalizeIntentEntryKey("bad key 11")).toBe("");
  });
  it("normalizeIntentSessionId matrix 11", () => {
    expect(normalizeIntentSessionId("session-11")).toBe("session-11");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 12", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-12")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 12", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-12")).toBe("mcp:demo-12");
    expect(normalizeIntentEntryKey("bad key 12")).toBe("");
  });
  it("normalizeIntentSessionId matrix 12", () => {
    expect(normalizeIntentSessionId("session-12")).toBe("session-12");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 13", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-13")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 13", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-13")).toBe("mcp:demo-13");
    expect(normalizeIntentEntryKey("bad key 13")).toBe("");
  });
  it("normalizeIntentSessionId matrix 13", () => {
    expect(normalizeIntentSessionId("session-13")).toBe("session-13");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 14", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-14")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 14", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-14")).toBe("mcp:demo-14");
    expect(normalizeIntentEntryKey("bad key 14")).toBe("");
  });
  it("normalizeIntentSessionId matrix 14", () => {
    expect(normalizeIntentSessionId("session-14")).toBe("session-14");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 15", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-15")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 15", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-15")).toBe("mcp:demo-15");
    expect(normalizeIntentEntryKey("bad key 15")).toBe("");
  });
  it("normalizeIntentSessionId matrix 15", () => {
    expect(normalizeIntentSessionId("session-15")).toBe("session-15");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 16", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-16")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 16", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-16")).toBe("mcp:demo-16");
    expect(normalizeIntentEntryKey("bad key 16")).toBe("");
  });
  it("normalizeIntentSessionId matrix 16", () => {
    expect(normalizeIntentSessionId("session-16")).toBe("session-16");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 17", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-17")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 17", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-17")).toBe("mcp:demo-17");
    expect(normalizeIntentEntryKey("bad key 17")).toBe("");
  });
  it("normalizeIntentSessionId matrix 17", () => {
    expect(normalizeIntentSessionId("session-17")).toBe("session-17");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 18", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-18")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 18", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-18")).toBe("mcp:demo-18");
    expect(normalizeIntentEntryKey("bad key 18")).toBe("");
  });
  it("normalizeIntentSessionId matrix 18", () => {
    expect(normalizeIntentSessionId("session-18")).toBe("session-18");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 19", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-19")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 19", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-19")).toBe("mcp:demo-19");
    expect(normalizeIntentEntryKey("bad key 19")).toBe("");
  });
  it("normalizeIntentSessionId matrix 19", () => {
    expect(normalizeIntentSessionId("session-19")).toBe("session-19");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 20", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-20")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 20", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-20")).toBe("mcp:demo-20");
    expect(normalizeIntentEntryKey("bad key 20")).toBe("");
  });
  it("normalizeIntentSessionId matrix 20", () => {
    expect(normalizeIntentSessionId("session-20")).toBe("session-20");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 21", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-21")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 21", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-21")).toBe("mcp:demo-21");
    expect(normalizeIntentEntryKey("bad key 21")).toBe("");
  });
  it("normalizeIntentSessionId matrix 21", () => {
    expect(normalizeIntentSessionId("session-21")).toBe("session-21");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 22", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-22")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 22", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-22")).toBe("mcp:demo-22");
    expect(normalizeIntentEntryKey("bad key 22")).toBe("");
  });
  it("normalizeIntentSessionId matrix 22", () => {
    expect(normalizeIntentSessionId("session-22")).toBe("session-22");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 23", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-23")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 23", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-23")).toBe("mcp:demo-23");
    expect(normalizeIntentEntryKey("bad key 23")).toBe("");
  });
  it("normalizeIntentSessionId matrix 23", () => {
    expect(normalizeIntentSessionId("session-23")).toBe("session-23");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 24", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-24")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 24", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-24")).toBe("mcp:demo-24");
    expect(normalizeIntentEntryKey("bad key 24")).toBe("");
  });
  it("normalizeIntentSessionId matrix 24", () => {
    expect(normalizeIntentSessionId("session-24")).toBe("session-24");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 25", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-25")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 25", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-25")).toBe("mcp:demo-25");
    expect(normalizeIntentEntryKey("bad key 25")).toBe("");
  });
  it("normalizeIntentSessionId matrix 25", () => {
    expect(normalizeIntentSessionId("session-25")).toBe("session-25");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 26", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-26")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 26", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-26")).toBe("mcp:demo-26");
    expect(normalizeIntentEntryKey("bad key 26")).toBe("");
  });
  it("normalizeIntentSessionId matrix 26", () => {
    expect(normalizeIntentSessionId("session-26")).toBe("session-26");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 27", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-27")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 27", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-27")).toBe("mcp:demo-27");
    expect(normalizeIntentEntryKey("bad key 27")).toBe("");
  });
  it("normalizeIntentSessionId matrix 27", () => {
    expect(normalizeIntentSessionId("session-27")).toBe("session-27");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 28", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-28")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 28", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-28")).toBe("mcp:demo-28");
    expect(normalizeIntentEntryKey("bad key 28")).toBe("");
  });
  it("normalizeIntentSessionId matrix 28", () => {
    expect(normalizeIntentSessionId("session-28")).toBe("session-28");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 29", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-29")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 29", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-29")).toBe("mcp:demo-29");
    expect(normalizeIntentEntryKey("bad key 29")).toBe("");
  });
  it("normalizeIntentSessionId matrix 29", () => {
    expect(normalizeIntentSessionId("session-29")).toBe("session-29");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 30", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-30")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 30", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-30")).toBe("mcp:demo-30");
    expect(normalizeIntentEntryKey("bad key 30")).toBe("");
  });
  it("normalizeIntentSessionId matrix 30", () => {
    expect(normalizeIntentSessionId("session-30")).toBe("session-30");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 31", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-31")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 31", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-31")).toBe("mcp:demo-31");
    expect(normalizeIntentEntryKey("bad key 31")).toBe("");
  });
  it("normalizeIntentSessionId matrix 31", () => {
    expect(normalizeIntentSessionId("session-31")).toBe("session-31");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 32", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-32")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 32", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-32")).toBe("mcp:demo-32");
    expect(normalizeIntentEntryKey("bad key 32")).toBe("");
  });
  it("normalizeIntentSessionId matrix 32", () => {
    expect(normalizeIntentSessionId("session-32")).toBe("session-32");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 33", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-33")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 33", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-33")).toBe("mcp:demo-33");
    expect(normalizeIntentEntryKey("bad key 33")).toBe("");
  });
  it("normalizeIntentSessionId matrix 33", () => {
    expect(normalizeIntentSessionId("session-33")).toBe("session-33");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 34", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-34")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 34", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-34")).toBe("mcp:demo-34");
    expect(normalizeIntentEntryKey("bad key 34")).toBe("");
  });
  it("normalizeIntentSessionId matrix 34", () => {
    expect(normalizeIntentSessionId("session-34")).toBe("session-34");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 35", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-35")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 35", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-35")).toBe("mcp:demo-35");
    expect(normalizeIntentEntryKey("bad key 35")).toBe("");
  });
  it("normalizeIntentSessionId matrix 35", () => {
    expect(normalizeIntentSessionId("session-35")).toBe("session-35");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 36", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-36")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 36", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-36")).toBe("mcp:demo-36");
    expect(normalizeIntentEntryKey("bad key 36")).toBe("");
  });
  it("normalizeIntentSessionId matrix 36", () => {
    expect(normalizeIntentSessionId("session-36")).toBe("session-36");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 37", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-37")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 37", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-37")).toBe("mcp:demo-37");
    expect(normalizeIntentEntryKey("bad key 37")).toBe("");
  });
  it("normalizeIntentSessionId matrix 37", () => {
    expect(normalizeIntentSessionId("session-37")).toBe("session-37");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 38", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-38")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 38", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-38")).toBe("mcp:demo-38");
    expect(normalizeIntentEntryKey("bad key 38")).toBe("");
  });
  it("normalizeIntentSessionId matrix 38", () => {
    expect(normalizeIntentSessionId("session-38")).toBe("session-38");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 39", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-39")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 39", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-39")).toBe("mcp:demo-39");
    expect(normalizeIntentEntryKey("bad key 39")).toBe("");
  });
  it("normalizeIntentSessionId matrix 39", () => {
    expect(normalizeIntentSessionId("session-39")).toBe("session-39");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 40", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-40")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 40", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-40")).toBe("mcp:demo-40");
    expect(normalizeIntentEntryKey("bad key 40")).toBe("");
  });
  it("normalizeIntentSessionId matrix 40", () => {
    expect(normalizeIntentSessionId("session-40")).toBe("session-40");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 41", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-41")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 41", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-41")).toBe("mcp:demo-41");
    expect(normalizeIntentEntryKey("bad key 41")).toBe("");
  });
  it("normalizeIntentSessionId matrix 41", () => {
    expect(normalizeIntentSessionId("session-41")).toBe("session-41");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 42", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-42")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 42", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-42")).toBe("mcp:demo-42");
    expect(normalizeIntentEntryKey("bad key 42")).toBe("");
  });
  it("normalizeIntentSessionId matrix 42", () => {
    expect(normalizeIntentSessionId("session-42")).toBe("session-42");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 43", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-43")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 43", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-43")).toBe("mcp:demo-43");
    expect(normalizeIntentEntryKey("bad key 43")).toBe("");
  });
  it("normalizeIntentSessionId matrix 43", () => {
    expect(normalizeIntentSessionId("session-43")).toBe("session-43");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 44", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-44")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 44", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-44")).toBe("mcp:demo-44");
    expect(normalizeIntentEntryKey("bad key 44")).toBe("");
  });
  it("normalizeIntentSessionId matrix 44", () => {
    expect(normalizeIntentSessionId("session-44")).toBe("session-44");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 45", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-45")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 45", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-45")).toBe("mcp:demo-45");
    expect(normalizeIntentEntryKey("bad key 45")).toBe("");
  });
  it("normalizeIntentSessionId matrix 45", () => {
    expect(normalizeIntentSessionId("session-45")).toBe("session-45");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 46", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-46")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 46", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-46")).toBe("mcp:demo-46");
    expect(normalizeIntentEntryKey("bad key 46")).toBe("");
  });
  it("normalizeIntentSessionId matrix 46", () => {
    expect(normalizeIntentSessionId("session-46")).toBe("session-46");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 47", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-47")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 47", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-47")).toBe("mcp:demo-47");
    expect(normalizeIntentEntryKey("bad key 47")).toBe("");
  });
  it("normalizeIntentSessionId matrix 47", () => {
    expect(normalizeIntentSessionId("session-47")).toBe("session-47");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 48", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-48")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 48", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-48")).toBe("mcp:demo-48");
    expect(normalizeIntentEntryKey("bad key 48")).toBe("");
  });
  it("normalizeIntentSessionId matrix 48", () => {
    expect(normalizeIntentSessionId("session-48")).toBe("session-48");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
  it("normalizeIntentEventType matrix 49", () => {
    expect(normalizeIntentEventType("COPY")).toBe("copy");
    expect(normalizeIntentEventType("invalid-49")).toBe("");
  });
  it("normalizeIntentEntryKey matrix 49", () => {
    expect(normalizeIntentEntryKey("MCP:Demo-49")).toBe("mcp:demo-49");
    expect(normalizeIntentEntryKey("bad key 49")).toBe("");
  });
  it("normalizeIntentSessionId matrix 49", () => {
    expect(normalizeIntentSessionId("session-49")).toBe("session-49");
    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");
  });
});

describe("intent-events-lib counts", () => {
  it("exports constants", () => {
    expect(INTENT_EVENT_TYPES).toContain("copy");
    expect(ZERO_INTENT_EVENT_COUNTS.copy).toBe(0);
  });
  it("getFallbackIntentEventCounts matrix 0", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-0", "tools:other"]);
    expect(counts["mcp:demo-0"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 0", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-0", event_type: "copy", count: 1 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-0"]);
    expect(counts["mcp:demo-0"].copy).toBe(1);
  });
  it("getFallbackIntentEventCounts matrix 1", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-1", "tools:other"]);
    expect(counts["mcp:demo-1"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 1", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-1", event_type: "copy", count: 2 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-1"]);
    expect(counts["mcp:demo-1"].copy).toBe(2);
  });
  it("getFallbackIntentEventCounts matrix 2", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-2", "tools:other"]);
    expect(counts["mcp:demo-2"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 2", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-2", event_type: "copy", count: 3 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-2"]);
    expect(counts["mcp:demo-2"].copy).toBe(3);
  });
  it("getFallbackIntentEventCounts matrix 3", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-3", "tools:other"]);
    expect(counts["mcp:demo-3"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 3", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-3", event_type: "copy", count: 4 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-3"]);
    expect(counts["mcp:demo-3"].copy).toBe(4);
  });
  it("getFallbackIntentEventCounts matrix 4", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-4", "tools:other"]);
    expect(counts["mcp:demo-4"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 4", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-4", event_type: "copy", count: 5 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-4"]);
    expect(counts["mcp:demo-4"].copy).toBe(5);
  });
  it("getFallbackIntentEventCounts matrix 5", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-5", "tools:other"]);
    expect(counts["mcp:demo-5"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 5", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-5", event_type: "copy", count: 6 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-5"]);
    expect(counts["mcp:demo-5"].copy).toBe(6);
  });
  it("getFallbackIntentEventCounts matrix 6", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-6", "tools:other"]);
    expect(counts["mcp:demo-6"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 6", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-6", event_type: "copy", count: 7 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-6"]);
    expect(counts["mcp:demo-6"].copy).toBe(7);
  });
  it("getFallbackIntentEventCounts matrix 7", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-7", "tools:other"]);
    expect(counts["mcp:demo-7"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 7", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-7", event_type: "copy", count: 8 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-7"]);
    expect(counts["mcp:demo-7"].copy).toBe(8);
  });
  it("getFallbackIntentEventCounts matrix 8", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-8", "tools:other"]);
    expect(counts["mcp:demo-8"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 8", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-8", event_type: "copy", count: 9 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-8"]);
    expect(counts["mcp:demo-8"].copy).toBe(9);
  });
  it("getFallbackIntentEventCounts matrix 9", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-9", "tools:other"]);
    expect(counts["mcp:demo-9"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 9", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-9", event_type: "copy", count: 10 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-9"]);
    expect(counts["mcp:demo-9"].copy).toBe(10);
  });
  it("getFallbackIntentEventCounts matrix 10", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-10", "tools:other"]);
    expect(counts["mcp:demo-10"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 10", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-10", event_type: "copy", count: 11 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-10"]);
    expect(counts["mcp:demo-10"].copy).toBe(11);
  });
  it("getFallbackIntentEventCounts matrix 11", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-11", "tools:other"]);
    expect(counts["mcp:demo-11"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 11", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-11", event_type: "copy", count: 12 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-11"]);
    expect(counts["mcp:demo-11"].copy).toBe(12);
  });
  it("getFallbackIntentEventCounts matrix 12", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-12", "tools:other"]);
    expect(counts["mcp:demo-12"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 12", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-12", event_type: "copy", count: 13 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-12"]);
    expect(counts["mcp:demo-12"].copy).toBe(13);
  });
  it("getFallbackIntentEventCounts matrix 13", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-13", "tools:other"]);
    expect(counts["mcp:demo-13"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 13", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-13", event_type: "copy", count: 14 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-13"]);
    expect(counts["mcp:demo-13"].copy).toBe(14);
  });
  it("getFallbackIntentEventCounts matrix 14", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-14", "tools:other"]);
    expect(counts["mcp:demo-14"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 14", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-14", event_type: "copy", count: 15 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-14"]);
    expect(counts["mcp:demo-14"].copy).toBe(15);
  });
  it("getFallbackIntentEventCounts matrix 15", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-15", "tools:other"]);
    expect(counts["mcp:demo-15"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 15", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-15", event_type: "copy", count: 16 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-15"]);
    expect(counts["mcp:demo-15"].copy).toBe(16);
  });
  it("getFallbackIntentEventCounts matrix 16", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-16", "tools:other"]);
    expect(counts["mcp:demo-16"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 16", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-16", event_type: "copy", count: 17 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-16"]);
    expect(counts["mcp:demo-16"].copy).toBe(17);
  });
  it("getFallbackIntentEventCounts matrix 17", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-17", "tools:other"]);
    expect(counts["mcp:demo-17"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 17", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-17", event_type: "copy", count: 18 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-17"]);
    expect(counts["mcp:demo-17"].copy).toBe(18);
  });
  it("getFallbackIntentEventCounts matrix 18", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-18", "tools:other"]);
    expect(counts["mcp:demo-18"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 18", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-18", event_type: "copy", count: 19 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-18"]);
    expect(counts["mcp:demo-18"].copy).toBe(19);
  });
  it("getFallbackIntentEventCounts matrix 19", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-19", "tools:other"]);
    expect(counts["mcp:demo-19"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 19", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-19", event_type: "copy", count: 20 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-19"]);
    expect(counts["mcp:demo-19"].copy).toBe(20);
  });
  it("getFallbackIntentEventCounts matrix 20", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-20", "tools:other"]);
    expect(counts["mcp:demo-20"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 20", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-20", event_type: "copy", count: 21 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-20"]);
    expect(counts["mcp:demo-20"].copy).toBe(21);
  });
  it("getFallbackIntentEventCounts matrix 21", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-21", "tools:other"]);
    expect(counts["mcp:demo-21"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 21", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-21", event_type: "copy", count: 22 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-21"]);
    expect(counts["mcp:demo-21"].copy).toBe(22);
  });
  it("getFallbackIntentEventCounts matrix 22", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-22", "tools:other"]);
    expect(counts["mcp:demo-22"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 22", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-22", event_type: "copy", count: 23 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-22"]);
    expect(counts["mcp:demo-22"].copy).toBe(23);
  });
  it("getFallbackIntentEventCounts matrix 23", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-23", "tools:other"]);
    expect(counts["mcp:demo-23"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 23", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-23", event_type: "copy", count: 24 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-23"]);
    expect(counts["mcp:demo-23"].copy).toBe(24);
  });
  it("getFallbackIntentEventCounts matrix 24", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-24", "tools:other"]);
    expect(counts["mcp:demo-24"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 24", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-24", event_type: "copy", count: 25 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-24"]);
    expect(counts["mcp:demo-24"].copy).toBe(25);
  });
  it("getFallbackIntentEventCounts matrix 25", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-25", "tools:other"]);
    expect(counts["mcp:demo-25"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 25", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-25", event_type: "copy", count: 26 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-25"]);
    expect(counts["mcp:demo-25"].copy).toBe(26);
  });
  it("getFallbackIntentEventCounts matrix 26", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-26", "tools:other"]);
    expect(counts["mcp:demo-26"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 26", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-26", event_type: "copy", count: 27 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-26"]);
    expect(counts["mcp:demo-26"].copy).toBe(27);
  });
  it("getFallbackIntentEventCounts matrix 27", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-27", "tools:other"]);
    expect(counts["mcp:demo-27"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 27", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-27", event_type: "copy", count: 28 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-27"]);
    expect(counts["mcp:demo-27"].copy).toBe(28);
  });
  it("getFallbackIntentEventCounts matrix 28", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-28", "tools:other"]);
    expect(counts["mcp:demo-28"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 28", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-28", event_type: "copy", count: 29 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-28"]);
    expect(counts["mcp:demo-28"].copy).toBe(29);
  });
  it("getFallbackIntentEventCounts matrix 29", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-29", "tools:other"]);
    expect(counts["mcp:demo-29"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 29", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-29", event_type: "copy", count: 30 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-29"]);
    expect(counts["mcp:demo-29"].copy).toBe(30);
  });
  it("getFallbackIntentEventCounts matrix 30", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-30", "tools:other"]);
    expect(counts["mcp:demo-30"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 30", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-30", event_type: "copy", count: 31 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-30"]);
    expect(counts["mcp:demo-30"].copy).toBe(31);
  });
  it("getFallbackIntentEventCounts matrix 31", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-31", "tools:other"]);
    expect(counts["mcp:demo-31"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 31", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-31", event_type: "copy", count: 32 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-31"]);
    expect(counts["mcp:demo-31"].copy).toBe(32);
  });
  it("getFallbackIntentEventCounts matrix 32", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-32", "tools:other"]);
    expect(counts["mcp:demo-32"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 32", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-32", event_type: "copy", count: 33 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-32"]);
    expect(counts["mcp:demo-32"].copy).toBe(33);
  });
  it("getFallbackIntentEventCounts matrix 33", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-33", "tools:other"]);
    expect(counts["mcp:demo-33"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 33", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-33", event_type: "copy", count: 34 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-33"]);
    expect(counts["mcp:demo-33"].copy).toBe(34);
  });
  it("getFallbackIntentEventCounts matrix 34", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-34", "tools:other"]);
    expect(counts["mcp:demo-34"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 34", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-34", event_type: "copy", count: 35 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-34"]);
    expect(counts["mcp:demo-34"].copy).toBe(35);
  });
  it("getFallbackIntentEventCounts matrix 35", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-35", "tools:other"]);
    expect(counts["mcp:demo-35"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 35", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-35", event_type: "copy", count: 36 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-35"]);
    expect(counts["mcp:demo-35"].copy).toBe(36);
  });
  it("getFallbackIntentEventCounts matrix 36", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-36", "tools:other"]);
    expect(counts["mcp:demo-36"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 36", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-36", event_type: "copy", count: 37 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-36"]);
    expect(counts["mcp:demo-36"].copy).toBe(37);
  });
  it("getFallbackIntentEventCounts matrix 37", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-37", "tools:other"]);
    expect(counts["mcp:demo-37"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 37", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-37", event_type: "copy", count: 38 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-37"]);
    expect(counts["mcp:demo-37"].copy).toBe(38);
  });
  it("getFallbackIntentEventCounts matrix 38", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-38", "tools:other"]);
    expect(counts["mcp:demo-38"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 38", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-38", event_type: "copy", count: 39 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-38"]);
    expect(counts["mcp:demo-38"].copy).toBe(39);
  });
  it("getFallbackIntentEventCounts matrix 39", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-39", "tools:other"]);
    expect(counts["mcp:demo-39"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 39", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-39", event_type: "copy", count: 40 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-39"]);
    expect(counts["mcp:demo-39"].copy).toBe(40);
  });
  it("getFallbackIntentEventCounts matrix 40", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-40", "tools:other"]);
    expect(counts["mcp:demo-40"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 40", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-40", event_type: "copy", count: 41 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-40"]);
    expect(counts["mcp:demo-40"].copy).toBe(41);
  });
  it("getFallbackIntentEventCounts matrix 41", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-41", "tools:other"]);
    expect(counts["mcp:demo-41"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 41", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-41", event_type: "copy", count: 42 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-41"]);
    expect(counts["mcp:demo-41"].copy).toBe(42);
  });
  it("getFallbackIntentEventCounts matrix 42", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-42", "tools:other"]);
    expect(counts["mcp:demo-42"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 42", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-42", event_type: "copy", count: 43 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-42"]);
    expect(counts["mcp:demo-42"].copy).toBe(43);
  });
  it("getFallbackIntentEventCounts matrix 43", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-43", "tools:other"]);
    expect(counts["mcp:demo-43"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 43", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-43", event_type: "copy", count: 44 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-43"]);
    expect(counts["mcp:demo-43"].copy).toBe(44);
  });
  it("getFallbackIntentEventCounts matrix 44", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-44", "tools:other"]);
    expect(counts["mcp:demo-44"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 44", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-44", event_type: "copy", count: 45 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-44"]);
    expect(counts["mcp:demo-44"].copy).toBe(45);
  });
  it("getFallbackIntentEventCounts matrix 45", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-45", "tools:other"]);
    expect(counts["mcp:demo-45"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 45", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-45", event_type: "copy", count: 46 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-45"]);
    expect(counts["mcp:demo-45"].copy).toBe(46);
  });
  it("getFallbackIntentEventCounts matrix 46", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-46", "tools:other"]);
    expect(counts["mcp:demo-46"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 46", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-46", event_type: "copy", count: 47 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-46"]);
    expect(counts["mcp:demo-46"].copy).toBe(47);
  });
  it("getFallbackIntentEventCounts matrix 47", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-47", "tools:other"]);
    expect(counts["mcp:demo-47"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 47", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-47", event_type: "copy", count: 48 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-47"]);
    expect(counts["mcp:demo-47"].copy).toBe(48);
  });
  it("getFallbackIntentEventCounts matrix 48", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-48", "tools:other"]);
    expect(counts["mcp:demo-48"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 48", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-48", event_type: "copy", count: 49 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-48"]);
    expect(counts["mcp:demo-48"].copy).toBe(49);
  });
  it("getFallbackIntentEventCounts matrix 49", () => {
    const counts = getFallbackIntentEventCounts(["mcp:demo-49", "tools:other"]);
    expect(counts["mcp:demo-49"].copy).toBe(0);
  });
  it("queryIntentEventCounts matrix 49", async () => {
    const db = {
      prepare: () => ({
        bind: () => ({
          all: async () => ({
            results: [
              { entry_key: "mcp:demo-49", event_type: "copy", count: 50 },
            ],
          }),
        }),
      }),
    };
    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-49"]);
    expect(counts["mcp:demo-49"].copy).toBe(50);
  });
});

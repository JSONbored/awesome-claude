import { describe, expect, it } from "vitest";

import {
  GATE_DECISION_SCHEMA_VERSION,
  normalizePrivateGateDecisionPayload,
} from "../apps/submission-gate/src/review";

const validPayload = {
  schemaVersion: GATE_DECISION_SCHEMA_VERSION,
  verdict: "manual",
  confidence: 0.5,
  summary: "Needs a human look.",
  checks: [{ name: "validate-content", status: "passed" }],
  sections: [
    { id: "source", title: "Source", status: "info", bullets: ["b1"] },
  ],
};

describe("submission-gate review payload normalization", () => {
  it("accepts a well-formed GateDecisionV2 payload", () => {
    const result = normalizePrivateGateDecisionPayload(validPayload);
    expect(result.error).toBeUndefined();
    expect(result.decision?.verdict).toBe("manual");
    expect(result.decision?.confidence).toBe(0.5);
  });

  it("rejects a non-record payload", () => {
    expect(normalizePrivateGateDecisionPayload("nope").error?.code).toBe(
      "invalid_private_response",
    );
  });
});

describe("submission-gate review label normalization", () => {
  it("treats non-array labels as empty and trims array labels", () => {
    expect(
      normalizePrivateGateDecisionPayload({ ...validPayload, labels: "nope" })
        .decision?.labels,
    ).toEqual([]);
    expect(
      normalizePrivateGateDecisionPayload({
        ...validPayload,
        labels: ["a", "  ", "b"],
      }).decision?.labels,
    ).toEqual(["a", "b"]);
  });
});

describe("submission-gate review confidence validation", () => {
  it("rejects out-of-range and non-numeric confidence", () => {
    for (const confidence of [5, -1, "abc"]) {
      const result = normalizePrivateGateDecisionPayload({
        ...validPayload,
        confidence,
      });
      expect(result.decision).toBeUndefined();
      expect(result.error?.code).toBe("invalid_private_response");
      expect(result.error?.retryable).toBe(true);
    }
  });

  it("accepts the inclusive confidence bounds", () => {
    expect(
      normalizePrivateGateDecisionPayload({ ...validPayload, confidence: 0 })
        .decision?.confidence,
    ).toBe(0);
    expect(
      normalizePrivateGateDecisionPayload({ ...validPayload, confidence: 1 })
        .decision?.confidence,
    ).toBe(1);
  });
});

describe("submission-gate review check normalization", () => {
  it("drops malformed checks and defaults unknown statuses", () => {
    expect(
      normalizePrivateGateDecisionPayload({
        ...validPayload,
        checks: [
          "not-a-record",
          { status: "passed" },
          { name: "c1", status: "weird" },
          { name: "c2", status: "failed", details: "why" },
        ],
      }).decision?.checks,
    ).toEqual([
      { name: "c1", status: "unknown" },
      { name: "c2", status: "failed", details: "why" },
    ]);
  });
});

describe("submission-gate review section normalization", () => {
  it("splits string bullets, defaults status, and titles by section id", () => {
    expect(
      normalizePrivateGateDecisionPayload({
        ...validPayload,
        sections: [{ id: "source", bullets: "l1\nl2", status: "zzz" }],
      }).decision?.sections,
    ).toEqual([
      {
        id: "source",
        title: "Source Review",
        status: "info",
        bullets: ["l1", "l2"],
      },
    ]);
  });
});

describe("submission-gate review error payloads", () => {
  it("normalizes an error object and falls back when it has no code", () => {
    expect(
      normalizePrivateGateDecisionPayload({
        error: { code: "e1", message: "m" },
      }).error,
    ).toMatchObject({ code: "e1", message: "m" });
    expect(
      normalizePrivateGateDecisionPayload({ error: { nocode: 1 } }).error?.code,
    ).toBe("invalid_private_response");
  });

  it("picks the first usable entry from an errors array", () => {
    expect(
      normalizePrivateGateDecisionPayload({
        errors: [{ nocode: 1 }, { code: "e2", message: "second" }],
      }).error,
    ).toMatchObject({ code: "e2", message: "second" });
  });
});

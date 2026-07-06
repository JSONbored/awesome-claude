import { describe, expect, it } from "vitest";

import {
  shouldTriggerPeek,
  type PeekKeyEvent,
} from "../apps/web/src/lib/peek-hotkey-lib";

function event(overrides: Partial<PeekKeyEvent> = {}): PeekKeyEvent {
  return {
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    key: "p",
    target: null,
    ...overrides,
  };
}

/** A fake event target whose matches() reports whether it is an editable field. */
function target(isEditable: boolean): EventTarget {
  return { matches: () => isEditable } as unknown as EventTarget;
}

describe("shouldTriggerPeek", () => {
  it("triggers on bare lowercase p", () => {
    expect(shouldTriggerPeek(event({ key: "p" }))).toBe(true);
  });

  it("triggers on bare uppercase P", () => {
    expect(shouldTriggerPeek(event({ key: "P" }))).toBe(true);
  });

  it("triggers when target is null", () => {
    expect(shouldTriggerPeek(event({ key: "p", target: null }))).toBe(true);
  });

  it("does not trigger when metaKey is held", () => {
    expect(shouldTriggerPeek(event({ metaKey: true }))).toBe(false);
  });

  it("does not trigger when ctrlKey is held", () => {
    expect(shouldTriggerPeek(event({ ctrlKey: true }))).toBe(false);
  });

  it("does not trigger when altKey is held", () => {
    expect(shouldTriggerPeek(event({ altKey: true }))).toBe(false);
  });

  it("does not trigger when shiftKey is held", () => {
    expect(shouldTriggerPeek(event({ shiftKey: true }))).toBe(false);
  });

  it("does not trigger while typing in an editable field", () => {
    expect(shouldTriggerPeek(event({ key: "p", target: target(true) }))).toBe(
      false,
    );
  });

  it("still triggers when the target is a non-editable element", () => {
    expect(shouldTriggerPeek(event({ key: "p", target: target(false) }))).toBe(
      true,
    );
  });

  it("does not trigger for a non-p key", () => {
    expect(shouldTriggerPeek(event({ key: "q" }))).toBe(false);
  });
});

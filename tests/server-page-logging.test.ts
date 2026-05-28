import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createServerPageLogger,
  normalizeError,
  withDuration,
} from "../apps/web/src/lib/server-page-logging";

type Captured = { stream: "info" | "error"; payload: Record<string, unknown> };

function captureConsole(): {
  records: Captured[];
  restore: () => void;
} {
  const records: Captured[] = [];
  const infoSpy = vi
    .spyOn(console, "info")
    .mockImplementation((line: unknown) => {
      records.push({ stream: "info", payload: JSON.parse(String(line)) });
    });
  const errorSpy = vi
    .spyOn(console, "error")
    .mockImplementation((line: unknown) => {
      records.push({ stream: "error", payload: JSON.parse(String(line)) });
    });
  return {
    records,
    restore() {
      infoSpy.mockRestore();
      errorSpy.mockRestore();
    },
  };
}

describe("normalizeError", () => {
  it("returns the message for Error instances", () => {
    expect(normalizeError(new Error("boom"))).toBe("boom");
  });

  it("returns non-empty string inputs unchanged", () => {
    expect(normalizeError("oops")).toBe("oops");
  });

  it("falls back to a stable label for unknown shapes", () => {
    expect(normalizeError(null)).toBe("Unknown error");
    expect(normalizeError(undefined)).toBe("Unknown error");
    expect(normalizeError(42)).toBe("Unknown error");
    expect(normalizeError({ message: "shape" })).toBe("Unknown error");
    expect(normalizeError("")).toBe("Unknown error");
    expect(normalizeError("   ")).toBe("Unknown error");
  });
});

describe("createServerPageLogger", () => {
  let console_: ReturnType<typeof captureConsole>;

  beforeEach(() => {
    console_ = captureConsole();
  });
  afterEach(() => {
    console_.restore();
  });

  it("namespaces every event and stamps each log with the request id", () => {
    const logger = createServerPageLogger("quality.page", "req-1");
    logger.info("summary", { count: 3 });
    logger.error("failed", { error: "boom" });

    expect(console_.records).toHaveLength(2);
    expect(console_.records[0]).toMatchObject({
      stream: "info",
      payload: {
        level: "info",
        event: "quality.page.summary",
        requestId: "req-1",
        count: 3,
      },
    });
    expect(console_.records[1]).toMatchObject({
      stream: "error",
      payload: {
        level: "error",
        event: "quality.page.failed",
        requestId: "req-1",
        error: "boom",
      },
    });
  });
});

describe("withDuration", () => {
  let console_: ReturnType<typeof captureConsole>;

  beforeEach(() => {
    console_ = captureConsole();
  });
  afterEach(() => {
    console_.restore();
  });

  it("returns the callback result and provides a working duration tracker", async () => {
    const result = await withDuration(
      "quality.page",
      async ({ getDurationMs, requestId }) => {
        expect(typeof requestId).toBe("string");
        expect(requestId.length).toBeGreaterThan(0);
        expect(getDurationMs()).toBeGreaterThanOrEqual(0);
        return { ok: true };
      },
    );
    expect(result).toEqual({ ok: true });
    expect(console_.records).toEqual([]);
  });

  it("logs a normalized failure event and rethrows when the callback throws", async () => {
    await expect(
      withDuration("quality.page", async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(console_.records).toHaveLength(1);
    const record = console_.records[0];
    expect(record.stream).toBe("error");
    expect(record.payload).toMatchObject({
      level: "error",
      event: "quality.page.failed",
      error: "boom",
    });
    expect(typeof record.payload.requestId).toBe("string");
    expect(record.payload.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("normalizes non-Error throws via normalizeError", async () => {
    await expect(
      withDuration("quality.page", async () => {
        throw "string-fault";
      }),
    ).rejects.toBe("string-fault");

    expect(console_.records[0]?.payload.error).toBe("string-fault");
  });
});

import { describe, expect, it, vi } from "vitest";

import {
  LOCAL_JSON_READ_ATTEMPTS,
  LOCAL_JSON_RETRY_MS,
  buildAssetsDataRequestUrl,
  loadJsonFromAssetsBinding,
  loadTextFromAssetsBinding,
  readLocalDataFileFromPaths,
  readLocalJsonDataFileWithRetry,
} from "../apps/web/src/lib/content-loader-lib";

describe("content-loader-lib constants", () => {
  it("exports retry constants", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBe(3);
    expect(LOCAL_JSON_RETRY_MS).toBe(25);
  });
  it("constants stable 0", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 1", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 2", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 3", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 4", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 5", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 6", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 7", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 8", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
  it("constants stable 9", () => {
    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);
    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);
  });
});

describe("content-loader-lib readLocalDataFileFromPaths", () => {
  it("returns first successful read", async () => {
    const readFile = vi
      .fn()
      .mockRejectedValueOnce(new Error("missing"))
      .mockResolvedValueOnce("payload");
    const result = await readLocalDataFileFromPaths(["/a", "/b"], readFile);
    expect(result).toBe("payload");
    expect(readFile).toHaveBeenCalledTimes(2);
  });
  it("throws when all paths fail", async () => {
    const readFile = vi.fn().mockRejectedValue(new Error("missing"));
    await expect(readLocalDataFileFromPaths(["/a"], readFile)).rejects.toThrow(
      "missing",
    );
  });
  it("readLocalDataFileFromPaths matrix 0", async () => {
    const readFile = vi.fn().mockResolvedValue("data-0");
    const result = await readLocalDataFileFromPaths(["/path-0"], readFile);
    expect(result).toBe("data-0");
  });
  it("readLocalDataFileFromPaths matrix 1", async () => {
    const readFile = vi.fn().mockResolvedValue("data-1");
    const result = await readLocalDataFileFromPaths(["/path-1"], readFile);
    expect(result).toBe("data-1");
  });
  it("readLocalDataFileFromPaths matrix 2", async () => {
    const readFile = vi.fn().mockResolvedValue("data-2");
    const result = await readLocalDataFileFromPaths(["/path-2"], readFile);
    expect(result).toBe("data-2");
  });
  it("readLocalDataFileFromPaths matrix 3", async () => {
    const readFile = vi.fn().mockResolvedValue("data-3");
    const result = await readLocalDataFileFromPaths(["/path-3"], readFile);
    expect(result).toBe("data-3");
  });
  it("readLocalDataFileFromPaths matrix 4", async () => {
    const readFile = vi.fn().mockResolvedValue("data-4");
    const result = await readLocalDataFileFromPaths(["/path-4"], readFile);
    expect(result).toBe("data-4");
  });
  it("readLocalDataFileFromPaths matrix 5", async () => {
    const readFile = vi.fn().mockResolvedValue("data-5");
    const result = await readLocalDataFileFromPaths(["/path-5"], readFile);
    expect(result).toBe("data-5");
  });
  it("readLocalDataFileFromPaths matrix 6", async () => {
    const readFile = vi.fn().mockResolvedValue("data-6");
    const result = await readLocalDataFileFromPaths(["/path-6"], readFile);
    expect(result).toBe("data-6");
  });
  it("readLocalDataFileFromPaths matrix 7", async () => {
    const readFile = vi.fn().mockResolvedValue("data-7");
    const result = await readLocalDataFileFromPaths(["/path-7"], readFile);
    expect(result).toBe("data-7");
  });
  it("readLocalDataFileFromPaths matrix 8", async () => {
    const readFile = vi.fn().mockResolvedValue("data-8");
    const result = await readLocalDataFileFromPaths(["/path-8"], readFile);
    expect(result).toBe("data-8");
  });
  it("readLocalDataFileFromPaths matrix 9", async () => {
    const readFile = vi.fn().mockResolvedValue("data-9");
    const result = await readLocalDataFileFromPaths(["/path-9"], readFile);
    expect(result).toBe("data-9");
  });
  it("readLocalDataFileFromPaths matrix 10", async () => {
    const readFile = vi.fn().mockResolvedValue("data-10");
    const result = await readLocalDataFileFromPaths(["/path-10"], readFile);
    expect(result).toBe("data-10");
  });
  it("readLocalDataFileFromPaths matrix 11", async () => {
    const readFile = vi.fn().mockResolvedValue("data-11");
    const result = await readLocalDataFileFromPaths(["/path-11"], readFile);
    expect(result).toBe("data-11");
  });
  it("readLocalDataFileFromPaths matrix 12", async () => {
    const readFile = vi.fn().mockResolvedValue("data-12");
    const result = await readLocalDataFileFromPaths(["/path-12"], readFile);
    expect(result).toBe("data-12");
  });
  it("readLocalDataFileFromPaths matrix 13", async () => {
    const readFile = vi.fn().mockResolvedValue("data-13");
    const result = await readLocalDataFileFromPaths(["/path-13"], readFile);
    expect(result).toBe("data-13");
  });
  it("readLocalDataFileFromPaths matrix 14", async () => {
    const readFile = vi.fn().mockResolvedValue("data-14");
    const result = await readLocalDataFileFromPaths(["/path-14"], readFile);
    expect(result).toBe("data-14");
  });
  it("readLocalDataFileFromPaths matrix 15", async () => {
    const readFile = vi.fn().mockResolvedValue("data-15");
    const result = await readLocalDataFileFromPaths(["/path-15"], readFile);
    expect(result).toBe("data-15");
  });
  it("readLocalDataFileFromPaths matrix 16", async () => {
    const readFile = vi.fn().mockResolvedValue("data-16");
    const result = await readLocalDataFileFromPaths(["/path-16"], readFile);
    expect(result).toBe("data-16");
  });
  it("readLocalDataFileFromPaths matrix 17", async () => {
    const readFile = vi.fn().mockResolvedValue("data-17");
    const result = await readLocalDataFileFromPaths(["/path-17"], readFile);
    expect(result).toBe("data-17");
  });
  it("readLocalDataFileFromPaths matrix 18", async () => {
    const readFile = vi.fn().mockResolvedValue("data-18");
    const result = await readLocalDataFileFromPaths(["/path-18"], readFile);
    expect(result).toBe("data-18");
  });
  it("readLocalDataFileFromPaths matrix 19", async () => {
    const readFile = vi.fn().mockResolvedValue("data-19");
    const result = await readLocalDataFileFromPaths(["/path-19"], readFile);
    expect(result).toBe("data-19");
  });
  it("readLocalDataFileFromPaths matrix 20", async () => {
    const readFile = vi.fn().mockResolvedValue("data-20");
    const result = await readLocalDataFileFromPaths(["/path-20"], readFile);
    expect(result).toBe("data-20");
  });
  it("readLocalDataFileFromPaths matrix 21", async () => {
    const readFile = vi.fn().mockResolvedValue("data-21");
    const result = await readLocalDataFileFromPaths(["/path-21"], readFile);
    expect(result).toBe("data-21");
  });
  it("readLocalDataFileFromPaths matrix 22", async () => {
    const readFile = vi.fn().mockResolvedValue("data-22");
    const result = await readLocalDataFileFromPaths(["/path-22"], readFile);
    expect(result).toBe("data-22");
  });
  it("readLocalDataFileFromPaths matrix 23", async () => {
    const readFile = vi.fn().mockResolvedValue("data-23");
    const result = await readLocalDataFileFromPaths(["/path-23"], readFile);
    expect(result).toBe("data-23");
  });
  it("readLocalDataFileFromPaths matrix 24", async () => {
    const readFile = vi.fn().mockResolvedValue("data-24");
    const result = await readLocalDataFileFromPaths(["/path-24"], readFile);
    expect(result).toBe("data-24");
  });
  it("readLocalDataFileFromPaths matrix 25", async () => {
    const readFile = vi.fn().mockResolvedValue("data-25");
    const result = await readLocalDataFileFromPaths(["/path-25"], readFile);
    expect(result).toBe("data-25");
  });
  it("readLocalDataFileFromPaths matrix 26", async () => {
    const readFile = vi.fn().mockResolvedValue("data-26");
    const result = await readLocalDataFileFromPaths(["/path-26"], readFile);
    expect(result).toBe("data-26");
  });
  it("readLocalDataFileFromPaths matrix 27", async () => {
    const readFile = vi.fn().mockResolvedValue("data-27");
    const result = await readLocalDataFileFromPaths(["/path-27"], readFile);
    expect(result).toBe("data-27");
  });
  it("readLocalDataFileFromPaths matrix 28", async () => {
    const readFile = vi.fn().mockResolvedValue("data-28");
    const result = await readLocalDataFileFromPaths(["/path-28"], readFile);
    expect(result).toBe("data-28");
  });
  it("readLocalDataFileFromPaths matrix 29", async () => {
    const readFile = vi.fn().mockResolvedValue("data-29");
    const result = await readLocalDataFileFromPaths(["/path-29"], readFile);
    expect(result).toBe("data-29");
  });
  it("readLocalDataFileFromPaths matrix 30", async () => {
    const readFile = vi.fn().mockResolvedValue("data-30");
    const result = await readLocalDataFileFromPaths(["/path-30"], readFile);
    expect(result).toBe("data-30");
  });
  it("readLocalDataFileFromPaths matrix 31", async () => {
    const readFile = vi.fn().mockResolvedValue("data-31");
    const result = await readLocalDataFileFromPaths(["/path-31"], readFile);
    expect(result).toBe("data-31");
  });
  it("readLocalDataFileFromPaths matrix 32", async () => {
    const readFile = vi.fn().mockResolvedValue("data-32");
    const result = await readLocalDataFileFromPaths(["/path-32"], readFile);
    expect(result).toBe("data-32");
  });
  it("readLocalDataFileFromPaths matrix 33", async () => {
    const readFile = vi.fn().mockResolvedValue("data-33");
    const result = await readLocalDataFileFromPaths(["/path-33"], readFile);
    expect(result).toBe("data-33");
  });
  it("readLocalDataFileFromPaths matrix 34", async () => {
    const readFile = vi.fn().mockResolvedValue("data-34");
    const result = await readLocalDataFileFromPaths(["/path-34"], readFile);
    expect(result).toBe("data-34");
  });
  it("readLocalDataFileFromPaths matrix 35", async () => {
    const readFile = vi.fn().mockResolvedValue("data-35");
    const result = await readLocalDataFileFromPaths(["/path-35"], readFile);
    expect(result).toBe("data-35");
  });
  it("readLocalDataFileFromPaths matrix 36", async () => {
    const readFile = vi.fn().mockResolvedValue("data-36");
    const result = await readLocalDataFileFromPaths(["/path-36"], readFile);
    expect(result).toBe("data-36");
  });
  it("readLocalDataFileFromPaths matrix 37", async () => {
    const readFile = vi.fn().mockResolvedValue("data-37");
    const result = await readLocalDataFileFromPaths(["/path-37"], readFile);
    expect(result).toBe("data-37");
  });
  it("readLocalDataFileFromPaths matrix 38", async () => {
    const readFile = vi.fn().mockResolvedValue("data-38");
    const result = await readLocalDataFileFromPaths(["/path-38"], readFile);
    expect(result).toBe("data-38");
  });
  it("readLocalDataFileFromPaths matrix 39", async () => {
    const readFile = vi.fn().mockResolvedValue("data-39");
    const result = await readLocalDataFileFromPaths(["/path-39"], readFile);
    expect(result).toBe("data-39");
  });
});

describe("content-loader-lib readLocalJsonDataFileWithRetry", () => {
  it("parses JSON after retry", async () => {
    const readFile = vi
      .fn()
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValueOnce('{"ok":true}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "test.json",
      ["/test.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ ok: true });
    expect(sleep).toHaveBeenCalledWith(LOCAL_JSON_RETRY_MS);
  });
  it("readLocalJsonDataFileWithRetry matrix 0", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":0}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-0.json",
      ["/f-0.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 0 });
  });
  it("readLocalJsonDataFileWithRetry matrix 1", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":1}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-1.json",
      ["/f-1.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 1 });
  });
  it("readLocalJsonDataFileWithRetry matrix 2", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":2}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-2.json",
      ["/f-2.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 2 });
  });
  it("readLocalJsonDataFileWithRetry matrix 3", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":3}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-3.json",
      ["/f-3.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 3 });
  });
  it("readLocalJsonDataFileWithRetry matrix 4", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":4}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-4.json",
      ["/f-4.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 4 });
  });
  it("readLocalJsonDataFileWithRetry matrix 5", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":5}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-5.json",
      ["/f-5.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 5 });
  });
  it("readLocalJsonDataFileWithRetry matrix 6", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":6}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-6.json",
      ["/f-6.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 6 });
  });
  it("readLocalJsonDataFileWithRetry matrix 7", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":7}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-7.json",
      ["/f-7.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 7 });
  });
  it("readLocalJsonDataFileWithRetry matrix 8", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":8}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-8.json",
      ["/f-8.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 8 });
  });
  it("readLocalJsonDataFileWithRetry matrix 9", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":9}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-9.json",
      ["/f-9.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 9 });
  });
  it("readLocalJsonDataFileWithRetry matrix 10", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":10}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-10.json",
      ["/f-10.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 10 });
  });
  it("readLocalJsonDataFileWithRetry matrix 11", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":11}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-11.json",
      ["/f-11.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 11 });
  });
  it("readLocalJsonDataFileWithRetry matrix 12", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":12}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-12.json",
      ["/f-12.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 12 });
  });
  it("readLocalJsonDataFileWithRetry matrix 13", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":13}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-13.json",
      ["/f-13.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 13 });
  });
  it("readLocalJsonDataFileWithRetry matrix 14", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":14}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-14.json",
      ["/f-14.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 14 });
  });
  it("readLocalJsonDataFileWithRetry matrix 15", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":15}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-15.json",
      ["/f-15.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 15 });
  });
  it("readLocalJsonDataFileWithRetry matrix 16", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":16}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-16.json",
      ["/f-16.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 16 });
  });
  it("readLocalJsonDataFileWithRetry matrix 17", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":17}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-17.json",
      ["/f-17.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 17 });
  });
  it("readLocalJsonDataFileWithRetry matrix 18", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":18}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-18.json",
      ["/f-18.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 18 });
  });
  it("readLocalJsonDataFileWithRetry matrix 19", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":19}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-19.json",
      ["/f-19.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 19 });
  });
  it("readLocalJsonDataFileWithRetry matrix 20", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":20}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-20.json",
      ["/f-20.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 20 });
  });
  it("readLocalJsonDataFileWithRetry matrix 21", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":21}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-21.json",
      ["/f-21.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 21 });
  });
  it("readLocalJsonDataFileWithRetry matrix 22", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":22}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-22.json",
      ["/f-22.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 22 });
  });
  it("readLocalJsonDataFileWithRetry matrix 23", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":23}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-23.json",
      ["/f-23.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 23 });
  });
  it("readLocalJsonDataFileWithRetry matrix 24", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":24}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-24.json",
      ["/f-24.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 24 });
  });
  it("readLocalJsonDataFileWithRetry matrix 25", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":25}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-25.json",
      ["/f-25.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 25 });
  });
  it("readLocalJsonDataFileWithRetry matrix 26", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":26}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-26.json",
      ["/f-26.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 26 });
  });
  it("readLocalJsonDataFileWithRetry matrix 27", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":27}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-27.json",
      ["/f-27.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 27 });
  });
  it("readLocalJsonDataFileWithRetry matrix 28", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":28}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-28.json",
      ["/f-28.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 28 });
  });
  it("readLocalJsonDataFileWithRetry matrix 29", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":29}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-29.json",
      ["/f-29.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 29 });
  });
  it("readLocalJsonDataFileWithRetry matrix 30", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":30}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-30.json",
      ["/f-30.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 30 });
  });
  it("readLocalJsonDataFileWithRetry matrix 31", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":31}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-31.json",
      ["/f-31.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 31 });
  });
  it("readLocalJsonDataFileWithRetry matrix 32", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":32}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-32.json",
      ["/f-32.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 32 });
  });
  it("readLocalJsonDataFileWithRetry matrix 33", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":33}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-33.json",
      ["/f-33.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 33 });
  });
  it("readLocalJsonDataFileWithRetry matrix 34", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":34}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-34.json",
      ["/f-34.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 34 });
  });
  it("readLocalJsonDataFileWithRetry matrix 35", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":35}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-35.json",
      ["/f-35.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 35 });
  });
  it("readLocalJsonDataFileWithRetry matrix 36", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":36}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-36.json",
      ["/f-36.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 36 });
  });
  it("readLocalJsonDataFileWithRetry matrix 37", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":37}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-37.json",
      ["/f-37.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 37 });
  });
  it("readLocalJsonDataFileWithRetry matrix 38", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":38}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-38.json",
      ["/f-38.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 38 });
  });
  it("readLocalJsonDataFileWithRetry matrix 39", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":39}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-39.json",
      ["/f-39.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 39 });
  });
  it("readLocalJsonDataFileWithRetry matrix 40", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":40}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-40.json",
      ["/f-40.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 40 });
  });
  it("readLocalJsonDataFileWithRetry matrix 41", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":41}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-41.json",
      ["/f-41.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 41 });
  });
  it("readLocalJsonDataFileWithRetry matrix 42", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":42}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-42.json",
      ["/f-42.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 42 });
  });
  it("readLocalJsonDataFileWithRetry matrix 43", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":43}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-43.json",
      ["/f-43.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 43 });
  });
  it("readLocalJsonDataFileWithRetry matrix 44", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":44}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-44.json",
      ["/f-44.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 44 });
  });
  it("readLocalJsonDataFileWithRetry matrix 45", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":45}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-45.json",
      ["/f-45.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 45 });
  });
  it("readLocalJsonDataFileWithRetry matrix 46", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":46}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-46.json",
      ["/f-46.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 46 });
  });
  it("readLocalJsonDataFileWithRetry matrix 47", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":47}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-47.json",
      ["/f-47.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 47 });
  });
  it("readLocalJsonDataFileWithRetry matrix 48", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":48}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-48.json",
      ["/f-48.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 48 });
  });
  it("readLocalJsonDataFileWithRetry matrix 49", async () => {
    const readFile = vi.fn().mockResolvedValue('{"value":49}');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await readLocalJsonDataFileWithRetry(
      "f-49.json",
      ["/f-49.json"],
      readFile,
      sleep,
    );
    expect(result).toEqual({ value: 49 });
  });
});

describe("content-loader-lib buildAssetsDataRequestUrl", () => {
  it("builds data asset URL", () => {
    expect(
      buildAssetsDataRequestUrl("https://heyclau.de", "directory-index.json"),
    ).toBe("https://heyclau.de/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 0", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-0.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 1", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-1.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 2", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-2.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 3", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-3.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 4", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-4.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 5", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-5.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 6", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-6.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 7", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-7.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 8", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-8.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 9", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-9.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 10", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-10.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 11", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-11.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 12", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-12.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 13", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-13.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 14", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-14.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 15", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-15.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 16", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-16.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 17", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-17.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 18", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-18.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl directory-index.json 19", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-19.example",
        "directory-index.json",
      ),
    ).toContain("/data/directory-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 0", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-0.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 1", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-1.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 2", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-2.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 3", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-3.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 4", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-4.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 5", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-5.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 6", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-6.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 7", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-7.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 8", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-8.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 9", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-9.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 10", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-10.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 11", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-11.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 12", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-12.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 13", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-13.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 14", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-14.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 15", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-15.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 16", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-16.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 17", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-17.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 18", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-18.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl search-index.json 19", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-19.example",
        "search-index.json",
      ),
    ).toContain("/data/search-index.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 0", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-0.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 1", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-1.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 2", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-2.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 3", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-3.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 4", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-4.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 5", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-5.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 6", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-6.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 7", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-7.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 8", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-8.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 9", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-9.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 10", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-10.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 11", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-11.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 12", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-12.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 13", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-13.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 14", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-14.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 15", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-15.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 16", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-16.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 17", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-17.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 18", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-18.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl registry-manifest.json 19", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-19.example",
        "registry-manifest.json",
      ),
    ).toContain("/data/registry-manifest.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 0", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-0.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 1", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-1.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 2", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-2.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 3", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-3.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 4", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-4.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 5", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-5.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 6", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-6.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 7", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-7.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 8", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-8.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 9", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-9.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 10", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-10.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 11", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-11.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 12", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-12.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 13", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-13.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 14", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-14.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 15", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-15.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 16", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-16.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 17", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-17.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 18", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-18.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
  it("buildAssetsDataRequestUrl entries/mcp/demo.json 19", () => {
    expect(
      buildAssetsDataRequestUrl(
        "https://origin-19.example",
        "entries/mcp/demo.json",
      ),
    ).toContain("/data/entries/mcp/demo.json");
  });
});

describe("content-loader-lib loadJsonFromAssetsBinding", () => {
  it("loads JSON from assets binding", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/test.json",
    );
    expect(result).toEqual({ ok: true });
  });
  it("throws on non-ok response", async () => {
    const assets = {
      fetch: vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    };
    await expect(
      loadJsonFromAssetsBinding(assets, "https://example/data/missing.json"),
    ).rejects.toThrow("404");
  });
  it("loadJsonFromAssetsBinding matrix 0", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 0 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/0.json",
    );
    expect(result).toEqual({ n: 0 });
  });
  it("loadJsonFromAssetsBinding matrix 1", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 1 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/1.json",
    );
    expect(result).toEqual({ n: 1 });
  });
  it("loadJsonFromAssetsBinding matrix 2", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 2 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/2.json",
    );
    expect(result).toEqual({ n: 2 });
  });
  it("loadJsonFromAssetsBinding matrix 3", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 3 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/3.json",
    );
    expect(result).toEqual({ n: 3 });
  });
  it("loadJsonFromAssetsBinding matrix 4", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 4 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/4.json",
    );
    expect(result).toEqual({ n: 4 });
  });
  it("loadJsonFromAssetsBinding matrix 5", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 5 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/5.json",
    );
    expect(result).toEqual({ n: 5 });
  });
  it("loadJsonFromAssetsBinding matrix 6", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 6 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/6.json",
    );
    expect(result).toEqual({ n: 6 });
  });
  it("loadJsonFromAssetsBinding matrix 7", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 7 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/7.json",
    );
    expect(result).toEqual({ n: 7 });
  });
  it("loadJsonFromAssetsBinding matrix 8", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 8 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/8.json",
    );
    expect(result).toEqual({ n: 8 });
  });
  it("loadJsonFromAssetsBinding matrix 9", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 9 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/9.json",
    );
    expect(result).toEqual({ n: 9 });
  });
  it("loadJsonFromAssetsBinding matrix 10", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 10 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/10.json",
    );
    expect(result).toEqual({ n: 10 });
  });
  it("loadJsonFromAssetsBinding matrix 11", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 11 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/11.json",
    );
    expect(result).toEqual({ n: 11 });
  });
  it("loadJsonFromAssetsBinding matrix 12", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 12 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/12.json",
    );
    expect(result).toEqual({ n: 12 });
  });
  it("loadJsonFromAssetsBinding matrix 13", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 13 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/13.json",
    );
    expect(result).toEqual({ n: 13 });
  });
  it("loadJsonFromAssetsBinding matrix 14", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 14 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/14.json",
    );
    expect(result).toEqual({ n: 14 });
  });
  it("loadJsonFromAssetsBinding matrix 15", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 15 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/15.json",
    );
    expect(result).toEqual({ n: 15 });
  });
  it("loadJsonFromAssetsBinding matrix 16", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 16 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/16.json",
    );
    expect(result).toEqual({ n: 16 });
  });
  it("loadJsonFromAssetsBinding matrix 17", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 17 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/17.json",
    );
    expect(result).toEqual({ n: 17 });
  });
  it("loadJsonFromAssetsBinding matrix 18", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 18 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/18.json",
    );
    expect(result).toEqual({ n: 18 });
  });
  it("loadJsonFromAssetsBinding matrix 19", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 19 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/19.json",
    );
    expect(result).toEqual({ n: 19 });
  });
  it("loadJsonFromAssetsBinding matrix 20", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 20 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/20.json",
    );
    expect(result).toEqual({ n: 20 });
  });
  it("loadJsonFromAssetsBinding matrix 21", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 21 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/21.json",
    );
    expect(result).toEqual({ n: 21 });
  });
  it("loadJsonFromAssetsBinding matrix 22", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 22 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/22.json",
    );
    expect(result).toEqual({ n: 22 });
  });
  it("loadJsonFromAssetsBinding matrix 23", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 23 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/23.json",
    );
    expect(result).toEqual({ n: 23 });
  });
  it("loadJsonFromAssetsBinding matrix 24", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 24 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/24.json",
    );
    expect(result).toEqual({ n: 24 });
  });
  it("loadJsonFromAssetsBinding matrix 25", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 25 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/25.json",
    );
    expect(result).toEqual({ n: 25 });
  });
  it("loadJsonFromAssetsBinding matrix 26", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 26 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/26.json",
    );
    expect(result).toEqual({ n: 26 });
  });
  it("loadJsonFromAssetsBinding matrix 27", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 27 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/27.json",
    );
    expect(result).toEqual({ n: 27 });
  });
  it("loadJsonFromAssetsBinding matrix 28", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 28 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/28.json",
    );
    expect(result).toEqual({ n: 28 });
  });
  it("loadJsonFromAssetsBinding matrix 29", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 29 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/29.json",
    );
    expect(result).toEqual({ n: 29 });
  });
  it("loadJsonFromAssetsBinding matrix 30", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 30 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/30.json",
    );
    expect(result).toEqual({ n: 30 });
  });
  it("loadJsonFromAssetsBinding matrix 31", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 31 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/31.json",
    );
    expect(result).toEqual({ n: 31 });
  });
  it("loadJsonFromAssetsBinding matrix 32", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 32 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/32.json",
    );
    expect(result).toEqual({ n: 32 });
  });
  it("loadJsonFromAssetsBinding matrix 33", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 33 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/33.json",
    );
    expect(result).toEqual({ n: 33 });
  });
  it("loadJsonFromAssetsBinding matrix 34", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 34 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/34.json",
    );
    expect(result).toEqual({ n: 34 });
  });
  it("loadJsonFromAssetsBinding matrix 35", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 35 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/35.json",
    );
    expect(result).toEqual({ n: 35 });
  });
  it("loadJsonFromAssetsBinding matrix 36", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 36 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/36.json",
    );
    expect(result).toEqual({ n: 36 });
  });
  it("loadJsonFromAssetsBinding matrix 37", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 37 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/37.json",
    );
    expect(result).toEqual({ n: 37 });
  });
  it("loadJsonFromAssetsBinding matrix 38", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 38 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/38.json",
    );
    expect(result).toEqual({ n: 38 });
  });
  it("loadJsonFromAssetsBinding matrix 39", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ n: 39 }) }),
    };
    const result = await loadJsonFromAssetsBinding(
      assets,
      "https://example/data/39.json",
    );
    expect(result).toEqual({ n: 39 });
  });
});

describe("content-loader-lib loadTextFromAssetsBinding", () => {
  it("loads text from assets binding", async () => {
    const assets = {
      fetch: vi.fn().mockResolvedValue({ ok: true, text: async () => "hello" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/test.txt",
    );
    expect(result).toBe("hello");
  });
  it("loadTextFromAssetsBinding matrix 0", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-0" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/0.txt",
    );
    expect(result).toBe("text-0");
  });
  it("loadTextFromAssetsBinding matrix 1", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-1" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/1.txt",
    );
    expect(result).toBe("text-1");
  });
  it("loadTextFromAssetsBinding matrix 2", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-2" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/2.txt",
    );
    expect(result).toBe("text-2");
  });
  it("loadTextFromAssetsBinding matrix 3", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-3" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/3.txt",
    );
    expect(result).toBe("text-3");
  });
  it("loadTextFromAssetsBinding matrix 4", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-4" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/4.txt",
    );
    expect(result).toBe("text-4");
  });
  it("loadTextFromAssetsBinding matrix 5", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-5" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/5.txt",
    );
    expect(result).toBe("text-5");
  });
  it("loadTextFromAssetsBinding matrix 6", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-6" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/6.txt",
    );
    expect(result).toBe("text-6");
  });
  it("loadTextFromAssetsBinding matrix 7", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-7" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/7.txt",
    );
    expect(result).toBe("text-7");
  });
  it("loadTextFromAssetsBinding matrix 8", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-8" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/8.txt",
    );
    expect(result).toBe("text-8");
  });
  it("loadTextFromAssetsBinding matrix 9", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-9" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/9.txt",
    );
    expect(result).toBe("text-9");
  });
  it("loadTextFromAssetsBinding matrix 10", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-10" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/10.txt",
    );
    expect(result).toBe("text-10");
  });
  it("loadTextFromAssetsBinding matrix 11", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-11" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/11.txt",
    );
    expect(result).toBe("text-11");
  });
  it("loadTextFromAssetsBinding matrix 12", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-12" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/12.txt",
    );
    expect(result).toBe("text-12");
  });
  it("loadTextFromAssetsBinding matrix 13", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-13" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/13.txt",
    );
    expect(result).toBe("text-13");
  });
  it("loadTextFromAssetsBinding matrix 14", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-14" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/14.txt",
    );
    expect(result).toBe("text-14");
  });
  it("loadTextFromAssetsBinding matrix 15", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-15" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/15.txt",
    );
    expect(result).toBe("text-15");
  });
  it("loadTextFromAssetsBinding matrix 16", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-16" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/16.txt",
    );
    expect(result).toBe("text-16");
  });
  it("loadTextFromAssetsBinding matrix 17", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-17" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/17.txt",
    );
    expect(result).toBe("text-17");
  });
  it("loadTextFromAssetsBinding matrix 18", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-18" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/18.txt",
    );
    expect(result).toBe("text-18");
  });
  it("loadTextFromAssetsBinding matrix 19", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-19" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/19.txt",
    );
    expect(result).toBe("text-19");
  });
  it("loadTextFromAssetsBinding matrix 20", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-20" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/20.txt",
    );
    expect(result).toBe("text-20");
  });
  it("loadTextFromAssetsBinding matrix 21", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-21" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/21.txt",
    );
    expect(result).toBe("text-21");
  });
  it("loadTextFromAssetsBinding matrix 22", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-22" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/22.txt",
    );
    expect(result).toBe("text-22");
  });
  it("loadTextFromAssetsBinding matrix 23", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-23" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/23.txt",
    );
    expect(result).toBe("text-23");
  });
  it("loadTextFromAssetsBinding matrix 24", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-24" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/24.txt",
    );
    expect(result).toBe("text-24");
  });
  it("loadTextFromAssetsBinding matrix 25", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-25" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/25.txt",
    );
    expect(result).toBe("text-25");
  });
  it("loadTextFromAssetsBinding matrix 26", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-26" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/26.txt",
    );
    expect(result).toBe("text-26");
  });
  it("loadTextFromAssetsBinding matrix 27", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-27" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/27.txt",
    );
    expect(result).toBe("text-27");
  });
  it("loadTextFromAssetsBinding matrix 28", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-28" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/28.txt",
    );
    expect(result).toBe("text-28");
  });
  it("loadTextFromAssetsBinding matrix 29", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-29" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/29.txt",
    );
    expect(result).toBe("text-29");
  });
  it("loadTextFromAssetsBinding matrix 30", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-30" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/30.txt",
    );
    expect(result).toBe("text-30");
  });
  it("loadTextFromAssetsBinding matrix 31", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-31" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/31.txt",
    );
    expect(result).toBe("text-31");
  });
  it("loadTextFromAssetsBinding matrix 32", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-32" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/32.txt",
    );
    expect(result).toBe("text-32");
  });
  it("loadTextFromAssetsBinding matrix 33", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-33" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/33.txt",
    );
    expect(result).toBe("text-33");
  });
  it("loadTextFromAssetsBinding matrix 34", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-34" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/34.txt",
    );
    expect(result).toBe("text-34");
  });
  it("loadTextFromAssetsBinding matrix 35", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-35" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/35.txt",
    );
    expect(result).toBe("text-35");
  });
  it("loadTextFromAssetsBinding matrix 36", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-36" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/36.txt",
    );
    expect(result).toBe("text-36");
  });
  it("loadTextFromAssetsBinding matrix 37", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-37" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/37.txt",
    );
    expect(result).toBe("text-37");
  });
  it("loadTextFromAssetsBinding matrix 38", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-38" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/38.txt",
    );
    expect(result).toBe("text-38");
  });
  it("loadTextFromAssetsBinding matrix 39", async () => {
    const assets = {
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, text: async () => "text-39" }),
    };
    const result = await loadTextFromAssetsBinding(
      assets,
      "https://example/data/39.txt",
    );
    expect(result).toBe("text-39");
  });

  it("throws when the assets binding returns a non-ok text response", async () => {
    const assets = {
      fetch: vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    };
    await expect(
      loadTextFromAssetsBinding(assets, "https://example/data/down.txt"),
    ).rejects.toThrow("503");
  });
});

describe("content-loader-lib edge branches", () => {
  it("throws a generic not-found error when every path fails without an error", async () => {
    const readFile = vi.fn().mockRejectedValue(undefined);
    await expect(readLocalDataFileFromPaths([], readFile)).rejects.toThrow(
      "Local data artifact not found",
    );
  });

  it("throws after exhausting json read retries", async () => {
    const readFile = vi.fn().mockRejectedValue(new Error("disk busy"));
    const sleep = vi.fn().mockResolvedValue(undefined);
    await expect(
      readLocalJsonDataFileWithRetry(
        "broken.json",
        ["/broken.json"],
        readFile,
        sleep,
        2,
      ),
    ).rejects.toThrow("disk busy");
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it("does not sleep after the final failed json read attempt", async () => {
    const readFile = vi.fn().mockResolvedValue("not-json");
    const sleep = vi.fn().mockResolvedValue(undefined);
    await expect(
      readLocalJsonDataFileWithRetry(
        "invalid.json",
        ["/invalid.json"],
        readFile,
        sleep,
        1,
      ),
    ).rejects.toThrow();
    expect(sleep).not.toHaveBeenCalled();
  });
});

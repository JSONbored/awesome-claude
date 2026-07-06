import { describe, expect, it, beforeEach, afterEach } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  dataDirFromOptions,
  readEntry,
  readJsonArtifact,
  readTextArtifact,
} from "../packages/mcp/src/registry-artifact-loader-lib.js";

describe("registry-artifact-loader-lib dataDirFromOptions", () => {
  const original = process.env.HEYCLAUDE_DATA_DIR;
  beforeEach(() => {
    delete process.env.HEYCLAUDE_DATA_DIR;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.HEYCLAUDE_DATA_DIR;
    else process.env.HEYCLAUDE_DATA_DIR = original;
  });
  it("prefers explicit options.dataDir", () => {
    expect(dataDirFromOptions({ dataDir: "/tmp/custom-data" })).toBe(
      "/tmp/custom-data",
    );
  });
  it("falls back to HEYCLAUDE_DATA_DIR env var", () => {
    process.env.HEYCLAUDE_DATA_DIR = "/env/data";
    expect(dataDirFromOptions({})).toBe("/env/data");
  });
  it("options.dataDir beats env var", () => {
    process.env.HEYCLAUDE_DATA_DIR = "/env/data";
    expect(dataDirFromOptions({ dataDir: "/opt/data" })).toBe("/opt/data");
  });
  it("defaults to package-relative apps/web/public/data", () => {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    const repoRoot = path.resolve(moduleDir, "..");
    expect(dataDirFromOptions({})).toBe(
      path.join(repoRoot, "apps", "web", "public", "data"),
    );
  });
  it("dataDirFromOptions override matrix 0", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-0" })).toBe(
      "/data/override-0",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-0";
    expect(dataDirFromOptions({})).toBe("/data/env-0");
  });
  it("dataDirFromOptions override matrix 1", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-1" })).toBe(
      "/data/override-1",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-1";
    expect(dataDirFromOptions({})).toBe("/data/env-1");
  });
  it("dataDirFromOptions override matrix 2", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-2" })).toBe(
      "/data/override-2",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-2";
    expect(dataDirFromOptions({})).toBe("/data/env-2");
  });
  it("dataDirFromOptions override matrix 3", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-3" })).toBe(
      "/data/override-3",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-3";
    expect(dataDirFromOptions({})).toBe("/data/env-3");
  });
  it("dataDirFromOptions override matrix 4", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-4" })).toBe(
      "/data/override-4",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-4";
    expect(dataDirFromOptions({})).toBe("/data/env-4");
  });
  it("dataDirFromOptions override matrix 5", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-5" })).toBe(
      "/data/override-5",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-5";
    expect(dataDirFromOptions({})).toBe("/data/env-5");
  });
  it("dataDirFromOptions override matrix 6", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-6" })).toBe(
      "/data/override-6",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-6";
    expect(dataDirFromOptions({})).toBe("/data/env-6");
  });
  it("dataDirFromOptions override matrix 7", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-7" })).toBe(
      "/data/override-7",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-7";
    expect(dataDirFromOptions({})).toBe("/data/env-7");
  });
  it("dataDirFromOptions override matrix 8", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-8" })).toBe(
      "/data/override-8",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-8";
    expect(dataDirFromOptions({})).toBe("/data/env-8");
  });
  it("dataDirFromOptions override matrix 9", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-9" })).toBe(
      "/data/override-9",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-9";
    expect(dataDirFromOptions({})).toBe("/data/env-9");
  });
  it("dataDirFromOptions override matrix 10", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-10" })).toBe(
      "/data/override-10",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-10";
    expect(dataDirFromOptions({})).toBe("/data/env-10");
  });
  it("dataDirFromOptions override matrix 11", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-11" })).toBe(
      "/data/override-11",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-11";
    expect(dataDirFromOptions({})).toBe("/data/env-11");
  });
  it("dataDirFromOptions override matrix 12", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-12" })).toBe(
      "/data/override-12",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-12";
    expect(dataDirFromOptions({})).toBe("/data/env-12");
  });
  it("dataDirFromOptions override matrix 13", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-13" })).toBe(
      "/data/override-13",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-13";
    expect(dataDirFromOptions({})).toBe("/data/env-13");
  });
  it("dataDirFromOptions override matrix 14", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-14" })).toBe(
      "/data/override-14",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-14";
    expect(dataDirFromOptions({})).toBe("/data/env-14");
  });
  it("dataDirFromOptions override matrix 15", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-15" })).toBe(
      "/data/override-15",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-15";
    expect(dataDirFromOptions({})).toBe("/data/env-15");
  });
  it("dataDirFromOptions override matrix 16", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-16" })).toBe(
      "/data/override-16",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-16";
    expect(dataDirFromOptions({})).toBe("/data/env-16");
  });
  it("dataDirFromOptions override matrix 17", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-17" })).toBe(
      "/data/override-17",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-17";
    expect(dataDirFromOptions({})).toBe("/data/env-17");
  });
  it("dataDirFromOptions override matrix 18", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-18" })).toBe(
      "/data/override-18",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-18";
    expect(dataDirFromOptions({})).toBe("/data/env-18");
  });
  it("dataDirFromOptions override matrix 19", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-19" })).toBe(
      "/data/override-19",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-19";
    expect(dataDirFromOptions({})).toBe("/data/env-19");
  });
  it("dataDirFromOptions override matrix 20", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-20" })).toBe(
      "/data/override-20",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-20";
    expect(dataDirFromOptions({})).toBe("/data/env-20");
  });
  it("dataDirFromOptions override matrix 21", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-21" })).toBe(
      "/data/override-21",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-21";
    expect(dataDirFromOptions({})).toBe("/data/env-21");
  });
  it("dataDirFromOptions override matrix 22", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-22" })).toBe(
      "/data/override-22",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-22";
    expect(dataDirFromOptions({})).toBe("/data/env-22");
  });
  it("dataDirFromOptions override matrix 23", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-23" })).toBe(
      "/data/override-23",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-23";
    expect(dataDirFromOptions({})).toBe("/data/env-23");
  });
  it("dataDirFromOptions override matrix 24", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-24" })).toBe(
      "/data/override-24",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-24";
    expect(dataDirFromOptions({})).toBe("/data/env-24");
  });
  it("dataDirFromOptions override matrix 25", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-25" })).toBe(
      "/data/override-25",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-25";
    expect(dataDirFromOptions({})).toBe("/data/env-25");
  });
  it("dataDirFromOptions override matrix 26", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-26" })).toBe(
      "/data/override-26",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-26";
    expect(dataDirFromOptions({})).toBe("/data/env-26");
  });
  it("dataDirFromOptions override matrix 27", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-27" })).toBe(
      "/data/override-27",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-27";
    expect(dataDirFromOptions({})).toBe("/data/env-27");
  });
  it("dataDirFromOptions override matrix 28", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-28" })).toBe(
      "/data/override-28",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-28";
    expect(dataDirFromOptions({})).toBe("/data/env-28");
  });
  it("dataDirFromOptions override matrix 29", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-29" })).toBe(
      "/data/override-29",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-29";
    expect(dataDirFromOptions({})).toBe("/data/env-29");
  });
  it("dataDirFromOptions override matrix 30", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-30" })).toBe(
      "/data/override-30",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-30";
    expect(dataDirFromOptions({})).toBe("/data/env-30");
  });
  it("dataDirFromOptions override matrix 31", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-31" })).toBe(
      "/data/override-31",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-31";
    expect(dataDirFromOptions({})).toBe("/data/env-31");
  });
  it("dataDirFromOptions override matrix 32", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-32" })).toBe(
      "/data/override-32",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-32";
    expect(dataDirFromOptions({})).toBe("/data/env-32");
  });
  it("dataDirFromOptions override matrix 33", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-33" })).toBe(
      "/data/override-33",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-33";
    expect(dataDirFromOptions({})).toBe("/data/env-33");
  });
  it("dataDirFromOptions override matrix 34", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-34" })).toBe(
      "/data/override-34",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-34";
    expect(dataDirFromOptions({})).toBe("/data/env-34");
  });
  it("dataDirFromOptions override matrix 35", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-35" })).toBe(
      "/data/override-35",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-35";
    expect(dataDirFromOptions({})).toBe("/data/env-35");
  });
  it("dataDirFromOptions override matrix 36", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-36" })).toBe(
      "/data/override-36",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-36";
    expect(dataDirFromOptions({})).toBe("/data/env-36");
  });
  it("dataDirFromOptions override matrix 37", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-37" })).toBe(
      "/data/override-37",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-37";
    expect(dataDirFromOptions({})).toBe("/data/env-37");
  });
  it("dataDirFromOptions override matrix 38", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-38" })).toBe(
      "/data/override-38",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-38";
    expect(dataDirFromOptions({})).toBe("/data/env-38");
  });
  it("dataDirFromOptions override matrix 39", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-39" })).toBe(
      "/data/override-39",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-39";
    expect(dataDirFromOptions({})).toBe("/data/env-39");
  });
  it("dataDirFromOptions override matrix 40", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-40" })).toBe(
      "/data/override-40",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-40";
    expect(dataDirFromOptions({})).toBe("/data/env-40");
  });
  it("dataDirFromOptions override matrix 41", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-41" })).toBe(
      "/data/override-41",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-41";
    expect(dataDirFromOptions({})).toBe("/data/env-41");
  });
  it("dataDirFromOptions override matrix 42", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-42" })).toBe(
      "/data/override-42",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-42";
    expect(dataDirFromOptions({})).toBe("/data/env-42");
  });
  it("dataDirFromOptions override matrix 43", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-43" })).toBe(
      "/data/override-43",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-43";
    expect(dataDirFromOptions({})).toBe("/data/env-43");
  });
  it("dataDirFromOptions override matrix 44", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-44" })).toBe(
      "/data/override-44",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-44";
    expect(dataDirFromOptions({})).toBe("/data/env-44");
  });
  it("dataDirFromOptions override matrix 45", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-45" })).toBe(
      "/data/override-45",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-45";
    expect(dataDirFromOptions({})).toBe("/data/env-45");
  });
  it("dataDirFromOptions override matrix 46", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-46" })).toBe(
      "/data/override-46",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-46";
    expect(dataDirFromOptions({})).toBe("/data/env-46");
  });
  it("dataDirFromOptions override matrix 47", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-47" })).toBe(
      "/data/override-47",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-47";
    expect(dataDirFromOptions({})).toBe("/data/env-47");
  });
  it("dataDirFromOptions override matrix 48", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-48" })).toBe(
      "/data/override-48",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-48";
    expect(dataDirFromOptions({})).toBe("/data/env-48");
  });
  it("dataDirFromOptions override matrix 49", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-49" })).toBe(
      "/data/override-49",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-49";
    expect(dataDirFromOptions({})).toBe("/data/env-49");
  });
  it("dataDirFromOptions override matrix 50", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-50" })).toBe(
      "/data/override-50",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-50";
    expect(dataDirFromOptions({})).toBe("/data/env-50");
  });
  it("dataDirFromOptions override matrix 51", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-51" })).toBe(
      "/data/override-51",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-51";
    expect(dataDirFromOptions({})).toBe("/data/env-51");
  });
  it("dataDirFromOptions override matrix 52", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-52" })).toBe(
      "/data/override-52",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-52";
    expect(dataDirFromOptions({})).toBe("/data/env-52");
  });
  it("dataDirFromOptions override matrix 53", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-53" })).toBe(
      "/data/override-53",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-53";
    expect(dataDirFromOptions({})).toBe("/data/env-53");
  });
  it("dataDirFromOptions override matrix 54", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-54" })).toBe(
      "/data/override-54",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-54";
    expect(dataDirFromOptions({})).toBe("/data/env-54");
  });
  it("dataDirFromOptions override matrix 55", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-55" })).toBe(
      "/data/override-55",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-55";
    expect(dataDirFromOptions({})).toBe("/data/env-55");
  });
  it("dataDirFromOptions override matrix 56", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-56" })).toBe(
      "/data/override-56",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-56";
    expect(dataDirFromOptions({})).toBe("/data/env-56");
  });
  it("dataDirFromOptions override matrix 57", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-57" })).toBe(
      "/data/override-57",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-57";
    expect(dataDirFromOptions({})).toBe("/data/env-57");
  });
  it("dataDirFromOptions override matrix 58", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-58" })).toBe(
      "/data/override-58",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-58";
    expect(dataDirFromOptions({})).toBe("/data/env-58");
  });
  it("dataDirFromOptions override matrix 59", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-59" })).toBe(
      "/data/override-59",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-59";
    expect(dataDirFromOptions({})).toBe("/data/env-59");
  });
  it("dataDirFromOptions override matrix 60", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-60" })).toBe(
      "/data/override-60",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-60";
    expect(dataDirFromOptions({})).toBe("/data/env-60");
  });
  it("dataDirFromOptions override matrix 61", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-61" })).toBe(
      "/data/override-61",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-61";
    expect(dataDirFromOptions({})).toBe("/data/env-61");
  });
  it("dataDirFromOptions override matrix 62", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-62" })).toBe(
      "/data/override-62",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-62";
    expect(dataDirFromOptions({})).toBe("/data/env-62");
  });
  it("dataDirFromOptions override matrix 63", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-63" })).toBe(
      "/data/override-63",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-63";
    expect(dataDirFromOptions({})).toBe("/data/env-63");
  });
  it("dataDirFromOptions override matrix 64", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-64" })).toBe(
      "/data/override-64",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-64";
    expect(dataDirFromOptions({})).toBe("/data/env-64");
  });
  it("dataDirFromOptions override matrix 65", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-65" })).toBe(
      "/data/override-65",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-65";
    expect(dataDirFromOptions({})).toBe("/data/env-65");
  });
  it("dataDirFromOptions override matrix 66", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-66" })).toBe(
      "/data/override-66",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-66";
    expect(dataDirFromOptions({})).toBe("/data/env-66");
  });
  it("dataDirFromOptions override matrix 67", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-67" })).toBe(
      "/data/override-67",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-67";
    expect(dataDirFromOptions({})).toBe("/data/env-67");
  });
  it("dataDirFromOptions override matrix 68", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-68" })).toBe(
      "/data/override-68",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-68";
    expect(dataDirFromOptions({})).toBe("/data/env-68");
  });
  it("dataDirFromOptions override matrix 69", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-69" })).toBe(
      "/data/override-69",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-69";
    expect(dataDirFromOptions({})).toBe("/data/env-69");
  });
  it("dataDirFromOptions override matrix 70", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-70" })).toBe(
      "/data/override-70",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-70";
    expect(dataDirFromOptions({})).toBe("/data/env-70");
  });
  it("dataDirFromOptions override matrix 71", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-71" })).toBe(
      "/data/override-71",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-71";
    expect(dataDirFromOptions({})).toBe("/data/env-71");
  });
  it("dataDirFromOptions override matrix 72", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-72" })).toBe(
      "/data/override-72",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-72";
    expect(dataDirFromOptions({})).toBe("/data/env-72");
  });
  it("dataDirFromOptions override matrix 73", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-73" })).toBe(
      "/data/override-73",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-73";
    expect(dataDirFromOptions({})).toBe("/data/env-73");
  });
  it("dataDirFromOptions override matrix 74", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-74" })).toBe(
      "/data/override-74",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-74";
    expect(dataDirFromOptions({})).toBe("/data/env-74");
  });
  it("dataDirFromOptions override matrix 75", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-75" })).toBe(
      "/data/override-75",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-75";
    expect(dataDirFromOptions({})).toBe("/data/env-75");
  });
  it("dataDirFromOptions override matrix 76", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-76" })).toBe(
      "/data/override-76",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-76";
    expect(dataDirFromOptions({})).toBe("/data/env-76");
  });
  it("dataDirFromOptions override matrix 77", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-77" })).toBe(
      "/data/override-77",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-77";
    expect(dataDirFromOptions({})).toBe("/data/env-77");
  });
  it("dataDirFromOptions override matrix 78", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-78" })).toBe(
      "/data/override-78",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-78";
    expect(dataDirFromOptions({})).toBe("/data/env-78");
  });
  it("dataDirFromOptions override matrix 79", () => {
    expect(dataDirFromOptions({ dataDir: "/data/override-79" })).toBe(
      "/data/override-79",
    );
    process.env.HEYCLAUDE_DATA_DIR = "/data/env-79";
    expect(dataDirFromOptions({})).toBe("/data/env-79");
  });
});

describe("registry-artifact-loader-lib readTextArtifact", () => {
  it("delegates to injected readTextArtifact loader", async () => {
    const text = await readTextArtifact("search-index.json", {
      readTextArtifact: async (relativePath) => `mock:${relativePath}`,
    });
    expect(text).toBe("mock:search-index.json");
  });
  it("readTextArtifact injected loader 0", async () => {
    const payload = await readTextArtifact("search-index.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({ relativePath: "search-index.json" });
  });
  it("readTextArtifact injected loader 1", async () => {
    const payload = await readTextArtifact("registry-manifest.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "registry-manifest.json",
    });
  });
  it("readTextArtifact injected loader 2", async () => {
    const payload = await readTextArtifact("directory-index.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "directory-index.json",
    });
  });
  it("readTextArtifact injected loader 3", async () => {
    const payload = await readTextArtifact("relation-graph.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "relation-graph.json",
    });
  });
  it("readTextArtifact injected loader 4", async () => {
    const payload = await readTextArtifact("submission-spec.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "submission-spec.json",
    });
  });
  it("readTextArtifact injected loader 5", async () => {
    const payload = await readTextArtifact("feeds/index.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({ relativePath: "feeds/index.json" });
  });
  it("readTextArtifact injected loader 6", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 7", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 8", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 9", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 10", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 11", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 12", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 13", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 14", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 15", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 16", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 17", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 18", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 19", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 20", async () => {
    const payload = await readTextArtifact(
      "entries/agents/agents-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/agents/agents-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 21", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/agents-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/agents-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 22", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-0.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 23", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 24", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-1.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 25", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 26", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-2.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 27", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 28", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-3.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 29", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 30", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-4.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 31", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 32", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-5.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 33", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 34", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-6.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 35", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 36", async () => {
    const payload = await readTextArtifact("entries/mcp/mcp-artifact-7.json", {
      readTextArtifact: async (relativePath) =>
        JSON.stringify({ relativePath }),
    });
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/mcp/mcp-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 37", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/mcp-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/mcp-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 38", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 39", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 40", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 41", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 42", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 43", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 44", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 45", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 46", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 47", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 48", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 49", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 50", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 51", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 52", async () => {
    const payload = await readTextArtifact(
      "entries/tools/tools-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/tools/tools-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 53", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/tools-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/tools-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 54", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 55", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 56", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 57", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 58", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 59", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 60", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 61", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 62", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 63", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 64", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 65", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 66", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 67", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 68", async () => {
    const payload = await readTextArtifact(
      "entries/skills/skills-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/skills/skills-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 69", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/skills-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/skills-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 70", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 71", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 72", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 73", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 74", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 75", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 76", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 77", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 78", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 79", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 80", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 81", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 82", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 83", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 84", async () => {
    const payload = await readTextArtifact(
      "entries/rules/rules-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/rules/rules-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 85", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/rules-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/rules-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 86", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 87", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 88", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 89", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 90", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 91", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 92", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 93", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 94", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 95", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 96", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 97", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 98", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 99", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 100", async () => {
    const payload = await readTextArtifact(
      "entries/commands/commands-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/commands/commands-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 101", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/commands-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/commands-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 102", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 103", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 104", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 105", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 106", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 107", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 108", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 109", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 110", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 111", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 112", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 113", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 114", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 115", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 116", async () => {
    const payload = await readTextArtifact(
      "entries/hooks/hooks-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/hooks/hooks-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 117", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/hooks-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/hooks-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 118", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 119", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 120", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 121", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 122", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 123", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 124", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 125", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 126", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 127", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 128", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 129", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 130", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 131", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 132", async () => {
    const payload = await readTextArtifact(
      "entries/guides/guides-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/guides/guides-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 133", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/guides-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/guides-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 134", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 135", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 136", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 137", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 138", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 139", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 140", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 141", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 142", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 143", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 144", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 145", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 146", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 147", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 148", async () => {
    const payload = await readTextArtifact(
      "entries/collections/collections-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/collections/collections-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 149", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/collections-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/collections-artifact-7.mdc",
    });
  });
  it("readTextArtifact injected loader 150", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-0.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-0.json",
    });
  });
  it("readTextArtifact injected loader 151", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-0.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-0.mdc",
    });
  });
  it("readTextArtifact injected loader 152", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-1.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-1.json",
    });
  });
  it("readTextArtifact injected loader 153", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-1.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-1.mdc",
    });
  });
  it("readTextArtifact injected loader 154", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-2.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-2.json",
    });
  });
  it("readTextArtifact injected loader 155", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-2.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-2.mdc",
    });
  });
  it("readTextArtifact injected loader 156", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-3.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-3.json",
    });
  });
  it("readTextArtifact injected loader 157", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-3.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-3.mdc",
    });
  });
  it("readTextArtifact injected loader 158", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-4.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-4.json",
    });
  });
  it("readTextArtifact injected loader 159", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-4.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-4.mdc",
    });
  });
  it("readTextArtifact injected loader 160", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-5.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-5.json",
    });
  });
  it("readTextArtifact injected loader 161", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-5.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-5.mdc",
    });
  });
  it("readTextArtifact injected loader 162", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-6.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-6.json",
    });
  });
  it("readTextArtifact injected loader 163", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-6.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-6.mdc",
    });
  });
  it("readTextArtifact injected loader 164", async () => {
    const payload = await readTextArtifact(
      "entries/statuslines/statuslines-artifact-7.json",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "entries/statuslines/statuslines-artifact-7.json",
    });
  });
  it("readTextArtifact injected loader 165", async () => {
    const payload = await readTextArtifact(
      "skill-adapters/cursor/statuslines-artifact-7.mdc",
      {
        readTextArtifact: async (relativePath) =>
          JSON.stringify({ relativePath }),
      },
    );
    expect(JSON.parse(payload)).toEqual({
      relativePath: "skill-adapters/cursor/statuslines-artifact-7.mdc",
    });
  });
  it("readTextArtifact preserves relative path 0", async () => {
    const relativePath = "entries/mcp/demo-0.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 1", async () => {
    const relativePath = "entries/mcp/demo-1.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 2", async () => {
    const relativePath = "entries/mcp/demo-2.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 3", async () => {
    const relativePath = "entries/mcp/demo-3.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 4", async () => {
    const relativePath = "entries/mcp/demo-4.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 5", async () => {
    const relativePath = "entries/mcp/demo-5.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 6", async () => {
    const relativePath = "entries/mcp/demo-6.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 7", async () => {
    const relativePath = "entries/mcp/demo-7.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 8", async () => {
    const relativePath = "entries/mcp/demo-8.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 9", async () => {
    const relativePath = "entries/mcp/demo-9.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 10", async () => {
    const relativePath = "entries/mcp/demo-10.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 11", async () => {
    const relativePath = "entries/mcp/demo-11.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 12", async () => {
    const relativePath = "entries/mcp/demo-12.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 13", async () => {
    const relativePath = "entries/mcp/demo-13.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 14", async () => {
    const relativePath = "entries/mcp/demo-14.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 15", async () => {
    const relativePath = "entries/mcp/demo-15.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 16", async () => {
    const relativePath = "entries/mcp/demo-16.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 17", async () => {
    const relativePath = "entries/mcp/demo-17.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 18", async () => {
    const relativePath = "entries/mcp/demo-18.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 19", async () => {
    const relativePath = "entries/mcp/demo-19.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 20", async () => {
    const relativePath = "entries/mcp/demo-20.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 21", async () => {
    const relativePath = "entries/mcp/demo-21.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 22", async () => {
    const relativePath = "entries/mcp/demo-22.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 23", async () => {
    const relativePath = "entries/mcp/demo-23.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 24", async () => {
    const relativePath = "entries/mcp/demo-24.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 25", async () => {
    const relativePath = "entries/mcp/demo-25.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 26", async () => {
    const relativePath = "entries/mcp/demo-26.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 27", async () => {
    const relativePath = "entries/mcp/demo-27.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 28", async () => {
    const relativePath = "entries/mcp/demo-28.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 29", async () => {
    const relativePath = "entries/mcp/demo-29.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 30", async () => {
    const relativePath = "entries/mcp/demo-30.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 31", async () => {
    const relativePath = "entries/mcp/demo-31.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 32", async () => {
    const relativePath = "entries/mcp/demo-32.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 33", async () => {
    const relativePath = "entries/mcp/demo-33.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 34", async () => {
    const relativePath = "entries/mcp/demo-34.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 35", async () => {
    const relativePath = "entries/mcp/demo-35.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 36", async () => {
    const relativePath = "entries/mcp/demo-36.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 37", async () => {
    const relativePath = "entries/mcp/demo-37.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 38", async () => {
    const relativePath = "entries/mcp/demo-38.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 39", async () => {
    const relativePath = "entries/mcp/demo-39.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 40", async () => {
    const relativePath = "entries/mcp/demo-40.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 41", async () => {
    const relativePath = "entries/mcp/demo-41.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 42", async () => {
    const relativePath = "entries/mcp/demo-42.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 43", async () => {
    const relativePath = "entries/mcp/demo-43.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 44", async () => {
    const relativePath = "entries/mcp/demo-44.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 45", async () => {
    const relativePath = "entries/mcp/demo-45.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 46", async () => {
    const relativePath = "entries/mcp/demo-46.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 47", async () => {
    const relativePath = "entries/mcp/demo-47.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 48", async () => {
    const relativePath = "entries/mcp/demo-48.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 49", async () => {
    const relativePath = "entries/mcp/demo-49.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 50", async () => {
    const relativePath = "entries/mcp/demo-50.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 51", async () => {
    const relativePath = "entries/mcp/demo-51.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 52", async () => {
    const relativePath = "entries/mcp/demo-52.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 53", async () => {
    const relativePath = "entries/mcp/demo-53.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 54", async () => {
    const relativePath = "entries/mcp/demo-54.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 55", async () => {
    const relativePath = "entries/mcp/demo-55.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 56", async () => {
    const relativePath = "entries/mcp/demo-56.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 57", async () => {
    const relativePath = "entries/mcp/demo-57.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 58", async () => {
    const relativePath = "entries/mcp/demo-58.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
  it("readTextArtifact preserves relative path 59", async () => {
    const relativePath = "entries/mcp/demo-59.json";
    const text = await readTextArtifact(relativePath, {
      readTextArtifact: async (path) => `content-for-${path}`,
    });
    expect(text).toBe(`content-for-${relativePath}`);
  });
});

describe("registry-artifact-loader-lib readJsonArtifact", () => {
  it("delegates to injected readJsonArtifact loader", async () => {
    const payload = await readJsonArtifact("search-index.json", {
      readJsonArtifact: async () => ({ entries: [{ slug: "demo" }] }),
    });
    expect(payload).toEqual({ entries: [{ slug: "demo" }] });
  });
  it("parses injected readTextArtifact when no cache", async () => {
    const payload = await readJsonArtifact("registry-manifest.json", {
      readTextArtifact: async () =>
        JSON.stringify({ schemaVersion: 2, totalEntries: 1 }),
    });
    expect(payload).toEqual({ schemaVersion: 2, totalEntries: 1 });
  });
  it("uses artifactCache when provided", async () => {
    const cache = new Map();
    let reads = 0;
    const options = {
      dataDir: "/tmp/cache-test",
      artifactCache: cache,
      readTextArtifact: async () => {
        reads += 1;
        return JSON.stringify({ cached: true, reads });
      },
    };
    const first = await readJsonArtifact("search-index.json", options);
    const second = await readJsonArtifact("search-index.json", options);
    expect(first).toEqual({ cached: true, reads: 1 });
    expect(second).toEqual({ cached: true, reads: 1 });
    expect(reads).toBe(1);
  });
  it("readJsonArtifact agents/agents-json-0", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-0.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-0" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-0");
  });
  it("readJsonArtifact agents/agents-json-1", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-1.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-1" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-1");
  });
  it("readJsonArtifact agents/agents-json-2", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-2.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-2" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-2");
  });
  it("readJsonArtifact agents/agents-json-3", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-3.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-3" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-3");
  });
  it("readJsonArtifact agents/agents-json-4", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-4.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-4" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-4");
  });
  it("readJsonArtifact agents/agents-json-5", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-5.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-5" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-5");
  });
  it("readJsonArtifact agents/agents-json-6", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-6.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-6" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-6");
  });
  it("readJsonArtifact agents/agents-json-7", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-7.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-7" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-7");
  });
  it("readJsonArtifact agents/agents-json-8", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-8.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-8" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-8");
  });
  it("readJsonArtifact agents/agents-json-9", async () => {
    const payload = await readJsonArtifact(
      "entries/agents/agents-json-9.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "agents", slug: "agents-json-9" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("agents-json-9");
  });
  it("readJsonArtifact mcp/mcp-json-0", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-0.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-0" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-0");
  });
  it("readJsonArtifact mcp/mcp-json-1", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-1.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-1" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-1");
  });
  it("readJsonArtifact mcp/mcp-json-2", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-2.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-2" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-2");
  });
  it("readJsonArtifact mcp/mcp-json-3", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-3.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-3" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-3");
  });
  it("readJsonArtifact mcp/mcp-json-4", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-4.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-4" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-4");
  });
  it("readJsonArtifact mcp/mcp-json-5", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-5.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-5" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-5");
  });
  it("readJsonArtifact mcp/mcp-json-6", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-6.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-6" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-6");
  });
  it("readJsonArtifact mcp/mcp-json-7", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-7.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-7" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-7");
  });
  it("readJsonArtifact mcp/mcp-json-8", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-8.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-8" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-8");
  });
  it("readJsonArtifact mcp/mcp-json-9", async () => {
    const payload = await readJsonArtifact("entries/mcp/mcp-json-9.json", {
      readJsonArtifact: async () => ({
        entry: { category: "mcp", slug: "mcp-json-9" },
      }),
    });
    expect(payload.entry.slug).toBe("mcp-json-9");
  });
  it("readJsonArtifact tools/tools-json-0", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-0.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-0" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-0");
  });
  it("readJsonArtifact tools/tools-json-1", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-1.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-1" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-1");
  });
  it("readJsonArtifact tools/tools-json-2", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-2.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-2" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-2");
  });
  it("readJsonArtifact tools/tools-json-3", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-3.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-3" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-3");
  });
  it("readJsonArtifact tools/tools-json-4", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-4.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-4" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-4");
  });
  it("readJsonArtifact tools/tools-json-5", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-5.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-5" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-5");
  });
  it("readJsonArtifact tools/tools-json-6", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-6.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-6" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-6");
  });
  it("readJsonArtifact tools/tools-json-7", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-7.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-7" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-7");
  });
  it("readJsonArtifact tools/tools-json-8", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-8.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-8" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-8");
  });
  it("readJsonArtifact tools/tools-json-9", async () => {
    const payload = await readJsonArtifact("entries/tools/tools-json-9.json", {
      readJsonArtifact: async () => ({
        entry: { category: "tools", slug: "tools-json-9" },
      }),
    });
    expect(payload.entry.slug).toBe("tools-json-9");
  });
  it("readJsonArtifact skills/skills-json-0", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-0.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-0" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-0");
  });
  it("readJsonArtifact skills/skills-json-1", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-1.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-1" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-1");
  });
  it("readJsonArtifact skills/skills-json-2", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-2.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-2" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-2");
  });
  it("readJsonArtifact skills/skills-json-3", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-3.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-3" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-3");
  });
  it("readJsonArtifact skills/skills-json-4", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-4.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-4" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-4");
  });
  it("readJsonArtifact skills/skills-json-5", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-5.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-5" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-5");
  });
  it("readJsonArtifact skills/skills-json-6", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-6.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-6" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-6");
  });
  it("readJsonArtifact skills/skills-json-7", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-7.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-7" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-7");
  });
  it("readJsonArtifact skills/skills-json-8", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-8.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-8" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-8");
  });
  it("readJsonArtifact skills/skills-json-9", async () => {
    const payload = await readJsonArtifact(
      "entries/skills/skills-json-9.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "skills", slug: "skills-json-9" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("skills-json-9");
  });
  it("readJsonArtifact rules/rules-json-0", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-0.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-0" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-0");
  });
  it("readJsonArtifact rules/rules-json-1", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-1.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-1" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-1");
  });
  it("readJsonArtifact rules/rules-json-2", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-2.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-2" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-2");
  });
  it("readJsonArtifact rules/rules-json-3", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-3.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-3" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-3");
  });
  it("readJsonArtifact rules/rules-json-4", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-4.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-4" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-4");
  });
  it("readJsonArtifact rules/rules-json-5", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-5.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-5" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-5");
  });
  it("readJsonArtifact rules/rules-json-6", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-6.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-6" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-6");
  });
  it("readJsonArtifact rules/rules-json-7", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-7.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-7" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-7");
  });
  it("readJsonArtifact rules/rules-json-8", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-8.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-8" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-8");
  });
  it("readJsonArtifact rules/rules-json-9", async () => {
    const payload = await readJsonArtifact("entries/rules/rules-json-9.json", {
      readJsonArtifact: async () => ({
        entry: { category: "rules", slug: "rules-json-9" },
      }),
    });
    expect(payload.entry.slug).toBe("rules-json-9");
  });
  it("readJsonArtifact commands/commands-json-0", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-0.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-0" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-0");
  });
  it("readJsonArtifact commands/commands-json-1", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-1.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-1" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-1");
  });
  it("readJsonArtifact commands/commands-json-2", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-2.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-2" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-2");
  });
  it("readJsonArtifact commands/commands-json-3", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-3.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-3" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-3");
  });
  it("readJsonArtifact commands/commands-json-4", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-4.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-4" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-4");
  });
  it("readJsonArtifact commands/commands-json-5", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-5.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-5" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-5");
  });
  it("readJsonArtifact commands/commands-json-6", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-6.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-6" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-6");
  });
  it("readJsonArtifact commands/commands-json-7", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-7.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-7" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-7");
  });
  it("readJsonArtifact commands/commands-json-8", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-8.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-8" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-8");
  });
  it("readJsonArtifact commands/commands-json-9", async () => {
    const payload = await readJsonArtifact(
      "entries/commands/commands-json-9.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "commands", slug: "commands-json-9" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("commands-json-9");
  });
  it("readJsonArtifact hooks/hooks-json-0", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-0.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-0" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-0");
  });
  it("readJsonArtifact hooks/hooks-json-1", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-1.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-1" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-1");
  });
  it("readJsonArtifact hooks/hooks-json-2", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-2.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-2" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-2");
  });
  it("readJsonArtifact hooks/hooks-json-3", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-3.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-3" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-3");
  });
  it("readJsonArtifact hooks/hooks-json-4", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-4.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-4" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-4");
  });
  it("readJsonArtifact hooks/hooks-json-5", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-5.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-5" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-5");
  });
  it("readJsonArtifact hooks/hooks-json-6", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-6.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-6" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-6");
  });
  it("readJsonArtifact hooks/hooks-json-7", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-7.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-7" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-7");
  });
  it("readJsonArtifact hooks/hooks-json-8", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-8.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-8" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-8");
  });
  it("readJsonArtifact hooks/hooks-json-9", async () => {
    const payload = await readJsonArtifact("entries/hooks/hooks-json-9.json", {
      readJsonArtifact: async () => ({
        entry: { category: "hooks", slug: "hooks-json-9" },
      }),
    });
    expect(payload.entry.slug).toBe("hooks-json-9");
  });
  it("readJsonArtifact guides/guides-json-0", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-0.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-0" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-0");
  });
  it("readJsonArtifact guides/guides-json-1", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-1.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-1" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-1");
  });
  it("readJsonArtifact guides/guides-json-2", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-2.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-2" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-2");
  });
  it("readJsonArtifact guides/guides-json-3", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-3.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-3" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-3");
  });
  it("readJsonArtifact guides/guides-json-4", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-4.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-4" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-4");
  });
  it("readJsonArtifact guides/guides-json-5", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-5.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-5" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-5");
  });
  it("readJsonArtifact guides/guides-json-6", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-6.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-6" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-6");
  });
  it("readJsonArtifact guides/guides-json-7", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-7.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-7" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-7");
  });
  it("readJsonArtifact guides/guides-json-8", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-8.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-8" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-8");
  });
  it("readJsonArtifact guides/guides-json-9", async () => {
    const payload = await readJsonArtifact(
      "entries/guides/guides-json-9.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "guides", slug: "guides-json-9" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("guides-json-9");
  });
  it("readJsonArtifact collections/collections-json-0", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-0.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-0" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-0");
  });
  it("readJsonArtifact collections/collections-json-1", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-1.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-1" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-1");
  });
  it("readJsonArtifact collections/collections-json-2", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-2.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-2" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-2");
  });
  it("readJsonArtifact collections/collections-json-3", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-3.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-3" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-3");
  });
  it("readJsonArtifact collections/collections-json-4", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-4.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-4" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-4");
  });
  it("readJsonArtifact collections/collections-json-5", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-5.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-5" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-5");
  });
  it("readJsonArtifact collections/collections-json-6", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-6.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-6" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-6");
  });
  it("readJsonArtifact collections/collections-json-7", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-7.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-7" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-7");
  });
  it("readJsonArtifact collections/collections-json-8", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-8.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-8" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-8");
  });
  it("readJsonArtifact collections/collections-json-9", async () => {
    const payload = await readJsonArtifact(
      "entries/collections/collections-json-9.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "collections", slug: "collections-json-9" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("collections-json-9");
  });
  it("readJsonArtifact statuslines/statuslines-json-0", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-0.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-0" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-0");
  });
  it("readJsonArtifact statuslines/statuslines-json-1", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-1.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-1" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-1");
  });
  it("readJsonArtifact statuslines/statuslines-json-2", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-2.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-2" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-2");
  });
  it("readJsonArtifact statuslines/statuslines-json-3", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-3.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-3" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-3");
  });
  it("readJsonArtifact statuslines/statuslines-json-4", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-4.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-4" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-4");
  });
  it("readJsonArtifact statuslines/statuslines-json-5", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-5.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-5" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-5");
  });
  it("readJsonArtifact statuslines/statuslines-json-6", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-6.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-6" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-6");
  });
  it("readJsonArtifact statuslines/statuslines-json-7", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-7.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-7" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-7");
  });
  it("readJsonArtifact statuslines/statuslines-json-8", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-8.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-8" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-8");
  });
  it("readJsonArtifact statuslines/statuslines-json-9", async () => {
    const payload = await readJsonArtifact(
      "entries/statuslines/statuslines-json-9.json",
      {
        readJsonArtifact: async () => ({
          entry: { category: "statuslines", slug: "statuslines-json-9" },
        }),
      },
    );
    expect(payload.entry.slug).toBe("statuslines-json-9");
  });
  it("readJsonArtifact cache key isolation 0", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-0",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 1", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-1",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 2", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-2",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 3", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-3",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 4", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-4",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 5", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-5",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 6", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-6",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 7", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-7",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 8", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-8",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 9", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-9",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 10", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-10",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 11", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-11",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 12", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-12",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 13", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-13",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 14", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-14",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 15", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-15",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 16", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-16",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 17", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-17",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 18", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-18",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 19", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-19",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 20", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-20",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 21", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-21",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 22", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-22",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 23", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-23",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 24", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-24",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 25", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-25",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 26", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-26",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 27", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-27",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 28", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-28",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 29", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-29",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 30", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-30",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 31", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-31",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 32", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-32",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 33", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-33",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 34", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-34",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 35", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-35",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 36", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-36",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 37", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-37",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 38", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-38",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 39", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-39",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 40", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-40",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 41", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-41",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 42", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-42",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 43", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-43",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 44", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-44",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 45", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-45",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 46", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-46",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 47", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-47",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 48", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-48",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
  it("readJsonArtifact cache key isolation 49", async () => {
    const cache = new Map();
    const options = {
      dataDir: "/tmp/cache-49",
      artifactCache: cache,
      readTextArtifact: async (p) => JSON.stringify({ path: p }),
    };
    await readJsonArtifact("search-index.json", options);
    await readJsonArtifact("registry-manifest.json", options);
    expect(cache.size).toBe(2);
  });
});

describe("registry-artifact-loader-lib readEntry", () => {
  it("returns null for unsafe category or slug", async () => {
    expect(await readEntry("../etc", "passwd", {})).toBeNull();
    expect(await readEntry("mcp", "../evil", {})).toBeNull();
    expect(await readEntry("UPPER", "slug", {})).toBeNull();
  });
  it("returns entry payload when present", async () => {
    const entry = await readEntry("mcp", "browser-bridge", {
      readJsonArtifact: async () => ({
        entry: {
          category: "mcp",
          slug: "browser-bridge",
          title: "Browser Bridge",
        },
      }),
    });
    expect(entry?.title).toBe("Browser Bridge");
  });
  it("returns null when loader throws", async () => {
    const entry = await readEntry("mcp", "missing", {
      readJsonArtifact: async () => {
        throw new Error("missing");
      },
    });
    expect(entry).toBeNull();
  });
  it("returns null when payload has no entry", async () => {
    const entry = await readEntry("mcp", "empty", {
      readJsonArtifact: async () => ({ schemaVersion: 1 }),
    });
    expect(entry).toBeNull();
  });
  it("readEntry accepts agents/agents-read-0", async () => {
    const entry = await readEntry("agents", "agents-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-0.json");
        return { entry: { category: "agents", slug: "agents-read-0" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-0");
  });
  it("readEntry accepts agents/agents-read-1", async () => {
    const entry = await readEntry("agents", "agents-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-1.json");
        return { entry: { category: "agents", slug: "agents-read-1" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-1");
  });
  it("readEntry accepts agents/agents-read-2", async () => {
    const entry = await readEntry("agents", "agents-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-2.json");
        return { entry: { category: "agents", slug: "agents-read-2" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-2");
  });
  it("readEntry accepts agents/agents-read-3", async () => {
    const entry = await readEntry("agents", "agents-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-3.json");
        return { entry: { category: "agents", slug: "agents-read-3" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-3");
  });
  it("readEntry accepts agents/agents-read-4", async () => {
    const entry = await readEntry("agents", "agents-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-4.json");
        return { entry: { category: "agents", slug: "agents-read-4" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-4");
  });
  it("readEntry accepts agents/agents-read-5", async () => {
    const entry = await readEntry("agents", "agents-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-5.json");
        return { entry: { category: "agents", slug: "agents-read-5" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-5");
  });
  it("readEntry accepts agents/agents-read-6", async () => {
    const entry = await readEntry("agents", "agents-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-6.json");
        return { entry: { category: "agents", slug: "agents-read-6" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-6");
  });
  it("readEntry accepts agents/agents-read-7", async () => {
    const entry = await readEntry("agents", "agents-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-7.json");
        return { entry: { category: "agents", slug: "agents-read-7" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-7");
  });
  it("readEntry accepts agents/agents-read-8", async () => {
    const entry = await readEntry("agents", "agents-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-8.json");
        return { entry: { category: "agents", slug: "agents-read-8" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-8");
  });
  it("readEntry accepts agents/agents-read-9", async () => {
    const entry = await readEntry("agents", "agents-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-9.json");
        return { entry: { category: "agents", slug: "agents-read-9" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-9");
  });
  it("readEntry accepts agents/agents-read-10", async () => {
    const entry = await readEntry("agents", "agents-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-10.json");
        return { entry: { category: "agents", slug: "agents-read-10" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-10");
  });
  it("readEntry accepts agents/agents-read-11", async () => {
    const entry = await readEntry("agents", "agents-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/agents/agents-read-11.json");
        return { entry: { category: "agents", slug: "agents-read-11" } };
      },
    });
    expect(entry?.slug).toBe("agents-read-11");
  });
  it("readEntry accepts mcp/mcp-read-0", async () => {
    const entry = await readEntry("mcp", "mcp-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-0.json");
        return { entry: { category: "mcp", slug: "mcp-read-0" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-0");
  });
  it("readEntry accepts mcp/mcp-read-1", async () => {
    const entry = await readEntry("mcp", "mcp-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-1.json");
        return { entry: { category: "mcp", slug: "mcp-read-1" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-1");
  });
  it("readEntry accepts mcp/mcp-read-2", async () => {
    const entry = await readEntry("mcp", "mcp-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-2.json");
        return { entry: { category: "mcp", slug: "mcp-read-2" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-2");
  });
  it("readEntry accepts mcp/mcp-read-3", async () => {
    const entry = await readEntry("mcp", "mcp-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-3.json");
        return { entry: { category: "mcp", slug: "mcp-read-3" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-3");
  });
  it("readEntry accepts mcp/mcp-read-4", async () => {
    const entry = await readEntry("mcp", "mcp-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-4.json");
        return { entry: { category: "mcp", slug: "mcp-read-4" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-4");
  });
  it("readEntry accepts mcp/mcp-read-5", async () => {
    const entry = await readEntry("mcp", "mcp-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-5.json");
        return { entry: { category: "mcp", slug: "mcp-read-5" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-5");
  });
  it("readEntry accepts mcp/mcp-read-6", async () => {
    const entry = await readEntry("mcp", "mcp-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-6.json");
        return { entry: { category: "mcp", slug: "mcp-read-6" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-6");
  });
  it("readEntry accepts mcp/mcp-read-7", async () => {
    const entry = await readEntry("mcp", "mcp-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-7.json");
        return { entry: { category: "mcp", slug: "mcp-read-7" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-7");
  });
  it("readEntry accepts mcp/mcp-read-8", async () => {
    const entry = await readEntry("mcp", "mcp-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-8.json");
        return { entry: { category: "mcp", slug: "mcp-read-8" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-8");
  });
  it("readEntry accepts mcp/mcp-read-9", async () => {
    const entry = await readEntry("mcp", "mcp-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-9.json");
        return { entry: { category: "mcp", slug: "mcp-read-9" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-9");
  });
  it("readEntry accepts mcp/mcp-read-10", async () => {
    const entry = await readEntry("mcp", "mcp-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-10.json");
        return { entry: { category: "mcp", slug: "mcp-read-10" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-10");
  });
  it("readEntry accepts mcp/mcp-read-11", async () => {
    const entry = await readEntry("mcp", "mcp-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/mcp/mcp-read-11.json");
        return { entry: { category: "mcp", slug: "mcp-read-11" } };
      },
    });
    expect(entry?.slug).toBe("mcp-read-11");
  });
  it("readEntry accepts tools/tools-read-0", async () => {
    const entry = await readEntry("tools", "tools-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-0.json");
        return { entry: { category: "tools", slug: "tools-read-0" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-0");
  });
  it("readEntry accepts tools/tools-read-1", async () => {
    const entry = await readEntry("tools", "tools-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-1.json");
        return { entry: { category: "tools", slug: "tools-read-1" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-1");
  });
  it("readEntry accepts tools/tools-read-2", async () => {
    const entry = await readEntry("tools", "tools-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-2.json");
        return { entry: { category: "tools", slug: "tools-read-2" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-2");
  });
  it("readEntry accepts tools/tools-read-3", async () => {
    const entry = await readEntry("tools", "tools-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-3.json");
        return { entry: { category: "tools", slug: "tools-read-3" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-3");
  });
  it("readEntry accepts tools/tools-read-4", async () => {
    const entry = await readEntry("tools", "tools-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-4.json");
        return { entry: { category: "tools", slug: "tools-read-4" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-4");
  });
  it("readEntry accepts tools/tools-read-5", async () => {
    const entry = await readEntry("tools", "tools-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-5.json");
        return { entry: { category: "tools", slug: "tools-read-5" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-5");
  });
  it("readEntry accepts tools/tools-read-6", async () => {
    const entry = await readEntry("tools", "tools-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-6.json");
        return { entry: { category: "tools", slug: "tools-read-6" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-6");
  });
  it("readEntry accepts tools/tools-read-7", async () => {
    const entry = await readEntry("tools", "tools-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-7.json");
        return { entry: { category: "tools", slug: "tools-read-7" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-7");
  });
  it("readEntry accepts tools/tools-read-8", async () => {
    const entry = await readEntry("tools", "tools-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-8.json");
        return { entry: { category: "tools", slug: "tools-read-8" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-8");
  });
  it("readEntry accepts tools/tools-read-9", async () => {
    const entry = await readEntry("tools", "tools-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-9.json");
        return { entry: { category: "tools", slug: "tools-read-9" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-9");
  });
  it("readEntry accepts tools/tools-read-10", async () => {
    const entry = await readEntry("tools", "tools-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-10.json");
        return { entry: { category: "tools", slug: "tools-read-10" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-10");
  });
  it("readEntry accepts tools/tools-read-11", async () => {
    const entry = await readEntry("tools", "tools-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/tools/tools-read-11.json");
        return { entry: { category: "tools", slug: "tools-read-11" } };
      },
    });
    expect(entry?.slug).toBe("tools-read-11");
  });
  it("readEntry accepts skills/skills-read-0", async () => {
    const entry = await readEntry("skills", "skills-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-0.json");
        return { entry: { category: "skills", slug: "skills-read-0" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-0");
  });
  it("readEntry accepts skills/skills-read-1", async () => {
    const entry = await readEntry("skills", "skills-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-1.json");
        return { entry: { category: "skills", slug: "skills-read-1" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-1");
  });
  it("readEntry accepts skills/skills-read-2", async () => {
    const entry = await readEntry("skills", "skills-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-2.json");
        return { entry: { category: "skills", slug: "skills-read-2" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-2");
  });
  it("readEntry accepts skills/skills-read-3", async () => {
    const entry = await readEntry("skills", "skills-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-3.json");
        return { entry: { category: "skills", slug: "skills-read-3" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-3");
  });
  it("readEntry accepts skills/skills-read-4", async () => {
    const entry = await readEntry("skills", "skills-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-4.json");
        return { entry: { category: "skills", slug: "skills-read-4" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-4");
  });
  it("readEntry accepts skills/skills-read-5", async () => {
    const entry = await readEntry("skills", "skills-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-5.json");
        return { entry: { category: "skills", slug: "skills-read-5" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-5");
  });
  it("readEntry accepts skills/skills-read-6", async () => {
    const entry = await readEntry("skills", "skills-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-6.json");
        return { entry: { category: "skills", slug: "skills-read-6" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-6");
  });
  it("readEntry accepts skills/skills-read-7", async () => {
    const entry = await readEntry("skills", "skills-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-7.json");
        return { entry: { category: "skills", slug: "skills-read-7" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-7");
  });
  it("readEntry accepts skills/skills-read-8", async () => {
    const entry = await readEntry("skills", "skills-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-8.json");
        return { entry: { category: "skills", slug: "skills-read-8" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-8");
  });
  it("readEntry accepts skills/skills-read-9", async () => {
    const entry = await readEntry("skills", "skills-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-9.json");
        return { entry: { category: "skills", slug: "skills-read-9" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-9");
  });
  it("readEntry accepts skills/skills-read-10", async () => {
    const entry = await readEntry("skills", "skills-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-10.json");
        return { entry: { category: "skills", slug: "skills-read-10" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-10");
  });
  it("readEntry accepts skills/skills-read-11", async () => {
    const entry = await readEntry("skills", "skills-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/skills/skills-read-11.json");
        return { entry: { category: "skills", slug: "skills-read-11" } };
      },
    });
    expect(entry?.slug).toBe("skills-read-11");
  });
  it("readEntry accepts rules/rules-read-0", async () => {
    const entry = await readEntry("rules", "rules-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-0.json");
        return { entry: { category: "rules", slug: "rules-read-0" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-0");
  });
  it("readEntry accepts rules/rules-read-1", async () => {
    const entry = await readEntry("rules", "rules-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-1.json");
        return { entry: { category: "rules", slug: "rules-read-1" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-1");
  });
  it("readEntry accepts rules/rules-read-2", async () => {
    const entry = await readEntry("rules", "rules-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-2.json");
        return { entry: { category: "rules", slug: "rules-read-2" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-2");
  });
  it("readEntry accepts rules/rules-read-3", async () => {
    const entry = await readEntry("rules", "rules-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-3.json");
        return { entry: { category: "rules", slug: "rules-read-3" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-3");
  });
  it("readEntry accepts rules/rules-read-4", async () => {
    const entry = await readEntry("rules", "rules-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-4.json");
        return { entry: { category: "rules", slug: "rules-read-4" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-4");
  });
  it("readEntry accepts rules/rules-read-5", async () => {
    const entry = await readEntry("rules", "rules-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-5.json");
        return { entry: { category: "rules", slug: "rules-read-5" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-5");
  });
  it("readEntry accepts rules/rules-read-6", async () => {
    const entry = await readEntry("rules", "rules-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-6.json");
        return { entry: { category: "rules", slug: "rules-read-6" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-6");
  });
  it("readEntry accepts rules/rules-read-7", async () => {
    const entry = await readEntry("rules", "rules-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-7.json");
        return { entry: { category: "rules", slug: "rules-read-7" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-7");
  });
  it("readEntry accepts rules/rules-read-8", async () => {
    const entry = await readEntry("rules", "rules-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-8.json");
        return { entry: { category: "rules", slug: "rules-read-8" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-8");
  });
  it("readEntry accepts rules/rules-read-9", async () => {
    const entry = await readEntry("rules", "rules-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-9.json");
        return { entry: { category: "rules", slug: "rules-read-9" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-9");
  });
  it("readEntry accepts rules/rules-read-10", async () => {
    const entry = await readEntry("rules", "rules-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-10.json");
        return { entry: { category: "rules", slug: "rules-read-10" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-10");
  });
  it("readEntry accepts rules/rules-read-11", async () => {
    const entry = await readEntry("rules", "rules-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/rules/rules-read-11.json");
        return { entry: { category: "rules", slug: "rules-read-11" } };
      },
    });
    expect(entry?.slug).toBe("rules-read-11");
  });
  it("readEntry accepts commands/commands-read-0", async () => {
    const entry = await readEntry("commands", "commands-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-0.json");
        return { entry: { category: "commands", slug: "commands-read-0" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-0");
  });
  it("readEntry accepts commands/commands-read-1", async () => {
    const entry = await readEntry("commands", "commands-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-1.json");
        return { entry: { category: "commands", slug: "commands-read-1" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-1");
  });
  it("readEntry accepts commands/commands-read-2", async () => {
    const entry = await readEntry("commands", "commands-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-2.json");
        return { entry: { category: "commands", slug: "commands-read-2" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-2");
  });
  it("readEntry accepts commands/commands-read-3", async () => {
    const entry = await readEntry("commands", "commands-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-3.json");
        return { entry: { category: "commands", slug: "commands-read-3" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-3");
  });
  it("readEntry accepts commands/commands-read-4", async () => {
    const entry = await readEntry("commands", "commands-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-4.json");
        return { entry: { category: "commands", slug: "commands-read-4" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-4");
  });
  it("readEntry accepts commands/commands-read-5", async () => {
    const entry = await readEntry("commands", "commands-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-5.json");
        return { entry: { category: "commands", slug: "commands-read-5" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-5");
  });
  it("readEntry accepts commands/commands-read-6", async () => {
    const entry = await readEntry("commands", "commands-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-6.json");
        return { entry: { category: "commands", slug: "commands-read-6" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-6");
  });
  it("readEntry accepts commands/commands-read-7", async () => {
    const entry = await readEntry("commands", "commands-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-7.json");
        return { entry: { category: "commands", slug: "commands-read-7" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-7");
  });
  it("readEntry accepts commands/commands-read-8", async () => {
    const entry = await readEntry("commands", "commands-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-8.json");
        return { entry: { category: "commands", slug: "commands-read-8" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-8");
  });
  it("readEntry accepts commands/commands-read-9", async () => {
    const entry = await readEntry("commands", "commands-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-9.json");
        return { entry: { category: "commands", slug: "commands-read-9" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-9");
  });
  it("readEntry accepts commands/commands-read-10", async () => {
    const entry = await readEntry("commands", "commands-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-10.json");
        return { entry: { category: "commands", slug: "commands-read-10" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-10");
  });
  it("readEntry accepts commands/commands-read-11", async () => {
    const entry = await readEntry("commands", "commands-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/commands/commands-read-11.json");
        return { entry: { category: "commands", slug: "commands-read-11" } };
      },
    });
    expect(entry?.slug).toBe("commands-read-11");
  });
  it("readEntry accepts hooks/hooks-read-0", async () => {
    const entry = await readEntry("hooks", "hooks-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-0.json");
        return { entry: { category: "hooks", slug: "hooks-read-0" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-0");
  });
  it("readEntry accepts hooks/hooks-read-1", async () => {
    const entry = await readEntry("hooks", "hooks-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-1.json");
        return { entry: { category: "hooks", slug: "hooks-read-1" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-1");
  });
  it("readEntry accepts hooks/hooks-read-2", async () => {
    const entry = await readEntry("hooks", "hooks-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-2.json");
        return { entry: { category: "hooks", slug: "hooks-read-2" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-2");
  });
  it("readEntry accepts hooks/hooks-read-3", async () => {
    const entry = await readEntry("hooks", "hooks-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-3.json");
        return { entry: { category: "hooks", slug: "hooks-read-3" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-3");
  });
  it("readEntry accepts hooks/hooks-read-4", async () => {
    const entry = await readEntry("hooks", "hooks-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-4.json");
        return { entry: { category: "hooks", slug: "hooks-read-4" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-4");
  });
  it("readEntry accepts hooks/hooks-read-5", async () => {
    const entry = await readEntry("hooks", "hooks-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-5.json");
        return { entry: { category: "hooks", slug: "hooks-read-5" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-5");
  });
  it("readEntry accepts hooks/hooks-read-6", async () => {
    const entry = await readEntry("hooks", "hooks-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-6.json");
        return { entry: { category: "hooks", slug: "hooks-read-6" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-6");
  });
  it("readEntry accepts hooks/hooks-read-7", async () => {
    const entry = await readEntry("hooks", "hooks-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-7.json");
        return { entry: { category: "hooks", slug: "hooks-read-7" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-7");
  });
  it("readEntry accepts hooks/hooks-read-8", async () => {
    const entry = await readEntry("hooks", "hooks-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-8.json");
        return { entry: { category: "hooks", slug: "hooks-read-8" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-8");
  });
  it("readEntry accepts hooks/hooks-read-9", async () => {
    const entry = await readEntry("hooks", "hooks-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-9.json");
        return { entry: { category: "hooks", slug: "hooks-read-9" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-9");
  });
  it("readEntry accepts hooks/hooks-read-10", async () => {
    const entry = await readEntry("hooks", "hooks-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-10.json");
        return { entry: { category: "hooks", slug: "hooks-read-10" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-10");
  });
  it("readEntry accepts hooks/hooks-read-11", async () => {
    const entry = await readEntry("hooks", "hooks-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/hooks/hooks-read-11.json");
        return { entry: { category: "hooks", slug: "hooks-read-11" } };
      },
    });
    expect(entry?.slug).toBe("hooks-read-11");
  });
  it("readEntry accepts guides/guides-read-0", async () => {
    const entry = await readEntry("guides", "guides-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-0.json");
        return { entry: { category: "guides", slug: "guides-read-0" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-0");
  });
  it("readEntry accepts guides/guides-read-1", async () => {
    const entry = await readEntry("guides", "guides-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-1.json");
        return { entry: { category: "guides", slug: "guides-read-1" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-1");
  });
  it("readEntry accepts guides/guides-read-2", async () => {
    const entry = await readEntry("guides", "guides-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-2.json");
        return { entry: { category: "guides", slug: "guides-read-2" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-2");
  });
  it("readEntry accepts guides/guides-read-3", async () => {
    const entry = await readEntry("guides", "guides-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-3.json");
        return { entry: { category: "guides", slug: "guides-read-3" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-3");
  });
  it("readEntry accepts guides/guides-read-4", async () => {
    const entry = await readEntry("guides", "guides-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-4.json");
        return { entry: { category: "guides", slug: "guides-read-4" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-4");
  });
  it("readEntry accepts guides/guides-read-5", async () => {
    const entry = await readEntry("guides", "guides-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-5.json");
        return { entry: { category: "guides", slug: "guides-read-5" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-5");
  });
  it("readEntry accepts guides/guides-read-6", async () => {
    const entry = await readEntry("guides", "guides-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-6.json");
        return { entry: { category: "guides", slug: "guides-read-6" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-6");
  });
  it("readEntry accepts guides/guides-read-7", async () => {
    const entry = await readEntry("guides", "guides-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-7.json");
        return { entry: { category: "guides", slug: "guides-read-7" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-7");
  });
  it("readEntry accepts guides/guides-read-8", async () => {
    const entry = await readEntry("guides", "guides-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-8.json");
        return { entry: { category: "guides", slug: "guides-read-8" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-8");
  });
  it("readEntry accepts guides/guides-read-9", async () => {
    const entry = await readEntry("guides", "guides-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-9.json");
        return { entry: { category: "guides", slug: "guides-read-9" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-9");
  });
  it("readEntry accepts guides/guides-read-10", async () => {
    const entry = await readEntry("guides", "guides-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-10.json");
        return { entry: { category: "guides", slug: "guides-read-10" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-10");
  });
  it("readEntry accepts guides/guides-read-11", async () => {
    const entry = await readEntry("guides", "guides-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe("entries/guides/guides-read-11.json");
        return { entry: { category: "guides", slug: "guides-read-11" } };
      },
    });
    expect(entry?.slug).toBe("guides-read-11");
  });
  it("readEntry accepts collections/collections-read-0", async () => {
    const entry = await readEntry("collections", "collections-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-0.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-0" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-0");
  });
  it("readEntry accepts collections/collections-read-1", async () => {
    const entry = await readEntry("collections", "collections-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-1.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-1" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-1");
  });
  it("readEntry accepts collections/collections-read-2", async () => {
    const entry = await readEntry("collections", "collections-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-2.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-2" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-2");
  });
  it("readEntry accepts collections/collections-read-3", async () => {
    const entry = await readEntry("collections", "collections-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-3.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-3" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-3");
  });
  it("readEntry accepts collections/collections-read-4", async () => {
    const entry = await readEntry("collections", "collections-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-4.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-4" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-4");
  });
  it("readEntry accepts collections/collections-read-5", async () => {
    const entry = await readEntry("collections", "collections-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-5.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-5" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-5");
  });
  it("readEntry accepts collections/collections-read-6", async () => {
    const entry = await readEntry("collections", "collections-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-6.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-6" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-6");
  });
  it("readEntry accepts collections/collections-read-7", async () => {
    const entry = await readEntry("collections", "collections-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-7.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-7" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-7");
  });
  it("readEntry accepts collections/collections-read-8", async () => {
    const entry = await readEntry("collections", "collections-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-8.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-8" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-8");
  });
  it("readEntry accepts collections/collections-read-9", async () => {
    const entry = await readEntry("collections", "collections-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-9.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-9" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-9");
  });
  it("readEntry accepts collections/collections-read-10", async () => {
    const entry = await readEntry("collections", "collections-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-10.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-10" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-10");
  });
  it("readEntry accepts collections/collections-read-11", async () => {
    const entry = await readEntry("collections", "collections-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/collections/collections-read-11.json",
        );
        return {
          entry: { category: "collections", slug: "collections-read-11" },
        };
      },
    });
    expect(entry?.slug).toBe("collections-read-11");
  });
  it("readEntry accepts statuslines/statuslines-read-0", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-0", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-0.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-0" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-0");
  });
  it("readEntry accepts statuslines/statuslines-read-1", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-1", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-1.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-1" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-1");
  });
  it("readEntry accepts statuslines/statuslines-read-2", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-2", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-2.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-2" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-2");
  });
  it("readEntry accepts statuslines/statuslines-read-3", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-3", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-3.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-3" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-3");
  });
  it("readEntry accepts statuslines/statuslines-read-4", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-4", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-4.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-4" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-4");
  });
  it("readEntry accepts statuslines/statuslines-read-5", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-5", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-5.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-5" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-5");
  });
  it("readEntry accepts statuslines/statuslines-read-6", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-6", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-6.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-6" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-6");
  });
  it("readEntry accepts statuslines/statuslines-read-7", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-7", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-7.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-7" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-7");
  });
  it("readEntry accepts statuslines/statuslines-read-8", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-8", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-8.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-8" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-8");
  });
  it("readEntry accepts statuslines/statuslines-read-9", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-9", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-9.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-9" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-9");
  });
  it("readEntry accepts statuslines/statuslines-read-10", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-10", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-10.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-10" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-10");
  });
  it("readEntry accepts statuslines/statuslines-read-11", async () => {
    const entry = await readEntry("statuslines", "statuslines-read-11", {
      readJsonArtifact: async (relativePath) => {
        expect(relativePath).toBe(
          "entries/statuslines/statuslines-read-11.json",
        );
        return {
          entry: { category: "statuslines", slug: "statuslines-read-11" },
        };
      },
    });
    expect(entry?.slug).toBe("statuslines-read-11");
  });
  it("readEntry rejects unsafe slug empty", async () => {
    expect(await readEntry("mcp", "", {})).toBeNull();
    expect(await readEntry("", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug .", async () => {
    expect(await readEntry("mcp", ".", {})).toBeNull();
    expect(await readEntry(".", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug ..", async () => {
    expect(await readEntry("mcp", "..", {})).toBeNull();
    expect(await readEntry("..", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug foo/../bar", async () => {
    expect(await readEntry("mcp", "foo/../bar", {})).toBeNull();
    expect(await readEntry("foo/../bar", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug ../secret", async () => {
    expect(await readEntry("mcp", "../secret", {})).toBeNull();
    expect(await readEntry("../secret", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug foo/..", async () => {
    expect(await readEntry("mcp", "foo/..", {})).toBeNull();
    expect(await readEntry("foo/..", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug foo/./bar", async () => {
    expect(await readEntry("mcp", "foo/./bar", {})).toBeNull();
    expect(await readEntry("foo/./bar", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug foo//bar", async () => {
    expect(await readEntry("mcp", "foo//bar", {})).toBeNull();
    expect(await readEntry("foo//bar", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug /absolute", async () => {
    expect(await readEntry("mcp", "/absolute", {})).toBeNull();
    expect(await readEntry("/absolute", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug UPPER", async () => {
    expect(await readEntry("mcp", "UPPER", {})).toBeNull();
    expect(await readEntry("UPPER", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug under_score", async () => {
    expect(await readEntry("mcp", "under_score", {})).toBeNull();
    expect(await readEntry("under_score", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug dot.name", async () => {
    expect(await readEntry("mcp", "dot.name", {})).toBeNull();
    expect(await readEntry("dot.name", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug space name", async () => {
    expect(await readEntry("mcp", "space name", {})).toBeNull();
    expect(await readEntry("space name", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug tab?name", async () => {
    expect(await readEntry("mcp", "tab\tname", {})).toBeNull();
    expect(await readEntry("tab\tname", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug emoji-??", async () => {
    expect(await readEntry("mcp", "emoji-🔥", {})).toBeNull();
    expect(await readEntry("emoji-🔥", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug percent%20", async () => {
    expect(await readEntry("mcp", "percent%20", {})).toBeNull();
    expect(await readEntry("percent%20", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug plus+sign", async () => {
    expect(await readEntry("mcp", "plus+sign", {})).toBeNull();
    expect(await readEntry("plus+sign", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug at@sign", async () => {
    expect(await readEntry("mcp", "at@sign", {})).toBeNull();
    expect(await readEntry("at@sign", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug colon:part", async () => {
    expect(await readEntry("mcp", "colon:part", {})).toBeNull();
    expect(await readEntry("colon:part", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug semi;colon", async () => {
    expect(await readEntry("mcp", "semi;colon", {})).toBeNull();
    expect(await readEntry("semi;colon", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug comma,part", async () => {
    expect(await readEntry("mcp", "comma,part", {})).toBeNull();
    expect(await readEntry("comma,part", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug question?mark", async () => {
    expect(await readEntry("mcp", "question?mark", {})).toBeNull();
    expect(await readEntry("question?mark", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug star*wild", async () => {
    expect(await readEntry("mcp", "star*wild", {})).toBeNull();
    expect(await readEntry("star*wild", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug paren(test)", async () => {
    expect(await readEntry("mcp", "paren(test)", {})).toBeNull();
    expect(await readEntry("paren(test)", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug bracket[test]", async () => {
    expect(await readEntry("mcp", "bracket[test]", {})).toBeNull();
    expect(await readEntry("bracket[test]", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug brace{test}", async () => {
    expect(await readEntry("mcp", "brace{test}", {})).toBeNull();
    expect(await readEntry("brace{test}", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug quote'test", async () => {
    expect(await readEntry("mcp", "quote'test", {})).toBeNull();
    expect(await readEntry("quote'test", "demo", {})).toBeNull();
  });
  it('readEntry rejects unsafe slug quote"test', async () => {
    expect(await readEntry("mcp", 'quote"test', {})).toBeNull();
    expect(await readEntry('quote"test', "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug back\\slash", async () => {
    expect(await readEntry("mcp", "back\\slash", {})).toBeNull();
    expect(await readEntry("back\\slash", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug pipe|test", async () => {
    expect(await readEntry("mcp", "pipe|test", {})).toBeNull();
    expect(await readEntry("pipe|test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug tilde~test", async () => {
    expect(await readEntry("mcp", "tilde~test", {})).toBeNull();
    expect(await readEntry("tilde~test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug caret^test", async () => {
    expect(await readEntry("mcp", "caret^test", {})).toBeNull();
    expect(await readEntry("caret^test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug dollar$test", async () => {
    expect(await readEntry("mcp", "dollar$test", {})).toBeNull();
    expect(await readEntry("dollar$test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug hash#test", async () => {
    expect(await readEntry("mcp", "hash#test", {})).toBeNull();
    expect(await readEntry("hash#test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug ampersand&test", async () => {
    expect(await readEntry("mcp", "ampersand&test", {})).toBeNull();
    expect(await readEntry("ampersand&test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug equals=test", async () => {
    expect(await readEntry("mcp", "equals=test", {})).toBeNull();
    expect(await readEntry("equals=test", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug null\0byte", async () => {
    expect(await readEntry("mcp", "null\u0000byte", {})).toBeNull();
    expect(await readEntry("null\u0000byte", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug newline\npart", async () => {
    expect(await readEntry("mcp", "newline\npart", {})).toBeNull();
    expect(await readEntry("newline\npart", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug carriage\rpart", async () => {
    expect(await readEntry("mcp", "carriage\rpart", {})).toBeNull();
    expect(await readEntry("carriage\rpart", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug unicode-caf?", async () => {
    expect(await readEntry("mcp", "unicode-café", {})).toBeNull();
    expect(await readEntry("unicode-café", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug cyrillic-????", async () => {
    expect(await readEntry("mcp", "cyrillic-тест", {})).toBeNull();
    expect(await readEntry("cyrillic-тест", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug chinese-??", async () => {
    expect(await readEntry("mcp", "chinese-测试", {})).toBeNull();
    expect(await readEntry("chinese-测试", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug japanese-???", async () => {
    expect(await readEntry("mcp", "japanese-テスト", {})).toBeNull();
    expect(await readEntry("japanese-テスト", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug arabic-??????", async () => {
    expect(await readEntry("mcp", "arabic-اختبار", {})).toBeNull();
    expect(await readEntry("arabic-اختبار", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug hebrew-?????", async () => {
    expect(await readEntry("mcp", "hebrew-בדיקה", {})).toBeNull();
    expect(await readEntry("hebrew-בדיקה", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug thai-???ob", async () => {
    expect(await readEntry("mcp", "thai-ทดสob", {})).toBeNull();
    expect(await readEntry("thai-ทดสob", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug korean-???", async () => {
    expect(await readEntry("mcp", "korean-테스트", {})).toBeNull();
    expect(await readEntry("korean-테스트", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug greek-??????", async () => {
    expect(await readEntry("mcp", "greek-δοκιμή", {})).toBeNull();
    expect(await readEntry("greek-δοκιμή", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug mixed-Abc123", async () => {
    expect(await readEntry("mcp", "mixed-Abc123", {})).toBeNull();
    expect(await readEntry("mixed-Abc123", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug 123numeric", async () => {
    expect(await readEntry("mcp", "123numeric", {})).toBeNull();
    expect(await readEntry("123numeric", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug -leading-dash", async () => {
    expect(await readEntry("mcp", "-leading-dash", {})).toBeNull();
    expect(await readEntry("-leading-dash", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug trailing-dash-", async () => {
    expect(await readEntry("mcp", "trailing-dash-", {})).toBeNull();
    expect(await readEntry("trailing-dash-", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug double--dash", async () => {
    expect(await readEntry("mcp", "double--dash", {})).toBeNull();
    expect(await readEntry("double--dash", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug triple---dash", async () => {
    expect(await readEntry("mcp", "triple---dash", {})).toBeNull();
    expect(await readEntry("triple---dash", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", async () => {
    expect(
      await readEntry(
        "mcp",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        {},
      ),
    ).toBeNull();
    expect(
      await readEntry(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "demo",
        {},
      ),
    ).toBeNull();
  });
  it("readEntry rejects unsafe slug valid-start-invalid-end!", async () => {
    expect(await readEntry("mcp", "valid-start-invalid-end!", {})).toBeNull();
    expect(await readEntry("valid-start-invalid-end!", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug !invalid-start-valid-end", async () => {
    expect(await readEntry("mcp", "!invalid-start-valid-end", {})).toBeNull();
    expect(await readEntry("!invalid-start-valid-end", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug path/with/slash", async () => {
    expect(await readEntry("mcp", "path/with/slash", {})).toBeNull();
    expect(await readEntry("path/with/slash", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug path\\with\\backslash", async () => {
    expect(await readEntry("mcp", "path\\with\\backslash", {})).toBeNull();
    expect(await readEntry("path\\with\\backslash", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug null", async () => {
    expect(await readEntry("mcp", "null", {})).toBeNull();
    expect(await readEntry("null", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug undefined", async () => {
    expect(await readEntry("mcp", "undefined", {})).toBeNull();
    expect(await readEntry("undefined", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug NaN", async () => {
    expect(await readEntry("mcp", "NaN", {})).toBeNull();
    expect(await readEntry("NaN", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug true", async () => {
    expect(await readEntry("mcp", "true", {})).toBeNull();
    expect(await readEntry("true", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug false", async () => {
    expect(await readEntry("mcp", "false", {})).toBeNull();
    expect(await readEntry("false", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug 0", async () => {
    expect(await readEntry("mcp", "0", {})).toBeNull();
    expect(await readEntry("0", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug 1", async () => {
    expect(await readEntry("mcp", "1", {})).toBeNull();
    expect(await readEntry("1", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug 42", async () => {
    expect(await readEntry("mcp", "42", {})).toBeNull();
    expect(await readEntry("42", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug -1", async () => {
    expect(await readEntry("mcp", "-1", {})).toBeNull();
    expect(await readEntry("-1", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug 3.14", async () => {
    expect(await readEntry("mcp", "3.14", {})).toBeNull();
    expect(await readEntry("3.14", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug 1e10", async () => {
    expect(await readEntry("mcp", "1e10", {})).toBeNull();
    expect(await readEntry("1e10", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug Infinity", async () => {
    expect(await readEntry("mcp", "Infinity", {})).toBeNull();
    expect(await readEntry("Infinity", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug -Infinity", async () => {
    expect(await readEntry("mcp", "-Infinity", {})).toBeNull();
    expect(await readEntry("-Infinity", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug []", async () => {
    expect(await readEntry("mcp", "[]", {})).toBeNull();
    expect(await readEntry("[]", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug {}", async () => {
    expect(await readEntry("mcp", "{}", {})).toBeNull();
    expect(await readEntry("{}", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug []foo", async () => {
    expect(await readEntry("mcp", "[]foo", {})).toBeNull();
    expect(await readEntry("[]foo", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug foo[]", async () => {
    expect(await readEntry("mcp", "foo[]", {})).toBeNull();
    expect(await readEntry("foo[]", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug <script>", async () => {
    expect(await readEntry("mcp", "<script>", {})).toBeNull();
    expect(await readEntry("<script>", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug </script>", async () => {
    expect(await readEntry("mcp", "</script>", {})).toBeNull();
    expect(await readEntry("</script>", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug javascript:alert(1)", async () => {
    expect(await readEntry("mcp", "javascript:alert(1)", {})).toBeNull();
    expect(await readEntry("javascript:alert(1)", "demo", {})).toBeNull();
  });
  it("readEntry rejects unsafe slug data:text/html", async () => {
    expect(await readEntry("mcp", "data:text/html", {})).toBeNull();
    expect(await readEntry("data:text/html", "demo", {})).toBeNull();
  });
});

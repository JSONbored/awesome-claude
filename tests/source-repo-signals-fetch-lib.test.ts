import { describe, expect, it } from "vitest";

import {
  buildGitHubRepoApiUrl,
  buildShieldsStarsUrl,
  fetchGitHubSourceSignal,
  parseGitHubRepoApiPayload,
  parseGitHubRepoKey,
  parseShieldsStarsPayload,
} from "../apps/web/src/lib/source-repo-signals-fetch-lib";

describe("source-repo-signals-fetch-lib URL builders", () => {
  it("builds GitHub API URL", () => {
    expect(buildGitHubRepoApiUrl("openai", "whisper")).toBe(
      "https://api.github.com/repos/openai/whisper",
    );
  });
  it("builds shields stars URL", () => {
    expect(buildShieldsStarsUrl("openai", "whisper")).toBe(
      "https://img.shields.io/github/stars/openai/whisper.json",
    );
  });
  it("URL builders matrix 0", () => {
    expect(buildGitHubRepoApiUrl("org-0", "repo-0")).toContain("org-0/repo-0");
    expect(buildShieldsStarsUrl("org-0", "repo-0")).toContain("org-0/repo-0");
  });
  it("URL builders matrix 1", () => {
    expect(buildGitHubRepoApiUrl("org-1", "repo-1")).toContain("org-1/repo-1");
    expect(buildShieldsStarsUrl("org-1", "repo-1")).toContain("org-1/repo-1");
  });
  it("URL builders matrix 2", () => {
    expect(buildGitHubRepoApiUrl("org-2", "repo-2")).toContain("org-2/repo-2");
    expect(buildShieldsStarsUrl("org-2", "repo-2")).toContain("org-2/repo-2");
  });
  it("URL builders matrix 3", () => {
    expect(buildGitHubRepoApiUrl("org-3", "repo-3")).toContain("org-3/repo-3");
    expect(buildShieldsStarsUrl("org-3", "repo-3")).toContain("org-3/repo-3");
  });
  it("URL builders matrix 4", () => {
    expect(buildGitHubRepoApiUrl("org-4", "repo-4")).toContain("org-4/repo-4");
    expect(buildShieldsStarsUrl("org-4", "repo-4")).toContain("org-4/repo-4");
  });
  it("URL builders matrix 5", () => {
    expect(buildGitHubRepoApiUrl("org-5", "repo-5")).toContain("org-5/repo-5");
    expect(buildShieldsStarsUrl("org-5", "repo-5")).toContain("org-5/repo-5");
  });
  it("URL builders matrix 6", () => {
    expect(buildGitHubRepoApiUrl("org-6", "repo-6")).toContain("org-6/repo-6");
    expect(buildShieldsStarsUrl("org-6", "repo-6")).toContain("org-6/repo-6");
  });
  it("URL builders matrix 7", () => {
    expect(buildGitHubRepoApiUrl("org-7", "repo-7")).toContain("org-7/repo-7");
    expect(buildShieldsStarsUrl("org-7", "repo-7")).toContain("org-7/repo-7");
  });
  it("URL builders matrix 8", () => {
    expect(buildGitHubRepoApiUrl("org-8", "repo-8")).toContain("org-8/repo-8");
    expect(buildShieldsStarsUrl("org-8", "repo-8")).toContain("org-8/repo-8");
  });
  it("URL builders matrix 9", () => {
    expect(buildGitHubRepoApiUrl("org-9", "repo-9")).toContain("org-9/repo-9");
    expect(buildShieldsStarsUrl("org-9", "repo-9")).toContain("org-9/repo-9");
  });
  it("URL builders matrix 10", () => {
    expect(buildGitHubRepoApiUrl("org-10", "repo-10")).toContain(
      "org-10/repo-10",
    );
    expect(buildShieldsStarsUrl("org-10", "repo-10")).toContain(
      "org-10/repo-10",
    );
  });
  it("URL builders matrix 11", () => {
    expect(buildGitHubRepoApiUrl("org-11", "repo-11")).toContain(
      "org-11/repo-11",
    );
    expect(buildShieldsStarsUrl("org-11", "repo-11")).toContain(
      "org-11/repo-11",
    );
  });
  it("URL builders matrix 12", () => {
    expect(buildGitHubRepoApiUrl("org-12", "repo-12")).toContain(
      "org-12/repo-12",
    );
    expect(buildShieldsStarsUrl("org-12", "repo-12")).toContain(
      "org-12/repo-12",
    );
  });
  it("URL builders matrix 13", () => {
    expect(buildGitHubRepoApiUrl("org-13", "repo-13")).toContain(
      "org-13/repo-13",
    );
    expect(buildShieldsStarsUrl("org-13", "repo-13")).toContain(
      "org-13/repo-13",
    );
  });
  it("URL builders matrix 14", () => {
    expect(buildGitHubRepoApiUrl("org-14", "repo-14")).toContain(
      "org-14/repo-14",
    );
    expect(buildShieldsStarsUrl("org-14", "repo-14")).toContain(
      "org-14/repo-14",
    );
  });
  it("URL builders matrix 15", () => {
    expect(buildGitHubRepoApiUrl("org-15", "repo-15")).toContain(
      "org-15/repo-15",
    );
    expect(buildShieldsStarsUrl("org-15", "repo-15")).toContain(
      "org-15/repo-15",
    );
  });
  it("URL builders matrix 16", () => {
    expect(buildGitHubRepoApiUrl("org-16", "repo-16")).toContain(
      "org-16/repo-16",
    );
    expect(buildShieldsStarsUrl("org-16", "repo-16")).toContain(
      "org-16/repo-16",
    );
  });
  it("URL builders matrix 17", () => {
    expect(buildGitHubRepoApiUrl("org-17", "repo-17")).toContain(
      "org-17/repo-17",
    );
    expect(buildShieldsStarsUrl("org-17", "repo-17")).toContain(
      "org-17/repo-17",
    );
  });
  it("URL builders matrix 18", () => {
    expect(buildGitHubRepoApiUrl("org-18", "repo-18")).toContain(
      "org-18/repo-18",
    );
    expect(buildShieldsStarsUrl("org-18", "repo-18")).toContain(
      "org-18/repo-18",
    );
  });
  it("URL builders matrix 19", () => {
    expect(buildGitHubRepoApiUrl("org-19", "repo-19")).toContain(
      "org-19/repo-19",
    );
    expect(buildShieldsStarsUrl("org-19", "repo-19")).toContain(
      "org-19/repo-19",
    );
  });
  it("URL builders matrix 20", () => {
    expect(buildGitHubRepoApiUrl("org-20", "repo-20")).toContain(
      "org-20/repo-20",
    );
    expect(buildShieldsStarsUrl("org-20", "repo-20")).toContain(
      "org-20/repo-20",
    );
  });
  it("URL builders matrix 21", () => {
    expect(buildGitHubRepoApiUrl("org-21", "repo-21")).toContain(
      "org-21/repo-21",
    );
    expect(buildShieldsStarsUrl("org-21", "repo-21")).toContain(
      "org-21/repo-21",
    );
  });
  it("URL builders matrix 22", () => {
    expect(buildGitHubRepoApiUrl("org-22", "repo-22")).toContain(
      "org-22/repo-22",
    );
    expect(buildShieldsStarsUrl("org-22", "repo-22")).toContain(
      "org-22/repo-22",
    );
  });
  it("URL builders matrix 23", () => {
    expect(buildGitHubRepoApiUrl("org-23", "repo-23")).toContain(
      "org-23/repo-23",
    );
    expect(buildShieldsStarsUrl("org-23", "repo-23")).toContain(
      "org-23/repo-23",
    );
  });
  it("URL builders matrix 24", () => {
    expect(buildGitHubRepoApiUrl("org-24", "repo-24")).toContain(
      "org-24/repo-24",
    );
    expect(buildShieldsStarsUrl("org-24", "repo-24")).toContain(
      "org-24/repo-24",
    );
  });
  it("URL builders matrix 25", () => {
    expect(buildGitHubRepoApiUrl("org-25", "repo-25")).toContain(
      "org-25/repo-25",
    );
    expect(buildShieldsStarsUrl("org-25", "repo-25")).toContain(
      "org-25/repo-25",
    );
  });
  it("URL builders matrix 26", () => {
    expect(buildGitHubRepoApiUrl("org-26", "repo-26")).toContain(
      "org-26/repo-26",
    );
    expect(buildShieldsStarsUrl("org-26", "repo-26")).toContain(
      "org-26/repo-26",
    );
  });
  it("URL builders matrix 27", () => {
    expect(buildGitHubRepoApiUrl("org-27", "repo-27")).toContain(
      "org-27/repo-27",
    );
    expect(buildShieldsStarsUrl("org-27", "repo-27")).toContain(
      "org-27/repo-27",
    );
  });
  it("URL builders matrix 28", () => {
    expect(buildGitHubRepoApiUrl("org-28", "repo-28")).toContain(
      "org-28/repo-28",
    );
    expect(buildShieldsStarsUrl("org-28", "repo-28")).toContain(
      "org-28/repo-28",
    );
  });
  it("URL builders matrix 29", () => {
    expect(buildGitHubRepoApiUrl("org-29", "repo-29")).toContain(
      "org-29/repo-29",
    );
    expect(buildShieldsStarsUrl("org-29", "repo-29")).toContain(
      "org-29/repo-29",
    );
  });
  it("URL builders matrix 30", () => {
    expect(buildGitHubRepoApiUrl("org-30", "repo-30")).toContain(
      "org-30/repo-30",
    );
    expect(buildShieldsStarsUrl("org-30", "repo-30")).toContain(
      "org-30/repo-30",
    );
  });
  it("URL builders matrix 31", () => {
    expect(buildGitHubRepoApiUrl("org-31", "repo-31")).toContain(
      "org-31/repo-31",
    );
    expect(buildShieldsStarsUrl("org-31", "repo-31")).toContain(
      "org-31/repo-31",
    );
  });
  it("URL builders matrix 32", () => {
    expect(buildGitHubRepoApiUrl("org-32", "repo-32")).toContain(
      "org-32/repo-32",
    );
    expect(buildShieldsStarsUrl("org-32", "repo-32")).toContain(
      "org-32/repo-32",
    );
  });
  it("URL builders matrix 33", () => {
    expect(buildGitHubRepoApiUrl("org-33", "repo-33")).toContain(
      "org-33/repo-33",
    );
    expect(buildShieldsStarsUrl("org-33", "repo-33")).toContain(
      "org-33/repo-33",
    );
  });
  it("URL builders matrix 34", () => {
    expect(buildGitHubRepoApiUrl("org-34", "repo-34")).toContain(
      "org-34/repo-34",
    );
    expect(buildShieldsStarsUrl("org-34", "repo-34")).toContain(
      "org-34/repo-34",
    );
  });
  it("URL builders matrix 35", () => {
    expect(buildGitHubRepoApiUrl("org-35", "repo-35")).toContain(
      "org-35/repo-35",
    );
    expect(buildShieldsStarsUrl("org-35", "repo-35")).toContain(
      "org-35/repo-35",
    );
  });
  it("URL builders matrix 36", () => {
    expect(buildGitHubRepoApiUrl("org-36", "repo-36")).toContain(
      "org-36/repo-36",
    );
    expect(buildShieldsStarsUrl("org-36", "repo-36")).toContain(
      "org-36/repo-36",
    );
  });
  it("URL builders matrix 37", () => {
    expect(buildGitHubRepoApiUrl("org-37", "repo-37")).toContain(
      "org-37/repo-37",
    );
    expect(buildShieldsStarsUrl("org-37", "repo-37")).toContain(
      "org-37/repo-37",
    );
  });
  it("URL builders matrix 38", () => {
    expect(buildGitHubRepoApiUrl("org-38", "repo-38")).toContain(
      "org-38/repo-38",
    );
    expect(buildShieldsStarsUrl("org-38", "repo-38")).toContain(
      "org-38/repo-38",
    );
  });
  it("URL builders matrix 39", () => {
    expect(buildGitHubRepoApiUrl("org-39", "repo-39")).toContain(
      "org-39/repo-39",
    );
    expect(buildShieldsStarsUrl("org-39", "repo-39")).toContain(
      "org-39/repo-39",
    );
  });
  it("URL builders matrix 40", () => {
    expect(buildGitHubRepoApiUrl("org-40", "repo-40")).toContain(
      "org-40/repo-40",
    );
    expect(buildShieldsStarsUrl("org-40", "repo-40")).toContain(
      "org-40/repo-40",
    );
  });
  it("URL builders matrix 41", () => {
    expect(buildGitHubRepoApiUrl("org-41", "repo-41")).toContain(
      "org-41/repo-41",
    );
    expect(buildShieldsStarsUrl("org-41", "repo-41")).toContain(
      "org-41/repo-41",
    );
  });
  it("URL builders matrix 42", () => {
    expect(buildGitHubRepoApiUrl("org-42", "repo-42")).toContain(
      "org-42/repo-42",
    );
    expect(buildShieldsStarsUrl("org-42", "repo-42")).toContain(
      "org-42/repo-42",
    );
  });
  it("URL builders matrix 43", () => {
    expect(buildGitHubRepoApiUrl("org-43", "repo-43")).toContain(
      "org-43/repo-43",
    );
    expect(buildShieldsStarsUrl("org-43", "repo-43")).toContain(
      "org-43/repo-43",
    );
  });
  it("URL builders matrix 44", () => {
    expect(buildGitHubRepoApiUrl("org-44", "repo-44")).toContain(
      "org-44/repo-44",
    );
    expect(buildShieldsStarsUrl("org-44", "repo-44")).toContain(
      "org-44/repo-44",
    );
  });
  it("URL builders matrix 45", () => {
    expect(buildGitHubRepoApiUrl("org-45", "repo-45")).toContain(
      "org-45/repo-45",
    );
    expect(buildShieldsStarsUrl("org-45", "repo-45")).toContain(
      "org-45/repo-45",
    );
  });
  it("URL builders matrix 46", () => {
    expect(buildGitHubRepoApiUrl("org-46", "repo-46")).toContain(
      "org-46/repo-46",
    );
    expect(buildShieldsStarsUrl("org-46", "repo-46")).toContain(
      "org-46/repo-46",
    );
  });
  it("URL builders matrix 47", () => {
    expect(buildGitHubRepoApiUrl("org-47", "repo-47")).toContain(
      "org-47/repo-47",
    );
    expect(buildShieldsStarsUrl("org-47", "repo-47")).toContain(
      "org-47/repo-47",
    );
  });
  it("URL builders matrix 48", () => {
    expect(buildGitHubRepoApiUrl("org-48", "repo-48")).toContain(
      "org-48/repo-48",
    );
    expect(buildShieldsStarsUrl("org-48", "repo-48")).toContain(
      "org-48/repo-48",
    );
  });
  it("URL builders matrix 49", () => {
    expect(buildGitHubRepoApiUrl("org-49", "repo-49")).toContain(
      "org-49/repo-49",
    );
    expect(buildShieldsStarsUrl("org-49", "repo-49")).toContain(
      "org-49/repo-49",
    );
  });
  it("URL builders matrix 50", () => {
    expect(buildGitHubRepoApiUrl("org-50", "repo-50")).toContain(
      "org-50/repo-50",
    );
    expect(buildShieldsStarsUrl("org-50", "repo-50")).toContain(
      "org-50/repo-50",
    );
  });
  it("URL builders matrix 51", () => {
    expect(buildGitHubRepoApiUrl("org-51", "repo-51")).toContain(
      "org-51/repo-51",
    );
    expect(buildShieldsStarsUrl("org-51", "repo-51")).toContain(
      "org-51/repo-51",
    );
  });
  it("URL builders matrix 52", () => {
    expect(buildGitHubRepoApiUrl("org-52", "repo-52")).toContain(
      "org-52/repo-52",
    );
    expect(buildShieldsStarsUrl("org-52", "repo-52")).toContain(
      "org-52/repo-52",
    );
  });
  it("URL builders matrix 53", () => {
    expect(buildGitHubRepoApiUrl("org-53", "repo-53")).toContain(
      "org-53/repo-53",
    );
    expect(buildShieldsStarsUrl("org-53", "repo-53")).toContain(
      "org-53/repo-53",
    );
  });
  it("URL builders matrix 54", () => {
    expect(buildGitHubRepoApiUrl("org-54", "repo-54")).toContain(
      "org-54/repo-54",
    );
    expect(buildShieldsStarsUrl("org-54", "repo-54")).toContain(
      "org-54/repo-54",
    );
  });
  it("URL builders matrix 55", () => {
    expect(buildGitHubRepoApiUrl("org-55", "repo-55")).toContain(
      "org-55/repo-55",
    );
    expect(buildShieldsStarsUrl("org-55", "repo-55")).toContain(
      "org-55/repo-55",
    );
  });
  it("URL builders matrix 56", () => {
    expect(buildGitHubRepoApiUrl("org-56", "repo-56")).toContain(
      "org-56/repo-56",
    );
    expect(buildShieldsStarsUrl("org-56", "repo-56")).toContain(
      "org-56/repo-56",
    );
  });
  it("URL builders matrix 57", () => {
    expect(buildGitHubRepoApiUrl("org-57", "repo-57")).toContain(
      "org-57/repo-57",
    );
    expect(buildShieldsStarsUrl("org-57", "repo-57")).toContain(
      "org-57/repo-57",
    );
  });
  it("URL builders matrix 58", () => {
    expect(buildGitHubRepoApiUrl("org-58", "repo-58")).toContain(
      "org-58/repo-58",
    );
    expect(buildShieldsStarsUrl("org-58", "repo-58")).toContain(
      "org-58/repo-58",
    );
  });
  it("URL builders matrix 59", () => {
    expect(buildGitHubRepoApiUrl("org-59", "repo-59")).toContain(
      "org-59/repo-59",
    );
    expect(buildShieldsStarsUrl("org-59", "repo-59")).toContain(
      "org-59/repo-59",
    );
  });
  it("URL builders matrix 60", () => {
    expect(buildGitHubRepoApiUrl("org-60", "repo-60")).toContain(
      "org-60/repo-60",
    );
    expect(buildShieldsStarsUrl("org-60", "repo-60")).toContain(
      "org-60/repo-60",
    );
  });
  it("URL builders matrix 61", () => {
    expect(buildGitHubRepoApiUrl("org-61", "repo-61")).toContain(
      "org-61/repo-61",
    );
    expect(buildShieldsStarsUrl("org-61", "repo-61")).toContain(
      "org-61/repo-61",
    );
  });
  it("URL builders matrix 62", () => {
    expect(buildGitHubRepoApiUrl("org-62", "repo-62")).toContain(
      "org-62/repo-62",
    );
    expect(buildShieldsStarsUrl("org-62", "repo-62")).toContain(
      "org-62/repo-62",
    );
  });
  it("URL builders matrix 63", () => {
    expect(buildGitHubRepoApiUrl("org-63", "repo-63")).toContain(
      "org-63/repo-63",
    );
    expect(buildShieldsStarsUrl("org-63", "repo-63")).toContain(
      "org-63/repo-63",
    );
  });
  it("URL builders matrix 64", () => {
    expect(buildGitHubRepoApiUrl("org-64", "repo-64")).toContain(
      "org-64/repo-64",
    );
    expect(buildShieldsStarsUrl("org-64", "repo-64")).toContain(
      "org-64/repo-64",
    );
  });
  it("URL builders matrix 65", () => {
    expect(buildGitHubRepoApiUrl("org-65", "repo-65")).toContain(
      "org-65/repo-65",
    );
    expect(buildShieldsStarsUrl("org-65", "repo-65")).toContain(
      "org-65/repo-65",
    );
  });
  it("URL builders matrix 66", () => {
    expect(buildGitHubRepoApiUrl("org-66", "repo-66")).toContain(
      "org-66/repo-66",
    );
    expect(buildShieldsStarsUrl("org-66", "repo-66")).toContain(
      "org-66/repo-66",
    );
  });
  it("URL builders matrix 67", () => {
    expect(buildGitHubRepoApiUrl("org-67", "repo-67")).toContain(
      "org-67/repo-67",
    );
    expect(buildShieldsStarsUrl("org-67", "repo-67")).toContain(
      "org-67/repo-67",
    );
  });
  it("URL builders matrix 68", () => {
    expect(buildGitHubRepoApiUrl("org-68", "repo-68")).toContain(
      "org-68/repo-68",
    );
    expect(buildShieldsStarsUrl("org-68", "repo-68")).toContain(
      "org-68/repo-68",
    );
  });
  it("URL builders matrix 69", () => {
    expect(buildGitHubRepoApiUrl("org-69", "repo-69")).toContain(
      "org-69/repo-69",
    );
    expect(buildShieldsStarsUrl("org-69", "repo-69")).toContain(
      "org-69/repo-69",
    );
  });
  it("URL builders matrix 70", () => {
    expect(buildGitHubRepoApiUrl("org-70", "repo-70")).toContain(
      "org-70/repo-70",
    );
    expect(buildShieldsStarsUrl("org-70", "repo-70")).toContain(
      "org-70/repo-70",
    );
  });
  it("URL builders matrix 71", () => {
    expect(buildGitHubRepoApiUrl("org-71", "repo-71")).toContain(
      "org-71/repo-71",
    );
    expect(buildShieldsStarsUrl("org-71", "repo-71")).toContain(
      "org-71/repo-71",
    );
  });
  it("URL builders matrix 72", () => {
    expect(buildGitHubRepoApiUrl("org-72", "repo-72")).toContain(
      "org-72/repo-72",
    );
    expect(buildShieldsStarsUrl("org-72", "repo-72")).toContain(
      "org-72/repo-72",
    );
  });
  it("URL builders matrix 73", () => {
    expect(buildGitHubRepoApiUrl("org-73", "repo-73")).toContain(
      "org-73/repo-73",
    );
    expect(buildShieldsStarsUrl("org-73", "repo-73")).toContain(
      "org-73/repo-73",
    );
  });
  it("URL builders matrix 74", () => {
    expect(buildGitHubRepoApiUrl("org-74", "repo-74")).toContain(
      "org-74/repo-74",
    );
    expect(buildShieldsStarsUrl("org-74", "repo-74")).toContain(
      "org-74/repo-74",
    );
  });
  it("URL builders matrix 75", () => {
    expect(buildGitHubRepoApiUrl("org-75", "repo-75")).toContain(
      "org-75/repo-75",
    );
    expect(buildShieldsStarsUrl("org-75", "repo-75")).toContain(
      "org-75/repo-75",
    );
  });
  it("URL builders matrix 76", () => {
    expect(buildGitHubRepoApiUrl("org-76", "repo-76")).toContain(
      "org-76/repo-76",
    );
    expect(buildShieldsStarsUrl("org-76", "repo-76")).toContain(
      "org-76/repo-76",
    );
  });
  it("URL builders matrix 77", () => {
    expect(buildGitHubRepoApiUrl("org-77", "repo-77")).toContain(
      "org-77/repo-77",
    );
    expect(buildShieldsStarsUrl("org-77", "repo-77")).toContain(
      "org-77/repo-77",
    );
  });
  it("URL builders matrix 78", () => {
    expect(buildGitHubRepoApiUrl("org-78", "repo-78")).toContain(
      "org-78/repo-78",
    );
    expect(buildShieldsStarsUrl("org-78", "repo-78")).toContain(
      "org-78/repo-78",
    );
  });
  it("URL builders matrix 79", () => {
    expect(buildGitHubRepoApiUrl("org-79", "repo-79")).toContain(
      "org-79/repo-79",
    );
    expect(buildShieldsStarsUrl("org-79", "repo-79")).toContain(
      "org-79/repo-79",
    );
  });
  it("URL builders matrix 80", () => {
    expect(buildGitHubRepoApiUrl("org-80", "repo-80")).toContain(
      "org-80/repo-80",
    );
    expect(buildShieldsStarsUrl("org-80", "repo-80")).toContain(
      "org-80/repo-80",
    );
  });
  it("URL builders matrix 81", () => {
    expect(buildGitHubRepoApiUrl("org-81", "repo-81")).toContain(
      "org-81/repo-81",
    );
    expect(buildShieldsStarsUrl("org-81", "repo-81")).toContain(
      "org-81/repo-81",
    );
  });
  it("URL builders matrix 82", () => {
    expect(buildGitHubRepoApiUrl("org-82", "repo-82")).toContain(
      "org-82/repo-82",
    );
    expect(buildShieldsStarsUrl("org-82", "repo-82")).toContain(
      "org-82/repo-82",
    );
  });
  it("URL builders matrix 83", () => {
    expect(buildGitHubRepoApiUrl("org-83", "repo-83")).toContain(
      "org-83/repo-83",
    );
    expect(buildShieldsStarsUrl("org-83", "repo-83")).toContain(
      "org-83/repo-83",
    );
  });
  it("URL builders matrix 84", () => {
    expect(buildGitHubRepoApiUrl("org-84", "repo-84")).toContain(
      "org-84/repo-84",
    );
    expect(buildShieldsStarsUrl("org-84", "repo-84")).toContain(
      "org-84/repo-84",
    );
  });
  it("URL builders matrix 85", () => {
    expect(buildGitHubRepoApiUrl("org-85", "repo-85")).toContain(
      "org-85/repo-85",
    );
    expect(buildShieldsStarsUrl("org-85", "repo-85")).toContain(
      "org-85/repo-85",
    );
  });
  it("URL builders matrix 86", () => {
    expect(buildGitHubRepoApiUrl("org-86", "repo-86")).toContain(
      "org-86/repo-86",
    );
    expect(buildShieldsStarsUrl("org-86", "repo-86")).toContain(
      "org-86/repo-86",
    );
  });
  it("URL builders matrix 87", () => {
    expect(buildGitHubRepoApiUrl("org-87", "repo-87")).toContain(
      "org-87/repo-87",
    );
    expect(buildShieldsStarsUrl("org-87", "repo-87")).toContain(
      "org-87/repo-87",
    );
  });
  it("URL builders matrix 88", () => {
    expect(buildGitHubRepoApiUrl("org-88", "repo-88")).toContain(
      "org-88/repo-88",
    );
    expect(buildShieldsStarsUrl("org-88", "repo-88")).toContain(
      "org-88/repo-88",
    );
  });
  it("URL builders matrix 89", () => {
    expect(buildGitHubRepoApiUrl("org-89", "repo-89")).toContain(
      "org-89/repo-89",
    );
    expect(buildShieldsStarsUrl("org-89", "repo-89")).toContain(
      "org-89/repo-89",
    );
  });
  it("URL builders matrix 90", () => {
    expect(buildGitHubRepoApiUrl("org-90", "repo-90")).toContain(
      "org-90/repo-90",
    );
    expect(buildShieldsStarsUrl("org-90", "repo-90")).toContain(
      "org-90/repo-90",
    );
  });
  it("URL builders matrix 91", () => {
    expect(buildGitHubRepoApiUrl("org-91", "repo-91")).toContain(
      "org-91/repo-91",
    );
    expect(buildShieldsStarsUrl("org-91", "repo-91")).toContain(
      "org-91/repo-91",
    );
  });
  it("URL builders matrix 92", () => {
    expect(buildGitHubRepoApiUrl("org-92", "repo-92")).toContain(
      "org-92/repo-92",
    );
    expect(buildShieldsStarsUrl("org-92", "repo-92")).toContain(
      "org-92/repo-92",
    );
  });
  it("URL builders matrix 93", () => {
    expect(buildGitHubRepoApiUrl("org-93", "repo-93")).toContain(
      "org-93/repo-93",
    );
    expect(buildShieldsStarsUrl("org-93", "repo-93")).toContain(
      "org-93/repo-93",
    );
  });
  it("URL builders matrix 94", () => {
    expect(buildGitHubRepoApiUrl("org-94", "repo-94")).toContain(
      "org-94/repo-94",
    );
    expect(buildShieldsStarsUrl("org-94", "repo-94")).toContain(
      "org-94/repo-94",
    );
  });
  it("URL builders matrix 95", () => {
    expect(buildGitHubRepoApiUrl("org-95", "repo-95")).toContain(
      "org-95/repo-95",
    );
    expect(buildShieldsStarsUrl("org-95", "repo-95")).toContain(
      "org-95/repo-95",
    );
  });
  it("URL builders matrix 96", () => {
    expect(buildGitHubRepoApiUrl("org-96", "repo-96")).toContain(
      "org-96/repo-96",
    );
    expect(buildShieldsStarsUrl("org-96", "repo-96")).toContain(
      "org-96/repo-96",
    );
  });
  it("URL builders matrix 97", () => {
    expect(buildGitHubRepoApiUrl("org-97", "repo-97")).toContain(
      "org-97/repo-97",
    );
    expect(buildShieldsStarsUrl("org-97", "repo-97")).toContain(
      "org-97/repo-97",
    );
  });
  it("URL builders matrix 98", () => {
    expect(buildGitHubRepoApiUrl("org-98", "repo-98")).toContain(
      "org-98/repo-98",
    );
    expect(buildShieldsStarsUrl("org-98", "repo-98")).toContain(
      "org-98/repo-98",
    );
  });
  it("URL builders matrix 99", () => {
    expect(buildGitHubRepoApiUrl("org-99", "repo-99")).toContain(
      "org-99/repo-99",
    );
    expect(buildShieldsStarsUrl("org-99", "repo-99")).toContain(
      "org-99/repo-99",
    );
  });
});

describe("source-repo-signals-fetch-lib parseGitHubRepoApiPayload", () => {
  it("parses public repo stats", () => {
    expect(
      parseGitHubRepoApiPayload({
        stargazers_count: 42,
        forks_count: 7,
        updated_at: "2026-01-01",
      }),
    ).toEqual({
      stars: 42,
      forks: 7,
      repoUpdatedAt: "2026-01-01",
    });
  });
  it("throws for private repos", () => {
    expect(() => parseGitHubRepoApiPayload({ private: true })).toThrow(
      "github_api_private_repo",
    );
  });
  it("parseGitHubRepoApiPayload matrix 0", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(0);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 1", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 1,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(1);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 2", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 2,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(2);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 3", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 3,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(3);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 4", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 4,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(4);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 5", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 5,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(5);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 6", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 6,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(6);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 7", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 7,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(7);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 8", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 8,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(8);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 9", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 9,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(9);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 10", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 10,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(10);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 11", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 11,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(11);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 12", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 12,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(12);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 13", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 13,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(13);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 14", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 14,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(14);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 15", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 15,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(15);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 16", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 16,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(16);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 17", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 17,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(17);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 18", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 18,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(18);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 19", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 19,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(19);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 20", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 20,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(20);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 21", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 21,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(21);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 22", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 22,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(22);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 23", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 23,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(23);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 24", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 24,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(24);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 25", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 25,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(25);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 26", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 26,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(26);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 27", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 27,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(27);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 28", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 28,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(28);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 29", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 29,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(29);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 30", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 30,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(30);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 31", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 31,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(31);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 32", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 32,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(32);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 33", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 33,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(33);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 34", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 34,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(34);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 35", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 35,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(35);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 36", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 36,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(36);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 37", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 37,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(37);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 38", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 38,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(38);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 39", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 39,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(39);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 40", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 40,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(40);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 41", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 41,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(41);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 42", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 42,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(42);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 43", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 43,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(43);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 44", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 44,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(44);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 45", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 45,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(45);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 46", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 46,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(46);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 47", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 47,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(47);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 48", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 48,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(48);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 49", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 49,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(49);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 50", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 50,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(50);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 51", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 51,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(51);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 52", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 52,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(52);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 53", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 53,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(53);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 54", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 54,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(54);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 55", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 55,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(55);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 56", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 56,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(56);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 57", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 57,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(57);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 58", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 58,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(58);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 59", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 59,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(59);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 60", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 60,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(60);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 61", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 61,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(61);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 62", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 62,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(62);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 63", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 63,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(63);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 64", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 64,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(64);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 65", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 65,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(65);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 66", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 66,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(66);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 67", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 67,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(67);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 68", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 68,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(68);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 69", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 69,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(69);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 70", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 70,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(70);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 71", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 71,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(71);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 72", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 72,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(72);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 73", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 73,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(73);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 74", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 74,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(74);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 75", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 75,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(75);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 76", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 76,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(76);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 77", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 77,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(77);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 78", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 78,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(78);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 79", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 79,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(79);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 80", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 80,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(80);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 81", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 81,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(81);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 82", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 82,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(82);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 83", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 83,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(83);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 84", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 84,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(84);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 85", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 85,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(85);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 86", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 86,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(86);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 87", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 87,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(87);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 88", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 88,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(88);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 89", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 89,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(89);
    expect(parsed.forks).toBe(9);
  });
  it("parseGitHubRepoApiPayload matrix 90", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 90,
      forks_count: 0,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(90);
    expect(parsed.forks).toBe(0);
  });
  it("parseGitHubRepoApiPayload matrix 91", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 91,
      forks_count: 1,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(91);
    expect(parsed.forks).toBe(1);
  });
  it("parseGitHubRepoApiPayload matrix 92", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 92,
      forks_count: 2,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(92);
    expect(parsed.forks).toBe(2);
  });
  it("parseGitHubRepoApiPayload matrix 93", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 93,
      forks_count: 3,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(93);
    expect(parsed.forks).toBe(3);
  });
  it("parseGitHubRepoApiPayload matrix 94", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 94,
      forks_count: 4,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(94);
    expect(parsed.forks).toBe(4);
  });
  it("parseGitHubRepoApiPayload matrix 95", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 95,
      forks_count: 5,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(95);
    expect(parsed.forks).toBe(5);
  });
  it("parseGitHubRepoApiPayload matrix 96", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 96,
      forks_count: 6,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(96);
    expect(parsed.forks).toBe(6);
  });
  it("parseGitHubRepoApiPayload matrix 97", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 97,
      forks_count: 7,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(97);
    expect(parsed.forks).toBe(7);
  });
  it("parseGitHubRepoApiPayload matrix 98", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 98,
      forks_count: 8,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(98);
    expect(parsed.forks).toBe(8);
  });
  it("parseGitHubRepoApiPayload matrix 99", () => {
    const parsed = parseGitHubRepoApiPayload({
      stargazers_count: 99,
      forks_count: 9,
      updated_at: "2026-06-01",
    });
    expect(parsed.stars).toBe(99);
    expect(parsed.forks).toBe(9);
  });
});

describe("source-repo-signals-fetch-lib parseShieldsStarsPayload", () => {
  it("parses abbreviated star counts", () => {
    expect(parseShieldsStarsPayload({ value: "1.2k" })).toEqual({
      stars: 1200,
      forks: null,
      repoUpdatedAt: null,
    });
  });
  it("returns null for invalid payload", () => {
    expect(parseShieldsStarsPayload({ value: "not-a-number" })).toBeNull();
  });
  it("parseShieldsStarsPayload matrix 0", () => {
    const parsed = parseShieldsStarsPayload({ value: "0" });
    expect(parsed?.stars).toBe(0);
  });
  it("parseShieldsStarsPayload matrix 1", () => {
    const parsed = parseShieldsStarsPayload({ value: "10" });
    expect(parsed?.stars).toBe(10);
  });
  it("parseShieldsStarsPayload matrix 2", () => {
    const parsed = parseShieldsStarsPayload({ value: "20" });
    expect(parsed?.stars).toBe(20);
  });
  it("parseShieldsStarsPayload matrix 3", () => {
    const parsed = parseShieldsStarsPayload({ value: "30" });
    expect(parsed?.stars).toBe(30);
  });
  it("parseShieldsStarsPayload matrix 4", () => {
    const parsed = parseShieldsStarsPayload({ value: "40" });
    expect(parsed?.stars).toBe(40);
  });
  it("parseShieldsStarsPayload matrix 5", () => {
    const parsed = parseShieldsStarsPayload({ value: "50" });
    expect(parsed?.stars).toBe(50);
  });
  it("parseShieldsStarsPayload matrix 6", () => {
    const parsed = parseShieldsStarsPayload({ value: "60" });
    expect(parsed?.stars).toBe(60);
  });
  it("parseShieldsStarsPayload matrix 7", () => {
    const parsed = parseShieldsStarsPayload({ value: "70" });
    expect(parsed?.stars).toBe(70);
  });
  it("parseShieldsStarsPayload matrix 8", () => {
    const parsed = parseShieldsStarsPayload({ value: "80" });
    expect(parsed?.stars).toBe(80);
  });
  it("parseShieldsStarsPayload matrix 9", () => {
    const parsed = parseShieldsStarsPayload({ value: "90" });
    expect(parsed?.stars).toBe(90);
  });
  it("parseShieldsStarsPayload matrix 10", () => {
    const parsed = parseShieldsStarsPayload({ value: "100" });
    expect(parsed?.stars).toBe(100);
  });
  it("parseShieldsStarsPayload matrix 11", () => {
    const parsed = parseShieldsStarsPayload({ value: "110" });
    expect(parsed?.stars).toBe(110);
  });
  it("parseShieldsStarsPayload matrix 12", () => {
    const parsed = parseShieldsStarsPayload({ value: "120" });
    expect(parsed?.stars).toBe(120);
  });
  it("parseShieldsStarsPayload matrix 13", () => {
    const parsed = parseShieldsStarsPayload({ value: "130" });
    expect(parsed?.stars).toBe(130);
  });
  it("parseShieldsStarsPayload matrix 14", () => {
    const parsed = parseShieldsStarsPayload({ value: "140" });
    expect(parsed?.stars).toBe(140);
  });
  it("parseShieldsStarsPayload matrix 15", () => {
    const parsed = parseShieldsStarsPayload({ value: "150" });
    expect(parsed?.stars).toBe(150);
  });
  it("parseShieldsStarsPayload matrix 16", () => {
    const parsed = parseShieldsStarsPayload({ value: "160" });
    expect(parsed?.stars).toBe(160);
  });
  it("parseShieldsStarsPayload matrix 17", () => {
    const parsed = parseShieldsStarsPayload({ value: "170" });
    expect(parsed?.stars).toBe(170);
  });
  it("parseShieldsStarsPayload matrix 18", () => {
    const parsed = parseShieldsStarsPayload({ value: "180" });
    expect(parsed?.stars).toBe(180);
  });
  it("parseShieldsStarsPayload matrix 19", () => {
    const parsed = parseShieldsStarsPayload({ value: "190" });
    expect(parsed?.stars).toBe(190);
  });
  it("parseShieldsStarsPayload matrix 20", () => {
    const parsed = parseShieldsStarsPayload({ value: "200" });
    expect(parsed?.stars).toBe(200);
  });
  it("parseShieldsStarsPayload matrix 21", () => {
    const parsed = parseShieldsStarsPayload({ value: "210" });
    expect(parsed?.stars).toBe(210);
  });
  it("parseShieldsStarsPayload matrix 22", () => {
    const parsed = parseShieldsStarsPayload({ value: "220" });
    expect(parsed?.stars).toBe(220);
  });
  it("parseShieldsStarsPayload matrix 23", () => {
    const parsed = parseShieldsStarsPayload({ value: "230" });
    expect(parsed?.stars).toBe(230);
  });
  it("parseShieldsStarsPayload matrix 24", () => {
    const parsed = parseShieldsStarsPayload({ value: "240" });
    expect(parsed?.stars).toBe(240);
  });
  it("parseShieldsStarsPayload matrix 25", () => {
    const parsed = parseShieldsStarsPayload({ value: "250" });
    expect(parsed?.stars).toBe(250);
  });
  it("parseShieldsStarsPayload matrix 26", () => {
    const parsed = parseShieldsStarsPayload({ value: "260" });
    expect(parsed?.stars).toBe(260);
  });
  it("parseShieldsStarsPayload matrix 27", () => {
    const parsed = parseShieldsStarsPayload({ value: "270" });
    expect(parsed?.stars).toBe(270);
  });
  it("parseShieldsStarsPayload matrix 28", () => {
    const parsed = parseShieldsStarsPayload({ value: "280" });
    expect(parsed?.stars).toBe(280);
  });
  it("parseShieldsStarsPayload matrix 29", () => {
    const parsed = parseShieldsStarsPayload({ value: "290" });
    expect(parsed?.stars).toBe(290);
  });
  it("parseShieldsStarsPayload matrix 30", () => {
    const parsed = parseShieldsStarsPayload({ value: "300" });
    expect(parsed?.stars).toBe(300);
  });
  it("parseShieldsStarsPayload matrix 31", () => {
    const parsed = parseShieldsStarsPayload({ value: "310" });
    expect(parsed?.stars).toBe(310);
  });
  it("parseShieldsStarsPayload matrix 32", () => {
    const parsed = parseShieldsStarsPayload({ value: "320" });
    expect(parsed?.stars).toBe(320);
  });
  it("parseShieldsStarsPayload matrix 33", () => {
    const parsed = parseShieldsStarsPayload({ value: "330" });
    expect(parsed?.stars).toBe(330);
  });
  it("parseShieldsStarsPayload matrix 34", () => {
    const parsed = parseShieldsStarsPayload({ value: "340" });
    expect(parsed?.stars).toBe(340);
  });
  it("parseShieldsStarsPayload matrix 35", () => {
    const parsed = parseShieldsStarsPayload({ value: "350" });
    expect(parsed?.stars).toBe(350);
  });
  it("parseShieldsStarsPayload matrix 36", () => {
    const parsed = parseShieldsStarsPayload({ value: "360" });
    expect(parsed?.stars).toBe(360);
  });
  it("parseShieldsStarsPayload matrix 37", () => {
    const parsed = parseShieldsStarsPayload({ value: "370" });
    expect(parsed?.stars).toBe(370);
  });
  it("parseShieldsStarsPayload matrix 38", () => {
    const parsed = parseShieldsStarsPayload({ value: "380" });
    expect(parsed?.stars).toBe(380);
  });
  it("parseShieldsStarsPayload matrix 39", () => {
    const parsed = parseShieldsStarsPayload({ value: "390" });
    expect(parsed?.stars).toBe(390);
  });
  it("parseShieldsStarsPayload matrix 40", () => {
    const parsed = parseShieldsStarsPayload({ value: "400" });
    expect(parsed?.stars).toBe(400);
  });
  it("parseShieldsStarsPayload matrix 41", () => {
    const parsed = parseShieldsStarsPayload({ value: "410" });
    expect(parsed?.stars).toBe(410);
  });
  it("parseShieldsStarsPayload matrix 42", () => {
    const parsed = parseShieldsStarsPayload({ value: "420" });
    expect(parsed?.stars).toBe(420);
  });
  it("parseShieldsStarsPayload matrix 43", () => {
    const parsed = parseShieldsStarsPayload({ value: "430" });
    expect(parsed?.stars).toBe(430);
  });
  it("parseShieldsStarsPayload matrix 44", () => {
    const parsed = parseShieldsStarsPayload({ value: "440" });
    expect(parsed?.stars).toBe(440);
  });
  it("parseShieldsStarsPayload matrix 45", () => {
    const parsed = parseShieldsStarsPayload({ value: "450" });
    expect(parsed?.stars).toBe(450);
  });
  it("parseShieldsStarsPayload matrix 46", () => {
    const parsed = parseShieldsStarsPayload({ value: "460" });
    expect(parsed?.stars).toBe(460);
  });
  it("parseShieldsStarsPayload matrix 47", () => {
    const parsed = parseShieldsStarsPayload({ value: "470" });
    expect(parsed?.stars).toBe(470);
  });
  it("parseShieldsStarsPayload matrix 48", () => {
    const parsed = parseShieldsStarsPayload({ value: "480" });
    expect(parsed?.stars).toBe(480);
  });
  it("parseShieldsStarsPayload matrix 49", () => {
    const parsed = parseShieldsStarsPayload({ value: "490" });
    expect(parsed?.stars).toBe(490);
  });
  it("parseShieldsStarsPayload matrix 50", () => {
    const parsed = parseShieldsStarsPayload({ value: "500" });
    expect(parsed?.stars).toBe(500);
  });
  it("parseShieldsStarsPayload matrix 51", () => {
    const parsed = parseShieldsStarsPayload({ value: "510" });
    expect(parsed?.stars).toBe(510);
  });
  it("parseShieldsStarsPayload matrix 52", () => {
    const parsed = parseShieldsStarsPayload({ value: "520" });
    expect(parsed?.stars).toBe(520);
  });
  it("parseShieldsStarsPayload matrix 53", () => {
    const parsed = parseShieldsStarsPayload({ value: "530" });
    expect(parsed?.stars).toBe(530);
  });
  it("parseShieldsStarsPayload matrix 54", () => {
    const parsed = parseShieldsStarsPayload({ value: "540" });
    expect(parsed?.stars).toBe(540);
  });
  it("parseShieldsStarsPayload matrix 55", () => {
    const parsed = parseShieldsStarsPayload({ value: "550" });
    expect(parsed?.stars).toBe(550);
  });
  it("parseShieldsStarsPayload matrix 56", () => {
    const parsed = parseShieldsStarsPayload({ value: "560" });
    expect(parsed?.stars).toBe(560);
  });
  it("parseShieldsStarsPayload matrix 57", () => {
    const parsed = parseShieldsStarsPayload({ value: "570" });
    expect(parsed?.stars).toBe(570);
  });
  it("parseShieldsStarsPayload matrix 58", () => {
    const parsed = parseShieldsStarsPayload({ value: "580" });
    expect(parsed?.stars).toBe(580);
  });
  it("parseShieldsStarsPayload matrix 59", () => {
    const parsed = parseShieldsStarsPayload({ value: "590" });
    expect(parsed?.stars).toBe(590);
  });
});

describe("source-repo-signals-fetch-lib parseGitHubRepoKey", () => {
  it("accepts canonical owner/repo keys", () => {
    expect(parseGitHubRepoKey("openai/whisper")).toEqual({
      owner: "openai",
      repo: "whisper",
    });
  });

  it("rejects malformed or untrusted repo keys before outbound fetch", async () => {
    expect(parseGitHubRepoKey("")).toBeNull();
    expect(parseGitHubRepoKey("only-owner")).toBeNull();
    expect(parseGitHubRepoKey("owner/repo/extra")).toBeNull();
    expect(parseGitHubRepoKey("owner/repo@evil.com")).toBeNull();
    await expect(
      fetchGitHubSourceSignal("bad/key/extra", fetch),
    ).rejects.toThrow("invalid_repo:bad/key/extra");
  });
});

describe("source-repo-signals-fetch-lib fetchGitHubSourceSignal", () => {
  it("returns parsed GitHub API payload on success", async () => {
    const signal = await fetchGitHubSourceSignal(
      "demo/repo",
      async () =>
        new Response(
          JSON.stringify({
            stargazers_count: 99,
            forks_count: 3,
            updated_at: "2026-01-01",
          }),
          { status: 200 },
        ),
    );
    expect(signal.stars).toBe(99);
  });
  it("falls back to shields on API failure", async () => {
    let calls = 0;
    const fetcher = async (url: string | URL | Request) => {
      calls += 1;
      if (String(url).includes("api.github.com"))
        return new Response("", { status: 404 });
      return new Response(JSON.stringify({ value: "50" }), { status: 200 });
    };
    const signal = await fetchGitHubSourceSignal("demo/repo", fetcher);
    expect(signal.stars).toBe(50);
    expect(calls).toBeGreaterThan(1);
  });
  it("fetchGitHubSourceSignal matrix 0", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-0/repo-0",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 0, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(0);
  });
  it("fetchGitHubSourceSignal matrix 1", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-1/repo-1",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 1, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(1);
  });
  it("fetchGitHubSourceSignal matrix 2", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-2/repo-2",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 2, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(2);
  });
  it("fetchGitHubSourceSignal matrix 3", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-3/repo-3",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 3, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(3);
  });
  it("fetchGitHubSourceSignal matrix 4", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-4/repo-4",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 4, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(4);
  });
  it("fetchGitHubSourceSignal matrix 5", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-5/repo-5",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 5, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(5);
  });
  it("fetchGitHubSourceSignal matrix 6", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-6/repo-6",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 6, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(6);
  });
  it("fetchGitHubSourceSignal matrix 7", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-7/repo-7",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 7, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(7);
  });
  it("fetchGitHubSourceSignal matrix 8", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-8/repo-8",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 8, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(8);
  });
  it("fetchGitHubSourceSignal matrix 9", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-9/repo-9",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 9, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(9);
  });
  it("fetchGitHubSourceSignal matrix 10", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-10/repo-10",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 10, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(10);
  });
  it("fetchGitHubSourceSignal matrix 11", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-11/repo-11",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 11, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(11);
  });
  it("fetchGitHubSourceSignal matrix 12", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-12/repo-12",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 12, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(12);
  });
  it("fetchGitHubSourceSignal matrix 13", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-13/repo-13",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 13, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(13);
  });
  it("fetchGitHubSourceSignal matrix 14", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-14/repo-14",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 14, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(14);
  });
  it("fetchGitHubSourceSignal matrix 15", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-15/repo-15",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 15, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(15);
  });
  it("fetchGitHubSourceSignal matrix 16", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-16/repo-16",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 16, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(16);
  });
  it("fetchGitHubSourceSignal matrix 17", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-17/repo-17",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 17, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(17);
  });
  it("fetchGitHubSourceSignal matrix 18", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-18/repo-18",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 18, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(18);
  });
  it("fetchGitHubSourceSignal matrix 19", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-19/repo-19",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 19, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(19);
  });
  it("fetchGitHubSourceSignal matrix 20", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-20/repo-20",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 20, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(20);
  });
  it("fetchGitHubSourceSignal matrix 21", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-21/repo-21",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 21, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(21);
  });
  it("fetchGitHubSourceSignal matrix 22", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-22/repo-22",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 22, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(22);
  });
  it("fetchGitHubSourceSignal matrix 23", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-23/repo-23",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 23, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(23);
  });
  it("fetchGitHubSourceSignal matrix 24", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-24/repo-24",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 24, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(24);
  });
  it("fetchGitHubSourceSignal matrix 25", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-25/repo-25",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 25, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(25);
  });
  it("fetchGitHubSourceSignal matrix 26", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-26/repo-26",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 26, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(26);
  });
  it("fetchGitHubSourceSignal matrix 27", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-27/repo-27",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 27, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(27);
  });
  it("fetchGitHubSourceSignal matrix 28", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-28/repo-28",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 28, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(28);
  });
  it("fetchGitHubSourceSignal matrix 29", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-29/repo-29",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 29, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(29);
  });
  it("fetchGitHubSourceSignal matrix 30", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-30/repo-30",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 30, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(30);
  });
  it("fetchGitHubSourceSignal matrix 31", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-31/repo-31",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 31, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(31);
  });
  it("fetchGitHubSourceSignal matrix 32", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-32/repo-32",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 32, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(32);
  });
  it("fetchGitHubSourceSignal matrix 33", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-33/repo-33",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 33, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(33);
  });
  it("fetchGitHubSourceSignal matrix 34", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-34/repo-34",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 34, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(34);
  });
  it("fetchGitHubSourceSignal matrix 35", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-35/repo-35",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 35, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(35);
  });
  it("fetchGitHubSourceSignal matrix 36", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-36/repo-36",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 36, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(36);
  });
  it("fetchGitHubSourceSignal matrix 37", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-37/repo-37",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 37, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(37);
  });
  it("fetchGitHubSourceSignal matrix 38", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-38/repo-38",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 38, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(38);
  });
  it("fetchGitHubSourceSignal matrix 39", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-39/repo-39",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 39, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(39);
  });
  it("fetchGitHubSourceSignal matrix 40", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-40/repo-40",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 40, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(40);
  });
  it("fetchGitHubSourceSignal matrix 41", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-41/repo-41",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 41, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(41);
  });
  it("fetchGitHubSourceSignal matrix 42", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-42/repo-42",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 42, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(42);
  });
  it("fetchGitHubSourceSignal matrix 43", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-43/repo-43",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 43, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(43);
  });
  it("fetchGitHubSourceSignal matrix 44", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-44/repo-44",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 44, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(44);
  });
  it("fetchGitHubSourceSignal matrix 45", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-45/repo-45",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 45, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(45);
  });
  it("fetchGitHubSourceSignal matrix 46", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-46/repo-46",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 46, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(46);
  });
  it("fetchGitHubSourceSignal matrix 47", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-47/repo-47",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 47, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(47);
  });
  it("fetchGitHubSourceSignal matrix 48", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-48/repo-48",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 48, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(48);
  });
  it("fetchGitHubSourceSignal matrix 49", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-49/repo-49",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 49, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(49);
  });
  it("fetchGitHubSourceSignal matrix 50", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-50/repo-50",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 50, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(50);
  });
  it("fetchGitHubSourceSignal matrix 51", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-51/repo-51",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 51, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(51);
  });
  it("fetchGitHubSourceSignal matrix 52", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-52/repo-52",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 52, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(52);
  });
  it("fetchGitHubSourceSignal matrix 53", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-53/repo-53",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 53, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(53);
  });
  it("fetchGitHubSourceSignal matrix 54", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-54/repo-54",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 54, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(54);
  });
  it("fetchGitHubSourceSignal matrix 55", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-55/repo-55",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 55, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(55);
  });
  it("fetchGitHubSourceSignal matrix 56", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-56/repo-56",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 56, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(56);
  });
  it("fetchGitHubSourceSignal matrix 57", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-57/repo-57",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 57, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(57);
  });
  it("fetchGitHubSourceSignal matrix 58", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-58/repo-58",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 58, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(58);
  });
  it("fetchGitHubSourceSignal matrix 59", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-59/repo-59",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 59, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(59);
  });
  it("fetchGitHubSourceSignal matrix 60", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-60/repo-60",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 60, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(60);
  });
  it("fetchGitHubSourceSignal matrix 61", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-61/repo-61",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 61, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(61);
  });
  it("fetchGitHubSourceSignal matrix 62", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-62/repo-62",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 62, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(62);
  });
  it("fetchGitHubSourceSignal matrix 63", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-63/repo-63",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 63, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(63);
  });
  it("fetchGitHubSourceSignal matrix 64", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-64/repo-64",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 64, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(64);
  });
  it("fetchGitHubSourceSignal matrix 65", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-65/repo-65",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 65, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(65);
  });
  it("fetchGitHubSourceSignal matrix 66", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-66/repo-66",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 66, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(66);
  });
  it("fetchGitHubSourceSignal matrix 67", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-67/repo-67",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 67, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(67);
  });
  it("fetchGitHubSourceSignal matrix 68", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-68/repo-68",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 68, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(68);
  });
  it("fetchGitHubSourceSignal matrix 69", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-69/repo-69",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 69, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(69);
  });
  it("fetchGitHubSourceSignal matrix 70", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-70/repo-70",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 70, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(70);
  });
  it("fetchGitHubSourceSignal matrix 71", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-71/repo-71",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 71, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(71);
  });
  it("fetchGitHubSourceSignal matrix 72", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-72/repo-72",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 72, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(72);
  });
  it("fetchGitHubSourceSignal matrix 73", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-73/repo-73",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 73, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(73);
  });
  it("fetchGitHubSourceSignal matrix 74", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-74/repo-74",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 74, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(74);
  });
  it("fetchGitHubSourceSignal matrix 75", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-75/repo-75",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 75, forks_count: 0 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(75);
  });
  it("fetchGitHubSourceSignal matrix 76", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-76/repo-76",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 76, forks_count: 1 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(76);
  });
  it("fetchGitHubSourceSignal matrix 77", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-77/repo-77",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 77, forks_count: 2 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(77);
  });
  it("fetchGitHubSourceSignal matrix 78", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-78/repo-78",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 78, forks_count: 3 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(78);
  });
  it("fetchGitHubSourceSignal matrix 79", async () => {
    const signal = await fetchGitHubSourceSignal(
      "org-79/repo-79",
      async () =>
        new Response(JSON.stringify({ stargazers_count: 79, forks_count: 4 }), {
          status: 200,
        }),
    );
    expect(signal.stars).toBe(79);
  });
});

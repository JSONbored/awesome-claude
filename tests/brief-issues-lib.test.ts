import { describe, expect, it } from "vitest";

import {
  isMissingBriefIssuesInfra,
  parseBriefIssueRow,
  type BriefIssue,
  type BriefIssueRow,
  type BriefIssueStatus,
} from "../apps/web/src/lib/brief-issues-lib";

describe("brief-issues-lib isMissingBriefIssuesInfra", () => {
  it("matches absent brief_issues table errors", () => {
    expect(
      isMissingBriefIssuesInfra(new Error("no such table: brief_issues")),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra("no such table")).toBe(true);
  });
  it("does not swallow unrelated database errors", () => {
    expect(isMissingBriefIssuesInfra(new Error("constraint failed"))).toBe(
      false,
    );
    expect(isMissingBriefIssuesInfra(new Error("syntax error"))).toBe(false);
  });
  it("isMissingBriefIssuesInfra message 0", () => {
    expect(
      isMissingBriefIssuesInfra(new Error("no such table: brief_issues")),
    ).toBe(true);
  });
  it("isMissingBriefIssuesInfra message 1", () => {
    expect(
      isMissingBriefIssuesInfra(
        new Error("SQLITE_ERROR: no such table: brief_issues"),
      ),
    ).toBe(true);
  });
  it("isMissingBriefIssuesInfra message 2", () => {
    expect(
      isMissingBriefIssuesInfra(new Error("D1_ERROR: no such table")),
    ).toBe(true);
  });
  it("isMissingBriefIssuesInfra message 3", () => {
    expect(
      isMissingBriefIssuesInfra(new Error("no such table: other_table")),
    ).toBe(true);
  });
  it("isMissingBriefIssuesInfra message 4", () => {
    expect(isMissingBriefIssuesInfra(new Error("constraint failed"))).toBe(
      false,
    );
  });
  it("isMissingBriefIssuesInfra message 5", () => {
    expect(isMissingBriefIssuesInfra(new Error("database is locked"))).toBe(
      false,
    );
  });
  it("isMissingBriefIssuesInfra message 6", () => {
    expect(isMissingBriefIssuesInfra(new Error("timeout"))).toBe(false);
  });
  it("isMissingBriefIssuesInfra message 7", () => {
    expect(isMissingBriefIssuesInfra(new Error("disk I/O error"))).toBe(false);
  });
  it("isMissingBriefIssuesInfra message 8", () => {
    expect(
      isMissingBriefIssuesInfra(new Error("unable to open database file")),
    ).toBe(false);
  });
  it("isMissingBriefIssuesInfra message 9", () => {
    expect(
      isMissingBriefIssuesInfra(new Error('near "SELECT": syntax error')),
    ).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 0", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 0`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 0`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 1", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 1`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 1`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 2", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 2`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 2`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 3", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 3`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 3`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 4", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 4`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 4`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 5", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 5`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 5`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 6", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 6`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 6`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 7", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 7`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 7`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 8", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 8`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 8`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 9", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 9`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 9`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 10", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 10`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 10`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 11", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 11`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 11`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 12", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 12`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 12`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 13", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 13`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 13`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 14", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 14`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 14`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 15", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 15`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 15`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 16", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 16`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 16`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 17", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 17`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 17`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 18", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 18`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 18`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 19", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 19`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 19`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 20", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 20`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 20`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 21", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 21`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 21`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 22", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 22`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 22`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 23", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 23`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 23`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 24", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 24`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 24`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 25", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 25`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 25`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 26", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 26`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 26`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 27", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 27`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 27`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 28", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 28`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 28`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 29", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 29`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 29`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 30", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 30`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 30`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 31", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 31`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 31`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 32", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 32`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 32`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 33", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 33`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 33`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 34", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 34`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 34`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 35", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 35`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 35`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 36", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 36`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 36`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 37", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 37`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 37`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 38", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 38`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 38`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 39", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 39`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 39`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 40", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 40`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 40`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 41", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 41`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 41`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 42", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 42`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 42`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 43", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 43`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 43`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 44", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 44`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 44`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 45", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 45`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 45`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 46", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 46`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 46`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 47", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 47`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 47`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 48", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 48`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 48`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 49", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 49`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 49`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 50", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 50`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 50`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 51", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 51`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 51`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 52", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 52`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 52`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 53", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 53`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 53`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 54", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 54`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 54`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 55", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 55`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 55`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 56", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 56`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 56`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 57", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 57`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 57`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 58", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 58`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 58`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 59", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 59`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 59`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 60", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 60`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 60`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 61", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 61`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 61`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 62", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 62`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 62`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 63", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 63`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 63`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 64", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 64`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 64`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 65", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 65`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 65`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 66", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 66`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 66`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 67", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 67`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 67`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 68", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 68`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 68`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 69", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 69`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 69`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 70", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 70`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 70`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 71", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 71`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 71`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 72", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 72`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 72`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 73", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 73`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 73`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 74", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 74`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 74`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 75", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 75`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 75`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 76", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 76`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 76`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 77", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 77`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 77`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 78", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 78`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 78`)).toBe(false);
  });
  it("isMissingBriefIssuesInfra generated 79", () => {
    expect(
      isMissingBriefIssuesInfra(`no such table: brief_issues variant 79`),
    ).toBe(true);
    expect(isMissingBriefIssuesInfra(`other failure 79`)).toBe(false);
  });
});

function makeRow(overrides: Partial<BriefIssueRow> = {}): BriefIssueRow {
  return {
    number: 1,
    slug: "weekly-brief",
    period_through: "2026-06-01",
    payload: '{"headline":"Hello"}',
    status: "draft",
    generated_at: "2026-05-31T00:00:00.000Z",
    scheduled_send_at: null,
    approved_at: null,
    sent_at: null,
    ...overrides,
  };
}

describe("brief-issues-lib parseBriefIssueRow", () => {
  it("returns null for null row", () => {
    expect(parseBriefIssueRow(null)).toBeNull();
  });
  it("parses JSON payload", () => {
    const issue = parseBriefIssueRow(
      makeRow({ payload: '{"headline":"Hello","count":3}' }),
    );
    expect(issue?.payload).toEqual({ headline: "Hello", count: 3 });
  });
  it("falls back to empty payload on invalid JSON", () => {
    const issue = parseBriefIssueRow(makeRow({ payload: "not-json" }));
    expect(issue?.payload).toEqual({});
  });
  it("parseBriefIssueRow status draft 0", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 1, status: "draft", slug: "brief-draft-0" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-0");
  });
  it("parseBriefIssueRow status draft 1", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 2, status: "draft", slug: "brief-draft-1" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-1");
  });
  it("parseBriefIssueRow status draft 2", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 3, status: "draft", slug: "brief-draft-2" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-2");
  });
  it("parseBriefIssueRow status draft 3", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 4, status: "draft", slug: "brief-draft-3" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-3");
  });
  it("parseBriefIssueRow status draft 4", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 5, status: "draft", slug: "brief-draft-4" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-4");
  });
  it("parseBriefIssueRow status draft 5", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 6, status: "draft", slug: "brief-draft-5" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-5");
  });
  it("parseBriefIssueRow status draft 6", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 7, status: "draft", slug: "brief-draft-6" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-6");
  });
  it("parseBriefIssueRow status draft 7", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 8, status: "draft", slug: "brief-draft-7" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-7");
  });
  it("parseBriefIssueRow status draft 8", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 9, status: "draft", slug: "brief-draft-8" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-8");
  });
  it("parseBriefIssueRow status draft 9", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 10, status: "draft", slug: "brief-draft-9" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-9");
  });
  it("parseBriefIssueRow status draft 10", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 11, status: "draft", slug: "brief-draft-10" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-10");
  });
  it("parseBriefIssueRow status draft 11", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 12, status: "draft", slug: "brief-draft-11" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-11");
  });
  it("parseBriefIssueRow status draft 12", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 13, status: "draft", slug: "brief-draft-12" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-12");
  });
  it("parseBriefIssueRow status draft 13", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 14, status: "draft", slug: "brief-draft-13" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-13");
  });
  it("parseBriefIssueRow status draft 14", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 15, status: "draft", slug: "brief-draft-14" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-14");
  });
  it("parseBriefIssueRow status draft 15", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 16, status: "draft", slug: "brief-draft-15" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-15");
  });
  it("parseBriefIssueRow status draft 16", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 17, status: "draft", slug: "brief-draft-16" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-16");
  });
  it("parseBriefIssueRow status draft 17", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 18, status: "draft", slug: "brief-draft-17" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-17");
  });
  it("parseBriefIssueRow status draft 18", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 19, status: "draft", slug: "brief-draft-18" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-18");
  });
  it("parseBriefIssueRow status draft 19", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 20, status: "draft", slug: "brief-draft-19" }),
    );
    expect(issue?.status).toBe("draft");
    expect(issue?.slug).toBe("brief-draft-19");
  });
  it("parseBriefIssueRow status approved 0", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 1, status: "approved", slug: "brief-approved-0" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-0");
  });
  it("parseBriefIssueRow status approved 1", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 2, status: "approved", slug: "brief-approved-1" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-1");
  });
  it("parseBriefIssueRow status approved 2", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 3, status: "approved", slug: "brief-approved-2" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-2");
  });
  it("parseBriefIssueRow status approved 3", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 4, status: "approved", slug: "brief-approved-3" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-3");
  });
  it("parseBriefIssueRow status approved 4", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 5, status: "approved", slug: "brief-approved-4" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-4");
  });
  it("parseBriefIssueRow status approved 5", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 6, status: "approved", slug: "brief-approved-5" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-5");
  });
  it("parseBriefIssueRow status approved 6", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 7, status: "approved", slug: "brief-approved-6" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-6");
  });
  it("parseBriefIssueRow status approved 7", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 8, status: "approved", slug: "brief-approved-7" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-7");
  });
  it("parseBriefIssueRow status approved 8", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 9, status: "approved", slug: "brief-approved-8" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-8");
  });
  it("parseBriefIssueRow status approved 9", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 10, status: "approved", slug: "brief-approved-9" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-9");
  });
  it("parseBriefIssueRow status approved 10", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 11, status: "approved", slug: "brief-approved-10" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-10");
  });
  it("parseBriefIssueRow status approved 11", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 12, status: "approved", slug: "brief-approved-11" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-11");
  });
  it("parseBriefIssueRow status approved 12", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 13, status: "approved", slug: "brief-approved-12" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-12");
  });
  it("parseBriefIssueRow status approved 13", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 14, status: "approved", slug: "brief-approved-13" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-13");
  });
  it("parseBriefIssueRow status approved 14", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 15, status: "approved", slug: "brief-approved-14" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-14");
  });
  it("parseBriefIssueRow status approved 15", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 16, status: "approved", slug: "brief-approved-15" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-15");
  });
  it("parseBriefIssueRow status approved 16", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 17, status: "approved", slug: "brief-approved-16" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-16");
  });
  it("parseBriefIssueRow status approved 17", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 18, status: "approved", slug: "brief-approved-17" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-17");
  });
  it("parseBriefIssueRow status approved 18", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 19, status: "approved", slug: "brief-approved-18" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-18");
  });
  it("parseBriefIssueRow status approved 19", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 20, status: "approved", slug: "brief-approved-19" }),
    );
    expect(issue?.status).toBe("approved");
    expect(issue?.slug).toBe("brief-approved-19");
  });
  it("parseBriefIssueRow status sent 0", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 1, status: "sent", slug: "brief-sent-0" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-0");
  });
  it("parseBriefIssueRow status sent 1", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 2, status: "sent", slug: "brief-sent-1" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-1");
  });
  it("parseBriefIssueRow status sent 2", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 3, status: "sent", slug: "brief-sent-2" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-2");
  });
  it("parseBriefIssueRow status sent 3", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 4, status: "sent", slug: "brief-sent-3" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-3");
  });
  it("parseBriefIssueRow status sent 4", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 5, status: "sent", slug: "brief-sent-4" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-4");
  });
  it("parseBriefIssueRow status sent 5", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 6, status: "sent", slug: "brief-sent-5" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-5");
  });
  it("parseBriefIssueRow status sent 6", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 7, status: "sent", slug: "brief-sent-6" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-6");
  });
  it("parseBriefIssueRow status sent 7", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 8, status: "sent", slug: "brief-sent-7" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-7");
  });
  it("parseBriefIssueRow status sent 8", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 9, status: "sent", slug: "brief-sent-8" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-8");
  });
  it("parseBriefIssueRow status sent 9", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 10, status: "sent", slug: "brief-sent-9" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-9");
  });
  it("parseBriefIssueRow status sent 10", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 11, status: "sent", slug: "brief-sent-10" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-10");
  });
  it("parseBriefIssueRow status sent 11", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 12, status: "sent", slug: "brief-sent-11" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-11");
  });
  it("parseBriefIssueRow status sent 12", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 13, status: "sent", slug: "brief-sent-12" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-12");
  });
  it("parseBriefIssueRow status sent 13", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 14, status: "sent", slug: "brief-sent-13" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-13");
  });
  it("parseBriefIssueRow status sent 14", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 15, status: "sent", slug: "brief-sent-14" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-14");
  });
  it("parseBriefIssueRow status sent 15", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 16, status: "sent", slug: "brief-sent-15" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-15");
  });
  it("parseBriefIssueRow status sent 16", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 17, status: "sent", slug: "brief-sent-16" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-16");
  });
  it("parseBriefIssueRow status sent 17", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 18, status: "sent", slug: "brief-sent-17" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-17");
  });
  it("parseBriefIssueRow status sent 18", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 19, status: "sent", slug: "brief-sent-18" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-18");
  });
  it("parseBriefIssueRow status sent 19", () => {
    const issue = parseBriefIssueRow(
      makeRow({ number: 20, status: "sent", slug: "brief-sent-19" }),
    );
    expect(issue?.status).toBe("sent");
    expect(issue?.slug).toBe("brief-sent-19");
  });
  it("parseBriefIssueRow payload matrix 0", () => {
    const payload = JSON.stringify({ index: 0, note: "brief 0" });
    const issue = parseBriefIssueRow(makeRow({ number: 10, payload }));
    expect(issue?.payload).toEqual({ index: 0, note: "brief 0" });
  });
  it("parseBriefIssueRow payload matrix 1", () => {
    const payload = JSON.stringify({ index: 1, note: "brief 1" });
    const issue = parseBriefIssueRow(makeRow({ number: 11, payload }));
    expect(issue?.payload).toEqual({ index: 1, note: "brief 1" });
  });
  it("parseBriefIssueRow payload matrix 2", () => {
    const payload = JSON.stringify({ index: 2, note: "brief 2" });
    const issue = parseBriefIssueRow(makeRow({ number: 12, payload }));
    expect(issue?.payload).toEqual({ index: 2, note: "brief 2" });
  });
  it("parseBriefIssueRow payload matrix 3", () => {
    const payload = JSON.stringify({ index: 3, note: "brief 3" });
    const issue = parseBriefIssueRow(makeRow({ number: 13, payload }));
    expect(issue?.payload).toEqual({ index: 3, note: "brief 3" });
  });
  it("parseBriefIssueRow payload matrix 4", () => {
    const payload = JSON.stringify({ index: 4, note: "brief 4" });
    const issue = parseBriefIssueRow(makeRow({ number: 14, payload }));
    expect(issue?.payload).toEqual({ index: 4, note: "brief 4" });
  });
  it("parseBriefIssueRow payload matrix 5", () => {
    const payload = JSON.stringify({ index: 5, note: "brief 5" });
    const issue = parseBriefIssueRow(makeRow({ number: 15, payload }));
    expect(issue?.payload).toEqual({ index: 5, note: "brief 5" });
  });
  it("parseBriefIssueRow payload matrix 6", () => {
    const payload = JSON.stringify({ index: 6, note: "brief 6" });
    const issue = parseBriefIssueRow(makeRow({ number: 16, payload }));
    expect(issue?.payload).toEqual({ index: 6, note: "brief 6" });
  });
  it("parseBriefIssueRow payload matrix 7", () => {
    const payload = JSON.stringify({ index: 7, note: "brief 7" });
    const issue = parseBriefIssueRow(makeRow({ number: 17, payload }));
    expect(issue?.payload).toEqual({ index: 7, note: "brief 7" });
  });
  it("parseBriefIssueRow payload matrix 8", () => {
    const payload = JSON.stringify({ index: 8, note: "brief 8" });
    const issue = parseBriefIssueRow(makeRow({ number: 18, payload }));
    expect(issue?.payload).toEqual({ index: 8, note: "brief 8" });
  });
  it("parseBriefIssueRow payload matrix 9", () => {
    const payload = JSON.stringify({ index: 9, note: "brief 9" });
    const issue = parseBriefIssueRow(makeRow({ number: 19, payload }));
    expect(issue?.payload).toEqual({ index: 9, note: "brief 9" });
  });
  it("parseBriefIssueRow payload matrix 10", () => {
    const payload = JSON.stringify({ index: 10, note: "brief 10" });
    const issue = parseBriefIssueRow(makeRow({ number: 20, payload }));
    expect(issue?.payload).toEqual({ index: 10, note: "brief 10" });
  });
  it("parseBriefIssueRow payload matrix 11", () => {
    const payload = JSON.stringify({ index: 11, note: "brief 11" });
    const issue = parseBriefIssueRow(makeRow({ number: 21, payload }));
    expect(issue?.payload).toEqual({ index: 11, note: "brief 11" });
  });
  it("parseBriefIssueRow payload matrix 12", () => {
    const payload = JSON.stringify({ index: 12, note: "brief 12" });
    const issue = parseBriefIssueRow(makeRow({ number: 22, payload }));
    expect(issue?.payload).toEqual({ index: 12, note: "brief 12" });
  });
  it("parseBriefIssueRow payload matrix 13", () => {
    const payload = JSON.stringify({ index: 13, note: "brief 13" });
    const issue = parseBriefIssueRow(makeRow({ number: 23, payload }));
    expect(issue?.payload).toEqual({ index: 13, note: "brief 13" });
  });
  it("parseBriefIssueRow payload matrix 14", () => {
    const payload = JSON.stringify({ index: 14, note: "brief 14" });
    const issue = parseBriefIssueRow(makeRow({ number: 24, payload }));
    expect(issue?.payload).toEqual({ index: 14, note: "brief 14" });
  });
  it("parseBriefIssueRow payload matrix 15", () => {
    const payload = JSON.stringify({ index: 15, note: "brief 15" });
    const issue = parseBriefIssueRow(makeRow({ number: 25, payload }));
    expect(issue?.payload).toEqual({ index: 15, note: "brief 15" });
  });
  it("parseBriefIssueRow payload matrix 16", () => {
    const payload = JSON.stringify({ index: 16, note: "brief 16" });
    const issue = parseBriefIssueRow(makeRow({ number: 26, payload }));
    expect(issue?.payload).toEqual({ index: 16, note: "brief 16" });
  });
  it("parseBriefIssueRow payload matrix 17", () => {
    const payload = JSON.stringify({ index: 17, note: "brief 17" });
    const issue = parseBriefIssueRow(makeRow({ number: 27, payload }));
    expect(issue?.payload).toEqual({ index: 17, note: "brief 17" });
  });
  it("parseBriefIssueRow payload matrix 18", () => {
    const payload = JSON.stringify({ index: 18, note: "brief 18" });
    const issue = parseBriefIssueRow(makeRow({ number: 28, payload }));
    expect(issue?.payload).toEqual({ index: 18, note: "brief 18" });
  });
  it("parseBriefIssueRow payload matrix 19", () => {
    const payload = JSON.stringify({ index: 19, note: "brief 19" });
    const issue = parseBriefIssueRow(makeRow({ number: 29, payload }));
    expect(issue?.payload).toEqual({ index: 19, note: "brief 19" });
  });
  it("parseBriefIssueRow payload matrix 20", () => {
    const payload = JSON.stringify({ index: 20, note: "brief 20" });
    const issue = parseBriefIssueRow(makeRow({ number: 30, payload }));
    expect(issue?.payload).toEqual({ index: 20, note: "brief 20" });
  });
  it("parseBriefIssueRow payload matrix 21", () => {
    const payload = JSON.stringify({ index: 21, note: "brief 21" });
    const issue = parseBriefIssueRow(makeRow({ number: 31, payload }));
    expect(issue?.payload).toEqual({ index: 21, note: "brief 21" });
  });
  it("parseBriefIssueRow payload matrix 22", () => {
    const payload = JSON.stringify({ index: 22, note: "brief 22" });
    const issue = parseBriefIssueRow(makeRow({ number: 32, payload }));
    expect(issue?.payload).toEqual({ index: 22, note: "brief 22" });
  });
  it("parseBriefIssueRow payload matrix 23", () => {
    const payload = JSON.stringify({ index: 23, note: "brief 23" });
    const issue = parseBriefIssueRow(makeRow({ number: 33, payload }));
    expect(issue?.payload).toEqual({ index: 23, note: "brief 23" });
  });
  it("parseBriefIssueRow payload matrix 24", () => {
    const payload = JSON.stringify({ index: 24, note: "brief 24" });
    const issue = parseBriefIssueRow(makeRow({ number: 34, payload }));
    expect(issue?.payload).toEqual({ index: 24, note: "brief 24" });
  });
  it("parseBriefIssueRow payload matrix 25", () => {
    const payload = JSON.stringify({ index: 25, note: "brief 25" });
    const issue = parseBriefIssueRow(makeRow({ number: 35, payload }));
    expect(issue?.payload).toEqual({ index: 25, note: "brief 25" });
  });
  it("parseBriefIssueRow payload matrix 26", () => {
    const payload = JSON.stringify({ index: 26, note: "brief 26" });
    const issue = parseBriefIssueRow(makeRow({ number: 36, payload }));
    expect(issue?.payload).toEqual({ index: 26, note: "brief 26" });
  });
  it("parseBriefIssueRow payload matrix 27", () => {
    const payload = JSON.stringify({ index: 27, note: "brief 27" });
    const issue = parseBriefIssueRow(makeRow({ number: 37, payload }));
    expect(issue?.payload).toEqual({ index: 27, note: "brief 27" });
  });
  it("parseBriefIssueRow payload matrix 28", () => {
    const payload = JSON.stringify({ index: 28, note: "brief 28" });
    const issue = parseBriefIssueRow(makeRow({ number: 38, payload }));
    expect(issue?.payload).toEqual({ index: 28, note: "brief 28" });
  });
  it("parseBriefIssueRow payload matrix 29", () => {
    const payload = JSON.stringify({ index: 29, note: "brief 29" });
    const issue = parseBriefIssueRow(makeRow({ number: 39, payload }));
    expect(issue?.payload).toEqual({ index: 29, note: "brief 29" });
  });
  it("parseBriefIssueRow payload matrix 30", () => {
    const payload = JSON.stringify({ index: 30, note: "brief 30" });
    const issue = parseBriefIssueRow(makeRow({ number: 40, payload }));
    expect(issue?.payload).toEqual({ index: 30, note: "brief 30" });
  });
  it("parseBriefIssueRow payload matrix 31", () => {
    const payload = JSON.stringify({ index: 31, note: "brief 31" });
    const issue = parseBriefIssueRow(makeRow({ number: 41, payload }));
    expect(issue?.payload).toEqual({ index: 31, note: "brief 31" });
  });
  it("parseBriefIssueRow payload matrix 32", () => {
    const payload = JSON.stringify({ index: 32, note: "brief 32" });
    const issue = parseBriefIssueRow(makeRow({ number: 42, payload }));
    expect(issue?.payload).toEqual({ index: 32, note: "brief 32" });
  });
  it("parseBriefIssueRow payload matrix 33", () => {
    const payload = JSON.stringify({ index: 33, note: "brief 33" });
    const issue = parseBriefIssueRow(makeRow({ number: 43, payload }));
    expect(issue?.payload).toEqual({ index: 33, note: "brief 33" });
  });
  it("parseBriefIssueRow payload matrix 34", () => {
    const payload = JSON.stringify({ index: 34, note: "brief 34" });
    const issue = parseBriefIssueRow(makeRow({ number: 44, payload }));
    expect(issue?.payload).toEqual({ index: 34, note: "brief 34" });
  });
  it("parseBriefIssueRow payload matrix 35", () => {
    const payload = JSON.stringify({ index: 35, note: "brief 35" });
    const issue = parseBriefIssueRow(makeRow({ number: 45, payload }));
    expect(issue?.payload).toEqual({ index: 35, note: "brief 35" });
  });
  it("parseBriefIssueRow payload matrix 36", () => {
    const payload = JSON.stringify({ index: 36, note: "brief 36" });
    const issue = parseBriefIssueRow(makeRow({ number: 46, payload }));
    expect(issue?.payload).toEqual({ index: 36, note: "brief 36" });
  });
  it("parseBriefIssueRow payload matrix 37", () => {
    const payload = JSON.stringify({ index: 37, note: "brief 37" });
    const issue = parseBriefIssueRow(makeRow({ number: 47, payload }));
    expect(issue?.payload).toEqual({ index: 37, note: "brief 37" });
  });
  it("parseBriefIssueRow payload matrix 38", () => {
    const payload = JSON.stringify({ index: 38, note: "brief 38" });
    const issue = parseBriefIssueRow(makeRow({ number: 48, payload }));
    expect(issue?.payload).toEqual({ index: 38, note: "brief 38" });
  });
  it("parseBriefIssueRow payload matrix 39", () => {
    const payload = JSON.stringify({ index: 39, note: "brief 39" });
    const issue = parseBriefIssueRow(makeRow({ number: 49, payload }));
    expect(issue?.payload).toEqual({ index: 39, note: "brief 39" });
  });
  it("parseBriefIssueRow payload matrix 40", () => {
    const payload = JSON.stringify({ index: 40, note: "brief 40" });
    const issue = parseBriefIssueRow(makeRow({ number: 50, payload }));
    expect(issue?.payload).toEqual({ index: 40, note: "brief 40" });
  });
  it("parseBriefIssueRow payload matrix 41", () => {
    const payload = JSON.stringify({ index: 41, note: "brief 41" });
    const issue = parseBriefIssueRow(makeRow({ number: 51, payload }));
    expect(issue?.payload).toEqual({ index: 41, note: "brief 41" });
  });
  it("parseBriefIssueRow payload matrix 42", () => {
    const payload = JSON.stringify({ index: 42, note: "brief 42" });
    const issue = parseBriefIssueRow(makeRow({ number: 52, payload }));
    expect(issue?.payload).toEqual({ index: 42, note: "brief 42" });
  });
  it("parseBriefIssueRow payload matrix 43", () => {
    const payload = JSON.stringify({ index: 43, note: "brief 43" });
    const issue = parseBriefIssueRow(makeRow({ number: 53, payload }));
    expect(issue?.payload).toEqual({ index: 43, note: "brief 43" });
  });
  it("parseBriefIssueRow payload matrix 44", () => {
    const payload = JSON.stringify({ index: 44, note: "brief 44" });
    const issue = parseBriefIssueRow(makeRow({ number: 54, payload }));
    expect(issue?.payload).toEqual({ index: 44, note: "brief 44" });
  });
  it("parseBriefIssueRow payload matrix 45", () => {
    const payload = JSON.stringify({ index: 45, note: "brief 45" });
    const issue = parseBriefIssueRow(makeRow({ number: 55, payload }));
    expect(issue?.payload).toEqual({ index: 45, note: "brief 45" });
  });
  it("parseBriefIssueRow payload matrix 46", () => {
    const payload = JSON.stringify({ index: 46, note: "brief 46" });
    const issue = parseBriefIssueRow(makeRow({ number: 56, payload }));
    expect(issue?.payload).toEqual({ index: 46, note: "brief 46" });
  });
  it("parseBriefIssueRow payload matrix 47", () => {
    const payload = JSON.stringify({ index: 47, note: "brief 47" });
    const issue = parseBriefIssueRow(makeRow({ number: 57, payload }));
    expect(issue?.payload).toEqual({ index: 47, note: "brief 47" });
  });
  it("parseBriefIssueRow payload matrix 48", () => {
    const payload = JSON.stringify({ index: 48, note: "brief 48" });
    const issue = parseBriefIssueRow(makeRow({ number: 58, payload }));
    expect(issue?.payload).toEqual({ index: 48, note: "brief 48" });
  });
  it("parseBriefIssueRow payload matrix 49", () => {
    const payload = JSON.stringify({ index: 49, note: "brief 49" });
    const issue = parseBriefIssueRow(makeRow({ number: 59, payload }));
    expect(issue?.payload).toEqual({ index: 49, note: "brief 49" });
  });
  it("parseBriefIssueRow payload matrix 50", () => {
    const payload = JSON.stringify({ index: 50, note: "brief 50" });
    const issue = parseBriefIssueRow(makeRow({ number: 60, payload }));
    expect(issue?.payload).toEqual({ index: 50, note: "brief 50" });
  });
  it("parseBriefIssueRow payload matrix 51", () => {
    const payload = JSON.stringify({ index: 51, note: "brief 51" });
    const issue = parseBriefIssueRow(makeRow({ number: 61, payload }));
    expect(issue?.payload).toEqual({ index: 51, note: "brief 51" });
  });
  it("parseBriefIssueRow payload matrix 52", () => {
    const payload = JSON.stringify({ index: 52, note: "brief 52" });
    const issue = parseBriefIssueRow(makeRow({ number: 62, payload }));
    expect(issue?.payload).toEqual({ index: 52, note: "brief 52" });
  });
  it("parseBriefIssueRow payload matrix 53", () => {
    const payload = JSON.stringify({ index: 53, note: "brief 53" });
    const issue = parseBriefIssueRow(makeRow({ number: 63, payload }));
    expect(issue?.payload).toEqual({ index: 53, note: "brief 53" });
  });
  it("parseBriefIssueRow payload matrix 54", () => {
    const payload = JSON.stringify({ index: 54, note: "brief 54" });
    const issue = parseBriefIssueRow(makeRow({ number: 64, payload }));
    expect(issue?.payload).toEqual({ index: 54, note: "brief 54" });
  });
  it("parseBriefIssueRow payload matrix 55", () => {
    const payload = JSON.stringify({ index: 55, note: "brief 55" });
    const issue = parseBriefIssueRow(makeRow({ number: 65, payload }));
    expect(issue?.payload).toEqual({ index: 55, note: "brief 55" });
  });
  it("parseBriefIssueRow payload matrix 56", () => {
    const payload = JSON.stringify({ index: 56, note: "brief 56" });
    const issue = parseBriefIssueRow(makeRow({ number: 66, payload }));
    expect(issue?.payload).toEqual({ index: 56, note: "brief 56" });
  });
  it("parseBriefIssueRow payload matrix 57", () => {
    const payload = JSON.stringify({ index: 57, note: "brief 57" });
    const issue = parseBriefIssueRow(makeRow({ number: 67, payload }));
    expect(issue?.payload).toEqual({ index: 57, note: "brief 57" });
  });
  it("parseBriefIssueRow payload matrix 58", () => {
    const payload = JSON.stringify({ index: 58, note: "brief 58" });
    const issue = parseBriefIssueRow(makeRow({ number: 68, payload }));
    expect(issue?.payload).toEqual({ index: 58, note: "brief 58" });
  });
  it("parseBriefIssueRow payload matrix 59", () => {
    const payload = JSON.stringify({ index: 59, note: "brief 59" });
    const issue = parseBriefIssueRow(makeRow({ number: 69, payload }));
    expect(issue?.payload).toEqual({ index: 59, note: "brief 59" });
  });
  it("parseBriefIssueRow payload matrix 60", () => {
    const payload = JSON.stringify({ index: 60, note: "brief 60" });
    const issue = parseBriefIssueRow(makeRow({ number: 70, payload }));
    expect(issue?.payload).toEqual({ index: 60, note: "brief 60" });
  });
  it("parseBriefIssueRow payload matrix 61", () => {
    const payload = JSON.stringify({ index: 61, note: "brief 61" });
    const issue = parseBriefIssueRow(makeRow({ number: 71, payload }));
    expect(issue?.payload).toEqual({ index: 61, note: "brief 61" });
  });
  it("parseBriefIssueRow payload matrix 62", () => {
    const payload = JSON.stringify({ index: 62, note: "brief 62" });
    const issue = parseBriefIssueRow(makeRow({ number: 72, payload }));
    expect(issue?.payload).toEqual({ index: 62, note: "brief 62" });
  });
  it("parseBriefIssueRow payload matrix 63", () => {
    const payload = JSON.stringify({ index: 63, note: "brief 63" });
    const issue = parseBriefIssueRow(makeRow({ number: 73, payload }));
    expect(issue?.payload).toEqual({ index: 63, note: "brief 63" });
  });
  it("parseBriefIssueRow payload matrix 64", () => {
    const payload = JSON.stringify({ index: 64, note: "brief 64" });
    const issue = parseBriefIssueRow(makeRow({ number: 74, payload }));
    expect(issue?.payload).toEqual({ index: 64, note: "brief 64" });
  });
  it("parseBriefIssueRow payload matrix 65", () => {
    const payload = JSON.stringify({ index: 65, note: "brief 65" });
    const issue = parseBriefIssueRow(makeRow({ number: 75, payload }));
    expect(issue?.payload).toEqual({ index: 65, note: "brief 65" });
  });
  it("parseBriefIssueRow payload matrix 66", () => {
    const payload = JSON.stringify({ index: 66, note: "brief 66" });
    const issue = parseBriefIssueRow(makeRow({ number: 76, payload }));
    expect(issue?.payload).toEqual({ index: 66, note: "brief 66" });
  });
  it("parseBriefIssueRow payload matrix 67", () => {
    const payload = JSON.stringify({ index: 67, note: "brief 67" });
    const issue = parseBriefIssueRow(makeRow({ number: 77, payload }));
    expect(issue?.payload).toEqual({ index: 67, note: "brief 67" });
  });
  it("parseBriefIssueRow payload matrix 68", () => {
    const payload = JSON.stringify({ index: 68, note: "brief 68" });
    const issue = parseBriefIssueRow(makeRow({ number: 78, payload }));
    expect(issue?.payload).toEqual({ index: 68, note: "brief 68" });
  });
  it("parseBriefIssueRow payload matrix 69", () => {
    const payload = JSON.stringify({ index: 69, note: "brief 69" });
    const issue = parseBriefIssueRow(makeRow({ number: 79, payload }));
    expect(issue?.payload).toEqual({ index: 69, note: "brief 69" });
  });
  it("parseBriefIssueRow payload matrix 70", () => {
    const payload = JSON.stringify({ index: 70, note: "brief 70" });
    const issue = parseBriefIssueRow(makeRow({ number: 80, payload }));
    expect(issue?.payload).toEqual({ index: 70, note: "brief 70" });
  });
  it("parseBriefIssueRow payload matrix 71", () => {
    const payload = JSON.stringify({ index: 71, note: "brief 71" });
    const issue = parseBriefIssueRow(makeRow({ number: 81, payload }));
    expect(issue?.payload).toEqual({ index: 71, note: "brief 71" });
  });
  it("parseBriefIssueRow payload matrix 72", () => {
    const payload = JSON.stringify({ index: 72, note: "brief 72" });
    const issue = parseBriefIssueRow(makeRow({ number: 82, payload }));
    expect(issue?.payload).toEqual({ index: 72, note: "brief 72" });
  });
  it("parseBriefIssueRow payload matrix 73", () => {
    const payload = JSON.stringify({ index: 73, note: "brief 73" });
    const issue = parseBriefIssueRow(makeRow({ number: 83, payload }));
    expect(issue?.payload).toEqual({ index: 73, note: "brief 73" });
  });
  it("parseBriefIssueRow payload matrix 74", () => {
    const payload = JSON.stringify({ index: 74, note: "brief 74" });
    const issue = parseBriefIssueRow(makeRow({ number: 84, payload }));
    expect(issue?.payload).toEqual({ index: 74, note: "brief 74" });
  });
  it("parseBriefIssueRow payload matrix 75", () => {
    const payload = JSON.stringify({ index: 75, note: "brief 75" });
    const issue = parseBriefIssueRow(makeRow({ number: 85, payload }));
    expect(issue?.payload).toEqual({ index: 75, note: "brief 75" });
  });
  it("parseBriefIssueRow payload matrix 76", () => {
    const payload = JSON.stringify({ index: 76, note: "brief 76" });
    const issue = parseBriefIssueRow(makeRow({ number: 86, payload }));
    expect(issue?.payload).toEqual({ index: 76, note: "brief 76" });
  });
  it("parseBriefIssueRow payload matrix 77", () => {
    const payload = JSON.stringify({ index: 77, note: "brief 77" });
    const issue = parseBriefIssueRow(makeRow({ number: 87, payload }));
    expect(issue?.payload).toEqual({ index: 77, note: "brief 77" });
  });
  it("parseBriefIssueRow payload matrix 78", () => {
    const payload = JSON.stringify({ index: 78, note: "brief 78" });
    const issue = parseBriefIssueRow(makeRow({ number: 88, payload }));
    expect(issue?.payload).toEqual({ index: 78, note: "brief 78" });
  });
  it("parseBriefIssueRow payload matrix 79", () => {
    const payload = JSON.stringify({ index: 79, note: "brief 79" });
    const issue = parseBriefIssueRow(makeRow({ number: 89, payload }));
    expect(issue?.payload).toEqual({ index: 79, note: "brief 79" });
  });
  it("preserves row metadata fields", () => {
    const row = makeRow({
      scheduled_send_at: "2026-06-02T09:00:00.000Z",
      approved_at: "2026-06-01T12:00:00.000Z",
      sent_at: "2026-06-02T09:05:00.000Z",
    });
    const issue = parseBriefIssueRow(row) as BriefIssue;
    expect(issue.scheduled_send_at).toBe("2026-06-02T09:00:00.000Z");
    expect(issue.approved_at).toBe("2026-06-01T12:00:00.000Z");
    expect(issue.sent_at).toBe("2026-06-02T09:05:00.000Z");
  });
});

describe("brief-issues-lib isMissingBriefIssuesInfra nullish input", () => {
  it("treats null and undefined as unrelated errors (fails closed)", () => {
    expect(isMissingBriefIssuesInfra(null)).toBe(false);
    expect(isMissingBriefIssuesInfra(undefined)).toBe(false);
  });
});

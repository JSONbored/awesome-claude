import { describe, expect, it } from "vitest";

import {
  COMMIT_LOG_FORMAT,
  parseCommitLog,
} from "../scripts/lib/release-watch-core.mjs";

// git log --format=COMMIT_LOG_FORMAT emits: \x1e<sha>\x1f<subject> per commit.
const rec = (sha: string, subject: string) => `\x1e${sha}\x1f${subject}`;

describe("parseCommitLog", () => {
  it("keeps the format the parser expects", () => {
    expect(COMMIT_LOG_FORMAT).toBe("%x1e%H%x1f%s");
  });

  it("parses record-separated commits into { sha, subject }", () => {
    const output = rec("abc123", "feat: one") + rec("def456", "fix: two");
    expect(parseCommitLog(output)).toEqual([
      { sha: "abc123", subject: "feat: one" },
      { sha: "def456", subject: "fix: two" },
    ]);
  });

  it("uses only the first line of a multi-line subject", () => {
    expect(parseCommitLog(rec("abc", "first line\nbody line"))).toEqual([
      { sha: "abc", subject: "first line" },
    ]);
  });

  it("yields an empty subject when the subject field is absent", () => {
    expect(parseCommitLog("\x1eabc")).toEqual([{ sha: "abc", subject: "" }]);
  });

  it("drops blank records and handles empty/nullish output", () => {
    expect(parseCommitLog("")).toEqual([]);
    expect(parseCommitLog(null)).toEqual([]);
    expect(parseCommitLog("\x1e" + rec("abc", "s"))).toEqual([
      { sha: "abc", subject: "s" },
    ]);
  });
});

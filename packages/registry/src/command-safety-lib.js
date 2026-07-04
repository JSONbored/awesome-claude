/**
 * Pure shell-pattern safety scanners.
 *
 * This module holds the deterministic heuristic layer used to flag high-risk
 * shell patterns in submitted skill scripts, MCP commands, and install
 * snippets. Nothing here touches the filesystem or network — given the same
 * text the output is byte-stable.
 *
 * The public package surface (`command-safety.js` /
 * `@heyclaude/registry/command-safety`) re-exports everything below so
 * existing imports stay unchanged.
 */

// Heuristic detection of high-risk shell patterns in submitted text (skill
// scripts, MCP commands, install snippets). Advisory only — a triage signal for
// human/maintainer review, never a sandbox or a guarantee of safety.

export const REMOVE_PATTERN = /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i;
export const CHMOD_PATTERN = /\bchmod\s+(?:-R\s+)?0?777\b/i;
export const MKFS_PATTERN = /\bmkfs(?:\.\w+)?\b/i;
export const FORK_BOMB_PATTERN =
  /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/;
export const INLINE_EVAL_PATTERN = /\beval\s+["'`]?\$\(/i;

// Sudo options that take a separate value token (`-u root`, `--user root`).
// Lowercased, so case variants collapse onto value-taking forms (e.g. `-U`
// → `-u`, `-R` → `-r`). The `--flag=value` form is self-contained and is not
// listed. `-h` is intentionally omitted because `sudo -h` alone prints help.
export const SUDO_VALUE_FLAGS = new Set([
  "-u",
  "--user",
  "-g",
  "--group",
  "-r",
  "--role",
  "-t",
  "--type",
  "-p",
  "--prompt",
  "-c",
  "--close-from",
  "-d",
  "--chdir",
  "--chroot",
  "--command-timeout",
  "--other-user",
  "--host",
]);

// POSIX shells that execute piped input. `dash` (the Debian/Ubuntu default
// `/bin/sh`) and `ash` (BusyBox/Alpine, common in Docker images) appear in
// real `curl … | dash`-style install snippets, so they are recognized as
// shells alongside bash/zsh/sh. Matching is on the exact lead command word,
// so a shell name used as an argument (e.g. `grep -v dash`) is not flagged.
export const SHELL_TOKENS = ["bash", "zsh", "sh", "dash", "ash"];
export const DOWNLOADER_TOKENS = ["curl", "wget"];

export function isWordCharacter(char) {
  return /[a-z0-9_]/i.test(char || "");
}

export function findCommandToken(line, lowerLine, token, fromIndex = 0) {
  while (fromIndex < line.length) {
    const index = lowerLine.indexOf(token, fromIndex);
    if (index === -1) return -1;

    const before = line[index - 1] || "";
    const after = line[index + token.length] || "";
    if (!isWordCharacter(before) && !isWordCharacter(after)) return index;

    fromIndex = index + token.length;
  }
  return -1;
}

export function hasCommandToken(line, lowerLine, tokens) {
  return tokens.some(
    (token) => findCommandToken(line, lowerLine, token) !== -1,
  );
}

// Split a command line into pipe segments. Command separators (`;`, `&&`, `||`,
// `&`) end the current pipe chain so unrelated commands never merge into one
// dangerous chain (e.g. `curl x && cat y | sh` is two commands, not a
// download-piped-to-shell). Single bounded pass — no backtracking regex.
export function pipeChainSegments(line) {
  const segments = [];
  let start = 0;
  let index = 0;
  let quote = "";
  let escaped = false;
  const pushSegment = (end) => segments.push({ start, end });

  while (index < line.length) {
    const char = line[index];
    if (escaped) {
      escaped = false;
      index += 1;
      continue;
    }
    if (char === "\\" && quote !== "'") {
      escaped = true;
      index += 1;
      continue;
    }
    if ((char === "'" || char === '"') && (!quote || quote === char)) {
      quote = quote ? "" : char;
      index += 1;
      continue;
    }
    if (!quote && char === "|" && line[index + 1] === "|") {
      pushSegment(index);
      segments.push({ barrier: true });
      index += 2;
      start = index;
    } else if (!quote && char === "|") {
      pushSegment(index);
      index += 1;
      start = index;
    } else if (!quote && char === ";") {
      pushSegment(index);
      segments.push({ barrier: true });
      index += 1;
      start = index;
    } else if (!quote && char === "&") {
      pushSegment(index);
      segments.push({ barrier: true });
      index += line[index + 1] === "&" ? 2 : 1;
      start = index;
    } else {
      index += 1;
    }
  }
  pushSegment(line.length);
  return segments;
}

export const ENV_VALUE_FLAGS = new Set(["-u", "--unset", "-c", "--chdir"]);

export function shellTokenEnd(line, start, end) {
  let index = start;
  let quote = "";
  let escaped = false;
  while (index < end) {
    const char = line[index];
    if (escaped) {
      escaped = false;
    } else if (char === "\\" && quote !== "'") {
      escaped = true;
    } else if ((char === "'" || char === '"') && (!quote || quote === char)) {
      quote = quote ? "" : char;
    } else if (!quote && /\s/.test(char || "")) {
      break;
    }
    index += 1;
  }
  return index;
}

export function shellToken(line, lowerLine, start, end) {
  let index = start;
  while (index < end && /\s/.test(line[index] || "")) index += 1;
  if (index >= end) return null;
  const tokenEnd = shellTokenEnd(line, index, end);
  return {
    end: tokenEnd,
    lower: lowerLine.slice(index, tokenEnd),
    start: index,
  };
}

export function isEnvironmentAssignment(token) {
  return /^[a-z_][a-z0-9_]*=/i.test(token);
}

// First command word of a pipe segment, stepping over POSIX environment
// assignments and optional `sudo`/`env` prefixes (so `HTTPS_PROXY=x curl`,
// `sudo -E bash`, and `env VAR=x curl` read as the command they execute).
// Returns "" when the segment does not start with a recognizable command word.
export function segmentLeadCommand(line, lowerLine, start, end) {
  let index = start;
  const skipAssignments = () => {
    for (;;) {
      const token = shellToken(line, lowerLine, index, end);
      if (!token || !isEnvironmentAssignment(token.lower)) break;
      index = token.end;
    }
  };

  skipAssignments();
  const first = shellToken(line, lowerLine, index, end);
  if (first?.lower === "sudo") {
    index = first.end;
    for (;;) {
      const flag = shellToken(line, lowerLine, index, end);
      if (!flag || !flag.lower.startsWith("-")) break;
      index = flag.end;
      // A value-taking sudo flag in `-u root` / `--user root` form also consumes
      // the following token as its value, so the real command isn't mistaken for
      // the value (e.g. `bash` in `sudo -u root bash`).
      if (SUDO_VALUE_FLAGS.has(flag.lower)) {
        const value = shellToken(line, lowerLine, index, end);
        if (value) index = value.end;
      }
    }
    skipAssignments();
  }

  const maybeEnv = shellToken(line, lowerLine, index, end);
  if (maybeEnv?.lower === "env") {
    index = maybeEnv.end;
    for (;;) {
      const token = shellToken(line, lowerLine, index, end);
      if (!token) break;
      if (isEnvironmentAssignment(token.lower)) {
        index = token.end;
      } else if (token.lower.startsWith("-")) {
        index = token.end;
        if (ENV_VALUE_FLAGS.has(token.lower)) {
          const value = shellToken(line, lowerLine, index, end);
          if (value) index = value.end;
        }
      } else {
        break;
      }
    }
  }

  const command = shellToken(line, lowerLine, index, end);
  if (!command) return "";
  let wordEnd = command.start;
  while (wordEnd < command.end && isWordCharacter(line[wordEnd] || "")) {
    wordEnd += 1;
  }
  return lowerLine.slice(command.start, wordEnd);
}

// True when a pipe segment carries a base64 `-d`/`--decode` flag token.
export function segmentHasDecodeFlag(line, lowerLine, start, end) {
  let index = start;
  while (index < end) {
    while (index < end && /\s/.test(line[index] || "")) index += 1;
    if (index < end && line[index] === "-") {
      let flagEnd = index;
      while (flagEnd < end && !/\s/.test(line[flagEnd] || "")) flagEnd += 1;
      const flag = lowerLine.slice(index, flagEnd);
      if (flag === "-d" || flag === "--decode") return true;
      index = flagEnd;
    } else {
      while (index < end && !/\s/.test(line[index] || "")) index += 1;
    }
  }
  return false;
}

// True when a downloader's output reaches a shell later in the same pipe chain,
// tolerating benign passthrough commands (cat, tee, sed, …) and a `sudo [flags]`
// prefix between the download and the shell. Catches `curl | sh`,
// `curl | cat | bash`, and `curl | sudo -E bash`.
export function hasPipeToShellInstall(line, lowerLine) {
  let sawDownloader = false;
  for (const segment of pipeChainSegments(line)) {
    if (segment.barrier) {
      sawDownloader = false;
      continue;
    }
    const lead = segmentLeadCommand(
      line,
      lowerLine,
      segment.start,
      segment.end,
    );
    if (sawDownloader && SHELL_TOKENS.includes(lead)) return true;
    if (DOWNLOADER_TOKENS.includes(lead)) sawDownloader = true;
  }
  return false;
}

// True when a base64-decode segment feeds a shell later in the same pipe chain.
export function hasBase64DecodedShell(line, lowerLine) {
  let sawDecodedBase64 = false;
  for (const segment of pipeChainSegments(line)) {
    if (segment.barrier) {
      sawDecodedBase64 = false;
      continue;
    }
    const lead = segmentLeadCommand(
      line,
      lowerLine,
      segment.start,
      segment.end,
    );
    if (sawDecodedBase64 && SHELL_TOKENS.includes(lead)) return true;
    if (lead === "base64") {
      sawDecodedBase64 = segmentHasDecodeFlag(
        line,
        lowerLine,
        segment.start,
        segment.end,
      );
    }
  }
  return false;
}

// Each entry is a recognizable, high-confidence destructive or remote-exec
// pattern. Kept conservative to avoid flagging ordinary scripts.
export const DANGEROUS_CHECKS = [
  {
    label: "pipe-to-shell install",
    test: hasPipeToShellInstall,
  },
  {
    label: "recursive force remove",
    test: (line) => REMOVE_PATTERN.test(line),
  },
  {
    label: "world-writable chmod",
    test: (line) => CHMOD_PATTERN.test(line),
  },
  {
    label: "raw disk write",
    test: (line, lowerLine) =>
      (hasCommandToken(line, lowerLine, ["dd"]) &&
        lowerLine.includes("of=/dev/")) ||
      MKFS_PATTERN.test(line),
  },
  {
    label: "base64-decoded shell",
    test: hasBase64DecodedShell,
  },
  {
    label: "fork bomb",
    test: (line) => FORK_BOMB_PATTERN.test(line),
  },
  {
    label: "inline eval of command substitution",
    test: (line) => INLINE_EVAL_PATTERN.test(line),
  },
];

/**
 * Scan text for high-risk shell patterns.
 *
 * The scanner intentionally evaluates one line at a time with bounded,
 * command-token searches instead of running unanchored wildcard regexes across
 * the whole submission. That keeps reviewer-side package validation responsive
 * even when an attacker submits very long lines with many repeated prefixes.
 *
 * @param {unknown} text
 * @returns {string[]} Labels of the matched patterns (empty when none match).
 */
export function scanDangerousShellPatterns(text) {
  const value = String(text ?? "");
  if (!value) return [];

  const labels = new Set();
  for (const line of value.split(/\r?\n/)) {
    const lowerLine = line.toLowerCase();
    for (const { label, test } of DANGEROUS_CHECKS) {
      if (!labels.has(label) && test(line, lowerLine)) labels.add(label);
    }
    if (labels.size === DANGEROUS_CHECKS.length) break;
  }
  return [...labels];
}

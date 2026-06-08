// Heuristic detection of high-risk shell patterns in submitted text (skill
// scripts, MCP commands, install snippets). Advisory only — a triage signal for
// human/maintainer review, never a sandbox or a guarantee of safety.

const REMOVE_PATTERN = /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i;
const CHMOD_PATTERN = /\bchmod\s+(?:-R\s+)?0?777\b/i;
const MKFS_PATTERN = /\bmkfs(?:\.\w+)?\b/i;
const FORK_BOMB_PATTERN = /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/;
const INLINE_EVAL_PATTERN = /\beval\s+["'`]?\$\(/i;

// Sudo options that take a separate value token (`-u root`, `--user root`).
// Lowercased, so case variants collapse onto value-taking forms (e.g. `-U`
// → `-u`, `-R` → `-r`). The `--flag=value` form is self-contained and is not
// listed. `-h` is intentionally omitted because `sudo -h` alone prints help.
const SUDO_VALUE_FLAGS = new Set([
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

const SHELL_TOKENS = ["bash", "zsh", "sh"];
const DOWNLOADER_TOKENS = ["curl", "wget"];

function isWordCharacter(char) {
  return /[a-z0-9_]/i.test(char || "");
}

function findCommandToken(line, lowerLine, token, fromIndex = 0) {
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

function hasCommandToken(line, lowerLine, tokens) {
  return tokens.some(
    (token) => findCommandToken(line, lowerLine, token) !== -1,
  );
}

// Split a command line into pipe segments. Command separators (`;`, `&&`, `||`,
// `&`) end the current pipe chain so unrelated commands never merge into one
// dangerous chain (e.g. `curl x && cat y | sh` is two commands, not a
// download-piped-to-shell). Single bounded pass — no backtracking regex.
function pipeChainSegments(line) {
  const segments = [];
  let start = 0;
  let index = 0;
  const pushSegment = (end) => segments.push({ start, end });

  while (index < line.length) {
    const char = line[index];
    if (char === "|" && line[index + 1] === "|") {
      pushSegment(index);
      segments.push({ barrier: true });
      index += 2;
      start = index;
    } else if (char === "|") {
      pushSegment(index);
      index += 1;
      start = index;
    } else if (char === ";") {
      pushSegment(index);
      segments.push({ barrier: true });
      index += 1;
      start = index;
    } else if (char === "&") {
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

// First command word of a pipe segment, stepping over an optional `sudo [flags]`
// privilege prefix (so `sudo -E bash` and `sudo -u root bash` both read as
// `bash`). Returns "" when the segment does not start with a recognizable
// command word.
function segmentLeadCommand(line, lowerLine, start, end) {
  let index = start;
  const skipWhitespace = () => {
    while (index < end && /\s/.test(line[index] || "")) index += 1;
  };
  const skipToken = () => {
    while (index < end && !/\s/.test(line[index] || "")) index += 1;
  };

  skipWhitespace();
  if (
    lowerLine.startsWith("sudo", index) &&
    index + 4 <= end &&
    !isWordCharacter(line[index + 4] || "")
  ) {
    index += 4;
    for (;;) {
      skipWhitespace();
      if (index >= end || line[index] !== "-") break;
      const flagStart = index;
      skipToken();
      // A value-taking sudo flag in `-u root` / `--user root` form also consumes
      // the following token as its value, so the real command isn't mistaken for
      // the value (e.g. `bash` in `sudo -u root bash`).
      if (SUDO_VALUE_FLAGS.has(lowerLine.slice(flagStart, index))) {
        skipWhitespace();
        skipToken();
      }
    }
  }

  let wordEnd = index;
  while (wordEnd < end && isWordCharacter(line[wordEnd] || "")) wordEnd += 1;
  return lowerLine.slice(index, wordEnd);
}

// True when a pipe segment carries a base64 `-d`/`--decode` flag token.
function segmentHasDecodeFlag(line, lowerLine, start, end) {
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
function hasPipeToShellInstall(line, lowerLine) {
  let sawDownloader = false;
  for (const segment of pipeChainSegments(line)) {
    if (segment.barrier) {
      sawDownloader = false;
      continue;
    }
    const lead = segmentLeadCommand(line, lowerLine, segment.start, segment.end);
    if (sawDownloader && SHELL_TOKENS.includes(lead)) return true;
    if (DOWNLOADER_TOKENS.includes(lead)) sawDownloader = true;
  }
  return false;
}

// True when a base64-decode segment feeds a shell later in the same pipe chain.
function hasBase64DecodedShell(line, lowerLine) {
  let sawDecodedBase64 = false;
  for (const segment of pipeChainSegments(line)) {
    if (segment.barrier) {
      sawDecodedBase64 = false;
      continue;
    }
    const lead = segmentLeadCommand(line, lowerLine, segment.start, segment.end);
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
const DANGEROUS_CHECKS = [
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

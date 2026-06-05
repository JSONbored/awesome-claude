// Heuristic detection of high-risk shell patterns in submitted text (skill
// scripts, MCP commands, install snippets). Advisory only — a triage signal for
// human/maintainer review, never a sandbox or a guarantee of safety.

const REMOVE_PATTERN = /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i;
const CHMOD_PATTERN = /\bchmod\s+(?:-R\s+)?0?777\b/i;
const MKFS_PATTERN = /\bmkfs(?:\.\w+)?\b/i;
const FORK_BOMB_PATTERN = /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/;
const INLINE_EVAL_PATTERN = /\beval\s+["'`]?\$\(/i;

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

function hasShellAfterPipe(line, lowerLine, pipeIndex) {
  let index = pipeIndex + 1;
  while (/\s/.test(line[index] || "")) index += 1;

  if (
    lowerLine.startsWith("sudo", index) &&
    !isWordCharacter(line[index + 4] || "")
  ) {
    index += 4;
    while (/\s/.test(line[index] || "")) index += 1;
  }

  for (const shell of ["bash", "zsh", "sh"]) {
    if (
      lowerLine.startsWith(shell, index) &&
      !isWordCharacter(line[index + shell.length] || "")
    ) {
      return true;
    }
  }
  return false;
}

function hasTokenAt(line, lowerLine, token, index) {
  return (
    lowerLine.startsWith(token, index) &&
    !isWordCharacter(line[index - 1] || "") &&
    !isWordCharacter(line[index + token.length] || "")
  );
}

function hasAnyTokenAt(line, lowerLine, tokens, index) {
  return tokens.some((token) => hasTokenAt(line, lowerLine, token, index));
}

function hasPipeToShellInstall(line, lowerLine) {
  let sawDownloaderBeforePipe = false;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === "|") {
      if (
        sawDownloaderBeforePipe &&
        hasShellAfterPipe(line, lowerLine, index)
      ) {
        return true;
      }
      sawDownloaderBeforePipe = false;
    } else if (hasAnyTokenAt(line, lowerLine, ["curl", "wget"], index)) {
      sawDownloaderBeforePipe = true;
    }
  }
  return false;
}

function findBase64DecodeFlagEnd(line, lowerLine, commandEndIndex) {
  let index = commandEndIndex;
  let sawWhitespace = false;
  while (/\s/.test(line[index] || "")) {
    sawWhitespace = true;
    index += 1;
  }
  if (!sawWhitespace) return -1;

  for (const flag of ["--decode", "-d"]) {
    if (
      lowerLine.startsWith(flag, index) &&
      !isWordCharacter(line[index + flag.length] || "")
    ) {
      return index + flag.length;
    }
  }
  return -1;
}

function hasBase64DecodedShell(line, lowerLine) {
  let sawDecodedBase64BeforePipe = false;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === "|") {
      if (
        sawDecodedBase64BeforePipe &&
        hasShellAfterPipe(line, lowerLine, index)
      ) {
        return true;
      }
      sawDecodedBase64BeforePipe = false;
    } else if (hasTokenAt(line, lowerLine, "base64", index)) {
      sawDecodedBase64BeforePipe ||=
        findBase64DecodeFlagEnd(line, lowerLine, index + "base64".length) !==
        -1;
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

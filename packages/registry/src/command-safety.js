/**
 * Public shell-pattern safety scanner surface.
 *
 * Pure pipe-chain parsing, sudo/env prefix handling, and dangerous-pattern
 * heuristics live in `command-safety-lib.js`. This module re-exports that
 * surface so existing `@heyclaude/registry/command-safety` imports stay
 * unchanged.
 */
export {
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
} from "./command-safety-lib.js";

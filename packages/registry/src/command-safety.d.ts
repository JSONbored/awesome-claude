export const REMOVE_PATTERN: RegExp;
export const CHMOD_PATTERN: RegExp;
export const MKFS_PATTERN: RegExp;
export const FORK_BOMB_PATTERN: RegExp;
export const INLINE_EVAL_PATTERN: RegExp;

export const SUDO_VALUE_FLAGS: Set<string>;
export const SHELL_TOKENS: string[];
export const DOWNLOADER_TOKENS: string[];
export const ENV_VALUE_FLAGS: Set<string>;

export type PipeChainSegment =
  | { start: number; end: number; barrier?: undefined }
  | { barrier: true; start?: undefined; end?: undefined };

export type ShellToken = {
  start: number;
  end: number;
  lower: string;
};

export type ResolvedSegmentCommand = {
  command: string;
  argStart: number;
};

export type DangerousCheck = {
  label: string;
  test: (line: string, lowerLine: string) => boolean;
};

export const DANGEROUS_CHECKS: DangerousCheck[];

export function isWordCharacter(char: string | undefined): boolean;

export function findCommandToken(
  line: string,
  lowerLine: string,
  token: string,
  fromIndex?: number,
): number;

export function hasCommandToken(
  line: string,
  lowerLine: string,
  tokens: readonly string[],
): boolean;

export function pipeChainSegments(line: string): PipeChainSegment[];

export function shellTokenEnd(line: string, start: number, end: number): number;

export function shellToken(
  line: string,
  lowerLine: string,
  start: number,
  end: number,
): ShellToken | null;

export function isEnvironmentAssignment(token: string): boolean;

export function resolveSegmentCommand(
  line: string,
  lowerLine: string,
  start: number,
  end: number,
): ResolvedSegmentCommand;

export function segmentLeadCommand(
  line: string,
  lowerLine: string,
  start: number,
  end: number,
): string;

export function segmentArgTokens(
  line: string,
  lowerLine: string,
  start: number,
  end: number,
): string[];

export function hasRecursiveForceRemove(
  line: string,
  lowerLine: string,
): boolean;

export function hasWorldWritableChmod(
  line: string,
  lowerLine: string,
): boolean;

export function segmentHasDecodeFlag(
  line: string,
  lowerLine: string,
  start: number,
  end: number,
): boolean;

export function hasPipeToShellInstall(
  line: string,
  lowerLine: string,
): boolean;

export function hasBase64DecodedShell(
  line: string,
  lowerLine: string,
): boolean;

export function scanDangerousShellPatterns(text: unknown): string[];

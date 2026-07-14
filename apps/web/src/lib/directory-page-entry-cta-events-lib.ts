/**
 * Pure directory page entry egress analytics helpers.
 *
 * Maps changelog diff, platforms matrix, and tools directory entry navigation
 * to privacy-light event names without embedding entry titles or page copy.
 */

import type { ReleaseStream } from "@/data/changelog";
import type { Platform, PlatformSupport } from "@/types/registry";

export const CHANGELOG_DIFF_SURFACE = "changelog-diff";
export const PLATFORMS_MATRIX_SURFACE = "platforms-matrix";
export const TOOLS_DIRECTORY_SURFACE = "tools-directory";

export type ChangelogDiffChangeKind = "added" | "updated" | "removed";

export function directoryPageEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function changelogDiffEntryAnalyticsEvent(): string {
  return "changelog_diff_entry_click";
}

export function changelogDiffEntryAnalyticsData(
  category: string,
  slug: string,
  changeKind: ChangelogDiffChangeKind,
  rowIndex: number,
  rowCount: number,
  releaseStream: ReleaseStream,
) {
  return {
    entry: directoryPageEntryKey(category, slug),
    surface: CHANGELOG_DIFF_SURFACE,
    changeKind,
    rowIndex,
    rowCount,
    releaseStream,
  };
}

export function platformsMatrixEntryAnalyticsEvent(): string {
  return "platforms_matrix_entry_click";
}

export function platformsMatrixEntryAnalyticsData(
  category: string,
  slug: string,
  platformId: Platform,
  support: PlatformSupport,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: directoryPageEntryKey(category, slug),
    surface: PLATFORMS_MATRIX_SURFACE,
    platformId,
    support,
    rowIndex,
    rowCount,
  };
}

export function toolsDirectoryEntryAnalyticsEvent(): string {
  return "tools_directory_entry_click";
}

export function toolsDirectoryEntryAnalyticsData(
  slug: string,
  cardIndex: number,
  toolCount: number,
) {
  return {
    entry: directoryPageEntryKey("tools", slug),
    surface: TOOLS_DIRECTORY_SURFACE,
    cardIndex,
    toolCount,
  };
}

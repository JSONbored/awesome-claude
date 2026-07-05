/**
 * Platform hub pages surface.
 *
 * Pure platform page builders live in `platform-pages-lib.ts`. This module
 * re-exports that surface and keeps async entry-loading helpers here so
 * existing `@/lib/platform-pages` imports stay unchanged.
 */
export type {
  PlatformPage,
  PlatformPageDefinition,
  PlatformPageItem,
} from "@/lib/platform-pages-lib";
export {
  buildAllPlatformPages,
  buildPlatformPage,
  findPlatformPageDefinition,
  getPlatformPageDefinitions,
  platformPageDefinitions,
} from "@/lib/platform-pages-lib";

import { getAllEntries } from "@/lib/content.server";
import {
  buildAllPlatformPages,
  buildPlatformPage,
  findPlatformPageDefinition,
} from "@/lib/platform-pages-lib";

export async function getPlatformPages() {
  const entries = await getAllEntries();
  return buildAllPlatformPages(entries);
}

export async function getPlatformPage(slug: string) {
  const definition = findPlatformPageDefinition(slug);
  if (!definition) return null;
  const entries = await getAllEntries();
  return buildPlatformPage(definition, entries);
}

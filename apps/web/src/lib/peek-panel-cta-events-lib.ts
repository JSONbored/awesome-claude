/**
 * Pure peek panel CTA analytics and intent-event helpers.
 */

import {
  categoryPillBrowseDestination,
  type CategoryPillBrowseDestination,
} from "@/lib/category-pill-cta-events-lib";
import type { CopyVariant } from "@/lib/dossier-prefs";
import type { IntentEventClientType } from "@/lib/intent-event-client-lib";

export const PEEK_PANEL_SURFACE = "peek-panel";

export type PeekPanelAction = "dossier" | "source" | "docs";

export function peekPanelEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function peekCopyIntentType(variant: CopyVariant): IntentEventClientType {
  return variant === "install" ? "install" : "copy";
}

export function peekCopyAnalyticsEvent(variant: CopyVariant): string {
  return `peek_copy_${variant}`;
}

export function peekCopyAnalyticsData(category: string, slug: string, variant: CopyVariant) {
  return {
    entry: peekPanelEntryKey(category, slug),
    variant,
    surface: PEEK_PANEL_SURFACE,
  };
}

export function peekSnippetVariantSelectAnalyticsEvent(): string {
  return "peek_snippet_variant_select";
}

export function peekSnippetVariantSelectAnalyticsData(
  category: string,
  slug: string,
  variant: CopyVariant,
) {
  return {
    entry: peekPanelEntryKey(category, slug),
    variant,
    surface: PEEK_PANEL_SURFACE,
  };
}

export function peekPanelActionAnalyticsEvent(action: PeekPanelAction): string {
  return `peek_${action}`;
}

export function peekPanelActionAnalyticsData(
  category: string,
  slug: string,
  action: PeekPanelAction,
) {
  return {
    entry: peekPanelEntryKey(category, slug),
    action,
    surface: PEEK_PANEL_SURFACE,
  };
}

export function peekPanelOpenAnalyticsEvent(): string {
  return "peek_open";
}

export function peekPanelOpenAnalyticsData(category: string, slug: string) {
  return {
    entry: peekPanelEntryKey(category, slug),
    surface: PEEK_PANEL_SURFACE,
  };
}

export type PeekPanelEntryDestination = {
  to: "/entry/$category/$slug";
  params: { category: string; slug: string };
};

/** Map a peek panel entry ref to an entry detail destination. */
export function peekPanelEntryDestination(
  category: string,
  slug: string,
): PeekPanelEntryDestination | null {
  const cat = category.trim();
  const id = slug.trim();
  if (!cat || !id) return null;
  return { to: "/entry/$category/$slug", params: { category: cat, slug: id } };
}

export type PeekPanelCategoryDestination = CategoryPillBrowseDestination;

/** Map a peek panel category pill to a directory browse destination. */
export function peekPanelCategoryDestination(
  category: string,
): PeekPanelCategoryDestination | null {
  return categoryPillBrowseDestination(category);
}

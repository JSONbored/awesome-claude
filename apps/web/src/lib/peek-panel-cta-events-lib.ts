/**
 * Pure peek panel CTA analytics and intent-event helpers.
 */

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

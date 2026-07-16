/**
 * Pure keyboard shortcuts chrome analytics helpers.
 *
 * Maps shortcut dialog open and g-sequence navigation to privacy-light event
 * names without embedding key labels or free-text destinations.
 */

export const SHORTCUTS_CHROME_SURFACE = "shortcuts-chrome";

export type ShortcutsDialogOpenSource = "hotkey";

export function shortcutsDialogOpenAnalyticsEvent(): string {
  return "shortcuts_dialog_open";
}

export function shortcutsDialogOpenAnalyticsData(source: ShortcutsDialogOpenSource) {
  return {
    surface: SHORTCUTS_CHROME_SURFACE,
    source,
  };
}

export function shortcutsGNavAnalyticsEvent(): string {
  return "shortcuts_g_nav_click";
}

export function shortcutsGNavAnalyticsData(destination: string) {
  return {
    surface: SHORTCUTS_CHROME_SURFACE,
    destination,
  };
}

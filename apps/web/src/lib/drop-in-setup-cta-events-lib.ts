/**
 * Pure drop-in setup navigation analytics helpers.
 *
 * Maps config and verify snippet copy actions to privacy-light event names
 * without embedding snippet contents.
 */

export const DROP_IN_SETUP_SURFACE = "drop-in-setup";

export type DropInSetupCopyKind = "config" | "verify";

export type DropInSetupSurfaceType = "mcp-host" | "adapter" | "extension" | "web";

export function dropInSetupCopyAnalyticsEvent(): string {
  return "drop_in_setup_copy_click";
}

export function dropInSetupCopyAnalyticsData(
  clientId: string,
  surfaceType: DropInSetupSurfaceType,
  copyKind: DropInSetupCopyKind,
) {
  return {
    surface: DROP_IN_SETUP_SURFACE,
    clientId,
    surfaceType,
    copyKind,
  };
}

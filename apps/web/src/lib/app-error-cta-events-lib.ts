/**
 * Pure app error chrome navigation analytics helpers.
 *
 * Maps root error retry and home egress to privacy-light event names without
 * embedding error messages or stack traces.
 */

export const APP_ERROR_SURFACE = "app-error";

export type AppErrorDestination = "retry" | "home";

export function appErrorChromeAnalyticsEvent(): string {
  return "app_error_chrome_click";
}

export function appErrorChromeAnalyticsData(destination: AppErrorDestination) {
  return {
    surface: APP_ERROR_SURFACE,
    destination,
  };
}

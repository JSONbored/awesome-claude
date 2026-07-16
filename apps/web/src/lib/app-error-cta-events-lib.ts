/**
 * Pure app error chrome navigation analytics helpers.
 *
 * Maps root error retry/home and global not-found egress to privacy-light event
 * names without embedding error messages, stack traces, or pathnames.
 */

export const APP_ERROR_SURFACE = "app-error";
export const APP_NOTFOUND_SURFACE = "app-notfound";

export type AppErrorDestination = "retry" | "home";
export type AppNotFoundDestination = "browse" | "home";

export function appErrorChromeAnalyticsEvent(): string {
  return "app_error_chrome_click";
}

export function appErrorChromeAnalyticsData(destination: AppErrorDestination) {
  return {
    surface: APP_ERROR_SURFACE,
    destination,
  };
}

export function appNotFoundEgressAnalyticsEvent(): string {
  return "app_notfound_egress_click";
}

export function appNotFoundEgressAnalyticsData(destination: AppNotFoundDestination) {
  return {
    surface: APP_NOTFOUND_SURFACE,
    destination,
  };
}

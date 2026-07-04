/**
 * Trust posture surface.
 *
 * Pure trust reason builders live in `trust-lib.ts`. This module re-exports that
 * surface so existing `@/lib/trust` imports stay unchanged.
 */
export type { TrustSeverity, TrustReason, InstallRisk } from "@/lib/trust-lib";
export {
  getTrustReasons,
  summarizeTrust,
  installRiskLevel,
  INSTALL_RISK_LABEL,
  INSTALL_RISK_DETAIL,
} from "@/lib/trust-lib";

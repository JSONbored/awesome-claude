// Pure derivation of the environment variable name that holds the Resend
// segment id for a follow/list id. Shared by the newsletter subscribe and
// unsubscribe routes so the transform is defined (and tested) once.

/** Env var name for a follow id, e.g. "weekly-brief" -> RESEND_SEGMENT_WEEKLY_BRIEF. */
export function resendSegmentEnvKey(followId: string): string {
  return `RESEND_SEGMENT_${followId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
}

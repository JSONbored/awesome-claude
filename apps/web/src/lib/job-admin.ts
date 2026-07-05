/**
 * Job admin surface.
 *
 * Job admin helpers live in `job-admin-lib.ts`. This module re-exports that
 * surface so existing `@/lib/job-admin` imports stay unchanged.
 */
export {
  JobNotFoundError,
  JobPublicationQualityError,
  REQUIRED_JOB_COLUMNS,
  REQUIRED_JOBS_MIGRATION,
  checkJobsSchema,
  getJobsHealth,
  queryAdminJobBySlug,
  queryAdminJobs,
  updateAdminJobState,
  upsertAdminJob,
  type JobAdminAction,
  type JobAdminListFilters,
  type JobAdminUpsertInput,
} from "@/lib/job-admin-lib";

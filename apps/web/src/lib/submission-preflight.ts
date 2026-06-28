import { buildSubmissionPrDraft, validateSubmission } from "@heyclaude/registry/submission";
import { analyzeSubmissionDraftRisk } from "@heyclaude/registry/submission-risk";

import { getDirectoryEntries } from "@/lib/content.server";
import {
  buildPreflightIssues,
  buildSubmissionPrPreview,
  findDuplicateCandidates,
  normalizePreflightError,
  normalizePreflightText,
  resolvePreflightRouteSuggestion,
  TOOL_LISTING_FORM_URL,
} from "@/lib/submission-preflight-lib";

function missingNoteWarnings(risk: ReturnType<typeof analyzeSubmissionDraftRisk>) {
  const warnings = risk.classificationWarnings ?? [];
  const safety = warnings.find((item) => item.id === "missing_safety_notes");
  const privacy = warnings.find((item) => item.id === "missing_privacy_notes");
  return { safety, privacy };
}

export async function buildSubmissionPreflight(fields: Record<string, unknown>) {
  const draft = buildSubmissionPrDraft({
    ...fields,
    submitted_via: "website-preflight",
  });
  const validation = validateSubmission({
    title: draft.title,
    body: draft.body,
  });
  const risk = analyzeSubmissionDraftRisk(
    {
      title: draft.title,
      body: draft.body,
      author: "website-preflight",
    },
    validation,
  );
  const category = normalizePreflightText(validation.category || risk.subject?.category);
  const slug = normalizePreflightText(validation.fields?.slug || risk.subject?.slug);
  const entries = await getDirectoryEntries().catch((error) => {
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "warn",
        event: "submissions.preflight.directory_entries_failed",
        error: normalizePreflightError(error),
      }),
    );
    return [];
  });
  const duplicates = findDuplicateCandidates({
    entries,
    fields: validation.fields || fields,
    category,
    slug,
  });
  const noteWarnings = missingNoteWarnings(risk);
  const sourceGate = risk.policyMatrix?.source;
  const { blockers, warnings, shouldRouteCommercial } = buildPreflightIssues({
    validationSkipped: Boolean(validation.skipped),
    validationErrors: validation.errors || [],
    category,
    fields: validation.fields || fields,
    duplicates,
    sourceGateStatus: sourceGate?.status,
    sourceGateSummary: sourceGate?.summary,
    missingSafetySummary: noteWarnings.safety?.summary,
    missingPrivacySummary: noteWarnings.privacy?.summary,
  });

  const routeSuggestion = resolvePreflightRouteSuggestion({
    validationErrors: validation.errors || [],
    shouldRouteCommercial,
    blockers,
    policyDecision: risk.policyDecision,
    riskTier: risk.riskTier,
  });

  const response = {
    ok: true,
    valid: routeSuggestion === "submit_pr",
    routeSuggestion,
    category,
    slug,
    schema: {
      ok: validation.ok,
      skipped: validation.skipped,
      errors: validation.errors || [],
      warnings: validation.warnings || [],
      fields: validation.fields || {},
    },
    risk: {
      tier: risk.riskTier,
      policyDecision: risk.policyDecision,
      policyMatrix: risk.policyMatrix || {},
      reviewFlags: risk.reviewFlags || [],
      classificationWarnings: risk.classificationWarnings || [],
    },
    expectedNotes: {
      safety: Boolean(noteWarnings.safety),
      privacy: Boolean(noteWarnings.privacy),
      reasons: [noteWarnings.safety?.detail, noteWarnings.privacy?.detail].filter(Boolean),
    },
    blockers,
    warnings,
    duplicates,
    nextAction:
      routeSuggestion === "route_away"
        ? {
            label: "Use the paid/editorial tool listing flow",
            url: TOOL_LISTING_FORM_URL,
          }
        : routeSuggestion === "fix_required"
          ? {
              label: "Fix blockers before opening a submission",
            }
          : routeSuggestion === "manual_review"
            ? {
                label: "Prepare a single-entry PR with extra source and safety context",
              }
            : {
                label: "Prepare a single-entry content PR",
              },
  };
  return routeSuggestion === "submit_pr"
    ? { ...response, prPreview: buildSubmissionPrPreview(draft, category, slug) }
    : response;
}

export function contributorSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function authorMatchesSubmitter(author?: string, submittedBy?: string) {
  if (!author || !submittedBy) return false;
  const authorSlug = contributorSlug(author);
  const submittedBySlug = contributorSlug(submittedBy);
  return Boolean(authorSlug && authorSlug === submittedBySlug);
}

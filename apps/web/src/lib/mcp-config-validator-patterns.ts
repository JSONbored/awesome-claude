function chars(...codes: number[]) {
  return String.fromCharCode(...codes);
}

function secretValuePatternSource() {
  const ghPrefix = `${chars(103, 104)}[pousr]_`;
  const githubPat = `${chars(103, 105, 116, 104, 117, 98, 95, 112, 97, 116, 95)}`;
  const glpat = chars(103, 108, 112, 97, 116, 45);
  const sk = chars(115, 107, 45);
  const slackPrefix = `${chars(120, 111, 120)}[baprs]-`;
  const awsPrefix = `${chars(65, 75, 73, 65)}[0-9A-Z]{16}`;
  const googlePrefix = `${chars(65, 73, 122, 97)}[0-9A-Za-z_-]{20,}`;
  const bearer = "Bearer\\s+[A-Za-z0-9._~+/=-]{16,}";
  return `\\b(${ghPrefix}[A-Za-z0-9_]{20,}|${githubPat}[A-Za-z0-9_]{40,}|${glpat}[A-Za-z0-9_-]{20,}|${sk}(?:proj-)?[A-Za-z0-9_-]{20,}|${slackPrefix}[A-Za-z0-9-]{20,}|${awsPrefix}|${googlePrefix}|${bearer})\\b`;
}

export const SECRET_VALUE_PATTERN = new RegExp(secretValuePatternSource());

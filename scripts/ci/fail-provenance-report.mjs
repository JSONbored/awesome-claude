import fs from "node:fs";

const reportPath = process.argv[2] || ".github/tmp/submission-risk.json";

if (!fs.existsSync(reportPath)) {
  console.error(`Submission provenance report does not exist: ${reportPath}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
} catch (error) {
  console.error(
    `Could not parse submission provenance report ${reportPath}: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exit(1);
}

const blockers = (report.provenanceFindings || []).filter(
  (finding) => finding.blocking,
);

if (report.provenanceStatus === "failed" || blockers.length) {
  console.error("Submission provenance validation found blockers:");
  for (const finding of blockers) {
    console.error(`- ${finding.summary} (${finding.id})`);
    if (finding.detail) console.error(`  ${finding.detail}`);
  }
  process.exit(1);
}

console.log(
  `Submission provenance status is ${report.provenanceStatus || "not_applicable"}; no provenance blockers.`,
);

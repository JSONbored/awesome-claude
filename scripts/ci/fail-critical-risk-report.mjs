import fs from "node:fs";

const reportPath = process.argv[2] || ".github/tmp/submission-risk.json";

if (!fs.existsSync(reportPath)) {
  console.error(`Security/safety risk report does not exist: ${reportPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

if (report.riskTier === "critical") {
  console.error("Submission security/safety review found critical blockers:");
  for (const flag of report.reviewFlags || []) {
    if (flag.severity === "critical") {
      console.error(`- ${flag.summary} (${flag.id})`);
    }
  }
  process.exit(1);
}

console.log(
  `Submission security/safety risk tier is ${report.riskTier}; no critical blockers.`,
);

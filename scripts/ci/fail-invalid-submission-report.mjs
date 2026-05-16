import fs from "node:fs";

let reportPath = ".github/tmp/submission-validation.json";
let informational = false;

for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (arg === "--informational" || arg === "--allow-invalid") {
    informational = true;
    continue;
  }
  if (arg === "--report") {
    reportPath = process.argv[index + 1] || "";
    index += 1;
    continue;
  }
  console.error(`Unknown argument: ${arg}`);
  process.exit(1);
}

if (!fs.existsSync(reportPath)) {
  console.error(`Submission issue validation report not found: ${reportPath}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
} catch (error) {
  console.error(
    `Could not read submission issue validation report: ${error.message}`,
  );
  process.exit(1);
}

if (report.skipped) {
  console.log("Submission issue validation skipped.");
  process.exit(0);
}

if (!report.ok) {
  if (informational) {
    console.log(
      "Submission issue validation failed; issue workflow is informational.",
    );
    process.exit(0);
  }
  console.error("Submission issue validation failed.");
  process.exit(1);
}

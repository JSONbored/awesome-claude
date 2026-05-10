import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

export const packageName = String(packageJson.name || "@heyclaude/mcp");
export const packageVersion = String(packageJson.version || "0.0.0");

#!/usr/bin/env node
import { parseCliArgs, renderHelp } from "./cli-options.js";
import { packageVersion } from "./package-metadata.js";
import { runRemoteStdioProxy } from "./remote-proxy.js";
import { runStdioServer } from "./server.js";

async function main() {
  const options = parseCliArgs(process.argv.slice(2), process.env);
  if (options.help) {
    console.log(renderHelp());
    return;
  }
  if (options.version) {
    console.log(packageVersion);
    return;
  }
  if (options.mode === "local") {
    await runStdioServer({ dataDir: options.dataDir });
    return;
  }
  await runRemoteStdioProxy({
    url: options.url,
    timeoutMs: options.timeoutMs,
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

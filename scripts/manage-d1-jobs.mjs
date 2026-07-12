#!/usr/bin/env node
import fs from "node:fs";

import { getBaseUrl, getToken, parseArgs } from "./lib/d1-jobs-cli.mjs";

function usage() {
  console.log(`Usage:
  pnpm jobs:admin health --base-url https://dev.example.com
  pnpm jobs:admin list --base-url https://dev.example.com [--status active]
  pnpm jobs:admin upsert --base-url https://dev.example.com --file job.json
  pnpm jobs:admin transition --base-url https://dev.example.com --slug job-slug --action activate

Requires ADMIN_API_TOKEN, LEADS_ADMIN_TOKEN, or ADMIN_LEADS_TOKEN.`);
}

async function requestJson(pathname, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Missing ADMIN_API_TOKEN.");
  const response = await fetch(pathname, {
    ...options,
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(payload)}`,
    );
  }
  return payload;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.command || args.command === "--help" || args.command === "help") {
    usage();
    return;
  }

  const baseUrl = getBaseUrl(args);

  if (args.command === "health") {
    console.log(
      JSON.stringify(
        await requestJson(`${baseUrl}/api/admin/jobs/health`),
        null,
        2,
      ),
    );
    return;
  }

  if (args.command === "list") {
    const url = new URL(`${baseUrl}/api/admin/jobs`);
    for (const key of ["status", "tier", "source", "sourceKind", "limit"]) {
      if (args[key]) url.searchParams.set(key, args[key]);
    }
    console.log(JSON.stringify(await requestJson(url.toString()), null, 2));
    return;
  }

  if (args.command === "upsert") {
    if (!args.file) throw new Error("Missing --file for upsert.");
    const payload = JSON.parse(fs.readFileSync(args.file, "utf8"));
    console.log(
      JSON.stringify(
        await requestJson(`${baseUrl}/api/admin/jobs`, {
          method: "POST",
          body: JSON.stringify(payload),
        }),
        null,
        2,
      ),
    );
    return;
  }

  if (args.command === "transition") {
    if (!args.slug || !args.action) {
      throw new Error("Missing --slug or --action for transition.");
    }
    console.log(
      JSON.stringify(
        await requestJson(`${baseUrl}/api/admin/jobs`, {
          method: "PATCH",
          body: JSON.stringify({
            slug: args.slug,
            action: args.action,
            checkedAt: args["checked-at"] || "",
            expiresAt: args["expires-at"] || "",
          }),
        }),
        null,
        2,
      ),
    );
    return;
  }

  throw new Error(`Unknown command: ${args.command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

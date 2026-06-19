import fs from "node:fs";
import path from "node:path";

import prettier from "prettier";
import categorySpec from "@heyclaude/registry/category-spec";
import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content");
const readmePath = path.join(repoRoot, "README.md");
const checkMode = process.argv.includes("--check");
const stdoutMode = process.argv.includes("--stdout");

const categoryOrder = categorySpec.categoryOrder;

const categoryHeadings = {
  agents: "## 🤖 AI Agents",
  collections: "## 📦 Collections",
  commands: "## ⌨️ Commands",
  guides: "## 📚 Guides",
  hooks: "## 🪝 Hooks",
  mcp: "## 🔌 MCP Servers",
  rules: "## 📏 Rules",
  skills: "## 🧠 Skills",
  statuslines: "## 📟 Statuslines",
  tools: "## 🧰 Tools",
};

function readEntries(category) {
  const categoryDir = path.join(contentRoot, category);
  return fs
    .readdirSync(categoryDir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort()
    .map((fileName) => {
      const source = fs.readFileSync(path.join(categoryDir, fileName), "utf8");
      const { data } = parseSafeFrontmatter(source);
      return {
        title: String(data.title ?? fileName.replace(/\.mdx$/, "")),
        slug: String(data.slug ?? fileName.replace(/\.mdx$/, "")),
        description: String(data.description ?? ""),
      };
    });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function headingAnchor(category) {
  return (categoryHeadings[category] ?? category)
    .replace(/^#+\s*/, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function readmeEntryLine(category, entry) {
  return `- **[${entry.title}](https://heyclau.de/entry/${category}/${entry.slug})** - ${entry.description}`;
}

const entriesByCategory = Object.fromEntries(
  categoryOrder.map((category) => [category, readEntries(category)]),
);

const categoryIcons = {
  agents: "🤖",
  collections: "📦",
  commands: "⌨️",
  guides: "📚",
  hooks: "🪝",
  mcp: "🔌",
  rules: "📏",
  skills: "🧠",
  statuslines: "📟",
  tools: "🧰",
};

const categoryGrid = Array.from(
  { length: Math.ceil(categoryOrder.length / 5) },
  (_, rowIndex) => categoryOrder.slice(rowIndex * 5, rowIndex * 5 + 5),
)
  .map((row) => {
    const cells = row
      .map((category) => {
        const entries = entriesByCategory[category] ?? [];
        const spec = categorySpec.categories[category];
        const label = spec?.label ?? category;
        const description = spec?.description ?? "";
        return `<td align="center" width="20%">
          <a href="#${headingAnchor(category)}"><strong>${categoryIcons[category] ?? "•"} ${escapeHtml(label)}</strong></a><br>
          <code>${entries.length}</code><br>
          <sub>${escapeHtml(description)}</sub>
        </td>`;
      })
      .join("\n");
    return `<tr>
${cells}
</tr>`;
  })
  .join("\n");

const sections = categoryOrder
  .map((category) => {
    const entries = entriesByCategory[category] ?? [];
    if (!entries.length) return "";

    const lines = [
      `${categoryHeadings[category] ?? `## ${category}`} (${entries.length})`,
      "",
      ...entries.map((entry) => readmeEntryLine(category, entry)),
    ];

    return lines.join("\n");
  })
  .filter(Boolean)
  .join("\n\n");

const total = categoryOrder.reduce(
  (sum, category) => sum + (entriesByCategory[category] ?? []).length,
  0,
);

const readme = `<table>
  <tr>
    <td width="58%" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://heyclau.de/heyclaude-wordmark-dark.svg">
        <img src="https://heyclau.de/heyclaude-wordmark.svg" alt="HeyClaude" width="260">
      </picture>
      <h3>Curated Claude workflow infrastructure.</h3>
      <p>
        HeyClaude is a file-backed, human-reviewed directory for Claude agents,
        MCP servers, skills, hooks, commands, tools, prompts, rules, guides,
        templates, and statuslines.
      </p>
      <p>
        <strong>${total}+ file-backed entries</strong> stay useful as both an
        awesome-list catalog and a machine-readable registry for builders.
      </p>
      <p>
        <a href="https://heyclau.de"><img alt="Website" src="https://img.shields.io/badge/Website-heyclau.de-c855a0?style=for-the-badge&logo=googlechrome&logoColor=white"></a>
        <a href="https://heyclau.de/browse"><img alt="Browse" src="https://img.shields.io/badge/Browse-directory-2d7ff9?style=for-the-badge&logo=icloud&logoColor=white"></a>
        <a href="https://heyclau.de/submit"><img alt="Submit" src="https://img.shields.io/badge/Submit-resource-36b37e?style=for-the-badge&logo=githubsponsors&logoColor=white"></a>
      </p>
      <p>
        <a href="https://heyclau.de/api-docs"><img alt="API docs" src="https://img.shields.io/badge/API-docs-111827?style=flat-square&logo=openapiinitiative&logoColor=white"></a>
        <a href="packages/mcp"><img alt="MCP package" src="https://img.shields.io/badge/MCP-package-7c3aed?style=flat-square&logo=npm&logoColor=white"></a>
        <a href="https://heyclau.de/api/mcp"><img alt="Remote MCP endpoint" src="https://img.shields.io/badge/Remote-MCP-7c3aed?style=flat-square&logo=protocolsdotio&logoColor=white"></a>
        <a href="integrations/raycast"><img alt="Raycast" src="https://img.shields.io/badge/Raycast-extension-ff6363?style=flat-square&logo=raycast&logoColor=white"></a>
        <a href="https://heyclau.de/llms-full.txt"><img alt="LLM export" src="https://img.shields.io/badge/LLM-export-0f766e?style=flat-square&logo=readme&logoColor=white"></a>
        <a href="https://heyclau.de/api/registry/feed"><img alt="Registry feed" src="https://img.shields.io/badge/Registry-feed-2563eb?style=flat-square&logo=json&logoColor=white"></a>
        <a href="https://heyclau.de/feed.xml"><img alt="RSS feed" src="https://img.shields.io/badge/RSS-feed-f97316?style=flat-square&logo=rss&logoColor=white"></a>
        <a href="https://heyclau.de/jobs"><img alt="Jobs" src="https://img.shields.io/badge/Jobs-board-8b5cf6?style=flat-square&logo=briefcase&logoColor=white"></a>
        <a href="https://heyclau.de/claim"><img alt="Claim or update" src="https://img.shields.io/badge/Claim-update-c855a0?style=flat-square&logo=github&logoColor=white"></a>
      </p>
    </td>
    <td width="42%" valign="top">
      <h3>Registry snapshot</h3>
      <table>
        <tr>
          <td align="center"><strong>${total}</strong><br><sub>entries</sub></td>
          <td align="center"><strong>${categoryOrder.length}</strong><br><sub>sections</sub></td>
          <td align="center"><strong>human</strong><br><sub>merge gate</sub></td>
        </tr>
        <tr>
          <td align="center"><strong>source</strong><br><sub>first UGC</sub></td>
          <td align="center"><strong>no ZIP</strong><br><sub>community uploads</sub></td>
          <td align="center"><strong>API</strong><br><sub>MCP + feeds</sub></td>
        </tr>
      </table>
      <p>
        <a href="https://github.com/hesreallyhim/awesome-claude-code/blob/main/README_ALTERNATIVES/README_EXTRA.md#workflows--knowledge-guides-"><img src="https://awesome.re/mentioned-badge.svg" alt="Mentioned in Awesome Claude Code"></a>
      </p>
      <p>
        <a href="https://gittensor.io/repositories"><img src="https://gittensor.io/favicon.ico" alt="" height="16" align="absmiddle"> <strong>Listed on Gittensor</strong></a><br>
        <sub>Unofficial community project. Contribution eligibility and rewards follow Gittensor's current rules.</sub>
      </p>
    </td>
  </tr>
</table>

## Explore The Directory

<table>
${categoryGrid}
</table>

## Choose Your Path

<table>
  <tr>
    <td width="25%" valign="top">
      <h3>🔎 Discover</h3>
      <p>Search the curated directory and jump from README entries into richer detail pages.</p>
      <p><a href="https://heyclau.de/browse"><strong>Browse resources</strong></a></p>
    </td>
    <td width="25%" valign="top">
      <h3>🧾 Contribute</h3>
      <p>Submit free, source-backed Claude resources through PR-first private-gate review.</p>
      <p><a href="https://heyclau.de/submit"><strong>Submit content</strong></a></p>
    </td>
    <td width="25%" valign="top">
      <h3>⚙️ Integrate</h3>
      <p>Use the registry as JSON, RSS, Atom, LLM text, Raycast data, or a read-only MCP server.</p>
      <p><a href="https://heyclau.de/api-docs"><strong>API docs</strong></a> · <a href="packages/mcp">MCP package</a></p>
    </td>
    <td width="25%" valign="top">
      <h3>💼 List</h3>
      <p>Claim an entry, post a Claude role, or route commercial listings through the website.</p>
      <p><a href="https://heyclau.de/claim"><strong>Claim/update</strong></a> · <a href="https://heyclau.de/jobs">Jobs</a></p>
    </td>
  </tr>
</table>

<details>
<summary><strong>Contributor rules, docs, and local validation</strong></summary>

### Contributor Guardrails

Free Claude resources use PR-first intake by default. Fully valid,
source-backed, content-only submissions may be merged automatically after
content validation, Superagent, and private maintainer-agent review pass. Tool,
app, service promotion, listing claims, and jobs use the website lead forms
instead of GitHub content submissions.

\`README.md\`, \`apps/web/public/data/**\`, \`apps/web/src/generated/**\`,
\`apps/web/src/routeTree.gen.ts\`, and \`apps/web/public/downloads/**\` are
generated or maintainer-owned outputs. Direct contributors should not edit them
in content PRs.

Community submissions may link to source repositories, documentation, install
commands, or full copyable content. Community-submitted ZIP/MCPB packages are
not published as HeyClaude-hosted downloads. Maintainer-built convenience
packages use checksums and package trust metadata after review.

### Project Docs

| Area | Links |
| --- | --- |
| Community | [Contributing](CONTRIBUTING.md), [Code of conduct](CODE_OF_CONDUCT.md), [Security policy](SECURITY.md), [License](LICENSE) |
| Content model | [Registry schema](content/SCHEMA.md), [content examples](examples/content/README.md), [submit flow](https://heyclau.de/submit) |
| Packages | [Registry package](packages/registry), [read-only MCP server](packages/mcp), [Raycast extension](integrations/raycast) |
| Operations | [Submission gate ops](docs/submission-queue-ops.md), [package trust model](docs/package-security-policy.md), [API security contract](docs/api-security-contract.md), [deployment](apps/web/DEPLOYMENT.md) |
| Public policy | [Legal/disclaimer](https://heyclau.de/legal), [claim/update](https://heyclau.de/claim), [advertise](https://heyclau.de/advertise) |

### Local Validation

1. Direct content PRs should add or update exactly one \`content/<category>/<slug>.mdx\` file.
2. For direct content PRs, run \`pnpm validate:content:strict\` and do not commit generated output.
3. For platform, package, API, MCP, Raycast, or maintainer artifact work, run \`pnpm --filter web run prebuild\`, \`pnpm validate:packages\`, \`pnpm scan:packages\`, \`pnpm validate:clean\`, \`pnpm audit:content\`, \`pnpm validate:raycast-feed\`, \`pnpm test:mcp\`, \`pnpm test:registry-artifacts\`, \`pnpm test:seo-jsonld\`, \`pnpm test:commercial-intake\`, \`MCP_ENDPOINT_URL=http://localhost:3000/api/mcp pnpm --filter @heyclaude/mcp validate:endpoint\`, and \`pnpm build\` as relevant.
4. Generated registry, route, package-download, and README artifacts are build or maintainer automation outputs, not normal content PR diffs.

</details>

---

## Content Catalog

${sections}

---

<div align="center">

## Repository Pulse

<a href="https://www.star-history.com/#JSONbored/awesome-claude&Date">
  <img src="https://api.star-history.com/svg?repos=JSONbored/awesome-claude&type=Date" alt="Star History Chart" width="760">
</a>

<br><br>

<img src="https://repobeats.axiom.co/api/embed/c2b1b7e36103fba7a650c6d7f2777cba7338a1f7.svg" alt="RepoBeats Analytics" width="760">

### Contributors

<a href="https://github.com/JSONbored/awesome-claude/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=JSONbored/awesome-claude" alt="HeyClaude contributors" />
</a>

---

<p>
  <a href="https://heyclau.de"><img alt="Website" src="https://img.shields.io/badge/Website-heyclau.de-c855a0?style=flat-square&logo=googlechrome&logoColor=white"></a>
  <a href="https://github.com/JSONbored/awesome-claude"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github&logoColor=white"></a>
  <a href="https://discord.gg/Ax3Py4YDrq"><img alt="Discord" src="https://img.shields.io/badge/Discord-community-5865f2?style=flat-square&logo=discord&logoColor=white"></a>
  <a href="https://x.com/jsonbored"><img alt="X" src="https://img.shields.io/badge/X-jsonbored-000000?style=flat-square&logo=x&logoColor=white"></a>
  <a href="CONTRIBUTING.md"><img alt="Contributing" src="https://img.shields.io/badge/Contributing-guide-36b37e?style=flat-square&logo=github&logoColor=white"></a>
  <a href="CODE_OF_CONDUCT.md"><img alt="Code of conduct" src="https://img.shields.io/badge/Code_of_Conduct-community-7c3aed?style=flat-square&logo=github&logoColor=white"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-111827?style=flat-square&logo=opensourceinitiative&logoColor=white"></a>
</p>

</div>
`;

const formattedReadme = await prettier.format(readme, { parser: "markdown" });

function validateReadmeCatalog(readmeContent) {
  const errors = [];

  if (!readmeContent.includes(`${total}+ file-backed entries`)) {
    errors.push(`README total count does not match ${total}.`);
  }

  for (const category of categoryOrder) {
    const entries = entriesByCategory[category] ?? [];
    const spec = categorySpec.categories[category];
    const label = spec?.label ?? category;
    const gridCardPattern = new RegExp(
      `<a href="#${escapeRegExp(headingAnchor(category))}"><strong>[^<]*${escapeRegExp(
        label,
      )}</strong></a><br>\\s*<code>${entries.length}</code>`,
    );

    if (!gridCardPattern.test(readmeContent)) {
      errors.push(
        `README Explore card for ${category} does not show ${entries.length}.`,
      );
    }

    const heading = `${categoryHeadings[category] ?? `## ${category}`} (${
      entries.length
    })`;
    if (!readmeContent.includes(heading)) {
      errors.push(
        `README section heading is missing or stale for ${category}.`,
      );
    }

    // Prettier escapes markdown-significant punctuation in prose (e.g. `*.md`
    // becomes `\*.md`), so compare descriptions against an un-escaped view of
    // the rendered README — otherwise any description containing `*`, `_`, `[`,
    // etc. falsely reads as "missing".
    const unescapedReadme = readmeContent.replace(/\\([^0-9A-Za-z\s])/g, "$1");
    for (const entry of entries) {
      const url = `https://heyclau.de/entry/${category}/${entry.slug}`;
      if (!readmeContent.includes(url)) {
        errors.push(`README catalog is missing ${category}/${entry.slug}.`);
      }
      if (entry.description && !unescapedReadme.includes(entry.description)) {
        errors.push(
          `README catalog is missing the frontmatter description for ${category}/${entry.slug}.`,
        );
      }
    }
  }

  if (errors.length) {
    throw new Error(`README catalog validation failed:\n${errors.join("\n")}`);
  }
}

validateReadmeCatalog(formattedReadme);

if (stdoutMode) {
  process.stdout.write(formattedReadme);
} else if (checkMode) {
  const current = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf8")
    : "";
  if (current !== formattedReadme) {
    console.error("README.md is out of date. Run pnpm generate:readme.");
    process.exit(1);
  }
  validateReadmeCatalog(current);
  console.log("README.md is up to date.");
} else {
  fs.writeFileSync(readmePath, formattedReadme);
  console.log(`Updated ${path.relative(repoRoot, readmePath)}`);
}

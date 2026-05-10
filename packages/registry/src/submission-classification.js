export const TOOLS_LISTING_FLOW_URL = "https://heyclau.de/tools/submit";
export const TOOLS_CATEGORY = "tools";

const TOOL_LISTING_REVIEW_FIELDS = [
  ["websiteUrl", ["website_url", "websiteUrl"]],
  ["documentationUrl", ["docs_url", "documentationUrl"]],
  ["pricingModel", ["pricing_model", "pricingModel"]],
  ["disclosure", ["disclosure"]],
  ["applicationCategory", ["application_category", "applicationCategory"]],
  ["operatingSystem", ["operating_system", "operatingSystem"]],
];

function normalizeText(value) {
  return String(value ?? "").trim();
}

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function fieldValue(fields = {}, aliases = []) {
  for (const alias of aliases) {
    const value = normalizeText(fields[alias]);
    if (value) return value;
  }
  return "";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function toolListingSignals(fields = {}, text = "") {
  const body = lower(
    [
      text,
      fields.name,
      fields.title,
      fields.description,
      fields.card_description,
      fields.cardDescription,
      fields.tags,
      fields.pricing_model,
      fields.pricingModel,
      fields.disclosure,
      fields.website_url,
      fields.websiteUrl,
      fields.docs_url,
      fields.documentationUrl,
    ].join("\n"),
  );
  const signals = [];

  if (fieldValue(fields, ["website_url", "websiteUrl"])) {
    signals.push("website_url");
  }
  if (fieldValue(fields, ["pricing_model", "pricingModel"])) {
    signals.push("pricing_model");
  }
  if (fieldValue(fields, ["disclosure"])) {
    signals.push("disclosure");
  }

  const patterns = [
    ["hosted_app", /\bhosted\s+(app|application|product|service|platform)\b/i],
    ["desktop_app", /\b(desktop app|desktop application|native app)\b/i],
    ["web_app", /\b(web app|web application)\b/i],
    ["mobile_app", /\b(mobile app|mobile application)\b/i],
    [
      "runtime_app",
      /\b(local ai agent runtime|agentic ai runtime|ai runtime|runs on your machine)\b/i,
    ],
    ["product", /\b(product|commercial product|software product)\b/i],
    ["software", /\b(software|application)\b/i],
    ["saas", /\b(saas|software as a service)\b/i],
    ["service", /\b(service|platform|workspace|dashboard|interface)\b/i],
    [
      "subscription",
      /\b(subscription|pricing|paid plan|pro plan|free trial|free to try|no credit card)\b/i,
    ],
    ["features_page", /\b(features page|demo url|product url|website url)\b/i],
    ["placement", /\b(featured|sponsored|affiliate|preferred placement)\b/i],
  ];

  for (const [signal, pattern] of patterns) {
    if (pattern.test(body)) signals.push(signal);
  }

  return unique(signals);
}

export function looksLikeMcpServerSubmission(fields = {}, text = "") {
  const body = lower(
    [
      text,
      fields.name,
      fields.title,
      fields.description,
      fields.card_description,
      fields.cardDescription,
      fields.install_command,
      fields.installCommand,
      fields.usage_snippet,
      fields.usageSnippet,
    ].join("\n"),
  );

  return (
    /\bmcp\s+(server|endpoint|tool|transport|config|configuration)\b/i.test(
      body,
    ) || /\bclaude\s+mcp\s+add\b/i.test(body)
  );
}

export function looksLikeToolAppListing(fields = {}, text = "") {
  const category = lower(fields.category);
  if (category === "mcp" && looksLikeMcpServerSubmission(fields, text)) {
    return false;
  }
  const signals = toolListingSignals(fields, text);
  const hardSignals = new Set([
    "hosted_app",
    "desktop_app",
    "web_app",
    "mobile_app",
    "runtime_app",
    "product",
    "software",
    "saas",
    "subscription",
    "features_page",
    "placement",
  ]);
  return (
    signals.length >= 2 || signals.some((signal) => hardSignals.has(signal))
  );
}

export function missingToolListingReviewFields(fields = {}) {
  const missing = [];
  for (const [label, aliases] of TOOL_LISTING_REVIEW_FIELDS) {
    if (!fieldValue(fields, aliases)) missing.push(label);
  }
  return missing;
}

export function toolListingRoutingMessage() {
  return `Tools, apps, services, and products belong in the tools/app listing flow: ${TOOLS_LISTING_FLOW_URL}`;
}

export function toolListingApprovalMessage() {
  return `Tools, apps, services, and products are not imported from the free resource queue without maintainer approval. Use ${TOOLS_LISTING_FLOW_URL} or have a maintainer apply accepted/import-approved after review.`;
}

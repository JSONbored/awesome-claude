import { categorySpec } from "@heyclaude/registry/category-spec";

type CategorySpecEntry = {
  label: string;
  description: string;
  seoDescription?: string;
  usageHint: string;
  quickstart?: string[];
};

const categories = categorySpec.categories as Record<string, CategorySpecEntry>;

export function publicEnv(name: string) {
  const viteValue = import.meta.env[name];
  if (typeof viteValue === "string" && viteValue.trim()) {
    return viteValue.trim();
  }

  if (typeof process !== "undefined") {
    const processValue = process.env?.[name];
    if (typeof processValue === "string" && processValue.trim()) {
      return processValue.trim();
    }
  }

  return "";
}

export function publicHttpUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function publicCsvEnv(name: string, fallback: readonly string[] = []) {
  const value = publicEnv(name);
  if (!value) return [...fallback];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildCategoryLabels(
  categoryMap: Record<string, CategorySpecEntry>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(categoryMap).map(([category, spec]) => [category, spec.label]),
  );
}

export function buildCategoryDescriptions(
  categoryMap: Record<string, CategorySpecEntry>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(categoryMap).map(([category, spec]) => [category, spec.description]),
  );
}

export function buildCategorySeoDescriptions(
  categoryMap: Record<string, CategorySpecEntry>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(categoryMap).map(([category, spec]) => [
      category,
      spec.seoDescription ?? spec.description,
    ]),
  );
}

export function buildCategoryUsageHints(
  categoryMap: Record<string, CategorySpecEntry>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(categoryMap).map(([category, spec]) => [category, spec.usageHint]),
  );
}

export function buildCategoryQuickstarts(
  categoryMap: Record<string, CategorySpecEntry>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(categoryMap).map(([category, spec]) => [
      category,
      Array.isArray(spec.quickstart) ? spec.quickstart : [],
    ]),
  );
}

export const categoryAccentClasses: Record<string, string> = {
  agents: "text-chart-1 border-border bg-secondary/30",
  mcp: "text-chart-2 border-border bg-secondary/30",
  tools: "text-primary border-border bg-secondary/30",
  skills: "text-chart-5 border-border bg-secondary/30",
  rules: "text-destructive border-border bg-secondary/30",
  commands: "text-primary border-border bg-secondary/30",
  hooks: "text-chart-4 border-border bg-secondary/30",
  guides: "text-chart-2 border-border bg-secondary/30",
  collections: "text-chart-3 border-border bg-secondary/30",
  statuslines: "text-chart-4 border-border bg-secondary/30",
};

export { categories as categorySpecCategories };

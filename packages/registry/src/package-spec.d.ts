export function parsePackageSpec(spec: unknown): {
  name: string;
  scope: string | null;
  version: string | null;
} | null;
export function isPinnedPackageSpec(spec: unknown): boolean;

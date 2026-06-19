export function parsePackageSpec(spec: unknown): {
  name: string;
  scope: string;
  version: string;
} | null;

export function isPinnedPackageSpec(spec: unknown): boolean;

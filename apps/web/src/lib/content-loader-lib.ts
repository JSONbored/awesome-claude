/**
 * Pure content artifact loading helpers.
 *
 * Local file reads with retry, Cloudflare ASSETS binding fetches, and URL
 * builders live here. React cache wrappers stay in `content.server.ts`.
 */

export const LOCAL_JSON_READ_ATTEMPTS = 3;
export const LOCAL_JSON_RETRY_MS = 25;

type ReadFileFn = (path: string, encoding: "utf8") => Promise<string>;
type SleepFn = (ms: number) => Promise<void>;

type AssetsBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

/**
 * Read a local data file from the first path that succeeds.
 */
export async function readLocalDataFileFromPaths(
  paths: string[],
  readFile: ReadFileFn,
): Promise<string> {
  let lastError: unknown = null;
  for (const filePath of paths) {
    try {
      return await readFile(filePath, "utf8");
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Local data artifact not found");
}

/**
 * Read and parse a local JSON data file with bounded retry.
 */
export async function readLocalJsonDataFileWithRetry<T>(
  fileName: string,
  paths: string[],
  readFile: ReadFileFn,
  sleep: SleepFn,
  maxAttempts: number = LOCAL_JSON_READ_ATTEMPTS,
): Promise<T> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const raw = await readLocalDataFileFromPaths(paths, readFile);
      return JSON.parse(raw) as T;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1) {
        await sleep(LOCAL_JSON_RETRY_MS);
      }
    }
  }
  throw lastError || new Error(`Invalid local data artifact: ${fileName}`);
}

/**
 * Build the ASSETS binding request URL for a data artifact.
 */
export function buildAssetsDataRequestUrl(origin: string, safePath: string): string {
  return `${origin}/data/${safePath}`;
}

/**
 * Load JSON from the Cloudflare ASSETS binding.
 */
export async function loadJsonFromAssetsBinding<T>(assets: AssetsBinding, url: string): Promise<T> {
  const response = await assets.fetch(new Request(url));
  if (!response.ok) {
    throw new Error(`Failed to load asset (${response.status})`);
  }
  return (await response.json()) as T;
}

/**
 * Load text from the Cloudflare ASSETS binding.
 */
export async function loadTextFromAssetsBinding(
  assets: AssetsBinding,
  url: string,
): Promise<string> {
  const response = await assets.fetch(new Request(url));
  if (!response.ok) {
    throw new Error(`Failed to load asset (${response.status})`);
  }
  return response.text();
}

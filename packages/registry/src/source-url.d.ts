export function isAffiliateParam(name: unknown): boolean;
export function isTrackingParam(name: unknown): boolean;
export function hasAffiliateParam(value: unknown): boolean;
export function stripTrackingParams(value: unknown): string;
/** Drop explicit :443/:80 so default-port URLs compare equal. Mutates `url`. */
export function stripDefaultSourcePort(url: URL): void;
export function canonicalizeSourceUrl(value: unknown): string;

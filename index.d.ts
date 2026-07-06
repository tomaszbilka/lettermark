export interface GetInitialsOptions {
  /** How many initials to return. Default: 2. */
  length?: 1 | 2 | 3;
  /** BCP 47 locale passed to Intl.Segmenter. */
  locale?: string;
}

/**
 * Extract initials from a name.
 * Minimal preview release — the full API (color, React component) is on the way.
 */
export function getInitials(name: string, options?: GetInitialsOptions): string;

export default getInitials;

import { toGraphemes } from "./segment.js";

export interface GetInitialsOptions {
  /** How many initials to return. Default: 2. */
  length?: 1 | 2 | 3;
  /** BCP 47 locale passed to `Intl.Segmenter`. */
  locale?: string;
}

/** Word separators: whitespace, dot, underscore, hyphen, straight and curly apostrophes. */
const SEPARATORS = /[\s._\-'\u2019]+/u;

/** Han, Hiragana/Katakana and Hangul — scripts where the family name is the leading character. */
const CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\uf900-\ufaff]/u;

/**
 * Extract initials from a name.
 *
 * Splits on common separators and takes the first grapheme of each word; for a
 * single token it takes the first `length` graphemes (or just the leading
 * character for CJK/Japanese/Korean names). Grapheme-aware via `Intl.Segmenter`,
 * so emoji, flags and composed characters never split. Falls back to `"?"` for
 * empty, non-string, or clearly invalid input.
 */
export function getInitials(name: string, options: GetInitialsOptions = {}): string {
  const { length = 2, locale } = options;

  if (typeof name !== "string") return "?";

  const trimmed = name.trim();
  if (!trimmed) return "?";

  // Bad coercion (e.g. `String(undefined)`) commonly yields these literals.
  const lower = trimmed.toLowerCase();
  if (lower === "undefined" || lower === "null") return "?";

  const value = trimmed.includes("@") ? trimmed.slice(0, trimmed.indexOf("@")) : trimmed;

  const words = value.split(SEPARATORS).filter(Boolean);
  if (words.length === 0) return "?";

  let graphemes: string[];
  if (words.length === 1) {
    const token = words[0] as string;
    const segmented = toGraphemes(token, locale);
    graphemes = CJK.test(token) ? segmented.slice(0, 1) : segmented.slice(0, length);
  } else {
    graphemes = words.slice(0, length).map((word) => toGraphemes(word, locale)[0] ?? "");
  }

  return graphemes.join("").toUpperCase() || "?";
}

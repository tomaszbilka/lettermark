/**
 * Split a string into grapheme clusters via `Intl.Segmenter`, falling back to
 * code points when unavailable. Grapheme-aware, so emoji, flags and composed
 * characters are never broken apart.
 */
export function toGraphemes(value: string, locale?: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (s) => s.segment);
  }
  return [...value];
}

const segment = (str, locale) =>
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? [...new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(str)].map(
        (s) => s.segment,
      )
    : [...str];

/**
 * Extract initials from a name.
 * Minimal preview release — the full API (color, React component) is on the way.
 *
 * @param {string} name
 * @param {{ length?: 1 | 2 | 3, locale?: string }} [options]
 * @returns {string}
 */
export function getInitials(name, options = {}) {
  const { length = 2, locale } = options;
  if (typeof name !== "string") return "?";

  const cleaned = name.includes("@") ? name.slice(0, name.indexOf("@")) : name;
  const words = cleaned
    .split(/[\s._-]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  if (words.length === 0) return "?";

  const picked =
    words.length === 1
      ? segment(words[0], locale).slice(0, length)
      : words.slice(0, length).map((w) => segment(w, locale)[0]);

  return picked.join("").toUpperCase() || "?";
}

export default getInitials;

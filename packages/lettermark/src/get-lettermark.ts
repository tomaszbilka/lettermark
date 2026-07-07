import { type GetColorOptions, getColor } from "./get-color.js";
import { type GetInitialsOptions, getInitials } from "./get-initials.js";
import { toGraphemes } from "./segment.js";

export interface GetLettermarkOptions extends GetInitialsOptions, GetColorOptions {
  /** Override the auto-computed font size (on a 100-unit canvas). Defaults to a size scaled to the number of initials. */
  fontSize?: number;
}

export interface Lettermark {
  /** The derived initials (uppercased), or `"?"` for empty/invalid input. */
  initials: string;
  /** Background color as an `#rrggbb` hex string. */
  background: string;
  /** Foreground color chosen for WCAG contrast against the background. */
  foreground: string;
  /** Suggested font size on a 100-unit canvas, scaled to the number of initials. */
  fontSize: number;
}

/** Font size per number of grapheme clusters in the initials (drawn on a 100x100 canvas). */
const FONT_SIZE: Record<number, number> = { 1: 50, 2: 42, 3: 30 };

/**
 * Everything needed to render an avatar for `name` in one call: initials, a
 * deterministic background, a WCAG-safe foreground and a font size scaled to
 * the number of initials. Fully deterministic and SSR-safe.
 */
export function getLettermark(name: string, options: GetLettermarkOptions = {}): Lettermark {
  const initials = getInitials(name, options);
  const { background, foreground } = getColor(name, options);
  const graphemeCount = toGraphemes(initials, options.locale).length;

  return {
    initials,
    background,
    foreground,
    fontSize: options.fontSize ?? FONT_SIZE[graphemeCount] ?? 30,
  };
}

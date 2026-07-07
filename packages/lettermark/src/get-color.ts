export interface GetColorOptions {
  /** When provided, the background is picked deterministically from this palette instead of generated. */
  palette?: string[];
}

export interface LettermarkColors {
  /** Background color as an `#rrggbb` hex string. */
  background: string;
  /** Foreground color (`#111111` or `#ffffff`) chosen for WCAG contrast against the background. */
  foreground: string;
}

/** Perceptual lightness/chroma held constant so every generated color carries similar visual weight. */
const DEFAULT_LIGHTNESS = 0.68;
const DEFAULT_CHROMA = 0.13;

const DARK_FOREGROUND = "#111111";
const LIGHT_FOREGROUND = "#ffffff";

/** FNV-1a (32-bit) — fast, dependency-free, fully deterministic (no `Math.random`). */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** OKLCH → linear sRGB (Björn Ottosson's matrices). May return out-of-gamut values; callers clamp. */
function oklchToLinearSrgb(l: number, c: number, hueDeg: number): [number, number, number] {
  const h = (hueDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

  const lCubed = lPrime ** 3;
  const mCubed = mPrime ** 3;
  const sCubed = sPrime ** 3;

  return [
    4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed,
    -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed,
    -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed,
  ];
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Linear sRGB channel → gamma-encoded sRGB (0..1). */
function gammaEncode(channel: number): number {
  const c = clamp01(channel);
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

/** Gamma-encoded sRGB channel → linear sRGB. */
function gammaDecode(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearSrgbToHex(linear: [number, number, number]): string {
  const hex = linear
    .map((channel) =>
      Math.round(gammaEncode(channel) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
  return `#${hex}`;
}

function hexToLinearSrgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return [
    gammaDecode(Number.parseInt(full.slice(0, 2), 16) / 255),
    gammaDecode(Number.parseInt(full.slice(2, 4), 16) / 255),
    gammaDecode(Number.parseInt(full.slice(4, 6), 16) / 255),
  ];
}

/** WCAG relative luminance from linear sRGB. */
function relativeLuminance(linear: [number, number, number]): number {
  const [r, g, b] = linear;
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

function contrastRatio(a: number, b: number): number {
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Pick the foreground (dark or light) with the higher contrast against the background. */
function pickForeground(background: string): string {
  const bgLuminance = relativeLuminance(hexToLinearSrgb(background));
  const darkLuminance = relativeLuminance(hexToLinearSrgb(DARK_FOREGROUND));
  const contrastWithDark = contrastRatio(bgLuminance, darkLuminance);
  const contrastWithLight = contrastRatio(bgLuminance, 1);
  return contrastWithDark >= contrastWithLight ? DARK_FOREGROUND : LIGHT_FOREGROUND;
}

/**
 * Derive a deterministic background + WCAG-safe foreground from a seed (e.g. a name).
 *
 * The background hue is hashed from the seed while lightness and chroma stay
 * constant (via OKLCH), so colors share a consistent visual weight. The same
 * seed always yields the same color — safe across SSR and client. Pass
 * `palette` to pick from brand colors instead of generating a hue.
 */
export function getColor(seed: string, options: GetColorOptions = {}): LettermarkColors {
  const { palette } = options;
  const hash = fnv1a(typeof seed === "string" ? seed : String(seed));

  let background: string;
  if (palette && palette.length > 0) {
    background = palette[hash % palette.length] as string;
  } else {
    const hue = hash % 360;
    background = linearSrgbToHex(oklchToLinearSrgb(DEFAULT_LIGHTNESS, DEFAULT_CHROMA, hue));
  }

  return { background, foreground: pickForeground(background) };
}

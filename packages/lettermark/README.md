# lettermark

> Turn a name into initials and a deterministic, WCAG-safe color — lightweight, zero-dependency, framework-agnostic.

[![npm version](https://img.shields.io/npm/v/lettermark.svg)](https://www.npmjs.com/package/lettermark)
[![CI](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml/badge.svg)](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/lettermark)](https://bundlephobia.com/package/lettermark)
[![license](https://img.shields.io/npm/l/lettermark.svg)](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

`lettermark` turns any name into the building blocks of an avatar fallback: clean **initials**, a **deterministic background color** and a **contrast-safe foreground**. Use it for user avatars, monograms and placeholders — in Node, the browser, edge runtimes, and during SSR.

It is Unicode-correct by default: emoji, flags and composed characters never split, and CJK names collapse to their family character.

## Features

- **Grapheme-correct** — powered by `Intl.Segmenter`, so `🇵🇱` and `👨‍👩‍👧` stay intact instead of breaking into half-characters.
- **Deterministic colors** — the same name always yields the same color, so server and client render identically (no hydration mismatch).
- **WCAG-safe** — the foreground is automatically picked for AA contrast (≥ 4.5:1) against the background.
- **Zero dependencies** — ~1.2 kB gzipped, pure ESM, tree-shakeable, fully typed.

## Install

```bash
npm install lettermark
# or: pnpm add lettermark / yarn add lettermark
```

## Quick start

```ts
import { getLettermark } from "lettermark";

getLettermark("Jan Kowalski");
// {
//   initials: "JK",
//   background: "#60ad64",   // derived from the name
//   foreground: "#111111",   // contrast-safe against the background
//   fontSize: 42,            // scaled to the number of initials
// }
```

That single call gives you everything you need to draw an avatar. Prefer the pieces? Use `getInitials` or `getColor` directly.

## How it works

```text
name ─┬─► getInitials ─► "JK"                     (grapheme split → first letters)
      │
      └─► getColor    ─► FNV-1a hash              (deterministic, no Math.random)
                         → hue (0–359)
                         → OKLCH (fixed lightness/chroma)   → equal visual weight
                         → sRGB hex  → background "#60ad64"
                         → foreground picked by WCAG contrast "#111111"
```

- **Initials**: the name is split on separators (spaces, `.`, `_`, `-`, apostrophes); for multiple words it takes the first grapheme of each, for a single word the first `length` graphemes. Emails drop the domain; CJK names use the leading character; empty/invalid input returns `"?"`.
- **Color**: the name is hashed (FNV-1a) into a hue. Lightness and chroma are held constant in **OKLCH**, so every color has a similar visual weight, then it is converted to an sRGB `#rrggbb` hex that works everywhere. Because it is a pure hash, the result is identical on server and client.
- **Font size**: scaled to the number of initials on a 100-unit canvas — `1 → 50`, `2 → 42`, `3 → 30` — so text fits regardless of avatar size. Override it with the `fontSize` option.

## Rendering an SVG avatar

`fontSize` is expressed on a `100 x 100` canvas, so an inline SVG with `viewBox="0 0 100 100"` scales crisply to any size:

```tsx
const { initials, background, foreground, fontSize } = getLettermark(name);

<svg viewBox="0 0 100 100" width={48} height={48} role="img" aria-label={name}>
  <circle cx="50" cy="50" r="50" fill={background} />
  <text
    x="50"
    y="50"
    dy="0.36em"
    textAnchor="middle"
    fill={foreground}
    fontSize={fontSize}
    fontFamily="system-ui, sans-serif"
    fontWeight={600}
  >
    {initials}
  </text>
</svg>;
```

## API

### `getLettermark(name, options?)`

Returns everything needed to render an avatar: `{ initials, background, foreground, fontSize }`.

| Option     | Type            | Default          | Description                                              |
| ---------- | --------------- | ---------------- | -------------------------------------------------------- |
| `length`   | `1 \| 2 \| 3`   | `2`              | How many initials to return.                             |
| `locale`   | `string`        | —                | BCP 47 locale passed to `Intl.Segmenter`.                |
| `palette`  | `string[]`      | —                | Pick the background from these hex colors instead of generating one. |
| `fontSize` | `number`        | auto (50/42/30)  | Override the font size (on the 100-unit canvas).         |

```ts
getLettermark("Ada Lovelace");                       // fontSize 42
getLettermark("Cher", { length: 1 });                // fontSize 50
getLettermark("Jan", { palette: ["#0ea5e9", "#f43f5e"] }); // background from palette
getLettermark("Jan Kowalski", { fontSize: 36 });     // fontSize 36 (override)
```

### `getInitials(name, options?)`

Returns the initials as an uppercased string, or `"?"` for empty/invalid input. Options: `length`, `locale`.

| Input                       | Output | Rule                                             |
| --------------------------- | ------ | ------------------------------------------------ |
| `"Jan Kowalski"`            | `"JK"` | first letter of the first `length` words         |
| `"Cher"`                    | `"CH"` | first `length` letters of a single word          |
| `"jan.kowalski@x.pl"`       | `"JK"` | email — domain is stripped                       |
| `"Kowalska-Nowak"`          | `"KN"` | hyphen splits words                              |
| `"O'Brien"`                 | `"OB"` | apostrophe splits words                          |
| `"李小龙"`                   | `"李"` | CJK — leading (family) character                 |
| `"🇵🇱"`                       | `"🇵🇱"` | flags/emoji stay whole                           |
| `""`, `null`, `"undefined"` | `"?"`  | empty, non-string or garbage falls back to `"?"` |

### `getColor(seed, options?)`

Returns `{ background, foreground }` as `#rrggbb` hex strings, derived deterministically from `seed`. Option: `palette` (pick the background from brand colors instead of generating a hue).

```ts
getColor("Jan Kowalski"); // { background: "#60ad64", foreground: "#111111" }
getColor("Zoe", { palette: ["#000080", "#ffcc00"] }); // background from the palette
```

> Note: colors are generated across 360 hues, so different names can occasionally share a color (it is a fallback cue, not a unique id). The initials still tell them apart.

## Roadmap

- [x] `getInitials` — grapheme-aware initials
- [x] `getColor` — deterministic OKLCH background + WCAG-safe foreground
- [x] `getLettermark` — initials + color + font-size combo
- [ ] `@lettermark/react` — scalable SVG `<Lettermark />` component
- [ ] `@lettermark/vue`

## License

[MIT](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

# lettermark

> Turn a name into initials — lightweight, zero-dependency, framework-agnostic.

[![npm version](https://img.shields.io/npm/v/lettermark.svg)](https://www.npmjs.com/package/lettermark)
[![CI](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml/badge.svg)](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/lettermark)](https://bundlephobia.com/package/lettermark)
[![license](https://img.shields.io/npm/l/lettermark.svg)](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

`lettermark` derives clean initials from any name — for avatar fallbacks, monograms and placeholders. It is Unicode-correct by default: emoji, flags and composed characters never split, and CJK names collapse to their family character.

> **Early preview.** `0.0.x` ships the `getInitials` core. Deterministic OKLCH colors with guaranteed WCAG contrast and a crisp, scalable SVG `<Lettermark />` React component are on the [roadmap](#roadmap).

## Why

- **Grapheme-correct** — powered by `Intl.Segmenter`, so `🇵🇱` and `👨‍👩‍👧` stay intact instead of breaking into half-characters.
- **Zero dependencies** — < 1 kB gzipped, pure ESM, tree-shakeable.
- **Framework-agnostic** — plain function, runs in Node, the browser and edge runtimes.
- **SSR-safe** — fully deterministic, no `Math.random`, no `window`.
- **Fully typed** — ships first-class TypeScript declarations.

## Install

```bash
npm install lettermark
# or: pnpm add lettermark / yarn add lettermark
```

## Usage

```ts
import { getInitials } from "lettermark";

getInitials("Jan Kowalski"); // "JK"
getInitials("Ada Lovelace"); // "AL"
getInitials("jan.kowalski@example.com"); // "JK"  (domain ignored)
getInitials("Cher", { length: 1 }); // "C"
getInitials("Anna Maria Wątły", { length: 3 }); // "AMW"
```

## API

### `getInitials(name, options?)`

Returns the initials for `name` as an uppercased string, or `"?"` for empty/invalid input.

| Option   | Type              | Default | Description                                  |
| -------- | ----------------- | ------- | -------------------------------------------- |
| `length` | `1 \| 2 \| 3`     | `2`     | How many initials to return.                 |
| `locale` | `string`          | —       | BCP 47 locale passed to `Intl.Segmenter`.    |

**Behavior**

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

## Roadmap

- [x] `getInitials` — grapheme-aware initials
- [ ] `getColor` — deterministic OKLCH background + WCAG-safe foreground
- [ ] `getLettermark` — initials + color + font-size combo
- [ ] `@lettermark/react` — scalable SVG `<Lettermark />` component
- [ ] `@lettermark/vue`

## License

[MIT](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

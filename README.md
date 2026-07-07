# lettermark

> Turn a name into initials and a deterministic, WCAG-safe color — lightweight, zero-dependency, framework-agnostic.

[![npm version](https://img.shields.io/npm/v/lettermark.svg)](https://www.npmjs.com/package/lettermark)
[![CI](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml/badge.svg)](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/lettermark.svg)](./LICENSE)

Monorepo for the `lettermark` toolkit — Unicode-correct initials, deterministic colors and avatar components.

```ts
import { getLettermark } from "lettermark";

getLettermark("Jan Kowalski");
// { initials: "JK", background: "#60ad64", foreground: "#111111", fontSize: 42 }
```

`name → initials + deterministic background + WCAG-safe foreground + font size`. Grapheme-correct via `Intl.Segmenter` and SSR-safe (same output on server and client). See the [`lettermark` package README](./packages/lettermark/README.md) for the full "how it works", API and SVG example.

## Packages

| Package                               | Description                                                        | Status        |
| ------------------------------------- | ------------------------------------------------------------------ | ------------- |
| [`lettermark`](./packages/lettermark) | Core: `getInitials`, `getColor`, `getLettermark` (framework-agnostic) | Available     |
| `@lettermark/react`                   | Scalable SVG `<Lettermark />` component                            | Planned       |
| `@lettermark/vue`                     | Vue component                                                      | Planned       |

## Development

This is a [pnpm](https://pnpm.io) workspace.

```bash
pnpm install        # install all workspace deps
pnpm test           # run tests (Vitest)
pnpm typecheck      # tsc --noEmit
pnpm build          # build every package (tsdown)
pnpm lint           # Biome
```

## License

[MIT](./LICENSE)

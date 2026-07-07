# lettermark

> Turn a name into initials — lightweight, zero-dependency, framework-agnostic.

[![npm version](https://img.shields.io/npm/v/lettermark.svg)](https://www.npmjs.com/package/lettermark)
[![CI](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml/badge.svg)](https://github.com/tomaszbilka/lettermark/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/lettermark.svg)](./LICENSE)

Monorepo for the `lettermark` toolkit — Unicode-correct initials, deterministic colors and avatar components.

## Packages

| Package                                      | Description                                   | Status         |
| -------------------------------------------- | --------------------------------------------- | -------------- |
| [`lettermark`](./packages/lettermark)        | Framework-agnostic core (`getInitials`, …)    | Early preview  |
| `@lettermark/react`                          | Scalable SVG `<Lettermark />` component        | Planned        |
| `@lettermark/vue`                            | Vue component                                  | Planned        |

See the [`lettermark` package README](./packages/lettermark/README.md) for install and usage.

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

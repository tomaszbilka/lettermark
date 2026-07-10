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
| [`@lettermark/react`](./packages/react) | Scalable SVG `<Lettermark />` component                            | Available     |
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

## Releasing

Releases are published to npm from GitHub Actions with [provenance](https://docs.npmjs.com/generating-provenance-statements) via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC — no `NPM_TOKEN` in secrets).

### One-time npm setup

1. Bump `version` in the relevant `packages/*/package.json` (via PR to `main`).
2. After merge, tag and push:

```bash
git pull origin main
git tag v0.1.0   # must match the package version you are releasing
git push origin v0.1.0
```

The [Release workflow](./.github/workflows/release.yml) builds and publishes all public workspace packages (`lettermark`, `@lettermark/react`) with `npm publish --provenance`.

### Trusted Publisher (per package)

Configure on [npmjs.com](https://www.npmjs.com) → **Settings → Trusted Publisher** for each package:

- `lettermark`
- `@lettermark/react`

| Field | Value |
| ----- | ----- |
| Repository | `tomaszbilka/lettermark` |
| Workflow filename | `release.yml` |
| Environment | *(leave empty)* |
| Allowed actions | Allow `npm publish` |

### Verify provenance

```bash
npm view lettermark@0.1.1 dist.attestations
npm audit signatures
```

On npmjs.com the version page should show the **provenance** badge linking to the GitHub Actions run.

## License

[MIT](./LICENSE)

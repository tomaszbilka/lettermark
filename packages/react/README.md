# @lettermark/react

> Scalable SVG avatar fallback for React — initials, deterministic colors, image fallback chain.

[![npm version](https://img.shields.io/npm/v/@lettermark/react.svg)](https://www.npmjs.com/package/@lettermark/react)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@lettermark/react)](https://bundlephobia.com/package/@lettermark/react)
[![license](https://img.shields.io/npm/l/@lettermark/react.svg)](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

React component built on [`lettermark`](https://www.npmjs.com/package/lettermark) core — drop-in avatar fallback for user lists, nav bars and profile placeholders. No CSS file to import.

## Features

- **Grapheme-correct initials** — powered by `Intl.Segmenter` via core; emoji, flags and CJK names stay intact.
- **Deterministic, WCAG-safe colors** — same name → same color; foreground picked for AA contrast (≥ 4.5:1).
- **SSR-safe** — identical server and client markup for initials; no hydration mismatch from color or text logic.
- **Lightweight** — ~0.9 kB gzipped; React is a peer dependency (not bundled into your app).

## Install

```bash
npm install @lettermark/react
# peer: react >=18, react-dom >=18 (already in your app)
```

`lettermark` is installed automatically as a dependency. React is **not** bundled — your app supplies it via `peerDependencies`.

## Quick start

```tsx
import { Lettermark } from "@lettermark/react";

export function UserAvatar({ name }: { name: string }) {
  return <Lettermark name={name} size={40} />;
}
```

With image fallback:

```tsx
<Lettermark name="Jan Kowalski" src={user.avatarUrl} size={48} shape="rounded" loading="lazy" />
```

Initials render immediately; the image overlays on load. On error, initials stay visible.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Source for initials and color |
| `src` | `string?` | — | Image URL; falls back to initials on error |
| `size` | `number \| string?` | fluid | `40` → px, `"3rem"` → CSS; omit → `100%` of parent (parent needs explicit dimensions; root uses `aspect-ratio: 1/1`) |
| `shape` | `'circle' \| 'square' \| 'rounded' \| 'squircle'` | `'circle'` | Avatar shape |
| `color` | `string?` | auto | Fixed background hex |
| `palette` | `string[]?` | auto | Brand colors — picked deterministically |
| `className` / `style` | — | — | Root styling |
| `classNames` | `{ root?, image?, initials? }` | — | Per-element classes (Tailwind-friendly) |
| `alt` | `string?` | `name` | Accessible label (`aria-label`) |
| `title` | `string?` | — | Native tooltip |
| `as` | `ElementType` | `'span'` | Polymorphic root (`button`, `div`, …) |
| `loading` | `img loading` | — | Passed to `<img>` (`"lazy"` / `"eager"`) |
| `fallback` | `ReactNode?` | — | Replaces initials SVG when no image is shown (`src` still takes priority when it loads) |
| `length` | `1 \| 2 \| 3` | `2` | Max initials (from core) |
| `locale` | `string?` | — | `Intl.Segmenter` locale |
| `fontSize` | `number?` | auto | Override SVG font size on 100×100 canvas |

Spread props (`onClick`, etc.) go to the root element.

## Examples

**Fluid — fills parent container:**

```tsx
<div style={{ width: 64, height: 64 }}>
  <Lettermark name="Jan Kowalski" />
</div>
```

**Next.js App Router:**

```tsx
"use client";

import { Lettermark } from "@lettermark/react";

<Lettermark name={user.name} size={40} src={user.avatarUrl} />;
```

**Button avatar:**

```tsx
<Lettermark as="button" name="Jan Kowalski" size={32} type="button" onClick={openProfile} />
```

**Custom fallback:**

```tsx
<Lettermark name="" fallback={<span>?</span>} size={40} />
```

## License

[MIT](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

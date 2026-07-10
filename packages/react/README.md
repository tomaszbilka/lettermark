# @lettermark/react

> Scalable SVG avatar fallback for React — initials, deterministic colors, image fallback chain.

[![npm version](https://img.shields.io/npm/v/@lettermark/react.svg)](https://www.npmjs.com/package/@lettermark/react)
[![license](https://img.shields.io/npm/l/@lettermark/react.svg)](https://github.com/tomaszbilka/lettermark/blob/main/LICENSE)

React component built on [`lettermark`](https://www.npmjs.com/package/lettermark) core. Unicode-correct initials, WCAG-safe colors, SSR-safe, zero CSS import.

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
<Lettermark name="Jan Kowalski" src={user.avatarUrl} size={48} shape="rounded" />
```

Initials render immediately; the image overlays on load. On error, initials stay visible.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Source for initials and color |
| `src` | `string?` | — | Image URL; falls back to initials on error |
| `size` | `number \| string?` | fluid | `40` → px, `"3rem"` → CSS, omit → `100%` parent |
| `shape` | `'circle' \| 'square' \| 'rounded' \| 'squircle'` | `'circle'` | Avatar shape |
| `color` | `string?` | auto | Fixed background hex |
| `palette` | `string[]?` | auto | Brand colors — picked deterministically |
| `className` / `style` | — | — | Root styling |
| `classNames` | `{ root?, image?, initials? }` | — | Per-element classes (Tailwind-friendly) |
| `alt` | `string?` | `name` | Accessible label (`aria-label`) |
| `title` | `string?` | — | Native tooltip |
| `as` | `ElementType` | `'span'` | Polymorphic root (`button`, `div`, …) |
| `loading` | `img loading` | — | Passed to `<img>` |
| `fallback` | `ReactNode?` | — | Custom content when no image (replaces initials SVG) |
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

# lettermark

> Turn a name into initials — lightweight, zero-dependency, framework-agnostic.

**Early preview.** This `0.0.x` release ships a minimal `getInitials`. The full API — deterministic OKLCH colors with guaranteed WCAG contrast, a crisp scalable SVG `<Lettermark />` React component, and more — is on the way.

## Install

```bash
npm install lettermark
```

## Usage

```js
import { getInitials } from "lettermark";

getInitials("Jan Kowalski"); // "JK"
getInitials("jan.kowalski@example.com"); // "JK"
getInitials("Cher", { length: 1 }); // "C"
```

Grapheme-aware via `Intl.Segmenter`, so emoji and composed characters don't split.

## License

MIT

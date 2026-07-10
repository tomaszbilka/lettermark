import { getLettermark } from "lettermark";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useState,
} from "react";

export type LettermarkShape = "circle" | "square" | "rounded" | "squircle";

const RX: Record<Exclude<LettermarkShape, "circle">, number> = {
  square: 0,
  rounded: 16,
  squircle: 28,
};

const BORDER_RADIUS: Record<LettermarkShape, string> = {
  circle: "50%",
  square: "0",
  rounded: "16%",
  squircle: "28%",
};

export interface LettermarkClassNames {
  root?: string;
  image?: string;
  initials?: string;
}

type Size = number | string | undefined;

function resolveSize(size: Size): string {
  if (typeof size === "number") return `${size}px`;
  if (typeof size === "string") return size;
  return "100%";
}

export interface LettermarkOwnProps {
  /** Full name — source for initials and deterministic color. */
  name: string;
  /** Optional image URL; falls back to initials on load error. */
  src?: string;
  /** Fixed px, CSS units, or omit for fluid (100% of parent). */
  size?: Size;
  shape?: LettermarkShape;
  /** Fixed background color (hex). Overrides auto-generated hue. */
  color?: string;
  /** Brand palette — background picked deterministically from these colors. */
  palette?: string[];
  className?: string;
  style?: CSSProperties;
  classNames?: LettermarkClassNames;
  /** Accessible label; defaults to `name`. */
  alt?: string;
  /** Native tooltip with the full name. */
  title?: string;
  loading?: ComponentPropsWithoutRef<"img">["loading"];
  /** Custom content when no image is shown; replaces default initials SVG. */
  fallback?: ReactNode;
  length?: 1 | 2 | 3;
  locale?: string;
  fontSize?: number;
}

export type LettermarkProps<C extends ElementType = "span"> = LettermarkOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof LettermarkOwnProps | "as" | "children">;

function InitialsSvg({
  shape,
  background,
  foreground,
  fontSize,
  initials,
  className,
}: {
  shape: LettermarkShape;
  background: string;
  foreground: string;
  fontSize: number;
  initials: string;
  className?: string;
}) {
  return (
    // Decorative — accessible name lives on the root role="img".
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
      focusable="false"
    >
      {shape === "circle" ? (
        <circle cx="50" cy="50" r="50" fill={background} />
      ) : (
        <rect width="100" height="100" rx={RX[shape]} fill={background} />
      )}
      <text
        x="50"
        y="50"
        dy="0.36em"
        textAnchor="middle"
        fill={foreground}
        fontSize={fontSize}
        fontFamily="inherit"
        fontWeight={600}
      >
        {initials}
      </text>
    </svg>
  );
}

export function Lettermark<C extends ElementType = "span">({
  as,
  name,
  src,
  size,
  shape = "circle",
  color,
  palette,
  className,
  style,
  classNames,
  alt,
  title,
  loading,
  fallback,
  length,
  locale,
  fontSize,
  ...rest
}: LettermarkProps<C>) {
  const Component = (as ?? "span") as ElementType;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  const effectivePalette = palette ?? (color ? [color] : undefined);
  const {
    initials,
    background,
    foreground,
    fontSize: computedFontSize,
  } = getLettermark(name, {
    length,
    locale,
    fontSize,
    palette: effectivePalette,
  });

  const showFallback = fallback != null && (!src || erroredSrc === src);
  const showInitialsSvg = fallback == null;
  const showImage = Boolean(src) && erroredSrc !== src;
  const imageLoaded = Boolean(src) && loadedSrc === src;

  const rootStyle: CSSProperties = {
    display: "inline-block",
    width: resolveSize(size),
    height: resolveSize(size),
    aspectRatio: size === undefined ? "1 / 1" : undefined,
    position: "relative",
    overflow: "hidden",
    borderRadius: BORDER_RADIUS[shape],
    ...style,
  };

  return (
    <Component
      role="img"
      aria-label={alt ?? name}
      title={title}
      data-shape={shape}
      className={classNames?.root ?? className}
      style={rootStyle}
      {...rest}
    >
      {showInitialsSvg && (
        <InitialsSvg
          shape={shape}
          background={background}
          foreground={foreground}
          fontSize={computedFontSize}
          initials={initials}
          className={classNames?.initials}
        />
      )}
      {showFallback && fallback}
      {showImage && (
        <img
          key={src}
          src={src}
          alt=""
          loading={loading}
          onLoad={() => setLoadedSrc(src ?? null)}
          onError={() => setErroredSrc(src ?? null)}
          className={classNames?.image}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
          }}
        />
      )}
    </Component>
  );
}

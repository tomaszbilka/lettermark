import { describe, expect, it } from "vitest";
import { getInitials } from "./get-initials.js";

describe("getInitials — common cases", () => {
  it("takes the first grapheme of the first two words", () => {
    expect(getInitials("Jan Kowalski")).toBe("JK");
  });

  it("uppercases the result", () => {
    expect(getInitials("jan kowalski")).toBe("JK");
  });

  it("takes the first N graphemes of a single word", () => {
    expect(getInitials("Cher")).toBe("CH");
    expect(getInitials("Cher", { length: 1 })).toBe("C");
  });

  it("respects length for multi-word names", () => {
    expect(getInitials("Jan Maria Kowalski", { length: 3 })).toBe("JMK");
    expect(getInitials("Jan Maria Kowalski", { length: 1 })).toBe("J");
  });
});

describe("getInitials — separators", () => {
  it("splits on hyphens", () => {
    expect(getInitials("Kowalska-Nowak")).toBe("KN");
  });

  it("splits on apostrophes (straight and curly)", () => {
    expect(getInitials("O'Brien")).toBe("OB");
    expect(getInitials("O\u2019Brien")).toBe("OB");
  });

  it("collapses repeated/mixed separators", () => {
    expect(getInitials("Jan   Kowalski")).toBe("JK");
    expect(getInitials("jan_kowalski")).toBe("JK");
  });
});

describe("getInitials — emails", () => {
  it("uses the local part and ignores the domain", () => {
    expect(getInitials("jan.kowalski@example.com")).toBe("JK");
  });

  it("handles a single-token local part", () => {
    expect(getInitials("cher@example.com")).toBe("CH");
  });
});

describe("getInitials — scripts and Unicode", () => {
  it("returns the family character for a CJK single token", () => {
    expect(getInitials("李小龙")).toBe("李");
  });

  it("works with Cyrillic", () => {
    expect(getInitials("Влад")).toBe("ВЛ");
  });

  it("keeps a regional-indicator flag as one grapheme", () => {
    expect(getInitials("🇵🇱")).toBe("🇵🇱");
  });

  it("keeps a ZWJ emoji sequence intact", () => {
    expect(getInitials("👨‍👩‍👧")).toBe("👨‍👩‍👧");
  });

  it("does not split emoji across words", () => {
    expect(getInitials("😀 Smith")).toBe("😀S");
  });
});

describe("getInitials — prefixes stay simple (no van/von heuristics in v1)", () => {
  it("treats prefixes as ordinary words", () => {
    expect(getInitials("van der Berg")).toBe("VD");
    expect(getInitials("van der Berg", { length: 3 })).toBe("VDB");
  });
});

describe("getInitials — degenerate input falls back to '?'", () => {
  it("handles empty and whitespace-only strings", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("   ")).toBe("?");
    expect(getInitials("---")).toBe("?");
  });

  it("handles non-string input", () => {
    // @ts-expect-error runtime guard for JS callers
    expect(getInitials(null)).toBe("?");
    // @ts-expect-error runtime guard for JS callers
    expect(getInitials(undefined)).toBe("?");
    // @ts-expect-error runtime guard for JS callers
    expect(getInitials(123)).toBe("?");
  });

  it("guards against stringified null/undefined from bad coercion", () => {
    expect(getInitials("undefined")).toBe("?");
    expect(getInitials("null")).toBe("?");
    expect(getInitials("NULL")).toBe("?");
  });
});

describe("getInitials — single tokens", () => {
  it("returns a single letter as-is", () => {
    expect(getInitials("A")).toBe("A");
  });

  it("keeps digit tokens deterministic", () => {
    expect(getInitials("123")).toBe("12");
  });
});

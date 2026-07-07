import { describe, expect, it } from "vitest";
import { getColor } from "./get-color.js";
import { getInitials } from "./get-initials.js";
import { getLettermark } from "./get-lettermark.js";

describe("getLettermark — composition", () => {
  it("matches getInitials for the same input", () => {
    expect(getLettermark("Jan Kowalski").initials).toBe(getInitials("Jan Kowalski"));
    expect(getLettermark("Jan Adam Nowak", { length: 3 }).initials).toBe(
      getInitials("Jan Adam Nowak", { length: 3 }),
    );
  });

  it("matches getColor for the same name and options", () => {
    const { background, foreground } = getLettermark("Ada Lovelace");
    expect({ background, foreground }).toEqual(getColor("Ada Lovelace"));
  });

  it("forwards the palette option to getColor", () => {
    const palette = ["#123456", "#654321"];
    const { background } = getLettermark("Grace", { palette });
    expect(palette).toContain(background);
  });

  it("is deterministic", () => {
    expect(getLettermark("Jan Kowalski")).toEqual(getLettermark("Jan Kowalski"));
  });
});

describe("getLettermark — fontSize by grapheme count", () => {
  it("uses 42 for two initials", () => {
    expect(getLettermark("Jan Kowalski").fontSize).toBe(42);
  });

  it("uses 50 for a single initial", () => {
    expect(getLettermark("Cher", { length: 1 }).fontSize).toBe(50);
  });

  it("uses 30 for three initials", () => {
    expect(getLettermark("Jan Adam Nowak", { length: 3 }).fontSize).toBe(30);
  });

  it("counts graphemes, not code units (emoji initial = 1 → 50)", () => {
    const result = getLettermark("🇵🇱");
    expect(result.initials).toBe("🇵🇱");
    expect(result.fontSize).toBe(50);
  });

  it("uses 50 for the '?' fallback", () => {
    expect(getLettermark("").fontSize).toBe(50);
  });
});

describe("getLettermark — fontSize override", () => {
  it("overrides the auto-computed size", () => {
    expect(getLettermark("Jan Kowalski", { fontSize: 36 }).fontSize).toBe(36);
    expect(getLettermark("Cher", { length: 1, fontSize: 36 }).fontSize).toBe(36);
  });

  it("falls back to auto when fontSize is not provided", () => {
    expect(getLettermark("Jan Kowalski").fontSize).toBe(42);
  });

  it("respects an explicit 0", () => {
    expect(getLettermark("Jan Kowalski", { fontSize: 0 }).fontSize).toBe(0);
  });
});

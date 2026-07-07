import { describe, expect, it } from "vitest";
import { getColor } from "./get-color.js";

const HEX = /^#[0-9a-f]{6}$/;

function gammaDecode(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const v = hex.replace("#", "");
  const r = gammaDecode(Number.parseInt(v.slice(0, 2), 16) / 255);
  const g = gammaDecode(Number.parseInt(v.slice(2, 4), 16) / 255);
  const b = gammaDecode(Number.parseInt(v.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe("getColor — output shape", () => {
  it("returns background and foreground as lowercase hex", () => {
    const { background, foreground } = getColor("Jan Kowalski");
    expect(background).toMatch(HEX);
    expect(foreground).toMatch(HEX);
  });

  it("foreground is one of the two contrast candidates", () => {
    const { foreground } = getColor("Ada Lovelace");
    expect(["#111111", "#ffffff"]).toContain(foreground);
  });
});

describe("getColor — determinism", () => {
  it("returns the same color for the same seed", () => {
    expect(getColor("Jan Kowalski")).toEqual(getColor("Jan Kowalski"));
  });

  it("produces different backgrounds for different seeds", () => {
    const a = getColor("Alice").background;
    const b = getColor("Bob").background;
    const c = getColor("Charlie").background;
    expect(new Set([a, b, c]).size).toBe(3);
  });
});

describe("getColor — palette", () => {
  const palette = ["#ff0000", "#00ff00", "#0000ff"];

  it("picks a background from the palette", () => {
    expect(palette).toContain(getColor("Jan", { palette }).background);
  });

  it("picks deterministically from the palette", () => {
    expect(getColor("Jan", { palette }).background).toBe(getColor("Jan", { palette }).background);
  });

  it("still returns a contrast-safe foreground for palette colors", () => {
    const { background, foreground } = getColor("Zoe", { palette: ["#000080"] });
    expect(background).toBe("#000080");
    expect(foreground).toBe("#ffffff");
  });
});

describe("getColor — WCAG contrast", () => {
  const names = [
    "Jan Kowalski",
    "Ada Lovelace",
    "Zoe",
    "李小龙",
    "Влад",
    "Grace Hopper",
    "🇵🇱",
    "a",
    "someone@example.com",
    "Wolfgang Amadeus Mozart",
  ];

  it.each(names)("meets AA contrast (>= 4.5:1) for %s", (name) => {
    const { background, foreground } = getColor(name);
    expect(contrast(background, foreground)).toBeGreaterThanOrEqual(4.5);
  });
});

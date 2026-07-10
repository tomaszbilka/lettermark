import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { Lettermark } from "./lettermark.js";

afterEach(() => {
  cleanup();
});

describe("Lettermark", () => {
  it("renders initials in SVG", () => {
    const { container } = render(<Lettermark name="Jan Kowalski" size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.querySelector("text")?.textContent).toBe("JK");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 100 100");
  });

  it("matches SSR and client markup for initials", () => {
    const element = <Lettermark name="Jan Kowalski" size={40} shape="rounded" />;
    const ssr = renderToString(element);
    const { container } = render(element);
    expect(ssr).toContain('role="img"');
    expect(ssr).toContain("JK");
    expect(container.innerHTML).toContain("JK");
    expect(container.querySelector('[data-shape="rounded"]')).toBeTruthy();
  });

  it("sets a11y attributes on root", () => {
    render(<Lettermark name="Jan Kowalski" size={40} alt="Jan K." />);
    const root = screen.getByRole("img", { name: "Jan K." });
    expect(root).toHaveAttribute("data-shape", "circle");
  });

  it("applies size in px", () => {
    render(<Lettermark name="Jan Kowalski" size={48} />);
    const root = screen.getByRole("img", { name: "Jan Kowalski" });
    expect(root).toHaveStyle({ width: "48px", height: "48px" });
  });

  it("applies CSS unit size", () => {
    render(<Lettermark name="Jan Kowalski" size="3rem" />);
    const root = screen.getByRole("img", { name: "Jan Kowalski" });
    expect(root.getAttribute("style")).toContain("3rem");
  });

  it("uses fluid size when size is omitted", () => {
    render(<Lettermark name="Jan Kowalski" />);
    const root = screen.getByRole("img", { name: "Jan Kowalski" });
    expect(root).toHaveStyle({ width: "100%", height: "100%", aspectRatio: "1 / 1" });
  });

  it("renders rounded rect for squircle shape", () => {
    const { container } = render(<Lettermark name="Jan Kowalski" size={40} shape="squircle" />);
    const rect = container.querySelector("rect");
    expect(rect?.getAttribute("rx")).toBe("28");
  });

  it("supports polymorphic as prop", () => {
    render(<Lettermark as="button" name="Jan Kowalski" size={40} type="button" />);
    expect(screen.getByRole("img", { name: "Jan Kowalski" }).tagName).toBe("BUTTON");
  });

  it("applies classNames to root and initials", () => {
    const { container } = render(
      <Lettermark
        name="Jan Kowalski"
        size={40}
        classNames={{ root: "avatar-root", initials: "avatar-initials" }}
      />,
    );
    expect(screen.getByRole("img", { name: "Jan Kowalski" })).toHaveClass("avatar-root");
    expect(container.querySelector(".avatar-initials")).toBeTruthy();
  });

  it("shows initials when image fails to load", () => {
    const { container } = render(<Lettermark name="Jan Kowalski" size={40} src="/broken.jpg" />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    if (img) fireEvent.error(img);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });

  it("resets image status when src changes", () => {
    const { container, rerender } = render(
      <Lettermark name="Jan Kowalski" size={40} src="/broken.jpg" />,
    );
    const brokenImg = container.querySelector("img");
    if (brokenImg) fireEvent.error(brokenImg);
    expect(container.querySelector("img")).toBeNull();

    rerender(<Lettermark name="Jan Kowalski" size={40} src="/ok.jpg" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/ok.jpg");
  });

  it("renders custom fallback instead of initials when image unavailable", () => {
    const { container } = render(
      <Lettermark name="Jan Kowalski" size={40} fallback={<span data-testid="fallback">?</span>} />,
    );
    expect(screen.getByTestId("fallback")).toBeTruthy();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("uses fixed color via palette override", () => {
    const { container } = render(<Lettermark name="Jan Kowalski" size={40} color="#ff0000" />);
    const fill = container.querySelector("circle")?.getAttribute("fill");
    expect(fill?.toLowerCase()).toBe("#ff0000");
  });
});

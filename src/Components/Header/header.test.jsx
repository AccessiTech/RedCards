import { test, expect, describe } from "vitest";
import { render } from "@testing-library/react";
import Header from "./Header";
import { norCalResistNumber } from "../Rights/content";

describe("Header", () => {
  test("Header renders without crashing", () => {
    expect(render(<Header />)).toBeDefined();
  });

  test("Header renders a nav element", () => {
    const header = render(<Header />).container;
    expect(header.querySelector("header")).toBeDefined();
  });

  test("Header renders the hotline button with expected tel href", () => {
    const header = render(<Header />).container;
    const hotlineButton = header.querySelector(".report-ice-activity-btn");

    expect(hotlineButton).toBeTruthy();
    expect(hotlineButton.getAttribute("href")).toBe(
      `tel:${norCalResistNumber.replace(/[^0-9]/g, "")}`
    );
  });
});
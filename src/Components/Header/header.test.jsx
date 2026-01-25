import { test, expect, describe } from "vitest";
import { render } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  test("Header renders without crashing", () => {
    expect(render(<Header />)).toBeDefined();
  });

  test("Header renders a nav element", () => {
    const header = render(<Header />).container;
    expect(header.querySelector("header")).toBeDefined();
  });
});
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Resources from "./Resources";
import { digitalResources, printableResources } from "./content";
import { BrowserRouter } from "react-router";

describe("Resources", () => {
  it("renders without crashing", () => {
    expect(render(<BrowserRouter><Resources /></BrowserRouter>)).toBeDefined();
  });

  it("renders digital and printable resource headers", () => {
    const resources = render(<BrowserRouter><Resources /></BrowserRouter>).container;
    const headers = resources.querySelectorAll("h2");
    expect(headers[0].textContent).toBe("Digital Resources");
    expect(headers[1].textContent).toBe("Printable Resources");
  });

  it("renders the correct number of resource buttons", () => {
    const resources = render(<BrowserRouter><Resources /></BrowserRouter>).container;
    const buttons = resources.querySelectorAll(".resource-btn");
    const count = Object.keys(printableResources).length + (Object.keys(digitalResources).length);
    expect(buttons.length).toBe(count);
  });
});
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResourceBtn from "./ResourceBtn";
import { BrowserRouter } from "react-router";

describe("ResourceBtn", () => {
  it("renders without crashing", () => {
    expect(render(<BrowserRouter><ResourceBtn /></BrowserRouter>)).toBeDefined();
  });
  it("renders with correct data", () => {
    const data = { title: "Resources", source: "https://example.com/" };
    const resources = render(<BrowserRouter><ResourceBtn data={data} /></BrowserRouter>).container;
    const button = resources.querySelector(".resource-btn");
    expect(button.textContent).toBe("Resources");
    expect(button.href).toBe(data.source);
  });
});
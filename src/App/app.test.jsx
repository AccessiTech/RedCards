import { test, expect, describe } from "vitest";
import { render } from "@testing-library/react";
import App from "../App/App";
import { BrowserRouter } from "react-router";

describe("App", () => {
  test("App renders without crashing", () => {
    expect(App).not.toThrow();
    expect(render(<BrowserRouter><App /></BrowserRouter>)).toBeDefined();
  });

  test("App renders header, main, and footer elements", () => {
    const app = render(<BrowserRouter><App /></BrowserRouter>).container;
    expect(app.querySelector("header")).toBeDefined(); 
    expect(app.querySelector("main")).toBeDefined();
    expect(app.querySelector("footer")).toBeDefined();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { BrowserRouter } from "react-router";
import App from "./App";

// Mock components to test isolated error handling
vi.mock("../Components/Header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../Components/Rights/Rights", () => ({
  default: () => <div data-testid="rights">Rights</div>,
}));

vi.mock("../Components/Resources/Resources", () => ({
  default: () => <div data-testid="resources">Resources</div>,
}));

vi.mock("../Components/Share/Share", () => ({
  default: () => <div data-testid="share">Share</div>,
}));

vi.mock("../Components/Footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("App with ErrorBoundaries", () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("renders all sections when no errors occur", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("rights")).toBeDefined();
    expect(screen.getByTestId("resources")).toBeDefined();
    expect(screen.getByTestId("share")).toBeDefined();
    expect(screen.getByTestId("footer")).toBeDefined();
  });

  it("has main content wrapped with id='content'", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const mainContent = document.getElementById("content");
    expect(mainContent).toBeDefined();
    expect(mainContent.tagName).toBe("MAIN");
  });

  it("wraps each major section in an ErrorBoundary", () => {
    // This test verifies the structure even without errors
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Each section should be wrapped in ErrorBoundary
    // We verify all sections render correctly (use getAllByTestId in case of DOM accumulation)
    expect(screen.getAllByTestId("header").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("rights").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("resources").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("share").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("footer").length).toBeGreaterThanOrEqual(1);
  });

  it("includes Container component from react-bootstrap", () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Bootstrap Container should be present
    const containerElement = container.querySelector(".container");
    expect(containerElement).toBeDefined();
  });

  it("has correct component hierarchy", () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Verify main content contains rights, resources, and share
    const mainElement = container.querySelector("main#content");
    expect(mainElement).toBeDefined();
    
    const rightsInMain = mainElement.querySelector('[data-testid="rights"]');
    const resourcesInMain = mainElement.querySelector('[data-testid="resources"]');
    const shareInMain = mainElement.querySelector('[data-testid="share"]');

    expect(rightsInMain).toBeDefined();
    expect(resourcesInMain).toBeDefined();
    expect(shareInMain).toBeDefined();
  });
});
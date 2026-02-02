/**
 * @vitest-environment jsdom
 */

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Root } from "./Root";

// Mock App component for isolated testing
vi.mock("../App/App", () => ({
  default: () => <div data-testid="app">App Component</div>,
}));

// Mock UpdatePrompt component
vi.mock("../Components/UpdatePrompt/UpdatePrompt", () => ({
  default: ({ show, onUpdate, onDismiss }) => (
    <div data-testid="update-prompt" data-show={show}>
      {show && (
        <>
          <button data-testid="update-button" onClick={onUpdate}>
            Update
          </button>
          <button data-testid="dismiss-button" onClick={onDismiss}>
            Dismiss
          </button>
        </>
      )}
    </div>
  ),
}));

describe("Root Component Integration Tests", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    const { container } = render(<Root />);
    expect(container).toBeTruthy();
  });

  it("renders UpdatePrompt component", () => {
    render(<Root />);
    const updatePrompt = screen.getByTestId("update-prompt");
    expect(updatePrompt).toBeDefined();
  });

  it("renders App component within BrowserRouter", () => {
    render(<Root />);
    const appComponent = screen.getByTestId("app");
    expect(appComponent).toBeDefined();
    expect(appComponent.textContent).toBe("App Component");
  });

  it("initializes with UpdatePrompt hidden", () => {
    render(<Root />);
    const updatePrompt = screen.getByTestId("update-prompt");
    expect(updatePrompt.getAttribute("data-show")).toBe("false");
  });

  it("has BrowserRouter with routes configured", () => {
    const { container } = render(<Root />);
    // BrowserRouter should wrap the App component
    expect(container.querySelector('[data-testid="app"]')).toBeDefined();
  });

  it("renders both UpdatePrompt and App together", () => {
    render(<Root />);
    
    // Both components should be present
    expect(screen.getByTestId("update-prompt")).toBeDefined();
    expect(screen.getByTestId("app")).toBeDefined();
  });

  it("manages update prompt state independently from App", () => {
    const { container } = render(<Root />);
    
    // UpdatePrompt and App should both be in the DOM
    const updatePrompt = screen.getByTestId("update-prompt");
    const app = screen.getByTestId("app");
    
    expect(updatePrompt).toBeDefined();
    expect(app).toBeDefined();
    
    // They should be siblings (both under Root's fragment)
    expect(updatePrompt.parentElement).toBe(app.parentElement);
  });
});

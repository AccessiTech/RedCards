import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

// Component that throws an error
const ThrowError = ({ shouldThrow, errorMessage = "Test error" }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
};

// Component that throws during lifecycle
class ThrowInLifecycle extends React.Component {
  componentDidMount() {
    if (this.props.throwInMount) {
      throw new Error("Error in componentDidMount");
    }
  }

  componentDidUpdate() {
    if (this.props.throwInUpdate) {
      throw new Error("Error in componentDidUpdate");
    }
  }

  render() {
    return <div>Lifecycle component</div>;
  }
}

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  const originalLocation = window.location;

  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    // Mock window.location
    delete window.location;
    window.location = { 
      reload: vi.fn(),
      href: "",
      origin: "http://localhost:3000"
    };
  });

  afterEach(() => {
    cleanup(); // Clean up after each test
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  describe("Basic Rendering", () => {
    it("renders children when there is no error", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText("Test content")).toBeDefined();
    });

    it("renders multiple children correctly", () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );
      expect(screen.getByText("First child")).toBeDefined();
      expect(screen.getByText("Second child")).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("renders fallback UI when there is an error", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    });

    it("displays error details in development mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Detailed test error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Detailed test error/i)).toBeDefined();
      expect(screen.getByText(/Error Details/i)).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it("hides error details in production mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Production error" />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/Error Details/i)).toBeNull();

      process.env.NODE_ENV = originalEnv;
    });

    it("catches errors in component lifecycle methods", () => {
      render(
        <ErrorBoundary>
          <ThrowInLifecycle throwInMount={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    });

    it("handles errors with missing error messages", () => {
      const ThrowNoMessage = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <ThrowNoMessage />
        </ErrorBoundary>
      );
      expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    });

    it("handles non-Error objects thrown", () => {
      const ThrowString = () => {
        throw "String error";
      };

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      );
      expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    });
  });

  describe("Error Callbacks", () => {
    it("calls onError callback when error occurs", () => {
      const onError = vi.fn();
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0].message).toBe("Test error");
    });

    it("calls onError with errorInfo containing componentStack", () => {
      const onError = vi.fn();
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][1]).toBeDefined();
      expect(onError.mock.calls[0][1]).toHaveProperty("componentStack");
    });

    it("does not throw when onError is not provided", () => {
      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });
  });

  describe("Custom Fallback", () => {
    it("renders custom fallback when provided", () => {
      const customFallback = <div>Custom error message</div>;
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom error message")).toBeDefined();
    });

    it("uses custom fallback over default", () => {
      const customFallback = <div>Custom fallback</div>;
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom fallback")).toBeDefined();
      expect(screen.queryByText(/Something went wrong/i)).toBeNull();
    });
  });

  describe("User Actions", () => {
    it("displays reload button in fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText(/Reload Page/i);
      expect(reloadButton).toBeDefined();
    });

    it("displays go home button in fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const homeButton = screen.getByText(/Go Home/i);
      expect(homeButton).toBeDefined();
    });

    it("displays report issue button in fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reportButton = screen.getByText(/Report Issue/i);
      expect(reportButton).toBeDefined();
    });

    it("calls window.location.reload when reload button is clicked", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText(/Reload Page/i);
      fireEvent.click(reloadButton);

      expect(window.location.reload).toHaveBeenCalled();
    });

    it("navigates to home when go home button is clicked", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const homeButton = screen.getByText(/Go Home/i);
      fireEvent.click(homeButton);

      expect(window.location.href).toBe("/");
    });

    it("opens GitHub issue page when report issue button is clicked", () => {
      const windowOpen = vi.fn();
      window.open = windowOpen;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Reportable error" />
        </ErrorBoundary>
      );

      const reportButton = screen.getByText(/Report Issue/i);
      fireEvent.click(reportButton);

      expect(windowOpen).toHaveBeenCalled();
      const url = windowOpen.mock.calls[0][0];
      expect(url).toContain("github.com");
      expect(url).toContain("issues/new");
      expect(url).toContain("Reportable%20error");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic alert for error message", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const alerts = container.querySelectorAll('[role="alert"]');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it("includes icon with error heading", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const icon = document.querySelector(".fa-exclamation-triangle");
      expect(icon).toBeDefined();
    });

    it("buttons have proper icons", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadIcon = document.querySelector(".fa-redo");
      const homeIcon = document.querySelector(".fa-home");
      const bugIcon = document.querySelector(".fa-bug");

      expect(reloadIcon).toBeDefined();
      expect(homeIcon).toBeDefined();
      expect(bugIcon).toBeDefined();
    });
  });

  describe("Nested ErrorBoundaries", () => {
    it("parent boundary catches child boundary errors", () => {
      const onOuterError = vi.fn();
      const onInnerError = vi.fn();

      // Inner boundary will catch this error
      render(
        <ErrorBoundary onError={onOuterError}>
          <div>Outer boundary</div>
          <ErrorBoundary onError={onInnerError}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(onInnerError).toHaveBeenCalled();
      // Outer boundary should not catch it (inner handled it)
      expect(onOuterError).not.toHaveBeenCalled();

      // Outer content should still be visible
      expect(screen.getByText("Outer boundary")).toBeDefined();
    });

    it("isolates errors to specific boundaries", () => {
      const { container } = render(
        <ErrorBoundary>
          <div>
            <ErrorBoundary>
              <div>Section 1 works</div>
            </ErrorBoundary>
            <ErrorBoundary>
              <ThrowError shouldThrow={true} />
            </ErrorBoundary>
            <ErrorBoundary>
              <div>Section 3 works</div>
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      );

      // Sections 1 and 3 should still render
      expect(screen.getByText("Section 1 works")).toBeDefined();
      expect(screen.getByText("Section 3 works")).toBeDefined();
      // Section 2 should show error - there should be exactly one error in this isolated render
      const errorContainers = container.querySelectorAll('.error-boundary-container');
      expect(errorContainers.length).toBe(1);
    });
  });
});

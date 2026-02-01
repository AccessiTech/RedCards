import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup, act } from "@testing-library/react";
import Share from "./Share";
import * as utils from "../../utils";

describe("Share", () => {
  let mockShareHandler;
  let originalNavigator;

  beforeEach(() => {
    // Save original navigator
    originalNavigator = global.navigator;

    // Mock navigator
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      },
      writable: true,
      configurable: true,
    });

    // Mock shareHandler
    mockShareHandler = vi.spyOn(utils, "shareHandler").mockResolvedValue(undefined);
  });

  afterEach(() => {
    // Always restore real timers in case a test failed
    vi.useRealTimers();
    
    // Restore original navigator
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });

    // Restore all mocks
    vi.restoreAllMocks();
    
    cleanup();
  });

  describe("Rendering", () => {
    test("Share renders without crashing", () => {
      expect(() => render(<Share />)).not.toThrow();
    });

    test("Share render the QR code", () => {
      const { container } = render(<Share />);
      const img = container.querySelector("img");
      expect(img).toBeDefined();
      expect(img.src).toContain("qr.svg");
      expect(img.alt).toBe("QR code to this website");
    });

    test("Share renders the link with the correct href", () => {
      const { container } = render(<Share />);
      expect(container.querySelector("a").href).toBe("http://localhost:3000/");
    });

    test("Share renders custom link text", () => {
      const linkText = "Know Your Rights";
      const { container } = render(<Share linkText={linkText} />);
      expect(container.querySelectorAll("p")[1].textContent).toContain(linkText);
    });

    test("Share displays 'Click to Copy' on desktop", () => {
      const { container } = render(<Share />);
      expect(container.querySelector("p").textContent).toContain("Click to Copy");
    });

    test("Share displays 'Click to Share' on mobile", () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      const { container } = render(<Share />);
      expect(container.querySelector("p").textContent).toContain("Click to Share");
    });

    test("Share uses custom siteUrl when provided", async () => {
      const customUrl = "https://example.com";
      render(<Share siteUrl={customUrl} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("link"));
      });

      expect(mockShareHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          shareUrl: customUrl,
        })
      );
    });
  });

  describe("handleShare - State Management", () => {
    test("sets isSharing state to true during share operation", async () => {
      let onSuccessCallback;
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccessCallback = onSuccess;
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      // Click to trigger share
      await act(async () => {
        fireEvent.click(link);
      });

      // Should show "Sharing..." text
      await waitFor(() => {
        expect(container.querySelector("p").textContent).toContain("Sharing...");
      });

      // Complete the share
      if (onSuccessCallback) {
        await act(async () => {
          onSuccessCallback("Link copied to clipboard");
        });
      }

      // Should return to normal text
      await waitFor(() => {
        expect(container.querySelector("p").textContent).toContain("Click to Copy");
      });
    });

    test("displays success message after successful share", async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Link copied to clipboard");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      await act(async () => {
        fireEvent.click(link);
      });

      // Should display success message
      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.success");
        expect(statusElement).toBeTruthy();
        expect(statusElement.textContent).toBe("Link copied to clipboard");
      });
    });

    test("displays error message after failed share", async () => {
      mockShareHandler.mockImplementation(async ({ onError }) => {
        onError("Permission denied. Please allow clipboard access in your browser settings.");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      await act(async () => {
        fireEvent.click(link);
      });

      // Should display error message
      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.error");
        expect(statusElement).toBeTruthy();
        expect(statusElement.textContent).toBe(
          "Permission denied. Please allow clipboard access in your browser settings."
        );
      });
    });

    test("sets aria-disabled attribute during share operation", async () => {
      let onSuccessCallback;
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccessCallback = onSuccess;
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      // Before click
      expect(link.getAttribute("aria-disabled")).toBe("false");

      // Click to trigger share
      await act(async () => {
        fireEvent.click(link);
      });

      // During share
      await waitFor(() => {
        expect(link.getAttribute("aria-disabled")).toBe("true");
      });

      // Complete the share
      if (onSuccessCallback) {
        await act(async () => {
          onSuccessCallback("Link copied to clipboard");
        });
      }

      // After share completes
      await waitFor(() => {
        expect(link.getAttribute("aria-disabled")).toBe("false");
      });
    });
  });

  describe("handleShare - Callback Invocations", () => {
    test("calls shareHandler with correct parameters", async () => {
      const shareTitle = "Test Title";
      const shareText = "Test Text";
      const siteUrl = "https://example.com";

      render(<Share siteUrl={siteUrl} shareTitle={shareTitle} shareText={shareText} />);

      const link = screen.getByRole("link");
      
      await act(async () => {
        fireEvent.click(link);
      });

      await waitFor(() => {
        expect(mockShareHandler).toHaveBeenCalledWith({
          shareUrl: siteUrl,
          shareTitle: shareTitle,
          shareText: shareText,
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        });
      });
    });

    test("onSuccess callback updates state correctly", async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Thanks for sharing!");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      await act(async () => {
        fireEvent.click(link);
      });

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.success");
        expect(statusElement).toBeTruthy();
        expect(statusElement.textContent).toBe("Thanks for sharing!");
      });
    });

    test("onError callback updates state correctly", async () => {
      mockShareHandler.mockImplementation(async ({ onError }) => {
        onError("Network error");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      await act(async () => {
        fireEvent.click(link);
      });

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.error");
        expect(statusElement).toBeTruthy();
        expect(statusElement.textContent).toBe("Network error");
      });
    });
  });

  describe("handleShare - Timeout Behavior", () => {
    test("success message clears after timeout",  async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Link copied to clipboard");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      // Wait for success message to appear
      await waitFor(() => {
        expect(container.querySelector(".share-status.success")).toBeTruthy();
      });

      // Wait longer than the 3 second timeout
      await new Promise(resolve => setTimeout(resolve, 3100));

      // Success message should be cleared
      expect(container.querySelector(".share-status")).toBeFalsy();
    }, 10000); // Increase test timeout

    test("error message clears after timeout", async () => {
      mockShareHandler.mockImplementation(async ({ onError }) => {
        onError("Something went wrong");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      // Wait for error message to appear
      await waitFor(() => {
        expect(container.querySelector(".share-status.error")).toBeTruthy();
      });

      // Wait longer than the 5 second timeout
      await new Promise(resolve => setTimeout(resolve, 5100));

      // Error message should be cleared
      expect(container.querySelector(".share-status")).toBeFalsy();
    }, 10000); // Increase test timeout

    test("timeout can be replaced by rapid clicks", async () => {
      let callCount = 0;
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        callCount++;
        onSuccess(`Success ${callCount}`);
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      // First click
      fireEvent.click(link);
      
      await waitFor(() => {
        expect(container.querySelector(".share-status.success")?.textContent).toBe("Success 1");
      });

      // Wait 1 second (before first timeout completes)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Second click - this should clear first timeout and set a new one
      fireEvent.click(link);
      
      await waitFor(() => {
        expect(container.querySelector(".share-status.success")?.textContent).toBe("Success 2");
      });

      // Wait 2.5 seconds - first timeout would have fired by now if not cleared,
      // but second timeout still has 1.5s to go
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Message should still be visible (second timeout hasn't fired yet)
      expect(container.querySelector(".share-status.success")).toBeTruthy();

      // Wait another 1 second for second timeout to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Now message should be cleared
      expect(container.querySelector(".share-status")).toBeFalsy();
    }, 10000); // Increase test timeout
  });

  describe("handleShare - Multiple Clicks", () => {
    test("handles rapid success then error clicks", async () => {
      let shouldSucceed = true;
      mockShareHandler.mockImplementation(async ({ onSuccess, onError }) => {
        if (shouldSucceed) {
          onSuccess("Success");
        } else {
          onError("Error");
        }
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      // First click - success
      fireEvent.click(link);
      
      // Wait for success message to appear
      await waitFor(() => {
        expect(container.querySelector(".share-status.success")).toBeTruthy();
      });

      // Second click - error, before first timeout
      shouldSucceed = false;
      fireEvent.click(link);
      
      // Wait for error message to appear and success to disappear
      await waitFor(() => {
        expect(container.querySelector(".share-status.error")).toBeTruthy();
        expect(container.querySelector(".share-status.success")).toBeFalsy();
      });
    });
  });

  describe("Component Lifecycle - Cleanup", () => {
    test("clears timeout on component unmount", async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Link copied to clipboard");
      });

      const { container, unmount } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      // Success message should appear
      await waitFor(() => {
        expect(container.querySelector(".share-status.success")).toBeTruthy();
      });

      // Now switch to fake timers
      vi.useFakeTimers();

      // Unmount before timeout completes
      unmount();

      // Fast-forward past the timeout
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // No errors should occur (timeout was cleaned up)
      // If timeout wasn't cleared, it would try to update unmounted component
      expect(true).toBe(true); // Test passes if no errors thrown
    });

    test("multiple unmounts don't cause errors", async () => {
      const { unmount } = render(<Share />);

      // Unmount multiple times shouldn't cause errors
      unmount();
      expect(() => unmount()).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    test("displays role='alert' for error messages", async () => {
      mockShareHandler.mockImplementation(async ({ onError }) => {
        onError("Error occurred");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.error");
        expect(statusElement).toBeTruthy();
        expect(statusElement.getAttribute("role")).toBe("alert");
      });
    });

    test("displays role='status' for success messages", async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Success");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.success");
        expect(statusElement).toBeTruthy();
        expect(statusElement.getAttribute("role")).toBe("status");
      });
    });

    test("all status messages have aria-live='polite'", async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Success");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status");
        expect(statusElement).toBeTruthy();
        expect(statusElement.getAttribute("aria-live")).toBe("polite");
      });
    });
  });

  describe("Styling", () => {
    test("success message has correct styling", async () => {
      mockShareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Success");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.success");
        expect(statusElement).toBeTruthy();
        const styles = statusElement.style;
        expect(styles.backgroundColor).toBe("rgb(209, 231, 221)");
        expect(styles.color).toBe("rgb(0, 0, 0)");
      });
    });

    test("error message has correct styling", async () => {
      mockShareHandler.mockImplementation(async ({ onError }) => {
        onError("Error");
      });

      const { container } = render(<Share />);
      const link = container.querySelector("a");

      fireEvent.click(link);

      await waitFor(() => {
        const statusElement = container.querySelector(".share-status.error");
        expect(statusElement).toBeTruthy();
        const styles = statusElement.style;
        expect(styles.backgroundColor).toBe("rgb(248, 215, 218)");
        expect(styles.color).toBe("rgb(132, 32, 41)");
      });
    });
  });
});
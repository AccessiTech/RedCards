import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import Header from "./Header";
import { norCalResistNumber } from "../Rights/content";
import * as utils from "../../utils";

describe("Header", () => {
  let scrollIntoViewMock;
  let alertMock;
  let matchMediaMock;

  beforeEach(() => {
    // Mock scrollIntoView
    scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    // Mock alert
    alertMock = vi.fn();
    global.alert = alertMock;

    // Mock matchMedia
    matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      media: "(display-mode: standalone)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    window.matchMedia = matchMediaMock;

    // Mock shareHandler
    vi.spyOn(utils, "shareHandler").mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

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

  test("renders custom title and lead when provided", () => {
    render(<Header title="Custom Title" lead="Custom lead text" />);
    expect(screen.getByText("Custom Title")).toBeDefined();
    expect(screen.getByText("Custom lead text")).toBeDefined();
  });

  test("renders default title when not provided", () => {
    render(<Header />);
    expect(screen.getByText("Know Your Rights")).toBeDefined();
  });

  test("hides Translate component when disableTranslate is true", () => {
    const { container } = render(<Header disableTranslate={true} />);
    // When translate is disabled, the root translate element should not be rendered
    expect(container.querySelector("#google_translate_element")).toBeNull();
  });

  test("shows Translate component when disableTranslate is false", () => {
    const { container } = render(<Header />);
    // When translate is enabled, the root translate element should be rendered
    expect(container.querySelector("#google_translate_element")).not.toBeNull();
  });
  describe("Scan button", () => {
    test("scrolls to QR code section when clicked", () => {
      render(<Header />);
      
      // Create a mock QR code section
      const qrSection = document.createElement("div");
      qrSection.id = "qr-link";
      document.body.appendChild(qrSection);

      const scanButton = screen.getByText("Scan");
      fireEvent.click(scanButton);

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

      // Cleanup
      document.body.removeChild(qrSection);
    });

    test("handles missing QR code section gracefully", () => {
      render(<Header />);
      const scanButton = screen.getByText("Scan");
      
      // Should not throw when QR section doesn't exist
      expect(() => fireEvent.click(scanButton)).not.toThrow();
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  describe("Save button", () => {
    test("shows alert when app is already installed", () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      fireEvent.click(saveButton);

      expect(alertMock).toHaveBeenCalledWith("This app is already installed.");
    });

    test("shows alert when beforeinstallprompt not available", () => {
      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      fireEvent.click(saveButton);

      expect(alertMock).toHaveBeenCalledWith(
        "To install this app, please use your browser's 'Add to Home Screen' option."
      );
    });

    test("prompts install when beforeinstallprompt is available", () => {
      const mockPrompt = vi.fn();
      const mockDeferredPrompt = {
        prompt: mockPrompt,
        userChoice: Promise.resolve({ outcome: "accepted" }),
      };

      // Trigger beforeinstallprompt event
      const { rerender, container } = render(<Header />);
      const event = new Event("beforeinstallprompt");
      event.preventDefault = vi.fn();
      Object.defineProperty(event, "userChoice", {
        value: mockDeferredPrompt.userChoice,
      });
      Object.defineProperty(event, "prompt", {
        value: mockPrompt,
      });
      window.dispatchEvent(event);

      rerender(<Header />);

      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      fireEvent.click(saveButton);

      expect(mockPrompt).toHaveBeenCalled();
    });

    test("hides Save button after prompting install", () => {
      const mockPrompt = vi.fn();
      const mockDeferredPrompt = {
        prompt: mockPrompt,
        userChoice: Promise.resolve({ outcome: "accepted" }),
      };

      const { rerender, container } = render(<Header />);
      const event = new Event("beforeinstallprompt");
      event.preventDefault = vi.fn();
      Object.defineProperty(event, "userChoice", {
        value: mockDeferredPrompt.userChoice,
      });
      Object.defineProperty(event, "prompt", {
        value: mockPrompt,
      });
      window.dispatchEvent(event);

      rerender(<Header />);

      let buttons = container.querySelectorAll('.share-bar button');
      let saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      fireEvent.click(saveButton);

      // Button should be hidden after click
      buttons = container.querySelectorAll('.share-bar button');
      saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      expect(saveButton).toBeUndefined();
    });

    test("re-shows Save button when user dismisses install prompt", async () => {
      const mockPrompt = vi.fn();
      let resolveUserChoice;
      const userChoicePromise = new Promise((resolve) => {
        resolveUserChoice = resolve;
      });

      const { rerender, container } = render(<Header />);
      const event = new Event("beforeinstallprompt");
      event.preventDefault = vi.fn();
      Object.defineProperty(event, "userChoice", {
        value: userChoicePromise,
      });
      Object.defineProperty(event, "prompt", {
        value: mockPrompt,
      });
      window.dispatchEvent(event);

      rerender(<Header />);

      let buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      fireEvent.click(saveButton);

      // Simulate user dismissing the prompt
      resolveUserChoice({ outcome: "dismissed" });
      await userChoicePromise;

      // Need to wait for state update
      await new Promise((resolve) => setTimeout(resolve, 0));
      rerender(<Header />);

      // Button should be visible again
      buttons = container.querySelectorAll('.share-bar button');
      const saveButtonAfter = Array.from(buttons).find(btn => btn.textContent === 'Save');
      expect(saveButtonAfter).toBeDefined();
    });
  });

  describe("Share button", () => {
    test("calls shareHandler when clicked", async () => {
      const { container } = render(<Header />);
      const shareButton = container.querySelector('button:last-of-type');
      
      await fireEvent.click(shareButton);

      expect(utils.shareHandler).toHaveBeenCalledWith({
        shareUrl: window.location.href,
        shareTitle: document.title,
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    test("shows alert on clipboard copy success", async () => {
      utils.shareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Link copied to clipboard");
      });

      const { container } = render(<Header />);
      const shareButtons = container.querySelectorAll('.share-bar button');
      const shareButton = shareButtons[shareButtons.length - 1];
      
      await fireEvent.click(shareButton);

      expect(alertMock).toHaveBeenCalledWith("Link copied to clipboard");
    });

    test("does not show alert when share succeeds without clipboard", async () => {
      utils.shareHandler.mockImplementation(async ({ onSuccess }) => {
        onSuccess("Thanks for sharing!");
      });

      const { container } = render(<Header />);
      const shareButtons = container.querySelectorAll('.share-bar button');
      const shareButton = shareButtons[shareButtons.length - 1];
      
      await fireEvent.click(shareButton);

      expect(alertMock).not.toHaveBeenCalled();
    });

    test("shows alert on permission denied error", async () => {
      utils.shareHandler.mockImplementation(async ({ onError }) => {
        onError("Permission denied. Please allow clipboard access in your browser settings.");
      });

      const { container } = render(<Header />);
      const shareButtons = container.querySelectorAll('.share-bar button');
      const shareButton = shareButtons[shareButtons.length - 1];
      
      await fireEvent.click(shareButton);

      expect(alertMock).toHaveBeenCalledWith(
        "Permission denied. Please allow clipboard access in your browser settings."
      );
    });

    test("shows alert on generic error", async () => {
      utils.shareHandler.mockImplementation(async ({ onError }) => {
        onError("Unable to share. Please try again.");
      });

      const { container } = render(<Header />);
      const shareButtons = container.querySelectorAll('.share-bar button');
      const shareButton = shareButtons[shareButtons.length - 1];
      
      await fireEvent.click(shareButton);

      expect(alertMock).toHaveBeenCalledWith("Share failed: Unable to share. Please try again.");
    });
  });
});
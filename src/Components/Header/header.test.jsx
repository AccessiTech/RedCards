import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import Header from "./Header";
import { getSacramentoPhoneNumber } from "../../config";
import * as utils from "../../utils";
import * as cacheUtils from "../../utils/cache";

const norCalResistNumber = getSacramentoPhoneNumber();

describe("Header", () => {
  let scrollIntoViewMock;
  let originalScrollIntoView;
  let alertMock;
  let originalAlert;
  let matchMediaMock;
  let originalMatchMedia;

  beforeEach(() => {
    // Mock scrollIntoView
    scrollIntoViewMock = vi.fn();
    originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    // Mock alert
    alertMock = vi.fn();
    originalAlert = global.alert;
    global.alert = alertMock;

    // Mock matchMedia
    originalMatchMedia = window.matchMedia;
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
    // Restore original scrollIntoView
    Element.prototype.scrollIntoView = originalScrollIntoView;
    // Restore original alert
    global.alert = originalAlert;
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
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
    test("shows already cached message when app installed and cache complete", async () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      // Mock cache as complete
      vi.spyOn(cacheUtils, 'isCached').mockReturnValue(true);

      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      
      fireEvent.click(saveButton);

      expect(alertMock).toHaveBeenCalledWith("App is installed and offline resources are cached!");
    });

    test("shows offline warning when app is installed and offline", async () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      // Mock online state and caches API not available in test environment
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      
      fireEvent.click(saveButton);

      // Wait for async handling
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith("Please connect to the internet to download offline resources.");
      });
    });

    test("shows loading spinner during caching", async () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      // Mock online state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      // Mock cacheResources to delay so we can see the spinner
      let resolveCaching;
      const cachingPromise = new Promise((resolve) => {
        resolveCaching = resolve;
      });
      vi.spyOn(cacheUtils, 'cacheResources').mockReturnValue(cachingPromise);
      vi.spyOn(cacheUtils, 'isCached').mockReturnValue(false);

      const { container, rerender } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      
      fireEvent.click(saveButton);

      // Check for spinner during caching
      await waitFor(() => {
        const spinnerButton = Array.from(container.querySelectorAll('.share-bar button'))
          .find(btn => btn.textContent.includes('Saving'));
        expect(spinnerButton).toBeDefined();
        expect(spinnerButton.querySelector('[role="status"]')).toBeDefined();
      });

      // Resolve the caching
      resolveCaching({ success: true, cached: 10, failed: 0 });
      await cachingPromise;
      rerender(<Header />);
    });

    test("shows partial success alert when some resources fail to cache", async () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      // Mock online state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      // Mock cacheResources with partial failure
      vi.spyOn(cacheUtils, 'cacheResources').mockResolvedValue({
        success: false,
        cached: 8,
        failed: 2
      });
      vi.spyOn(cacheUtils, 'isCached').mockReturnValue(false);

      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith("Cached 8 resources. 2 failed to cache.");
      });
    });

    test("shows error alert when caching completely fails", async () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      // Mock online state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      // Mock cacheResources to throw error
      vi.spyOn(cacheUtils, 'cacheResources').mockRejectedValue(new Error("Network failed"));
      vi.spyOn(cacheUtils, 'isCached').mockReturnValue(false);

      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith("Failed to cache resources: Network failed");
      });
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

    test("handles install prompt without userChoice property", () => {
      const mockPrompt = vi.fn();
      const mockDeferredPrompt = {
        prompt: mockPrompt,
        // No userChoice property
      };

      const { rerender, container } = render(<Header />);
      const event = new Event("beforeinstallprompt");
      event.preventDefault = vi.fn();
      Object.defineProperty(event, "prompt", {
        value: mockPrompt,
      });
      // Don't set userChoice
      window.dispatchEvent(event);

      rerender(<Header />);

      let buttons = container.querySelectorAll('.share-bar button');
      const saveButton = Array.from(buttons).find(btn => btn.textContent === 'Save');
      fireEvent.click(saveButton);

      expect(mockPrompt).toHaveBeenCalled();
      
      // Button should be hidden after click (then re-shown due to no userChoice)
      rerender(<Header />);
      buttons = container.querySelectorAll('.share-bar button');
      const saveButtonAfter = Array.from(buttons).find(btn => btn.textContent === 'Save');
      // Without userChoice, button gets re-shown
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

  describe("Accessibility", () => {
    test("Scan button has descriptive ARIA label", () => {
      render(<Header />);
      const scanButton = screen.getByLabelText("Scan QR code below");
      expect(scanButton).toBeDefined();
      expect(scanButton.textContent).toBe("Scan");
    });

    test("Share button has descriptive ARIA label", () => {
      render(<Header />);
      const shareButton = screen.getByLabelText("Share this page");
      expect(shareButton).toBeDefined();
      expect(shareButton.textContent).toBe("Share");
    });

    test("Save button has descriptive ARIA label when not installed", () => {
      matchMediaMock.mockReturnValue({
        matches: false,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(<Header />);
      const saveButton = screen.getByLabelText("Save app for offline use");
      expect(saveButton).toBeDefined();
    });

    test("Save button has contextual ARIA label when installed", () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(display-mode: standalone)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(<Header />);
      const saveButton = screen.getByLabelText("Download resources for offline use");
      expect(saveButton).toBeDefined();
    });

    test("ICE activity button has ARIA label with phone number", () => {
      render(<Header />);
      const iceButton = screen.getByLabelText(`Report ICE Activity - Call ${norCalResistNumber}`);
      expect(iceButton).toBeDefined();
      expect(iceButton.textContent).toContain(norCalResistNumber);
    });

    test("decorative phone emojis are hidden from screen readers", () => {
      const { container } = render(<Header />);
      const iceButton = container.querySelector('.report-ice-activity-btn');
      const ariaHiddenElements = iceButton.querySelectorAll('[aria-hidden="true"]');
      
      // Should have 2 emoji spans with aria-hidden
      expect(ariaHiddenElements.length).toBeGreaterThanOrEqual(2);
    });

    test("all interactive buttons are keyboard accessible", () => {
      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach(button => {
        // Buttons should be focusable (not have tabindex="-1")
        expect(button.getAttribute('tabindex')).not.toBe('-1');
        // Buttons should have either text content or aria-label
        const hasText = button.textContent.trim().length > 0;
        const hasAriaLabel = button.getAttribute('aria-label');
        expect(hasText || hasAriaLabel).toBe(true);
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { shareHandler } from "./utils";

describe("shareHandler - Error Handling", () => {
  let originalNavigator;
  let mockClipboard;
  let mockShare;

  beforeEach(() => {
    // Save original navigator
    originalNavigator = global.navigator;

    // Create mock clipboard
    mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };

    // Create mock share
    mockShare = vi.fn().mockResolvedValue(undefined);

    // Mock navigator with both clipboard and share
    Object.defineProperty(global, "navigator", {
      value: {
        clipboard: mockClipboard,
        share: mockShare,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      writable: true,
      configurable: true,
    });

    // Mock alert
    global.alert = vi.fn();
    global.console.error = vi.fn();
    global.console.log = vi.fn();
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  describe("Feature Detection", () => {
    it("detects and uses Clipboard API on desktop", async () => {
      await shareHandler({
        shareUrl: "https://example.com",
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith("https://example.com");
      expect(mockShare).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith("Link copied to clipboard");
    });

    it("throws error when Clipboard API is not available on desktop", async () => {
      // Remove clipboard API
      Object.defineProperty(global.navigator, "clipboard", {
        value: undefined,
        writable: true,
      });

      const onError = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onError,
      });

      expect(onError).toHaveBeenCalledWith("Clipboard API not supported in this browser");
      expect(mockClipboard.writeText).not.toHaveBeenCalled();
    });

    it("uses Share API on mobile when available", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      await shareHandler({
        shareUrl: "https://example.com",
        shareTitle: "Test Title",
        shareText: "Test Text",
      });

      expect(mockShare).toHaveBeenCalledWith({
        title: "Test Title",
        text: "Test Text",
        url: "https://example.com",
      });
      expect(mockClipboard.writeText).not.toHaveBeenCalled();
    });

    it("falls back to clipboard on mobile when Share API not available", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      // Remove share API
      Object.defineProperty(global.navigator, "share", {
        value: undefined,
        writable: true,
      });

      await shareHandler({
        shareUrl: "https://example.com",
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith("https://example.com");
      expect(global.alert).toHaveBeenCalledWith("Link copied to clipboard");
    });

    it("throws error when neither Share nor Clipboard API available on mobile", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      // Remove both APIs
      Object.defineProperty(global.navigator, "share", {
        value: undefined,
        writable: true,
      });
      Object.defineProperty(global.navigator, "clipboard", {
        value: undefined,
        writable: true,
      });

      const onError = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onError,
      });

      expect(onError).toHaveBeenCalledWith(
        "Neither Share API nor Clipboard API are supported in this browser"
      );
    });
  });

  describe("Error Handling - User Actions", () => {
    it("handles user cancelling share dialog gracefully", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      // Mock share rejection with AbortError
      const abortError = new Error("Share cancelled");
      abortError.name = "AbortError";
      mockShare.mockRejectedValue(abortError);

      const onError = vi.fn();
      const onSuccess = vi.fn();

      await shareHandler({
        shareUrl: "https://example.com",
        onError,
        onSuccess,
      });

      // Should not call error or success callbacks for user cancellation
      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(global.console.log).toHaveBeenCalledWith("Share cancelled by user");
    });
  });

  describe("Error Handling - Permissions", () => {
    it("handles clipboard permission denied error", async () => {
      // Mock clipboard rejection with NotAllowedError
      const permissionError = new Error("Permission denied");
      permissionError.name = "NotAllowedError";
      mockClipboard.writeText.mockRejectedValue(permissionError);

      const onError = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onError,
      });

      expect(onError).toHaveBeenCalledWith(
        "Permission denied. Please allow clipboard access in your browser settings."
      );
      expect(global.alert).not.toHaveBeenCalled(); // onError provided, so no alert
    });

    it("shows alert when permission denied and no onError callback", async () => {
      // Mock clipboard rejection with NotAllowedError
      const permissionError = new Error("Permission denied");
      permissionError.name = "NotAllowedError";
      mockClipboard.writeText.mockRejectedValue(permissionError);

      await shareHandler({
        shareUrl: "https://example.com",
      });

      expect(global.alert).toHaveBeenCalledWith(
        "Permission denied. Please allow clipboard access in your browser settings."
      );
    });
  });

  describe("Error Handling - Generic Errors", () => {
    it("handles generic clipboard errors", async () => {
      const genericError = new Error("Network error");
      mockClipboard.writeText.mockRejectedValue(genericError);

      const onError = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onError,
      });

      expect(onError).toHaveBeenCalledWith("Network error");
      expect(global.console.error).toHaveBeenCalledWith("Share failed:", genericError);
    });

    it("handles errors without message", async () => {
      const errorWithoutMessage = new Error();
      errorWithoutMessage.message = "";
      mockClipboard.writeText.mockRejectedValue(errorWithoutMessage);

      const onError = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onError,
      });

      expect(onError).toHaveBeenCalledWith("Unable to share. Please try again.");
    });

    it("shows alert for generic errors when no onError callback", async () => {
      const genericError = new Error("Something went wrong");
      mockClipboard.writeText.mockRejectedValue(genericError);

      await shareHandler({
        shareUrl: "https://example.com",
      });

      expect(global.alert).toHaveBeenCalledWith("Share failed: Something went wrong");
    });
  });

  describe("Success Callbacks", () => {
    it("calls onSuccess callback on desktop clipboard success", async () => {
      const onSuccess = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onSuccess,
      });

      expect(onSuccess).toHaveBeenCalledWith("Link copied to clipboard");
      expect(global.alert).not.toHaveBeenCalled(); // onSuccess provided, so no alert
    });

    it("calls onSuccess callback on mobile share success", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });

      const onSuccess = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onSuccess,
      });

      expect(onSuccess).toHaveBeenCalledWith("Thanks for sharing!");
      expect(global.console.log).not.toHaveBeenCalled(); // onSuccess provided, so no console.log
    });

    it("calls onSuccess callback on mobile clipboard fallback", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      // Remove share API
      Object.defineProperty(global.navigator, "share", {
        value: undefined,
        writable: true,
      });

      const onSuccess = vi.fn();
      await shareHandler({
        shareUrl: "https://example.com",
        onSuccess,
      });

      expect(onSuccess).toHaveBeenCalledWith("Link copied to clipboard");
      expect(global.alert).not.toHaveBeenCalled();
    });
  });

  describe("Default Behavior (No Callbacks)", () => {
    it("shows alert on desktop success when no onSuccess callback", async () => {
      await shareHandler({
        shareUrl: "https://example.com",
      });

      expect(global.alert).toHaveBeenCalledWith("Link copied to clipboard");
    });

    it("logs to console on mobile share success when no onSuccess callback", async () => {
      // Mock mobile user agent
      Object.defineProperty(global.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
      });

      await shareHandler({
        shareUrl: "https://example.com",
      });

      expect(global.console.log).toHaveBeenCalledWith("Thanks for sharing!");
    });
  });
});

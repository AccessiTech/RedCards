import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import ShareButton from "./ShareButton";
import * as utils from "../../utils";

describe("ShareButton", () => {
  let shareHandlerMock;

  beforeEach(() => {
    shareHandlerMock = vi.spyOn(utils, "shareHandler").mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("renders without crashing", () => {
    const { container } = render(<ShareButton />);
    expect(container.querySelector("button")).toBeDefined();
  });

  test("renders with default title", () => {
    const { container } = render(<ShareButton />);
    const button = container.querySelector("button");
    expect(button.getAttribute("title")).toBe("Share this resource");
  });

  test("renders with custom title when shareAlt is provided", () => {
    const { container } = render(<ShareButton shareAlt="Share custom content" />);
    const button = container.querySelector("button");
    expect(button.getAttribute("title")).toBe("Share custom content");
  });

  test("renders share icon", () => {
    const { container } = render(<ShareButton />);
    const icon = container.querySelector("i.fa-share-alt");
    expect(icon).toBeDefined();
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("calls shareHandler on click with all props", async () => {
    const shareUrl = "https://example.com/resource";
    const shareTite = "Test Title";
    const shareText = "Test description";
    
    const { container } = render(
      <ShareButton 
        shareUrl={shareUrl}
        shareTite={shareTite}
        shareText={shareText}
      />
    );
    
    const button = container.querySelector("button");
    await fireEvent.click(button);

    expect(shareHandlerMock).toHaveBeenCalledWith({
      shareUrl,
      shareTite,
      shareText,
    });
  });

  test("calls shareHandler on click with only shareUrl", async () => {
    const shareUrl = "https://example.com/resource";
    
    const { container } = render(<ShareButton shareUrl={shareUrl} />);
    
    const button = container.querySelector("button");
    await fireEvent.click(button);

    expect(shareHandlerMock).toHaveBeenCalledWith({
      shareUrl,
      shareTite: undefined,
      shareText: undefined,
    });
  });

  test("calls shareHandler on click with no props", async () => {
    const { container } = render(<ShareButton />);
    
    const button = container.querySelector("button");
    await fireEvent.click(button);

    expect(shareHandlerMock).toHaveBeenCalledWith({
      shareUrl: undefined,
      shareTite: undefined,
      shareText: undefined,
    });
  });

  test("prevents default behavior on click", async () => {
    const { container } = render(<ShareButton />);
    const button = container.querySelector("button");
    
    // Create a mock click event
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    button.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test("has correct styling", () => {
    const { container } = render(<ShareButton />);
    const button = container.querySelector("button");
    
    expect(button.className).toContain("btn-outline-secondary");
    expect(button.style.color).toBe("var(--bs-primary)");
  });
});

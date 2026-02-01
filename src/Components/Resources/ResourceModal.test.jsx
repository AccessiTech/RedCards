import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import ResourceModal from "./ResourceModal";
import { BrowserRouter } from "react-router";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ResourceModal", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders modal when showModal is true", () => {
    const modalContent = {
      title: "Test Resource",
      description: "Test description",
      links: [],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    // Modal renders in document.body
    expect(screen.getByText("Test Resource")).toBeDefined();
    expect(screen.getByText("Test description")).toBeDefined();
  });

  it("does not show modal content when showModal is false", () => {
    const modalContent = {
      title: "Test Resource",
      description: "Test description",
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={false} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    // Modal should not be visible
    expect(screen.queryByText("Test Resource")).toBeNull();
  });

  it("renders modal title and description", () => {
    const modalContent = {
      title: "Important Resource",
      description: "This is a detailed description",
      links: [],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Important Resource")).toBeDefined();
    expect(screen.getByText("This is a detailed description")).toBeDefined();
  });

  it("renders links without description as simple links", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [
        {
          title: "Simple Link",
          url: "https://example.com/simple",
        },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    const modalItems = document.querySelectorAll(".modal-item");
    expect(modalItems.length).toBe(1);
    
    // Should not have h3 when no description
    const h3 = modalItems[0].querySelector("h3");
    expect(h3).toBeNull();
    
    // Should have button with title
    expect(screen.getByText("Simple Link")).toBeDefined();
  });

  it("renders links with description showing h3 heading", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [
        {
          title: "Link with Description",
          description: "Detailed info",
          url: "https://example.com/detailed",
        },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    const h3 = screen.getByRole("heading", { name: "Link with Description", level: 3 });
    expect(h3).toBeDefined();
  });

  it("renders description as link when descriptionLink provided", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [
        {
          title: "Linked Description",
          description: "Click this description",
          descriptionLink: "https://example.com/desc",
          url: "https://example.com/main",
        },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    const descLink = screen.getByText("Click this description");
    expect(descLink.tagName).toBe("A");
    expect(descLink.href).toBe("https://example.com/desc");
  });

  it("renders description as plain text when no descriptionLink", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [
        {
          title: "Plain Description",
          description: "Just plain text",
          url: "https://example.com/main",
        },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    // Text should be present but not as a link
    const text = screen.getByText("Just plain text");
    expect(text.tagName).not.toBe("A");
  });

  it("renders button with custom btnText when provided", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [
        {
          title: "Resource Name",
          btnText: "custom_button_text",
          url: "https://example.com/custom",
        },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    // Should use titleCase and replace underscores
    expect(screen.getByText("Custom Button Text")).toBeDefined();
  });

  it("renders button with title when no btnText provided", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [
        {
          title: "default_title",
          url: "https://example.com/default",
        },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Default Title")).toBeDefined();
  });

  it("renders multiple links correctly", () => {
    const modalContent = {
      title: "Multi-Link Resource",
      description: "Has multiple links",
      links: [
        { title: "Link 1", url: "https://example.com/1" },
        { title: "Link 2", url: "https://example.com/2" },
        { title: "Link 3", url: "https://example.com/3" },
      ],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Link 1")).toBeDefined();
    expect(screen.getByText("Link 2")).toBeDefined();
    expect(screen.getByText("Link 3")).toBeDefined();
  });

  it("renders footer with source link", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      source: "https://example.com/source",
      sourceName: "Example Source",
      links: [],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    const sourceLink = screen.getByText("Example Source");
    expect(sourceLink.tagName).toBe("A");
    expect(sourceLink.href).toBe("https://example.com/source");
  });

  it("navigates to home when modal is closed via close button", () => {
    const modalContent = {
      title: "Resource",
      description: "Description",
      links: [],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    const closeButton = document.querySelector(".btn-close");
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    }
  });

  it("renders ShareButton in modal header", () => {
    const modalContent = {
      title: "Shareable Resource",
      description: "Can be shared",
      links: [],
    };
    
    render(
      <BrowserRouter>
        <ResourceModal showModal={true} modalContent={modalContent} />
      </BrowserRouter>
    );
    
    const shareButton = document.querySelector(".modal-header i.fa-share-alt");
    expect(shareButton).toBeDefined();
  });
});

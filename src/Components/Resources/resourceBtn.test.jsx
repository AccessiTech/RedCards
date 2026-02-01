import { render, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import ResourceBtn from "./ResourceBtn";
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

describe("ResourceBtn", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    expect(render(<BrowserRouter><ResourceBtn /></BrowserRouter>)).toBeDefined();
  });

  it("renders with correct data", () => {
    const data = { title: "Resources", source: "https://example.com/" };
    const resources = render(<BrowserRouter><ResourceBtn data={data} /></BrowserRouter>).container;
    const button = resources.querySelector(".resource-btn");
    expect(button.textContent).toBe("Resources");
    expect(button.href).toBe(data.source);
  });

  it("renders external link when no links provided", () => {
    const data = { title: "External Resource", source: "https://example.com/doc.pdf" };
    const { container } = render(
      <BrowserRouter>
        <ResourceBtn data={data} source="external" />
      </BrowserRouter>
    );
    const button = container.querySelector(".resource-btn");
    
    expect(button.href).toBe(data.source);
    expect(button.getAttribute("target")).toBe("_blank");
    expect(button.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("navigates to route when data has links property", () => {
    const data = { 
      title: "Multiple Links", 
      source: "https://example.com/",
      links: [
        { title: "Link 1", url: "https://example.com/1" },
        { title: "Link 2", url: "https://example.com/2" }
      ]
    };
    const source = "multi-resource";
    
    const { container } = render(
      <BrowserRouter>
        <ResourceBtn data={data} source={source} />
      </BrowserRouter>
    );
    
    const button = container.querySelector(".resource-btn");
    fireEvent.click(button);
    
    // Should prevent default and navigate
    expect(mockNavigate).toHaveBeenCalledWith(`/${source}`);
  });

  it("does not navigate when data has no links property", () => {
    const data = { 
      title: "Single Link", 
      source: "https://example.com/resource"
    };
    
    const { container } = render(
      <BrowserRouter>
        <ResourceBtn data={data} source="single" />
      </BrowserRouter>
    );
    
    const button = container.querySelector(".resource-btn");
    fireEvent.click(button);
    
    // Should not navigate (will follow href instead)
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles click event properly with links", () => {
    const data = { 
      title: "Modal Resource", 
      links: [{ title: "Link", url: "https://example.com" }]
    };
    
    const { container } = render(
      <BrowserRouter>
        <ResourceBtn data={data} source="modal-test" />
      </BrowserRouter>
    );
    
    const button = container.querySelector(".resource-btn");
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    button.dispatchEvent(clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/modal-test");
  });

  it("renders button with correct styling classes", () => {
    const data = { title: "Styled Button" };
    const { container } = render(
      <BrowserRouter>
        <ResourceBtn data={data} />
      </BrowserRouter>
    );
    
    const button = container.querySelector(".resource-btn");
    expect(button.className).toContain("btn-primary");
    expect(button.className).toContain("btn-lg");
    expect(button.className).toContain("resource-btn");
  });

  it("handles missing data gracefully", () => {
    const { container } = render(
      <BrowserRouter>
        <ResourceBtn source="test" />
      </BrowserRouter>
    );
    
    const button = container.querySelector(".resource-btn");
    expect(button).toBeDefined();
    expect(button.textContent).toBe("");
  });
});
import { render, cleanup, waitFor } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import Resources from "./Resources";
import { digitalResources, printableResources } from "./content";
import { BrowserRouter, MemoryRouter, Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";

describe("Resources", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    expect(render(<BrowserRouter><Resources /></BrowserRouter>)).toBeDefined();
  });

  it("renders digital and printable resource headers", () => {
    const resources = render(<BrowserRouter><Resources /></BrowserRouter>).container;
    const headers = resources.querySelectorAll("h2");
    expect(headers[0].textContent).toBe("Digital Resources");
    expect(headers[1].textContent).toBe("Printable Resources");
  });

  it("renders the correct number of resource buttons", () => {
    const resources = render(<BrowserRouter><Resources /></BrowserRouter>).container;
    const buttons = resources.querySelectorAll(".resource-btn");
    const count = Object.keys(printableResources).length + (Object.keys(digitalResources).length);
    expect(buttons.length).toBe(count);
  });

  it("hides digital resources when hideDigitals prop is true", () => {
    const { container } = render(<BrowserRouter><Resources hideDigitals={true} /></BrowserRouter>);
    const digitalHeader = container.querySelector("#digital-resources");
    expect(digitalHeader).toBeNull();
  });

  it("hides printable resources when hidePrintables prop is true", () => {
    const { container } = render(<BrowserRouter><Resources hidePrintables={true} /></BrowserRouter>);
    const printableHeader = container.querySelector("#printable-resources");
    expect(printableHeader).toBeNull();
  });

  it("shows modal when route has matching digital resource id", () => {
    const firstDigitalId = Object.keys(digitalResources)[0];
    
    render(
      <MemoryRouter initialEntries={[`/${firstDigitalId}`]}>
        <Routes>
          <Route path="/:id" element={<Resources />} />
        </Routes>
      </MemoryRouter>
    );
    
    const modal = document.querySelector('.modal.show');
    expect(modal).toBeDefined();
  });

  it("shows modal when route has matching printable resource id", () => {
    const firstPrintableId = Object.keys(printableResources)[0];
    
    render(
      <MemoryRouter initialEntries={[`/${firstPrintableId}`]}>
        <Routes>
          <Route path="/:id" element={<Resources />} />
        </Routes>
      </MemoryRouter>
    );
    
    const modal = document.querySelector('.modal.show');
    expect(modal).toBeDefined();
  });

  it("does not show modal when no route id present", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Resources />} />
        </Routes>
      </MemoryRouter>
    );
    
    const modal = document.querySelector('.modal.show');
    expect(modal).toBeNull();
  });

  it("does not show modal when route id does not match any resource", () => {
    render(
      <MemoryRouter initialEntries={['/invalid-resource-id']}>
        <Routes>
          <Route path="/:id" element={<Resources />} />
        </Routes>
      </MemoryRouter>
    );
    
    const modal = document.querySelector('.modal.show');
    expect(modal).toBeNull();
  });

  it("hides modal when route changes away from valid resource id", async () => {
    const firstDigitalId = Object.keys(digitalResources)[0];
    
    const { unmount } = render(
      <MemoryRouter initialEntries={[`/${firstDigitalId}`]}>
        <Routes>
          <Route path="/:id" element={<Resources />} />
        </Routes>
      </MemoryRouter>
    );
    
    let modal = document.querySelector('.modal.show');
    expect(modal).toBeDefined();
    
    unmount();
    
    render(
      <MemoryRouter initialEntries={['/other-id']}>
        <Routes>
          <Route path="/:id" element={<Resources />} />
        </Routes>
      </MemoryRouter>
    );
    
    modal = document.querySelector('.modal.show');
    expect(modal).toBeNull();
  });

  it("covers useEffect branch when id changes from valid resource to invalid", async () => {
    const firstDigitalId = Object.keys(digitalResources)[0];
    
    function TestNavigator() {
      const navigate = useNavigate();
      
      useEffect(() => {
        navigate(`/${firstDigitalId}`);
        
        const timer = setTimeout(() => {
          navigate('/invalid-id');
        }, 100);
        
        return () => clearTimeout(timer);
      }, [navigate]);
      
      return <Resources />;
    }
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/:id?" element={<TestNavigator />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(document.querySelector('.modal.show')).toBeDefined();
    });
    
    await waitFor(() => {
      expect(document.querySelector('.modal.show')).toBeNull();
    }, { timeout: 200 });
  });

  it("covers useEffect branch when id changes from valid to empty", async () => {
    const firstPrintableId = Object.keys(printableResources)[0];
    
    function TestNavigator() {
      const navigate = useNavigate();
      
      useEffect(() => {
        navigate(`/${firstPrintableId}`);
        
        const timer = setTimeout(() => {
          navigate('/');
        }, 100);
        
        return () => clearTimeout(timer);
      }, [navigate]);
      
      return <Resources />;
    }
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/:id?" element={<TestNavigator />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(document.querySelector('.modal.show')).toBeDefined();
    });
    
    await waitFor(() => {
      expect(document.querySelector('.modal.show')).toBeNull();
    }, { timeout: 200 });
  });
});
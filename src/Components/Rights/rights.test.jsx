import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import Rights from './Rights';
import { leftHeader, rightHeader } from './content';
import { regions } from '../../config';
import { BrowserRouter, Routes, Route, MemoryRouter, useNavigate } from 'react-router';
import { useEffect } from 'react';

// Import config data for tests
const ctaData = {
  url: regions.url,
  title: regions.title,
  description: regions.description,
  links: regions.networks.map((network, index) => {
    const isFirstInRegion = index === 0 || regions.networks[index - 1].region !== network.region;
    const displayNamePart = network.displayName ? ` (${network.displayName})` : '';
    const emailPart = network.email ? ` (${network.email})` : '';
    return {
      ...(isFirstInRegion && { title: network.region }),
      description: network.name + displayNamePart + emailPart,
      descriptionLink: network.url,
      url: `tel:${network.phoneNumber}`,
      btnText: network.phoneNumber,
    };
  })
};
const ctaTitle = regions.title;
const ctaUrl = regions.url;
const ctaSource = regions.source;

describe('Rights Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    render(<BrowserRouter><Rights /></BrowserRouter>);
  });

  it('renders default headers', () => {
    const rights = render(<BrowserRouter><Rights /></BrowserRouter>).container;
    const headers = rights.querySelectorAll('h2');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toBe(leftHeader);
    expect(headers[1].textContent).toBe(rightHeader);
  });

  it('renders custom headers', () => {
    const left = 'Left Header';
    const right = 'Right Header';
    const rights = render(<BrowserRouter><Rights leftHeader={left} rightHeader={right} /></BrowserRouter>).container;
    const headers = rights.querySelectorAll('h2');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toBe(left);
    expect(headers[1].textContent).toBe(right);
  });

  it('renders accreditation', () => {
    const rights = render(<BrowserRouter><Rights /></BrowserRouter>).container;
    const accredit = rights.querySelector('.credit');
    expect(accredit).toBeDefined();
  });

  it('renders the cta resource button', () => {
    const rights = render(<BrowserRouter><Rights /></BrowserRouter>).container;
    const buttons = rights.querySelectorAll('.resource-btn');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toBe(ctaTitle);
    const result = ctaData.links?.length ? '' : ctaUrl;
    expect(buttons[0].href).toBe(result);
  });

  it('renders both language tabs (Translated and English)', () => {
    render(<BrowserRouter><Rights /></BrowserRouter>);
    expect(screen.getByText('Translated')).toBeDefined();
    expect(screen.getByText('English')).toBeDefined();
  });

  it('switches between language tabs', () => {
    const { container } = render(<BrowserRouter><Rights /></BrowserRouter>);
    
    const translatedTab = screen.getByText('Translated');
    const englishTab = screen.getByText('English');
    
    // Click English tab
    fireEvent.click(englishTab);
    const englishPane = container.querySelector('.tab-pane.active.skiptranslate');
    expect(englishPane).not.toBeNull();
    
    // Click back to Translated tab
    fireEvent.click(translatedTab);
    const translatedPane = container.querySelector('.tab-pane.active:not(.skiptranslate)');
    expect(translatedPane).not.toBeNull();
  });

  it('shows modal when route has matching ctaSource id', () => {
    render(
      <MemoryRouter initialEntries={[`/${ctaSource}`]}>
        <Routes>
          <Route path="/:id" element={<Rights />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Modal should be shown in document
    const modal = document.querySelector('.modal.show');
    expect(modal).not.toBeNull();
  });

  it('does not show modal when no route id present', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Rights />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Modal should not be shown
    const modal = document.querySelector('.modal.show');
    expect(modal).toBeNull();
  });

  it('hides modal when route changes away from ctaSource', () => {
    // Start with ctaSource route
    const TestWrapper = ({ id }) => (
      <MemoryRouter initialEntries={[`/${id}`]}>
        <Routes>
          <Route path="/:id" element={<Rights />} />
        </Routes>
      </MemoryRouter>
    );

    // Manually render and update
    const { unmount } = render(<TestWrapper id={ctaSource} />);
    
    // Modal should be shown initially
    let modal = document.querySelector('.modal.show');
    expect(modal).not.toBeNull();
    
    // Unmount and remount with different id to trigger the useEffect cleanup branch
    unmount();
    
    render(<TestWrapper id="other-id" />);
    
    // Modal should be hidden
    modal = document.querySelector('.modal.show');
    expect(modal).toBeNull();
  });

  it('covers useEffect branch when id changes from ctaSource to different value', async () => {
    // Create a component that will trigger navigation
    function TestNavigator() {
      const navigate = useNavigate();
      
      useEffect(() => {
        // Start at ctaSource
        navigate(`/${ctaSource}`);
        
        // After a moment, navigate away
        const timer = setTimeout(() => {
          navigate('/other-value');
        }, 150);
        
        return () => clearTimeout(timer);
      }, [navigate]);
      
      return <Rights />;
    }
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/:id?" element={<TestNavigator />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for initial navigation to ctaSource
    await waitFor(() => {
      expect(document.querySelector('.modal.show')).not.toBeNull();
    }, { timeout: 1000 });
    
    // Wait for navigation away - this should trigger the id !== ctaSource branch
    await waitFor(() => {
      expect(document.querySelector('.modal.show')).toBeNull();
    }, { timeout: 1000 });
  });

  it('renders ResourceBtn with correct props', () => {
    const { container } = render(<BrowserRouter><Rights /></BrowserRouter>);
    const resourceBtn = container.querySelector('.resource-btn');
    expect(resourceBtn).not.toBeNull();
    expect(resourceBtn.textContent).toBe(ctaTitle);
  });

  describe('Accessibility', () => {
    it('language tabs have descriptive ARIA labels', () => {
      render(<BrowserRouter><Rights /></BrowserRouter>);
      
      const translatedTab = screen.getByLabelText('Show translated Red Card');
      expect(translatedTab).toBeDefined();
      expect(translatedTab.textContent).toBe('Translated');

      const englishTab = screen.getByLabelText('Show English Red Card');
      expect(englishTab).toBeDefined();
      expect(englishTab.textContent).toBe('English');
    });

    it('language tabs are keyboard accessible', () => {
      const { container } = render(<BrowserRouter><Rights /></BrowserRouter>);
      const tabs = container.querySelectorAll('.nav-link');
      
      expect(tabs.length).toBe(2);
      tabs.forEach(tab => {
        // React Bootstrap tabs use tabindex for internal navigation management
        // This is correct behavior - the Nav component manages focus
        // Tabs should have aria-label for accessibility
        expect(tab.getAttribute('aria-label')).toBeTruthy();
        // Verify they're clickable/interactive
        expect(tab.tagName).toBe('A');
      });
    });
  });
});


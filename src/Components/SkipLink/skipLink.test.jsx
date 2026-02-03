import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkipLink from './SkipLink';

describe('SkipLink', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkipLink />);
    const link = container.querySelector('.skip-link');
    expect(link).toBeDefined();
    expect(link.textContent).toBe('Skip to main content');
  });

  it('renders with default text', () => {
    const { container } = render(<SkipLink />);
    const link = container.querySelector('.skip-link');
    expect(link).toBeDefined();
    expect(link.tagName).toBe('A');
    expect(link.textContent).toBe('Skip to main content');
  });

  it('renders with default href', () => {
    const { container } = render(<SkipLink />);
    const link = container.querySelector('.skip-link');
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('renders with custom href', () => {
    const { container } = render(<SkipLink href="#custom-target" />);
    const link = container.querySelector('.skip-link');
    expect(link.getAttribute('href')).toBe('#custom-target');
  });

  it('renders with custom text', () => {
    const { container } = render(<SkipLink>Skip to content</SkipLink>);
    const link = container.querySelector('.skip-link');
    expect(link.textContent).toBe('Skip to content');
  });

  it('has skip-link class for styling', () => {
    const { container } = render(<SkipLink />);
    const link = container.querySelector('.skip-link');
    expect(link.className).toContain('skip-link');
  });

  it('is keyboard accessible', () => {
    const { container } = render(<SkipLink />);
    const link = container.querySelector('.skip-link');
    expect(link.getAttribute('href')).toBeTruthy();
    expect(link.tagName).toBe('A');
  });
});

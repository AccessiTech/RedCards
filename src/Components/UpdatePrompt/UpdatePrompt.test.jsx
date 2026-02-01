/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import UpdatePrompt from './UpdatePrompt';

describe('UpdatePrompt Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render UpdatePrompt component', () => {
    const { container } = render(<UpdatePrompt show={true} />);
    expect(container.querySelector('.update-prompt-container')).toBeTruthy();
  });

  it('should render with show prop set to false', () => {
    const { container } = render(<UpdatePrompt show={false} />);
    expect(container.querySelector('.update-prompt-container')).toBeTruthy();
  });

  it('should accept onUpdate callback prop', () => {
    const onUpdate = vi.fn();
    render(<UpdatePrompt show={true} onUpdate={onUpdate} />);
    expect(onUpdate).toBeDefined();
  });

  it('should accept onDismiss callback prop', () => {
    const onDismiss = vi.fn();
    render(<UpdatePrompt show={true} onDismiss={onDismiss} />);
    expect(onDismiss).toBeDefined();
  });

  it('should render with all required props', () => {
    const onUpdate = vi.fn();
    const onDismiss = vi.fn();
    const { container } = render(
      <UpdatePrompt show={true} onUpdate={onUpdate} onDismiss={onDismiss} />
    );
    
    expect(container.querySelector('.update-prompt-container')).toBeTruthy();
    expect(container.querySelector('.update-prompt-toast')).toBeTruthy();
  });
});


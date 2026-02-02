/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
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

  it('should call onUpdate when Reload button is clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <UpdatePrompt show={true} onUpdate={onUpdate} />
    );
    
    const reloadButton = container.querySelector('.update-prompt-reload');
    expect(reloadButton).toBeTruthy();
    
    fireEvent.click(reloadButton);
    
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('should call onDismiss when Later button is clicked', () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <UpdatePrompt show={true} onDismiss={onDismiss} />
    );
    
    const laterButton = container.querySelector('.update-prompt-dismiss');
    expect(laterButton).toBeTruthy();
    
    fireEvent.click(laterButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should not throw error when clicking Reload button without onUpdate callback', () => {
    const { container } = render(<UpdatePrompt show={true} />);
    
    const reloadButton = container.querySelector('.update-prompt-reload');
    expect(reloadButton).toBeTruthy();
    
    expect(() => fireEvent.click(reloadButton)).not.toThrow();
  });

  it('should not throw error when clicking Later button without onDismiss callback', () => {
    const { container } = render(<UpdatePrompt show={true} />);
    
    const laterButton = container.querySelector('.update-prompt-dismiss');
    expect(laterButton).toBeTruthy();
    
    expect(() => fireEvent.click(laterButton)).not.toThrow();
  });
});


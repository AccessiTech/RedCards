import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { isOnline, onNetworkChange, waitForOnline } from './network';

describe('network utilities', () => {
  let originalOnLine;

  beforeEach(() => {
    originalOnLine = Object.getOwnPropertyDescriptor(Navigator.prototype, 'onLine');
  });

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(Navigator.prototype, 'onLine', originalOnLine);
    }
    vi.clearAllMocks();
  });

  describe('isOnline', () => {
    test('returns true when navigator.onLine is true', () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => true,
        configurable: true
      });

      expect(isOnline()).toBe(true);
    });

    test('returns false when navigator.onLine is false', () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => false,
        configurable: true
      });

      expect(isOnline()).toBe(false);
    });
  });

  describe('onNetworkChange', () => {
    test('calls callback with true when online event fires', () => {
      const callback = vi.fn();
      const cleanup = onNetworkChange(callback);

      // Trigger online event
      window.dispatchEvent(new Event('online'));

      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledTimes(1);

      cleanup();
    });

    test('calls callback with false when offline event fires', () => {
      const callback = vi.fn();
      const cleanup = onNetworkChange(callback);

      // Trigger offline event
      window.dispatchEvent(new Event('offline'));

      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledTimes(1);

      cleanup();
    });

    test('cleanup function removes event listeners', () => {
      const callback = vi.fn();
      const cleanup = onNetworkChange(callback);

      cleanup();

      // Events after cleanup should not trigger callback
      window.dispatchEvent(new Event('online'));
      window.dispatchEvent(new Event('offline'));

      expect(callback).not.toHaveBeenCalled();
    });

    test('handles multiple network changes', () => {
      const callback = vi.fn();
      const cleanup = onNetworkChange(callback);

      window.dispatchEvent(new Event('offline'));
      window.dispatchEvent(new Event('online'));
      window.dispatchEvent(new Event('offline'));

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(1, false);
      expect(callback).toHaveBeenNthCalledWith(2, true);
      expect(callback).toHaveBeenNthCalledWith(3, false);

      cleanup();
    });
  });

  describe('waitForOnline', () => {
    test('resolves immediately when already online', async () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => true,
        configurable: true
      });

      const result = await waitForOnline();

      expect(result).toBe(true);
    });

    test('resolves when online event fires', async () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => false,
        configurable: true
      });

      const promise = waitForOnline();

      // Simulate going online after a short delay
      setTimeout(() => {
        window.dispatchEvent(new Event('online'));
      }, 10);

      const result = await promise;

      expect(result).toBe(true);
    });

    test('resolves false when timeout expires', async () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => false,
        configurable: true
      });

      const result = await waitForOnline(50);

      expect(result).toBe(false);
    });

    test('resolves true if online before timeout', async () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => false,
        configurable: true
      });

      const promise = waitForOnline(100);

      // Go online before timeout
      setTimeout(() => {
        window.dispatchEvent(new Event('online'));
      }, 10);

      const result = await promise;

      expect(result).toBe(true);
    });

    test('waits indefinitely without timeout parameter', async () => {
      Object.defineProperty(Navigator.prototype, 'onLine', {
        get: () => false,
        configurable: true
      });

      const promise = waitForOnline();

      // Go online after some time
      setTimeout(() => {
        window.dispatchEvent(new Event('online'));
      }, 100);

      const result = await promise;

      expect(result).toBe(true);
    }, 200);
  });
});

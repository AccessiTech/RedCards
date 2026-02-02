import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { getItem, setItem, removeItem, clear, isAvailable } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isAvailable', () => {
    test('returns true when localStorage is available', () => {
      expect(isAvailable()).toBe(true);
    });

    test('returns false when localStorage throws error', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(isAvailable()).toBe(false);

      setItemSpy.mockRestore();
    });
  });

  describe('getItem', () => {
    test('retrieves string value from localStorage', () => {
      localStorage.setItem('redcards_test', 'value');
      
      expect(getItem('test')).toBe('value');
    });

    test('retrieves and parses JSON value from localStorage', () => {
      const obj = { key: 'value', num: 42 };
      localStorage.setItem('redcards_test', JSON.stringify(obj));
      
      expect(getItem('test')).toEqual(obj);
    });

    test('returns default value when key does not exist', () => {
      expect(getItem('nonexistent')).toBe(null);
      expect(getItem('nonexistent', 'default')).toBe('default');
    });

    test('returns default value when localStorage throws error', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Error');
      });

      expect(getItem('test', 'fallback')).toBe('fallback');

      getItemSpy.mockRestore();
    });

    test('returns string when JSON parse fails', () => {
      localStorage.setItem('redcards_test', 'not json');
      
      expect(getItem('test')).toBe('not json');
    });

    test('logs error when localStorage fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      getItem('test');

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      getItemSpy.mockRestore();
    });
  });

  describe('setItem', () => {
    test('stores string value in localStorage', () => {
      const result = setItem('test', 'value');
      
      expect(result).toBe(true);
      expect(localStorage.getItem('redcards_test')).toBe('value');
    });

    test('stores JSON value in localStorage', () => {
      const obj = { key: 'value', num: 42 };
      const result = setItem('test', obj);
      
      expect(result).toBe(true);
      expect(localStorage.getItem('redcards_test')).toBe(JSON.stringify(obj));
    });

    test('returns false when localStorage throws error', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = setItem('test', 'value');

      expect(result).toBe(false);

      setItemSpy.mockRestore();
    });

    test('logs error when localStorage fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      setItem('test', 'value');

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    test('removes item from localStorage', () => {
      localStorage.setItem('redcards_test', 'value');
      
      const result = removeItem('test');
      
      expect(result).toBe(true);
      expect(localStorage.getItem('redcards_test')).toBe(null);
    });

    test('returns false when localStorage throws error', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Error');
      });

      const result = removeItem('test');

      expect(result).toBe(false);

      removeItemSpy.mockRestore();
    });

    test('logs error when localStorage fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      removeItem('test');

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      removeItemSpy.mockRestore();
    });
  });

  describe('clear', () => {
    test('clears only app-specific items from localStorage', () => {
      localStorage.setItem('redcards_test1', 'value1');
      localStorage.setItem('redcards_test2', 'value2');
      localStorage.setItem('other_app_key', 'value3');
      
      const result = clear();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('redcards_test1')).toBe(null);
      expect(localStorage.getItem('redcards_test2')).toBe(null);
      expect(localStorage.getItem('other_app_key')).toBe('value3');
    });

    test('returns false when localStorage throws error', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const keysGetter = vi.spyOn(Object, 'keys').mockImplementation(() => {
        throw new Error('Error');
      });

      const result = clear();

      expect(result).toBe(false);

      consoleErrorSpy.mockRestore();
      keysGetter.mockRestore();
    });

    test('logs error when localStorage fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const keysGetter = vi.spyOn(Object, 'keys').mockImplementation(() => {
        throw new Error('Storage error');
      });

      clear();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      keysGetter.mockRestore();
    });
  });
});

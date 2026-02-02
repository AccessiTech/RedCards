import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { getResourceUrls, cacheResources, getCacheStatus, isCached, clearCache } from './cache';
import * as storage from './storage';

// Mock the content module
vi.mock('../Components/Resources/content', () => ({
  redCardsPrintLinks: {
    english: 'https://example.com/english.pdf',
    spanish: 'https://example.com/spanish.pdf',
    chinese: 'https://example.com/chinese.pdf'
  }
}));

describe('cache utilities', () => {
  let mockCache;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock cache API
    mockCache = {
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(true)
    };

    global.caches = {
      open: vi.fn().mockResolvedValue(mockCache),
      delete: vi.fn().mockResolvedValue(true)
    };

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200
    });

    // Mock storage utilities
    vi.spyOn(storage, 'setItem').mockReturnValue(true);
    vi.spyOn(storage, 'getItem').mockReturnValue(null);
  });

  afterEach(() => {
    delete global.caches;
    delete global.fetch;
  });

  describe('getResourceUrls', () => {
    test('returns array of all resource URLs', () => {
      const urls = getResourceUrls();
      
      expect(urls).toBeInstanceOf(Array);
      expect(urls.length).toBeGreaterThan(0);
      expect(urls).toContain('https://example.com/english.pdf');
      expect(urls).toContain('https://example.com/spanish.pdf');
      expect(urls).toContain('https://example.com/chinese.pdf');
      expect(urls).toContain('/assets/Flyer.pdf');
      expect(urls).toContain('/assets/Flyer_blank.pdf');
      expect(urls).toContain('/assets/qr_black.svg');
      expect(urls).toContain('/assets/qr_red.svg');
    });
  });

  describe('cacheResources', () => {
    test('successfully caches all resources', async () => {
      const result = await cacheResources();

      expect(result.success).toBe(true);
      expect(result.cached).toBeGreaterThan(0);
      expect(result.failed).toBe(0);
      expect(result.errors).toEqual([]);
      expect(global.fetch).toHaveBeenCalled();
      expect(mockCache.put).toHaveBeenCalled();
      expect(storage.setItem).toHaveBeenCalledWith('offline_cache_status', expect.any(Object));
      expect(storage.setItem).toHaveBeenCalledWith('offline_cache_timestamp', expect.any(Number));
    });

    test('reports progress during caching', async () => {
      const onProgress = vi.fn();
      
      await cacheResources(onProgress);

      expect(onProgress).toHaveBeenCalled();
      expect(onProgress).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
    });

    test('handles fetch failures gracefully', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({ ok: true, status: 200 })
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: true, status: 200 });

      const result = await cacheResources();

      expect(result.success).toBe(true);
      expect(result.failed).toBeGreaterThan(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toHaveProperty('url');
      expect(result.errors[0]).toHaveProperty('error');
    });

    test('handles network errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await cacheResources();

      expect(result.success).toBe(true);
      expect(result.failed).toBeGreaterThan(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('returns failure when Cache API not available', async () => {
      delete global.caches;

      const result = await cacheResources();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].error).toContain('Cache API not available');
    });

    test('handles cache.open failure', async () => {
      global.caches.open = vi.fn().mockRejectedValue(new Error('Cache open failed'));

      const result = await cacheResources();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('reports partial success when some resources fail', async () => {
      const urls = getResourceUrls();
      const failureCount = 2;
      
      global.fetch = vi.fn((url, options) => {
        // Fail the first 2 requests
        if (urls.indexOf(url) < failureCount) {
          return Promise.reject(new Error('Failed'));
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

      const result = await cacheResources();

      expect(result.success).toBe(true);
      expect(result.failed).toBe(failureCount);
      expect(result.cached).toBe(urls.length - failureCount);
    });
  });

  describe('getCacheStatus', () => {
    test('returns null when cache status not available', () => {
      vi.spyOn(storage, 'getItem').mockReturnValue(null);

      const status = getCacheStatus();

      expect(status).toBe(null);
    });

    test('returns cache status with age', () => {
      const mockStatus = { cached: 10, failed: 0, total: 10, complete: true };
      const mockTimestamp = Date.now() - 5000; // 5 seconds ago
      
      vi.spyOn(storage, 'getItem')
        .mockReturnValueOnce(mockStatus)
        .mockReturnValueOnce(mockTimestamp);

      const status = getCacheStatus();

      expect(status).toEqual({
        ...mockStatus,
        timestamp: mockTimestamp,
        age: expect.any(Number)
      });
      expect(status.age).toBeGreaterThanOrEqual(5000);
    });

    test('returns cache status without timestamp', () => {
      const mockStatus = { cached: 10, failed: 0, total: 10, complete: true };
      
      vi.spyOn(storage, 'getItem')
        .mockReturnValueOnce(mockStatus)
        .mockReturnValueOnce(null);

      const status = getCacheStatus();

      expect(status).toEqual({
        ...mockStatus,
        timestamp: null,
        age: null
      });
    });
  });

  describe('isCached', () => {
    test('returns true when cache is complete', () => {
      const mockStatus = { cached: 10, failed: 0, total: 10, complete: true };
      
      vi.spyOn(storage, 'getItem')
        .mockReturnValueOnce(mockStatus)
        .mockReturnValueOnce(Date.now());

      expect(isCached()).toBe(true);
    });

    test('returns false when cache is incomplete', () => {
      const mockStatus = { cached: 8, failed: 2, total: 10, complete: false };
      
      vi.spyOn(storage, 'getItem')
        .mockReturnValueOnce(mockStatus)
        .mockReturnValueOnce(Date.now());

      expect(isCached()).toBe(false);
    });

    test('returns false when no cache status exists', () => {
      vi.spyOn(storage, 'getItem').mockReturnValue(null);

      expect(isCached()).toBe(false);
    });
  });

  describe('clearCache', () => {
    test('successfully clears cache', async () => {
      vi.spyOn(storage, 'removeItem').mockReturnValue(true);
      
      const result = await clearCache();

      expect(result).toBe(true);
      expect(global.caches.delete).toHaveBeenCalledWith('redcards-resources-v1');
      expect(storage.removeItem).toHaveBeenCalledWith('offline_cache_status');
      expect(storage.removeItem).toHaveBeenCalledWith('offline_cache_timestamp');
    });

    test('returns true when Cache API not available', async () => {
      delete global.caches;
      vi.spyOn(storage, 'removeItem').mockReturnValue(true);

      const result = await clearCache();

      expect(result).toBe(true);
      expect(storage.removeItem).toHaveBeenCalledWith('offline_cache_status');
      expect(storage.removeItem).toHaveBeenCalledWith('offline_cache_timestamp');
    });

    test('returns false when cache deletion fails', async () => {
      global.caches.delete = vi.fn().mockRejectedValue(new Error('Delete failed'));

      const result = await clearCache();

      expect(result).toBe(false);
    });

    test('logs error when cache deletion fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      global.caches.delete = vi.fn().mockRejectedValue(new Error('Delete failed'));

      await clearCache();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

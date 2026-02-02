/**
 * Cache utility for managing offline resource caching.
 * Works with service worker to cache external resources.
 */

import { redCardsPrintLinks } from '../Components/Resources/content';
import { setItem, getItem } from './storage';

const CACHE_NAME = 'redcards-resources-v1';
const CACHE_STATUS_KEY = 'offline_cache_status';
const CACHE_TIMESTAMP_KEY = 'offline_cache_timestamp';

/**
 * Get all external URLs that should be cached.
 * @returns {string[]} Array of URLs to cache
 */
export function getResourceUrls() {
  const urls = [];

  // Add all Red Card PDFs
  Object.values(redCardsPrintLinks).forEach(url => {
    urls.push(url);
  });

  // Add local flyer PDFs
  urls.push('/assets/Flyer.pdf');
  urls.push('/assets/Flyer_blank.pdf');

  // Add QR code SVGs
  urls.push('/assets/qr_black.svg');
  urls.push('/assets/qr.svg');
  urls.push('/assets/qr_red.svg');

  return urls;
}

/**
 * Cache all external resources for offline use.
 * @param {Function} onProgress - Optional callback for progress updates (current, total)
 * @returns {Promise<{success: boolean, cached: number, failed: number, errors: Array}>}
 */
export async function cacheResources(onProgress = null) {
  const urls = getResourceUrls();
  let cached = 0;
  let failed = 0;
  const errors = [];

  try {
    // Check if Cache API is available
    if (!('caches' in window)) {
      throw new Error('Cache API not available');
    }

    const cache = await caches.open(CACHE_NAME);

    // Cache each resource
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        // Fetch and cache the resource
        const response = await fetch(url, { mode: 'cors' });
        
        if (response.ok) {
          await cache.put(url, response);
          cached++;
        } else {
          failed++;
          errors.push({ url, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        failed++;
        errors.push({ url, error: error.message });
        console.warn(`Failed to cache ${url}:`, error);
      }

      // Report progress
      if (onProgress) {
        onProgress(i + 1, urls.length);
      }
    }

    // Store cache status
    const status = {
      cached,
      failed,
      total: urls.length,
      complete: failed === 0,
    };

    setItem(CACHE_STATUS_KEY, status);
    setItem(CACHE_TIMESTAMP_KEY, Date.now());

    return {
      success: true,
      cached,
      failed,
      errors,
    };
  } catch (error) {
    console.error('Cache operation failed:', error);
    return {
      success: false,
      cached,
      failed: urls.length - cached,
      errors: [{ error: error.message }],
    };
  }
}

/**
 * Get cache status information.
 * @returns {Object|null} Cache status or null if not cached
 */
export function getCacheStatus() {
  const status = getItem(CACHE_STATUS_KEY);
  const timestamp = getItem(CACHE_TIMESTAMP_KEY);

  if (!status) {
    return null;
  }

  return {
    ...status,
    timestamp,
    age: timestamp ? Date.now() - timestamp : null,
  };
}

/**
 * Check if resources are cached for offline use.
 * @returns {boolean} True if cached, false otherwise
 */
export function isCached() {
  const status = getCacheStatus();
  return status !== null && status.complete;
}

/**
 * Clear cached resources.
 * @returns {Promise<boolean>} True if successful
 */
export async function clearCache() {
  try {
    if ('caches' in window) {
      await caches.delete(CACHE_NAME);
    }
    setItem(CACHE_STATUS_KEY, null);
    setItem(CACHE_TIMESTAMP_KEY, null);
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

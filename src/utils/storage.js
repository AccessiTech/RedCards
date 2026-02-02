/**
 * localStorage utility wrapper with error handling and type safety.
 * Provides a safe interface for storing and retrieving data.
 */

const STORAGE_PREFIX = 'redcards_';

/**
 * Get item from localStorage with error handling.
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export function getItem(key, defaultValue = null) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const item = localStorage.getItem(prefixedKey);
    
    if (item === null) {
      return defaultValue;
    }

    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage with error handling.
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
export function setItem(key, value) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(prefixedKey, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage.
 * @param {string} key - Storage key
 * @returns {boolean} True if successful, false otherwise
 */
export function removeItem(key) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    localStorage.removeItem(prefixedKey);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all app-specific items from localStorage.
 * @returns {boolean} True if successful, false otherwise
 */
export function clear() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available.
 * @returns {boolean} True if available, false otherwise
 */
export function isAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Network utility functions for detecting online/offline state
 * and monitoring network connectivity changes.
 */

/**
 * Check if the browser is currently online.
 * @returns {boolean} True if online, false if offline
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Add listener for network status changes.
 * @param {Function} callback - Called with boolean (true = online, false = offline)
 * @returns {Function} Cleanup function to remove listeners
 */
export function onNetworkChange(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Wait for network to be online.
 * Resolves immediately if already online.
 * @param {number} timeout - Maximum time to wait in milliseconds (default: no timeout)
 * @returns {Promise<boolean>} Resolves to true when online, false if timeout
 */
export function waitForOnline(timeout = null) {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve(true);
      return;
    }

    let timeoutId;
    const cleanup = onNetworkChange((online) => {
      if (online) {
        if (timeoutId) clearTimeout(timeoutId);
        cleanup();
        resolve(true);
      }
    });

    if (timeout) {
      timeoutId = setTimeout(() => {
        cleanup();
        resolve(false);
      }, timeout);
    }
  });
}

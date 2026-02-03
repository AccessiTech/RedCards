/**
 * Simple validation functions for configuration data
 * No external dependencies - manual validation only
 */

/**
 * Validates a phone number string
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid format
 */
export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  // Basic format: XXX-XXX-XXXX (10 digits with dashes)
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validates a URL string
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a single rapid response network object
 * @param {object} network - Network object to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateNetwork(network) {
  const errors = [];

  if (!network || typeof network !== 'object') {
    return { valid: false, errors: ['Network must be an object'] };
  }

  // Required fields
  if (!network.id || typeof network.id !== 'string') {
    errors.push('Network must have a valid id (string)');
  }
  if (!network.name || typeof network.name !== 'string') {
    errors.push('Network must have a valid name (string)');
  }
  if (!network.region || typeof network.region !== 'string') {
    errors.push('Network must have a valid region (string)');
  }
  if (!network.coverage || typeof network.coverage !== 'string') {
    errors.push('Network must have a valid coverage (string)');
  }
  if (!network.phoneNumber || !validatePhoneNumber(network.phoneNumber)) {
    errors.push(`Network ${network.id || 'unknown'} has invalid phone number format`);
  }

  // Optional URL field
  if (network.url && !validateUrl(network.url)) {
    errors.push(`Network ${network.id || 'unknown'} has invalid URL`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates the entire regions configuration
 * @param {object} regionsConfig - Regions configuration object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateRegionsConfig(regionsConfig) {
  const errors = [];

  if (!regionsConfig || typeof regionsConfig !== 'object') {
    return { valid: false, errors: ['Regions config must be an object'] };
  }

  // Validate top-level fields
  if (!regionsConfig.title || typeof regionsConfig.title !== 'string') {
    errors.push('Config must have a title');
  }
  if (!regionsConfig.url || !validateUrl(regionsConfig.url)) {
    errors.push('Config must have a valid URL');
  }
  if (!Array.isArray(regionsConfig.networks)) {
    errors.push('Config must have a networks array');
    return { valid: false, errors };
  }

  // Validate each network
  regionsConfig.networks.forEach((network, index) => {
    const result = validateNetwork(network);
    if (!result.valid) {
      errors.push(`Network at index ${index}: ${result.errors.join(', ')}`);
    }
  });

  // Check for duplicate IDs
  const ids = regionsConfig.networks.map(n => n.id).filter(Boolean);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate network IDs found: ${duplicateIds.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Logs validation errors to console (dev mode) or throws (prod mode)
 * @param {string} configName - Name of the config being validated
 * @param {{ valid: boolean, errors: string[] }} result - Validation result
 */
export function handleValidationErrors(configName, result) {
  if (!result.valid) {
    const errorMessage = `${configName} validation failed:\n${result.errors.join('\n')}`;
    
    if (import.meta.env.DEV) {
      console.error(errorMessage);
    } else {
      // In production, throw error to prevent app from running with invalid config
      throw new Error(errorMessage);
    }
  }
}

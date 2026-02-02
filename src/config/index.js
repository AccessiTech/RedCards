/**
 * Central configuration export point
 * All configuration data is imported and re-exported from this file
 */

import regionsConfig from './regions.json';
import { validateRegionsConfig, handleValidationErrors } from './validators';

// Validate regions config on import (dev warnings, prod errors)
const regionsValidation = validateRegionsConfig(regionsConfig);
handleValidationErrors('Regions Config', regionsValidation);

/**
 * Rapid Response Networks configuration
 * Contains all California rapid response network contact information
 */
export const regions = regionsConfig;

/**
 * Helper function to get a specific network by ID
 * @param {string} id - Network ID
 * @returns {object|undefined} Network object or undefined
 */
export function getNetworkById(id) {
  return regionsConfig.networks.find(network => network.id === id);
}

/**
 * Helper function to get networks by region
 * @param {string} region - Region name
 * @returns {array} Array of network objects
 */
export function getNetworksByRegion(region) {
  return regionsConfig.networks.filter(network => network.region === region);
}

/**
 * Helper function to get all unique regions
 * @returns {array} Array of unique region names
 */
export function getAllRegions() {
  return [...new Set(regionsConfig.networks.map(network => network.region))];
}

/**
 * Helper function to find Sacramento network (used in Header)
 * @returns {string} Sacramento phone number or empty string
 */
export function getSacramentoPhoneNumber() {
  const sacramento = getNetworkById('sacramento');
  return sacramento?.phoneNumber || '';
}

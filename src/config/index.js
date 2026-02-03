/**
 * Central configuration export point
 * All configuration data is imported and re-exported from this file
 */

import regionsConfig from './regions.json';
import resourcesConfig from './resources.json';
import { validateRegionsConfig, handleValidationErrors } from './validators';
import * as constants from './constants';

// Validate regions config on import (dev warnings, prod errors)
const regionsValidation = validateRegionsConfig(regionsConfig);
handleValidationErrors('Regions Config', regionsValidation);

/**
 * Rapid Response Networks configuration
 * Contains all California rapid response network contact information
 */
export const regions = regionsConfig;

/**
 * Resources configuration
 * Contains digital and printable resource links
 */
export const resources = resourcesConfig;

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

/**
 * Helper function to get digital resources in legacy format
 * Transforms config format to match original content.js structure
 * @returns {object} Digital resources object
 */
export function getDigitalResources() {
  return {
    "informedimmigrant.com": {
      title: resourcesConfig.digital["informedimmigrant.com"].title,
      description: resourcesConfig.digital["informedimmigrant.com"].description,
      source: resourcesConfig.digital["informedimmigrant.com"].url,
    },
    "caimmigrant.org": {
      title: resourcesConfig.digital["caimmigrant.org"].title,
      source: resourcesConfig.digital["caimmigrant.org"].url,
      links: resourcesConfig.digital["caimmigrant.org"].links,
    },
  };
}

/**
 * Helper function to get red cards print links in legacy format
 * @returns {object} Object mapping language to PDF URL
 */
export function getRedCardsPrintLinks() {
  return resourcesConfig.printable.redCards.languages;
}

/**
 * Helper function to get printable resources in legacy format
 * Transforms config format to match original content.js structure
 * @returns {object} Printable resources object
 */
export function getPrintableResources() {
  const { redCards, flyers, qrCode } = resourcesConfig.printable;
  
  return {
    "Red Cards (Original)": {
      title: redCards.title,
      description: redCards.description,
      source: redCards.url,
      links: Object.keys(redCards.languages).map((language) => ({
        title: language,
        url: redCards.languages[language],
      })),
    },
    "Printable Flyers": {
      title: flyers.title,
      description: flyers.description,
      source: flyers.url,
      links: flyers.links,
    },
    "Printable QR Code": {
      title: qrCode.title,
      description: qrCode.description,
      source: qrCode.url,
      links: qrCode.links,
    },
  };
}

// Export constants
export { constants };
export const { theme, urls, app, pwa, analytics } = constants;


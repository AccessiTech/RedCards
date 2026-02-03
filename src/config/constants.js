/**
 * Application Constants
 * 
 * Centralized configuration for theme colors, URLs, app metadata, and PWA settings.
 * This is the single source of truth for all application constants.
 * 
 * @module config/constants
 */

/**
 * Theme color configuration
 * 
 * Used consistently across SCSS, PWA manifest, HTML meta tags, and components.
 * 
 * @type {Object}
 * @property {Object} colors - Color definitions
 * @property {string} colors.primary - Primary color (white) - #FFFFFF
 * @property {string} colors.secondary - Secondary/brand color (red) - #B11111
 * @property {string} colors.primaryRgb - Primary color as RGB string
 * @property {string} colors.secondaryRgb - Secondary color as RGB string
 */
export const theme = {
  colors: {
    primary: '#FFFFFF',
    secondary: '#B11111',
    primaryRgb: '255, 255, 255',
    secondaryRgb: '177, 17, 17',
  },
};

/**
 * URL configuration for external and internal resources
 * 
 * All external links should reference these constants to ensure consistency.
 * 
 * @type {Object}
 * @property {Object} external - External resource URLs
 * @property {Object} external.ilrc - Immigration Legal Resource Center URLs
 * @property {Object} external.informedImmigrant - Informed Immigrant URLs
 * @property {Object} external.github - GitHub repository URLs
 * @property {string} external.googleTranslate - Google Translate URL
 * @property {Object} internal - Internal application URLs
 */
export const urls = {
  external: {
    ilrc: {
      base: 'https://www.ilrc.org',
      redCards: 'https://www.ilrc.org/red-cards',
    },
    informedImmigrant: {
      base: 'https://www.informedimmigrant.com',
      knowYourRights: 'https://www.informedimmigrant.com/resources/detention-deportation/know-your-rights/',
    },
    github: {
      repo: 'https://github.com/AccessiTech/RedCards',
      issues: 'https://github.com/AccessiTech/RedCards/issues/new?template=Blank+issue',
      discussion: 'https://github.com/AccessiTech/RedCards/discussions/2',
    },
    googleTranslate: 'https://translate.google.com',
  },
  internal: {
    base: 'https://redcards.accessi.tech',
  },
};

/**
 * Application metadata and identity
 * 
 * Core information about the application. Used in PWA manifest, meta tags, and UI.
 * 
 * @type {Object}
 * @property {string} name - Full application name
 * @property {string} shortName - Short name for PWA (max 12 chars recommended)
 * @property {string} description - Application description for meta tags
 * @property {string} version - Current application version (synced with package.json)
 * @property {string} copyright - Copyright holder name
 * @property {string} lang - Primary language code (ISO 639-1)
 */
export const app = {
  name: 'Red Cards',
  shortName: 'redcards',
  description: "This is a digital version of the 'Red Cards' created by the Immigration Legal Resource Center.",
  version: '1.3.4',
  copyright: 'AccessiTech LLC',
  lang: 'en',
};

/**
 * Progressive Web App (PWA) configuration
 * 
 * Settings for PWA manifest generation.
 * 
 * @type {Object}
 * @property {string} display - Display mode ('fullscreen', 'standalone', 'minimal-ui', 'browser')
 * @property {string} startUrl - URL to load when the PWA is launched
 * @property {string} scope - Navigation scope for the PWA
 */
export const pwa = {
  display: 'fullscreen',
  startUrl: '/',
  scope: '/',
};

/**
 * Analytics configuration
 * 
 * Google Analytics settings. Currently not implemented (GA_MEASUREMENT_ID is null).
 * 
 * @type {Object}
 * @property {string|null} GA_MEASUREMENT_ID - Google Analytics 4 Measurement ID
 */
export const analytics = {
  GA_MEASUREMENT_ID: null,
};

/**
 * Default export containing all configuration constants
 * 
 * @type {Object}
 * @property {Object} theme - Theme configuration
 * @property {Object} urls - URL configuration
 * @property {Object} app - Application metadata
 * @property {Object} pwa - PWA settings
 * @property {Object} analytics - Analytics configuration
 */
export default {
  theme,
  urls,
  app,
  pwa,
  analytics,
};

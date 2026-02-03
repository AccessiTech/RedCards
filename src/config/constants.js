/**
 * Application Constants
 * Centralized configuration for theme colors, URLs, and metadata
 */

// Theme Colors
// Used consistently across SCSS, manifest.json, vite.config.js, and components
export const theme = {
  colors: {
    primary: '#FFFFFF',
    secondary: '#B11111',
    primaryRgb: '255, 255, 255',
    secondaryRgb: '177, 17, 17',
  },
};

// External URLs
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

// Application Metadata
export const app = {
  name: 'Red Cards',
  shortName: 'redcards',
  description: "This is a digital version of the 'Red Cards' created by the Immigration Legal Resource Center.",
  version: '1.3.4',
  copyright: 'AccessiTech LLC',
  lang: 'en',
};

// PWA Configuration
export const pwa = {
  display: 'fullscreen',
  startUrl: '/',
  scope: '/',
};

// Analytics Configuration
// GA_MEASUREMENT_ID is currently null - to be implemented in future phase
export const analytics = {
  GA_MEASUREMENT_ID: null,
};

// Export all constants as default for convenience
export default {
  theme,
  urls,
  app,
  pwa,
  analytics,
};

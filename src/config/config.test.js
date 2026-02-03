import { describe, it, expect } from 'vitest';
import {
  regions,
  resources,
  constants,
  theme,
  urls,
  app,
  pwa,
  analytics,
  getNetworkById,
  getNetworksByRegion,
  getAllRegions,
  getSacramentoPhoneNumber,
  getDigitalResources,
  getRedCardsPrintLinks,
  getPrintableResources,
} from './index';

describe('Config Module', () => {
  describe('regions', () => {
    it('should export regions config', () => {
      expect(regions).toBeDefined();
      expect(regions).toHaveProperty('networks');
      expect(Array.isArray(regions.networks)).toBe(true);
    });

    it('should have required fields', () => {
      expect(regions).toHaveProperty('title');
      expect(regions).toHaveProperty('url');
      expect(regions).toHaveProperty('source');
      expect(regions).toHaveProperty('description');
    });
  });

  describe('resources', () => {
    it('should export resources config', () => {
      expect(resources).toBeDefined();
      expect(resources).toHaveProperty('digital');
      expect(resources).toHaveProperty('printable');
    });

    it('should have digital resources', () => {
      expect(resources.digital).toHaveProperty('informedimmigrant.com');
      expect(resources.digital).toHaveProperty('caimmigrant.org');
    });

    it('should have printable resources', () => {
      expect(resources.printable).toHaveProperty('redCards');
      expect(resources.printable).toHaveProperty('flyers');
      expect(resources.printable).toHaveProperty('qrCode');
    });
  });

  describe('constants', () => {
    it('should export all constants', () => {
      expect(constants).toBeDefined();
      expect(constants).toHaveProperty('theme');
      expect(constants).toHaveProperty('urls');
      expect(constants).toHaveProperty('app');
      expect(constants).toHaveProperty('pwa');
      expect(constants).toHaveProperty('analytics');
    });

    it('should export theme constant', () => {
      expect(theme).toBeDefined();
      expect(theme.colors.primary).toBe('#FFFFFF');
      expect(theme.colors.secondary).toBe('#B11111');
    });

    it('should export urls constant', () => {
      expect(urls).toBeDefined();
      expect(urls.external).toBeDefined();
      expect(urls.external.ilrc).toBeDefined();
      expect(urls.external.github).toBeDefined();
    });

    it('should export app constant', () => {
      expect(app).toBeDefined();
      expect(app.name).toBe('Red Cards');
      expect(app.shortName).toBe('redcards');
    });

    it('should export pwa constant', () => {
      expect(pwa).toBeDefined();
      expect(pwa.display).toBe('fullscreen');
    });

    it('should export analytics constant', () => {
      expect(analytics).toBeDefined();
      expect(analytics.GA_MEASUREMENT_ID).toBeNull();
    });
  });

  describe('getNetworkById', () => {
    it('should return network by id', () => {
      const network = getNetworkById('sacramento');
      expect(network).toBeDefined();
      expect(network.id).toBe('sacramento');
      expect(network.name).toBeDefined();
      expect(network.phoneNumber).toBeDefined();
    });

    it('should return undefined for non-existent id', () => {
      const network = getNetworkById('nonexistent');
      expect(network).toBeUndefined();
    });
  });

  describe('getNetworksByRegion', () => {
    it('should return networks by region', () => {
      const networks = getNetworksByRegion('Bay Area');
      expect(Array.isArray(networks)).toBe(true);
      expect(networks.length).toBeGreaterThan(0);
      networks.forEach(network => {
        expect(network.region).toBe('Bay Area');
      });
    });

    it('should return empty array for non-existent region', () => {
      const networks = getNetworksByRegion('Nonexistent Region');
      expect(Array.isArray(networks)).toBe(true);
      expect(networks.length).toBe(0);
    });
  });

  describe('getAllRegions', () => {
    it('should return all unique regions', () => {
      const regions = getAllRegions();
      expect(Array.isArray(regions)).toBe(true);
      expect(regions.length).toBeGreaterThan(0);
      
      // Check for uniqueness
      const uniqueRegions = [...new Set(regions)];
      expect(regions.length).toBe(uniqueRegions.length);
    });

    it('should include known regions', () => {
      const regions = getAllRegions();
      expect(regions).toContain('Bay Area');
      expect(regions).toContain('North California');
    });
  });

  describe('getSacramentoPhoneNumber', () => {
    it('should return Sacramento phone number', () => {
      const phone = getSacramentoPhoneNumber();
      expect(phone).toBeDefined();
      expect(typeof phone).toBe('string');
      expect(phone).toMatch(/^\d{3}-\d{3}-\d{4}$/);
    });
  });

  describe('getDigitalResources', () => {
    it('should return digital resources in legacy format', () => {
      const digital = getDigitalResources();
      expect(digital).toBeDefined();
      expect(digital).toHaveProperty('informedimmigrant.com');
      expect(digital).toHaveProperty('caimmigrant.org');
    });

    it('should have correct structure for informedimmigrant.com', () => {
      const digital = getDigitalResources();
      expect(digital['informedimmigrant.com']).toHaveProperty('title');
      expect(digital['informedimmigrant.com']).toHaveProperty('description');
      expect(digital['informedimmigrant.com']).toHaveProperty('source');
    });

    it('should have correct structure for caimmigrant.org', () => {
      const digital = getDigitalResources();
      expect(digital['caimmigrant.org']).toHaveProperty('title');
      expect(digital['caimmigrant.org']).toHaveProperty('source');
      expect(digital['caimmigrant.org']).toHaveProperty('links');
    });
  });

  describe('getRedCardsPrintLinks', () => {
    it('should return red cards print links', () => {
      const links = getRedCardsPrintLinks();
      expect(links).toBeDefined();
      expect(typeof links).toBe('object');
    });

    it('should have language entries', () => {
      const links = getRedCardsPrintLinks();
      expect(Object.keys(links).length).toBeGreaterThan(0);
      
      // Check for some known languages (keys are lowercase in source)
      expect(links).toHaveProperty('english');
      expect(links).toHaveProperty('spanish');
    });

    it('should have valid URLs', () => {
      const links = getRedCardsPrintLinks();
      Object.values(links).forEach(url => {
        expect(url).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('getPrintableResources', () => {
    it('should return printable resources in legacy format', () => {
      const printable = getPrintableResources();
      expect(printable).toBeDefined();
      expect(printable).toHaveProperty('Red Cards (Original)');
      expect(printable).toHaveProperty('Printable Flyers');
      expect(printable).toHaveProperty('Printable QR Code');
    });

    it('should have correct structure for Red Cards', () => {
      const printable = getPrintableResources();
      const redCards = printable['Red Cards (Original)'];
      
      expect(redCards).toHaveProperty('title');
      expect(redCards).toHaveProperty('description');
      expect(redCards).toHaveProperty('source');
      expect(redCards).toHaveProperty('links');
      expect(Array.isArray(redCards.links)).toBe(true);
    });

    it('should transform languages to links array', () => {
      const printable = getPrintableResources();
      const redCards = printable['Red Cards (Original)'];
      
      expect(redCards.links.length).toBeGreaterThan(0);
      redCards.links.forEach(link => {
        expect(link).toHaveProperty('title');
        expect(link).toHaveProperty('url');
        expect(link.url).toMatch(/^https?:\/\//);
      });
    });

    it('should have correct structure for Flyers', () => {
      const printable = getPrintableResources();
      const flyers = printable['Printable Flyers'];
      
      expect(flyers).toHaveProperty('title');
      expect(flyers).toHaveProperty('description');
      expect(flyers).toHaveProperty('source');
      expect(flyers).toHaveProperty('links');
    });

    it('should have correct structure for QR Code', () => {
      const printable = getPrintableResources();
      const qrCode = printable['Printable QR Code'];
      
      expect(qrCode).toHaveProperty('title');
      expect(qrCode).toHaveProperty('description');
      expect(qrCode).toHaveProperty('source');
      expect(qrCode).toHaveProperty('links');
    });
  });
});

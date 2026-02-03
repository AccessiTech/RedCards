import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validatePhoneNumber,
  validateUrl,
  validateNetwork,
  validateRegionsConfig,
  handleValidationErrors,
} from './validators';

describe('Validators Module', () => {
  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('916-448-2364')).toBe(true);
      expect(validatePhoneNumber('123-456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123456789')).toBe(false);
      expect(validatePhoneNumber('123-456-789')).toBe(false);
      expect(validatePhoneNumber('123-45-6789')).toBe(false);
      expect(validatePhoneNumber('abc-def-ghij')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber(null)).toBe(false);
      expect(validatePhoneNumber(undefined)).toBe(false);
      expect(validatePhoneNumber(123)).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://www.ilrc.org/red-cards')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl(null)).toBe(false);
      expect(validateUrl(undefined)).toBe(false);
      expect(validateUrl(123)).toBe(false);
    });
  });

  describe('validateNetwork', () => {
    const validNetwork = {
      id: 'sacramento',
      region: 'Northern California',
      name: 'Sacramento Rapid Response Network',
      coverage: 'Sacramento County',
      phoneNumber: '916-448-2364',
      url: 'https://example.com',
    };

    it('should validate a correct network', () => {
      const result = validateNetwork(validNetwork);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject network with missing id', () => {
      const network = { ...validNetwork };
      delete network.id;
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid id (string)');
    });

    it('should reject network with invalid id type', () => {
      const network = { ...validNetwork, id: 123 };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid id (string)');
    });

    it('should reject network with missing region', () => {
      const network = { ...validNetwork };
      delete network.region;
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid region (string)');
    });

    it('should reject network with invalid region type', () => {
      const network = { ...validNetwork, region: 123 };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid region (string)');
    });

    it('should reject network with missing name', () => {
      const network = { ...validNetwork };
      delete network.name;
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid name (string)');
    });

    it('should reject network with invalid name type', () => {
      const network = { ...validNetwork, name: 123 };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid name (string)');
    });

    it('should reject network with missing coverage', () => {
      const network = { ...validNetwork };
      delete network.coverage;
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid coverage (string)');
    });

    it('should reject network with invalid coverage type', () => {
      const network = { ...validNetwork, coverage: 123 };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Network must have a valid coverage (string)');
    });

    it('should reject network with invalid phone number', () => {
      const network = { ...validNetwork, phoneNumber: 'invalid' };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/invalid phone number format/);
    });

    it('should reject network with missing phone number', () => {
      const network = { ...validNetwork };
      delete network.phoneNumber;
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/invalid phone number format/);
    });

    it('should reject network with invalid URL', () => {
      const network = { ...validNetwork, url: 'invalid-url' };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/invalid URL/);
    });

    it('should accept network with missing URL (optional field)', () => {
      const network = { ...validNetwork };
      delete network.url;
      const result = validateNetwork(network);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should collect multiple errors', () => {
      const network = {
        id: 'test',
        region: 'Test',
        name: 'Test',
        coverage: 'Test',
        phoneNumber: 'invalid',
        url: 'invalid',
      };
      const result = validateNetwork(network);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateRegionsConfig', () => {
    const validConfig = {
      title: 'Test Title',
      url: 'https://example.com',
      source: 'Test Source',
      description: 'Test Description',
      networks: [
        {
          id: 'test1',
          region: 'Test Region',
          name: 'Test Network',
          coverage: 'Test Coverage',
          phoneNumber: '123-456-7890',
          url: 'https://example.com',
        },
      ],
    };

    it('should validate a correct config', () => {
      const result = validateRegionsConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject null config', () => {
      const result = validateRegionsConfig(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Regions config must be an object');
    });

    it('should reject non-object config', () => {
      const result = validateRegionsConfig('not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Regions config must be an object');
    });

    it('should reject config with missing title', () => {
      const config = { ...validConfig };
      delete config.title;
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Config must have a title');
    });

    it('should reject config with invalid title type', () => {
      const config = { ...validConfig, title: 123 };
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Config must have a title');
    });

    it('should reject config with invalid URL', () => {
      const config = { ...validConfig, url: 'invalid-url' };
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Config must have a valid URL');
    });

    it('should reject config with missing URL', () => {
      const config = { ...validConfig };
      delete config.url;
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Config must have a valid URL');
    });

    it('should reject config with missing networks array', () => {
      const config = { ...validConfig };
      delete config.networks;
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Config must have a networks array');
    });

    it('should reject config with non-array networks', () => {
      const config = { ...validConfig, networks: 'not an array' };
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Config must have a networks array');
    });

    it('should validate networks and report errors with index', () => {
      const config = {
        ...validConfig,
        networks: [
          {
            id: 'test1',
            region: 'Test',
            name: 'Test',
            coverage: 'Test',
            phoneNumber: 'invalid',
            url: 'invalid',
          },
        ],
      };
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Network at index 0'))).toBe(true);
    });

    it('should detect duplicate network IDs', () => {
      const config = {
        ...validConfig,
        networks: [
          {
            id: 'duplicate',
            region: 'Test',
            name: 'Test 1',
            coverage: 'Test',
            phoneNumber: '123-456-7890',
            url: 'https://example.com',
          },
          {
            id: 'duplicate',
            region: 'Test',
            name: 'Test 2',
            coverage: 'Test',
            phoneNumber: '123-456-7890',
            url: 'https://example.com',
          },
        ],
      };
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate network IDs found: duplicate'))).toBe(true);
    });

    it('should handle networks without IDs when checking duplicates', () => {
      const config = {
        ...validConfig,
        networks: [
          {
            region: 'Test',
            name: 'Test 1',
            coverage: 'Test',
            phoneNumber: '123-456-7890',
            url: 'https://example.com',
          },
          {
            region: 'Test',
            name: 'Test 2',
            coverage: 'Test',
            phoneNumber: '123-456-7890',
            url: 'https://example.com',
          },
        ],
      };
      const result = validateRegionsConfig(config);
      expect(result.valid).toBe(false);
      // Should have errors for missing IDs but not duplicate ID errors
      expect(result.errors.some(e => e.includes('Duplicate network IDs'))).toBe(false);
    });
  });

  describe('handleValidationErrors', () => {
    let consoleErrorSpy;
    const originalEnv = import.meta.env.DEV;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      // Restore original env
      import.meta.env.DEV = originalEnv;
    });

    it('should do nothing if validation is valid', () => {
      const result = { valid: true, errors: [] };
      expect(() => handleValidationErrors('Test Config', result)).not.toThrow();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log errors in dev mode', () => {
      import.meta.env.DEV = true;
      const result = { valid: false, errors: ['Error 1', 'Error 2'] };
      
      expect(() => handleValidationErrors('Test Config', result)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test Config validation failed')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error 1')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error 2')
      );
    });

    it('should throw in production mode', () => {
      import.meta.env.DEV = false;
      const result = { valid: false, errors: ['Error 1', 'Error 2'] };
      
      expect(() => handleValidationErrors('Test Config', result)).toThrow(
        'Test Config validation failed'
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});

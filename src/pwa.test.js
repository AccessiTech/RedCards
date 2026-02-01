/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('PWA Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Vite PWA Plugin Configuration', () => {
    it('should have vite-plugin-pwa configured in vite.config.js', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      expect(viteConfig).toContain('VitePWA');
      expect(viteConfig).toContain('registerType: "prompt"');
    });

    it('should configure proper cache strategies for external resources', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      // Verify Google Fonts caching (check for the domain in comments and strings)
      expect(viteConfig).toContain('google-fonts-cache');
      expect(viteConfig).toContain('gstatic-fonts-cache');
      expect(viteConfig).toContain('CacheFirst');
      
      // Verify Google Translate caching
      expect(viteConfig).toContain('google-translate-cache');
      expect(viteConfig).toContain('NetworkFirst');
    });

    it('should have appropriate maxEntries for font caching', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      // Should have at least 20-30 maxEntries for fonts to handle variations
      expect(viteConfig).toMatch(/maxEntries:\s*30/);
    });

    it('should configure longer cache expiration for offline-first experience', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      // Google Translate should cache for 7 days (7 * 24 * 60 * 60 = 604800)
      expect(viteConfig).toContain('60 * 60 * 24 * 7');
    });

    it('should not precache large PDFs unnecessarily', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      // globPatterns should not include pdf to avoid bloating cache
      const globPatternsMatch = viteConfig.match(/globPatterns:\s*\[(.*?)\]/s);
      expect(globPatternsMatch).toBeTruthy();
      if (globPatternsMatch) {
        expect(globPatternsMatch[1]).not.toContain('pdf');
      }
    });
  });

  describe('Service Worker Registration', () => {
    it('should include custom update prompt implementation', () => {
      const indexJsx = readFileSync(join(process.cwd(), 'src/index.jsx'), 'utf-8');
      
      // Should have showUpdatePrompt function instead of browser confirm()
      expect(indexJsx).toContain('showUpdatePrompt');
      expect(indexJsx).not.toContain('confirm(');
      
      // Should create custom prompt UI
      expect(indexJsx).toContain('sw-update-prompt');
      expect(indexJsx).toContain('createElement');
    });

    it('should guard console.log for production', () => {
      const indexJsx = readFileSync(join(process.cwd(), 'src/index.jsx'), 'utf-8');
      
      // Console.log should be guarded by NODE_ENV check
      expect(indexJsx).toContain('process.env.NODE_ENV');
      expect(indexJsx).toContain('development');
      expect(indexJsx).toContain('console.log');
    });

    it('should provide user-friendly update UI with reload and dismiss options', () => {
      const indexJsx = readFileSync(join(process.cwd(), 'src/index.jsx'), 'utf-8');
      
      // Should have both reload and dismiss buttons
      expect(indexJsx).toContain('Reload');
      expect(indexJsx).toContain('Later');
      expect(indexJsx).toContain('removePrompt');
    });

    it('should prevent duplicate update prompts', () => {
      const indexJsx = readFileSync(join(process.cwd(), 'src/index.jsx'), 'utf-8');
      
      // Should check for existing prompt before showing new one
      expect(indexJsx).toContain('getElementById(\'sw-update-prompt\')');
    });
  });

  describe('Offline fallback page', () => {
    it('should have CSP-compliant event handlers', () => {
      const offlineHtml = readFileSync(join(process.cwd(), 'public/offline.html'), 'utf-8');
      
      // Should not use inline onclick handlers
      expect(offlineHtml).not.toContain('onclick=');
      
      // Should use addEventListener instead
      expect(offlineHtml).toContain('addEventListener');
      expect(offlineHtml).toContain('DOMContentLoaded');
    });

    it('should have user-friendly offline message and actions', () => {
      const offlineHtml = readFileSync(join(process.cwd(), 'public/offline.html'), 'utf-8');
      
      expect(offlineHtml).toContain("You're Offline");
      expect(offlineHtml).toContain('Try Again');
      expect(offlineHtml).toContain('Go Home');
    });

    it('should inform users about offline capabilities', () => {
      const offlineHtml = readFileSync(join(process.cwd(), 'public/offline.html'), 'utf-8');
      
      expect(offlineHtml).toContain('While Offline You Can');
      expect(offlineHtml).toMatch(/View your rights/i);
    });
  });

  describe('Runtime caching patterns', () => {
    it('should validate Google Fonts URL pattern', () => {
      const googleFontsPattern = /^https:\/\/fonts\.googleapis\.com\/.*/i;
      
      expect(googleFontsPattern.test('https://fonts.googleapis.com/css?family=Roboto')).toBe(true);
      expect(googleFontsPattern.test('https://fonts.googleapis.com/css2?family=Open+Sans')).toBe(true);
      expect(googleFontsPattern.test('https://example.com')).toBe(false);
      expect(googleFontsPattern.test('http://fonts.googleapis.com/css')).toBe(false);
    });

    it('should validate Google Fonts static resources pattern', () => {
      const gstaticPattern = /^https:\/\/fonts\.gstatic\.com\/.*/i;
      
      expect(gstaticPattern.test('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2')).toBe(true);
      expect(gstaticPattern.test('https://example.com')).toBe(false);
    });

    it('should validate Google Translate API pattern', () => {
      const translatePattern = /^https:\/\/translate\.googleapis\.com\/.*/i;
      
      expect(translatePattern.test('https://translate.googleapis.com/translate_a/element.js')).toBe(true);
      expect(translatePattern.test('https://translate.googleapis.com/translate_a/t')).toBe(true);
      expect(translatePattern.test('https://example.com')).toBe(false);
    });
  });

  describe('Manifest configuration', () => {
    it('should have complete PWA manifest configuration', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      // Check for essential manifest fields
      expect(viteConfig).toContain('name: "Red Cards"');
      expect(viteConfig).toContain('short_name: "redcards"');
      expect(viteConfig).toContain('theme_color: "#B11111"');
      expect(viteConfig).toContain('background_color: "#FFFFFF"');
      expect(viteConfig).toContain('display: "fullscreen"');
      expect(viteConfig).toContain('start_url: "/"');
    });

    it('should include properly configured icons', () => {
      const viteConfig = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
      
      expect(viteConfig).toContain('android-chrome-192x192.png');
      expect(viteConfig).toContain('android-chrome-512x512.png');
      expect(viteConfig).toContain('type: "image/png"');
    });
  });
});

import { vi } from 'vitest';

// Mock virtual:pwa-register globally for all tests
vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn((config) => {
    return vi.fn();
  }),
}));

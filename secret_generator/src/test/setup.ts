import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: webcrypto,
  });
}

Object.defineProperty(navigator, 'clipboard', {
  configurable: true,
  value: {
    writeText: async () => undefined,
  },
});

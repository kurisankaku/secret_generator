import { describe, expect, it } from 'vitest';
import { generateToken } from './token';

describe('token', () => {
  it('generates a token with the requested bit strength and prefix', () => {
    const token = generateToken({ bits: 256, format: 'base64url-no-padding', prefix: 'sk_' });

    expect(token.value.startsWith('sk_')).toBe(true);
    expect(token.bits).toBe(256);
    expect(token.bytes).toBe(32);
    expect(token.estimatedEntropyBits).toBe(256);
  });

  it('rejects non-byte-aligned bit lengths', () => {
    expect(() => generateToken({ bits: 129, format: 'hex' })).toThrow(/multiple of 8/u);
  });
});

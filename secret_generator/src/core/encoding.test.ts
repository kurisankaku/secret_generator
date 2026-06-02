import { describe, expect, it } from 'vitest';
import { encodeBase64, encodeBase64Url, encodeHex, encodeSecret } from './encoding';

describe('encoding', () => {
  it('encodes lowercase hex and preserves leading zeroes', () => {
    expect(encodeHex(new Uint8Array([0, 15, 16, 255]))).toBe('000f10ff');
  });

  it('encodes standard Base64', () => {
    expect(encodeBase64(new TextEncoder().encode('hello'))).toBe('aGVsbG8=');
  });

  it('encodes Base64url with and without padding', () => {
    expect(encodeBase64Url(new Uint8Array([251, 255]), { padding: true })).toBe('-_8=');
    expect(encodeBase64Url(new Uint8Array([251, 255]), { padding: false })).toBe('-_8');
  });

  it('routes through encodeSecret', () => {
    expect(encodeSecret(new Uint8Array([222, 173, 190, 239]), 'hex')).toBe('deadbeef');
  });
});

import { describe, expect, it } from 'vitest';
import { secretPresets } from './presets';

describe('secretPresets', () => {
  it('contains the MVP presets and excludes passphrase', () => {
    const presetIds = secretPresets.map((preset) => preset.id);

    expect(presetIds).toEqual(
      expect.arrayContaining([
        'random-password',
        'sign-in-password',
        'database-password',
        'pin',
        'api-token',
        'webhook-secret',
        'session-secret',
        'csrf-secret',
        'jwt-hs256',
        'jwt-hs384',
        'jwt-hs512',
        'aes-gcm-key',
        'hmac-sha256-key',
        'hmac-sha384-key',
        'hmac-sha512-key',
        'hex-token',
        'base64-token',
        'base64url-token',
        'random-bytes',
        'uuid-v4',
        'env-secret',
      ]),
    );
    expect(presetIds).not.toContain('passphrase');
  });

  it('uses at least 256 bits for JWT HS256 by default', () => {
    const jwtPreset = secretPresets.find((preset) => preset.id === 'jwt-hs256');

    expect(jwtPreset?.defaultOptions).toMatchObject({ bits: 256, format: 'base64url-no-padding' });
  });
});

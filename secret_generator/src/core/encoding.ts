import type { SecretFormat } from './types';

const BASE64_CHUNK_SIZE = 0x8000;

export function encodeHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';

  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_SIZE) {
    const chunk = bytes.subarray(offset, offset + BASE64_CHUNK_SIZE);
    binary += String.fromCharCode(...chunk);
  }

  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(binary);
  }

  return Buffer.from(bytes).toString('base64');
}

export function encodeBase64Url(
  bytes: Uint8Array,
  options: { padding?: boolean } = {},
): string {
  const withPadding = options.padding ?? true;
  const encoded = encodeBase64(bytes).replace(/\+/gu, '-').replace(/\//gu, '_');

  return withPadding ? encoded : encoded.replace(/=+$/u, '');
}

export function encodeSecret(bytes: Uint8Array, format: SecretFormat): string {
  switch (format) {
    case 'hex':
      return encodeHex(bytes);
    case 'base64':
      return encodeBase64(bytes);
    case 'base64url':
      return encodeBase64Url(bytes, { padding: true });
    case 'base64url-no-padding':
      return encodeBase64Url(bytes, { padding: false });
    default:
      throw new Error('secret format is not supported');
  }
}

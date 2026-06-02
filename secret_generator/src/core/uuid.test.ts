import { describe, expect, it } from 'vitest';
import { generateUuidV4 } from './uuid';

describe('uuid', () => {
  it('generates a UUID v4 value', () => {
    const uuid = generateUuidV4();

    expect(uuid.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u);
    expect(uuid.estimatedEntropyBits).toBe(122);
  });
});

export const MAX_GENERATED_BYTES = 1024;
export const MAX_PASSWORD_LENGTH = 1024;

export function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

export function assertSafeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${name} must be a safe integer`);
  }
}

export function assertOneOf<T extends string | number>(
  value: unknown,
  allowed: readonly T[],
  name: string,
): asserts value is T {
  if (!allowed.includes(value as T)) {
    throw new Error(`${name} is not supported`);
  }
}

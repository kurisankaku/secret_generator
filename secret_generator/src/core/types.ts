export type SecretFormat = 'hex' | 'base64' | 'base64url' | 'base64url-no-padding';

export type SecretCategory =
  | 'password'
  | 'numeric-code'
  | 'token'
  | 'jwt-secret'
  | 'encryption-key'
  | 'random'
  | 'env';

export type GeneratedSecret = {
  value: string;
  label: string;
  category: SecretCategory;
  bits?: number;
  bytes?: number;
  format?: SecretFormat;
  estimatedEntropyBits?: number;
  metadata?: Record<string, string | number | boolean>;
  warnings?: string[];
};

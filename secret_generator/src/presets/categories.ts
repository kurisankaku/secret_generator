import type { SecretCategoryDefinition } from './types';

export const secretCategories = [
  {
    id: 'password',
    label: 'Password',
    description: 'Meaningless random passwords for sign-in, database, and manager storage.',
    icon: 'KeyRound',
    order: 10,
  },
  {
    id: 'numeric-code',
    label: 'Numeric Code',
    description: 'PIN and short numeric codes for temporary use.',
    icon: 'Hash',
    order: 20,
  },
  {
    id: 'token',
    label: 'Token',
    description: 'API keys, webhook secrets, session secrets, and CSRF secrets.',
    icon: 'Ticket',
    order: 30,
  },
  {
    id: 'jwt-secret',
    label: 'JWT Secret',
    description: 'Shared HMAC secrets for HS256, HS384, and HS512 JWT signing.',
    icon: 'BadgeCheck',
    order: 40,
  },
  {
    id: 'encryption-key',
    label: 'Encryption Key',
    description: 'Raw shared keys for AES-GCM and HMAC use cases.',
    icon: 'LockKeyhole',
    order: 50,
  },
  {
    id: 'random',
    label: 'Random',
    description: 'Hex, Base64, Base64url, random bytes, and UUID v4.',
    icon: 'Dices',
    order: 60,
  },
  {
    id: 'env',
    label: '.env',
    description: 'KEY=value application secrets for environment files.',
    icon: 'FileKey',
    order: 70,
  },
] satisfies SecretCategoryDefinition[];

export function getCategoryLabel(categoryId: SecretCategoryDefinition['id']): string {
  return secretCategories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

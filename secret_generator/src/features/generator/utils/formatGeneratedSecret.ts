import { generatePassword } from '../../../core/password';
import type { GeneratePasswordOptions } from '../../../core/password';
import { generatePin } from '../../../core/pin';
import type { GeneratePinOptions } from '../../../core/pin';
import { generateToken } from '../../../core/token';
import type { GeneratedSecret, SecretFormat } from '../../../core/types';
import { generateUuidV4 } from '../../../core/uuid';
import type { SecretPreset, SecretPresetOptions, TokenPresetOptions } from '../../../presets/types';
import type { TFunction } from '../../../i18n/types';

export type CopyMode = 'secret' | 'value';

const ENV_KEY_PATTERN = /^[A-Z_][A-Z0-9_]*$/u;
const PREFIX_PATTERN = /^[A-Za-z0-9_.-]*$/u;

export function clonePresetOptions(preset: SecretPreset): SecretPresetOptions {
  return { ...preset.defaultOptions };
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toPasswordOptions(
  preset: SecretPreset,
  options: SecretPresetOptions,
): GeneratePasswordOptions {
  const defaults = preset.defaultOptions as GeneratePasswordOptions;
  const values = options as Partial<GeneratePasswordOptions>;

  return {
    length: asNumber(values.length, defaults.length),
    uppercase: asBoolean(values.uppercase, defaults.uppercase),
    lowercase: asBoolean(values.lowercase, defaults.lowercase),
    digits: asBoolean(values.digits, defaults.digits),
    symbols: asBoolean(values.symbols, defaults.symbols),
    symbolMode: values.symbolMode ?? defaults.symbolMode,
    customSymbols: values.customSymbols,
    excludeAmbiguous: asBoolean(values.excludeAmbiguous, defaults.excludeAmbiguous),
    requireEachSelectedType: asBoolean(
      values.requireEachSelectedType,
      defaults.requireEachSelectedType,
    ),
    label: preset.label,
    category: preset.category,
    warnings: preset.warnings,
  };
}

function toPinOptions(preset: SecretPreset, options: SecretPresetOptions): GeneratePinOptions {
  const defaults = preset.defaultOptions as GeneratePinOptions;
  const values = options as Partial<GeneratePinOptions>;

  return {
    length: (values.length ?? defaults.length) as GeneratePinOptions['length'],
    allowLeadingZero: asBoolean(values.allowLeadingZero, defaults.allowLeadingZero),
    avoidRepeating: asBoolean(values.avoidRepeating, defaults.avoidRepeating ?? false),
    avoidSequential: asBoolean(values.avoidSequential, defaults.avoidSequential ?? false),
    label: preset.label,
    warnings: preset.warnings,
  };
}

function toTokenOptions(preset: SecretPreset, options: SecretPresetOptions): TokenPresetOptions {
  const defaults = preset.defaultOptions as TokenPresetOptions;
  const values = options as Partial<TokenPresetOptions>;
  const prefix = asString(values.prefix, defaults.prefix ?? '');

  if (prefix.length > 0 && !PREFIX_PATTERN.test(prefix)) {
    throw new Error('prefix may only contain letters, numbers, underscore, dot, or hyphen');
  }

  return {
    bits: asNumber(values.bits, defaults.bits),
    format: (values.format ?? defaults.format) as SecretFormat,
    prefix,
    envKey: asString(values.envKey, defaults.envKey ?? ''),
  };
}

function formatEnvSecret(
  generated: GeneratedSecret,
  envKey: string,
  presetWarnings: string[] | undefined,
): GeneratedSecret {
  const normalizedKey = envKey.trim().toUpperCase();

  if (!ENV_KEY_PATTERN.test(normalizedKey)) {
    throw new Error('environment variable name must match KEY_NAME format');
  }

  return {
    ...generated,
    value: `${normalizedKey}=${generated.value}`,
    label: '.env secret',
    category: 'env',
    metadata: {
      ...generated.metadata,
      envKey: normalizedKey,
    },
    warnings: presetWarnings,
  };
}

export function generateFromPreset(
  preset: SecretPreset,
  options: SecretPresetOptions,
): GeneratedSecret {
  switch (preset.generator) {
    case 'password':
      return generatePassword(toPasswordOptions(preset, options));
    case 'pin':
      return generatePin(toPinOptions(preset, options));
    case 'token': {
      const tokenOptions = toTokenOptions(preset, options);
      const generated = generateToken({
        bits: tokenOptions.bits,
        format: tokenOptions.format,
        prefix: tokenOptions.prefix,
        label: preset.label,
        category: preset.category,
        warnings: preset.warnings,
      });

      return preset.category === 'env'
        ? formatEnvSecret(generated, tokenOptions.envKey ?? 'APP_SECRET', preset.warnings)
        : generated;
    }
    case 'uuid': {
      const generated = generateUuidV4();
      return {
        ...generated,
        label: preset.label,
        warnings: preset.warnings ?? generated.warnings,
      };
    }
    default:
      throw new Error('generator is not supported');
  }
}

export function getDisplayFormat(format: SecretFormat | undefined, t?: TFunction): string {
  switch (format) {
    case 'base64url-no-padding':
      return t ? t('formats.base64url-no-padding') : 'Base64url no padding';
    case 'base64url':
      return t ? t('formats.base64url') : 'Base64url';
    case 'base64':
      return t ? t('formats.base64') : 'Base64';
    case 'hex':
      return t ? t('formats.hex') : 'Hex';
    default:
      return t ? t('formats.text') : 'Text';
  }
}

export function formatEntropy(bits?: number): string {
  if (typeof bits !== 'number' || !Number.isFinite(bits)) {
    return 'Unknown entropy';
  }

  return `${Math.round(bits)} bits`;
}

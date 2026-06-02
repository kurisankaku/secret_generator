import type { GeneratePasswordOptions } from '../core/password';
import type { GeneratePinOptions } from '../core/pin';
import type { SecretCategory, SecretFormat } from '../core/types';

export type GeneratorKind = 'password' | 'pin' | 'token' | 'uuid';

export type SecretCategoryDefinition = {
  id: SecretCategory;
  label: string;
  description: string;
  icon: string;
  order: number;
};

export type TokenPresetOptions = {
  bits: number;
  format: SecretFormat;
  prefix?: string;
  envKey?: string;
};

export type SecretPresetOptions =
  | GeneratePasswordOptions
  | GeneratePinOptions
  | TokenPresetOptions
  | Record<string, never>;

export type SecretPreset = {
  id: string;
  category: SecretCategory;
  generator: GeneratorKind;
  label: string;
  description: string;
  aliases: string[];
  defaultOptions: SecretPresetOptions;
  allowedBits?: number[];
  allowedLengths?: number[];
  allowedFormats?: SecretFormat[];
  warnings?: string[];
  helpText?: string;
  order: number;
};

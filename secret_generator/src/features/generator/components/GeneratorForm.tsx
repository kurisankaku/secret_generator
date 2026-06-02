import type { ReactNode } from 'react';
import { RefreshCw, RotateCcw, WandSparkles } from 'lucide-react';
import type { GeneratePasswordOptions, SymbolMode } from '../../../core/password';
import type { GeneratePinOptions } from '../../../core/pin';
import type { SecretFormat } from '../../../core/types';
import { localizeErrorMessage } from '../../../i18n/errors';
import { useI18n } from '../../../i18n/I18nProvider';
import { getPresetText } from '../../../i18n/presetTranslations';
import { envKeySuggestions } from '../../../presets/presets';
import type { SecretPreset, SecretPresetOptions, TokenPresetOptions } from '../../../presets/types';
import { AdvancedSettings } from './AdvancedSettings';
import { WarningCallout } from './WarningCallout';

type GeneratorFormProps = {
  preset: SecretPreset;
  options: SecretPresetOptions;
  errorMessage: string | null;
  onOptionChange: (name: string, value: string | number | boolean) => void;
  onGenerate: () => void;
  onResetOptions: () => void;
};

type FieldProps = {
  label: string;
  description?: string;
  children: ReactNode;
};

function Field({ label, description, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold">{label}</span>
      {children}
      {description ? <span className="block text-xs text-muted-foreground">{description}</span> : null}
    </label>
  );
}

function CheckboxField({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <input
        checked={checked}
        className="mt-1 h-4 w-4 accent-primary"
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description ? <span className="block text-xs text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  );
}

function FormSelect({
  label,
  name,
  options,
  value,
  onOptionChange,
  description,
  getOptionLabel,
}: {
  label: string;
  name: string;
  options: readonly (string | number)[];
  value: string | number;
  onOptionChange: (name: string, value: string | number) => void;
  description?: string;
  getOptionLabel?: (option: string | number) => string;
}) {
  return (
    <Field label={label} description={description}>
      <select
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        value={value}
        onChange={(event) => {
          const nextValue = typeof value === 'number' ? Number(event.target.value) : event.target.value;
          onOptionChange(name, nextValue);
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {getOptionLabel ? getOptionLabel(option) : option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function PasswordOptions({
  options,
  preset,
  onOptionChange,
}: Pick<GeneratorFormProps, 'options' | 'preset' | 'onOptionChange'>) {
  const { t } = useI18n();
  const values = options as GeneratePasswordOptions;
  const allowedLengths = preset.allowedLengths ?? [8, 12, 16, 24, 32, 64, 128, 256];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[1fr_9rem]">
        <Field
          label={t('generator.length')}
          description={t('generator.lengthDescription')}
        >
          <input
            className="w-full accent-primary"
            max={256}
            min={8}
            type="range"
            value={values.length}
            onChange={(event) => onOptionChange('length', Number(event.target.value))}
          />
        </Field>
        <Field label={t('generator.characters')}>
          <input
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            inputMode="numeric"
            max={256}
            min={8}
            type="number"
            value={values.length}
            onChange={(event) => onOptionChange('length', Number(event.target.value))}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField
          checked={values.uppercase}
          label={t('generator.uppercase')}
          onChange={(checked) => onOptionChange('uppercase', checked)}
        />
        <CheckboxField
          checked={values.lowercase}
          label={t('generator.lowercase')}
          onChange={(checked) => onOptionChange('lowercase', checked)}
        />
        <CheckboxField
          checked={values.digits}
          label={t('generator.numbers')}
          onChange={(checked) => onOptionChange('digits', checked)}
        />
        <CheckboxField
          checked={values.symbols}
          label={t('generator.symbols')}
          onChange={(checked) => onOptionChange('symbols', checked)}
        />
      </div>

      <FormSelect
        description={t('generator.safeSymbolsDescription')}
        label={t('generator.symbolMode')}
        name="symbolMode"
        options={['none', 'safe-symbols', 'all-symbols', 'custom-symbols']}
        value={values.symbolMode}
        getOptionLabel={(option) => t(`symbolModes.${option}`)}
        onOptionChange={(name, value) => onOptionChange(name, value as SymbolMode)}
      />

      {values.symbolMode === 'custom-symbols' && values.symbols ? (
        <Field
          label={t('generator.customSymbols')}
          description={t('generator.customSymbolsDescription')}
        >
          <input
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            spellCheck={false}
            value={values.customSymbols ?? ''}
            onChange={(event) => onOptionChange('customSymbols', event.target.value)}
          />
        </Field>
      ) : null}

      <AdvancedSettings>
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField
            checked={values.requireEachSelectedType}
            description={t('generator.requireEachTypeDescription')}
            label={t('generator.requireEachType')}
            onChange={(checked) => onOptionChange('requireEachSelectedType', checked)}
          />
          <CheckboxField
            checked={values.excludeAmbiguous}
            description={t('generator.excludeAmbiguousDescription')}
            label={t('generator.excludeAmbiguous')}
            onChange={(checked) => onOptionChange('excludeAmbiguous', checked)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {allowedLengths.map((length) => (
            <button
              key={length}
              className="rounded-lg border border-border px-2 py-1 hover:bg-muted"
              type="button"
              onClick={() => onOptionChange('length', length)}
            >
              {length}
            </button>
          ))}
        </div>
      </AdvancedSettings>
    </div>
  );
}

function TokenOptions({
  options,
  preset,
  onOptionChange,
}: Pick<GeneratorFormProps, 'options' | 'preset' | 'onOptionChange'>) {
  const { t } = useI18n();
  const values = options as TokenPresetOptions;
  const bitsOptions = preset.allowedBits ?? [128, 192, 256, 384, 512];
  const formatOptions = preset.allowedFormats ?? ['base64url-no-padding', 'base64', 'hex'];
  const showPrefix = preset.category === 'token' || Boolean(values.prefix);
  const showEnvKey = preset.category === 'env';

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          description={preset.id === 'random-bytes' ? t('generator.randomBytesDescription') : undefined}
          label={preset.id === 'random-bytes' ? t('generator.bytes') : t('generator.bitStrength')}
          name="bits"
          options={preset.id === 'random-bytes' ? bitsOptions.map((bits) => bits / 8) : bitsOptions}
          value={preset.id === 'random-bytes' ? values.bits / 8 : values.bits}
          onOptionChange={(name, value) => onOptionChange(name, preset.id === 'random-bytes' ? Number(value) * 8 : value)}
        />
        <FormSelect
          label={t('generator.outputFormat')}
          name="format"
          options={formatOptions}
          value={values.format}
          getOptionLabel={(option) => t(`formats.${option}`)}
          onOptionChange={(name, value) => onOptionChange(name, value as SecretFormat)}
        />
      </div>

      {showPrefix ? (
        <Field label={t('generator.prefix')} description={t('generator.prefixDescription')}>
          <input
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            spellCheck={false}
            value={values.prefix ?? ''}
            onChange={(event) => onOptionChange('prefix', event.target.value)}
          />
        </Field>
      ) : null}

      {showEnvKey ? (
        <Field label={t('generator.variableName')} description={t('generator.variableNameDescription')}>
          <input
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            list="env-key-suggestions"
            spellCheck={false}
            value={values.envKey ?? ''}
            onChange={(event) => onOptionChange('envKey', event.target.value)}
          />
          <datalist id="env-key-suggestions">
            {envKeySuggestions.map((key) => (
              <option key={key} value={key} />
            ))}
          </datalist>
        </Field>
      ) : null}
    </div>
  );
}

function PinOptions({
  options,
  preset,
  onOptionChange,
}: Pick<GeneratorFormProps, 'options' | 'preset' | 'onOptionChange'>) {
  const { t } = useI18n();
  const values = options as GeneratePinOptions;

  return (
    <div className="space-y-5">
      <FormSelect
        label={t('generator.digits')}
        name="length"
        options={preset.allowedLengths ?? [4, 6, 8, 12]}
        value={values.length}
        onOptionChange={(name, value) => onOptionChange(name, value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField
          checked={values.allowLeadingZero}
          label={t('generator.allowLeadingZero')}
          onChange={(checked) => onOptionChange('allowLeadingZero', checked)}
        />
        <CheckboxField
          checked={Boolean(values.avoidRepeating)}
          label={t('generator.avoidAllSameDigits')}
          onChange={(checked) => onOptionChange('avoidRepeating', checked)}
        />
        <CheckboxField
          checked={Boolean(values.avoidSequential)}
          label={t('generator.avoidSimpleSequences')}
          onChange={(checked) => onOptionChange('avoidSequential', checked)}
        />
      </div>
    </div>
  );
}

function PresetSpecificOptions(props: Pick<GeneratorFormProps, 'preset' | 'options' | 'onOptionChange'>) {
  const { t } = useI18n();

  if (props.preset.generator === 'password') {
    return <PasswordOptions {...props} />;
  }

  if (props.preset.generator === 'pin') {
    return <PinOptions {...props} />;
  }

  if (props.preset.generator === 'token') {
    return <TokenOptions {...props} />;
  }

  return (
    <WarningCallout
      tone="info"
      messages={[t('generator.uuidNoSettings')]}
    />
  );
}

export function GeneratorForm({
  errorMessage,
  onGenerate,
  onOptionChange,
  onResetOptions,
  options,
  preset,
}: GeneratorFormProps) {
  const { locale, t } = useI18n();
  const presetText = getPresetText(preset, locale);
  const localizedErrorMessage = localizeErrorMessage(errorMessage, t);

  return (
    <section className="rounded-lg border border-border bg-card shadow-soft" aria-labelledby="generator-form-title">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">{t('generator.selectedPreset')}</p>
            <h1 id="generator-form-title" className="mt-1 text-2xl font-semibold tracking-normal">
              {presetText.label}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{presetText.description}</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            type="button"
            onClick={onResetOptions}
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            {t('generator.reset')}
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <PresetSpecificOptions preset={preset} options={options} onOptionChange={onOptionChange} />

        {presetText.warnings ? <WarningCallout messages={presetText.warnings} /> : null}

        {localizedErrorMessage ? <WarningCallout messages={[localizedErrorMessage]} /> : null}

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            type="button"
            data-testid="generate-button"
            onClick={onGenerate}
          >
            <WandSparkles aria-hidden="true" className="h-4 w-4" />
            {t('generator.generate')}
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            type="button"
            data-testid="regenerate-button"
            onClick={onGenerate}
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            {t('generator.regenerate')}
          </button>
        </div>
      </div>
    </section>
  );
}

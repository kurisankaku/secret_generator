import { useMemo, useState } from 'react';
import { SafetyNotice } from '../../../components/common/SafetyNotice';
import { useI18n } from '../../../i18n/I18nProvider';
import { getSearchText } from '../../../i18n/presetTranslations';
import type { Locale } from '../../../i18n/types';
import { secretPresets } from '../../../presets/presets';
import type { SecretPreset } from '../../../presets/types';
import { useGenerator } from '../hooks/useGenerator';
import { GeneratorForm } from './GeneratorForm';
import { PresetSearch } from './PresetSearch';
import { PresetSidebar } from './PresetSidebar';
import { SecretResultCard } from './SecretResultCard';

type GeneratorPageProps = {
  initialPresetId?: string;
  onPresetChange: (presetId: string) => void;
};

function matchesQuery(preset: SecretPreset, query: string, locale: Locale): boolean {
  if (query.trim().length === 0) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const haystack = getSearchText(preset, locale);

  return haystack.includes(normalizedQuery);
}

export function GeneratorPage({ initialPresetId, onPresetChange }: GeneratorPageProps) {
  const { locale } = useI18n();
  const [query, setQuery] = useState('');
  const generator = useGenerator(initialPresetId);
  const filteredPresets = useMemo(
    () => secretPresets.filter((preset) => matchesQuery(preset, query, locale)),
    [locale, query],
  );

  function handlePresetSelect(presetId: string) {
    generator.selectPreset(presetId);
    onPresetChange(presetId);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <PresetSearch value={query} onChange={setQuery} />
          <PresetSidebar
            presets={filteredPresets}
            selectedPresetId={generator.selectedPreset.id}
            onSelectPreset={handlePresetSelect}
          />
        </div>

        <div className="space-y-6">
          <GeneratorForm
            errorMessage={generator.errorMessage}
            options={generator.options}
            preset={generator.selectedPreset}
            onGenerate={generator.generate}
            onOptionChange={generator.setOption}
            onResetOptions={generator.resetOptions}
          />
          <SecretResultCard
            generatedSecret={generator.generatedSecret}
            isSecretHidden={generator.isSecretHidden}
            onClear={generator.clear}
            onRegenerate={generator.generate}
            onSecretHiddenChange={generator.setSecretHidden}
          />
        </div>
      </div>

      <SafetyNotice />
    </div>
  );
}

import {
  BadgeCheck,
  Dices,
  FileKey,
  Hash,
  KeyRound,
  LockKeyhole,
  Ticket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '../../../i18n/I18nProvider';
import { getCategoryText, getPresetText } from '../../../i18n/presetTranslations';
import { secretCategories } from '../../../presets/categories';
import type { SecretPreset } from '../../../presets/types';

type PresetSidebarProps = {
  presets: SecretPreset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
};

const iconMap: Record<string, LucideIcon> = {
  KeyRound,
  Hash,
  Ticket,
  BadgeCheck,
  LockKeyhole,
  Dices,
  FileKey,
};

export function PresetSidebar({ presets, selectedPresetId, onSelectPreset }: PresetSidebarProps) {
  const { locale, t } = useI18n();

  return (
    <aside className="space-y-4" aria-label={t('generator.searchPresets')}>
      {secretCategories.map((category) => {
        const categoryPresets = presets.filter((preset) => preset.category === category.id);
        if (categoryPresets.length === 0) {
          return null;
        }

        const Icon = iconMap[category.icon] ?? KeyRound;
        const categoryText = getCategoryText(category, locale);

        return (
          <section key={category.id} className="space-y-2">
            <div className="flex items-center gap-2 px-1 text-xs font-semibold uppercase text-muted-foreground">
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {categoryText.label}
            </div>
            <div className="space-y-1">
              {categoryPresets.map((preset) => {
                const active = preset.id === selectedPresetId;
                const presetText = getPresetText(preset, locale);

                return (
                  <button
                    key={preset.id}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      active
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground'
                    }`}
                    type="button"
                      onClick={() => onSelectPreset(preset.id)}
                  >
                    <span className="block text-sm font-semibold">{presetText.label}</span>
                    <span className="mt-0.5 block text-xs leading-5">{presetText.description}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </aside>
  );
}

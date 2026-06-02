import { Search } from 'lucide-react';
import { useI18n } from '../../../i18n/I18nProvider';

type PresetSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PresetSearch({ value, onChange }: PresetSearchProps) {
  const { t } = useI18n();

  return (
    <label className="block">
      <span className="sr-only">{t('generator.searchPresets')}</span>
      <span className="relative block">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
          placeholder={t('generator.searchPresets')}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

import type { PropsWithChildren } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../../../i18n/I18nProvider';

type AdvancedSettingsProps = PropsWithChildren<{
  title?: string;
}>;

export function AdvancedSettings({ children, title = 'Advanced settings' }: AdvancedSettingsProps) {
  const { t } = useI18n();

  return (
    <details className="rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold">
        <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-primary" />
        {title === 'Advanced settings' ? t('generator.advancedSettings') : title}
      </summary>
      <div className="border-t border-border px-4 py-4">{children}</div>
    </details>
  );
}

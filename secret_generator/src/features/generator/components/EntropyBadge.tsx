import { Gauge } from 'lucide-react';
import { useI18n } from '../../../i18n/I18nProvider';

type EntropyBadgeProps = {
  bits?: number;
};

export function EntropyBadge({ bits }: EntropyBadgeProps) {
  const { t } = useI18n();
  const roundedBits = typeof bits === 'number' && Number.isFinite(bits) ? Math.round(bits) : undefined;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
      <Gauge aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
      {roundedBits === undefined ? t('generator.unknownEntropy') : t('generator.estimatedEntropy', { bits: roundedBits })}
    </span>
  );
}

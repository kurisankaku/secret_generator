import { Eye, EyeOff, RefreshCw, Trash2 } from 'lucide-react';
import type { GeneratedSecret } from '../../../core/types';
import { useI18n } from '../../../i18n/I18nProvider';
import { getDisplayFormat } from '../utils/formatGeneratedSecret';
import { CopyButton } from './CopyButton';
import { EntropyBadge } from './EntropyBadge';
import { WarningCallout } from './WarningCallout';

type SecretResultCardProps = {
  generatedSecret: GeneratedSecret | null;
  isSecretHidden: boolean;
  onClear: () => void;
  onRegenerate: () => void;
  onSecretHiddenChange: (hidden: boolean) => void;
};

function maskValue(value: string): string {
  const maskLength = Math.min(value.length, 96);
  return '*'.repeat(maskLength);
}

export function SecretResultCard({
  generatedSecret,
  isSecretHidden,
  onClear,
  onRegenerate,
  onSecretHiddenChange,
}: SecretResultCardProps) {
  const { t } = useI18n();
  const value = generatedSecret?.value ?? '';
  const displayValue = generatedSecret && isSecretHidden ? maskValue(value) : value;

  return (
    <section className="rounded-lg border border-border bg-card shadow-soft" aria-labelledby="secret-result-title">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-accent">{t('generator.resultEyebrow')}</p>
          <h2 id="secret-result-title" className="mt-1 text-xl font-semibold">
            {t('generator.resultTitle')}
          </h2>
        </div>
        {generatedSecret ? (
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              type="button"
              onClick={() => onSecretHiddenChange(!isSecretHidden)}
            >
              {isSecretHidden ? (
                <Eye aria-hidden="true" className="h-4 w-4" />
              ) : (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              )}
              {isSecretHidden ? t('generator.show') : t('generator.hide')}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              type="button"
              onClick={onRegenerate}
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              {t('generator.regenerate')}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              type="button"
              onClick={onClear}
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              {t('generator.clear')}
            </button>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 px-5 py-5">
        {generatedSecret ? (
          <>
            <div
              className="secret-scrollbar max-h-64 overflow-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-6 text-foreground"
              data-testid="secret-value"
            >
              <span className="break-all">{displayValue}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <EntropyBadge bits={generatedSecret.estimatedEntropyBits} />
              <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-semibold">
                {getDisplayFormat(generatedSecret.format, t)}
              </span>
              {typeof generatedSecret.bytes === 'number' ? (
                <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-semibold">
                  {t('generator.bytesBadge', { count: generatedSecret.bytes })}
                </span>
              ) : null}
            </div>
            <CopyButton value={value} />
            <WarningCallout
              tone="info"
              messages={[t('generator.copyNotice')]}
            />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/60 px-4 py-8 text-center text-sm text-muted-foreground">
            {t('generator.emptyResult')}
          </div>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useI18n } from '../../../i18n/I18nProvider';

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status === 'idle') {
      return undefined;
    }

    const timeout = globalThis.setTimeout(() => setStatus('idle'), 2200);
    return () => globalThis.clearTimeout(timeout);
  }, [status]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        type="button"
        onClick={handleCopy}
      >
        {status === 'copied' ? (
          <Check aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
        {t('generator.copy')}
      </button>
      <span aria-live="polite" className="text-sm text-muted-foreground">
        {status === 'copied' ? t('generator.copied') : status === 'failed' ? t('generator.copyFailed') : ''}
      </span>
    </div>
  );
}

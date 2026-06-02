import { CheckCircle2, EyeOff, ServerOff, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { TrustBadge } from './TrustBadge';

export function SafetyNotice() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="safety-notice-title" className="space-y-4">
      <div>
        <h2 id="safety-notice-title" className="text-lg font-semibold">
          {t('common.safetyModel')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('common.safetyDescription')}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TrustBadge
          icon={ShieldCheck}
          label={t('common.webCrypto')}
          description={t('common.webCryptoDescription')}
        />
        <TrustBadge
          icon={ServerOff}
          label={t('common.noBackend')}
          description={t('common.noBackendDescription')}
        />
        <TrustBadge
          icon={EyeOff}
          label={t('common.noStorage')}
          description={t('common.noStorageDescription')}
        />
        <TrustBadge
          icon={CheckCircle2}
          label={t('common.noAnalytics')}
          description={t('common.noAnalyticsDescription')}
        />
      </div>
    </section>
  );
}

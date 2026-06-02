import { ClipboardCheck, EyeOff, Network, ShieldCheck } from 'lucide-react';
import { SafetyNotice } from '../components/common/SafetyNotice';
import { TrustBadge } from '../components/common/TrustBadge';
import { useI18n } from '../i18n/I18nProvider';

export function AboutSecurityPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase text-primary">{t('securityPage.eyebrow')}</p>
        <h1 className="text-3xl font-semibold tracking-normal">{t('securityPage.title')}</h1>
        <p className="max-w-3xl text-muted-foreground">
          {t('securityPage.description')}
        </p>
      </section>

      <SafetyNotice />

      <section className="grid gap-3 md:grid-cols-2">
        <TrustBadge
          icon={Network}
          label={t('securityPage.noPostLoadRequests')}
          description={t('securityPage.noPostLoadRequestsDescription')}
        />
        <TrustBadge
          icon={EyeOff}
          label={t('securityPage.noGeneratedSecretStorage')}
          description={t('securityPage.noGeneratedSecretStorageDescription')}
        />
        <TrustBadge
          icon={ShieldCheck}
          label={t('securityPage.cryptoSource')}
          description={t('securityPage.cryptoSourceDescription')}
        />
        <TrustBadge
          icon={ClipboardCheck}
          label={t('securityPage.explicitCopyOnly')}
          description={t('securityPage.explicitCopyOnlyDescription')}
        />
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">{t('securityPage.notDoTitle')}</h2>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>{t('securityPage.noServer')}</p>
          <p>{t('securityPage.noAi')}</p>
          <p>{t('securityPage.noTelemetry')}</p>
          <p>{t('securityPage.noErrors')}</p>
          <p>{t('securityPage.noHistory')}</p>
          <p>{t('securityPage.noStorageList')}</p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">{t('securityPage.devtoolsTitle')}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>{t('securityPage.devtools1')}</li>
          <li>{t('securityPage.devtools2')}</li>
          <li>{t('securityPage.devtools3')}</li>
          <li>{t('securityPage.devtools4')}</li>
          <li>{t('securityPage.devtools5')}</li>
        </ol>
      </section>
    </div>
  );
}

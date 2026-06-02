import { ArrowRight, CircleHelp, KeyRound, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

type HelpPageProps = {
  onNavigate: (path: string) => void;
};

export function HelpPage({ onNavigate }: HelpPageProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase text-primary">{t('helpPage.eyebrow')}</p>
        <h1 className="text-3xl font-semibold tracking-normal">{t('helpPage.title')}</h1>
        <p className="max-w-3xl text-muted-foreground">
          {t('helpPage.description')}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-border bg-card p-5">
          <KeyRound aria-hidden="true" className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-base font-semibold">{t('helpPage.passwordsTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('helpPage.passwordsDescription')}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <ShieldAlert aria-hidden="true" className="h-5 w-5 text-warning" />
          <h2 className="mt-3 text-base font-semibold">{t('helpPage.jwtTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('helpPage.jwtDescription')}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <CircleHelp aria-hidden="true" className="h-5 w-5 text-accent" />
          <h2 className="mt-3 text-base font-semibold">{t('helpPage.notMvpTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('helpPage.notMvpDescription')}
          </p>
        </article>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        type="button"
        onClick={() => onNavigate('/generator')}
      >
        {t('helpPage.cta')}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

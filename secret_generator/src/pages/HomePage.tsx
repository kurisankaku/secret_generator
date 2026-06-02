import { ArrowRight, BadgeCheck, Dices, FileKey, Hash, KeyRound, LockKeyhole, Ticket } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { getCategoryText } from '../i18n/presetTranslations';
import { secretCategories } from '../presets/categories';

type HomePageProps = {
  onNavigate: (path: string) => void;
};

const iconMap = {
  KeyRound,
  Hash,
  Ticket,
  BadgeCheck,
  LockKeyhole,
  Dices,
  FileKey,
};

export function HomePage({ onNavigate }: HomePageProps) {
  const { locale, t } = useI18n();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-border bg-card px-5 py-6 shadow-soft">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-primary">{t('home.eyebrow')}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">{t('home.title')}</h1>
          <p className="mt-3 text-muted-foreground">
            {t('home.description')}
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            type="button"
            onClick={() => onNavigate('/generator')}
          >
            {t('home.cta')}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section aria-labelledby="category-title" className="space-y-4">
        <div>
          <h2 id="category-title" className="text-lg font-semibold">
            {t('home.categories')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('home.categoryDescription')}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {secretCategories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] ?? KeyRound;
            const categoryText = getCategoryText(category, locale);

            return (
              <button
                key={category.id}
                className="rounded-lg border border-border bg-card p-4 text-left hover:border-primary hover:bg-primary/5"
                type="button"
                onClick={() => onNavigate('/generator')}
              >
                <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                <span className="mt-3 block text-sm font-semibold">{categoryText.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{categoryText.description}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

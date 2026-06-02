import { useI18n } from '../../i18n/I18nProvider';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>{t('footer.line1')}</p>
        <p>{t('footer.line2')}</p>
      </div>
    </footer>
  );
}

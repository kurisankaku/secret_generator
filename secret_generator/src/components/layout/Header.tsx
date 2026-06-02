import { KeyRound, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n/types';

type HeaderProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

const links = [
  { href: '/generator', labelKey: 'app.generator' },
  { href: '/security', labelKey: 'app.security' },
  { href: '/help', labelKey: 'app.help' },
];

function isActive(currentPath: string, href: string): boolean {
  return href === '/generator' ? currentPath === '/' || currentPath.startsWith('/generator') : currentPath === href;
}

export function Header({ currentPath, onNavigate }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 rounded-lg text-left text-foreground"
          type="button"
          onClick={() => onNavigate('/generator')}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KeyRound aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-5">{t('app.title')}</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t('app.subtitle')}
            </span>
          </span>
        </button>

        <nav aria-label={t('app.generator')} className="flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(currentPath, link.href)
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              type="button"
              onClick={() => onNavigate(link.href)}
            >
              {t(link.labelKey)}
            </button>
          ))}
        </nav>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="sr-only">{t('app.language')}</span>
          <select
            className="rounded-lg border border-border bg-card px-2.5 py-2 text-sm font-medium text-foreground"
            aria-label={t('app.language')}
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
          >
            <option value="ja">{t('app.japanese')}</option>
            <option value="en">{t('app.english')}</option>
          </select>
        </label>

      </div>
      <div className="border-t border-border/70 bg-card/70">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-success" />
          <span>{t('app.safetyStrip')}</span>
        </div>
      </div>
    </header>
  );
}

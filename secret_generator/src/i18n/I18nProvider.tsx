import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { getInitialLocale, messages } from './messages';
import type { Locale, TFunction } from './types';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFunction;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getPathValue(source: unknown, path: string): string | undefined {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source) as string | undefined;
}

function interpolate(value: string, values?: Record<string, string | number>): string {
  if (!values) {
    return value;
  }

  return Object.entries(values).reduce(
    (current, [name, replacement]) => current.split(`{${name}}`).join(String(replacement)),
    value,
  );
}

function createTranslator(locale: Locale): TFunction {
  return (key, values) => {
    const value = getPathValue(messages[locale], key) ?? getPathValue(messages.en, key) ?? key;
    return interpolate(value, values);
  };
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const t = useCallback<TFunction>((key, values) => createTranslator(locale)(key, values), [locale]);
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  useEffect(() => {
    if (globalThis.document?.documentElement) {
      globalThis.document.documentElement.lang = locale;
    }
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
}

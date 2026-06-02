import type { PropsWithChildren } from 'react';
import { I18nProvider } from '../i18n/I18nProvider';

export function Providers({ children }: PropsWithChildren) {
  return <I18nProvider>{children}</I18nProvider>;
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { AboutSecurityPage } from '../pages/AboutSecurityPage';
import { GeneratorRoutePage } from '../pages/GeneratorRoutePage';
import { HelpPage } from '../pages/HelpPage';
import { HomePage } from '../pages/HomePage';
import { Providers } from './providers';
import { resolveRoute } from './routes';

function getCurrentPathname(): string {
  return globalThis.location?.pathname ?? '/';
}

export function App() {
  const [pathname, setPathname] = useState(getCurrentPathname);
  const route = useMemo(() => resolveRoute(pathname), [pathname]);

  useEffect(() => {
    const handlePopState = () => setPathname(getCurrentPathname());
    globalThis.addEventListener('popstate', handlePopState);

    return () => globalThis.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((nextPath: string) => {
    if (nextPath === getCurrentPathname()) {
      return;
    }

    globalThis.history.pushState(null, '', nextPath);
    setPathname(nextPath);
  }, []);

  const page = useMemo(() => {
    switch (route.page) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'security':
        return <AboutSecurityPage />;
      case 'help':
        return <HelpPage onNavigate={navigate} />;
      case 'generator':
      default:
        return (
          <GeneratorRoutePage
            initialPresetId={route.presetId}
            onPresetPathChange={(presetId) => navigate(`/generator/${presetId}`)}
          />
        );
    }
  }, [navigate, route]);

  return (
    <Providers>
      <AppShell currentPath={pathname} onNavigate={navigate}>
        {page}
      </AppShell>
    </Providers>
  );
}

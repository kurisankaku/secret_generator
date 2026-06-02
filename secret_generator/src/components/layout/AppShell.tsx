import type { PropsWithChildren } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

type AppShellProps = PropsWithChildren<{
  currentPath: string;
  onNavigate: (path: string) => void;
}>;

export function AppShell({ children, currentPath, onNavigate }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

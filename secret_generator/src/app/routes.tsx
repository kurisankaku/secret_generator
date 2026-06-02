export type AppRoute =
  | { page: 'generator'; presetId?: string }
  | { page: 'home' }
  | { page: 'security' }
  | { page: 'help' };

export function resolveRoute(pathname: string): AppRoute {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'generator') {
    return { page: 'generator', presetId: segments[1] };
  }

  if (segments[0] === 'home') {
    return { page: 'home' };
  }

  if (segments[0] === 'security') {
    return { page: 'security' };
  }

  if (segments[0] === 'help') {
    return { page: 'help' };
  }

  return { page: 'generator' };
}

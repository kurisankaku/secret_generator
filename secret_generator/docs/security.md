# Security Notes

## Browser-only generation

The app generates secrets locally using Web Crypto. The core generator uses `crypto.getRandomValues()` for bytes and integer selection. Character selection uses rejection sampling to avoid modulo bias.

## No storage

The app does not persist generated values. It does not use localStorage, sessionStorage, IndexedDB, cookies, Cache Storage, or generated secret history.

## No post-load network requests

The static app has to load HTML, JavaScript, CSS, and static files. Once loaded, generating a secret does not require network access. Cloudflare Pages can apply the `public/_headers` policy with `connect-src 'none'`.

## Manual verification

1. Open the app.
2. Open DevTools.
3. Switch to Network and enable Preserve log.
4. Generate a secret.
5. Confirm no new request is sent.
6. Check Application storage areas.
7. Confirm the generated value is not stored.

## Dependency policy

The MVP avoids password generator packages, random packages, crypto wrapper packages, analytics SDKs, and error reporting SDKs. Primary dependencies are React, Vite, TypeScript, Tailwind CSS, lucide-react, Vitest, Testing Library, and Playwright.

# Secret Generator

A static browser-only SPA for generating secrets locally in the browser.

## MVP scope

Implemented presets:

- Random, sign-in, and database passwords
- PIN / numeric code
- API token, webhook secret, session secret, CSRF secret
- JWT HS256, HS384, and HS512 shared secrets
- AES-GCM and HMAC keys
- Hex, Base64, Base64url, random bytes, UUID v4
- `.env` `KEY=value` secret

Not in the MVP:

- Passphrase, Diceware, or word-based secrets
- JWK / JWKS
- RSA, ECDSA, Ed25519, SSH keys, CSR, or certificates
- Accounts, generated secret history, generated secret storage
- Analytics, telemetry, remote config, external error reporting, or PWA

## Security model

- Static SPA only
- No backend and no server-side generation
- No AI generation
- No analytics or error reporting SDK
- No generated secret storage
- Generated values are kept only in React state / memory and visible DOM until copied or cleared
- Random generation uses Web Crypto API, specifically `crypto.getRandomValues()`
- `Math.random()` is not used for secret generation
- Character selection uses rejection sampling to avoid modulo bias
- The Cloudflare Pages `_headers` file sets `connect-src 'none'`
- UI language can be switched between English and Japanese; the selected language is kept in React state only and is not persisted.

Initial HTML, JS, CSS, and static assets are fetched when the app loads. After that, generating a secret does not require a network request.

## Verify locally

```sh
pnpm install
pnpm run test
pnpm run build
pnpm run test:e2e
```

To inspect the app manually:

```sh
pnpm run dev
```

Open DevTools, keep the Network tab open with Preserve log enabled, generate a secret, and confirm no post-load network request is sent. Check browser storage areas and confirm the generated value is not stored.

## Build a distribution ZIP

The ZIP handed to a static hosting provider should contain only the generated files from `dist/`. The source files, `node_modules`, tests, docs, screenshots, `package.json`, and `pnpm-lock.yaml` are not required at runtime.

```sh
pnpm install --frozen-lockfile
pnpm run build

cd dist
zip -r -X ../secret-generator-dist.zip . -x "*.DS_Store" "__MACOSX/*"
```

The ZIP should contain files like:

```text
index.html
_headers
assets/index-*.css
assets/index-*.js
```

`_headers` is used by compatible hosts such as Cloudflare Pages for security headers. On unsupported static servers it is just a regular file, so handle it according to the host's deployment rules.

This app is an SPA. To support direct visits or refreshes on URLs such as `/generator/random-password`, configure the hosting provider to fall back to `index.html` for unknown paths.

## Development

```sh
pnpm run dev
pnpm run typecheck
pnpm run test
pnpm run lint:security
pnpm run build
```

## Architecture

The implementation follows the issue-defined split:

- `src/core`: Web Crypto random generation, encoding, password, token, PIN, UUID, and entropy logic
- `src/presets`: MVP preset metadata and default settings
- `src/features/generator`: React state, preset selection, settings UI, result display, and copy behavior
- `src/pages`: generator, security, help, and home pages
- `public/_headers`: static security headers for Cloudflare Pages

Core generation code has no React, DOM, storage, fetch, or analytics dependencies.

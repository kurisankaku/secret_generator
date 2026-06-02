# Architecture

## Directories

```text
src/
  app/
  core/
  presets/
  features/generator/
  components/
  pages/
  styles/
  test/
```

## Core

`src/core` owns generation logic:

- `random.ts`: random bytes, unbiased integers, shuffle
- `encoding.ts`: Hex, Base64, Base64url
- `password.ts`: random password generation and character sets
- `pin.ts`: numeric codes
- `token.ts`: random byte tokens
- `uuid.ts`: UUID v4
- `entropy.ts`: entropy estimates

Core code does not depend on React, DOM APIs, storage APIs, fetch, analytics, or console logging.

## Presets

`src/presets` defines MVP secret types, defaults, warnings, aliases, allowed bit strengths, formats, and lengths.

Passphrase and Diceware presets are intentionally excluded from the MVP.

## Generator UI

`src/features/generator` keeps generated values in React state only. Changing presets or settings clears the current generated value. The URL may contain the selected preset ID, but never the generated value.

## Deployment headers

`public/_headers` is designed for Cloudflare Pages and includes a CSP target with `connect-src 'none'`.

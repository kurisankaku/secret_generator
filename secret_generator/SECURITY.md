# Security Policy

## Scope

This project is a static browser-only secret generator. The MVP does not include accounts, server-side generation, generated secret history, analytics, remote config, external error reporting, PWA caching, or secret storage.

## Generated secret handling

Generated values must not be written to:

- URL query or hash
- Browser history
- localStorage
- sessionStorage
- IndexedDB
- Cookies
- Cache Storage
- Console output
- Analytics or telemetry
- Error reporting payloads

Generated values may exist only in React state / browser memory, visible DOM, and the clipboard after the user explicitly presses Copy.

## Reporting vulnerabilities

Open a GitHub issue for non-sensitive reports. For sensitive reports, use GitHub's private vulnerability reporting feature when available for this repository.

Please include:

- Affected version or commit
- Reproduction steps
- Expected impact
- Any relevant browser details

Do not include real production secrets in reports.

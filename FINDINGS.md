# Audit Findings: alejandro-chataing-dev
_Last updated: 2026-11-07 03:39_

## Open Findings

### P1

- **[#4]** Prompt drain vulnerability in AI chat route
  - chat.route.ts relies on client-provided visitorHash for rate limits; malicious scripts can rotate hashes and spoof requests to drain Gemini API quota without hitting IP-level limits. Lack of origin/referer validation allows external web scrapers.
  - _Found: 2026-11-07 03:39_

## Resolved Findings

- ~~**[#1]** Hardcoded fallback secret and plain query string authentication in admin.route.ts~~ (commit: `df342a9`)
  - _Resolved: 2026-11-07 03:05_

- ~~**[#2]** Chat session fragmentation: sessionId dropped in useAIChat.ts~~ (commit: `43df04e`)
  - _Resolved: 2026-11-07 03:05_

- ~~**[#3]** Unhandled JSON.parse SyntaxError on tags in db.service.ts~~ (commit: `43df04e`)
  - _Resolved: 2026-11-07 03:05_

# Audit Findings: alejandro-chataing-dev
_Last updated: 2026-11-07 02:45_

## Open Findings

### P0

- **[#1]** Hardcoded fallback secret and plain query string authentication in admin.route.ts
  - Sink: src/server/routes/admin.route.ts:11. Falling back to REDACTED_ADMIN_SECRET allows any unauthenticated visitor to dump all leads and personal data via GET /api/admin/leads?secret=REDACTED_ADMIN_SECRET. Proved by curl.
  - _Found: 2026-11-07 02:45_

### P1

- **[#2]** Chat session fragmentation: sessionId dropped in useAIChat.ts
  - Sink: src/client/hooks/useAIChat.ts:42-49 & chat.dto.ts:54. useAIChat omits sessionId from payload, causing backend to generate a new crypto.randomUUID() on each message and fragmenting session history in D1 chat_sessions.
  - _Found: 2026-11-07 02:45_

- **[#3]** Unhandled JSON.parse SyntaxError on tags in db.service.ts
  - Sink: src/server/services/db.service.ts:127,150. If tags column contains comma-separated strings or malformed JSON, JSON.parse throws unhandled SyntaxError taking down GET /api/blog with HTTP 500.
  - _Found: 2026-11-07 02:45_

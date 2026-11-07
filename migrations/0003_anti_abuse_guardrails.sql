-- Migration 0003: Anti-Abuse Guardrails & IP Rate Limiting

-- 1. Add ip_hash to chat_sessions for cross-session IP-level rate limiting
ALTER TABLE chat_sessions ADD COLUMN ip_hash TEXT;

-- 2. Performance indexes for sub-millisecond rate-limit checks
CREATE INDEX IF NOT EXISTS idx_chat_sessions_ip_hash ON chat_sessions(ip_hash, updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor_hash ON chat_sessions(visitor_hash, updated_at);

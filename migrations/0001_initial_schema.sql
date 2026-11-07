-- D1 Initial Schema for alejandro-chataing-dev

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  service_interest TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  ip_country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  country TEXT,
  city TEXT,
  device TEXT,
  message_count INTEGER DEFAULT 0,
  lead_captured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);

CREATE TABLE IF NOT EXISTS telemetry_events (
  id TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  event_type TEXT NOT NULL,
  target_id TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  tags TEXT NOT NULL,
  published INTEGER DEFAULT 1,
  view_count INTEGER DEFAULT 0,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_downloads (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  download_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Blog Posts
INSERT OR IGNORE INTO blog_posts (slug, title, summary, content_markdown, tags, published)
VALUES (
  'tree-sitter-wasm-ast-surgical-editing',
  'How Tree-sitter WASM AST Surgical Editing Cuts LLM Context Windows by 85%',
  'A deep dive into building mcp-code-context (v7.0.0 Enterprise) and why line-based LLM editing fails under scale compared to AST-guided surgery.',
  '# How Tree-sitter WASM AST Surgical Editing Cuts LLM Context Windows by 85%

Most AI coding agents treat code as arbitrary text lines. When modifying a 500-line class, conventional agents dump the whole file, burning thousands of prompt tokens and introducing hallucinated line drifts.

In building **`mcp-code-context`** (v7.0.0 Enterprise Polyglot), we introduced a **Two-Phase Surgical Protocol**:
1. **Semantic Cartography**: Tree-sitter WASM parses the Concrete Syntax Tree (CST) and extracts only declarations, method signatures, and export contracts.
2. **Blast Radius Analysis**: Before altering a symbol, we traverse the call hierarchy and wire contracts across 10+ languages.
3. **Atomic 2-Phase Mutation**: The agent generates a targeted replacement for the exact CST node, verifies import integrity, and commits with cryptographic token validation.

The outcome: an **85% reduction in context window bloat**, zero missing braces, and immune-grade type safety.',
  '["AI", "Tree-sitter", "AST", "MCP", "TypeScript"]',
  1
);

INSERT OR IGNORE INTO blog_posts (slug, title, summary, content_markdown, tags, published)
VALUES (
  'zero-framework-php-83-cloudflare-edge-ai',
  'Architecting Zero-Framework Pure PHP 8.3 Systems with Cloudflare Edge AI',
  'Lessons learned scaling enterprise e-commerce plugins under the DT24 Core Standard v4.0 and integrating serverless Edge AI workflows.',
  '# Architecting Zero-Framework Pure PHP 8.3 Systems with Cloudflare Edge AI

Modern web development often drowns in heavyweight frameworks and bloated dependency trees. In our DT24 production marketplace plugins, we eliminated framework overhead by adopting **Pure PHP 8.3 with Zero-Framework Architecture (DT24 Core Standard v4.0)**.

### Architectural Invariants:
- **Value Objects & Commands**: Immutable domain requests validated at the boundary.
- **ServiceLocator & EventDispatcher**: Lean, testable dependency inversion without 50MB vendor folders.
- **SRE Guardrails**: Mandatory `LIMIT` on all queries, CAS atomic concurrency updates, and strict transient memory ceilings.

Coupled with Cloudflare Workers running streaming Edge AI (Gemini Flash-Lite), we process real-time customer intents and inventory settlements in under 15ms globally.',
  '["PHP 8.3", "Cloudflare", "Architecture", "SRE", "WordPress"]',
  1
);

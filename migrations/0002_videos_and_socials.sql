-- Migration 0002: Showcase Videos & Social Links
CREATE TABLE IF NOT EXISTS showcase_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  embed_id TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  featured INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_links (
  platform TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial default social links
INSERT OR IGNORE INTO social_links (platform, url, label, icon) VALUES
('linkedin', 'https://www.linkedin.com/in/alejandro-chataing-81798a106/', 'LinkedIn', 'Linkedin'),
('github', 'https://github.com/achatainga', 'GitHub', 'Github'),
('youtube', 'https://youtube.com/@alejandrochataing', 'YouTube', 'Youtube'),
('whatsapp', 'https://wa.me/584241668876', 'WhatsApp', 'Phone'),
('email', 'mailto:chataing.alejandro@gmail.com', 'Email', 'Mail');

-- Seed initial technical videos showcasing Alejandro's work
INSERT OR IGNORE INTO showcase_videos (id, title, youtube_url, embed_id, description, category, featured, sort_order) VALUES
(
  'vid-mcp-code-context',
  'mcp-code-context Pro: Tree-sitter WASM AST Surgical Editing for AI Agents',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'Live demonstration of mcp-code-context (v7.0.0 Enterprise) parsing Concrete Syntax Trees, cutting LLM context window tokens by 85% and applying 2-phase cryptographic surgical edits.',
  'AI & AST Architecture',
  1,
  1
),
(
  'vid-cloudflare-edge-hono',
  'High-Concurrency Edge Architecture with Cloudflare Workers, D1 & Hono',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'Architecting global serverless architectures under 15ms TTFB, zero cold starts, distributed SQL persistence with D1, and real-time streaming AI agents.',
  'Serverless & Edge Computing',
  1,
  2
),
(
  'vid-dt24-zero-framework',
  'Pure PHP 8.3 Zero-Framework Architecture (DT24 Core Standard v4.0)',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'Eliminating monolithic bloat with immutable Value Objects, Command buses, CAS concurrency guards, and custom Service Locators in enterprise marketplace systems.',
  'Backend & SRE Standards',
  1,
  3
);

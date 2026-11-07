import type { CVData } from '../types/client.types'

export const cvEnglish: CVData = {
  name: 'Alejandro Chataing Avila',
  title: 'Senior Full-Stack Engineer & AI Systems Lead',
  location: 'Caracas, Venezuela (100% Remote Global)',
  email: 'chataing.alejandro@gmail.com',
  phone: '+58 424-166.88.76',
  github: 'achatainga',
  linkedin: 'alejandro-chataing-81798a106',
  summary:
    'Senior Systems Engineer with 10+ years architecting high-concurrency production platforms across e-commerce marketplaces, blockchain data APIs, and autonomous AI agent workflows. Author of mcp-code-context (v7.0.0 Enterprise Polyglot on NPM) and creator of a 12-tool MCP suite of adversarial guardrails for autonomous coding agents (PortLock, BurnGuard, LoopBreaker, OMNI-MAXIMUS, SecretCloak). Deep expertise in Cloudflare Workers edge architecture, Pure PHP 8.3 Zero-Framework standards (DT24 Core v4.0), React 19, Laravel, and Flutter. Bilingual communicator in C2 English and native Spanish.',
  experience: [
    {
      company: 'Detodo24.com',
      role: 'Senior Full-Stack Developer & AI Workflow Lead',
      period: '2025 — Present',
      location: 'Remote, Venezuela',
      bullets: [
        'Lead architect for multi-vendor e-commerce platform powering thousands of vendors: WordPress plugins + Laravel REST API + Flutter mobile app',
        'Built dt24-home-engine and dt24-product-wizard — production WordPress plugins with React Admin UIs, custom REST APIs, and strict SRE limits',
        'Authored mcp-code-context (v7.0.0 on NPM): Tree-sitter WASM AST surgical code reading, editing, and blast radius analysis with zero native deps',
        'Standardized AI-assisted development across team: daily velocity multiplier using Antigravity, Kiro IDE, and Gemini AI Studio',
        'Designed mobile <-> API sync and distributed state architecture with Flutter + Laravel + MySQL with CAS atomic locks',
      ],
      tech: ['PHP 8.3', 'WordPress', 'React 19', 'TypeScript', 'Laravel', 'Flutter', 'Cloudflare', 'Tree-sitter WASM', 'MySQL'],
    },
    {
      company: 'NonFungible.com',
      role: 'Senior Distributed Systems Engineer',
      period: '2021',
      location: 'Remote (Canada / France / UK)',
      bullets: [
        'Built high-throughput corporate API for accessing Ethereum blockchain NFT token data at scale',
        'Designed real-time REST endpoints consumed by enterprise analytics dashboards tracking millions in volume',
        'Optimized data pipeline efficiency and streaming ingestion for the Web3 analytics community',
      ],
      tech: ['Node.js', 'MongoDB', 'REST API', 'Ethereum', 'Web3'],
      url: 'https://nonfungible.com',
    },
    {
      company: 'Couponifier.com',
      role: 'Senior Full-Stack Developer',
      period: '2019 — 2021',
      location: 'Remote, Venezuela',
      bullets: [
        'Engineered full frontend and backend architecture for online coupon aggregation and deal scoring',
        'Built heuristic algorithms to classify, rank, and score merchant discounts automatically',
        'Integrated third-party retailer APIs and maintained high-uptime data ingestion pipelines',
      ],
      tech: ['React', 'Node.js', 'PHP', 'MySQL', 'Heuristic Models', 'REST APIs'],
    },
    {
      company: 'Freelance & Enterprise Consulting',
      role: 'Full-Stack Developer & Technical Lead',
      period: '2015 — 2019',
      location: 'Remote',
      bullets: [
        'Delivered bespoke WordPress themes, enterprise plugins, and REST integrations for international clients',
        'Built RGCAdmin_Utilities and RGCAdminBot for rankedgaming.com (chat bot + administrative control panel)',
        'Developed listofwallets.com: React web + React Native iOS/Android/Windows/OSX with WordPress REST API backend',
        'Built cross-browser extensions for Chrome, Firefox, and Opera with native messaging and OAuth',
        'Official English<->Spanish Interpreter and Translator for the Venezuelan Ministry of Foreign Affairs (2016)',
      ],
      tech: ['WordPress', 'Laravel', 'React', 'React Native', 'Electron', 'PHP', 'JavaScript'],
    },
    {
      company: 'Language Instruction Institutions',
      role: 'English Teacher & Computer Lab Instructor',
      period: '2006 — 2014',
      location: 'Caracas, Venezuela',
      bullets: [
        'Wall Street Institute (2006-2007), Berlitz (2008-2009), Plaza Sésamo (2009-2011)',
        'Alpha Learning (2012), Instituto Losher Ebbinghaus (2013), Oxford Institute (2014)',
        'Taught all proficiency levels; led digital language acquisition labs and multimedia learning platforms',
      ],
      tech: ['English C2', 'Pedagogy', 'Communication', 'Curriculum Design'],
    },
  ],
  projects: [
    {
      name: 'mcp-code-context Pro',
      description:
        'Flagship open-source MCP server (v7.0.0 Enterprise) — Tree-sitter WASM AST surgical reading, editing, and search for AI agents. Zero native dependencies, 15 language parsers, 2-phase write with diff confirmation, SQLite persistent cache, Call Hierarchy, and 85% token conservation.',
      tech: ['TypeScript', 'Node.js', 'Tree-sitter WASM', 'MCP Protocol', 'SQLite', 'AST'],
      url: 'https://www.npmjs.com/package/mcp-code-context',
      highlight: true,
    },
    {
      name: 'Edge AI Orchestrator',
      description:
        'Multi-tenant Cloudflare Workers platform with Durable Objects, D1 database, and Evolution API WhatsApp integration, orchestrating automated AI customer appointments and autonomous business agents.',
      tech: ['Cloudflare Workers', 'Hono', 'Durable Objects', 'D1 SQL', 'WhatsApp', 'Gemini'],
      url: 'https://github.com/achatainga/edge-ai-orchestrator',
      highlight: true,
    },
    {
      name: 'Edge AI Video Engine',
      description:
        'Autonomous vertical video rendering and cinematic assembly engine with FFmpeg, Edge-TTS, Librosa beat synchronization, and automated WhatsApp dispatch.',
      tech: ['FastAPI', 'Python', 'FFmpeg', 'Edge-TTS', 'Librosa', 'Evolution API'],
      url: 'https://github.com/achatainga/edge-ai-video-engine',
    },
    {
      name: 'Settleflow',
      description:
        'High-concurrency e-commerce settlement engine with WhatsApp Baileys integration, Redlock distributed locking, and real-time inventory ledger auditing.',
      tech: ['Node.js', 'TypeScript', 'D1', 'WhatsApp API', 'Redlock'],
    },
    {
      name: 'Victory Homes PWA',
      description:
        'Dual-currency (USD/VES/USDT) field sales administration system — React PWA powered by a serverless backend on Cloudflare Workers and D1 database.',
      tech: ['React PWA', 'Cloudflare Workers', 'D1 SQL', 'Tailwind CSS', 'TypeScript'],
      url: 'https://github.com/achatainga/victory-homes',
    },
    {
      name: 'dt24-home-engine & dt24-product-wizard',
      description:
        'Production WordPress plugins powering the DeTodo24 marketplace under DT24 Core Standard v4.0 (Pure PHP 8.3 Zero-Framework). Features React Admin dashboards, custom REST APIs, and strict SRE physical limit guardrails.',
      tech: ['Pure PHP 8.3', 'WordPress', 'React 19', 'REST API', 'MySQL'],
    },
  ],
  skillGroups: [
    {
      category: 'Backend & Edge Computing',
      skills: [
        { name: 'Cloudflare Workers / Hono / D1', level: 96 },
        { name: 'Pure PHP 8.3 / Laravel / WordPress', level: 96 },
        { name: 'Node.js / TypeScript', level: 94 },
        { name: 'Python / FastAPI', level: 86 },
        { name: 'MySQL / SQLite / MongoDB', level: 90 },
      ],
    },
    {
      category: 'Frontend & Mobile',
      skills: [
        { name: 'React 19 / TypeScript', level: 95 },
        { name: 'Tailwind CSS / Framer Motion', level: 94 },
        { name: 'Flutter / Dart', level: 82 },
        { name: 'React Native / Electron', level: 85 },
        { name: 'WebExtensions (Chrome / Firefox)', level: 88 },
      ],
    },
    {
      category: 'AI & Multi-Agent Systems',
      skills: [
        { name: 'mcp-code-context (author v7.0.0)', level: 99 },
        { name: 'Tree-sitter WASM AST Surgery', level: 98 },
        { name: 'Agent Skills Architecture (12 skills)', level: 96 },
        { name: 'Gemini API & Workers AI Streaming', level: 94 },
        { name: 'Adversarial SRE Auditing (Omni-Maximus)', level: 95 },
      ],
    },
    {
      category: 'Architecture & SRE',
      skills: [
        { name: 'Zero-Framework Systems (DT24 Core v4.0)', level: 97 },
        { name: 'CAS Concurrency & Distributed Locks', level: 92 },
        { name: 'REST & GraphQL API Design', level: 95 },
        { name: 'Git / CI/CD Pipelines', level: 90 },
        { name: 'WCAG 2.2 AA Accessibility & Core Web Vitals', level: 92 },
      ],
    },
  ],
  education: [
    {
      institution: 'Universidad Central de Venezuela (UCV)',
      degree: 'Computer Science — Faculty of Sciences',
      period: '2004 — 2007',
      details: ['Algorithms & Data Structures', 'Software Engineering', 'C, C++, Java Enterprise', 'Discrete Mathematics'],
    },
    {
      institution: 'Liceo Luisa Cáceres de Arismendi',
      degree: 'Bachiller en Ciencias',
      period: '1998 — 2004',
    },
  ],
  languages: [
    { name: 'English', level: 'C2 Expert / Bilingual', detail: 'Former teacher at Berlitz, Wall Street Institute, Oxford Institute. Official Foreign Affairs Translator.' },
    { name: 'Spanish', level: 'Native', detail: 'C2' },
  ],
}

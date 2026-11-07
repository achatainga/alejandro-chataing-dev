import type { CVData } from '../types/client.types'

export const cvSpanish: CVData = {
  name: 'Alejandro Chataing Avila',
  title: 'Ingeniero Full-Stack Senior & Líder de Sistemas de IA',
  location: 'Caracas, Venezuela (100% Remoto Global)',
  email: 'chataing.alejandro@gmail.com',
  phone: '+58 424-166.88.76',
  github: 'achatainga',
  linkedin: 'alejandro-chataing-81798a106',
  summary:
    'Ingeniero de Sistemas Senior con más de 10 años diseñando plataformas de alta concurrencia en producción: marketplaces e-commerce, APIs de analítica blockchain y flujos autónomos con agentes de IA. Autor de mcp-code-context (Enterprise Polyglot AST en NPM) y creador de la suite de 12 herramientas MCP y guardarraíles adversariales para agentes de IA (PortLock, BurnGuard, LoopBreaker, OMNI-MAXIMUS, SecretCloak). Especialista en arquitectura serverless con Cloudflare Workers, PHP 8.3 Puro con estándares Zero-Framework (DT24 v4.0), React 19, Laravel y Flutter. Comunicador bilingüe en inglés C2 y español nativo.',
  experience: [
    {
      company: 'Detodo24.com',
      role: 'Desarrollador Full-Stack Senior & Líder de Flujos con IA',
      period: '2025 — Presente',
      location: 'Remoto, Venezuela',
      bullets: [
        'Líder de arquitectura de la plataforma e-commerce multi-vendedor: plugins de WordPress + API REST Laravel + aplicación móvil Flutter',
        'Desarrollé dt24-home-engine y dt24-product-wizard — plugins de WordPress en producción con React Admin UIs, APIs REST a medida y límites SRE estrictos',
        'Publiqué mcp-code-context (Enterprise Polyglot en NPM): lectura, edición y análisis de blast radius quirúrgico con AST Tree-sitter WASM sin dependencias nativas',
        'Estandaricé el desarrollo asistido por IA en el equipo: multiplicador de velocidad diario con Antigravity, Kiro IDE y Gemini AI Studio',
        'Diseñé la sincronización móvil <-> API y estado distribuido con Flutter + Laravel + MySQL con bloqueos atómicos CAS',
      ],
      tech: ['PHP 8.3', 'WordPress', 'React 19', 'TypeScript', 'Laravel', 'Flutter', 'Cloudflare', 'Tree-sitter WASM', 'MySQL'],
    },
    {
      company: 'NonFungible.com',
      role: 'Ingeniero de Sistemas Distribuidos Senior',
      period: '2021',
      location: 'Remoto (Canadá / Francia / Reino Unido)',
      bullets: [
        'Construí API corporativa de alto rendimiento para acceder a datos de tokens NFT en blockchain Ethereum a gran escala',
        'Diseñé endpoints REST en tiempo real consumidos por dashboards analíticos empresariales que rastrean millones en volumen',
        'Optimicé la eficiencia de los pipelines de datos e ingesta por streaming para la comunidad Web3',
      ],
      tech: ['Node.js', 'MongoDB', 'REST API', 'Ethereum', 'Web3'],
      url: 'https://nonfungible.com',
    },
    {
      company: 'Couponifier.com',
      role: 'Desarrollador Full-Stack Senior',
      period: '2019 — 2021',
      location: 'Remoto, Venezuela',
      bullets: [
        'Diseñé la arquitectura completa frontend y backend para la agregación de cupones y clasificación de ofertas',
        'Construí modelos heurísticos para clasificar y puntuar descuentos de comercios de forma automatizada',
        'Integré APIs de minoristas de terceros y mantuve pipelines de ingesta con alta disponibilidad',
      ],
      tech: ['React', 'Node.js', 'PHP', 'MySQL', 'Modelos Heurísticos', 'APIs REST'],
    },
    {
      company: 'Clientes Internacionales & Consultoría',
      role: 'Desarrollador Full-Stack & Líder Técnico',
      period: '2015 — 2019',
      location: 'Remoto',
      bullets: [
        'Entregué temas y plugins empresariales de WordPress personalizados e integraciones REST para clientes internacionales',
        'Construí RGCAdmin_Utilities y RGCAdminBot para rankedgaming.com (bot de chat + panel de control administrativo)',
        'Desarrollé listofwallets.com: React web + React Native iOS/Android/Windows/OSX con backend WordPress REST API',
        'Construí extensiones para Chrome, Firefox y Opera con mensajería nativa y flujos OAuth',
        'Traductor e Intérprete Oficial Inglés <-> Español para el Ministerio de Relaciones Exteriores de Venezuela (2016)',
      ],
      tech: ['WordPress', 'Laravel', 'React', 'React Native', 'Electron', 'PHP', 'JavaScript'],
    },
    {
      company: 'Institutos de Enseñanza de Idiomas',
      role: 'Profesor de Inglés & Instructor de Laboratorio',
      period: '2006 — 2014',
      location: 'Caracas, Venezuela',
      bullets: [
        'Wall Street Institute (2006-2007), Berlitz (2008-2009), Plaza Sésamo (2009-2011)',
        'Alpha Learning (2012), Instituto Losher Ebbinghaus (2013), Oxford Institute (2014)',
        'Docente de todos los niveles; instructor de laboratorios digitales y plataformas interactivas de inglés',
      ],
      tech: ['Inglés C2', 'Pedagogía', 'Comunicación', 'Diseño Curricular'],
    },
  ],
  projects: [
    {
      name: 'mcp-code-context Pro',
      description:
        'Servidor MCP de código abierto insignia (Enterprise Polyglot AST) — lectura, edición y búsqueda quirúrgica basada en AST con Tree-sitter WASM para agentes de IA. Cero dependencias nativas, 15 parsers, confirmación de diffs en 2 fases, caché SQLite persistente y 85% de ahorro en tokens.',
      tech: ['TypeScript', 'Node.js', 'Tree-sitter WASM', 'Protocolo MCP', 'SQLite', 'AST'],
      url: 'https://www.npmjs.com/package/mcp-code-context',
      highlight: true,
    },
    {
      name: 'Bedrock CLI',
      description:
        'Herramienta CLI universal para DevOps y gestión avanzada de proyectos Roots Bedrock WordPress. Incorpora clonado automático de staging/producción en 1-clic con ingress Auto-SSL, streaming de base de datos remoto vía SSH con verificación criptográfica, proxy transparente de medios (zero-disk), enlaces simbólicos NTFS/POSIX y diagnósticos del sistema (`bedrock doctor`).',
      tech: ['PHP 8.3', 'Symfony Console', 'Docker', 'SSH Streaming', 'Roots Bedrock', 'Nginx TLS'],
      url: 'https://github.com/achatainga/bedrock-cli',
      highlight: true,
    },
    {
      name: 'Edge AI Orchestrator',
      description:
        'Plataforma multi-inquilino en Cloudflare Workers con Durable Objects, base de datos D1 e integración de WhatsApp Evolution API para orquestar agentes de citas y atención empresarial.',
      tech: ['Cloudflare Workers', 'Hono', 'Durable Objects', 'D1 SQL', 'WhatsApp', 'Gemini'],
      url: 'https://github.com/achatainga/edge-ai-orchestrator',
      highlight: true,
    },
    {
      name: 'Edge AI Video Engine',
      description:
        'Motor autónomo de renderizado y composición de video vertical con FFmpeg, Edge-TTS, sincronización musical con Librosa y despacho automático a WhatsApp.',
      tech: ['FastAPI', 'Python', 'FFmpeg', 'Edge-TTS', 'Librosa', 'Evolution API'],
      url: 'https://github.com/achatainga/edge-ai-video-engine',
    },
    {
      name: 'Settleflow',
      description:
        'Motor de liquidaciones e-commerce de alta concurrencia con WhatsApp Baileys, bloqueos distribuidos Redlock y auditoría contable en tiempo real.',
      tech: ['Node.js', 'TypeScript', 'D1', 'WhatsApp API', 'Redlock'],
    },
    {
      name: 'Victory Homes PWA',
      description:
        'Sistema administrativo bimoneda (USD/VES/USDT) para equipos de ventas en campo — React PWA con backend serverless en Cloudflare Workers y D1.',
      tech: ['React PWA', 'Cloudflare Workers', 'D1 SQL', 'Tailwind CSS', 'TypeScript'],
      url: 'https://github.com/achatainga/victory-homes',
    },
    {
      name: 'dt24-home-engine & dt24-product-wizard',
      description:
        'Plugins de WordPress en producción que impulsan el marketplace DeTodo24 bajo el estándar DT24 Core v4.0 (PHP 8.3 Puro Zero-Framework). UIs React Admin, APIs REST y guardarraíles SRE de límites físicos.',
      tech: ['PHP 8.3 Puro', 'WordPress', 'React 19', 'REST API', 'MySQL'],
    },
  ],
  skillGroups: [
    {
      category: 'Backend & Edge Computing',
      skills: [
        { name: 'Cloudflare Workers / Hono / D1', level: 96 },
        { name: 'PHP 8.3 Puro / Laravel / WordPress', level: 96 },
        { name: 'Node.js / TypeScript', level: 94 },
        { name: 'Python / FastAPI', level: 86 },
        { name: 'MySQL / SQLite / MongoDB', level: 90 },
      ],
    },
    {
      category: 'Frontend & Móvil',
      skills: [
        { name: 'React 19 / TypeScript', level: 95 },
        { name: 'Tailwind CSS / Framer Motion', level: 94 },
        { name: 'Flutter / Dart', level: 82 },
        { name: 'React Native / Electron', level: 85 },
        { name: 'WebExtensions (Chrome / Firefox)', level: 88 },
      ],
    },
    {
      category: 'IA & Sistemas Multi-Agente',
      skills: [
        { name: 'mcp-code-context (autor)', level: 99 },
        { name: 'Cirugía AST con Tree-sitter WASM', level: 98 },
        { name: 'Arquitectura de Skills de Agentes (12 skills)', level: 96 },
        { name: 'Gemini API & Streaming en Workers AI', level: 94 },
        { name: 'Auditoría SRE Adversarial (Omni-Maximus)', level: 95 },
      ],
    },
    {
      category: 'Arquitectura & SRE',
      skills: [
        { name: 'Sistemas Zero-Framework (DT24 Core v4.0)', level: 97 },
        { name: 'Concurrencia CAS y Bloqueos Distribuidos', level: 92 },
        { name: 'Diseño de APIs REST y GraphQL', level: 95 },
        { name: 'Git / Pipelines CI/CD', level: 90 },
        { name: 'Accesibilidad WCAG 2.2 AA & Core Web Vitals', level: 92 },
      ],
    },
  ],
  education: [
    {
      institution: 'Universidad Central de Venezuela (UCV)',
      degree: 'Licenciatura en Computación — Facultad de Ciencias',
      period: '2004 — 2007',
      details: ['Algoritmos y Estructuras de Datos', 'Ingeniería de Software', 'C, C++, Java Enterprise', 'Matemáticas Discretas'],
    },
    {
      institution: 'Liceo Luisa Cáceres de Arismendi',
      degree: 'Bachiller en Ciencias',
      period: '1998 — 2004',
    },
  ],
  languages: [
    { name: 'Inglés', level: 'C2 Experto / Bilingüe', detail: 'Ex docente en Berlitz, Wall Street Institute, Oxford Institute. Traductor Oficial del Ministerio de Relaciones Exteriores.' },
    { name: 'Español', level: 'Nativo', detail: 'C2' },
  ],
}

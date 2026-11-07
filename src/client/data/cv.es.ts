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
    'Ingeniero Full-Stack Senior con más de 10 años de experiencia desarrollando aplicaciones web, APIs y soluciones prácticas con inteligencia artificial. Autor de la librería mcp-code-context en NPM y de herramientas de código abierto utilizadas por miles de desarrolladores. Especializado en React, Node.js, PHP/Laravel y arquitecturas en la nube sobre Cloudflare. Fluidez nativa en español e inglés bilingüe nivel C2 (ex docente y traductor oficial).',
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
        'Herramienta de código abierto para desarrolladores que permite a asistentes como Cursor y Claude Code entender proyectos grandes y modificar código con precisión, ahorrando hasta un 85% de tokens de IA.',
      tech: ['TypeScript', 'Node.js', 'Tree-sitter WASM', 'Protocolo MCP', 'SQLite'],
      url: 'https://www.npmjs.com/package/mcp-code-context',
      highlight: true,
    },
    {
      name: 'Bedrock CLI',
      description:
        'Herramienta de línea de comandos para automatizar el clonado, despliegue y administración de sitios WordPress con Docker, certificados SSL automáticos y transferencias seguras por SSH.',
      tech: ['PHP 8.3', 'Symfony Console', 'Docker', 'SSH Streaming', 'Roots Bedrock', 'Nginx TLS'],
      url: 'https://github.com/achatainga/bedrock-cli',
      highlight: true,
    },
    {
      name: 'Edge AI Orchestrator',
      description:
        'Plataforma en la nube para conectar asistentes virtuales inteligentes a WhatsApp y sitios web, automatizando la atención al cliente y el agendamiento de citas para empresas.',
      tech: ['Cloudflare Workers', 'Hono', 'Durable Objects', 'D1 SQL', 'WhatsApp', 'Gemini'],
      url: 'https://github.com/achatainga/edge-ai-orchestrator',
      highlight: true,
    },
    {
      name: 'Edge AI Video Engine',
      description:
        'Motor automatizado para crear y editar videos verticales con narración de voz sintetizada, música sincronizada y envío directo a WhatsApp.',
      tech: ['FastAPI', 'Python', 'FFmpeg', 'Edge-TTS', 'Librosa', 'Evolution API'],
      url: 'https://github.com/achatainga/edge-ai-video-engine',
    },
    {
      name: 'Settleflow',
      description:
        'Sistema de conciliación de pagos y liquidaciones para comercio electrónico con alertas por WhatsApp y balance contable en tiempo real.',
      tech: ['Node.js', 'TypeScript', 'D1', 'WhatsApp API', 'Redlock'],
    },
    {
      name: 'Victory Homes PWA',
      description:
        'Aplicación web móvil multi-moneda (USD/VES) para equipos de ventas inmobiliarias con base de datos en la nube y funcionamiento sin servidor.',
      tech: ['React PWA', 'Cloudflare Workers', 'D1 SQL', 'Tailwind CSS', 'TypeScript'],
      url: 'https://github.com/achatainga/victory-homes',
    },
    {
      name: 'dt24-home-engine & dt24-product-wizard',
      description:
        'Plugins para WordPress que gestionan el catálogo, panel de vendedores y sincronización del marketplace DeTodo24 con interfaces modernas en React.',
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

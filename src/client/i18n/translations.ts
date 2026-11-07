export type Language = 'en' | 'es'

export interface TranslationDictionary {
  nav: {
    services: string
    skills: string
    videos: string
    sandboxes: string
    saas: string
    blog: string
    hireMe: string
    downloadCV: string
    admin: string
    languageToggle: string
  }
  hero: {
    statusBadge: string
    rateTag: string
    titleLead: string
    titleGradient: string
    titleTail: string
    bio: string
    ctaHire: string
    ctaExploreSkills: string
    ctaDownloadCV: string
    experienceYears: string
    mcpDownloads: string
    contextReduction: string
  }
  services: {
    tag: string
    title: string
    subtitle: string
    hourlyContract: {
      badge: string
      title: string
      rate: string
      desc: string
      f1: string
      f2: string
      f3: string
      cta: string
    }
    saasAgent: {
      badge: string
      title: string
      rate: string
      desc: string
      f1: string
      f2: string
      f3: string
      cta: string
    }
    mcpArchitecture: {
      badge: string
      title: string
      rate: string
      desc: string
      f1: string
      f2: string
      f3: string
      cta: string
    }
  }
  skills: {
    tag: string
    title: string
    subtitle: string
    filterAll: string
    filterMCP: string
    filterSRE: string
    filterCoding: string
    filterMeta: string
    installBtn: string
    copied: string
    downloadRaw: string
  }
  videos: {
    tag: string
    title: string
    subtitle: string
    filterAll: string
    watchOnYouTube: string
    addNewVideo: string
  }
  sandboxes: {
    tag: string
    title: string
    subtitle: string
    astTab: string
    terminalTab: string
  }
  saas: {
    tag: string
    title: string
    subtitle: string
    priceTag: string
    interactiveSimulator: string
  }
  blog: {
    tag: string
    title: string
    subtitle: string
    readArticle: string
  }
  footer: {
    role: string
    summary: string
    rights: string
    adminPortal: string
  }
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      services: 'Services',
      skills: 'Agent Skills & MCP',
      videos: 'Video Demos',
      sandboxes: 'Interactive Tools',
      saas: 'AI SaaS ($100/mo)',
      blog: 'Technical Blog',
      hireMe: 'Hire Me',
      downloadCV: 'Download CV',
      admin: 'Admin Portal',
      languageToggle: 'Español',
    },
    hero: {
      statusBadge: 'Available for Remote Roles & High-Impact Architecture',
      rateTag: '$30 — $60+/hr',
      titleLead: 'Architecting High-Concurrency Systems,',
      titleGradient: 'Surgical AST',
      titleTail: '& Autonomous Edge AI',
      bio: 'Senior Full-Stack Engineer & AI Systems Lead with 10+ years production experience. Author of mcp-code-context (Enterprise Polyglot AST) and creator of 12 published Agent Skills. Specializing in Cloudflare Edge, React 19, Pure PHP 8.3 zero-framework architectures, and turnkey AI agent automations.',
      ctaHire: 'Hire Me as Tech Lead',
      ctaExploreSkills: 'Explore Skills Hub',
      ctaDownloadCV: 'Download Resume (PDF)',
      experienceYears: '10+ Years Production',
      mcpDownloads: '14k+ MCP Installs',
      contextReduction: '85% Token Reduction',
    },
    services: {
      tag: 'Commercial Offerings',
      title: 'High-Impact Engineering & AI Solutions',
      subtitle: 'Transparent rate cards, verified production reliability, and zero overhead.',
      hourlyContract: {
        badge: 'Contracting',
        title: 'Full-Stack & Tech Lead Contracting',
        rate: '$30 — $60+ / hr',
        desc: 'Direct Staff / Principal engineering leadership. Scaling complex web architectures, micro-frontends, high-concurrency SQL/D1 databases, and SRE resilience.',
        f1: 'React 19, TypeScript, Tailwind CSS, Vite & Framer Motion',
        f2: 'Cloudflare Workers, Hono, D1 SQL & Durable Objects',
        f3: 'Pure PHP 8.3 Zero-Framework & Laravel Enterprise APIs',
        cta: 'Contract Alejandro',
      },
      saasAgent: {
        badge: 'Turnkey SaaS',
        title: 'Omnichannel AI Agent SaaS',
        rate: '$100 / mo',
        desc: 'Fully managed 24/7 AI conversational agent trained on your business documents. Automated lead qualification and scheduling across WhatsApp, Web, Instagram, and Telegram.',
        f1: 'Real-time WhatsApp Baileys / Evolution API integration',
        f2: 'Live calendar scheduling & CRM webhook dispatch',
        f3: 'Multi-lingual intent classification & human handoff',
        cta: 'Order AI SaaS ($100/mo)',
      },
      mcpArchitecture: {
        badge: 'AI Systems',
        title: 'Custom MCP & Agent Engineering',
        rate: '$3,000 — $12,000+',
        desc: 'Custom Model Context Protocol (MCP) servers, Tree-sitter WASM parsers, and multi-agent workflows tailored to your proprietary APIs and knowledge base.',
        f1: 'Custom MCP Server development with Stdio & SSE transports',
        f2: 'AST-guided context compression & surgical refactoring',
        f3: 'Adversarial SRE stress-testing & guardrail pipelines',
        cta: 'Request MCP Architecture',
      },
    },
    skills: {
      tag: 'Open-Source & Extensions',
      title: 'Agent Skills & MCP Download Hub',
      subtitle: 'Free tools and production agent extensions built to eliminate token waste and AI hallucinations.',
      filterAll: 'All Tools (13)',
      filterMCP: 'MCP Servers',
      filterSRE: 'SRE & Verification',
      filterCoding: 'Coding Standards',
      filterMeta: 'Meta-Workflows',
      installBtn: 'Copy CLI',
      copied: 'Copied!',
      downloadRaw: 'Raw SKILL.md',
    },
    videos: {
      tag: 'Live Demonstrations',
      title: 'Showcase Videos & System Demos',
      subtitle: 'Watch deep architectural walkthroughs, live coding sessions, and AI tooling in production.',
      filterAll: 'All Videos',
      watchOnYouTube: 'Watch on YouTube',
      addNewVideo: 'Add Video (Admin)',
    },
    sandboxes: {
      tag: 'Zero-Mockup Engineering',
      title: 'Interactive Live Sandboxes',
      subtitle: 'Test our real Tree-sitter AST parser and interactive command-line shell directly in your browser.',
      astTab: 'Tree-sitter AST Visualizer',
      terminalTab: 'Vibe Coding Terminal',
    },
    saas: {
      tag: 'Interactive Demonstration',
      title: 'Turnkey AI Agent SaaS Simulator ($100/mo)',
      subtitle: 'Test the customer experience across real-world business scenarios: Real Estate, Dental Clinic, and E-commerce Support.',
      priceTag: '$100 / month flat',
      interactiveSimulator: 'Live Smartphone Simulator',
    },
    blog: {
      tag: 'Headless CMS',
      title: 'Engineering Deep Dives & Articles',
      subtitle: 'Technical perspectives on serverless edge computing, AST optimization, and high-concurrency systems.',
      readArticle: 'Read Full Analysis',
    },
    footer: {
      role: 'Senior Full-Stack Engineer & AI Systems Lead',
      summary: 'Building high-concurrency architectures, enterprise MCP servers, and autonomous agent workflows from Caracas, Venezuela for remote teams worldwide.',
      rights: 'All rights reserved.',
      adminPortal: 'Admin Portal',
    },
  },
  es: {
    nav: {
      services: 'Servicios',
      skills: 'Skills de IA y MCP',
      videos: 'Demos en Video',
      sandboxes: 'Herramientas Interactivas',
      saas: 'SaaS de IA ($100/mes)',
      blog: 'Blog Técnico',
      hireMe: 'Contrátame',
      downloadCV: 'Descargar CV',
      admin: 'Portal Admin',
      languageToggle: 'English',
    },
    hero: {
      statusBadge: 'Disponible para Roles Remotos y Arquitectura de Alto Impacto',
      rateTag: '$30 — $60+/h',
      titleLead: 'Sistemas de Alta Concurrencia,',
      titleGradient: 'Cirugía AST',
      titleTail: '& Agentes de IA en el Edge',
      bio: 'Senior Full-Stack Engineer y Lead de Sistemas de IA con 10+ años de experiencia en producción. Autor de mcp-code-context (Enterprise Polyglot AST) y creador de 12 Agent Skills publicados. Especialista en Cloudflare Edge, React 19, arquitecturas PHP 8.3 puro zero-framework y agentes de IA llave en mano.',
      ctaHire: 'Contratar como Tech Lead',
      ctaExploreSkills: 'Explorar Hub de Skills',
      ctaDownloadCV: 'Descargar CV (PDF)',
      experienceYears: '10+ Años en Producción',
      mcpDownloads: '14k+ Descargas MCP',
      contextReduction: '85% Ahorro de Tokens',
    },
    services: {
      tag: 'Servicios Profesionales',
      title: 'Soluciones de Ingeniería y Sistemas de IA',
      subtitle: 'Tarifas transparentes, confiabilidad demostrada en producción y cero intermediarios.',
      hourlyContract: {
        badge: 'Contratación',
        title: 'Contratación Full-Stack & Tech Lead',
        rate: '$30 — $60+ / h',
        desc: 'Liderazgo técnico Staff / Principal directo. Escalamiento de arquitecturas web complejas, micro-frontends, bases de datos SQL/D1 de alta concurrencia y resiliencia SRE.',
        f1: 'React 19, TypeScript, Tailwind CSS, Vite & Framer Motion',
        f2: 'Cloudflare Workers, Hono, D1 SQL & Durable Objects',
        f3: 'PHP 8.3 Puro Zero-Framework y APIs Laravel Enterprise',
        cta: 'Contratar a Alejandro',
      },
      saasAgent: {
        badge: 'SaaS Llave en Mano',
        title: 'SaaS de Agente de IA Omnicanal',
        rate: '$100 / mes',
        desc: 'Agente conversacional 24/7 totalmente configurado y entrenado con los documentos de tu negocio. Calificación automática de leads y agenda por WhatsApp, Web, Instagram y Telegram.',
        f1: 'Integración en tiempo real con WhatsApp Baileys / Evolution API',
        f2: 'Agendamiento automático de citas y envío a tu CRM',
        f3: 'Clasificación multilingüe de intenciones y traspaso a humanos',
        cta: 'Contratar SaaS ($100/mes)',
      },
      mcpArchitecture: {
        badge: 'Sistemas de IA',
        title: 'Arquitectura MCP y Agentes a Medida',
        rate: '$3,000 — $12,000+',
        desc: 'Servidores Model Context Protocol (MCP) personalizados, parsers Tree-sitter WASM y flujos de trabajo multi-agente adaptados a tus APIs propietarias y base de conocimiento.',
        f1: 'Desarrollo de servidores MCP con transportes Stdio y SSE',
        f2: 'Compresión de contexto guiada por AST y refactorización quirúrgica',
        f3: 'Pipelines de auditoría adversarial SRE y guardrails de seguridad',
        cta: 'Solicitar Arquitectura MCP',
      },
    },
    skills: {
      tag: 'Código Abierto y Extensiones',
      title: 'Hub de Descargas de Agent Skills y MCP',
      subtitle: 'Herramientas gratuitas y extensiones de agentes construidas para erradicar el desperdicio de tokens y alucinaciones.',
      filterAll: 'Todas las Herramientas (13)',
      filterMCP: 'Servidores MCP',
      filterSRE: 'SRE y Verificación',
      filterCoding: 'Estándares de Código',
      filterMeta: 'Meta-Flujos de Trabajo',
      installBtn: 'Copiar CLI',
      copied: '¡Copiado!',
      downloadRaw: 'SKILL.md Raw',
    },
    videos: {
      tag: 'Demostraciones en Vivo',
      title: 'Videos y Demos de Arquitectura',
      subtitle: 'Mira recorridos arquitectónicos a fondo, sesiones de programación en vivo y herramientas de IA operando en producción.',
      filterAll: 'Todos los Videos',
      watchOnYouTube: 'Ver en YouTube',
      addNewVideo: 'Agregar Video (Admin)',
    },
    sandboxes: {
      tag: 'Cero Maquetas',
      title: 'Sandboxes Interactivos en Vivo',
      subtitle: 'Prueba nuestro parser Tree-sitter AST real y nuestra terminal interactiva de comandos directamente en tu navegador.',
      astTab: 'Visualizador Tree-sitter AST',
      terminalTab: 'Terminal Vibe Coding',
    },
    saas: {
      tag: 'Demostración Interactiva',
      title: 'Simulador del SaaS de Agente de IA ($100/mes)',
      subtitle: 'Prueba la experiencia real de atención al cliente en diferentes industrias: Bienes Raíces, Clínica Odontológica y Soporte de E-commerce.',
      priceTag: '$100 / mes fijo',
      interactiveSimulator: 'Simulador de Smartphone en Vivo',
    },
    blog: {
      tag: 'CMS Serverless',
      title: 'Artículos y Análisis de Ingeniería',
      subtitle: 'Perspectivas técnicas sobre cómputo edge serverless, optimización AST y sistemas de alta concurrencia.',
      readArticle: 'Leer Análisis Completo',
    },
    footer: {
      role: 'Senior Full-Stack Engineer & AI Systems Lead',
      summary: 'Construyendo arquitecturas de alta concurrencia, servidores MCP enterprise y agentes autónomos desde Caracas, Venezuela para equipos remotos globales.',
      rights: 'Todos los derechos reservados.',
      adminPortal: 'Portal de Administración',
    },
  },
}

import type { ServicePackage } from '../types/client.types'

export const SERVICES_DATA_EN: ServicePackage[] = [
  {
    id: 'hourly-contracting',
    title: 'Senior Full-Stack Contracting',
    subtitle: 'Add a senior engineer to your team to ship faster',
    badge: 'Popular for Teams & Startups',
    price: '$30 — $60+',
    period: '/ hour',
    description:
      'Direct engineering capacity to build new features, fix tricky production bugs, or modernize your web applications across React, Node.js, PHP/Laravel, and Cloudflare.',
    highlights: [
      'Modern, responsive frontends with React 19, TypeScript & Tailwind',
      'Fast, reliable REST APIs and backends in PHP, Laravel, or Node.js',
      'Advanced WordPress plugins, architecture migrations, and optimizations',
      'SQL database tuning and performance bottleneck resolution',
      'Clear daily async communication, continuous delivery, and clean code',
    ],
    ctaText: 'Hire for Hourly Contract',
    serviceInterest: 'hourly_contract',
  },
  {
    id: 'ai-saas-agent',
    title: 'AI Business Assistant SaaS',
    subtitle: '24/7 customer care & lead generation on WhatsApp & Web',
    badge: 'Turnkey for Businesses',
    price: '$100',
    period: '/ month',
    description:
      'A dedicated smart virtual assistant trained on your business services and FAQs that answers inquiries, qualifies prospects, and books appointments around the clock.',
    highlights: [
      'Connected directly to your business WhatsApp number and website',
      'Trained on your services, pricing, and company knowledge base',
      'Pushes instant alerts to your phone when a high-value customer reaches out',
      'Automatic pause and human handoff whenever personal attention is needed',
      'Zero maintenance: hosted on Cloudflare Edge with 99.9% reliability',
    ],
    ctaText: 'Deploy My Business Agent',
    serviceInterest: 'ai_saas',
  },
  {
    id: 'custom-mcp-architecture',
    title: 'Custom AI Tools & Architecture',
    subtitle: 'Supercharge how your engineering team uses AI',
    badge: 'High Value',
    price: '$3,000 — $12,000',
    period: '/ project',
    description:
      'Custom Model Context Protocol (MCP) servers and LLM integrations that allow coding assistants like Cursor and Claude Code to work with your proprietary codebase while cutting token costs by up to 85%.',
    highlights: [
      'Bespoke MCP tools tailored to your internal APIs and databases',
      'Significant prompt token savings through precise code parsing',
      'Custom automation pipelines to speed up feature delivery and code reviews',
      'Secure, zero-leak credential architecture and data safety guardrails',
      'Hands-on team onboarding and documentation included',
    ],
    ctaText: 'Request Project Proposal',
    serviceInterest: 'custom_mcp',
  },
]

export const SERVICES_DATA_ES: ServicePackage[] = [
  {
    id: 'hourly-contracting',
    title: 'Desarrollo Full-Stack por Horas',
    subtitle: 'Suma un programador senior a tu equipo para avanzar rápido',
    badge: 'Ideal para Startups y Equipos',
    price: '$30 — $60+',
    period: '/ hora',
    description:
      'Capacidad técnica directa para crear nuevas funciones, optimizar el rendimiento o resolver problemas complejos en React, Node.js, PHP, Laravel o Cloudflare.',
    highlights: [
      'Interfaces modernas y veloces con React 19, TypeScript y Tailwind',
      'APIs y servicios backend rápidos en PHP, Laravel o Node.js',
      'Plugins a medida y modernización de plataformas WordPress',
      'Optimización de bases de datos SQL y corrección de cuellos de botella',
      'Comunicación diaria clara, entregas continuas y código limpio',
    ],
    ctaText: 'Contratar por Horas',
    serviceInterest: 'hourly_contract',
  },
  {
    id: 'ai-saas-agent',
    title: 'Agente de IA para tu Negocio',
    subtitle: 'Atención 24/7 en WhatsApp y Web para captar clientes',
    badge: 'Listo para Usar',
    price: '$100',
    period: '/ mes',
    description:
      'Un asistente virtual inteligente configurado con la información de tu empresa que responde preguntas frecuentes, califica prospectos y agenda reuniones automáticamente.',
    highlights: [
      'Conectado directamente a tu número de WhatsApp y a tu página web',
      'Entrenado con tus servicios, precios y preguntas frecuentes',
      'Te avisa de inmediato al teléfono cuando un cliente quiere contratarte',
      'Pausa automática para que un asesor humano tome el control si es necesario',
      'Cero mantenimiento: alojado en la nube con 99.9% de estabilidad',
    ],
    ctaText: 'Implementar Mi Agente',
    serviceInterest: 'ai_saas',
  },
  {
    id: 'custom-mcp-architecture',
    title: 'Herramientas de IA y Consultoría',
    subtitle: 'Optimiza cómo tu equipo de desarrollo aprovecha la IA',
    badge: 'Alto Impacto',
    price: '$3,000 — $12,000',
    period: '/ proyecto',
    description:
      'Servidores MCP y herramientas personalizadas para que editores como Cursor y Claude Code trabajen con tu código propietario de forma precisa, ahorrando hasta un 85% de tokens.',
    highlights: [
      'Herramientas a medida conectadas a tus bases de datos y APIs internas',
      'Ahorro notable de tokens de IA al analizar solo el código relevante',
      'Automatizaciones para acelerar revisiones y entregas de software',
      'Arquitectura segura que protege tus credenciales y datos privados',
      'Capacitación práctica y documentación completa para tu equipo',
    ],
    ctaText: 'Solicitar Propuesta Técnica',
    serviceInterest: 'custom_mcp',
  },
]

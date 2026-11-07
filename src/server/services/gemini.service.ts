import type { ChatMessageDTO } from '../dto/chat.dto'

export interface GeminiServiceConfig {
  apiKey: string
  modelName?: string
}

const CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.8-flash',
]

export class GeminiService {
  private primaryModel: string

  constructor(private config: GeminiServiceConfig) {
    this.primaryModel = config.modelName || 'gemini-flash-lite-latest'
  }

  private buildSystemInstruction(language: 'en' | 'es'): string {
    const isEs = language === 'es'

    if (isEs) {
      return `Eres el Agente de IA oficial de Alejandro Chataing Avila en su plataforma personal alejandro-chataing.dev.
Tu misión es atender a reclutadores, CTOs, fundadores y clientes potenciales con máxima precisión técnica, elocuencia y calidez profesional. Habla siempre de Alejandro en tercera persona.

PERFIL DE ALEJANDRO CHATAING AVILA:
- Rol: Senior Full-Stack Engineer, AI-Augmented Tech Lead & Principal Systems Architect (10+ años de experiencia en producción).
- Ubicación: Caracas, Venezuela (disponible 100% remoto para empresas globales).
- Idiomas: Inglés C2 Experto (ex docente en Berlitz, Wall Street Institute, Oxford Institute; traductor oficial del Ministerio de Relaciones Exteriores) y Español Nativo.
- Especialidades Técnicas:
  1. Frontend & Mobile: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Flutter / Dart.
  2. Backend & Edge: Cloudflare Workers, Hono, D1 SQL, Durable Objects, Node.js, Laravel REST APIs, PHP 8.3 Puro con arquitectura Zero-Framework (Estándar DT24 v4.0).
  3. AI & Multi-Agent Systems: Autor de 'mcp-code-context' (v7.0.0 Enterprise Polyglot en NPM con Tree-sitter WASM AST que reduce tokens hasta un 85%). Creador de 12 skills de agentes (truth-first, deep-research-team, codex-grade-coding, frontend-motion-wizard, code-reviewer, etc.).
  4. Proyectos en Producción: DeTodo24 Marketplace (plugins core, UIs React, sync móvil), NonFungible.com API (datos blockchain Ethereum a gran escala), Settleflow, Edge AI Orchestrator.

SERVICIOS COMERCIALES Y TARIFAS:
- Contratación por Horas / Tech Lead: $30 a $60+/h según complejidad o rol Staff.
- Proyectos Llave en Mano / Auditorías SRE: $3,000 a $15,000+.
- SaaS Agente de IA para Negocios: $100/mes (atención multicanal automatizada por WhatsApp, Web, Instagram y Telegram).

REGLAS INQUEBRANTABLES:
- Sé conciso, punchy y elocuente (máximo 400 caracteres por respuesta normal).
- Responde siempre en el mismo idioma en que el usuario te escribe (detecta inglés o español automáticamente).
- Si el usuario muestra interés en contratarlo, pedir presupuesto, saber tarifas o agendar una llamada: invítalo cordialmente y añade la etiqueta mágica __OPEN_HIRE_MODAL__ al final en su propia línea.
- Nunca inventes experiencia que no esté en este perfil.`
    }

    return `You are the official AI Agent representing Alejandro Chataing Avila on his platform alejandro-chataing.dev.
Your mission is to represent Alejandro to engineering leaders, CTOs, founders, and recruiters with technical mastery, precision, and enthusiasm. Speak of Alejandro in the third person.

ALEJANDRO CHATAING'S PROFILE:
- Role: Senior Full-Stack Engineer, AI-Augmented Tech Lead & Principal Systems Architect (10+ years production experience).
- Location: Caracas, Venezuela (100% remote worldwide availability).
- Languages: English C2 / Expert (Former instructor at Berlitz, Wall Street Institute, Oxford Institute; official translator for Venezuelan Foreign Affairs Ministry) and Spanish Native.
- Core Technical Strengths:
  1. Frontend & Mobile: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Flutter / Dart.
  2. Backend & Serverless: Cloudflare Workers, Hono, D1 Database, Durable Objects, Node.js, Laravel REST APIs, Pure PHP 8.3 Zero-Framework (DT24 Core Standard v4.0).
  3. AI & Multi-Agent Architecture: Author of 'mcp-code-context' (v7.0.0 Enterprise Polyglot on NPM with Tree-sitter WASM AST saving up to 85% context tokens). Creator of 12 published agent skills (truth-first, deep-research-team, codex-grade-coding, frontend-motion-wizard, code-reviewer, etc.).
  4. Battle-Tested Systems: DeTodo24 e-commerce ecosystem, NonFungible.com NFT analytics API, Settleflow concurrency engine, Edge AI Orchestrator.

COMMERCIAL OFFERINGS & RATE CARD:
- Hourly Contract / Tech Lead: $30 to $60+/hr (or dedicated Staff engineer engagement).
- Fixed-Scope Architecture & SRE Hardening: $3k to $15k+.
- Turnkey AI Agent SaaS: $100/mo (Omnichannel customer support & scheduling on WhatsApp, Web, Instagram, Telegram).

KEY RULES:
- Keep answers concise, high-signal, and punchy (under 400 characters for typical responses).
- Automatically match the visitor's language (English or Spanish).
- When a user asks about hiring, availability, rates, or wants to connect: enthusiastically advocate for Alejandro and append the special token __OPEN_HIRE_MODAL__ on its own line at the end.
- Never hallucinate credentials or skills outside this profile.`
  }

  async generateReply(messages: ChatMessageDTO[], language: 'en' | 'es'): Promise<string> {
    const modelsToTry = [
      this.primaryModel,
      ...CANDIDATE_MODELS.filter((m) => m !== this.primaryModel),
    ]

    const systemInstruction = this.buildSystemInstruction(language)

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const body = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 600,
        topP: 0.9,
      },
    }

    let lastError: Error | null = null

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(6000),
        })

        if (!response.ok) {
          const errText = await response.text()
          console.warn(`[GeminiService] Model ${model} returned HTTP ${response.status}: ${errText}`)
          lastError = new Error(`HTTP ${response.status}: ${errText}`)
          continue
        }

        const json: any = await response.json()
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
        if (text.trim().length > 0) {
          return text.trim()
        }
      } catch (err: any) {
        console.warn(`[GeminiService] Error with model ${model}: ${err.message}`)
        lastError = err
      }
    }

    console.error('[GeminiService] All candidate models exhausted:', lastError?.message)
    return language === 'es'
      ? '¡Hola! Alejandro Chataing es Senior Full-Stack Engineer y Lead de Sistemas de IA. Para revisar tu proyecto o agendar una llamada directa, conversemos de inmediato:\n__OPEN_HIRE_MODAL__'
      : "Hello! Alejandro Chataing is a Senior Full-Stack Engineer & AI Systems Lead. To discuss your project or schedule a call, let's connect right away:\n__OPEN_HIRE_MODAL__"
  }
}

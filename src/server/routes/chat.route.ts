import { Hono } from 'hono'
import type { Env } from '../types/env'
import { validateChatRequest } from '../dto/chat.dto'
import { GeminiService } from '../services/gemini.service'
import { DatabaseService } from '../services/db.service'
import { WhatsAppNotificationService } from '../services/whatsapp.service'
import { RateLimiterService } from '../services/rate-limiter.service'

export const chatRoute = new Hono<{ Bindings: Env }>()

/**
 * Validates request origin against authorized hosts to block cross-site script abuse.
 */
function isAllowedRequestOrigin(originHeader?: string | null, refererHeader?: string | null): boolean {
  const allowedHosts = [
    'alejandro-chataing.pages.dev',
    'alejandro-chataing.dev',
    'localhost',
    '127.0.0.1',
  ]

  const checkUrl = (urlStr?: string | null) => {
    if (!urlStr) return true // Allow direct curl if no origin/referer header sent (checked by IP)
    try {
      const parsed = new URL(urlStr)
      const host = parsed.hostname.toLowerCase()
      return allowedHosts.some((h) => host === h || host.endsWith('.alejandro-chataing.pages.dev'))
    } catch {
      return false
    }
  }

  return checkUrl(originHeader) && checkUrl(refererHeader)
}

chatRoute.post('/', async (c) => {
  try {
    // 1. Cross-Site Origin & Referer Defense
    const origin = c.req.header('origin')
    const referer = c.req.header('referer')
    if (!isAllowedRequestOrigin(origin, referer)) {
      return c.json({ success: false, error: 'Unauthorized origin or cross-site request rejected' }, 403)
    }

    const rawBody = await c.req.json().catch(() => null)
    const validation = validateChatRequest(rawBody)

    if (!validation.valid || !validation.data) {
      return c.json({ success: false, error: validation.error }, 400)
    }

    const { sessionId, visitorHash, messages, language } = validation.data
    const lastUserMessage = messages[messages.length - 1].content

    // 2. Real Client IP Extraction & Hashing
    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-real-ip') || 'unknown-ip'
    const ipHash = await RateLimiterService.hashIp(clientIp)

    // Admin Whitelist Bypass (allows Alejandro to test his own bot without limit)
    const adminSecret = c.req.header('x-admin-secret') || validation.data.adminSecret
    const isAdmin = Boolean(
      adminSecret && c.env.ADMIN_SECRET && adminSecret.trim() === c.env.ADMIN_SECRET.trim()
    )

    let currentSessionCount = 0

    if (!isAdmin) {
      // 3. Ultra-Fast In-Memory Burst Rate Check (Max 6 msgs per 60s per IP)
      const burst = RateLimiterService.checkBurst(clientIp)
      if (!burst.allowed) {
        c.header('Retry-After', String(burst.retryAfterSeconds || 15))
        return c.json(
          {
            success: false,
            error:
              language === 'es'
                ? `Estás enviando mensajes demasiado rápido. Por favor espera ${burst.retryAfterSeconds}s antes de reintentar.`
                : `You are sending messages too quickly. Please wait ${burst.retryAfterSeconds}s before retrying.`,
          },
          429
        )
      }

      // 4. Persistent D1 Daily IP Cap (Max 60 msgs per 24h per IP address)
      const dailyIpCount = await RateLimiterService.getDailyIpCount(c.env.DB, ipHash)
      if (dailyIpCount >= RateLimiterService.DAILY_IP_MAX) {
        return c.json(
          {
            success: false,
            error:
              language === 'es'
                ? 'Has alcanzado el límite diario de demostración para tu conexión (60 mensajes/día). Alejandro está disponible directamente para evaluar tu proyecto.'
                : 'You have reached the daily demonstration limit for your connection (60 messages/day). Alejandro is available directly to discuss your project.',
            suggestedAction: 'open_hire_modal',
          },
          429
        )
      }

      // 5. Persistent D1 Daily Visitor Cap (Max 60 msgs per 24h per visitor hash)
      const dailyVisitorCount = await RateLimiterService.getDailyVisitorCount(c.env.DB, visitorHash)
      if (dailyVisitorCount >= RateLimiterService.DAILY_VISITOR_MAX) {
        return c.json(
          {
            success: false,
            error:
              language === 'es'
                ? 'Has alcanzado el límite diario de demostración (60 mensajes/día). Para continuar o cotizar tu proyecto, contacta a Alejandro directamente vía WhatsApp o Correo.'
                : 'You have reached the daily demonstration limit (60 messages/day). To continue or request a proposal, please contact Alejandro directly via WhatsApp or Email.',
            suggestedAction: 'open_hire_modal',
          },
          429
        )
      }

      // 6. Session Message Budget Check (Max 15 msgs per session)
      currentSessionCount = await RateLimiterService.getSessionMessageCount(c.env.DB, sessionId)
      if (currentSessionCount >= RateLimiterService.SESSION_MAX) {
        const cutoffReply =
          language === 'es'
            ? 'Has alcanzado el límite de 15 mensajes automáticos para esta sesión de demostración. Para avanzar en tu proyecto o coordinar una propuesta técnica detallada, Alejandro está disponible directamente por WhatsApp o Correo. ¿Deseas abrir el formulario de contacto directo?'
            : "You've reached the 15-message demonstration limit for this session. To discuss your project requirements or receive a formal architecture proposal, Alejandro is available directly via WhatsApp or Email. Would you like to connect right away?"

        return c.json({
          success: true,
          sessionId,
          reply: cutoffReply,
          leadDetected: true,
          suggestedAction: 'open_hire_modal',
          remainingMessages: 0,
          sessionLimitReached: true,
        })
      }
    }

    // 7. Cloudflare Geo, Device & Audit Metadata
    const country = c.req.header('cf-ipcountry') || 'Unknown'
    const city = c.req.header('cf-ipcity') || undefined
    const userAgent = c.req.header('user-agent') || 'Browser'

    const dbService = new DatabaseService(c.env.DB)
    await dbService.upsertChatSession(sessionId, visitorHash, country, city, userAgent, ipHash)
    await dbService.appendChatMessage(sessionId, 'user', lastUserMessage)

    // 8. Gemini Inference with Fallback Chain
    const apiKey = c.env.GEMINI_API_KEY
    let rawReply = ''

    if (apiKey) {
      const gemini = new GeminiService({
        apiKey,
        modelName: c.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
      })
      rawReply = await gemini.generateReply(messages, language || 'en')
    } else {
      rawReply =
        language === 'es'
          ? '¡Hola! Soy el asistente de Alejandro Chataing. Alejandro es Senior Full-Stack Engineer con 10+ años de experiencia, autor de mcp-code-context y creador de agentes de IA. ¿Te gustaría agendar una llamada o revisar sus proyectos?\n__OPEN_HIRE_MODAL__'
          : "Hello! I am Alejandro Chataing's AI Assistant. Alejandro is a Senior Full-Stack Engineer & AI Systems Lead with 10+ years of experience. Would you like to hire him or explore his open-source skills?\n__OPEN_HIRE_MODAL__"
    }

    const leadDetected = rawReply.includes('__OPEN_HIRE_MODAL__')
    const cleanReply = rawReply.replace('__OPEN_HIRE_MODAL__', '').trim()

    await dbService.appendChatMessage(sessionId, 'assistant', cleanReply)

    // 9. WhatsApp Proactive Notification for High Intent
    if (leadDetected && c.env.EVOLUTION_API_URL && c.env.NOTIFICATION_PHONE) {
      c.executionCtx.waitUntil(
        (async () => {
          const wa = new WhatsAppNotificationService({
            apiUrl: c.env.EVOLUTION_API_URL!,
            apiKey: c.env.EVOLUTION_API_KEY,
            instance: c.env.EVOLUTION_INSTANCE || 'alejandro',
            targetPhone: c.env.NOTIFICATION_PHONE!,
          })
          await wa.notifyHighIntentChat(visitorHash, lastUserMessage)
        })()
      )
    }

    const remainingMessages = Math.max(0, RateLimiterService.SESSION_MAX - currentSessionCount - 1)

    return c.json({
      success: true,
      sessionId,
      reply: cleanReply,
      leadDetected,
      suggestedAction: leadDetected ? 'open_hire_modal' : undefined,
      remainingMessages,
      sessionLimitReached: remainingMessages === 0,
    })
  } catch (error: any) {
    console.error('[ChatRoute] Error processing chat:', error)
    return c.json(
      {
        success: false,
        error: 'Unable to process chat request at this time',
        detail: error?.message,
      },
      500
    )
  }
})

import { Hono } from 'hono'
import type { Env } from '../types/env'
import { validateChatRequest } from '../dto/chat.dto'
import { GeminiService } from '../services/gemini.service'
import { DatabaseService } from '../services/db.service'
import { WhatsAppNotificationService } from '../services/whatsapp.service'
import { RateLimiterService } from '../services/rate-limiter.service'

export const chatRoute = new Hono<{ Bindings: Env }>()

chatRoute.post('/', async (c) => {
  try {
    const rawBody = await c.req.json().catch(() => null)
    const validation = validateChatRequest(rawBody)

    if (!validation.valid || !validation.data) {
      return c.json({ success: false, error: validation.error }, 400)
    }

    const { sessionId, visitorHash, messages, language } = validation.data
    const lastUserMessage = messages[messages.length - 1].content

    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-real-ip') || 'unknown-ip'
    const throttleKey = `${clientIp}:${visitorHash}`

    // 1. Fast Burst Rate Check (Max 5 msgs per 60s)
    const burst = RateLimiterService.checkBurst(throttleKey)
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

    // 2. Daily Visitor Cap Check (Max 35 msgs per 24h)
    const dailyCount = await RateLimiterService.getDailyVisitorCount(c.env.DB, visitorHash)
    if (dailyCount >= RateLimiterService.DAILY_MAX) {
      return c.json(
        {
          success: false,
          error:
            language === 'es'
              ? 'Has alcanzado el límite diario de demostración (35 mensajes/día). Para continuar conversando o cotizar tu proyecto, por favor contacta a Alejandro directamente vía WhatsApp o Correo.'
              : 'You have reached the daily demonstration limit (35 messages/day). To continue or request a proposal, please contact Alejandro directly via WhatsApp or Email.',
          suggestedAction: 'open_hire_modal',
        },
        429
      )
    }

    // 3. Session Message Budget Check (Max 15 msgs per session - Prevents AI API Drainage)
    const currentSessionCount = await RateLimiterService.getSessionMessageCount(c.env.DB, sessionId)
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

    // Extract geo & device headers from Cloudflare
    const country = c.req.header('cf-ipcountry') || 'Unknown'
    const city = c.req.header('cf-ipcity') || undefined
    const userAgent = c.req.header('user-agent') || 'Browser'

    const dbService = new DatabaseService(c.env.DB)
    await dbService.upsertChatSession(sessionId, visitorHash, country, city, userAgent)
    await dbService.appendChatMessage(sessionId, 'user', lastUserMessage)

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

    // Trigger proactive WhatsApp alert if visitor expresses clear hiring intent
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

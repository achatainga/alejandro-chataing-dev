import { Hono } from 'hono'
import type { Env } from '../types/env'
import { validateChatRequest } from '../dto/chat.dto'
import { GeminiService } from '../services/gemini.service'
import { DatabaseService } from '../services/db.service'
import { WhatsAppNotificationService } from '../services/whatsapp.service'

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
      // Graceful fallback for local development without key
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

    return c.json({
      success: true,
      sessionId,
      reply: cleanReply,
      leadDetected,
      suggestedAction: leadDetected ? 'open_hire_modal' : undefined,
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

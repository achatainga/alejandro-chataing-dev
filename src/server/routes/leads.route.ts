import { Hono } from 'hono'
import type { Env } from '../types/env'
import { validateLeadSubmission, calculateLeadScore } from '../dto/lead.dto'
import { DatabaseService } from '../services/db.service'
import { WhatsAppNotificationService } from '../services/whatsapp.service'

export const leadsRoute = new Hono<{ Bindings: Env }>()

leadsRoute.post('/', async (c) => {
  try {
    const rawBody = await c.req.json().catch(() => null)
    const validation = validateLeadSubmission(rawBody)

    if (!validation.valid || !validation.data) {
      return c.json({ success: false, error: validation.error }, 400)
    }

    const leadData = validation.data
    const leadScore = calculateLeadScore(leadData)
    const ipCountry = c.req.header('cf-ipcountry') || 'Unknown'

    const dbService = new DatabaseService(c.env.DB)
    const savedLead = await dbService.insertLead(leadData, leadScore, ipCountry)

    // Send immediate WhatsApp alert to Alejandro
    if (c.env.EVOLUTION_API_URL && c.env.NOTIFICATION_PHONE) {
      c.executionCtx.waitUntil(
        (async () => {
          const wa = new WhatsAppNotificationService({
            apiUrl: c.env.EVOLUTION_API_URL!,
            apiKey: c.env.EVOLUTION_API_KEY,
            instance: c.env.EVOLUTION_INSTANCE || 'alejandro',
            targetPhone: c.env.NOTIFICATION_PHONE!,
          })
          await wa.notifyNewLead(savedLead)
        })()
      )
    }

    return c.json({
      success: true,
      message: 'Lead received successfully! Alejandro will reach out shortly.',
      leadId: savedLead.id,
      leadScore,
    })
  } catch (error: any) {
    console.error('[LeadsRoute] Error inserting lead:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to record lead inquiry',
        detail: error?.message,
      },
      500
    )
  }
})

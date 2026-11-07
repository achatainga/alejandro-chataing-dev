import { Hono } from 'hono'
import type { Env } from '../types/env'
import { validateTelemetryEvent } from '../dto/analytics.dto'
import { DatabaseService } from '../services/db.service'

export const analyticsRoute = new Hono<{ Bindings: Env }>()

analyticsRoute.post('/', async (c) => {
  try {
    const rawBody = await c.req.json().catch(() => null)
    const validation = validateTelemetryEvent(rawBody)

    if (!validation.valid || !validation.data) {
      return c.json({ success: false, error: validation.error }, 400)
    }

    const dbService = new DatabaseService(c.env.DB)
    await dbService.recordTelemetry(validation.data)

    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to record event' }, 500)
  }
})

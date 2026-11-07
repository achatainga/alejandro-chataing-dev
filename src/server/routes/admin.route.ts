import { Hono } from 'hono'
import type { Env } from '../types/env'
import { DatabaseService } from '../services/db.service'

export const adminRoute = new Hono<{ Bindings: Env }>()

// Auth middleware for admin endpoints
adminRoute.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '') || c.req.query('secret')
  const expectedSecret = c.env.ADMIN_SECRET || 'REDACTED_ADMIN_SECRET'

  if (!token || token !== expectedSecret) {
    return c.json({ success: false, error: 'Unauthorized: Invalid admin credentials' }, 401)
  }

  await next()
})

adminRoute.get('/metrics', async (c) => {
  try {
    const dbService = new DatabaseService(c.env.DB)
    const metrics = await dbService.getMetricsSummary()
    return c.json({ success: true, metrics })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to retrieve metrics' }, 500)
  }
})

adminRoute.get('/leads', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || 50
    const offset = Number(c.req.query('offset')) || 0
    const dbService = new DatabaseService(c.env.DB)
    const leads = await dbService.getLeads(limit, offset)
    return c.json({ success: true, total: leads.length, leads })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to retrieve leads' }, 500)
  }
})

import { Hono } from 'hono'
import type { Env } from '../types/env'
import { DatabaseService } from '../services/db.service'

export const adminRoute = new Hono<{ Bindings: Env }>()

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// Auth middleware for admin endpoints
adminRoute.use('*', async (c, next) => {
  const expectedSecret = c.env.ADMIN_SECRET
  if (!expectedSecret) {
    console.error('[AdminAuth] Server configuration error: ADMIN_SECRET is not configured')
    return c.json({ success: false, error: 'Server misconfiguration: ADMIN_SECRET is required' }, 500)
  }

  const authHeader = c.req.header('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (!token || !timingSafeCompare(token, expectedSecret)) {
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

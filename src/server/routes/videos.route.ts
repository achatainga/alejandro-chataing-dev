import { Hono } from 'hono'
import type { Env } from '../types/env'
import { DatabaseService } from '../services/db.service'
import type { CreateVideoDTO } from '../dto/video.dto'

export const videosRoute = new Hono<{ Bindings: Env }>()

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

function verifyAdmin(authHeader: string | undefined, expectedSecret: string | undefined): boolean {
  if (!authHeader || !expectedSecret) return false
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  return timingSafeCompare(token, expectedSecret)
}

// GET /api/videos - public list
videosRoute.get('/', async (c) => {
  const db = new DatabaseService(c.env.DB)
  const videos = await db.getVideos()
  return c.json({ success: true, videos })
})

// POST /api/videos - admin create video
videosRoute.post('/', async (c) => {
  const isAuthorized = verifyAdmin(c.req.header('Authorization'), c.env.ADMIN_SECRET)
  if (!isAuthorized) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const body = (await c.req.json().catch(() => null)) as CreateVideoDTO | null
  if (!body || !body.title || !body.youtubeUrl || !body.description) {
    return c.json({ success: false, error: 'title, youtubeUrl and description are required' }, 400)
  }

  const db = new DatabaseService(c.env.DB)
  const created = await db.insertVideo(body)
  return c.json({ success: true, video: created }, 201)
})

// DELETE /api/videos/:id - admin delete video
videosRoute.delete('/:id', async (c) => {
  const isAuthorized = verifyAdmin(c.req.header('Authorization'), c.env.ADMIN_SECRET)
  if (!isAuthorized) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  const db = new DatabaseService(c.env.DB)
  const deleted = await db.deleteVideo(id)
  return c.json({ success: deleted })
})

// GET /api/socials - public list of social links
videosRoute.get('/socials', async (c) => {
  const db = new DatabaseService(c.env.DB)
  const links = await db.getSocialLinks()
  return c.json({ success: true, links })
})

// POST /api/socials - admin update social link
videosRoute.post('/socials', async (c) => {
  const isAuthorized = verifyAdmin(c.req.header('Authorization'), c.env.ADMIN_SECRET)
  if (!isAuthorized) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const body = (await c.req.json().catch(() => null)) as { platform: string; url: string; label: string } | null
  if (!body || !body.platform || !body.url || !body.label) {
    return c.json({ success: false, error: 'platform, url and label are required' }, 400)
  }

  const db = new DatabaseService(c.env.DB)
  const updated = await db.updateSocialLink(body.platform, body.url, body.label)
  return c.json({ success: updated })
})

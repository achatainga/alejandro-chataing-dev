import { Hono } from 'hono'
import type { Env } from '../types/env'
import { DatabaseService } from '../services/db.service'
import { validateBlogPost } from '../dto/blog.dto'

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

// Blog CMS Endpoints
adminRoute.get('/blog', async (c) => {
  try {
    const dbService = new DatabaseService(c.env.DB)
    const posts = await dbService.getAllBlogPostsAdmin()
    return c.json({ success: true, total: posts.length, posts })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to retrieve blog posts', detail: err?.message }, 500)
  }
})

adminRoute.post('/blog', async (c) => {
  try {
    const body = await c.req.json().catch(() => null)
    const validation = validateBlogPost(body)
    if (!validation.valid || !validation.data) {
      return c.json({ success: false, error: validation.error || 'Invalid blog post payload' }, 400)
    }

    const dbService = new DatabaseService(c.env.DB)
    const post = await dbService.insertBlogPost(validation.data)
    return c.json({ success: true, message: 'Blog post created successfully', post }, 201)
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to create blog post', detail: err?.message }, 500)
  }
})

adminRoute.put('/blog/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const body = await c.req.json().catch(() => ({}))
    const dbService = new DatabaseService(c.env.DB)
    const updated = await dbService.updateBlogPost(slug, body)

    if (!updated) {
      return c.json({ success: false, error: 'Blog post not found or no changes applied' }, 404)
    }

    return c.json({ success: true, message: 'Blog post updated successfully' })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to update blog post', detail: err?.message }, 500)
  }
})

adminRoute.delete('/blog/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const dbService = new DatabaseService(c.env.DB)
    const deleted = await dbService.deleteBlogPost(slug)

    if (!deleted) {
      return c.json({ success: false, error: 'Blog post not found' }, 404)
    }

    return c.json({ success: true, message: 'Blog post deleted successfully' })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to delete blog post', detail: err?.message }, 500)
  }
})

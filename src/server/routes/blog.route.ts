import { Hono } from 'hono'
import type { Env } from '../types/env'
import { DatabaseService } from '../services/db.service'

export const blogRoute = new Hono<{ Bindings: Env }>()

blogRoute.get('/', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || 20
    const dbService = new DatabaseService(c.env.DB)
    const posts = await dbService.getBlogPosts(limit)

    return c.json({
      success: true,
      total: posts.length,
      posts,
    })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to retrieve blog posts', detail: err?.message }, 500)
  }
})

blogRoute.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const dbService = new DatabaseService(c.env.DB)
    const post = await dbService.getBlogPostBySlug(slug)

    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404)
    }

    return c.json({ success: true, post })
  } catch (err: any) {
    return c.json({ success: false, error: 'Failed to retrieve blog post', detail: err?.message }, 500)
  }
})

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './types/env'
import { chatRoute } from './routes/chat.route'
import { leadsRoute } from './routes/leads.route'
import { skillsRoute } from './routes/skills.route'
import { analyticsRoute } from './routes/analytics.route'
import { blogRoute } from './routes/blog.route'
import { adminRoute } from './routes/admin.route'

const app = new Hono<{ Bindings: Env }>()

// Global CORS middleware
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// API Sub-routers
app.route('/api/chat', chatRoute)
app.route('/api/leads', leadsRoute)
app.route('/api/skills', skillsRoute)
app.route('/api/analytics', analyticsRoute)
app.route('/api/blog', blogRoute)
app.route('/api/admin', adminRoute)

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    platform: 'Cloudflare Workers (Hono)',
    service: 'alejandro-chataing-dev',
    environment: c.env.ENVIRONMENT || 'production',
    timestamp: new Date().toISOString(),
  })
})

// Export standard Cloudflare Worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // Route API requests through Hono router
    if (url.pathname.startsWith('/api')) {
      return app.fetch(request, env, ctx)
    }

    // Serve static frontend assets via Cloudflare Workers Static Assets binding
    if (env.ASSETS) {
      return env.ASSETS.fetch(request)
    }

    // Fallback if assets binding is not ready
    return app.fetch(request, env, ctx)
  },
}

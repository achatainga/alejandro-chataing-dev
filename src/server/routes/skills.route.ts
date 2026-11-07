import { Hono } from 'hono'
import type { Env } from '../types/env'
import { SKILLS_CATALOG } from '../services/skills.data'
import { DatabaseService } from '../services/db.service'

export const skillsRoute = new Hono<{ Bindings: Env }>()

// List all skills and MCP servers
skillsRoute.get('/', (c) => {
  return c.json({
    success: true,
    total: SKILLS_CATALOG.length,
    skills: SKILLS_CATALOG,
  })
})

// Get specific skill by ID
skillsRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const skill = SKILLS_CATALOG.find((s) => s.id === id)

  if (!skill) {
    return c.json({ success: false, error: 'Skill not found' }, 404)
  }

  return c.json({ success: true, skill })
})

// Record download or copy event
skillsRoute.post('/:id/download', async (c) => {
  const id = c.req.param('id')
  const skill = SKILLS_CATALOG.find((s) => s.id === id)

  if (!skill) {
    return c.json({ success: false, error: 'Skill not found' }, 404)
  }

  const body = await c.req.json().catch(() => ({}))
  const visitorHash = typeof body.visitorHash === 'string' ? body.visitorHash : 'anonymous'
  const downloadType = typeof body.downloadType === 'string' ? body.downloadType : 'npm_cli'

  const dbService = new DatabaseService(c.env.DB)
  await dbService.recordSkillDownload(id, visitorHash, downloadType)

  return c.json({
    success: true,
    message: `Recorded ${downloadType} for ${skill.name}`,
    installCli: skill.installCli,
  })
})

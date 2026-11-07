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

// Get raw markdown text of skill
skillsRoute.get('/:id/raw', async (c) => {
  const id = c.req.param('id')
  const skill = SKILLS_CATALOG.find((s) => s.id === id)
  if (!skill) {
    return c.json({ success: false, error: 'Skill not found' }, 404)
  }

  try {
    if (c.env.ASSETS) {
      const assetRes = await c.env.ASSETS.fetch(new URL(`/skills/${id}.md`, c.req.url))
      if (assetRes.ok) {
        const text = await assetRes.text()
        return new Response(text, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      }
    }
  } catch (_) {}

  const md = `# ${skill.name} (v${skill.version})
> ${skill.summary}

## Installation
\`\`\`bash
${skill.installCli}
\`\`\`

## Capabilities
${skill.features.map((f) => `- ${f}`).join('\n')}

## Tags
${skill.tags.join(', ')}
`
  return new Response(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
})

// Direct download markdown attachment
skillsRoute.get('/:id/download-file', async (c) => {
  const id = c.req.param('id')
  const skill = SKILLS_CATALOG.find((s) => s.id === id)
  if (!skill) {
    return c.json({ success: false, error: 'Skill not found' }, 404)
  }

  // Record download in D1
  try {
    const dbService = new DatabaseService(c.env.DB)
    await dbService.recordSkillDownload(id, 'direct-browser', 'file_attachment')
  } catch (_) {}

  try {
    if (c.env.ASSETS) {
      const assetRes = await c.env.ASSETS.fetch(new URL(`/skills/${id}.md`, c.req.url))
      if (assetRes.ok) {
        const text = await assetRes.text()
        return new Response(text, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': `attachment; filename="${id}.md"`,
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    }
  } catch (_) {}

  const md = `# ${skill.name} (v${skill.version})\n\n> ${skill.summary}\n\n## Installation\n\`\`\`bash\n${skill.installCli}\n\`\`\`\n`
  return new Response(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${id}.md"`,
      'Access-Control-Allow-Origin': '*',
    },
  })
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

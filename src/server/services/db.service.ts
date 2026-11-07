import type { LeadEntityDTO, LeadSubmissionDTO } from '../dto/lead.dto'
import type { TelemetryEventDTO } from '../dto/analytics.dto'
import type { BlogPostDTO } from '../dto/blog.dto'

export class DatabaseService {
  constructor(private db: D1Database) {}

  async insertLead(lead: LeadSubmissionDTO, leadScore: number, ipCountry?: string): Promise<LeadEntityDTO> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const status = 'new'

    await this.db
      .prepare(
        `INSERT INTO leads (id, name, email, company, phone, service_interest, budget_range, timeline, message, lead_score, status, ip_country, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        lead.name,
        lead.email,
        lead.company || null,
        lead.phone || null,
        lead.serviceInterest,
        lead.budgetRange,
        lead.timeline,
        lead.message,
        leadScore,
        status,
        ipCountry || null,
        createdAt
      )
      .run()

    return {
      ...lead,
      id,
      leadScore,
      status,
      ipCountry,
      createdAt,
    }
  }

  async getLeads(limit = 50, offset = 0): Promise<LeadEntityDTO[]> {
    const safeLimit = Math.min(100, Math.max(1, limit))
    const { results } = await this.db
      .prepare(
        `SELECT id, name, email, company, phone, service_interest as serviceInterest,
                budget_range as budgetRange, timeline, message, lead_score as leadScore,
                status, ip_country as ipCountry, created_at as createdAt
         FROM leads
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(safeLimit, offset)
      .all<LeadEntityDTO>()

    return results || []
  }

  async recordTelemetry(event: TelemetryEventDTO): Promise<void> {
    const id = crypto.randomUUID()
    const metadataStr = JSON.stringify(event.metadata || {})

    await this.db
      .prepare(
        `INSERT INTO telemetry_events (id, visitor_hash, event_type, target_id, metadata, created_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(id, event.visitorHash, event.eventType, event.targetId || null, metadataStr)
      .run()
  }

  async recordSkillDownload(skillId: string, visitorHash: string, downloadType: string): Promise<void> {
    const id = crypto.randomUUID()
    await this.db
      .prepare(
        `INSERT INTO skill_downloads (id, skill_id, visitor_hash, download_type, created_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(id, skillId, visitorHash, downloadType)
      .run()
  }

  async upsertChatSession(sessionId: string, visitorHash: string, country?: string, city?: string, device?: string): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO chat_sessions (id, visitor_hash, country, city, device, message_count, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           message_count = message_count + 1,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(sessionId, visitorHash, country || null, city || null, device || null)
      .run()
  }

  async appendChatMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    const id = crypto.randomUUID()
    await this.db
      .prepare(
        `INSERT INTO chat_messages (id, session_id, role, content, created_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(id, sessionId, role, content)
      .run()
  }

  async getBlogPosts(limit = 20): Promise<BlogPostDTO[]> {
    const safeLimit = Math.min(50, Math.max(1, limit))
    const { results } = await this.db
      .prepare(
        `SELECT slug, title, summary, content_markdown as contentMarkdown,
                tags, published, view_count as viewCount, published_at as publishedAt
         FROM blog_posts
         WHERE published = 1
         ORDER BY published_at DESC
         LIMIT ?`
      )
      .bind(safeLimit)
      .all<any>()

    return (results || []).map((row) => ({
      ...row,
      published: Boolean(row.published),
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    }))
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const row = await this.db
      .prepare(
        `SELECT slug, title, summary, content_markdown as contentMarkdown,
                tags, published, view_count as viewCount, published_at as publishedAt
         FROM blog_posts
         WHERE slug = ?`
      )
      .bind(slug)
      .first<any>()

    if (!row) return null

    // Increment view count asynchronously
    await this.db.prepare(`UPDATE blog_posts SET view_count = view_count + 1 WHERE slug = ?`).bind(slug).run()

    return {
      ...row,
      published: Boolean(row.published),
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    }
  }

  async getMetricsSummary(): Promise<{ leadsCount: number; downloadsCount: number; sessionsCount: number }> {
    const leads = await this.db.prepare(`SELECT count(*) as total FROM leads`).first<{ total: number }>()
    const downloads = await this.db.prepare(`SELECT count(*) as total FROM skill_downloads`).first<{ total: number }>()
    const sessions = await this.db.prepare(`SELECT count(*) as total FROM chat_sessions`).first<{ total: number }>()

    return {
      leadsCount: leads?.total || 0,
      downloadsCount: downloads?.total || 0,
      sessionsCount: sessions?.total || 0,
    }
  }
}

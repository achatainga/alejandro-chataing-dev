import type { LeadEntityDTO, LeadSubmissionDTO } from '../dto/lead.dto'
import type { TelemetryEventDTO } from '../dto/analytics.dto'
import type { BlogPostDTO } from '../dto/blog.dto'
import type { VideoDTO, CreateVideoDTO, SocialLinkDTO } from '../dto/video.dto'
import { extractYouTubeId } from '../dto/video.dto'

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

  async upsertChatSession(
    sessionId: string,
    visitorHash: string,
    country?: string,
    city?: string,
    device?: string,
    ipHash?: string
  ): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO chat_sessions (id, visitor_hash, country, city, device, ip_hash, message_count, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           message_count = message_count + 1,
           ip_hash = COALESCE(excluded.ip_hash, chat_sessions.ip_hash),
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(sessionId, visitorHash, country || null, city || null, device || null, ipHash || null)
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

  private parseTags(rawTags: unknown): string[] {
    if (Array.isArray(rawTags)) return rawTags.map(String)
    if (typeof rawTags === 'string') {
      try {
        const parsed = JSON.parse(rawTags)
        if (Array.isArray(parsed)) return parsed.map(String)
      } catch (_) {
        return rawTags.split(',').map((t) => t.trim()).filter(Boolean)
      }
    }
    return []
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
      tags: this.parseTags(row.tags),
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
      tags: this.parseTags(row.tags),
    }
  }

  async getAllBlogPostsAdmin(): Promise<BlogPostDTO[]> {
    const { results } = await this.db
      .prepare(
        `SELECT slug, title, summary, content_markdown as contentMarkdown,
                tags, published, view_count as viewCount, published_at as publishedAt
         FROM blog_posts
         ORDER BY published_at DESC`
      )
      .all<any>()

    return (results || []).map((row) => ({
      ...row,
      published: Boolean(row.published),
      tags: this.parseTags(row.tags),
    }))
  }

  async insertBlogPost(post: Partial<BlogPostDTO>): Promise<BlogPostDTO> {
    const now = new Date().toISOString()
    const tagsJson = JSON.stringify(post.tags || [])
    const published = post.published ? 1 : 0

    await this.db
      .prepare(
        `INSERT INTO blog_posts (slug, title, summary, content_markdown, tags, published, view_count, published_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`
      )
      .bind(post.slug, post.title, post.summary, post.contentMarkdown, tagsJson, published, now)
      .run()

    return {
      slug: post.slug!,
      title: post.title!,
      summary: post.summary!,
      contentMarkdown: post.contentMarkdown!,
      tags: post.tags || [],
      published: Boolean(published),
      viewCount: 0,
      publishedAt: now,
    }
  }

  async updateBlogPost(slug: string, post: Partial<BlogPostDTO>): Promise<boolean> {
    const fields: string[] = []
    const bindings: any[] = []

    if (post.title !== undefined) {
      fields.push('title = ?')
      bindings.push(post.title)
    }
    if (post.summary !== undefined) {
      fields.push('summary = ?')
      bindings.push(post.summary)
    }
    if (post.contentMarkdown !== undefined) {
      fields.push('content_markdown = ?')
      bindings.push(post.contentMarkdown)
    }
    if (post.tags !== undefined) {
      fields.push('tags = ?')
      bindings.push(JSON.stringify(post.tags))
    }
    if (post.published !== undefined) {
      fields.push('published = ?')
      bindings.push(post.published ? 1 : 0)
    }

    if (fields.length === 0) return true

    bindings.push(slug)
    const res = await this.db
      .prepare(`UPDATE blog_posts SET ${fields.join(', ')} WHERE slug = ?`)
      .bind(...bindings)
      .run()

    return Boolean(res.meta.changes && res.meta.changes > 0)
  }

  async deleteBlogPost(slug: string): Promise<boolean> {
    const res = await this.db.prepare(`DELETE FROM blog_posts WHERE slug = ?`).bind(slug).run()
    return Boolean(res.meta.changes && res.meta.changes > 0)
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

  async getVideos(): Promise<VideoDTO[]> {
    const { results } = await this.db
      .prepare(
        `SELECT id, title, youtube_url as youtubeUrl, embed_id as embedId,
                description, category, featured, sort_order as sortOrder,
                created_at as createdAt
         FROM showcase_videos
         ORDER BY sort_order ASC, created_at DESC
         LIMIT 50`
      )
      .all<any>()

    return (results || []).map((r) => ({
      ...r,
      featured: Boolean(r.featured),
    }))
  }

  async insertVideo(video: CreateVideoDTO): Promise<VideoDTO> {
    const id = 'vid-' + crypto.randomUUID().slice(0, 8)
    const embedId = extractYouTubeId(video.youtubeUrl)
    const createdAt = new Date().toISOString()
    const featured = video.featured ?? true

    await this.db
      .prepare(
        `INSERT INTO showcase_videos (id, title, youtube_url, embed_id, description, category, featured, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`
      )
      .bind(id, video.title, video.youtubeUrl, embedId, video.description, video.category, featured ? 1 : 0, createdAt)
      .run()

    return {
      id,
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      embedId,
      description: video.description,
      category: video.category,
      featured,
      sortOrder: 0,
      createdAt,
    }
  }

  async deleteVideo(id: string): Promise<boolean> {
    const res = await this.db.prepare(`DELETE FROM showcase_videos WHERE id = ?`).bind(id).run()
    return Boolean(res.meta.changes && res.meta.changes > 0)
  }

  async getSocialLinks(): Promise<SocialLinkDTO[]> {
    const { results } = await this.db
      .prepare(
        `SELECT platform, url, label, icon, updated_at as updatedAt
         FROM social_links
         ORDER BY platform ASC`
      )
      .all<SocialLinkDTO>()

    return results || []
  }

  async updateSocialLink(platform: string, url: string, label: string): Promise<boolean> {
    const now = new Date().toISOString()
    await this.db
      .prepare(
        `INSERT INTO social_links (platform, url, label, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(platform) DO UPDATE SET url = excluded.url, label = excluded.label, updated_at = excluded.updated_at`
      )
      .bind(platform, url, label, now)
      .run()

    return true
  }
}

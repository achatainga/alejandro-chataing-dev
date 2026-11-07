interface BurstWindow {
  count: number
  resetAt: number
}

export class RateLimiterService {
  // In-memory sliding window for ultra-fast burst protection (per edge isolate)
  private static burstStore = new Map<string, BurstWindow>()

  private static readonly BURST_MAX = 5 // max 5 messages per 60s
  private static readonly BURST_WINDOW_MS = 60 * 1000 // 60s
  public static readonly SESSION_MAX = 15 // max 15 messages per session
  public static readonly DAILY_MAX = 35 // max 35 messages per day per visitor

  static checkBurst(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now()
    const record = this.burstStore.get(identifier)

    // Clean expired record
    if (!record || now > record.resetAt) {
      this.burstStore.set(identifier, { count: 1, resetAt: now + this.BURST_WINDOW_MS })
      return { allowed: true }
    }

    if (record.count >= this.BURST_MAX) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000)
      return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) }
    }

    record.count += 1
    return { allowed: true }
  }

  static async getSessionMessageCount(db: D1Database, sessionId: string): Promise<number> {
    try {
      const row = await db
        .prepare(`SELECT message_count FROM chat_sessions WHERE id = ?`)
        .bind(sessionId)
        .first<{ message_count: number }>()

      return row?.message_count || 0
    } catch {
      return 0
    }
  }

  static async getDailyVisitorCount(db: D1Database, visitorHash: string): Promise<number> {
    try {
      const row = await db
        .prepare(
          `SELECT COALESCE(SUM(message_count), 0) as total
           FROM chat_sessions
           WHERE visitor_hash = ? AND updated_at >= datetime('now', '-1 day')`
        )
        .bind(visitorHash)
        .first<{ total: number }>()

      return row?.total || 0
    } catch {
      return 0
    }
  }
}

interface BurstWindow {
  count: number
  resetAt: number
}

export class RateLimiterService {
  // In-memory sliding window for ultra-fast burst protection (per edge isolate)
  private static burstStore = new Map<string, BurstWindow>()

  public static readonly BURST_MAX = 6 // max 6 messages per 60s per IP
  private static readonly BURST_WINDOW_MS = 60 * 1000 // 60s
  public static readonly SESSION_MAX = 15 // max 15 messages per chat session
  public static readonly DAILY_VISITOR_MAX = 60 // max 60 messages per 24h per visitor
  public static readonly DAILY_IP_MAX = 60 // max 60 messages per 24h per IP address

  /**
   * Hashes a client IP using SHA-256 for privacy-preserving persistent rate-limiting.
   */
  static async hashIp(clientIp: string): Promise<string> {
    try {
      const data = new TextEncoder().encode(`chataing_edge_salt:${clientIp}`)
      const digest = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(digest))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
    } catch {
      return clientIp.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 32)
    }
  }

  /**
   * Fast edge-isolate burst rate limiter (stops rapid-fire script attacks)
   */
  static checkBurst(clientIp: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now()
    const record = this.burstStore.get(clientIp)

    if (!record || now > record.resetAt) {
      this.burstStore.set(clientIp, { count: 1, resetAt: now + this.BURST_WINDOW_MS })
      return { allowed: true }
    }

    if (record.count >= this.BURST_MAX) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000)
      return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) }
    }

    record.count += 1
    return { allowed: true }
  }

  /**
   * Checks current message count for a single session
   */
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

  /**
   * Checks daily message count across all sessions from a given IP hash
   */
  static async getDailyIpCount(db: D1Database, ipHash: string): Promise<number> {
    try {
      const row = await db
        .prepare(
          `SELECT COALESCE(SUM(message_count), 0) as total
           FROM chat_sessions
           WHERE ip_hash = ? AND updated_at >= datetime('now', '-1 day')`
        )
        .bind(ipHash)
        .first<{ total: number }>()

      return row?.total || 0
    } catch {
      return 0
    }
  }

  /**
   * Checks daily message count for a visitor hash
   */
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

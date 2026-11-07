export interface Env {
  DB: D1Database
  ASSETS: Fetcher
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
  EVOLUTION_API_URL?: string
  EVOLUTION_API_KEY?: string
  EVOLUTION_INSTANCE?: string
  NOTIFICATION_PHONE?: string
  ADMIN_EMAIL?: string
  ADMIN_SECRET?: string
  ENVIRONMENT?: string
}

export interface TelemetryEventDTO {
  visitorHash: string
  eventType: 'page_view' | 'skill_download' | 'cli_copy' | 'dwell_time' | 'cta_click' | 'chat_opened'
  targetId?: string
  metadata?: Record<string, unknown>
}

export function validateTelemetryEvent(body: unknown): { valid: boolean; error?: string; data?: TelemetryEventDTO } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Event payload must be a JSON object' }
  }

  const p = body as Partial<TelemetryEventDTO>

  if (!p.visitorHash || typeof p.visitorHash !== 'string') {
    return { valid: false, error: 'visitorHash is required' }
  }

  const validTypes: TelemetryEventDTO['eventType'][] = [
    'page_view',
    'skill_download',
    'cli_copy',
    'dwell_time',
    'cta_click',
    'chat_opened',
  ]

  if (!p.eventType || !validTypes.includes(p.eventType)) {
    return { valid: false, error: 'Invalid eventType' }
  }

  return {
    valid: true,
    data: {
      visitorHash: p.visitorHash.slice(0, 64),
      eventType: p.eventType,
      targetId: p.targetId ? String(p.targetId).slice(0, 100) : undefined,
      metadata: p.metadata && typeof p.metadata === 'object' ? p.metadata : {},
    },
  }
}

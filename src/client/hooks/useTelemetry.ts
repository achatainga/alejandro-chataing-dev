import { useEffect, useRef } from 'react'

function getOrCreateVisitorHash(): string {
  if (typeof window === 'undefined') return 'server'
  const key = 'alejandro_visitor_hash'
  let hash = localStorage.getItem(key)
  if (!hash) {
    hash = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    localStorage.setItem(key, hash)
  }
  return hash
}

export function useTelemetry() {
  const visitorHash = useRef<string>(getOrCreateVisitorHash())

  const trackEvent = (
    eventType: 'page_view' | 'skill_download' | 'cli_copy' | 'dwell_time' | 'cta_click' | 'chat_opened',
    targetId?: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorHash: visitorHash.current,
          eventType,
          targetId,
          metadata,
        }),
      }).catch(() => {})
    } catch (_) {}
  }

  useEffect(() => {
    trackEvent('page_view', window.location.pathname)

    const startTime = Date.now()
    const handleBeforeUnload = () => {
      const dwellSeconds = Math.round((Date.now() - startTime) / 1000)
      if (dwellSeconds > 5) {
        trackEvent('dwell_time', String(dwellSeconds))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return { visitorHash: visitorHash.current, trackEvent }
}

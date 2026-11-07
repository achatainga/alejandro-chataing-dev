export interface ChatMessageDTO {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequestDTO {
  sessionId?: string
  visitorHash: string
  messages: ChatMessageDTO[]
  language?: 'en' | 'es'
  _hp?: string // Honeypot field (must remain empty)
  adminSecret?: string
}

export interface ChatResponseDTO {
  sessionId: string
  reply: string
  leadDetected?: boolean
  suggestedAction?: 'open_hire_modal' | 'view_skills' | 'view_saas'
  remainingMessages?: number
  sessionLimitReached?: boolean
}

export interface ValidatedChatRequestDTO {
  sessionId: string
  visitorHash: string
  messages: ChatMessageDTO[]
  language: 'en' | 'es'
  adminSecret?: string
}

export function validateChatRequest(body: unknown): { valid: boolean; error?: string; data?: ValidatedChatRequestDTO } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' }
  }

  const payload = body as Partial<ChatRequestDTO>

  // 1. Honeypot verification (Automated scrapers fill this invisible input)
  if (payload._hp && typeof payload._hp === 'string' && payload._hp.trim().length > 0) {
    return { valid: false, error: 'Automated submission rejected' }
  }

  // 2. Visitor hash requirement
  if (!payload.visitorHash || typeof payload.visitorHash !== 'string' || payload.visitorHash.length < 5) {
    return { valid: false, error: 'Valid visitorHash string is required' }
  }

  // 3. Messages array verification
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' }
  }

  const lastMsg = payload.messages[payload.messages.length - 1]
  if (!lastMsg || typeof lastMsg.content !== 'string') {
    return { valid: false, error: 'Last message content is invalid' }
  }

  const trimmedContent = lastMsg.content.trim()

  // 4. Character bounds check (Min 3, Max 450 characters)
  if (trimmedContent.length < 3) {
    return { valid: false, error: 'Message is too short. Please provide a clear question (min 3 characters).' }
  }

  if (trimmedContent.length > 450) {
    return { valid: false, error: 'Message exceeds maximum allowed length of 450 characters' }
  }

  // 5. Anti-spam: Excessive character repetition (e.g., 'aaaaaaa', '.......')
  if (/(.)\1{6,}/.test(trimmedContent)) {
    return { valid: false, error: 'Message contains excessive character repetition. Please ask a coherent question.' }
  }

  // 6. Anti-loop: Prevent submitting exact duplicate prompt consecutively
  const userMessages = payload.messages.filter((m) => m && m.role === 'user')
  if (userMessages.length >= 2) {
    const prevUserMsg = userMessages[userMessages.length - 2]?.content?.trim()
    if (prevUserMsg && prevUserMsg.toLowerCase() === trimmedContent.toLowerCase()) {
      return { valid: false, error: 'Duplicate prompt detected. Please ask a different question or contact Alejandro directly.' }
    }
  }

  // 7. Sanitize and budget messages (keep last 6 for context window efficiency)
  const budgetedMessages = payload.messages
    .slice(-6)
    .map((m) => ({
      role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: String(m.content || '').slice(0, 450),
    }))

  return {
    valid: true,
    data: {
      sessionId: payload.sessionId || crypto.randomUUID(),
      visitorHash: payload.visitorHash.slice(0, 64),
      messages: budgetedMessages,
      language: payload.language === 'es' ? 'es' : 'en',
      adminSecret: typeof payload.adminSecret === 'string' ? payload.adminSecret : undefined,
    },
  }
}

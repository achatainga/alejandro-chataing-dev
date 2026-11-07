export interface ChatMessageDTO {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequestDTO {
  sessionId?: string
  visitorHash: string
  messages: ChatMessageDTO[]
  language?: 'en' | 'es'
}

export interface ChatResponseDTO {
  sessionId: string
  reply: string
  leadDetected?: boolean
  suggestedAction?: 'open_hire_modal' | 'view_skills' | 'view_saas'
}

export interface ValidatedChatRequestDTO {
  sessionId: string
  visitorHash: string
  messages: ChatMessageDTO[]
  language: 'en' | 'es'
}

export function validateChatRequest(body: unknown): { valid: boolean; error?: string; data?: ValidatedChatRequestDTO } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' }
  }

  const payload = body as Partial<ChatRequestDTO>

  if (!payload.visitorHash || typeof payload.visitorHash !== 'string') {
    return { valid: false, error: 'visitorHash string is required' }
  }

  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return { valid: false, error: 'messages array cannot be empty' }
  }

  const lastMsg = payload.messages[payload.messages.length - 1]
  if (!lastMsg || typeof lastMsg.content !== 'string' || lastMsg.content.trim().length === 0) {
    return { valid: false, error: 'Last message content is empty' }
  }

  if (lastMsg.content.length > 2000) {
    return { valid: false, error: 'Message content exceeds maximum allowed length of 2000 characters' }
  }

  return {
    valid: true,
    data: {
      sessionId: payload.sessionId || crypto.randomUUID(),
      visitorHash: payload.visitorHash,
      messages: payload.messages.slice(-10), // Keep last 10 messages for context budget
      language: payload.language === 'es' ? 'es' : 'en',
    },
  }
}

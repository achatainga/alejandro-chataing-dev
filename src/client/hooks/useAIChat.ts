import { useState, useCallback } from 'react'
import type { Language } from '../types/client.types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const DEFAULT_SESSION_BUDGET = 10
const COOLDOWN_MS = 2500

export function useAIChat(visitorHash: string, lang: Language, onTriggerHireModal?: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        lang === 'es'
          ? '¡Hola! Soy el Asistente de IA oficial de Alejandro Chataing. ¿Te gustaría conocer su experiencia con sistemas distribuidos, su herramienta mcp-code-context o coordinar una propuesta técnica?'
          : "Hello! I am Alejandro Chataing's official AI Assistant. Would you like to review his production systems, mcp-code-context, or discuss hiring him for your team?",
      timestamp: Date.now(),
    },
  ])
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('alejandro_chat_session_id')
      if (stored) return stored
      const newId = crypto.randomUUID()
      sessionStorage.setItem('alejandro_chat_session_id', newId)
      return newId
    }
    return crypto.randomUUID()
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingMessages, setRemainingMessages] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('alejandro_chat_remaining')
      return stored ? parseInt(stored, 10) : DEFAULT_SESSION_BUDGET
    }
    return DEFAULT_SESSION_BUDGET
  })
  const [sessionLimitReached, setSessionLimitReached] = useState(false)
  const [lastSentTime, setLastSentTime] = useState(0)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      if (trimmed.length < 3) {
        setError(
          lang === 'es'
            ? 'Por favor escribe una pregunta más específica (mínimo 3 caracteres).'
            : 'Please write a more specific question (minimum 3 characters).'
        )
        return
      }

      if (trimmed.length > 450) {
        setError(
          lang === 'es'
            ? 'El mensaje excede el límite de 450 caracteres. Por favor, sé conciso o contacta a Alejandro directamente.'
            : 'Message exceeds the 450-character limit. Please be concise or contact Alejandro directly.'
        )
        return
      }

      const now = Date.now()
      if (now - lastSentTime < COOLDOWN_MS) {
        const waitSec = Math.ceil((COOLDOWN_MS - (now - lastSentTime)) / 1000)
        setError(
          lang === 'es'
            ? `Por favor espera ${waitSec}s antes de enviar otro mensaje.`
            : `Please wait ${waitSec}s before sending another message.`
        )
        return
      }
      setLastSentTime(now)

      if (sessionLimitReached || remainingMessages <= 0) {
        setError(
          lang === 'es'
            ? 'Límite de 10 mensajes alcanzado. Para coordinar tu proyecto, contacta a Alejandro directamente.'
            : '10-message session limit reached. Please contact Alejandro directly for project inquiries.'
        )
        if (onTriggerHireModal) onTriggerHireModal()
        return
      }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: now,
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      setError(null)

      try {
        const payload = {
          sessionId,
          visitorHash,
          language: lang,
          _hp: '', // Honeypot trap (must remain empty)
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.status === 429) {
          const errData = await res.json().catch(() => null)
          const errMsg =
            errData?.error ||
            (lang === 'es'
              ? 'Has alcanzado el límite de velocidad. Por favor espera un momento.'
              : 'Rate limit reached. Please wait a moment.')

          const alertMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: errMsg,
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, alertMsg])
          setError(errMsg)
          setSessionLimitReached(true)
          if (errData?.suggestedAction === 'open_hire_modal' && onTriggerHireModal) {
            onTriggerHireModal()
          }
          return
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.error || `Server returned HTTP ${res.status}`)
        }

        const data: any = await res.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to get AI reply')
        }

        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('alejandro_chat_session_id', data.sessionId)
          }
        }

        if (typeof data.remainingMessages === 'number') {
          setRemainingMessages(data.remainingMessages)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('alejandro_chat_remaining', String(data.remainingMessages))
          }
        }

        if (data.sessionLimitReached) {
          setSessionLimitReached(true)
        }

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMsg])

        if (data.leadDetected && onTriggerHireModal) {
          onTriggerHireModal()
        }
      } catch (err: any) {
        setError(err?.message || 'Chat service is temporarily offline')
      } finally {
        setIsLoading(false)
      }
    },
    [visitorHash, lang, messages, isLoading, onTriggerHireModal, sessionId, lastSentTime, sessionLimitReached, remainingMessages]
  )

  const clearChat = () => {
    // If rate limit was reached on server, keep limit in place
    if (sessionLimitReached || remainingMessages <= 0) {
      if (onTriggerHireModal) onTriggerHireModal()
      return
    }

    const newId = crypto.randomUUID()
    setSessionId(newId)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('alejandro_chat_session_id', newId)
    }
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content:
          lang === 'es'
            ? 'Chat reiniciado. ¿En qué te puedo asesorar hoy?'
            : 'Chat reset. How can I assist you with Alejandro today?',
        timestamp: Date.now(),
      },
    ])
  }

  return { messages, isLoading, error, remainingMessages, sessionLimitReached, sendMessage, clearChat }
}

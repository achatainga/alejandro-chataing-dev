import { useState, useCallback } from 'react'
import type { Language } from '../types/client.types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function useAIChat(visitorHash: string, lang: Language, onTriggerHireModal?: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        lang === 'es'
          ? '¡Hola! Soy el Asistente de IA oficial de Alejandro Chataing. ¿Te gustaría saber sobre su experiencia en sistemas distribuidos, su servidor mcp-code-context o cómo puede colaborar contigo?'
          : "Hello! I am Alejandro Chataing's official AI Assistant. Would you like to know about his production experience, mcp-code-context, or how you can hire him for your project?",
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
  const [remainingMessages, setRemainingMessages] = useState<number>(15)
  const [sessionLimitReached, setSessionLimitReached] = useState(false)
  const [lastSentTime, setLastSentTime] = useState(0)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      if (trimmed.length > 600) {
        setError(
          lang === 'es'
            ? 'El mensaje excede el límite de 600 caracteres. Por favor, sé conciso o contacta a Alejandro directamente.'
            : 'Message exceeds the 600-character limit. Please be concise or contact Alejandro directly.'
        )
        return
      }

      const now = Date.now()
      if (now - lastSentTime < 2000) {
        setError(
          lang === 'es'
            ? 'Por favor espera unos segundos antes de enviar otro mensaje.'
            : 'Please wait a moment before sending another message.'
        )
        return
      }
      setLastSentTime(now)

      if (sessionLimitReached) {
        setError(
          lang === 'es'
            ? 'Límite de 15 mensajes alcanzado. Para coordinar tu proyecto, contacta a Alejandro directamente.'
            : '15-message session limit reached. Please contact Alejandro directly for project inquiries.'
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
          if (errData?.suggestedAction === 'open_hire_modal' && onTriggerHireModal) {
            onTriggerHireModal()
          }
          return
        }

        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}`)
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
    [visitorHash, lang, messages, isLoading, onTriggerHireModal, sessionId, lastSentTime, sessionLimitReached]
  )

  const clearChat = () => {
    const newId = crypto.randomUUID()
    setSessionId(newId)
    setRemainingMessages(15)
    setSessionLimitReached(false)
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

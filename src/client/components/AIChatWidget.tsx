import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, ChevronDown, RefreshCw } from 'lucide-react'
import type { Language } from '../types/client.types'
import { useAIChat } from '../hooks/useAIChat'

interface AIChatWidgetProps {
  lang: Language
  visitorHash: string
  onOpenHireModal: () => void
}

export function AIChatWidget({ lang, visitorHash, onOpenHireModal }: AIChatWidgetProps) {
  const isEs = lang === 'es'
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')

  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat(
    visitorHash,
    lang,
    onOpenHireModal
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const quickQuestions = isEs
    ? [
        '¿Cuáles son las tarifas y disponibilidad de Alejandro?',
        '¿Cómo funciona mcp-code-context y por qué ahorra 85% de tokens?',
        '¿En qué consiste el SaaS de Agente de IA por $100/mes?',
      ]
    : [
        "What are Alejandro's rates and contract availability?",
        'How does mcp-code-context save up to 85% context tokens?',
        'How does the $100/mo omnichannel AI Agent SaaS work?',
      ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendMessage(inputText)
    setInputText('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[92vw] sm:w-96 h-[500px] bg-cyber-surface border border-cyber-border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3"
          >
            {/* Header */}
            <div className="bg-cyber-card px-4 py-3 border-b border-cyber-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyber-primary/20 text-cyber-primary flex items-center justify-center font-bold text-xs border border-cyber-primary/30">
                  <Bot size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Alejandro AI Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
                  </div>
                  <div className="text-[10px] text-cyber-muted font-mono">Gemini Flash Lite • Edge</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear chat"
                  className="p-1.5 rounded-lg text-cyber-muted hover:text-white transition-colors"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-cyber-muted hover:text-white transition-colors"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-cyber-primary text-cyber-bg font-medium rounded-tr-none shadow-sm'
                        : 'bg-cyber-card text-cyber-text rounded-tl-none border border-cyber-border'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-cyber-card text-cyber-muted rounded-2xl rounded-tl-none px-3.5 py-2 border border-cyber-border text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary animate-ping" />
                    <span>{isEs ? 'Pensando...' : 'Formulating response...'}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-cyber-bg/50 border-t border-cyber-border/60 flex flex-col gap-1">
                <span className="text-[10px] text-cyber-muted font-mono uppercase tracking-wider">
                  {isEs ? 'Preguntas sugeridas:' : 'Suggested questions:'}
                </span>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="text-left text-[11px] text-cyber-primary hover:text-cyan-300 truncate transition-colors py-0.5"
                  >
                    • {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-cyber-card border-t border-cyber-border flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isEs ? 'Pregunta sobre Alejandro o contrátalo...' : 'Ask about Alejandro or his rates...'}
                className="flex-1 bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-xs text-cyber-text focus:outline-none focus:border-cyber-primary"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2 rounded-xl bg-cyber-primary text-cyber-bg disabled:opacity-50 hover:bg-cyan-300 transition-colors shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Pill */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyber-primary to-cyan-400 text-cyber-bg font-bold text-xs shadow-xl shadow-cyber-primary/30"
        >
          <Bot size={17} />
          <span>{isEs ? 'Hablar con Asistente IA' : 'Chat with AI Agent'}</span>
          <span className="w-2 h-2 rounded-full bg-cyber-bg animate-pulse" />
        </motion.button>
      )}
    </div>
  )
}

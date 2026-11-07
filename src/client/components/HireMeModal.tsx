import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { Language } from '../types/client.types'

interface HireMeModalProps {
  isOpen: boolean
  onClose: () => void
  lang: Language
  initialServiceInterest?: string
  initialBudget?: string
}

export function HireMeModal({ isOpen, onClose, lang, initialServiceInterest, initialBudget }: HireMeModalProps) {
  const isEs = lang === 'es'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceInterest: initialServiceInterest || 'hourly_contract',
    budgetRange: initialBudget || '$30 — $50 / hr',
    timeline: 'Within 2 weeks',
    message: '',
  })

  useEffect(() => {
    if (initialServiceInterest) {
      setFormData((prev) => ({
        ...prev,
        serviceInterest: initialServiceInterest,
        budgetRange: initialBudget || prev.budgetRange,
      }))
    }
  }, [initialServiceInterest, initialBudget])

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data: any = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSuccess(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (err: any) {
      setError(err?.message || 'Error sending inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const whatsappDirectUrl = `https://wa.me/584241668876?text=${encodeURIComponent(
    `Hello Alejandro, I just sent an inquiry from alejandro-chataing.dev. My name is ${formData.name || 'a visitor'} and I am interested in ${formData.serviceInterest}.`
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-cyber-surface border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-cyber-muted hover:text-white hover:bg-cyber-card transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-cyber-emerald/20 text-cyber-emerald mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isEs ? '¡Solicitud Recibida con Éxito!' : 'Inquiry Received Successfully!'}
            </h3>
            <p className="text-xs text-cyber-muted max-w-sm mx-auto mb-6">
              {isEs
                ? 'Alejandro ha recibido una alerta instantánea a su WhatsApp y te responderá en breve. Si deseas iniciar el chat inmediatamente, pulsa el botón abajo:'
                : "Alejandro received an instant notification on his phone. If you want to chat directly with him right now on WhatsApp, click below:"}
            </p>

            <div className="space-y-3">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-cyber-emerald text-cyber-bg font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle size={16} />
                <span>{isEs ? 'Abrir Chat en WhatsApp con Alejandro' : 'Chat on WhatsApp with Alejandro'}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-cyber-muted hover:text-white transition-colors"
              >
                {isEs ? 'Cerrar ventana' : 'Close window'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-primary uppercase tracking-wider mb-1">
                <Sparkles size={12} />
                <span>{isEs ? 'Propuesta & Contacto Directo' : 'Direct Booking & Consultation'}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isEs ? 'Trabaja con Alejandro Chataing' : 'Work with Alejandro Chataing'}
              </h2>
              <p className="text-xs text-cyber-muted mt-1">
                {isEs
                  ? 'Completa el formulario para recibir una propuesta en menos de 24h.'
                  : 'Submit your requirements to receive a response and proposal within 24 hours.'}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyber-muted mb-1">{isEs ? 'Nombre completo *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-cyber-text focus:outline-none focus:border-cyber-primary"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-cyber-muted mb-1">{isEs ? 'Email corporativo *' : 'Email Address *'}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-cyber-text focus:outline-none focus:border-cyber-primary"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyber-muted mb-1">{isEs ? 'Empresa / Proyecto' : 'Company / Project'}</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-cyber-text focus:outline-none focus:border-cyber-primary"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-cyber-muted mb-1">{isEs ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-cyber-text focus:outline-none focus:border-cyber-primary"
                    placeholder="+1 555-0192"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyber-muted mb-1">{isEs ? 'Tipo de Servicio' : 'Service Type'}</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value as any })}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-cyber-text focus:outline-none focus:border-cyber-primary"
                  >
                    <option value="hourly_contract">{isEs ? 'Contratación por Horas ($30–$60+/h)' : 'Hourly Contract ($30–$60+/hr)'}</option>
                    <option value="ai_saas">{isEs ? 'SaaS Agente de IA ($100/mes)' : 'AI Agent SaaS ($100/mo)'}</option>
                    <option value="custom_mcp">{isEs ? 'Arquitectura MCP a Medida' : 'Custom MCP Architecture'}</option>
                    <option value="staff_lead">{isEs ? 'Rol Staff / Tech Lead' : 'Staff / Tech Lead Role'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cyber-muted mb-1">{isEs ? 'Presupuesto Estimado' : 'Estimated Budget'}</label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-3 py-2 text-cyber-text focus:outline-none focus:border-cyber-primary"
                  >
                    <option value="$30 — $50 / hr">$30 — $50 / hr</option>
                    <option value="$50 — $80 / hr">$50 — $80 / hr</option>
                    <option value="$100 / month">$100 / month (SaaS Bot)</option>
                    <option value="$3k — $8k Project">$3,000 — $8,000 (Project)</option>
                    <option value="$8k — $15k+ Project">$8,000 — $15,000+ (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cyber-muted mb-1">{isEs ? 'Mensaje o Alcance *' : 'Message or Scope *'}</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isEs ? 'Describe brevemente qué necesitas construir o resolver...' : 'Briefly describe your objectives or system requirements...'}
                  className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-3 text-cyber-text focus:outline-none focus:border-cyber-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-cyber-primary text-cyber-bg font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyber-primary/20 disabled:opacity-50"
              >
                <Send size={14} />
                <span>{submitting ? (isEs ? 'Enviando...' : 'Submitting...') : (isEs ? 'Enviar Solicitud a Alejandro' : 'Submit Inquiry to Alejandro')}</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}

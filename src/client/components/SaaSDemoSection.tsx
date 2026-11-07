import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, CheckCheck, Send, Bot, Shield, Zap } from 'lucide-react'
import type { Language } from '../types/client.types'

interface SaaSDemoProps {
  lang: Language
  onOpenHireModal: (interest: string, budgetRange?: string) => void
}

export function SaaSDemoSection({ lang, onOpenHireModal }: SaaSDemoProps) {
  const isEs = lang === 'es'

  const demoScenarios = [
    {
      q: isEs ? '¿Tienen disponibilidad mañana para una consulta?' : 'Do you have availability tomorrow for a consultation?',
      a: isEs
        ? '¡Por supuesto! Tenemos dos turnos disponibles mañana: 10:30 AM y 3:00 PM. ¿Cuál se adapta mejor a tu agenda? Por favor indícame tu nombre y número de teléfono para confirmarla de inmediato.'
        : 'Absolutely! We have two slots available tomorrow: 10:30 AM and 3:00 PM. Which one works best for your schedule? Please provide your name and phone number to lock it in.',
    },
    {
      q: isEs ? '¿Cuánto cuesta el servicio y qué incluye?' : 'How much does the service cost and what is included?',
      a: isEs
        ? 'Nuestro paquete estándar es de $100/mes e incluye bot multicanal (WhatsApp + Web), integración con tu catálogo/servicios, captura automática de leads y notificaciones instantáneas a tu equipo.'
        : 'Our standard plan is $100/month and includes omnichannel deployment (WhatsApp + Web), custom catalog training, automated appointment booking, and real-time alerts to your team.',
    },
    {
      q: isEs ? 'Necesito hablar con un asesor humano por favor.' : 'I need to speak with a human advisor please.',
      a: isEs
        ? '¡Entendido! He pausado la automatización y notificado a Alejandro Chataing vía WhatsApp. En breves minutos un especialista se comunicará contigo directamente por este medio.'
        : 'Understood! I have paused automated replies and dispatched an alert to Alejandro Chataing. A human specialist will follow up with you on this thread in just a few minutes.',
    },
  ]

  const [activeScenario, setActiveScenario] = useState(0)

  return (
    <section id="saas" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Pitch */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/20 text-cyber-emerald text-xs font-mono uppercase tracking-wider mb-4">
              <Zap size={13} />
              <span>{isEs ? 'SaaS Llave en Mano — $100/mes' : 'Turnkey AI SaaS — $100/mo'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
              {isEs
                ? 'Automatiza las Ventas y Soporte de Tu Empresa con Agentes de IA'
                : 'Automate Your Company Sales & Support with Edge AI Agents'}
            </h2>

            <p className="text-cyber-muted text-sm sm:text-base leading-relaxed mb-8">
              {isEs
                ? 'Configuramos y desplegamos un agente de IA en la nube de Cloudflare para tu negocio en menos de 48 horas. Atiende a tus clientes en WhatsApp, Chat Web e Instagram, califica clientes potenciales y agenda citas automáticamente mientras duermes.'
                : 'We configure and deploy a dedicated Cloudflare Edge AI Agent for your business in under 48 hours. It handles inquiries on WhatsApp, Web, and Instagram, qualifies prospects, and books meetings while you sleep.'}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-emerald shrink-0">
                  <Smartphone size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {isEs ? 'Integración Oficial con WhatsApp' : 'Direct WhatsApp & Web Integration'}
                  </h4>
                  <p className="text-xs text-cyber-muted">
                    {isEs ? 'Conecta tu número actual sin perder chats ni historial.' : 'Connect your existing business number without losing chat history.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-primary shrink-0">
                  <Bot size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {isEs ? 'Entrenamiento con Tu Información' : 'Trained on Your Proprietary Docs'}
                  </h4>
                  <p className="text-xs text-cyber-muted">
                    {isEs ? 'Aprende tus precios, catálogo, políticas y disponibilidad en tiempo real.' : 'Learns your prices, service catalog, policies, and calendar availability.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-accent shrink-0">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {isEs ? 'Detección de Leads de Alto Valor' : 'High-Value Lead Escalation'}
                  </h4>
                  <p className="text-xs text-cyber-muted">
                    {isEs ? 'Te envía un WhatsApp instantáneo cuando un cliente está listo para comprar.' : 'Dispatches instant WhatsApp alerts when a qualified buyer arrives.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenHireModal('ai_saas', '$100/mo')}
              className="px-6 py-3.5 rounded-xl bg-cyber-emerald text-cyber-bg font-bold text-xs shadow-lg shadow-cyber-emerald/25 hover:bg-emerald-300 transition-all transform hover:-translate-y-0.5"
            >
              {isEs ? 'Suscribirme por $100/mes' : 'Deploy My Business Agent ($100/mo)'}
            </button>
          </div>

          {/* Right Column: Live Phone Mockup Demo */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm rounded-[32px] p-3 bg-gradient-to-b from-cyber-border to-cyber-surface border-4 border-cyber-border shadow-2xl relative">
              {/* Phone screen */}
              <div className="rounded-[24px] bg-[#0d141f] border border-cyber-border/70 overflow-hidden flex flex-col h-[480px]">
                {/* Header */}
                <div className="bg-[#17202e] px-4 py-3 flex items-center gap-3 border-b border-cyber-border/70">
                  <div className="w-8 h-8 rounded-full bg-cyber-emerald/20 text-cyber-emerald flex items-center justify-center font-bold text-xs">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">AI Business Agent</div>
                    <div className="text-[10px] text-cyber-emerald flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
                      <span>Online • Cloudflare Edge</span>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto font-sans text-xs">
                  {/* Scenario Trigger Buttons */}
                  <div className="space-y-1.5 mb-2">
                    <div className="text-[10px] uppercase font-mono text-cyber-muted tracking-wider">
                      {isEs ? 'Probar Preguntas Típicas:' : 'Test Common Questions:'}
                    </div>
                    {demoScenarios.map((sc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveScenario(i)}
                        className={`w-full text-left p-1.5 rounded text-[11px] border transition-colors ${
                          activeScenario === i
                            ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary font-medium'
                            : 'bg-cyber-card/60 border-cyber-border text-cyber-muted hover:text-white'
                        }`}
                      >
                        {sc.q}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScenario}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 pt-2"
                    >
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-cyber-primary/20 text-cyber-text rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[85%] border border-cyber-primary/30">
                          {demoScenarios[activeScenario].q}
                          <div className="text-[9px] text-cyber-muted text-right mt-1 flex items-center justify-end gap-1">
                            <span>10:42 AM</span>
                            <CheckCheck size={11} className="text-cyber-primary" />
                          </div>
                        </div>
                      </div>

                      {/* Bot response */}
                      <div className="flex justify-start">
                        <div className="bg-[#1c2738] text-cyber-text rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[90%] border border-cyber-border">
                          {demoScenarios[activeScenario].a}
                          <div className="text-[9px] text-cyber-muted mt-1">10:42 AM</div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer mock input */}
                <div className="p-3 bg-[#17202e] border-t border-cyber-border/70 flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    value={isEs ? 'Agente activo 24/7...' : 'Agent active 24/7...'}
                    className="flex-1 bg-cyber-bg border border-cyber-border/60 rounded-full px-3 py-1.5 text-xs text-cyber-muted cursor-not-allowed"
                  />
                  <div className="w-8 h-8 rounded-full bg-cyber-emerald text-cyber-bg flex items-center justify-center">
                    <Send size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

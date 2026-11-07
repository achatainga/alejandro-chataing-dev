import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Sparkles, Clock, Bot, Cpu } from 'lucide-react'
import type { Language } from '../types/client.types'
import { SERVICES_DATA_EN, SERVICES_DATA_ES } from '../data/services.data'

interface ServicesCardsProps {
  lang: Language
  onOpenHireModal: (interest: string, budgetRange?: string) => void
}

export function ServicesCards({ lang, onOpenHireModal }: ServicesCardsProps) {
  const isEs = lang === 'es'
  const services = isEs ? SERVICES_DATA_ES : SERVICES_DATA_EN

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'hourly-contracting':
        return <Clock className="w-6 h-6 text-cyber-primary" />
      case 'ai-saas-agent':
        return <Bot className="w-6 h-6 text-cyber-emerald" />
      case 'custom-mcp-architecture':
        return <Cpu className="w-6 h-6 text-cyber-accent" />
      default:
        return <Sparkles className="w-6 h-6 text-cyber-primary" />
    }
  }

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs font-mono uppercase tracking-wider mb-4">
            {isEs ? 'Modelos de Colaboración' : 'Commercial Offerings'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            {isEs ? 'Servicios de Alto Impacto para Tu Empresa' : 'High-Impact Engineering for Your Company'}
          </h2>
          <p className="text-cyber-muted text-sm sm:text-base">
            {isEs
              ? 'Ya sea que necesites capacidad senior de desarrollo por horas, un bot de IA llave en mano para tu negocio, o arquitectura MCP a medida.'
              : 'Whether you require senior contracting velocity, a turnkey $100/mo AI business agent, or custom enterprise MCP architecture.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isFeatured = service.id === 'ai-saas-agent'

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 p-7 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-cyber-surface via-cyber-card to-cyber-surface border-2 border-cyber-primary/50 shadow-xl shadow-cyber-primary/10 -translate-y-2'
                    : 'bg-cyber-card border border-cyber-border hover:border-cyber-primary/30'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-cyber-bg border border-cyber-border">
                    {getServiceIcon(service.id)}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                      isFeatured
                        ? 'bg-cyber-primary text-cyber-bg'
                        : 'bg-cyber-surface text-cyber-muted border border-cyber-border'
                    }`}
                  >
                    {service.badge}
                  </span>
                </div>

                {/* Title & Price */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-xs text-cyber-muted mb-4">{service.subtitle}</p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-cyber-border/70">
                    <span className="font-mono text-3xl font-extrabold text-white">{service.price}</span>
                    {service.period && (
                      <span className="text-xs font-mono text-cyber-muted">{service.period}</span>
                    )}
                  </div>

                  <p className="text-xs text-cyber-muted leading-relaxed mb-6">{service.description}</p>

                  {/* Highlights checklist */}
                  <ul className="space-y-2.5 mb-8">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-cyber-text">
                        <CheckCircle2 size={14} className="text-cyber-emerald shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => onOpenHireModal(service.serviceInterest, service.price)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
                    isFeatured
                      ? 'bg-cyber-primary text-cyber-bg shadow-md shadow-cyber-primary/30 hover:bg-cyan-300'
                      : 'bg-cyber-surface text-cyber-text hover:bg-cyber-primary hover:text-cyber-bg border border-cyber-border'
                  }`}
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

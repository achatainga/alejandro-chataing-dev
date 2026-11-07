import { motion } from 'framer-motion'
import { ArrowRight, DownloadCloud } from 'lucide-react'
import type { Language } from '../types/client.types'

interface HeroProps {
  lang: Language
  onOpenHireModal: (interest?: string) => void
}

export function Hero({ lang, onOpenHireModal }: HeroProps) {
  const isEs = lang === 'es'

  const techBadges = [
    'Cloudflare Workers & D1',
    'Tree-sitter WASM AST',
    'React 19 & Vite',
    'PHP 8.3 Zero-Framework',
    'Laravel REST',
    'Flutter & Mobile Sync',
    'Multi-Agent SRE',
  ]

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyber-primary/15 via-cyber-accent/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-surface border border-cyber-border text-xs text-cyber-muted mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
            <span className="font-medium text-cyber-text">
              {isEs ? 'Disponible para Contratos y Asesoría Técnica' : 'Available for Contracts & Staff Architecture'}
            </span>
            <span className="text-cyber-border">•</span>
            <span className="font-mono text-cyber-primary">{isEs ? '$30 — $60+/h' : '$30 — $60+/hr'}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6"
          >
            {isEs ? (
              <>
                Sistemas de Alta Concurrencia, <span className="bg-gradient-to-r from-cyber-primary via-cyan-300 to-cyber-accent bg-clip-text text-transparent">Cirugía AST</span> & Agentes de IA
              </>
            ) : (
              <>
                Architecting High-Concurrency Systems, <span className="bg-gradient-to-r from-cyber-primary via-cyan-300 to-cyber-accent bg-clip-text text-transparent">Surgical AST</span> & Edge AI
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-cyber-muted leading-relaxed max-w-2xl mx-auto mb-8"
          >
            {isEs
              ? 'Senior Full-Stack Engineer con 10+ años en producción. Autor de mcp-code-context (v7.0.0 Enterprise AST en NPM) y 12 skills para agentes. Experto en Cloudflare Edge, PHP 8.3 Zero-Framework, React 19 y SaaS de IA multicanal.'
              : 'Senior Full-Stack Engineer with 10+ years building production platforms. Author of mcp-code-context (v7.0.0 Enterprise Polyglot AST) and 12 published agent skills. Specialist in Cloudflare Edge, Pure PHP 8.3 zero-framework, React 19, and turnkey AI SaaS.'}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button
              type="button"
              onClick={() => onOpenHireModal('hourly_contract')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyan-400 text-cyber-bg font-bold text-sm shadow-lg shadow-cyber-primary/25 hover:shadow-cyber-primary/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>{isEs ? 'Contratar a Alejandro' : 'Hire Alejandro for Your Team'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#skills"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-primary/50 text-cyber-text font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-cyber-surface"
            >
              <DownloadCloud size={16} className="text-cyber-accent" />
              <span>{isEs ? 'Descargar Skills & MCP' : 'Explore Skills & MCP Hub'}</span>
            </a>
          </motion.div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-cyber-card/60 border border-cyber-border/80 backdrop-blur-sm max-w-3xl mx-auto mb-10"
          >
            <div className="p-3 text-center border-r border-cyber-border/40 last:border-none">
              <div className="font-mono text-2xl font-bold text-cyber-primary">10+</div>
              <div className="text-xs text-cyber-muted">{isEs ? 'Años en Producción' : 'Years Production'}</div>
            </div>
            <div className="p-3 text-center border-r border-cyber-border/40 last:border-none">
              <div className="font-mono text-2xl font-bold text-cyber-accent">v7.0.0</div>
              <div className="text-xs text-cyber-muted">{isEs ? 'Autor MCP Polyglot' : 'MCP Polyglot Author'}</div>
            </div>
            <div className="p-3 text-center border-r border-cyber-border/40 last:border-none">
              <div className="font-mono text-2xl font-bold text-cyber-emerald">12</div>
              <div className="text-xs text-cyber-muted">{isEs ? 'Skills de Agentes' : 'Published Skills'}</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-mono text-2xl font-bold text-white">C2</div>
              <div className="text-xs text-cyber-muted">{isEs ? 'Inglés Bilingüe' : 'Bilingual English'}</div>
            </div>
          </motion.div>

          {/* Tech badges carousel */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {techBadges.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono text-cyber-muted bg-cyber-surface/70 border border-cyber-border/50"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

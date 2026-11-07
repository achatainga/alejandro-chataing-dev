import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, DownloadCloud, FileText, Youtube, Github, Linkedin } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { Language } from '../types/client.types'

interface HeroProps {
  lang: Language
  onOpenHireModal: (interest?: string) => void
  onOpenCVModal?: () => void
  onOpenAdmin?: () => void
}

export function Hero({ lang, onOpenHireModal, onOpenCVModal, onOpenAdmin }: HeroProps) {
  const isEs = lang === 'es'
  const [clickCount, setClickCount] = useState(0)

  const handleAvatarClick = () => {
    const next = clickCount + 1
    setClickCount(next)
    if (next >= 3) {
      setClickCount(0)
      onOpenAdmin?.()
    }
  }

  const handleDownloadCV = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#00d4ff', '#7c3aed', '#10b981'],
      })
    } catch {
      // ignore
    }
    if (onOpenCVModal) {
      onOpenCVModal()
    } else {
      window.print()
    }
  }

  const techBadges = [
    'Cloudflare Workers & D1',
    'Tree-sitter WASM AST',
    'React 19 & Vite',
    'PHP 8.3 Zero-Framework',
    'Laravel Enterprise APIs',
    'Flutter & Mobile Sync',
    'Multi-Agent SRE Pipelines',
  ]

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-cyber-primary/15 via-cyber-accent/10 to-transparent blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar with cyber aura */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block mb-5 cursor-pointer group"
            onClick={handleAvatarClick}
            title={isEs ? 'Alejandro Chataing Avila (Clic para abrir Portal Admin)' : 'Alejandro Chataing Avila (Click 3x for Admin Portal)'}
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyber-primary via-cyan-400 to-cyber-accent blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-cyber-bg border-2 border-cyber-primary/60 shadow-2xl overflow-hidden group-hover:border-cyber-primary transition-colors">
              <img
                src="/AlejandroChataing.png"
                alt="Alejandro Chataing"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div
              className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-cyber-emerald border-2 border-cyber-bg shadow-sm animate-pulse"
              title="Online & Available"
            />
          </motion.div>

          {/* Status pill */}
          <div>
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
          </div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-5"
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
            className="text-base sm:text-lg text-cyber-muted leading-relaxed max-w-2xl mx-auto mb-7"
          >
            {isEs
              ? 'Senior Full-Stack Engineer con 10+ años en producción. Autor de mcp-code-context (Enterprise Polyglot AST en NPM) y 12 skills de agentes. Experto en Cloudflare Edge, PHP 8.3 Zero-Framework, React 19 y SaaS de IA multicanal.'
              : 'Senior Full-Stack Engineer with 10+ years building production platforms. Author of mcp-code-context (Enterprise Polyglot AST on NPM) and 12 published agent skills. Specialist in Cloudflare Edge, Pure PHP 8.3 zero-framework, React 19, and turnkey AI SaaS.'}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 mb-10"
          >
            <button
              type="button"
              onClick={() => onOpenHireModal('hourly_contract')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyan-400 text-cyber-bg font-bold text-sm shadow-lg shadow-cyber-primary/25 hover:shadow-cyber-primary/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>{isEs ? 'Contratar a Alejandro' : 'Hire Alejandro for Your Team'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleDownloadCV}
              className="px-5 py-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-primary/60 text-cyber-text font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-cyber-surface hover:text-white"
            >
              <FileText size={16} className="text-cyber-primary" />
              <span>{isEs ? 'Descargar CV (PDF)' : 'Download Resume (PDF)'}</span>
            </button>

            <a
              href="#skills"
              className="px-5 py-3.5 rounded-xl bg-cyber-surface/60 border border-cyber-border text-cyber-muted hover:text-cyber-text font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:border-cyber-border"
            >
              <DownloadCloud size={16} className="text-cyber-accent" />
              <span>{isEs ? 'Skills & MCP Hub' : 'Skills & MCP Hub'}</span>
            </a>
          </motion.div>

          {/* Social icons strip */}
          <div className="flex items-center justify-center gap-4 mb-8 text-cyber-muted">
            <a
              href="https://www.linkedin.com/in/alejandro-chataing-81798a106/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:text-cyber-primary hover:border-cyber-primary/50 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://github.com/achatainga"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:text-white hover:border-cyber-primary/50 transition-colors"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://youtube.com/@alejandrochataing"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:text-red-400 hover:border-red-500/50 transition-colors"
              title="YouTube"
            >
              <Youtube size={16} />
            </a>
          </div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-cyber-card/60 border border-cyber-border/80 backdrop-blur-sm max-w-3xl mx-auto mb-9"
          >
            <div className="p-3 text-center border-r border-cyber-border/40 last:border-none">
              <div className="font-mono text-2xl font-bold text-cyber-primary">10+</div>
              <div className="text-xs text-cyber-muted">{isEs ? 'Años en Producción' : 'Years Production'}</div>
            </div>
            <div className="p-3 text-center border-r border-cyber-border/40 last:border-none">
              <div className="font-mono text-2xl font-bold text-cyber-accent">53</div>
              <div className="text-xs text-cyber-muted">{isEs ? 'Herramientas AST' : 'Polyglot AST Tools'}</div>
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

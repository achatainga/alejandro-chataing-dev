import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Menu, X, Sparkles, Send } from 'lucide-react'
import type { Language } from '../types/client.types'

interface NavbarProps {
  lang: Language
  onToggleLang: () => void
  onOpenHireModal: (interest?: string) => void
  onOpenCVModal: () => void
}

export function Navbar({ lang, onToggleLang, onOpenHireModal, onOpenCVModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#services', label: lang === 'es' ? 'Servicios' : 'Services' },
    { href: '#skills', label: lang === 'es' ? 'Skills & MCP' : 'Skills Hub' },
    { href: '#saas', label: lang === 'es' ? 'SaaS Agente' : 'SaaS Demo' },
    { href: '#projects', label: lang === 'es' ? 'Proyectos' : 'Projects' },
    { href: '#blog', label: lang === 'es' ? 'Blog' : 'Blog' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-border/70 py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-primary to-cyber-accent p-0.5 shadow-md shadow-cyber-primary/20 group-hover:shadow-cyber-primary/40 transition-all">
            <div className="w-full h-full bg-cyber-bg rounded-[10px] flex items-center justify-center font-mono font-bold text-cyber-primary text-sm tracking-wider">
              AC
            </div>
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-cyber-text group-hover:text-cyber-primary transition-colors">
              Alejandro Chataing
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cyber-muted">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
              <span>{lang === 'es' ? 'Disponible para Contratos' : 'Available for Contracts'}</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-cyber-muted hover:text-cyber-primary transition-colors py-1"
            >
              {link.label}
            </a>
          ))}

          <button
            type="button"
            onClick={onOpenCVModal}
            className="text-xs font-medium text-cyber-accent hover:text-white transition-colors py-1 border-b border-cyber-accent/30"
          >
            {lang === 'es' ? 'Ver CV / Resume' : 'View CV / Resume'}
          </button>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label="Switch language"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyber-border text-xs text-cyber-muted hover:text-cyber-text hover:border-cyber-primary/40 transition-colors"
          >
            <Globe size={13} className="text-cyber-primary" />
            <span className="font-mono font-semibold uppercase">{lang}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenHireModal()}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-primary text-cyber-bg font-semibold text-xs shadow-md shadow-cyber-primary/25 hover:bg-cyan-300 transition-all transform hover:-translate-y-0.5"
          >
            <Send size={13} />
            <span>{lang === 'es' ? 'Contratar a Alejandro' : 'Hire Alejandro'}</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="p-2 text-cyber-muted hover:text-cyber-text rounded-lg border border-cyber-border text-xs"
          >
            <span className="font-mono font-semibold uppercase">{lang}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-cyber-muted hover:text-cyber-text"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-surface border-b border-cyber-border px-6 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-cyber-muted hover:text-cyber-primary py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-cyber-border flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  onOpenCVModal()
                }}
                className="w-full text-center py-2 text-xs font-semibold text-cyber-accent border border-cyber-accent/30 rounded-lg"
              >
                {lang === 'es' ? 'Ver CV / Resume' : 'View CV / Resume'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  onOpenHireModal()
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyber-primary text-cyber-bg font-semibold text-xs shadow-md"
              >
                <Sparkles size={14} />
                <span>{lang === 'es' ? 'Contratar a Alejandro' : 'Hire Alejandro'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

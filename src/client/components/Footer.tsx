import { Github, Linkedin, Package, Shield, Send } from 'lucide-react'
import type { Language } from '../types/client.types'

interface FooterProps {
  lang: Language
  onOpenAdmin: () => void
  onOpenHireModal: () => void
}

export function Footer({ lang, onOpenAdmin, onOpenHireModal }: FooterProps) {
  const isEs = lang === 'es'

  return (
    <footer className="border-t border-cyber-border/70 bg-cyber-bg/90 py-12 relative text-cyber-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-bold text-white text-sm tracking-tight mb-1">
            Alejandro Chataing Avila
          </div>
          <p className="text-[11px] text-cyber-muted max-w-sm mb-3">
            {isEs
              ? 'Sistemas de alta concurrencia, cirugía AST y agentes de IA en el edge.'
              : 'High-concurrency systems, AST surgery, and edge AI agents.'}
          </p>
          <button
            type="button"
            onClick={onOpenHireModal}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyber-primary hover:underline"
          >
            <Send size={12} />
            <span>{isEs ? 'Iniciar consulta / contratación' : 'Request consultation / hire'}</span>
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/achatainga"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-primary hover:text-white transition-colors"
            title="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/alejandro-chataing-81798a106/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-primary hover:text-white transition-colors"
            title="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://www.npmjs.com/package/mcp-code-context"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-primary hover:text-white transition-colors"
            title="NPM Package"
          >
            <Package size={16} />
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-primary hover:text-white transition-colors"
            title="Admin Console"
          >
            <Shield size={16} />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-[11px]">
          <div>
            © {new Date().getFullYear()} Alejandro Chataing • Hosted on Cloudflare Edge
          </div>
          <div className="text-cyber-muted/60 mt-0.5">
            {isEs ? 'Hecho para la excelencia' : 'Engineered for Excellence'}
          </div>
        </div>
      </div>
    </footer>
  )
}

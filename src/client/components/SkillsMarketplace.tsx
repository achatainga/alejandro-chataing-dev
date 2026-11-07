import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Check, ExternalLink, Sparkles } from 'lucide-react'
import type { Language } from '../types/client.types'
import { SKILLS_CATALOG, type SkillItem } from '../../server/services/skills.data'

interface SkillsMarketplaceProps {
  lang: Language
  onSelectSkillForModal?: (skill: SkillItem) => void
}

export function SkillsMarketplace({ lang }: SkillsMarketplaceProps) {
  const isEs = lang === 'es'
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: isEs ? 'Todas las Herramientas (12)' : 'All Tools (12)' },
    { id: 'mcp', label: isEs ? 'Herramientas MCP' : 'MCP Tools' },
    { id: 'sre-verification', label: isEs ? 'Seguridad y Estabilidad' : 'Security & Stability' },
    { id: 'coding-standards', label: isEs ? 'Calidad de Código' : 'Code Quality' },
  ]

  const filteredSkills = selectedCategory === 'all'
    ? SKILLS_CATALOG
    : SKILLS_CATALOG.filter((s) => s.category === selectedCategory)

  const handleCopyCli = (skill: SkillItem) => {
    navigator.clipboard.writeText(skill.installCli)
    setCopiedId(skill.id)
    setTimeout(() => setCopiedId(null), 2000)

    // Track download / copy event in backend
    fetch(`/api/skills/${skill.id}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ downloadType: 'npm_cli' }),
    }).catch(() => {})
  }

  const handleCopyPrompt = async (skill: SkillItem) => {
    try {
      const res = await fetch(`/api/skills/${skill.id}/raw`)
      const text = await res.text()
      navigator.clipboard.writeText(text)
      setCopiedPromptId(skill.id)
      setTimeout(() => setCopiedPromptId(null), 2500)

      fetch(`/api/skills/${skill.id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadType: 'copy_prompt' }),
      }).catch(() => {})
    } catch (_) {}
  }

  return (
    <section id="skills" className="py-20 relative bg-cyber-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-accent/10 border border-cyber-accent/20 text-cyber-accent text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles size={12} />
            <span>{isEs ? 'Herramientas de Código Abierto' : 'Open-Source AI Tools'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            {isEs ? 'Herramientas y Skills Gratuitas para Desarrolladores' : 'Free Developer Tools & Agent Skills'}
          </h2>
          <p className="text-cyber-muted text-sm sm:text-base">
            {isEs
              ? 'Librerías y comandos que he creado para ayudar a la IA (en Cursor, Claude o Antigravity) a entender proyectos grandes, cometer menos errores y ahorrar tokens.'
              : 'Open-source packages and workflow skills built by Alejandro to help AI assistants (in Cursor, Claude, or Antigravity) understand large codebases and save up to 85% in context tokens.'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyber-primary text-cyber-bg font-semibold shadow-md shadow-cyber-primary/20'
                  : 'bg-cyber-card text-cyber-muted hover:text-white border border-cyber-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const isCopied = copiedId === skill.id
            const isHighlight = skill.highlight

            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  isHighlight
                    ? 'bg-gradient-to-br from-cyber-card via-cyber-surface to-cyber-card border-2 border-cyber-primary/60 shadow-xl shadow-cyber-primary/10'
                    : 'bg-cyber-card border border-cyber-border hover:border-cyber-primary/40'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] font-bold text-cyber-primary px-2 py-0.5 rounded bg-cyber-primary/10 border border-cyber-primary/20">
                      {skill.version}
                    </span>
                    <span className="text-[11px] font-semibold text-cyber-accent px-2 py-0.5 rounded bg-cyber-accent/10 border border-cyber-accent/20">
                      {skill.badge}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span>{skill.name}</span>
                    {skill.npmUrl && (
                      <a
                        href={skill.npmUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyber-muted hover:text-cyber-primary"
                        aria-label="View on NPM"
                        title="Ver en NPM"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {skill.agensiUrl && !skill.npmUrl && (
                      <a
                        href={skill.agensiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyber-muted hover:text-cyber-accent"
                        aria-label="View on Agensi.io"
                        title="Ver en Agensi.io"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </h3>
                  <p className="text-xs text-cyber-muted leading-relaxed mb-4">{skill.summary}</p>

                  {/* Feature Bullets */}
                  <div className="space-y-1.5 mb-5">
                    {skill.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-cyber-text">
                        <span className="text-cyber-primary font-mono">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-cyber-border/70">
                  {/* Copy CLI Box */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-cyber-bg border border-cyber-border mb-3 font-mono text-xs">
                    <span className="truncate text-cyber-text text-[11px]">{skill.installCli}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCli(skill)}
                      className="p-1 rounded hover:bg-cyber-surface text-cyber-primary transition-colors shrink-0"
                      title="Copy install command"
                    >
                      {isCopied ? <Check size={14} className="text-cyber-emerald" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-cyber-muted pt-1">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/api/skills/${skill.id}/download-file`}
                        download={`${skill.id}.md`}
                        className="hover:text-cyber-primary transition-colors flex items-center gap-1 font-medium"
                        title="Download .md file"
                      >
                        <Download size={12} className="text-cyber-primary" />
                        <span>{isEs ? 'Descargar .md' : 'Download .md'}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(skill)}
                        className="hover:text-cyber-accent transition-colors flex items-center gap-1 font-medium"
                        title="Copy complete SKILL.md to clipboard"
                      >
                        {copiedPromptId === skill.id ? (
                          <>
                            <Check size={12} className="text-cyber-emerald" />
                            <span className="text-cyber-emerald">{isEs ? '¡Copiado!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>{isEs ? 'Copiar Prompt' : 'Copy Prompt'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="font-mono text-[10px] text-cyber-muted">
                      {skill.downloads.toLocaleString()} {isEs ? 'usos' : 'installs'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

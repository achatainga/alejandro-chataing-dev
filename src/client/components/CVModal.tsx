import { motion } from 'framer-motion'
import { X, Printer, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'
import type { Language } from '../types/client.types'
import { cvEnglish } from '../data/cv.en'
import { cvSpanish } from '../data/cv.es'

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
  lang: Language
}

export function CVModal({ isOpen, onClose, lang }: CVModalProps) {
  if (!isOpen) return null

  const isEs = lang === 'es'
  const cv = isEs ? cvSpanish : cvEnglish

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[92vh] bg-cyber-bg border border-cyber-border rounded-2xl p-6 sm:p-10 overflow-y-auto shadow-2xl relative text-cyber-text"
      >
        {/* Actions bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-cyber-border no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyber-card border border-cyber-border text-xs font-semibold hover:border-cyber-primary transition-colors flex items-center gap-1.5"
            >
              <Printer size={14} className="text-cyber-primary" />
              <span>{isEs ? 'Imprimir / Guardar PDF' : 'Print / Save PDF'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-cyber-muted hover:text-white hover:bg-cyber-card transition-colors"
            aria-label="Close CV modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Resume Content */}
        <div id="cv-print-area" className="space-y-8 font-sans">
          {/* Header */}
          <div className="border-b border-cyber-border/70 pb-6">
            <h1 className="text-3xl font-extrabold text-white mb-1">{cv.name}</h1>
            <h2 className="text-base font-semibold text-cyber-primary mb-3">{cv.title}</h2>

            <div className="flex flex-wrap gap-4 text-xs text-cyber-muted">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-cyber-accent" />
                {cv.location}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={13} className="text-cyber-accent" />
                {cv.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={13} className="text-cyber-accent" />
                {cv.phone}
              </span>
              <a
                href={`https://github.com/${cv.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-cyber-primary"
              >
                <Github size={13} />
                github.com/{cv.github}
              </a>
              <a
                href={`https://linkedin.com/in/${cv.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-cyber-primary"
              >
                <Linkedin size={13} />
                linkedin.com/in/{cv.linkedin}
              </a>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-primary mb-2">
              {isEs ? 'Resumen Profesional' : 'Executive Summary'}
            </h3>
            <p className="text-xs sm:text-sm text-cyber-text leading-relaxed">{cv.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-primary mb-4">
              {isEs ? 'Experiencia Profesional' : 'Work Experience'}
            </h3>
            <div className="space-y-6">
              {cv.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l border-cyber-border">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                    <span className="font-mono text-[11px] text-cyber-muted">{exp.period}</span>
                  </div>
                  <div className="text-xs font-medium text-cyber-accent mb-2">
                    {exp.company} • {exp.location}
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="text-xs text-cyber-muted flex items-start gap-2">
                        <span className="text-cyber-primary font-mono">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono text-cyber-muted bg-cyber-card border border-cyber-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Groups */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-primary mb-3">
              {isEs ? 'Habilidades Técnicas' : 'Core Technical Competencies'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cv.skillGroups.map((group, gIdx) => (
                <div key={gIdx} className="p-3.5 rounded-xl bg-cyber-card border border-cyber-border">
                  <h4 className="text-xs font-bold text-white mb-2">{group.category}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[11px] text-cyber-text bg-cyber-bg border border-cyber-border/70"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cyber-border/70">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-primary mb-3">
                {isEs ? 'Educación' : 'Education'}
              </h3>
              {cv.education.map((edu, eIdx) => (
                <div key={eIdx} className="mb-3">
                  <div className="text-xs font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-cyber-muted">{edu.degree}</div>
                  <div className="font-mono text-[11px] text-cyber-accent">{edu.period}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-primary mb-3">
                {isEs ? 'Idiomas' : 'Languages'}
              </h3>
              {cv.languages.map((l, lIdx) => (
                <div key={lIdx} className="mb-2">
                  <div className="text-xs font-bold text-white">
                    {l.name} — <span className="text-cyber-emerald">{l.level}</span>
                  </div>
                  {l.detail && <div className="text-[11px] text-cyber-muted">{l.detail}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

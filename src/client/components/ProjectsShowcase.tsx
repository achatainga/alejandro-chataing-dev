import { motion } from 'framer-motion'
import { Layers, ArrowUpRight } from 'lucide-react'
import type { Language } from '../types/client.types'
import { cvEnglish } from '../data/cv.en'
import { cvSpanish } from '../data/cv.es'

interface ProjectsShowcaseProps {
  lang: Language
}

export function ProjectsShowcase({ lang }: ProjectsShowcaseProps) {
  const isEs = lang === 'es'
  const cv = isEs ? cvSpanish : cvEnglish

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs font-mono uppercase tracking-wider mb-4">
            <Layers size={13} />
            <span>{isEs ? 'Casos Reales y Proyectos' : 'Featured Projects'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            {isEs ? 'Proyectos que He Diseñado y Construido' : 'Systems Architected & Shipped to Production'}
          </h2>
          <p className="text-cyber-muted text-sm sm:text-base">
            {isEs
              ? 'Aplicaciones reales que resuelven problemas concretos: desde e-commerce y herramientas de desarrollo hasta asistentes de IA en la nube.'
              : 'Real-world platforms solving concrete problems: from high-traffic e-commerce to developer tools and cloud AI agents.'}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cv.projects.map((project, index) => {
            const isHighlight = project.highlight

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isHighlight
                    ? 'bg-gradient-to-br from-cyber-card via-cyber-surface to-cyber-card border-2 border-cyber-primary/40 shadow-xl shadow-cyber-primary/10'
                    : 'bg-cyber-card border border-cyber-border hover:border-cyber-primary/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-mono text-xs text-cyber-primary font-bold px-2 py-0.5 rounded bg-cyber-primary/10 border border-cyber-primary/20">
                      0{index + 1}
                    </span>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyber-muted hover:text-cyber-primary transition-colors"
                      >
                        <span>{isEs ? 'Ver enlace' : 'Live link'}</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>{project.name}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-cyber-muted leading-relaxed mb-6">{project.description}</p>
                </div>

                <div className="pt-4 border-t border-cyber-border/70">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-cyber-text bg-cyber-bg border border-cyber-border"
                      >
                        {t}
                      </span>
                    ))}
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

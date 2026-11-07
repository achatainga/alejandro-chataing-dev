import React from 'react'
import type { Language } from '../types/client.types'
import { cvEnglish } from '../data/cv.en'
import { cvSpanish } from '../data/cv.es'

interface PrintCVProps {
  lang: Language
}

const C = {
  accent: '#0284c7',
  text: '#0f172a',
  sub: '#334155',
  muted: '#64748b',
  light: '#e0f2fe',
  border: '#cbd5e1',
  bg: '#ffffff',
  bgAlt: '#f8fafc',
  tag: '#dbeafe',
  tagText: '#1e40af',
  barBg: '#e2e8f0',
  barFill: '#0284c7',
}

const s = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '8.5pt',
    color: C.text,
    lineHeight: 1.45,
    background: C.bg,
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '7.5pt',
    fontWeight: 700,
    color: C.accent,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    borderBottom: `1.5pt solid ${C.accent}`,
    paddingBottom: '3pt',
    marginBottom: '8pt',
    marginTop: '14pt',
  } as React.CSSProperties,

  tag: {
    display: 'inline-block',
    fontSize: '6.5pt',
    fontWeight: 600,
    background: C.tag,
    color: C.tagText,
    border: '0.5pt solid #bfdbfe',
    borderRadius: '3pt',
    padding: '1.5pt 5pt',
    marginRight: '3pt',
    marginBottom: '3pt',
  } as React.CSSProperties,
}

export function PrintCV({ lang }: PrintCVProps) {
  const cv = lang === 'es' ? cvSpanish : cvEnglish

  return (
    <div id="print-cv" className="print-cv-root">
      {/* ══════════ PAGE 1 ══════════ */}
      <div style={{ ...s.page, padding: '1.4cm 1.6cm', pageBreakAfter: 'always' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16pt', paddingBottom: '10pt', borderBottom: `2pt solid ${C.accent}`, marginBottom: '10pt' }}>
          <img
            src="/AlejandroChataing.png"
            alt="Alejandro Chataing"
            style={{ width: '64pt', height: '64pt', borderRadius: '6pt', objectFit: 'cover', flexShrink: 0, border: `1pt solid ${C.border}` }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18pt', fontWeight: 800, color: C.text, lineHeight: 1.1, marginBottom: '2pt' }}>
              {cv.name}
            </div>
            <div style={{ fontSize: '10pt', fontWeight: 600, color: C.accent, marginBottom: '5pt' }}>
              {cv.title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16pt', fontSize: '7.5pt', color: C.muted }}>
              <a href={`mailto:${cv.email}`} style={{ color: C.muted, textDecoration: 'none' }}>{cv.email}</a>
              <a href={`https://wa.me/${cv.phone.replace(/\D/g, '')}`} style={{ color: C.muted, textDecoration: 'none' }}>{cv.phone}</a>
              <span>{cv.location}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16pt', fontSize: '7.5pt', color: C.muted, marginTop: '2pt' }}>
              <a href={`https://github.com/${cv.github}`} style={{ color: C.muted, textDecoration: 'none' }}>github.com/{cv.github}</a>
              <a href={`https://www.linkedin.com/in/${cv.linkedin}`} style={{ color: C.muted, textDecoration: 'none' }}>linkedin.com/in/{cv.linkedin}</a>
              <a href="https://alejandro-chataing.pages.dev" style={{ color: C.accent, textDecoration: 'none' }}>alejandro-chataing.pages.dev</a>
              <a href="https://www.npmjs.com/package/mcp-code-context" style={{ color: C.muted, textDecoration: 'none' }}>npmjs.com/package/mcp-code-context</a>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p style={{ fontSize: '8pt', color: C.sub, lineHeight: 1.6, marginBottom: '6pt' }}>
          {cv.summary}
        </p>

        {/* Experience */}
        <div style={s.sectionTitle}>{lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience'}</div>
        {cv.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '9pt', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2pt' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {exp.url ? (
                  <a href={exp.url} style={{ fontWeight: 700, fontSize: '9pt', color: C.accent, textDecoration: 'none' }}>{exp.company}</a>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: '9pt', color: C.text }}>{exp.company}</span>
                )}
                <span style={{ color: C.sub, fontSize: '8.5pt' }}> — {exp.role}</span>
              </div>
              <div style={{ fontSize: '7pt', color: C.muted, textAlign: 'right', flexShrink: 0, marginLeft: '8pt' }}>
                {exp.period} · {exp.location}
              </div>
            </div>
            <ul style={{ margin: '2pt 0 4pt 12pt', padding: 0 }}>
              {exp.bullets.map((b, j) => (
                <li key={j} style={{ fontSize: '7.5pt', color: C.sub, marginBottom: '1.5pt', lineHeight: 1.4 }}>{b}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {exp.tech.map((t) => <span key={t} style={s.tag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════ PAGE 2 ══════════ */}
      <div style={{ ...s.page, padding: '1.4cm 1.6cm' }}>
        {/* Projects */}
        <div style={s.sectionTitle}>{lang === 'es' ? 'Proyectos y Código Abierto' : 'Projects & Open Source'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8pt', marginBottom: '8pt' }}>
          {cv.projects.slice(0, 4).map((p, i) => (
            <div key={i} style={{
              border: `0.5pt solid ${p.highlight ? C.accent : C.border}`,
              borderLeft: `3pt solid ${p.highlight ? C.accent : C.border}`,
              borderRadius: '4pt',
              padding: '6pt 8pt',
              background: p.highlight ? '#f0f9ff' : C.bgAlt,
              breakInside: 'avoid',
            }}>
              <div style={{ fontWeight: 700, fontSize: '8.5pt', color: C.text, marginBottom: '2pt' }}>
                {p.highlight && <span style={{ color: '#d97706', marginRight: '3pt' }}>★</span>}
                {p.name}
              </div>
              <p style={{ fontSize: '7pt', color: C.sub, lineHeight: 1.4, marginBottom: '4pt' }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {p.tech.map((t) => <span key={t} style={s.tag}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={s.sectionTitle}>{lang === 'es' ? 'Habilidades Técnicas' : 'Technical Skills'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6pt 18pt' }}>
          {cv.skillGroups.map((group, i) => (
            <div key={i} style={{ breakInside: 'avoid' }}>
              <div style={{ fontSize: '7pt', fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3pt' }}>
                {group.category}
              </div>
              {group.skills.map((skill) => (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '5pt', marginBottom: '2.5pt' }}>
                  <span style={{ fontSize: '7.5pt', color: C.sub, width: '90pt', flexShrink: 0 }}>{skill.name}</span>
                  <svg width="80" height="5" style={{ flexShrink: 0 }}>
                    <rect x="0" y="0" width="80" height="5" rx="2.5" fill={C.barBg} />
                    <rect x="0" y="0" width={`${skill.level * 0.8}`} height="5" rx="2.5" fill={C.barFill} />
                  </svg>
                  <span style={{ fontSize: '6.5pt', color: C.muted, width: '16pt', textAlign: 'right' }}>{skill.level}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Education & Languages */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18pt', marginTop: '8pt' }}>
          <div>
            <div style={s.sectionTitle}>{lang === 'es' ? 'Educación' : 'Education'}</div>
            {cv.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '4pt', breakInside: 'avoid' }}>
                <div style={{ fontWeight: 700, fontSize: '8pt', color: C.text }}>{edu.institution}</div>
                <div style={{ fontSize: '7.5pt', color: C.accent }}>{edu.degree}</div>
                <div style={{ fontSize: '7pt', color: C.muted }}>{edu.period}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={s.sectionTitle}>{lang === 'es' ? 'Idiomas' : 'Languages'}</div>
            {cv.languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginBottom: '4pt' }}>
                <span style={{ fontWeight: 700, fontSize: '8pt', color: C.text, minWidth: '55pt' }}>{l.name}</span>
                <span style={{
                  fontSize: '6.5pt', fontWeight: 700,
                  background: C.light, color: C.accent,
                  border: '0.5pt solid #bae6fd',
                  borderRadius: '3pt', padding: '1.5pt 6pt',
                }}>{l.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '16pt', paddingTop: '8pt', borderTop: `0.5pt solid ${C.border}`, display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt', color: C.muted }}>
          <span>{cv.name} · {cv.email} · {cv.phone}</span>
          <span style={{ color: C.accent }}>alejandro-chataing.pages.dev</span>
        </div>
      </div>
    </div>
  )
}

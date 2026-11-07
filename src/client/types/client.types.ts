export type Language = 'en' | 'es'

export interface CVExperience {
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
  tech: string[]
  url?: string
}

export interface CVProject {
  name: string
  description: string
  tech: string[]
  url?: string
  highlight?: boolean
}

export interface CVSkillGroup {
  category: string
  skills: { name: string; level: number }[]
}

export interface CVData {
  name: string
  title: string
  location: string
  email: string
  phone: string
  github: string
  linkedin: string
  summary: string
  experience: CVExperience[]
  projects: CVProject[]
  skillGroups: CVSkillGroup[]
  education: { institution: string; degree: string; period: string; details?: string[] }[]
  languages: { name: string; level: string; detail?: string }[]
}

export interface ServicePackage {
  id: string
  title: string
  subtitle: string
  badge: string
  price: string
  period?: string
  description: string
  highlights: string[]
  ctaText: string
  serviceInterest: 'hourly_contract' | 'staff_lead' | 'ai_saas' | 'custom_mcp' | 'consulting'
}

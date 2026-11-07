export interface LeadSubmissionDTO {
  name: string
  email: string
  company?: string
  phone?: string
  serviceInterest: 'hourly_contract' | 'staff_lead' | 'ai_saas' | 'custom_mcp' | 'consulting'
  budgetRange: string
  timeline: string
  message: string
}

export interface LeadEntityDTO extends LeadSubmissionDTO {
  id: string
  leadScore: number
  status: 'new' | 'contacted' | 'closed' | 'archived'
  ipCountry?: string
  createdAt: string
}

export function calculateLeadScore(data: LeadSubmissionDTO): number {
  let score = 50

  // Budget evaluation
  const b = data.budgetRange.toLowerCase()
  if (b.includes('50') || b.includes('80') || b.includes('10k') || b.includes('15k')) {
    score += 30
  } else if (b.includes('30') || b.includes('3k') || b.includes('5k')) {
    score += 20
  } else if (b.includes('100/mo')) {
    score += 15
  }

  // Timeline urgency
  const t = data.timeline.toLowerCase()
  if (t.includes('immediate') || t.includes('asap') || t.includes('1-2')) {
    score += 15
  }

  // Company presence
  if (data.company && data.company.trim().length > 1) {
    score += 10
  }

  // Phone number presence
  if (data.phone && data.phone.trim().length >= 7) {
    score += 10
  }

  return Math.min(100, Math.max(10, score))
}

export function validateLeadSubmission(body: unknown): { valid: boolean; error?: string; data?: LeadSubmissionDTO } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' }
  }

  const p = body as Partial<LeadSubmissionDTO>

  if (!p.name || typeof p.name !== 'string' || p.name.trim().length < 2) {
    return { valid: false, error: 'Full name is required (min 2 characters)' }
  }

  if (!p.email || typeof p.email !== 'string' || !p.email.includes('@') || !p.email.includes('.')) {
    return { valid: false, error: 'A valid email address is required' }
  }

  if (!p.message || typeof p.message !== 'string' || p.message.trim().length < 5) {
    return { valid: false, error: 'Please include a brief message or project description (min 5 characters)' }
  }

  const validServices: LeadSubmissionDTO['serviceInterest'][] = [
    'hourly_contract',
    'staff_lead',
    'ai_saas',
    'custom_mcp',
    'consulting',
  ]

  const serviceInterest = validServices.includes(p.serviceInterest as any)
    ? (p.serviceInterest as LeadSubmissionDTO['serviceInterest'])
    : 'hourly_contract'

  return {
    valid: true,
    data: {
      name: p.name.trim().slice(0, 100),
      email: p.email.trim().toLowerCase().slice(0, 120),
      company: p.company ? p.company.trim().slice(0, 100) : undefined,
      phone: p.phone ? p.phone.trim().slice(0, 40) : undefined,
      serviceInterest,
      budgetRange: (p.budgetRange || '$30-50/hr').slice(0, 50),
      timeline: (p.timeline || 'Flexible').slice(0, 50),
      message: p.message.trim().slice(0, 3000),
    },
  }
}

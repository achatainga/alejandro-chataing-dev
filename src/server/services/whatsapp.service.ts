import type { LeadEntityDTO } from '../dto/lead.dto'

export interface WhatsAppConfig {
  apiUrl: string
  apiKey?: string
  instance: string
  targetPhone: string
}

export class WhatsAppNotificationService {
  constructor(private config: WhatsAppConfig) {}

  async notifyNewLead(lead: LeadEntityDTO): Promise<boolean> {
    if (!this.config.apiUrl || !this.config.targetPhone) {
      console.warn('[WhatsApp] WhatsApp notification skipped: missing apiUrl or targetPhone')
      return false
    }

    const cleanPhone = this.config.targetPhone.replace(/[^0-9]/g, '')
    const urgencyBadge = lead.leadScore >= 75 ? '🔥 HIGH PRIORITY LEAD' : '⚡ NEW INQUIRY'

    const message = [
      `*${urgencyBadge} — alejandro-chataing.dev*`,
      ``,
      `👤 *Name:* ${lead.name}`,
      `📧 *Email:* ${lead.email}`,
      lead.company ? `🏢 *Company:* ${lead.company}` : null,
      lead.phone ? `📱 *Phone:* ${lead.phone}` : null,
      `🎯 *Service:* ${lead.serviceInterest}`,
      `💰 *Budget:* ${lead.budgetRange}`,
      `⏳ *Timeline:* ${lead.timeline}`,
      `⭐ *Lead Score:* ${lead.leadScore}/100`,
      ``,
      `💬 *Message:*`,
      `"${lead.message}"`,
      ``,
      `_Received at ${new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' })} VET_`,
    ]
      .filter(Boolean)
      .join('\n')

    return this.sendTextMessage(cleanPhone, message)
  }

  async notifyHighIntentChat(visitorHash: string, userQuery: string, emailOrContact?: string): Promise<boolean> {
    if (!this.config.apiUrl || !this.config.targetPhone) {
      return false
    }

    const cleanPhone = this.config.targetPhone.replace(/[^0-9]/g, '')
    const message = [
      `🤖 *LIVE CHAT INTENT DETECTED — alejandro-chataing.dev*`,
      ``,
      `Visitor is inquiring about hiring, rates, or consulting.`,
      emailOrContact ? `📫 *Identified Contact:* ${emailOrContact}` : `🆔 *Visitor ID:* ${visitorHash.slice(0, 10)}`,
      ``,
      `💬 *Visitor Said:*`,
      `"${userQuery}"`,
      ``,
      `_Check admin panel or prepare for incoming lead._`,
    ].join('\n')

    return this.sendTextMessage(cleanPhone, message)
  }

  private async sendTextMessage(phone: string, text: string): Promise<boolean> {
    const url = `${this.config.apiUrl.replace(/\/$/, '')}/message/sendText/${this.config.instance}`

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { apikey: this.config.apiKey } : {}),
        },
        body: JSON.stringify({
          number: phone,
          text: text,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn(`[WhatsApp] Evolution API returned HTTP ${response.status}`)
        return false
      }

      console.log(`[WhatsApp] Notification dispatched successfully to ${phone}`)
      return true
    } catch (err: any) {
      console.warn(`[WhatsApp] Error dispatching WhatsApp notification:`, err?.message || err)
      return false
    }
  }
}

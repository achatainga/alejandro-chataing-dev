import type { LeadEntityDTO } from '../../../server/dto/lead.dto'

interface AdminLeadsTabProps {
  metrics: { leadsCount: number; downloadsCount: number; sessionsCount: number } | null
  leads: LeadEntityDTO[]
  isEs: boolean
}

export function AdminLeadsTab({ metrics, leads, isEs }: AdminLeadsTabProps) {
  return (
    <div>
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border">
            <div className="text-xs text-cyber-muted">{isEs ? 'Total Leads Capturados' : 'Total Leads Captured'}</div>
            <div className="font-mono text-2xl font-bold text-cyber-primary mt-1">{metrics.leadsCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border">
            <div className="text-xs text-cyber-muted">{isEs ? 'Sesiones de Chat IA' : 'AI Chat Sessions'}</div>
            <div className="font-mono text-2xl font-bold text-cyan-400 mt-1">{metrics.sessionsCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border">
            <div className="text-xs text-cyber-muted">{isEs ? 'Descargas de Skills' : 'Skill Downloads'}</div>
            <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">{metrics.downloadsCount}</div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-cyber-border rounded-xl overflow-hidden">
          <thead className="bg-cyber-surface text-cyber-muted font-mono uppercase">
            <tr>
              <th className="p-3">Score</th>
              <th className="p-3">Name / Company</th>
              <th className="p-3">Service Interest</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-cyber-card/50">
                <td className="p-3 font-mono font-bold text-cyber-primary">{l.leadScore}/100</td>
                <td className="p-3 font-medium text-white">
                  {l.name} <span className="text-cyber-muted">({l.company || 'Direct'})</span>
                  <br />
                  <span className="text-[11px] text-cyber-muted">{l.email}</span>
                </td>
                <td className="p-3 text-cyber-text">{l.serviceInterest}</td>
                <td className="p-3 font-mono text-emerald-400">{l.budgetRange}</td>
                <td className="p-3 text-cyber-muted font-mono">{l.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

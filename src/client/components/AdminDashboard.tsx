import { useState, useEffect } from 'react'
import { Shield, Users, DownloadCloud, MessageSquare, Key, ArrowLeft, RefreshCw } from 'lucide-react'
import type { Language } from '../types/client.types'
import type { LeadEntityDTO } from '../../server/dto/lead.dto'

interface AdminDashboardProps {
  lang: Language
  onClose: () => void
}

export function AdminDashboard({ lang, onClose }: AdminDashboardProps) {
  const isEs = lang === 'es'
  const [secret, setSecret] = useState(() => localStorage.getItem('alejandro_admin_secret') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [metrics, setMetrics] = useState<{ leadsCount: number; downloadsCount: number; sessionsCount: number } | null>(null)
  const [leads, setLeads] = useState<LeadEntityDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const [metricsRes, leadsRes] = await Promise.all([
        fetch(`/api/admin/metrics?secret=${encodeURIComponent(token)}`),
        fetch(`/api/admin/leads?secret=${encodeURIComponent(token)}`),
      ])

      if (metricsRes.status === 401 || leadsRes.status === 401) {
        throw new Error('Invalid secret passkey')
      }

      const metricsData: any = await metricsRes.json()
      const leadsData: any = await leadsRes.json()

      if (metricsData.success && leadsData.success) {
        setMetrics(metricsData.metrics)
        setLeads(leadsData.leads || [])
        setIsAuthenticated(true)
        localStorage.setItem('alejandro_admin_secret', token)
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (secret) {
      fetchDashboardData(secret)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) return
    fetchDashboardData(secret.trim())
  }

  return (
    <div className="fixed inset-0 z-50 bg-cyber-bg overflow-y-auto p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-cyber-border">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-cyber-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{isEs ? 'Volver al Portafolio' : 'Back to Portfolio'}</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-cyber-primary" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Telemetry & Leads Console
            </span>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyber-primary/20 text-cyber-primary mx-auto flex items-center justify-center mb-4">
              <Key size={24} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {isEs ? 'Panel Privado de Telemetría' : 'Private Telemetry Console'}
            </h2>
            <p className="text-xs text-cyber-muted mb-6">
              {isEs ? 'Introduce tu clave de administrador para ver leads y analíticas.' : 'Enter your admin secret to inspect leads and real-time metrics.'}
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Admin Secret Token"
                className="w-full bg-cyber-surface border border-cyber-border rounded-xl px-4 py-2.5 text-xs text-center text-white focus:outline-none focus:border-cyber-primary font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-cyber-primary text-cyber-bg font-bold text-xs hover:bg-cyan-300 transition-colors"
              >
                {loading ? 'Authenticating...' : 'Access Console'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border">
                <div className="flex items-center justify-between text-cyber-primary mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Total Leads</span>
                  <Users size={16} />
                </div>
                <div className="font-mono text-3xl font-extrabold text-white">
                  {metrics?.leadsCount ?? 0}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border">
                <div className="flex items-center justify-between text-cyber-accent mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Skill Installs</span>
                  <DownloadCloud size={16} />
                </div>
                <div className="font-mono text-3xl font-extrabold text-white">
                  {metrics?.downloadsCount ?? 0}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border">
                <div className="flex items-center justify-between text-cyber-emerald mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Chat Sessions</span>
                  <MessageSquare size={16} />
                </div>
                <div className="font-mono text-3xl font-extrabold text-white">
                  {metrics?.sessionsCount ?? 0}
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-2xl bg-cyber-surface border border-cyber-border overflow-hidden">
              <div className="p-4 border-b border-cyber-border flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  {isEs ? 'Prospectos & Clientes Recientes' : 'Recent Inquiries & Leads'}
                </h3>
                <button
                  type="button"
                  onClick={() => fetchDashboardData(secret)}
                  className="p-1.5 rounded-lg text-cyber-muted hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-cyber-card text-cyber-muted font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-border/60">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-cyber-card/40">
                        <td className="p-3">
                          <div className="font-bold text-white">{l.name}</div>
                          <div className="text-cyber-muted text-[11px]">{l.email}</div>
                          {l.phone && <div className="text-cyber-primary text-[10px]">{l.phone}</div>}
                        </td>
                        <td className="p-3 text-cyber-text font-mono text-[11px]">{l.serviceInterest}</td>
                        <td className="p-3 font-mono text-cyber-emerald">{l.budgetRange}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            l.leadScore >= 75 ? 'bg-cyber-emerald/20 text-cyber-emerald' : 'bg-cyber-primary/20 text-cyber-primary'
                          }`}>
                            {l.leadScore}/100
                          </span>
                        </td>
                        <td className="p-3 text-cyber-muted text-[11px]">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {l.phone && (
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-semibold text-cyber-emerald hover:underline"
                            >
                              WhatsApp
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

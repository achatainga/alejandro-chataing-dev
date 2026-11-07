import { useState, useEffect } from 'react'
import { Shield, Users, Key, ArrowLeft, RefreshCw, Video as VideoIcon, Share2, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import type { Language } from '../types/client.types'
import type { LeadEntityDTO } from '../../server/dto/lead.dto'
import type { VideoItem } from './VideoShowcase'

interface AdminDashboardProps {
  lang: Language
  onClose: () => void
}

export function AdminDashboard({ lang, onClose }: AdminDashboardProps) {
  const isEs = lang === 'es'
  const [secret, setSecret] = useState(() => localStorage.getItem('alejandro_admin_secret') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'leads' | 'videos' | 'socials'>('leads')
  const [metrics, setMetrics] = useState<{ leadsCount: number; downloadsCount: number; sessionsCount: number } | null>(null)
  const [leads, setLeads] = useState<LeadEntityDTO[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [socials, setSocials] = useState<Record<string, string>>({
    linkedin: 'https://www.linkedin.com/in/alejandro-chataing-81798a106/',
    github: 'https://github.com/achatainga',
    youtube: 'https://youtube.com/@alejandrochataing',
    whatsapp: 'https://wa.me/584241668876',
    email: 'mailto:chataing.alejandro@gmail.com',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // New video form state
  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoCategory, setVideoCategory] = useState('AI & AST Architecture')
  const [videoDesc, setVideoDesc] = useState('')

  const fetchDashboardData = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [metricsRes, leadsRes, videosRes, socialsRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch('/api/admin/leads', { headers }),
        fetch('/api/videos'),
        fetch('/api/videos/socials'),
      ])

      if (metricsRes.status === 401 || leadsRes.status === 401) {
        throw new Error('Invalid secret passkey')
      }

      const metricsData: any = await metricsRes.json()
      const leadsData: any = await leadsRes.json()
      const videosData: any = await videosRes.json()
      const socialsData: any = await socialsRes.json()

      if (metricsData.success && leadsData.success) {
        setMetrics(metricsData.metrics)
        setLeads(leadsData.leads || [])
        if (videosData.success && Array.isArray(videosData.videos)) {
          setVideos(videosData.videos)
        }
        if (socialsData.success && Array.isArray(socialsData.links)) {
          const map: Record<string, string> = {}
          for (const s of socialsData.links) {
            map[s.platform] = s.url
          }
          setSocials((prev) => ({ ...prev, ...map }))
        }
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
    if (secret) fetchDashboardData(secret)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) return
    fetchDashboardData(secret.trim())
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoTitle || !videoUrl || !videoDesc) return
    setLoading(true)
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          title: videoTitle,
          youtubeUrl: videoUrl,
          category: videoCategory,
          description: videoDesc,
        }),
      })
      const data = await res.json()
      if (data.success && data.video) {
        setVideos((prev) => [data.video, ...prev])
        setVideoTitle('')
        setVideoUrl('')
        setVideoDesc('')
        setSuccessMsg(isEs ? 'Video agregado exitosamente' : 'Video published successfully')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to add video')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm(isEs ? '¿Eliminar este video?' : 'Delete this video?')) return
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      })
      const data = await res.json()
      if (data.success) {
        setVideos((prev) => prev.filter((v) => v.id !== id))
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete')
    }
  }

  const handleSaveSocial = async (platform: string, url: string, label: string) => {
    try {
      const res = await fetch('/api/videos/socials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ platform, url, label }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg(isEs ? `Guardado: ${label}` : `Saved: ${label}`)
        setTimeout(() => setSuccessMsg(null), 2500)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save social link')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="w-full max-w-md bg-cyber-bg border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{isEs ? 'Portal de Administración' : 'Admin Portal'}</h2>
              <p className="text-xs text-cyber-muted">{isEs ? 'Ingresa tu passkey para acceder' : 'Enter passkey to manage platform'}</p>
            </div>
          </div>
          {error && <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cyber-muted mb-1.5">{isEs ? 'Passkey del Servidor' : 'Server Passkey'}</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="chataing-admin-..."
                className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-sm focus:border-cyber-primary outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-cyber-primary text-cyber-bg font-bold text-sm hover:bg-cyan-300 transition-colors"
              >
                {loading ? (isEs ? 'Verificando...' : 'Verifying...') : (isEs ? 'Ingresar al Dashboard' : 'Authenticate')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white text-sm transition-colors"
              >
                {isEs ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-lg">
      <div className="w-full max-w-5xl max-h-[92vh] bg-cyber-bg border border-cyber-border rounded-2xl p-6 sm:p-8 overflow-y-auto shadow-2xl relative text-cyber-text">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-cyber-border gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-cyber-primary" />
                <span>Alejandro Console v2.0</span>
              </h2>
              <p className="text-xs text-cyber-muted">Cloudflare Edge & D1 Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchDashboardData(secret)}
              className="p-2 rounded-xl bg-cyber-card border border-cyber-border text-cyber-muted hover:text-cyber-primary transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('alejandro_admin_secret')
                setIsAuthenticated(false)
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20"
            >
              {isEs ? 'Cerrar Sesión' : 'Logout'}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-cyber-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'leads' ? 'border-cyber-primary text-cyber-primary bg-cyber-card' : 'border-transparent text-cyber-muted hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>{isEs ? 'Leads y Métricas' : 'Leads & Metrics'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'videos' ? 'border-cyber-primary text-cyber-primary bg-cyber-card' : 'border-transparent text-cyber-muted hover:text-white'
            }`}
          >
            <VideoIcon size={14} />
            <span>{isEs ? 'Videos y YouTube' : 'Videos & YouTube'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('socials')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'socials' ? 'border-cyber-primary text-cyber-primary bg-cyber-card' : 'border-transparent text-cyber-muted hover:text-white'
            }`}
          >
            <Share2 size={14} />
            <span>{isEs ? 'Redes Sociales' : 'Social Networks'}</span>
          </button>
        </div>

        {/* TAB 1: Leads & Metrics */}
        {activeTab === 'leads' && (
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
                      <td className="p-3 font-medium text-white">{l.name} <span className="text-cyber-muted">({l.company || 'Direct'})</span><br/><span className="text-[11px] text-cyber-muted">{l.email}</span></td>
                      <td className="p-3 text-cyber-text">{l.serviceInterest}</td>
                      <td className="p-3 font-mono text-emerald-400">{l.budgetRange}</td>
                      <td className="p-3 text-cyber-muted font-mono">{l.createdAt?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Videos Manager */}
        {activeTab === 'videos' && (
          <div>
            <form onSubmit={handleAddVideo} className="p-4 rounded-xl bg-cyber-card border border-cyber-border mb-6 space-y-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-cyber-primary" />
                <span>{isEs ? 'Agregar Nuevo Video a la Plataforma' : 'Publish New Showcase Video'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={isEs ? 'Título del Video' : 'Video Title'}
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-xs text-white"
                  required
                />
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={isEs ? 'Categoría (ej: AI & AST Architecture)' : 'Category (e.g. Serverless & Edge)'}
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-xs text-white"
                  required
                />
                <input
                  type="text"
                  placeholder={isEs ? 'Descripción del video' : 'Video description'}
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-xs text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>{loading ? 'Publicando...' : (isEs ? 'Publicar Video en Portfolio' : 'Publish to Portfolio')}</span>
              </button>
            </form>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-cyber-muted uppercase font-mono">{isEs ? 'Videos Publicados' : 'Published Videos'} ({videos.length})</div>
              {videos.map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={`https://img.youtube.com/vi/${v.embedId}/hqdefault.jpg`} alt="" className="w-16 h-10 object-cover rounded" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate">{v.title}</div>
                      <div className="text-[11px] text-cyber-muted truncate">{v.category} · {v.youtubeUrl}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(v.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Social Networks */}
        {activeTab === 'socials' && (
          <div className="space-y-4">
            <div className="text-xs text-cyber-muted mb-2">
              {isEs ? 'Conecta tus perfiles de redes sociales y canales de difusión:' : 'Configure your connected social platforms and distribution channels:'}
            </div>
            {Object.entries(socials).map(([platform, url]) => (
              <div key={platform} className="p-3 rounded-xl bg-cyber-card border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-mono text-xs uppercase font-bold text-cyber-primary w-28">{platform}</span>
                <input
                  type="text"
                  defaultValue={url}
                  id={`social-${platform}`}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(`social-${platform}`) as HTMLInputElement
                    if (input) handleSaveSocial(platform, input.value, platform.toUpperCase())
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-primary text-xs font-semibold text-cyber-text transition-colors"
                >
                  {isEs ? 'Guardar' : 'Save'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

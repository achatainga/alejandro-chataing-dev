import { useState, useEffect } from 'react'
import { Shield, Users, Key, ArrowLeft, RefreshCw, Video as VideoIcon, Share2, CheckCircle2, BookOpen } from 'lucide-react'
import type { Language } from '../types/client.types'
import type { LeadEntityDTO } from '../../server/dto/lead.dto'
import type { VideoItem } from './VideoShowcase'
import { AdminLeadsTab } from './admin/AdminLeadsTab'
import { AdminVideosTab } from './admin/AdminVideosTab'
import { AdminSocialsTab } from './admin/AdminSocialsTab'
import { AdminBlogTab } from './admin/AdminBlogTab'

interface AdminDashboardProps {
  lang: Language
  onClose: () => void
}

export function AdminDashboard({ lang, onClose }: AdminDashboardProps) {
  const isEs = lang === 'es'
  const [secret, setSecret] = useState(() => localStorage.getItem('alejandro_admin_secret') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'leads' | 'videos' | 'socials' | 'blog'>('leads')
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
          for (const s of socialsData.links) map[s.platform] = s.url
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

  const handleSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
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
                {loading ? (isEs ? 'Verificando...' : 'Verifying...') : isEs ? 'Ingresar al Dashboard' : 'Authenticate'}
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
          <button
            type="button"
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'blog' ? 'border-cyber-primary text-cyber-primary bg-cyber-card' : 'border-transparent text-cyber-muted hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>{isEs ? 'Edge Blog CMS' : 'Edge Blog CMS'}</span>
          </button>
        </div>

        {activeTab === 'leads' && <AdminLeadsTab metrics={metrics} leads={leads} isEs={isEs} />}
        {activeTab === 'videos' && (
          <AdminVideosTab
            videos={videos}
            secret={secret}
            isEs={isEs}
            onVideoAdded={(v) => {
              setVideos((prev) => [v, ...prev])
              handleSuccess(isEs ? 'Video agregado exitosamente' : 'Video published successfully')
            }}
            onVideoDeleted={(id) => {
              setVideos((prev) => prev.filter((v) => v.id !== id))
              handleSuccess(isEs ? 'Video eliminado' : 'Video removed')
            }}
          />
        )}
        {activeTab === 'socials' && (
          <AdminSocialsTab socials={socials} secret={secret} isEs={isEs} onSuccess={handleSuccess} />
        )}
        {activeTab === 'blog' && (
          <AdminBlogTab secret={secret} isEs={isEs} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  )
}

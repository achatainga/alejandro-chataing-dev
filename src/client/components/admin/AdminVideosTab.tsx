import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { VideoItem } from '../VideoShowcase'

interface AdminVideosTabProps {
  videos: VideoItem[]
  secret: string
  isEs: boolean
  onVideoAdded: (video: VideoItem) => void
  onVideoDeleted: (id: string) => void
}

export function AdminVideosTab({ videos, secret, isEs, onVideoAdded, onVideoDeleted }: AdminVideosTabProps) {
  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoCategory, setVideoCategory] = useState('AI & AST Architecture')
  const [videoDesc, setVideoDesc] = useState('')
  const [loading, setLoading] = useState(false)

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
        onVideoAdded(data.video)
        setVideoTitle('')
        setVideoUrl('')
        setVideoDesc('')
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to add video')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isEs ? '¿Eliminar este video?' : 'Delete this video?')) return
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      })
      const data = await res.json()
      if (data.success) {
        onVideoDeleted(id)
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <form onSubmit={handleAddVideo} className="p-4 rounded-xl bg-cyber-card border border-cyber-border mb-6 space-y-3">
        <div className="text-sm font-bold text-white flex items-center gap-2">
          <Plus size={16} className="text-cyber-primary" />
          <span>{isEs ? 'Agregar Nuevo Video al Portfolio' : 'Publish New Showcase Video'}</span>
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
          <span>{loading ? 'Publicando...' : isEs ? 'Publicar Video' : 'Publish Video'}</span>
        </button>
      </form>

      <div className="space-y-3">
        <div className="text-xs font-semibold text-cyber-muted uppercase font-mono">
          {isEs ? 'Videos Publicados' : 'Published Videos'} ({videos.length})
        </div>
        {videos.map((v) => (
          <div key={v.id} className="p-3 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img src={`https://img.youtube.com/vi/${v.embedId}/hqdefault.jpg`} alt="" className="w-16 h-10 object-cover rounded" />
              <div className="min-w-0">
                <div className="font-bold text-xs text-white truncate">{v.title}</div>
                <div className="text-[11px] text-cyber-muted truncate">
                  {v.category} · {v.youtubeUrl}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(v.id)}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

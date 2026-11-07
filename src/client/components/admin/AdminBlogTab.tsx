import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, FileText } from 'lucide-react'
import type { BlogPostDTO } from '../../../server/dto/blog.dto'

interface AdminBlogTabProps {
  secret: string
  isEs: boolean
  onSuccess: (msg: string) => void
}

export function AdminBlogTab({ secret, isEs, onSuccess }: AdminBlogTabProps) {
  const [posts, setPosts] = useState<BlogPostDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('AI, Cloudflare, Architecture')
  const [contentMarkdown, setContentMarkdown] = useState('')
  const [published, setPublished] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog', {
        headers: { Authorization: `Bearer ${secret}` },
      })
      const data: any = await res.json()
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts)
      }
    } catch (err: any) {
      console.error('Failed to fetch admin blog posts', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setSummary('')
    setTags('AI, Cloudflare, Architecture')
    setContentMarkdown('')
    setPublished(true)
    setIsEditing(false)
  }

  const handleEdit = (p: BlogPostDTO) => {
    setTitle(p.title)
    setSlug(p.slug)
    setSummary(p.summary)
    setTags(p.tags.join(', '))
    setContentMarkdown(p.contentMarkdown)
    setPublished(p.published)
    setIsEditing(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !contentMarkdown) return

    setLoading(true)
    try {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean)
      const payload = {
        title,
        slug: slug.trim() || undefined,
        summary,
        tags: tagList,
        contentMarkdown,
        published,
      }

      if (isEditing && slug) {
        const res = await fetch(`/api/admin/blog/${slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          onSuccess(isEs ? 'Artículo actualizado con éxito' : 'Article updated successfully')
          resetForm()
          fetchPosts()
        }
      } else {
        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          onSuccess(isEs ? 'Artículo publicado con éxito' : 'Article published successfully')
          resetForm()
          fetchPosts()
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Error processing article')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postSlug: string) => {
    if (!confirm(isEs ? '¿Eliminar este artículo?' : 'Delete this post?')) return
    try {
      const res = await fetch(`/api/admin/blog/${postSlug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      })
      const data = await res.json()
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.slug !== postSlug))
        onSuccess(isEs ? 'Artículo eliminado' : 'Article deleted')
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      {/* Article Form */}
      <form onSubmit={handleSubmit} className="bg-cyber-card border border-cyber-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText size={16} className="text-cyber-primary" />
            <span>{isEditing ? (isEs ? 'Editar Artículo' : 'Edit Article') : (isEs ? 'Nuevo Artículo Edge Blog' : 'New Edge Blog Article')}</span>
          </h3>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-cyber-muted hover:text-white underline"
            >
              {isEs ? 'Cancelar Edición' : 'Cancel Edit'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-cyber-muted mb-1">{isEs ? 'Título' : 'Title'}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Building Autonomous Anti-Abuse Armor..."
              required
              className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-white text-xs focus:border-cyber-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cyber-muted mb-1">{isEs ? 'Slug URL (Opcional)' : 'Slug URL (Optional)'}</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="building-autonomous-anti-abuse-armor"
              disabled={isEditing}
              className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-white text-xs focus:border-cyber-primary outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyber-muted mb-1">{isEs ? 'Resumen (Excerpt)' : 'Summary / Excerpt'}</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A deep dive into 6-layer defense on Cloudflare Workers..."
            required
            className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-white text-xs focus:border-cyber-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyber-muted mb-1">{isEs ? 'Etiquetas (Tags separadas por coma)' : 'Tags (comma separated)'}</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="AI, Cloudflare, SRE, TypeScript"
            className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-white text-xs focus:border-cyber-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyber-muted mb-1">{isEs ? 'Contenido Markdown' : 'Markdown Content'}</label>
          <textarea
            value={contentMarkdown}
            onChange={(e) => setContentMarkdown(e.target.value)}
            rows={8}
            placeholder="# Title\n\nIntro to the article..."
            required
            className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-white text-xs focus:border-cyber-primary outline-none font-mono"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs text-cyber-muted cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded bg-cyber-bg border-cyber-border text-cyber-primary"
            />
            <span>{isEs ? 'Publicar inmediatamente en vivo' : 'Publish live immediately'}</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-cyber-primary text-cyber-bg font-bold text-xs hover:bg-cyan-300 transition-colors flex items-center gap-1.5"
          >
            {isEditing ? <Edit3 size={14} /> : <Plus size={14} />}
            <span>{loading ? (isEs ? 'Guardando...' : 'Saving...') : isEditing ? (isEs ? 'Actualizar' : 'Update Post') : (isEs ? 'Publicar Artículo' : 'Publish Article')}</span>
          </button>
        </div>
      </form>

      {/* Articles List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">
          {isEs ? `Artículos en D1 Edge Database (${posts.length})` : `Articles in D1 Edge Database (${posts.length})`}
        </h4>
        {posts.map((post) => (
          <div
            key={post.slug}
            className="p-3 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${post.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  {post.published ? (isEs ? 'PUBLICADO' : 'PUBLISHED') : (isEs ? 'BORRADOR' : 'DRAFT')}
                </span>
                <span className="text-xs text-cyber-muted font-mono">{post.viewCount} views</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{post.title}</p>
              <p className="text-[11px] text-cyber-muted font-mono truncate">/blog/{post.slug}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(post)}
                className="p-1.5 rounded-lg bg-cyber-bg hover:text-cyber-primary text-cyber-muted transition-colors"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(post.slug)}
                className="p-1.5 rounded-lg bg-cyber-bg hover:text-red-400 text-cyber-muted transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Youtube, ExternalLink, PlusCircle, Video as VideoIcon } from 'lucide-react'
import type { Language } from '../types/client.types'

export interface VideoItem {
  id: string
  title: string
  youtubeUrl: string
  embedId: string
  description: string
  category: string
  featured: boolean
}

interface VideoShowcaseProps {
  lang: Language
  onOpenAdmin?: () => void
}

export function VideoShowcase({ lang, onOpenAdmin }: VideoShowcaseProps) {
  const isEs = lang === 'es'
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos')
        const data = await res.json()
        if (data.success && Array.isArray(data.videos)) {
          setVideos(data.videos)
        }
      } catch (err) {
        console.error('Failed to load showcase videos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const categories = ['all', ...Array.from(new Set(videos.map((v) => v.category)))]
  const filtered = selectedCategory === 'all' ? videos : videos.filter((v) => v.category === selectedCategory)

  return (
    <section id="videos" className="py-20 border-t border-cyber-border/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 mb-3">
              <Youtube size={14} />
              <span>{isEs ? 'Demostraciones en Video' : 'Video Demos'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isEs ? 'Demostraciones en Video y Explicaciones Prácticas' : 'Video Walkthroughs & Practical Demos'}
            </h2>
            <p className="text-sm sm:text-base text-cyber-muted mt-2 max-w-2xl">
              {isEs
                ? 'Explicaciones visuales de mis proyectos, cómo funciona el código y cómo aplicarlo en tu negocio.'
                : 'Step-by-step visual walkthroughs of my projects, code architecture, and real-world implementations.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-primary/60 text-xs font-semibold text-cyber-muted hover:text-white transition-colors flex items-center gap-1.5"
            >
              <PlusCircle size={14} className="text-cyber-primary" />
              <span>{isEs ? 'Gestionar Videos' : 'Manage Videos'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyber-primary text-cyber-bg font-bold shadow-md shadow-cyber-primary/20'
                    : 'bg-cyber-surface border border-cyber-border/60 text-cyber-muted hover:text-white'
                }`}
              >
                {cat === 'all' ? (isEs ? 'Todos los Videos' : 'All Videos') : cat}
              </button>
            ))}
          </div>
        )}

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-cyber-card border border-cyber-border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-cyber-card border border-cyber-border text-cyber-muted text-sm">
            {isEs ? 'No hay videos disponibles en esta categoría.' : 'No videos found in this category.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group rounded-2xl bg-cyber-card border border-cyber-border/80 hover:border-red-500/50 overflow-hidden shadow-lg flex flex-col transition-all"
              >
                {/* Thumbnail / Video Preview */}
                <div
                  className="relative aspect-video bg-black/60 cursor-pointer overflow-hidden flex items-center justify-center"
                  onClick={() => setActiveVideo(video)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                    <Play size={20} className="ml-1 fill-white" />
                  </div>
                  <span className="absolute bottom-2 left-3 text-[11px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded">
                    {video.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-red-400 transition-colors mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-cyber-muted line-clamp-3 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-cyber-border/50 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="font-semibold text-cyber-primary hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <VideoIcon size={14} />
                      <span>{isEs ? 'Reproducir Demo' : 'Play Walkthrough'}</span>
                    </button>

                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-muted hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        <AnimatePresence>
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-cyber-bg border border-cyber-border rounded-2xl overflow-hidden shadow-2xl relative"
              >
                <div className="flex items-center justify-between p-4 border-b border-cyber-border bg-cyber-card">
                  <div className="font-bold text-white text-sm truncate pr-4">
                    {activeVideo.title}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyber-surface hover:bg-cyber-border text-white transition-colors"
                  >
                    {isEs ? 'Cerrar' : 'Close'}
                  </button>
                </div>
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=1`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

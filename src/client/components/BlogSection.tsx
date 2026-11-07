import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowRight, X } from 'lucide-react'
import { marked } from 'marked'
import type { Language } from '../types/client.types'
import type { BlogPostDTO } from '../../server/dto/blog.dto'

interface BlogSectionProps {
  lang: Language
}

export function BlogSection({ lang }: BlogSectionProps) {
  const isEs = lang === 'es'
  const [posts, setPosts] = useState<BlogPostDTO[]>([])
  const [activePost, setActivePost] = useState<BlogPostDTO | null>(null)
  const [loading, setLoading] = useState(true)

  const renderedContent = useMemo(() => {
    if (!activePost?.contentMarkdown) return ''
    return marked.parse(activePost.contentMarkdown, { gfm: true, breaks: true }) as string
  }, [activePost?.contentMarkdown])

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data: any) => {
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading && posts.length === 0) return null

  return (
    <section id="blog" className="py-20 relative bg-cyber-bg/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs font-mono uppercase tracking-wider mb-4">
            <BookOpen size={13} />
            <span>{isEs ? 'Publicaciones de Ingeniería' : 'Engineering Deep Dives'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            {isEs ? 'Artículos Técnicos & Filosofía de Arquitectura' : 'Technical Articles & Systems Philosophy'}
          </h2>
          <p className="text-cyber-muted text-sm sm:text-base">
            {isEs
              ? 'Artículos publicados directamente en el edge con Cloudflare D1 sobre AST, PHP 8.3 Zero-Framework y flujos de IA.'
              : 'Technical case studies served from Cloudflare Edge on AST surgery, Pure PHP 8.3 zero-framework, and agent SRE.'}
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {posts.map((post) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-6 bg-cyber-card border border-cyber-border hover:border-cyber-primary/40 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-cyber-primary bg-cyber-primary/10 border border-cyber-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-cyber-muted leading-relaxed mb-4">{post.summary}</p>
              </div>

              <div className="pt-4 border-t border-cyber-border/70 flex items-center justify-between">
                <span className="text-[11px] text-cyber-muted">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePost(post)}
                  className="text-xs font-semibold text-cyber-primary hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>{isEs ? 'Leer Artículo' : 'Read Article'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] bg-cyber-surface border border-cyber-border rounded-2xl p-6 sm:p-8 overflow-y-auto flex flex-col shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-cyber-muted hover:text-white hover:bg-cyber-card transition-colors"
                aria-label="Close article modal"
              >
                <X size={20} />
              </button>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {activePost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-cyber-primary bg-cyber-primary/10 border border-cyber-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 pr-6 leading-tight">{activePost.title}</h2>

              <div
                className="blog-content leading-relaxed text-cyber-text font-sans"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

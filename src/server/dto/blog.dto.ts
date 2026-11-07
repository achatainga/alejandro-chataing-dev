export interface BlogPostDTO {
  slug: string
  title: string
  summary: string
  contentMarkdown: string
  tags: string[]
  published: boolean
  viewCount: number
  publishedAt: string
}

export function validateBlogPost(body: unknown): { valid: boolean; error?: string; data?: Partial<BlogPostDTO> } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Post payload must be a JSON object' }
  }

  const p = body as Partial<BlogPostDTO>

  if (!p.title || typeof p.title !== 'string' || p.title.trim().length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' }
  }

  if (!p.contentMarkdown || typeof p.contentMarkdown !== 'string' || p.contentMarkdown.trim().length < 20) {
    return { valid: false, error: 'Content must be at least 20 characters' }
  }

  const slug = p.slug && typeof p.slug === 'string'
    ? p.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : p.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return {
    valid: true,
    data: {
      slug,
      title: p.title.trim().slice(0, 200),
      summary: (p.summary || p.contentMarkdown.slice(0, 150)).trim().slice(0, 300),
      contentMarkdown: p.contentMarkdown.trim(),
      tags: Array.isArray(p.tags) ? p.tags.map(t => String(t).trim()).slice(0, 10) : ['Tech'],
      published: p.published !== false,
    },
  }
}

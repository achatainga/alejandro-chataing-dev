export interface VideoDTO {
  id: string
  title: string
  youtubeUrl: string
  embedId: string
  description: string
  category: string
  featured: boolean
  sortOrder: number
  createdAt: string
}

export interface CreateVideoDTO {
  title: string
  youtubeUrl: string
  description: string
  category: string
  featured?: boolean
}

export interface SocialLinkDTO {
  platform: string
  url: string
  label: string
  icon?: string
  updatedAt: string
}

export function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? match[1] : url.trim()
}

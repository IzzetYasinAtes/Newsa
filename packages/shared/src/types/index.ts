export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived'

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer'

export interface Article {
  id: string
  title: string
  slug: string
  summary: string | null
  content: Record<string, unknown> | null
  content_html: string | null
  cover_image_id: string | null
  cover_image_alt: string | null
  category_id: string
  author_id: string
  status: ArticleStatus
  published_at: string | null
  archived_at: string | null
  is_featured: boolean
  is_headline: boolean
  is_breaking: boolean
  featured_order: number | null
  breaking_expires_at: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  canonical_url: string | null
  view_count: number
  share_count: number
  source_name: string | null
  source_url: string | null
  editor_id: string | null
  editor_notes: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  file_name: string
  original_name: string
  file_path: string
  file_url: string
  file_size: number
  mime_type: string
  width: number | null
  height: number | null
  alt_text: string | null
  caption: string | null
  uploaded_by: string
  folder: string
  created_at: string
}

export interface Settings {
  key: string
  value: Record<string, unknown>
  description: string | null
  updated_at: string
  updated_by: string | null
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

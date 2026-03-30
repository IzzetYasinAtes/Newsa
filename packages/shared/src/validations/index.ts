import { z } from 'zod'

// Article schemas
export const createArticleSchema = z.object({
  title: z.string().min(10, 'Başlık en az 10 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
  summary: z.string().max(500, 'Özet en fazla 500 karakter olabilir').optional().nullable(),
  content: z.record(z.string(), z.unknown()).optional().nullable(),
  content_html: z.string().optional().nullable(),
  cover_image_id: z.string().uuid().optional().nullable(),
  cover_image_alt: z.string().optional().nullable(),
  category_id: z.string().uuid('Kategori seçilmeli'),
  status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
  published_at: z.string().datetime().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_headline: z.boolean().default(false),
  is_breaking: z.boolean().default(false),
  featured_order: z.number().int().optional().nullable(),
  breaking_expires_at: z.string().datetime().optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  seo_keywords: z.array(z.string()).optional().nullable(),
  canonical_url: z.string().url().optional().nullable(),
  source_name: z.string().optional().nullable(),
  source_url: z.string().url().optional().nullable(),
  editor_notes: z.string().optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional().default([]),
})

export const updateArticleSchema = createArticleSchema.partial()

export const publishArticleSchema = z.object({
  title: z.string().min(10),
  cover_image_id: z.string().uuid('Yayınlamak için kapak görseli gerekli'),
  category_id: z.string().uuid('Kategori gerekli'),
  content: z.record(z.string(), z.unknown()),
})

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  description: z.string().max(500).optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
})

export const updateCategorySchema = createCategorySchema.partial()

// Tag schemas
export const createTagSchema = z.object({
  name: z.string().min(2, 'Etiket adı en az 2 karakter').max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
})

// Media schemas
export const uploadMediaSchema = z.object({
  file_name: z.string(),
  original_name: z.string(),
  file_path: z.string(),
  file_url: z.string().url(),
  file_size: z.number().int().positive(),
  mime_type: z.string(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  alt_text: z.string().max(200).optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  folder: z.string().default('general'),
})

export const updateMediaSchema = z.object({
  alt_text: z.string().max(200).optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  folder: z.string().optional(),
})

// Profile schemas
export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  display_name: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
})

// Settings schema
export const updateSettingSchema = z.object({
  key: z.string(),
  value: z.unknown(),
  description: z.string().optional().nullable(),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Search schema
export const searchSchema = z.object({
  q: z.string().min(2, 'Arama terimi en az 2 karakter olmalı'),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().uuid().optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

// Type exports from schemas
export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>

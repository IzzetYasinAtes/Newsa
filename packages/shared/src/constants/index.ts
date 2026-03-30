export const ARTICLE_STATUSES = ['draft', 'review', 'published', 'archived'] as const

export const USER_ROLES = ['admin', 'editor', 'author', 'viewer'] as const

export const BREAKING_NEWS_DEFAULT_HOURS = 4

export const MAX_FEATURED_ARTICLES = 10
export const MAX_HEADLINE_ARTICLES = 3

export const PAGINATION_DEFAULT_PAGE = 1
export const PAGINATION_DEFAULT_PER_PAGE = 20
export const PAGINATION_MAX_PER_PAGE = 100

export const SLUG_MAX_LENGTH = 200
export const TITLE_MAX_LENGTH = 200
export const SUMMARY_MAX_LENGTH = 500

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

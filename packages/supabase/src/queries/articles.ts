import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

type Client = SupabaseClient<Database>

interface ListArticlesParams {
  page?: number
  perPage?: number
  status?: 'draft' | 'review' | 'published' | 'archived'
  categoryId?: string
  authorId?: string
  tagSlug?: string
  featured?: boolean
  headline?: boolean
  breaking?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
}

export async function listArticles(supabase: Client, params: ListArticlesParams = {}) {
  const {
    page = 1,
    perPage = 20,
    status,
    categoryId,
    authorId,
    featured,
    headline,
    breaking,
    sort = 'created_at',
    order = 'desc',
    search,
  } = params

  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories!articles_category_id_fkey(id, name, slug),
      author:profiles!articles_author_id_fkey(id, full_name, display_name, avatar_url)
    `, { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (categoryId) query = query.eq('category_id', categoryId)
  if (authorId) query = query.eq('author_id', authorId)
  if (featured !== undefined) query = query.eq('is_featured', featured)
  if (headline !== undefined) query = query.eq('is_headline', headline)
  if (breaking !== undefined) query = query.eq('is_breaking', breaking)
  if (search) query = query.textSearch('title', search, { type: 'websearch' })

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  query = query.order(sort, { ascending: order === 'asc' }).range(from, to)

  const { data, error, count } = await query

  return {
    data: data ?? [],
    error,
    meta: {
      total: count ?? 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count ?? 0) / perPage),
    },
  }
}

export async function getArticleBySlug(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories!articles_category_id_fkey(id, name, slug),
      author:profiles!articles_author_id_fkey(id, full_name, display_name, avatar_url, bio),
      cover_image:media!articles_cover_image_id_fkey(id, file_url, alt_text),
      article_tags(tag:tags!article_tags_tag_id_fkey(id, name, slug)),
      article_media(media:media!article_media_media_id_fkey(id, file_url, alt_text, caption), sort_order)
    `)
    .eq('slug', slug)
    .single()

  return { data, error }
}

export async function getArticleById(supabase: Client, id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories!articles_category_id_fkey(id, name, slug),
      author:profiles!articles_author_id_fkey(id, full_name, display_name, avatar_url),
      cover_image:media!articles_cover_image_id_fkey(id, file_url, alt_text),
      article_tags(tag:tags!article_tags_tag_id_fkey(id, name, slug)),
      article_media(media:media!article_media_media_id_fkey(id, file_url, alt_text, caption), sort_order)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function createArticle(
  supabase: Client,
  article: Database['public']['Tables']['articles']['Insert'],
  tagIds?: string[]
) {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single()

  if (error || !data) return { data: null, error }

  // Etiket ilişkilerini ekle
  if (tagIds && tagIds.length > 0) {
    const tagRelations = tagIds.map((tagId) => ({
      article_id: data.id,
      tag_id: tagId,
    }))
    await supabase.from('article_tags').insert(tagRelations)
  }

  return { data, error: null }
}

export async function updateArticle(
  supabase: Client,
  id: string,
  updates: Database['public']['Tables']['articles']['Update'],
  tagIds?: string[]
) {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return { data: null, error }

  // Etiketleri güncelle (sil + ekle)
  if (tagIds !== undefined) {
    await supabase.from('article_tags').delete().eq('article_id', id)
    if (tagIds.length > 0) {
      const tagRelations = tagIds.map((tagId) => ({
        article_id: id,
        tag_id: tagId,
      }))
      await supabase.from('article_tags').insert(tagRelations)
    }
  }

  return { data, error: null }
}

export async function deleteArticle(supabase: Client, id: string) {
  return supabase.from('articles').delete().eq('id', id)
}

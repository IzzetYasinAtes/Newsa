import { type NextRequest } from 'next/server'
import { createApiClient } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'
import { rateLimit, getRateLimitHeaders, getClientIp } from '@/lib/rate-limit'

interface ArticleRow {
  id: string
  title: string
  slug: string
  summary: string | null
  published_at: string | null
  view_count: number
  author_id: string
  category: { id: string; name: string; slug: string } | null
  cover_image: { file_url: string; alt_text: string | null } | null
}

interface ProfileRow {
  id: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { allowed, remaining, resetAt } = rateLimit(ip, 60)
    const rateLimitHeaders = getRateLimitHeaders(remaining, resetAt)

    if (!allowed) {
      return errorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429)
    }

    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') ?? '20', 10)))
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') ?? 'published_at'
    const order = searchParams.get('order') === 'asc' ? true : false

    const supabase = await createApiClient()

    let query = supabase
      .from('articles')
      .select(
        `
        id, title, slug, summary, published_at, view_count, author_id,
        category:categories!articles_category_id_fkey(id, name, slug),
        cover_image:media!articles_cover_image_id_fkey(file_url, alt_text)
      `,
        { count: 'exact' },
      )
      .eq('status', 'published')

    if (category) {
      query = query.eq('categories.slug', category)
    }

    const allowedSortFields = ['published_at', 'view_count', 'title']
    const sortField = allowedSortFields.includes(sort) ? sort : 'published_at'
    query = query.order(sortField, { ascending: order })

    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)

    const { data: rawData, error, count } = await query

    if (error) {
      return errorResponse('DB_ERROR', error.message, 500)
    }

    const data = rawData as unknown as ArticleRow[]

    // Fetch author profiles separately to avoid RLS permission issues on profiles table
    const authorIds = [...new Set((data ?? []).map((a) => a.author_id).filter(Boolean))]
    const authorsMap: Record<string, ProfileRow> = {}

    if (authorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, avatar_url')
        .in('id', authorIds)

      if (profiles) {
        for (const p of profiles as ProfileRow[]) {
          authorsMap[p.id] = p
        }
      }
    }

    const articlesWithAuthors = (data ?? []).map((article) => ({
      ...article,
      author: article.author_id ? (authorsMap[article.author_id] ?? null) : null,
    }))

    const total = count ?? 0
    const totalPages = Math.ceil(total / perPage)

    return successResponse(articlesWithAuthors, { total, page, per_page: perPage, total_pages: totalPages }, {
      headers: { 'Cache-Control': 'public, s-maxage=60', ...rateLimitHeaders },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}

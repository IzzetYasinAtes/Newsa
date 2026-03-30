import { type NextRequest } from 'next/server'
import { createApiClient } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') ?? '20', 10)))

    if (!q || q.trim().length === 0) {
      return errorResponse('INVALID_PARAM', 'q parameter is required', 400)
    }

    const supabase = await createApiClient()

    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await supabase
      .from('articles')
      .select(
        `
        id, title, slug, summary, published_at, view_count,
        category:categories!articles_category_id_fkey(id, name, slug),
        author:profiles!articles_author_id_fkey(id, full_name, display_name, avatar_url),
        cover_image:media!articles_cover_image_id_fkey(file_url, alt_text)
      `,
        { count: 'exact' },
      )
      .eq('status', 'published')
      .ilike('title', `%${q.trim()}%`)
      .order('published_at', { ascending: false })
      .range(from, to)

    if (error) {
      return errorResponse('DB_ERROR', error.message, 500)
    }

    const total = count ?? 0
    const totalPages = Math.ceil(total / perPage)

    return successResponse(data ?? [], { total, page, per_page: perPage, total_pages: totalPages }, {
      headers: { 'Cache-Control': 'public, s-maxage=30' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}

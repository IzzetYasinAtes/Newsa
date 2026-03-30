import { type NextRequest } from 'next/server'
import { createApiClient } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request: NextRequest) {
  try {
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
        id, title, slug, summary, published_at, view_count,
        category:categories!articles_category_id_fkey(id, name, slug),
        author:profiles!articles_author_id_fkey(id, full_name, display_name, avatar_url),
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

    const { data, error, count } = await query

    if (error) {
      return errorResponse('DB_ERROR', error.message, 500)
    }

    const total = count ?? 0
    const totalPages = Math.ceil(total / perPage)

    return successResponse(data ?? [], { total, page, per_page: perPage, total_pages: totalPages }, {
      headers: { 'Cache-Control': 'public, s-maxage=60' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}

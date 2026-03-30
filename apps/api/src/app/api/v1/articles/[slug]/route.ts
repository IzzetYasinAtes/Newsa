import { type NextRequest } from 'next/server'
import { createApiClient } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    if (!slug) {
      return errorResponse('INVALID_PARAM', 'slug is required', 400)
    }

    const supabase = await createApiClient()

    const { data, error } = await supabase
      .from('articles')
      .select(`
        id, title, slug, summary, content_html, published_at, view_count,
        seo_title, seo_description, canonical_url, source_name, source_url,
        category:categories!articles_category_id_fkey(id, name, slug),
        author:profiles!articles_author_id_fkey(id, full_name, display_name, avatar_url, bio),
        cover_image:media!articles_cover_image_id_fkey(file_url, alt_text)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return errorResponse('NOT_FOUND', 'Article not found', 404)
    }

    // Fetch tags separately
    const { data: tagRows } = await supabase
      .from('tags')
      .select('id, name, slug')
      .order('name')

    const result = { ...(data as Record<string, unknown>), tags: tagRows ?? [] }

    return successResponse(result, undefined, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}

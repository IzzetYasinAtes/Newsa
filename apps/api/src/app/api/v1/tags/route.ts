import { createApiClient } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
  try {
    const supabase = await createApiClient()

    const { data, error } = await supabase
      .from('tags')
      .select('id, name, slug')
      .order('name')

    if (error) {
      return errorResponse('DB_ERROR', error.message, 500)
    }

    return successResponse(data ?? [], undefined, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

type Client = SupabaseClient<Database>

interface ListMediaParams {
  page?: number
  perPage?: number
  folder?: string
  mimeType?: string
  search?: string
}

export async function listMedia(supabase: Client, params: ListMediaParams = {}) {
  const { page = 1, perPage = 24, folder, mimeType, search } = params

  let query = supabase
    .from('media')
    .select('*', { count: 'exact' })

  if (folder) query = query.eq('folder', folder)
  if (mimeType) query = query.like('mime_type', `${mimeType}%`)
  if (search) query = query.or(`file_name.ilike.%${search}%,alt_text.ilike.%${search}%,original_name.ilike.%${search}%`)

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

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

export async function getMediaById(supabase: Client, id: string) {
  return supabase.from('media').select('*').eq('id', id).single()
}

export async function createMedia(
  supabase: Client,
  media: Database['public']['Tables']['media']['Insert']
) {
  return supabase.from('media').insert(media).select().single()
}

export async function updateMedia(
  supabase: Client,
  id: string,
  updates: Database['public']['Tables']['media']['Update']
) {
  return supabase.from('media').update(updates).eq('id', id).select().single()
}

export async function deleteMedia(supabase: Client, id: string) {
  // Önce dosya bilgisini al (storage'dan silmek için)
  const { data: media } = await supabase.from('media').select('file_path').eq('id', id).single()

  if (media?.file_path) {
    const bucket = media.file_path.split('/')[0]
    const path = media.file_path.split('/').slice(1).join('/')
    await supabase.storage.from(bucket).remove([path])
  }

  return supabase.from('media').delete().eq('id', id)
}

export async function uploadFile(
  supabase: Client,
  bucket: string,
  path: string,
  file: File
) {
  return supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
}

export function getPublicUrl(supabase: Client, bucket: string, path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path)
}

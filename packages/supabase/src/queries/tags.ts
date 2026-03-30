import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

type Client = SupabaseClient<Database>

export async function listTags(supabase: Client) {
  return supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })
}

export async function getTagBySlug(supabase: Client, slug: string) {
  return supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()
}

export async function createTag(
  supabase: Client,
  tag: Database['public']['Tables']['tags']['Insert']
) {
  return supabase
    .from('tags')
    .insert(tag)
    .select()
    .single()
}

export async function updateTag(
  supabase: Client,
  id: string,
  updates: Database['public']['Tables']['tags']['Update']
) {
  return supabase
    .from('tags')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteTag(supabase: Client, id: string) {
  return supabase.from('tags').delete().eq('id', id)
}

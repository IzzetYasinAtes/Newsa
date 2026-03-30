import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

type Client = SupabaseClient<Database>

export async function listCategories(supabase: Client, activeOnly = true) {
  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (activeOnly) query = query.eq('is_active', true)

  return query
}

export async function getCategoryBySlug(supabase: Client, slug: string) {
  return supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
}

export async function getCategoryById(supabase: Client, id: string) {
  return supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()
}

export async function createCategory(
  supabase: Client,
  category: Database['public']['Tables']['categories']['Insert']
) {
  return supabase
    .from('categories')
    .insert(category)
    .select()
    .single()
}

export async function updateCategory(
  supabase: Client,
  id: string,
  updates: Database['public']['Tables']['categories']['Update']
) {
  return supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteCategory(supabase: Client, id: string) {
  return supabase.from('categories').delete().eq('id', id)
}

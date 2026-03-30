'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function softDeleteArticle(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('articles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/haberler')
  revalidatePath('/cop-kutusu')
}

export async function restoreArticle(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('articles')
    .update({ deleted_at: null })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/haberler')
  revalidatePath('/cop-kutusu')
}

export async function permanentDeleteArticle(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Sadece admin rolü kalıcı silebilir
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Bu işlem için admin yetkisi gereklidir')
  }

  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/haberler')
  revalidatePath('/cop-kutusu')
}

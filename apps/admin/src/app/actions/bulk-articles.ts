'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function bulkSoftDelete(ids: string[]): Promise<{ success: boolean; message: string }> {
  if (!ids.length) return { success: false, message: 'Hiç haber seçilmedi' }

  try {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('articles')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids)

    if (error) throw error

    revalidatePath('/haberler')
    revalidatePath('/cop-kutusu')

    return { success: true, message: `${ids.length} haber çöp kutusuna taşındı` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return { success: false, message }
  }
}

export async function bulkRestore(ids: string[]): Promise<{ success: boolean; message: string }> {
  if (!ids.length) return { success: false, message: 'Hiç haber seçilmedi' }

  try {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('articles')
      .update({ deleted_at: null })
      .in('id', ids)

    if (error) throw error

    revalidatePath('/haberler')
    revalidatePath('/cop-kutusu')

    return { success: true, message: `${ids.length} haber geri yüklendi` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return { success: false, message }
  }
}

export async function bulkPublish(ids: string[]): Promise<{ success: boolean; message: string }> {
  if (!ids.length) return { success: false, message: 'Hiç haber seçilmedi' }

  try {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('articles')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .in('id', ids)

    if (error) throw error

    revalidatePath('/haberler')

    return { success: true, message: `${ids.length} haber yayına alındı` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return { success: false, message }
  }
}

export async function bulkArchive(ids: string[]): Promise<{ success: boolean; message: string }> {
  if (!ids.length) return { success: false, message: 'Hiç haber seçilmedi' }

  try {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('articles')
      .update({ status: 'archived' })
      .in('id', ids)

    if (error) throw error

    revalidatePath('/haberler')

    return { success: true, message: `${ids.length} haber arşivlendi` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return { success: false, message }
  }
}

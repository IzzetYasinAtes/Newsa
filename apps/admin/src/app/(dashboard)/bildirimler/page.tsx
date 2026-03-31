import { createClient } from '@/lib/supabase-server'
import BildirimlerClient from './BildirimlerClient'

interface Notification {
  id: string
  title: string
  body: string | null
  is_read: boolean
  created_at: string
  type: string | null
}

export default async function BildirimlerPage() {
  let initialNotifications: Notification[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('notifications')
        .select('id, title, body, is_read, created_at, type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      initialNotifications = (data as Notification[]) ?? []
    }
  } catch {
    /* Supabase not configured yet */
  }

  return <BildirimlerClient initialNotifications={initialNotifications} />
}

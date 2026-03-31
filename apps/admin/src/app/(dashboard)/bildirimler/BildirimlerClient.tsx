'use client'

import { useState, useCallback } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { PageHeader } from '@/components/PageHeader'

interface Notification {
  id: string
  title: string
  body: string | null
  is_read: boolean
  created_at: string
  type: string | null
}

interface BildirimlerClientProps {
  initialNotifications: Notification[]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'az once'
  if (minutes < 60) return `${minutes} dk once`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} sa once`
  const days = Math.floor(hours / 24)
  return `${days} gun once`
}

export default function BildirimlerClient({ initialNotifications }: BildirimlerClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [markingAll, setMarkingAll] = useState(false)

  const markAsRead = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  const markAllAsRead = useCallback(async () => {
    setMarkingAll(true)
    const supabase = getSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    }
    setMarkingAll(false)
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div>
      <PageHeader
        title="Bildirimler"
        description={unreadCount > 0 ? `${unreadCount} okunmamis bildirim` : 'Tum bildirimler okundu'}
        action={unreadCount > 0 ? { label: 'Tumunu Okundu Isaretle', onClick: markAllAsRead } : undefined}
      />

      {notifications.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center">
          <p className="text-lg font-medium">Bildirim yok</p>
          <p className="mt-1 text-sm text-muted-foreground">Henuz bir bildiriminiz yok</p>
        </div>
      ) : (
        <div className="space-y-2">
          {markingAll && (
            <p className="text-sm text-muted-foreground">Isaretleniyor...</p>
          )}
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                notification.is_read
                  ? 'bg-card'
                  : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${notification.is_read ? 'font-normal' : 'font-semibold'}`}>
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  {notification.body && (
                    <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">{timeAgo(notification.created_at)}</span>
                  {notification.is_read ? (
                    <span className="text-xs text-muted-foreground">Okundu</span>
                  ) : (
                    <span className="text-xs font-medium text-primary">Yeni</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

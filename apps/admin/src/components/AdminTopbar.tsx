'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'

interface TopbarProps {
  userName: string
  userRole: string
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  editor: 'Editor',
  author: 'Yazar',
  viewer: 'Goruntuleyici',
}

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      setUnreadCount(count ?? 0)
    }
    load()
  }, [])

  return (
    <Link
      href="/bildirimler"
      className="relative flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      title="Bildirimler"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}

export function AdminTopbar({ userName, userRole }: TopbarProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="md:hidden">
        <span className="text-lg font-bold text-primary">Newsa</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="text-right">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{roleLabels[userRole] ?? userRole}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Cikis
        </button>
      </div>
    </header>
  )
}

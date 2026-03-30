'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

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

export function AdminTopbar({ userName, userRole }: TopbarProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
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
      <div className="flex items-center gap-4">
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

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'
import { AdminTopbar } from '@/components/AdminTopbar'

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await getUser()

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar userRole={profile?.role ?? 'viewer'} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar
          userName={profile?.display_name ?? profile?.full_name ?? ''}
          userRole={profile?.role ?? 'viewer'}
        />
        <main className="flex-1 overflow-y-auto bg-secondary/30 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

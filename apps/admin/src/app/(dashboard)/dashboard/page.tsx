import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { formatDatetime } from '@newsa/shared'

async function getStats() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const [total, published, drafts, reviews, recent, recentLogs] = await Promise.all([
      supabase.from('articles').select('id', { count: 'exact', head: true }),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'review'),
      supabase.from('articles').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('audit_logs').select('id, action, entity_type, entity_id, created_at, user:profiles!user_id(full_name)').order('created_at', { ascending: false }).limit(10),
    ])

    return {
      total: total.count ?? 0,
      published: published.count ?? 0,
      drafts: drafts.count ?? 0,
      reviews: reviews.count ?? 0,
      recentArticles: recent.data ?? [],
      recentLogs: recentLogs.data ?? [],
    }
  } catch {
    return { total: 0, published: 0, drafts: 0, reviews: 0, recentArticles: [], recentLogs: [] }
  }
}

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'default' | 'secondary' }> = {
  draft: { label: 'Taslak', variant: 'secondary' },
  review: { label: 'İncelemede', variant: 'warning' },
  published: { label: 'Yayında', variant: 'success' },
  archived: { label: 'Arşiv', variant: 'default' },
}

const actionLabels: Record<string, string> = {
  create: 'oluşturdu',
  update: 'güncelledi',
  delete: 'sildi',
  publish: 'yayınladı',
  archive: 'arşivledi',
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Newsa yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Toplam Haber', value: stats.total, color: 'text-blue-700 bg-blue-50' },
          { label: 'Yayında', value: stats.published, color: 'text-green-700 bg-green-50' },
          { label: 'Taslak', value: stats.drafts, color: 'text-yellow-700 bg-yellow-50' },
          { label: 'İncelemede', value: stats.reviews, color: 'text-purple-700 bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 inline-block rounded px-2 py-0.5 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Articles */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Son Haberler</h2>
            <Link href="/haberler" className="text-sm text-primary hover:underline">Tümünü gör</Link>
          </div>
          <div className="space-y-2">
            {stats.recentArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz haber yok</p>
            ) : (
              stats.recentArticles.map((article) => {
                const s = statusLabels[article.status] ?? statusLabels.draft
                return (
                  <div key={article.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                    <Link href={`/haberler/${article.id}`} className="text-sm hover:text-primary truncate flex-1 mr-2">
                      {article.title}
                    </Link>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">Son Aktiviteler</h2>
          <div className="space-y-2">
            {stats.recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz aktivite yok</p>
            ) : (
              stats.recentLogs.map((log) => {
                const userName = (log.user as { full_name?: string })?.full_name ?? 'Sistem'
                return (
                  <div key={log.id} className="flex items-start gap-2 rounded-md p-2 text-sm">
                    <span className="font-medium">{userName}</span>
                    <span className="text-muted-foreground">
                      {log.entity_type} {actionLabels[log.action] ?? log.action}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                      {formatDatetime(log.created_at)}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/haberler/yeni" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + Yeni Haber
        </Link>
        <Link href="/kategoriler/yeni" className="rounded-md border px-4 py-2 text-sm hover:bg-accent">
          + Yeni Kategori
        </Link>
        <Link href="/medya" className="rounded-md border px-4 py-2 text-sm hover:bg-accent">
          Medya Yükle
        </Link>
      </div>
    </div>
  )
}

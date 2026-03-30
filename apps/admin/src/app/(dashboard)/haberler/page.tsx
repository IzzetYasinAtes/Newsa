import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'
import { formatDate } from '@newsa/shared'

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'default' | 'secondary' }> = {
  draft: { label: 'Taslak', variant: 'secondary' },
  review: { label: 'İncelemede', variant: 'warning' },
  published: { label: 'Yayında', variant: 'success' },
  archived: { label: 'Arşiv', variant: 'default' },
}

async function getArticles() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('articles')
      .select(`
        id, title, slug, status, is_featured, is_breaking, created_at, published_at, view_count,
        category:categories!category_id(name),
        author:profiles!author_id(full_name, display_name)
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    return data ?? []
  } catch {
    return []
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div>
      <PageHeader
        title="Haberler"
        description={`${articles.length} haber`}
        action={{ label: '+ Yeni Haber', href: '/haberler/yeni' }}
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Yazar</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tarih</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Okunma</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Henüz haber yok</td></tr>
            ) : (
              articles.map((article) => {
                const status = statusLabels[article.status] ?? statusLabels.draft
                const authorName = (article.author as { display_name?: string; full_name?: string })?.display_name
                  ?? (article.author as { full_name?: string })?.full_name ?? '-'
                const categoryName = (article.category as { name?: string })?.name ?? '-'
                return (
                  <tr key={article.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/haberler/${article.id}`} className="font-medium hover:text-primary">
                        {article.title}
                      </Link>
                      <div className="mt-0.5 flex gap-1">
                        {article.is_featured && <span className="text-xs text-yellow-600">Öne Çıkan</span>}
                        {article.is_breaking && <span className="text-xs text-red-600">Son Dakika</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{categoryName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{authorName}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(article.published_at ?? article.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">{article.view_count}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

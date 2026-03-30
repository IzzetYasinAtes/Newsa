import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'

interface StaticPage {
  id: string
  title: string
  slug: string
  status: string
  updated_at: string
}

async function getPages(): Promise<StaticPage[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('pages')
      .select('id, title, slug, status, updated_at')
      .order('updated_at', { ascending: false })
    return (data as StaticPage[]) ?? []
  } catch {
    return []
  }
}

const statusVariant: Record<string, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

const statusLabel: Record<string, string> = {
  published: 'Yayında',
  draft: 'Taslak',
  archived: 'Arşiv',
}

export default async function SayfalarPage() {
  const pages = await getPages()

  return (
    <div>
      <PageHeader
        title="Sayfalar"
        description={`${pages.length} statik sayfa`}
        action={{ label: '+ Yeni Sayfa', href: '/sayfalar/yeni' }}
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Güncelleme</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Henüz sayfa yok.{' '}
                  <Link href="/sayfalar/yeni" className="text-primary hover:underline">
                    İlk sayfayı oluşturun
                  </Link>
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{page.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{page.slug}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[page.status] ?? 'secondary'}>
                      {statusLabel[page.status] ?? page.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(page.updated_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/sayfalar/${page.id}`} className="text-primary hover:underline">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

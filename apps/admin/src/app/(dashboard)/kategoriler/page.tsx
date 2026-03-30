import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

async function getCategories(): Promise<Category[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    return (data as Category[]) ?? []
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <PageHeader
        title="Kategoriler"
        description={`${categories.length} kategori`}
        action={{ label: '+ Yeni Kategori', href: '/kategoriler/yeni' }}
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ad</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sira</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Islem</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Henuz kategori yok</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.sort_order}</td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.is_active ? 'success' : 'secondary'}>
                      {cat.is_active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/kategoriler/${cat.id}`} className="text-primary hover:underline">Duzenle</Link>
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

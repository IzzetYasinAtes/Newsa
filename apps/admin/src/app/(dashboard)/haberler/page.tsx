import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { ArticlesTable } from './_components/ArticlesTable'

const PER_PAGE = 20

interface ArticleRow {
  id: string
  title: string
  slug: string
  status: string
  is_featured: boolean
  is_breaking: boolean
  created_at: string
  published_at: string | null
  view_count: number
  category: { name?: string } | null
  author: { display_name?: string; full_name?: string } | null
}

async function getArticles(page: number) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const from = (page - 1) * PER_PAGE
    const { data, count } = await supabase
      .from('articles')
      .select(`
        id, title, slug, status, is_featured, is_breaking, created_at, published_at, view_count,
        category:categories!category_id(name),
        author:profiles!author_id(full_name, display_name)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, from + PER_PAGE - 1)
    return { articles: (data ?? []) as unknown as ArticleRow[], total: count ?? 0 }
  } catch {
    return { articles: [] as ArticleRow[], total: 0 }
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const { articles, total } = await getArticles(page)
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      <PageHeader
        title="Haberler"
        description={`${total} haber`}
        action={{ label: '+ Yeni Haber', href: '/haberler/yeni' }}
      />

      <ArticlesTable articles={articles} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Sayfa {page} / {totalPages} ({total} haber)</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/haberler?page=${page - 1}`}
                className="rounded-md border px-3 py-1.5 hover:bg-muted"
              >
                Önceki
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/haberler?page=${page + 1}`}
                className="rounded-md border px-3 py-1.5 hover:bg-muted"
              >
                Sonraki
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { Pagination } from '@/components/Pagination'
import { FilterBar } from '@/components/haberler/FilterBar'
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

interface Category {
  id: string
  name: string
  slug: string
}

interface FilterParams {
  page: number
  status: string
  kategori: string
  q: string
  baslangic: string
  bitis: string
}

async function getArticles(filters: FilterParams) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const from = (filters.page - 1) * PER_PAGE

    let query = supabase
      .from('articles')
      .select(`
        id, title, slug, status, is_featured, is_breaking, created_at, published_at, view_count,
        category:categories!category_id(name, slug),
        author:profiles!author_id(full_name, display_name)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, from + PER_PAGE - 1)

    // Durum filtresi
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    // Metin arama (başlık üzerinde)
    if (filters.q) {
      query = query.ilike('title', `%${filters.q}%`)
    }

    // Tarih aralığı
    if (filters.baslangic) {
      query = query.gte('created_at', `${filters.baslangic}T00:00:00`)
    }
    if (filters.bitis) {
      query = query.lte('created_at', `${filters.bitis}T23:59:59`)
    }

    // Kategori filtresi - önce slug ile kategori id bul
    if (filters.kategori) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.kategori)
        .single()
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    const { data, count } = await query

    return { articles: (data ?? []) as unknown as ArticleRow[], total: count ?? 0 }
  } catch {
    return { articles: [] as ArticleRow[], total: 0 }
  }
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
      .select('id, name, slug')
      .order('name')
    return (data ?? []) as Category[]
  } catch {
    return []
  }
}

interface SearchParams {
  sayfa?: string
  status?: string
  kategori?: string
  q?: string
  baslangic?: string
  bitis?: string
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.sayfa) || 1)

  const filters: FilterParams = {
    page,
    status: params.status ?? '',
    kategori: params.kategori ?? '',
    q: params.q ?? '',
    baslangic: params.baslangic ?? '',
    bitis: params.bitis ?? '',
  }

  const [{ articles, total }, categories] = await Promise.all([
    getArticles(filters),
    getCategories(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  function buildHref(targetPage: number) {
    const p = new URLSearchParams()
    if (filters.status) p.set('status', filters.status)
    if (filters.kategori) p.set('kategori', filters.kategori)
    if (filters.q) p.set('q', filters.q)
    if (filters.baslangic) p.set('baslangic', filters.baslangic)
    if (filters.bitis) p.set('bitis', filters.bitis)
    if (targetPage > 1) p.set('sayfa', String(targetPage))
    const qs = p.toString()
    return `/haberler${qs ? `?${qs}` : ''}`
  }

  return (
    <div>
      <PageHeader
        title="Haberler"
        description={`${total} haber`}
        action={{ label: '+ Yeni Haber', href: '/haberler/yeni' }}
      />

      <FilterBar categories={categories} />

      <ArticlesTable articles={articles} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={PER_PAGE}
        buildHref={buildHref}
      />
    </div>
  )
}

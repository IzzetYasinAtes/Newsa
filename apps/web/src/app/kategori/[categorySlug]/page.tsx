import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'
import type { Metadata } from 'next'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  seo_title: string | null
  seo_description: string | null
}

async function getCategoryData(slug: string, page: number) {
  try {
    const supabase = await createServerClient()

    const { data: rawCategory } = await supabase.from('categories').select('*').eq('slug', slug).single()
    const category = rawCategory as unknown as CategoryRow | null
    if (!category) return null

    const perPage = 12
    const from = (page - 1) * perPage
    const { data: articles, count } = await supabase
      .from('articles')
      .select('id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)', { count: 'exact' })
      .eq('category_id', category.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, from + perPage - 1)

    return { category, articles: (articles ?? []) as unknown as Record<string, unknown>[], total: count ?? 0, perPage }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await params
  const data = await getCategoryData(categorySlug, 1)
  if (!data) return { title: 'Kategori Bulunamadi' }
  return {
    title: data.category.seo_title || `${data.category.name} Haberleri`,
    description: data.category.seo_description || `${data.category.name} kategorisindeki en guncel haberler`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { categorySlug } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const data = await getCategoryData(categorySlug, page)
  if (!data) notFound()

  const totalPages = Math.ceil(data.total / data.perPage)

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{data.category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{data.category.name}</h1>
        {data.category.description && <p className="mt-2 text-lg text-muted-foreground">{data.category.description}</p>}
        <p className="mt-2 text-sm text-muted-foreground">{data.total} haber</p>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.articles.map((a) => {
          const cover = a.cover_image as { file_url?: string; alt_text?: string } | null
          const cat = a.category as { name: string; slug: string } | null
          const auth = a.author as { full_name: string; display_name?: string } | null
          return (
            <ArticleCard
              key={a.id as string}
              title={a.title as string}
              slug={a.slug as string}
              summary={a.summary as string | null}
              coverImageUrl={cover?.file_url ?? null}
              coverImageAlt={cover?.alt_text ?? null}
              categoryName={cat?.name ?? ''}
              categorySlug={cat?.slug ?? ''}
              authorName={auth?.display_name ?? auth?.full_name ?? ''}
              publishedAt={a.published_at as string | null}
              variant="featured"
            />
          )
        })}
      </div>

      {data.articles.length === 0 && <p className="py-12 text-center text-muted-foreground">Bu kategoride henuz haber yok</p>}

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/kategori/${categorySlug}`} />
    </main>
  )
}

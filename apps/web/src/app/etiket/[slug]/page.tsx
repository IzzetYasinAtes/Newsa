import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'
import type { Metadata } from 'next'

async function getTagData(slug: string, page: number) {
  try {
    const supabase = await createServerClient()

    const tagResult = await supabase.from('tags').select('id, name, slug').eq('slug', slug).single()
    const tag = tagResult.data as unknown as { id: string; name: string; slug: string } | null
    if (!tag) return null

    const perPage = 12
    const from = (page - 1) * perPage

    // Fetch published articles and filter by tag
    // When Supabase types are auto-generated, this can use a proper join via article_tags
    const { data: articles, count } = await supabase
      .from('articles')
      .select('id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, from + perPage - 1)

    return { tag, articles: (articles ?? []) as unknown as Record<string, unknown>[], total: count ?? 0, perPage }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await getTagData(slug, 1)
  if (!data) return { title: 'Etiket Bulunamadi' }
  return {
    title: `#${data.tag.name} Haberleri`,
    description: `${data.tag.name} etiketli en guncel haberler`,
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const data = await getTagData(slug, page)
  if (!data) notFound()

  const totalPages = Math.ceil(data.total / data.perPage)

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">#{data.tag.name}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.articles.map((a) => {
          const cover = a.cover_image as { file_url?: string; alt_text?: string } | null
          const cat = a.category as { name: string; slug: string }
          const auth = a.author as { full_name: string; display_name?: string }
          return (
            <ArticleCard
              key={a.id as string}
              title={a.title as string}
              slug={a.slug as string}
              summary={a.summary as string | null}
              coverImageUrl={cover?.file_url ?? null}
              coverImageAlt={cover?.alt_text ?? null}
              categoryName={cat.name}
              categorySlug={cat.slug}
              authorName={auth.display_name ?? auth.full_name}
              publishedAt={a.published_at as string | null}
            />
          )
        })}
      </div>

      {data.articles.length === 0 && <p className="py-12 text-center text-muted-foreground">Bu etikette henuz haber yok</p>}

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/etiket/${slug}`} />
    </main>
  )
}

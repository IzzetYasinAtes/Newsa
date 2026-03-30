import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'
import type { Metadata } from 'next'

interface AuthorRow {
  id: string
  full_name: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

async function getAuthorData(id: string, page: number) {
  try {
    const supabase = await createServerClient()

    const { data: rawAuthor } = await supabase.from('profiles').select('*').eq('id', id).single()
    const author = rawAuthor as unknown as AuthorRow | null
    if (!author) return null

    const perPage = 12
    const from = (page - 1) * perPage
    const { data: articles, count } = await supabase
      .from('articles')
      .select('id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)', { count: 'exact' })
      .eq('author_id', id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, from + perPage - 1)

    return { author, articles: (articles ?? []) as unknown as Record<string, unknown>[], total: count ?? 0, perPage }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const data = await getAuthorData(id, 1)
  if (!data) return { title: 'Yazar Bulunamadi' }
  const name = data.author.display_name || data.author.full_name
  return {
    title: `${name} - Yazilari`,
    description: data.author.bio || `${name} tarafindan yazilan haberler`,
  }
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const data = await getAuthorData(id, page)
  if (!data) notFound()

  const totalPages = Math.ceil(data.total / data.perPage)
  const displayName = data.author.display_name || data.author.full_name

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Author header */}
      <div className="mb-8 flex items-start gap-4">
        {data.author.avatar_url && (
          <img
            src={data.author.avatar_url}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {data.author.bio && <p className="mt-2 text-muted-foreground">{data.author.bio}</p>}
          <p className="mt-1 text-sm text-muted-foreground">{data.total} haber</p>
        </div>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            />
          )
        })}
      </div>

      {data.articles.length === 0 && <p className="py-12 text-center text-muted-foreground">Bu yazarin henuz yayinlanmis haberi yok</p>}

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/yazar/${id}`} />
    </main>
  )
}

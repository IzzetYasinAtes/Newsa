import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
      .select('id, title, slug, summary, published_at, view_count, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)', { count: 'exact' })
      .eq('author_id', id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, from + perPage - 1)

    // Calculate total views across all articles
    const { data: viewData } = await supabase
      .from('articles')
      .select('view_count')
      .eq('author_id', id)
      .eq('status', 'published')

    const totalViews = (viewData ?? []).reduce((sum, row) => sum + ((row as { view_count: number }).view_count || 0), 0)

    return { author, articles: (articles ?? []) as unknown as Record<string, unknown>[], total: count ?? 0, perPage, totalViews }
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
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{displayName}</span>
      </nav>

      {/* Author header */}
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {data.author.avatar_url ? (
          <Image
            src={data.author.avatar_url}
            alt={displayName}
            width={120}
            height={120}
            className="h-28 w-28 flex-shrink-0 rounded-full object-cover ring-4 ring-border"
          />
        ) : (
          <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-muted ring-4 ring-border">
            <span className="text-3xl font-bold text-muted-foreground">{displayName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{displayName}</h1>
          {data.author.bio && <p className="mt-2 max-w-2xl text-muted-foreground">{data.author.bio}</p>}
          <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
            <div className="text-center">
              <p className="text-2xl font-bold">{data.total}</p>
              <p className="text-sm text-muted-foreground">Haber</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold">{data.totalViews.toLocaleString('tr-TR')}</p>
              <p className="text-sm text-muted-foreground">Toplam G\u00f6r\u00fcnt\u00fclenme</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <h2 className="mb-6 text-xl font-bold">Haberleri</h2>

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

      {data.articles.length === 0 && <p className="py-12 text-center text-muted-foreground">Bu yazarin henuz yayinlanmis haberi yok</p>}

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/yazar/${id}`} />
    </main>
  )
}

import type { Metadata } from 'next'
import { createServerClient } from '@newsa/supabase/client/server'
import { ArticleCard } from '@/components/ArticleCard'
import { SearchForm } from './_components/SearchForm'

interface SearchResult {
  id: string
  title: string
  slug: string
  summary: string | null
  published_at: string | null
  cover_image: { file_url?: string; alt_text?: string } | null
  category: { name: string; slug: string } | null
  author: { full_name: string; display_name?: string } | null
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  const title = q ? `"${q}" için arama sonuçları` : 'Haber Ara'
  return {
    title,
    description: q
      ? `${q} ile ilgili haberler Newsa'da`
      : 'Newsa haber arama sayfası',
    robots: { index: false, follow: true },
  }
}

async function searchArticles(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('articles')
      .select(
        'id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)'
      )
      .eq('status', 'published')
      .ilike('title', `%${query}%`)
      .order('published_at', { ascending: false })
      .limit(30)

    return (data ?? []) as unknown as SearchResult[]
  } catch {
    return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = await searchArticles(query)
  const hasSearched = query.length > 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Haber Ara</h1>

      <SearchForm initialQuery={query} />

      {/* Arama yapılmadıysa ipucu */}
      {!hasSearched && (
        <p className="py-12 text-center text-muted-foreground">
          Aramak istediğiniz kelimeyi yukarıya yazın
        </p>
      )}

      {/* Sonuç bulunamadı */}
      {hasSearched && results.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          &ldquo;{query}&rdquo; aramanızla eşleşen haber bulunamadı
        </p>
      )}

      {/* Sonuçlar */}
      {results.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            <strong>{results.length}</strong> sonuç bulundu
            {query && <> &mdash; &ldquo;{query}&rdquo; için</>}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                summary={article.summary}
                coverImageUrl={article.cover_image?.file_url ?? null}
                coverImageAlt={article.cover_image?.alt_text ?? null}
                categoryName={article.category?.name ?? ''}
                categorySlug={article.category?.slug ?? ''}
                authorName={
                  article.author?.display_name ?? article.author?.full_name ?? ''
                }
                publishedAt={article.published_at}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}

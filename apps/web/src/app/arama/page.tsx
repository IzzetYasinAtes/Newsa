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
  const title = q ? `"${q}" icin arama sonuclari` : 'Haber Ara'
  return {
    title,
    description: q
      ? `${q} ile ilgili haberler Newsa'da`
      : 'Newsa haber arama sayfasi',
    robots: { index: false, follow: true },
  }
}

async function searchArticles(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  try {
    const supabase = await createServerClient()
    const sanitized = query.replace(/[%_]/g, '')
    const { data } = await supabase
      .from('articles')
      .select(
        'id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)'
      )
      .eq('status', 'published')
      .or(`title.ilike.%${sanitized}%,summary.ilike.%${sanitized}%`)
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
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Search header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold">Haber Ara</h1>
        <SearchForm initialQuery={query} />
      </div>

      {/* No search yet */}
      {!hasSearched && (
        <p className="py-12 text-center text-muted-foreground">
          Aramak istediginiz kelimeyi yukariya yazin
        </p>
      )}

      {/* No results */}
      {hasSearched && results.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            &ldquo;{query}&rdquo; aramanizla eslesen haber bulunamadi
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Farkli kelimelerle tekrar deneyin</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            <strong>{results.length}</strong> sonuc bulundu
            {query && <> &mdash; &ldquo;{query}&rdquo; icin</>}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                variant="featured"
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}

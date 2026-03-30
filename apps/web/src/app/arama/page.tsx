'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { createBrowserClient } from '@newsa/supabase/client/browser'
import { ArticleCard } from '@/components/ArticleCard'

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

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setSearched(true)

    try {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from('articles')
        .select('id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)')
        .eq('status', 'published')
        .textSearch('title', trimmed, { type: 'websearch' })
        .order('published_at', { ascending: false })
        .limit(20)

      setResults((data ?? []) as unknown as SearchResult[])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query])

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Haber Ara</h1>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Haber ara..."
          className="flex-1 rounded-md border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          aria-label="Arama sorgusu"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Araniyor...' : 'Ara'}
        </button>
      </form>

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          &quot;{query}&quot; icin sonuc bulunamadi
        </p>
      )}

      {results.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{results.length} sonuc bulundu</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                summary={a.summary}
                coverImageUrl={a.cover_image?.file_url ?? null}
                coverImageAlt={a.cover_image?.alt_text ?? null}
                categoryName={a.category?.name ?? ''}
                categorySlug={a.category?.slug ?? ''}
                authorName={a.author?.display_name ?? a.author?.full_name ?? ''}
                publishedAt={a.published_at}
              />
            ))}
          </div>
        </>
      )}

      {!searched && (
        <p className="py-12 text-center text-muted-foreground">
          Aramak istediginiz kelimeyi yukariya yazin
        </p>
      )}
    </main>
  )
}

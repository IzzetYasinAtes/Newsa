'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ArticleCard } from './ArticleCard'

interface ArticleData {
  id: string
  title: string
  slug: string
  summary: string | null
  status: string
  published_at: string | null
  view_count?: number
  cover_image: { file_url: string; alt_text: string | null } | null
  category: { name: string; slug: string } | null
  author: { full_name: string | null; display_name: string | null } | null
}

interface LoadMoreArticlesProps {
  initialArticles: ArticleData[]
}

const ARTICLE_SELECT =
  'id, title, slug, summary, status, published_at, view_count, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)'

const PAGE_SIZE = 12

export function LoadMoreArticles({ initialArticles }: LoadMoreArticlesProps) {
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialArticles.length >= PAGE_SIZE)

  async function loadMore() {
    setLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data } = await supabase
        .from('articles')
        .select(ARTICLE_SELECT)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(from, to)

      if (data) {
        const typedData = data as unknown as ArticleData[]
        setArticles((prev) => [...prev, ...typedData])
        setPage((p) => p + 1)
        if (typedData.length < PAGE_SIZE) setHasMore(false)
      } else {
        setHasMore(false)
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((a) => (
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
            viewCount={a.view_count}
            variant="featured"
          />
        ))}
      </div>
      {articles.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold">Newsa</h2>
          <p className="mt-2 text-muted-foreground">
            Haber Platformu — Henuz yayinlanmis haber yok
          </p>
        </div>
      )}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Yukleniyor...
              </>
            ) : (
              'Daha Fazla Yukle'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

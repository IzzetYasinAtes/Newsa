import { createServerClient } from '@newsa/supabase'
import { ArticleCard } from '@/components/ArticleCard'

// Revalidate every 60 seconds (ISR) — serves cached version for performance
export const revalidate = 60

async function getHomeData() {
  try {
    const supabase = await createServerClient()

    const [headlines, featured, latest] = await Promise.all([
      supabase
        .from('articles')
        .select('id, title, slug, summary, status, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)')
        .eq('is_headline', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('articles')
        .select('id, title, slug, summary, status, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('featured_order')
        .limit(6),
      supabase
        .from('articles')
        .select('id, title, slug, summary, status, published_at, view_count, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12),
    ])

    return {
      headlines: (headlines.data ?? []) as unknown as Record<string, unknown>[],
      featured: (featured.data ?? []) as unknown as Record<string, unknown>[],
      latest: (latest.data ?? []) as unknown as Record<string, unknown>[],
    }
  } catch {
    return { headlines: [], featured: [], latest: [] }
  }
}

function extractArticleProps(article: Record<string, unknown>) {
  const cover = article.cover_image as { file_url?: string; alt_text?: string } | null
  const cat = article.category as { name?: string; slug?: string } | null
  const auth = article.author as { full_name?: string; display_name?: string } | null
  return {
    title: article.title as string,
    slug: article.slug as string,
    summary: article.summary as string | null,
    coverImageUrl: cover?.file_url ?? null,
    coverImageAlt: cover?.alt_text ?? null,
    categoryName: cat?.name ?? '',
    categorySlug: cat?.slug ?? '',
    authorName: auth?.display_name ?? auth?.full_name ?? '',
    publishedAt: article.published_at as string | null,
  }
}

export default async function HomePage() {
  const { headlines, featured, latest } = await getHomeData()

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Headlines */}
      {headlines.length > 0 && (
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {headlines.slice(0, 1).map((a) => (
              <ArticleCard key={a.id as string} {...extractArticleProps(a as Record<string, unknown>)} variant="hero" />
            ))}
            <div className="grid gap-4">
              {headlines.slice(1, 3).map((a) => (
                <ArticleCard key={a.id as string} {...extractArticleProps(a as Record<string, unknown>)} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">One Cikanlar</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <ArticleCard key={a.id as string} {...extractArticleProps(a as Record<string, unknown>)} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Son Haberler</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.id as string} {...extractArticleProps(a as Record<string, unknown>)} />
          ))}
        </div>
        {latest.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold">Newsa</h2>
            <p className="mt-2 text-muted-foreground">Haber Platformu -- Henuz yayinlanmis haber yok</p>
          </div>
        )}
      </section>
    </main>
  )
}

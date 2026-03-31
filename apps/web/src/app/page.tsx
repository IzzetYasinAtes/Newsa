import Link from 'next/link'
import { createServerClient } from '@newsa/supabase'
import { ArticleCard } from '@/components/ArticleCard'
import { AdZone } from '@/components/ads/AdZone'

// Revalidate every 60 seconds (ISR) — serves cached version for performance
export const revalidate = 60

// ─── Types ───

interface ArticleRow {
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

interface BreakingArticle {
  id: string
  title: string
  slug: string
  category: { slug: string } | null
}

interface MostReadArticle {
  id: string
  title: string
  slug: string
  published_at: string | null
  view_count: number
  category: { name: string; slug: string } | null
}

interface TagRow {
  id: string
  name: string
  slug: string
}

// ─── Data Fetching ───

const ARTICLE_SELECT =
  'id, title, slug, summary, status, published_at, view_count, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)'

async function getHomeData() {
  try {
    const supabase = await createServerClient()

    const [headlines, featured, latest, breaking, mostRead, trendTags] =
      await Promise.all([
        // Mansetler (is_headline=true, limit 3)
        supabase
          .from('articles')
          .select(ARTICLE_SELECT)
          .eq('is_headline', true)
          .eq('status', 'published')
          .order('headline_order')
          .limit(3),

        // One cikanlar (is_featured=true, limit 6)
        supabase
          .from('articles')
          .select(ARTICLE_SELECT)
          .eq('is_featured', true)
          .eq('status', 'published')
          .order('featured_order')
          .limit(6),

        // Son haberler (published, limit 12)
        supabase
          .from('articles')
          .select(ARTICLE_SELECT)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(12),

        // Son dakika (is_breaking=true)
        supabase
          .from('articles')
          .select(
            'id, title, slug, category:categories!articles_category_id_fkey(slug)'
          )
          .eq('is_breaking', true)
          .eq('status', 'published')
          .limit(5),

        // En cok okunan (view_count DESC, limit 5)
        supabase
          .from('articles')
          .select(
            'id, title, slug, published_at, view_count, category:categories!articles_category_id_fkey(name, slug)'
          )
          .eq('status', 'published')
          .order('view_count', { ascending: false })
          .limit(5),

        // Trend etiketler
        supabase.from('tags').select('id, name, slug').limit(12),
      ])

    if (headlines.error) console.error('headlines error:', headlines.error)
    if (featured.error) console.error('featured error:', featured.error)
    if (latest.error) console.error('latest error:', latest.error)
    if (breaking.error) console.error('breaking error:', breaking.error)
    if (mostRead.error) console.error('mostRead error:', mostRead.error)
    if (trendTags.error) console.error('trendTags error:', trendTags.error)

    return {
      headlines: (headlines.data ?? []) as unknown as ArticleRow[],
      featured: (featured.data ?? []) as unknown as ArticleRow[],
      latest: (latest.data ?? []) as unknown as ArticleRow[],
      breaking: (breaking.data ?? []) as unknown as BreakingArticle[],
      mostRead: (mostRead.data ?? []) as unknown as MostReadArticle[],
      trendTags: (trendTags.data ?? []) as unknown as TagRow[],
    }
  } catch (err) {
    console.error('getHomeData error:', err)
    return {
      headlines: [],
      featured: [],
      latest: [],
      breaking: [],
      mostRead: [],
      trendTags: [],
    }
  }
}

// ─── Helper ───

function extractArticleProps(article: ArticleRow) {
  return {
    title: article.title,
    slug: article.slug,
    summary: article.summary ?? null,
    coverImageUrl: article.cover_image?.file_url ?? null,
    coverImageAlt: article.cover_image?.alt_text ?? null,
    categoryName: article.category?.name ?? '',
    categorySlug: article.category?.slug ?? '',
    authorName:
      article.author?.display_name ?? article.author?.full_name ?? '',
    publishedAt: article.published_at ?? null,
    viewCount: article.view_count,
  }
}

// ─── BreakingNewsBanner ───

function BreakingNewsBanner({
  articles,
}: {
  articles: BreakingArticle[]
}) {
  // Duplicate items so the marquee loops seamlessly
  const doubled = [...articles, ...articles]

  return (
    <div className="overflow-hidden bg-red-600 text-white" role="marquee" aria-label="Son dakika haberleri">
      <div className="flex items-center">
        <span className="flex-shrink-0 bg-red-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wide sm:px-4 sm:py-2 sm:text-sm">
          Son Dakika
        </span>
        <div className="relative flex-1 overflow-hidden py-2">
          <div className="animate-marquee flex whitespace-nowrap">
            {doubled.map((a, i) => {
              const href = a.category?.slug
                ? `/kategori/${a.category.slug}/${a.slug}`
                : `/${a.slug}`
              return (
                <Link
                  key={`${a.id}-${i}`}
                  href={href}
                  className="mx-4 inline-block text-xs font-medium hover:underline sm:mx-6 sm:text-sm"
                >
                  {a.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MostReadWidget ───

function MostReadWidget({ articles }: { articles: MostReadArticle[] }) {
  if (articles.length === 0) return null

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">En Cok Okunanlar</h2>
      <div className="space-y-1">
        {articles.map((a, idx) => (
          <ArticleCard
            key={a.id}
            title={a.title}
            slug={a.slug}
            categoryName={a.category?.name ?? ''}
            categorySlug={a.category?.slug ?? ''}
            authorName=""
            publishedAt={a.published_at}
            viewCount={a.view_count}
            variant="minimal"
            rank={idx + 1}
          />
        ))}
      </div>
    </div>
  )
}

// ─── TrendingTagsWidget ───

function TrendingTagsWidget({ tags }: { tags: TagRow[] }) {
  if (tags.length === 0) return null

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Trend Etiketler</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/etiket/${tag.slug}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Page ───

export default async function HomePage() {
  const { headlines, featured, latest, breaking, mostRead, trendTags } =
    await getHomeData()

  return (
    <main>
      {/* Son Dakika Bandi */}
      {breaking.length > 0 && <BreakingNewsBanner articles={breaking} />}

      {/* Manset Bolumu */}
      {headlines.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Sol: buyuk manset (2/3) */}
            <div className="lg:col-span-2">
              {headlines[0] && (
                <ArticleCard
                  {...extractArticleProps(headlines[0])}
                  variant="hero"
                />
              )}
            </div>
            {/* Sag: 2 kucuk manset (1/3) */}
            <div className="flex flex-col gap-4">
              {headlines.slice(1, 3).map((h) => (
                <ArticleCard
                  key={h.id}
                  {...extractArticleProps(h)}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Icerik + Sidebar */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Sol: Ana Icerik (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* One Cikanlar */}
            {featured.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-bold sm:text-xl">Öne Çıkanlar</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {featured.map((f) => (
                    <ArticleCard
                      key={f.id}
                      {...extractArticleProps(f)}
                      variant="featured"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Son Haberler */}
            <div>
              <h2 className="mb-4 text-lg font-bold sm:text-xl">Son Haberler</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {latest.map((l) => (
                  <ArticleCard
                    key={l.id}
                    {...extractArticleProps(l)}
                    variant="featured"
                  />
                ))}
              </div>
              {latest.length === 0 && (
                <div className="py-20 text-center">
                  <h2 className="text-2xl font-bold">Newsa</h2>
                  <p className="mt-2 text-muted-foreground">
                    Haber Platformu — Henüz yayınlanmış haber yok
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sag: Sidebar (1/3) */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <MostReadWidget articles={mostRead} />
            <TrendingTagsWidget tags={trendTags} />
            <AdZone zone="sidebar-rectangle" />
          </aside>
        </div>
      </section>
    </main>
  )
}

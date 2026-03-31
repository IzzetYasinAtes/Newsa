import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getReadingTime } from '@newsa/shared'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { AdZone } from '@/components/ads/AdZone'
import { ArticleCard } from '@/components/ArticleCard'

// Revalidate every 5 minutes (ISR) — article content is relatively stable
export const revalidate = 300

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

interface ArticleDetail {
  id: string
  title: string
  slug: string
  summary: string | null
  content_html: string | null
  published_at: string | null
  view_count: number
  category_id: string | null
  author_id: string | null
  seo_title: string | null
  seo_description: string | null
  canonical_url: string | null
  source_name: string | null
  source_url: string | null
  category: { name: string; slug: string } | null
  author: { full_name: string; display_name: string | null; avatar_url: string | null; bio: string | null } | null
  cover_image: { file_url: string; alt_text: string | null } | null
}

interface TagItem {
  id: string
  name: string
  slug: string
}

interface RelatedArticle {
  id: string
  title: string
  slug: string
  summary: string | null
  published_at: string | null
  cover_image: { file_url: string; alt_text: string | null } | null
  category: { name: string; slug: string } | null
  author: { full_name: string; display_name: string | null } | null
}

interface PopularArticle {
  id: string
  title: string
  slug: string
  published_at: string | null
  view_count: number
  category: { name: string; slug: string } | null
}

async function getArticle(slug: string) {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('articles')
      .select(`
        id, title, slug, summary, content_html, published_at, view_count,
        category_id, author_id,
        seo_title, seo_description, canonical_url, source_name, source_url,
        category:categories!articles_category_id_fkey(name, slug),
        author:profiles!articles_author_id_fkey(full_name, display_name, avatar_url, bio),
        cover_image:media!articles_cover_image_id_fkey(file_url, alt_text)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!data) return null

    const article = data as unknown as ArticleDetail

    // Fetch tags for this article via junction table
    const { data: tagRows } = await supabase
      .from('article_tags')
      .select('tag:tags!article_tags_tag_id_fkey(id, name, slug)')
      .eq('article_id', (data as unknown as { id: string }).id)

    const tags = ((tagRows ?? [])
      .map((r) => (r as unknown as { tag: TagItem | null }).tag)
      .filter(Boolean)) as TagItem[]

    // Fetch related articles (same category)
    let relatedArticles: RelatedArticle[] = []
    if (article.category_id) {
      const { data: related } = await supabase
        .from('articles')
        .select('id, title, slug, summary, published_at, cover_image:media!articles_cover_image_id_fkey(file_url, alt_text), category:categories!articles_category_id_fkey(name, slug), author:profiles!articles_author_id_fkey(full_name, display_name)')
        .eq('category_id', article.category_id)
        .eq('status', 'published')
        .neq('id', article.id)
        .order('published_at', { ascending: false })
        .limit(4)

      relatedArticles = (related ?? []) as unknown as RelatedArticle[]
    }

    // Fetch most popular articles (sidebar)
    const { data: popular } = await supabase
      .from('articles')
      .select('id, title, slug, published_at, view_count, category:categories!articles_category_id_fkey(name, slug)')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(5)

    const popularArticles = (popular ?? []) as unknown as PopularArticle[]

    return { article, tags, relatedArticles, popularArticles }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ articleSlug: string }> }): Promise<Metadata> {
  const { articleSlug } = await params
  const result = await getArticle(articleSlug)
  if (!result) return { title: 'Haber Bulunamadi' }

  const { article } = result

  const authorName = article.author?.display_name ?? article.author?.full_name ?? undefined
  const categoryName = article.category?.name ?? undefined
  const coverImageUrl = article.cover_image?.file_url ?? undefined

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary || undefined,
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary || undefined,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      ...(authorName ? { authors: [authorName] } : {}),
      ...(categoryName ? { section: categoryName } : {}),
      ...(coverImageUrl ? { images: [{ url: coverImageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary || undefined,
      ...(coverImageUrl ? { images: [coverImageUrl] } : {}),
    },
    ...(article.canonical_url ? { alternates: { canonical: article.canonical_url } } : {}),
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ categorySlug: string; articleSlug: string }> }) {
  const { categorySlug, articleSlug } = await params
  const result = await getArticle(articleSlug)
  if (!result) notFound()

  const { article, tags, relatedArticles, popularArticles } = result
  const { category, author, cover_image: cover } = article
  const readingTime = article.content_html ? getReadingTime(article.content_html) : 1

  const articleUrl = `${SITE_URL}/kategori/${categorySlug}/${articleSlug}`
  const shareUrl = encodeURIComponent(articleUrl)
  const shareTitle = encodeURIComponent(article.title)

  const newsArticleJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary ?? undefined,
    url: article.canonical_url ?? articleUrl,
    datePublished: article.published_at ?? undefined,
    dateModified: article.published_at ?? undefined,
    ...(cover?.file_url ? { image: [cover.file_url] } : {}),
    ...(author
      ? {
          author: {
            '@type': 'Person',
            name: author.display_name ?? author.full_name,
          },
        }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Newsa',
      url: SITE_URL,
    },
    ...(article.source_name
      ? {
          sourceOrganization: {
            '@type': 'Organization',
            name: article.source_name,
            ...(article.source_url ? { url: article.source_url } : {}),
          },
        }
      : {}),
  }

  const breadcrumbJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
      ...(category
        ? [{ '@type': 'ListItem', position: 2, name: category.name, item: `${SITE_URL}/kategori/${category.slug}` }]
        : []),
      { '@type': 'ListItem', position: category ? 3 : 2, name: article.title, item: articleUrl },
    ],
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 overflow-hidden text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
        <span aria-hidden="true">/</span>
        {category && (
          <>
            <Link href={`/kategori/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="line-clamp-1 text-foreground">{article.title}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content — 2/3 */}
        <article className="min-w-0 lg:w-2/3">
          {/* Category badge */}
          {category && (
            <Link href={`/kategori/${category.slug}`} className="mb-3 inline-block rounded bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{article.title}</h1>

          {/* Summary */}
          {article.summary && <p className="mt-3 text-base text-muted-foreground sm:text-lg">{article.summary}</p>}

          {/* Author & meta */}
          <div className="mt-4 flex items-center gap-3 border-b pb-4">
            {author?.avatar_url && (
              <Image src={author.avatar_url} alt={author.display_name ?? author.full_name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
            )}
            <div>
              {author && article.author_id ? (
                <Link href={`/yazar/${article.author_id}`} className="font-medium hover:text-primary">
                  {author.display_name ?? author.full_name}
                </Link>
              ) : (
                <p className="font-medium">{author?.display_name ?? author?.full_name}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {article.published_at && formatDate(article.published_at)}
                {' \u2022 '}{readingTime} dk okuma
                {' \u2022 '}{article.view_count.toLocaleString('tr-TR')} g\u00f6r\u00fcnt\u00fclenme
              </p>
            </div>
          </div>

          {/* Cover image */}
          {cover && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src={cover.file_url}
                alt={cover.alt_text ?? article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
                placeholder="empty"
                quality={75}
              />
            </div>
          )}

          {/* Content */}
          {article.content_html && (
            <div className="prose prose-base mt-6 max-w-none dark:prose-invert sm:prose-lg" dangerouslySetInnerHTML={{ __html: article.content_html }} />
          )}

          {/* In-Article Reklam */}
          <AdZone zone="in-article" className="my-6" />

          {/* Source */}
          {article.source_name && (
            <p className="mt-6 text-sm text-muted-foreground">
              Kaynak: {article.source_url ? <a href={article.source_url} target="_blank" rel="nofollow noopener" className="text-primary hover:underline">{article.source_name}</a> : article.source_name}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/etiket/${tag.slug}`} className="rounded-full border px-3 py-1 text-sm hover:bg-accent">
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share buttons */}
          <div className="mt-6 flex items-center gap-3 border-t pt-4">
            <span className="text-sm font-medium text-muted-foreground">Payla\u015f:</span>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener" className="rounded-full border p-2 text-sm hover:bg-accent" aria-label="Twitter'da paylas">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="rounded-full border p-2 text-sm hover:bg-accent" aria-label="Facebook'ta paylas">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" className="rounded-full border p-2 text-sm hover:bg-accent" aria-label="WhatsApp'ta paylas">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold sm:text-xl">Ilgili Haberler</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedArticles.map((ra) => (
                  <ArticleCard
                    key={ra.id}
                    title={ra.title}
                    slug={ra.slug}
                    summary={ra.summary}
                    coverImageUrl={ra.cover_image?.file_url ?? null}
                    coverImageAlt={ra.cover_image?.alt_text ?? null}
                    categoryName={ra.category?.name ?? ''}
                    categorySlug={ra.category?.slug ?? ''}
                    authorName={ra.author?.display_name ?? ra.author?.full_name ?? ''}
                    publishedAt={ra.published_at}
                    variant="featured"
                  />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar — 1/3 */}
        <aside className="lg:w-1/3">
          <div className="sticky top-20 space-y-6">
            {/* Most popular */}
            {popularArticles.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <h2 className="mb-3 text-lg font-bold">En Cok Okunanlar</h2>
                <div className="space-y-0">
                  {popularArticles.map((pa, idx) => (
                    <ArticleCard
                      key={pa.id}
                      title={pa.title}
                      slug={pa.slug}
                      categoryName={pa.category?.name ?? ''}
                      categorySlug={pa.category?.slug ?? ''}
                      authorName=""
                      publishedAt={pa.published_at}
                      viewCount={pa.view_count}
                      variant="minimal"
                      rank={idx + 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar Ad */}
            <AdZone zone="sidebar" className="rounded-xl" />
          </div>
        </aside>
      </div>

      {/* JSON-LD Structured Data */}
      <JsonLd data={newsArticleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </div>
  )
}

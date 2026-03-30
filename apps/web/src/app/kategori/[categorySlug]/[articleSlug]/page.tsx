import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getReadingTime } from '@newsa/shared'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { AdZone } from '@/components/ads/AdZone'

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

async function getArticle(slug: string) {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('articles')
      .select(`
        id, title, slug, summary, content_html, published_at, view_count,
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

    return { article, tags }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ articleSlug: string }> }): Promise<Metadata> {
  const { articleSlug } = await params
  const result = await getArticle(articleSlug)
  if (!result) return { title: 'Haber Bulunamadi' }

  const { article } = result

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary || undefined,
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary || undefined,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      ...(article.cover_image?.file_url ? { images: [{ url: article.cover_image.file_url, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: 'summary_large_image' },
    ...(article.canonical_url ? { alternates: { canonical: article.canonical_url } } : {}),
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ categorySlug: string; articleSlug: string }> }) {
  const { categorySlug, articleSlug } = await params
  const result = await getArticle(articleSlug)
  if (!result) notFound()

  const { article, tags } = result
  const { category, author, cover_image: cover } = article
  const readingTime = article.content_html ? getReadingTime(article.content_html) : 1

  const articleUrl = `${SITE_URL}/kategori/${categorySlug}/${articleSlug}`

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
    <article className="mx-auto max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
        <span>/</span>
        {category && <Link href={`/kategori/${category.slug}`} className="hover:text-foreground">{category.name}</Link>}
      </nav>

      {/* Category badge */}
      {category && (
        <Link href={`/kategori/${category.slug}`} className="mb-3 inline-block rounded bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          {category.name}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold leading-tight md:text-4xl">{article.title}</h1>

      {/* Summary */}
      {article.summary && <p className="mt-3 text-lg text-muted-foreground">{article.summary}</p>}

      {/* Author & meta */}
      <div className="mt-4 flex items-center gap-3 border-b pb-4">
        {author?.avatar_url && (
          <Image src={author.avatar_url} alt={author.display_name ?? author.full_name} width={40} height={40} className="rounded-full object-cover" />
        )}
        <div>
          <p className="font-medium">{author?.display_name ?? author?.full_name}</p>
          <p className="text-sm text-muted-foreground">
            {article.published_at && formatDate(article.published_at)}
            {' • '}{readingTime} dk okuma
            {' • '}{article.view_count} goruntuleme
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
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      {article.content_html && (
        <div className="prose prose-lg mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: article.content_html }} />
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
      <div className="mt-6 flex gap-3 border-t pt-4">
        <span className="text-sm text-muted-foreground">Paylas:</span>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener" className="text-sm text-primary hover:underline">Twitter</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener" className="text-sm text-primary hover:underline">Facebook</a>
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener" className="text-sm text-primary hover:underline">WhatsApp</a>
      </div>

      {/* JSON-LD Structured Data */}
      <JsonLd data={newsArticleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </article>
  )
}

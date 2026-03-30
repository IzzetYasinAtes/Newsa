import type { MetadataRoute } from 'next'
import { createServerClient } from '@newsa/supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

interface ArticleRow {
  slug: string
  updated_at: string | null
  published_at: string | null
  category: { slug: string } | null
}

interface CategoryRow {
  slug: string
  updated_at: string | null
}

interface TagRow {
  slug: string
  updated_at: string | null
}

interface ProfileRow {
  id: string
  updated_at: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/arama`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  // Published articles
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('slug, updated_at, published_at, category:categories!articles_category_id_fkey(slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const articles = rawArticles as unknown as ArticleRow[] | null

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((article) => {
    const cat = article.category
    const url = cat
      ? `${SITE_URL}/kategori/${cat.slug}/${article.slug}`
      : `${SITE_URL}/haber/${article.slug}`
    return {
      url,
      lastModified: new Date(article.updated_at ?? article.published_at ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  // Active categories
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)

  const categories = rawCategories as unknown as CategoryRow[] | null

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${SITE_URL}/kategori/${cat.slug}`,
    lastModified: new Date(cat.updated_at ?? Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Tags
  const { data: rawTags } = await supabase
    .from('tags')
    .select('slug, updated_at')

  const tags = rawTags as unknown as TagRow[] | null

  const tagRoutes: MetadataRoute.Sitemap = (tags ?? []).map((tag) => ({
    url: `${SITE_URL}/etiket/${tag.slug}`,
    lastModified: new Date(tag.updated_at ?? Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Author profiles
  const { data: rawAuthors } = await supabase
    .from('profiles')
    .select('id, updated_at')
    .eq('role', 'author')

  const authors = rawAuthors as unknown as ProfileRow[] | null

  const authorRoutes: MetadataRoute.Sitemap = (authors ?? []).map((author) => ({
    url: `${SITE_URL}/yazar/${author.id}`,
    lastModified: new Date(author.updated_at ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }))

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...tagRoutes, ...authorRoutes]
}

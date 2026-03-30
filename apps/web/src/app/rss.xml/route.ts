import { createServerClient } from '@newsa/supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const SITE_NAME = 'Newsa'
const SITE_DESCRIPTION = 'Son dakika haberleri ve güncel haberler'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const supabase = await createServerClient()

  interface RssArticle {
    id: string
    title: string
    slug: string
    summary: string | null
    published_at: string | null
    category: { name: string; slug: string } | null
    author: { full_name: string; display_name: string | null } | null
    cover_image: { file_url: string; alt_text: string | null } | null
  }

  const { data: rawArticles } = await supabase
    .from('articles')
    .select(`
      id, title, slug, summary, published_at,
      category:categories!articles_category_id_fkey(name, slug),
      author:profiles!articles_author_id_fkey(full_name, display_name),
      cover_image:media!articles_cover_image_id_fkey(file_url, alt_text)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const articles = rawArticles as unknown as RssArticle[] | null

  const items = (articles ?? [])
    .map((article) => {
      const cat = article.category
      const author = article.author
      const cover = article.cover_image

      const url = cat
        ? `${SITE_URL}/kategori/${cat.slug}/${article.slug}`
        : `${SITE_URL}/haber/${article.slug}`

      const pubDate = article.published_at
        ? new Date(article.published_at).toUTCString()
        : new Date().toUTCString()

      const authorName = author?.display_name ?? author?.full_name ?? ''

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      ${article.summary ? `<description>${escapeXml(article.summary)}</description>` : ''}
      <pubDate>${pubDate}</pubDate>
      ${authorName ? `<author>${escapeXml(authorName)}</author>` : ''}
      ${cat ? `<category>${escapeXml(cat.name)}</category>` : ''}
      ${cover?.file_url ? `<enclosure url="${escapeXml(cover.file_url)}" type="image/jpeg" length="0" />` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}

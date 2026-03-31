import { createServerClient } from '@newsa/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageRow {
  id: string
  title: string
  slug: string
  content_html: string | null
  status: string
  seo_title: string | null
  seo_description: string | null
}

async function getPage(slug: string): Promise<PageRow | null> {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('pages')
      .select('id, title, slug, content_html, status, seo_title, seo_description')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    return (data as unknown as PageRow) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return { title: 'Sayfa Bulunamadi' }
  }

  const title = page.seo_title ?? page.title
  const description =
    page.seo_description ?? `${page.title} - Newsa Haber Platformu`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground">
              Anasayfa
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <span className="text-foreground">{page.title}</span>
          </li>
        </ol>
      </nav>

      {/* Baslik */}
      <h1 className="mb-8 text-3xl font-bold">{page.title}</h1>

      {/* Icerik */}
      {page.content_html ? (
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: page.content_html }}
        />
      ) : (
        <p className="text-muted-foreground">Bu sayfanin icerigi henuz eklenmemis.</p>
      )}
    </main>
  )
}

import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/PageHeader'
import { TrashList } from './_components/TrashList'

interface TrashArticleRaw {
  id: string
  title: string
  slug: string
  status: string
  deleted_at: string | null
  created_at: string
  category: { name: string }[] | null
  author: { full_name: string | null; display_name: string | null }[] | null
}

interface TrashArticleNormalized {
  id: string
  title: string
  slug: string
  status: string
  deleted_at: string | null
  created_at: string
  category: { name?: string } | null
  author: { full_name?: string; display_name?: string } | null
}

async function getDeletedArticles(): Promise<TrashArticleNormalized[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select(`
        id, title, slug, status, deleted_at, created_at,
        category:categories!category_id(name),
        author:profiles!author_id(full_name, display_name)
      `)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })

    const raw = (data ?? []) as TrashArticleRaw[]

    return raw.map((a): TrashArticleNormalized => {
      const categoryRaw = Array.isArray(a.category) ? (a.category[0] ?? null) : a.category
      const authorRaw = Array.isArray(a.author) ? (a.author[0] ?? null) : a.author

      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: a.status,
        deleted_at: a.deleted_at,
        created_at: a.created_at,
        category: categoryRaw ? { name: categoryRaw.name } : null,
        author: authorRaw
          ? {
              full_name: authorRaw.full_name ?? undefined,
              display_name: authorRaw.display_name ?? undefined,
            }
          : null,
      }
    })
  } catch {
    return []
  }
}

export default async function TrashPage() {
  const articles = await getDeletedArticles()

  return (
    <div>
      <PageHeader
        title="Çöp Kutusu"
        description={`${articles.length} silinmiş haber`}
      />
      <TrashList articles={articles} />
    </div>
  )
}

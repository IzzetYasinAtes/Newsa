import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { TrashList } from './_components/TrashList'

async function getDeletedArticles() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('articles')
      .select(`
        id, title, slug, status, deleted_at, created_at,
        category:categories!category_id(name),
        author:profiles!author_id(full_name, display_name)
      `)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })

    return data ?? []
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

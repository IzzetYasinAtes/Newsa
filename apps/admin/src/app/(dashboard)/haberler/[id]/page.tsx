import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ArticleForm } from '../_components/ArticleForm'
import { PageHeader } from '@/components/PageHeader'

async function getData(id: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const [articleRes, categories, tags] = await Promise.all([
      supabase.from('articles').select('*, article_tags(tag_id)').eq('id', id).single(),
      supabase.from('categories').select('id, name').eq('is_active', true).order('sort_order'),
      supabase.from('tags').select('id, name, slug').order('name'),
    ])
    return {
      article: articleRes.data,
      categories: categories.data ?? [],
      tags: tags.data ?? [],
    }
  } catch {
    return { article: null, categories: [], tags: [] }
  }
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { article, categories, tags } = await getData(id)
  if (!article) notFound()

  const tagIds = (article.article_tags as { tag_id: string }[])?.map((t) => t.tag_id) ?? []

  return (
    <div>
      <PageHeader title="Haber Düzenle" />
      <ArticleForm
        initialData={{ ...article, tag_ids: tagIds }}
        categories={categories}
        tags={tags}
        currentUserId={article.author_id}
      />
    </div>
  )
}

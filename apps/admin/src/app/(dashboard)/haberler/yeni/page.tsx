import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ArticleForm } from '../_components/ArticleForm'
import { PageHeader } from '@/components/PageHeader'

async function getData() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const [categories, tags, user] = await Promise.all([
      supabase.from('categories').select('id, name').eq('is_active', true).order('sort_order'),
      supabase.from('tags').select('id, name, slug').order('name'),
      supabase.auth.getUser(),
    ])
    return {
      categories: categories.data ?? [],
      tags: tags.data ?? [],
      userId: user.data.user?.id ?? '',
    }
  } catch {
    return { categories: [], tags: [], userId: '' }
  }
}

export default async function NewArticlePage() {
  const { categories, tags, userId } = await getData()
  return (
    <div>
      <PageHeader title="Yeni Haber" />
      <ArticleForm categories={categories} tags={tags} currentUserId={userId} />
    </div>
  )
}

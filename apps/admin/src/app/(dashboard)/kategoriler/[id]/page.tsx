import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'
import { PageHeader } from '@/components/PageHeader'

interface CategoryData {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  parent_id: string | null
}

async function getCategory(id: string): Promise<CategoryData | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase.from('categories').select('*').eq('id', id).single()
    return data as CategoryData | null
  } catch {
    return null
  }
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(id)
  if (!category) notFound()

  return (
    <div>
      <PageHeader title="Kategori Duzenle" />
      <CategoryForm initialData={category} />
    </div>
  )
}

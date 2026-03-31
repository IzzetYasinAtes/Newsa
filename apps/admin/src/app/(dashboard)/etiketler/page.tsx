import { createClient } from '@/lib/supabase-server'
import TagsClient from './TagsClient'

interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export default async function TagsPage() {
  let initialTags: Tag[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase.from('tags').select('*').order('name')
    initialTags = (data as Tag[]) ?? []
  } catch {
    /* Supabase not configured yet */
  }

  return <TagsClient initialTags={initialTags} />
}

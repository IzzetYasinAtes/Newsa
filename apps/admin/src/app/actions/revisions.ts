'use server'
import { createClient } from '@/lib/supabase-server'

export async function saveRevision(
  articleId: string,
  data: {
    title: string
    content: unknown
    excerpt?: string | null
    coverImage?: string | null
    changeSummary?: string
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Sonraki revizyon numarasını al
  const { data: nextNum } = await supabase.rpc('get_next_revision_number', {
    p_article_id: articleId,
  })

  const { data: revision, error } = await supabase
    .from('article_revisions')
    .insert({
      article_id: articleId,
      revision_number: (nextNum as number) ?? 1,
      title: data.title,
      content: data.content as Record<string, unknown>,
      excerpt: data.excerpt ?? null,
      cover_image: data.coverImage ?? null,
      created_by: user.id,
      change_summary: data.changeSummary ?? 'Otomatik kayıt',
    })
    .select()
    .single()

  if (error) throw error
  return revision
}

export async function getRevisions(articleId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('article_revisions')
    .select('id, revision_number, title, created_at, change_summary, created_by')
    .eq('article_id', articleId)
    .order('revision_number', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

export async function getRevisionById(revisionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('article_revisions')
    .select('*')
    .eq('id', revisionId)
    .single()

  if (error) throw error
  return data
}

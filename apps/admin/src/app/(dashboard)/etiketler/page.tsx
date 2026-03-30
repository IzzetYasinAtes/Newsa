'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { PageHeader } from '@/components/PageHeader'
import { generateSlug } from '@newsa/shared'

interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadTags = useCallback(async () => {
    try {
      const { data } = await supabase.from('tags').select('*').order('name')
      setTags((data as Tag[]) ?? [])
    } catch {
      /* Supabase not configured yet */
    }
  }, [supabase])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTag.trim()) return
    setLoading(true)
    try {
      const { error } = await supabase.from('tags').insert({
        name: newTag.trim(),
        slug: generateSlug(newTag.trim()),
      })
      if (error) throw error
      setNewTag('')
      await loadTags()
    } catch {
      /* handle error */
    }
    setLoading(false)
  }

  async function handleUpdate(id: string) {
    if (!editValue.trim()) return
    setLoading(true)
    try {
      await supabase.from('tags').update({
        name: editValue.trim(),
        slug: generateSlug(editValue.trim()),
      }).eq('id', id)
      setEditingId(null)
      await loadTags()
    } catch {
      /* handle error */
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu etiketi silmek istediginize emin misiniz?')) return
    try {
      await supabase.from('tags').delete().eq('id', id)
      await loadTags()
    } catch {
      /* handle error */
    }
  }

  return (
    <div>
      <PageHeader title="Etiketler" description={`${tags.length} etiket`} />

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Yeni etiket adi..."
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading || !newTag.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="group flex items-center gap-1 rounded-full border bg-card px-3 py-1.5">
            {editingId === tag.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleUpdate(tag.id)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(tag.id) }}
                autoFocus
                className="w-24 border-b bg-transparent text-sm outline-none"
              />
            ) : (
              <>
                <span
                  className="cursor-pointer text-sm"
                  onClick={() => { setEditingId(tag.id); setEditValue(tag.name) }}
                >
                  {tag.name}
                </span>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="ml-1 hidden text-xs text-muted-foreground hover:text-destructive group-hover:inline"
                  aria-label={`${tag.name} etiketini sil`}
                >
                  x
                </button>
              </>
            )}
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">Henuz etiket yok. Yukaridan ekleyin.</p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { FormField } from '@/components/FormField'
import { generateSlug } from '@newsa/shared'

interface CategoryData {
  id?: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  parent_id: string | null
}

export function CategoryForm({ initialData }: { initialData?: CategoryData }) {
  const isEdit = !!initialData?.id
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0)
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description ?? '')

  function handleNameChange(value: string) {
    setName(value)
    if (!isEdit) setSlug(generateSlug(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const payload = {
        name,
        slug,
        description: description || null,
        sort_order: sortOrder,
        is_active: isActive,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
      }

      if (isEdit && initialData?.id) {
        const { error: dbError } = await supabase.from('categories').update(payload).eq('id', initialData.id)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase.from('categories').insert(payload)
        if (dbError) throw dbError
      }

      router.push('/kategoriler')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !initialData?.id || !confirm('Bu kategoriyi silmek istediginize emin misiniz?')) return
    setLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error: dbError } = await supabase.from('categories').delete().eq('id', initialData.id)
      if (dbError) throw dbError
      router.push('/kategoriler')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silme hatasi')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <FormField label="Kategori Adi" required>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </FormField>

      <FormField label="Slug" required>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </FormField>

      <FormField label="Aciklama">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Siralama">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </FormField>
        <FormField label="Durum">
          <select
            value={isActive ? 'active' : 'inactive'}
            onChange={(e) => setIsActive(e.target.value === 'active')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </FormField>
      </div>

      <details className="rounded-md border p-4">
        <summary className="cursor-pointer text-sm font-medium">SEO Ayarlari</summary>
        <div className="mt-3 space-y-3">
          <FormField label="SEO Baslik">
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              maxLength={70}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>
          <FormField label="SEO Aciklama">
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              maxLength={160}
              rows={2}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>
        </div>
      </details>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : isEdit ? 'Guncelle' : 'Olustur'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
        >
          Iptal
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  )
}

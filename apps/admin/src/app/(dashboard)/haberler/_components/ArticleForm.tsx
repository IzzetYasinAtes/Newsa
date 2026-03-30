'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { FormField } from '@/components/FormField'
import { Badge } from '@/components/Badge'
import { TiptapEditor } from '@/components/TiptapEditor'
import { generateSlug } from '@newsa/shared'

interface ArticleFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    summary: string | null
    content: Record<string, unknown> | null
    content_html: string | null
    cover_image_id: string | null
    cover_image_alt: string | null
    category_id: string
    author_id: string
    status: string
    published_at: string | null
    is_featured: boolean
    is_headline: boolean
    is_breaking: boolean
    seo_title: string | null
    seo_description: string | null
    seo_keywords: string[] | null
    canonical_url: string | null
    source_name: string | null
    source_url: string | null
    editor_notes: string | null
    tag_ids: string[]
  }
  categories: { id: string; name: string }[]
  tags: { id: string; name: string; slug: string }[]
  currentUserId: string
}

export function ArticleForm({ initialData, categories, tags, currentUserId }: ArticleFormProps) {
  const isEdit = !!initialData?.id
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [summary, setSummary] = useState(initialData?.summary ?? '')
  const [content, setContent] = useState<Record<string, unknown> | null>(initialData?.content ?? null)
  const [contentHtml, setContentHtml] = useState(initialData?.content_html ?? '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? '')
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tag_ids ?? [])
  const [status, setStatus] = useState(initialData?.status ?? 'draft')

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description ?? '')
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url ?? '')

  // Flags
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false)
  const [isHeadline, setIsHeadline] = useState(initialData?.is_headline ?? false)
  const [isBreaking, setIsBreaking] = useState(initialData?.is_breaking ?? false)

  // Source
  const [sourceName, setSourceName] = useState(initialData?.source_name ?? '')
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url ?? '')
  const [editorNotes, setEditorNotes] = useState(initialData?.editor_notes ?? '')

  // Cover image (simplified)
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.cover_image_alt ?? '')

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit) setSlug(generateSlug(value))
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  async function handleSave(newStatus?: string) {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const finalStatus = newStatus ?? status

      const payload = {
        title,
        slug,
        summary: summary || null,
        content,
        content_html: contentHtml || null,
        cover_image_alt: coverImageAlt || null,
        category_id: categoryId,
        status: finalStatus,
        is_featured: isFeatured,
        is_headline: isHeadline,
        is_breaking: isBreaking,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        canonical_url: canonicalUrl || null,
        source_name: sourceName || null,
        source_url: sourceUrl || null,
        editor_notes: editorNotes || null,
        ...(finalStatus === 'published' && !initialData?.published_at ? { published_at: new Date().toISOString() } : {}),
      }

      if (isEdit && initialData?.id) {
        const { error: updateError } = await supabase.from('articles').update(payload).eq('id', initialData.id)
        if (updateError) throw updateError

        // Update tags
        await supabase.from('article_tags').delete().eq('article_id', initialData.id)
        if (selectedTags.length > 0) {
          await supabase.from('article_tags').insert(
            selectedTags.map((tagId) => ({ article_id: initialData.id, tag_id: tagId }))
          )
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('articles')
          .insert({ ...payload, author_id: currentUserId })
          .select('id')
          .single()
        if (insertError) throw insertError

        if (data && selectedTags.length > 0) {
          await supabase.from('article_tags').insert(
            selectedTags.map((tagId) => ({ article_id: data.id, tag_id: tagId }))
          )
        }
      }

      setStatus(finalStatus)
      router.push('/haberler')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !initialData?.id || !confirm('Bu haberi silmek istediğinize emin misiniz?')) return
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: deleteError } = await supabase.from('articles').delete().eq('id', initialData.id)
      if (deleteError) throw deleteError
      router.push('/haberler')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silme hatası')
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main content - 2/3 */}
      <div className="space-y-4 lg:col-span-2">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="rounded-lg border bg-card p-6 space-y-4">
          <FormField label="Başlık" required>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              maxLength={200}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Haber başlığı..."
            />
          </FormField>

          <FormField label="Slug">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>

          <FormField label="Özet (Spot)">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Haber özeti..."
            />
            <p className="text-xs text-muted-foreground">{summary.length}/500</p>
          </FormField>

          <FormField label="İçerik" required>
            <TiptapEditor
              content={content}
              onChange={(json, html) => { setContent(json); setContentHtml(html) }}
            />
          </FormField>
        </div>

        {/* SEO */}
        <details className="rounded-lg border bg-card p-6">
          <summary className="cursor-pointer font-medium">SEO Ayarları</summary>
          <div className="mt-4 space-y-4">
            <FormField label="SEO Başlık">
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-muted-foreground">{seoTitle.length}/70</p>
            </FormField>
            <FormField label="SEO Açıklama">
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} maxLength={160} rows={2}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-muted-foreground">{seoDescription.length}/160</p>
            </FormField>
            <FormField label="Canonical URL">
              <input type="url" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
            </FormField>
          </div>
        </details>

        {/* Source */}
        <details className="rounded-lg border bg-card p-6">
          <summary className="cursor-pointer font-medium">Kaynak Bilgisi</summary>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Kaynak Adı">
              <input type="text" value={sourceName} onChange={(e) => setSourceName(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </FormField>
            <FormField label="Kaynak URL">
              <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </FormField>
          </div>
        </details>
      </div>

      {/* Sidebar - 1/3 */}
      <div className="space-y-4">
        {/* Status & Actions */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Durum</span>
            <Badge variant={status === 'published' ? 'success' : status === 'review' ? 'warning' : 'secondary'}>
              {status === 'draft' ? 'Taslak' : status === 'review' ? 'İncelemede' : status === 'published' ? 'Yayında' : 'Arşiv'}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="w-full rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Taslak Kaydet'}
            </button>
            {status !== 'published' && (
              <button
                type="button"
                onClick={() => handleSave('review')}
                disabled={loading}
                className="w-full rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
              >
                İncelemeye Gönder
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={loading}
              className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Yayınla
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="rounded-lg border bg-card p-4">
          <FormField label="Kategori" required>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Tags */}
        <div className="rounded-lg border bg-card p-4">
          <p className="mb-2 text-sm font-medium">Etiketler</p>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  className="rounded"
                />
                {tag.name}
              </label>
            ))}
            {tags.length === 0 && <p className="text-xs text-muted-foreground">Etiket yok</p>}
          </div>
        </div>

        {/* Flags */}
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="text-sm font-medium">Öne Çıkarma</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded" />
            Öne Çıkan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isHeadline} onChange={(e) => setIsHeadline(e.target.checked)} className="rounded" />
            Manşet
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="rounded" />
            Son Dakika
          </label>
        </div>

        {/* Cover Image */}
        <div className="rounded-lg border bg-card p-4">
          <FormField label="Kapak Görseli Alt Metin">
            <input
              type="text"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Görsel açıklaması..."
            />
          </FormField>
          <p className="mt-1 text-xs text-muted-foreground">Medya picker sonraki fazda eklenecek</p>
        </div>

        {/* Editor Notes */}
        <div className="rounded-lg border bg-card p-4">
          <FormField label="Editör Notları">
            <textarea
              value={editorNotes}
              onChange={(e) => setEditorNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Sadece admin panelde görünür..."
            />
          </FormField>
        </div>

        {/* Delete */}
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Haberi Sil
          </button>
        )}
      </div>
    </div>
  )
}

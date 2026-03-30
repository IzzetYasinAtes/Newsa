'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { PageHeader } from '@/components/PageHeader'
import { TiptapEditor } from '@/components/TiptapEditor'

interface StaticPage {
  id: string
  title: string
  slug: string
  content: Record<string, unknown> | null
  status: string
  seo_title: string | null
  seo_description: string | null
}

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function EditSayfaPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
  })
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [contentHtml, setContentHtml] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('pages').select('*').eq('id', pageId).single()
      if (data) {
        const page = data as StaticPage
        setForm({
          title: page.title,
          slug: page.slug,
          status: page.status,
          seo_title: page.seo_title ?? '',
          seo_description: page.seo_description ?? '',
        })
        setContent(page.content)
      }
      setLoading(false)
    }
    load()
  }, [pageId])

  function handleTitleChange(title: string) {
    setForm((p) => ({
      ...p,
      title,
      slug: slugEdited ? p.slug : slugify(title),
    }))
  }

  const handleContentChange = useCallback((json: Record<string, unknown>, html: string) => {
    setContent(json)
    setContentHtml(html)
  }, [])

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      setMessage({ type: 'error', text: 'Başlık ve slug zorunludur' })
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('pages').update({
      title: form.title,
      slug: form.slug,
      content: content,
      content_html: contentHtml,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      updated_at: new Date().toISOString(),
    }).eq('id', pageId)

    if (error) {
      setMessage({ type: 'error', text: 'Kaydedilemedi: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Kaydedildi' })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  async function handleDelete() {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('pages').delete().eq('id', pageId)
    router.push('/sayfalar')
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Sayfa Düzenle" />
        <p className="py-8 text-center text-sm text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Sayfa Düzenle" />

      {message && (
        <div className={`mb-4 rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Başlık *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setForm((p) => ({ ...p, slug: e.target.value })); setSlugEdited(true) }}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <label className="mb-2 block text-sm font-medium">İçerik</label>
            <TiptapEditor content={content} onChange={handleContentChange} placeholder="Sayfa içeriğini yazın..." />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 font-semibold">Yayın</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Durum</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                  <option value="archived">Arşiv</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full rounded-md border border-destructive py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                {deleting ? 'Siliniyor...' : 'Sayfayı Sil'}
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 font-semibold">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">SEO Başlığı</label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm((p) => ({ ...p, seo_title: e.target.value }))}
                  placeholder="Meta title"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">SEO Açıklaması</label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) => setForm((p) => ({ ...p, seo_description: e.target.value }))}
                  placeholder="Meta description"
                  rows={3}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

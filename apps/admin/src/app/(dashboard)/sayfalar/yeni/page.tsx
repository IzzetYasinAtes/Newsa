'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { PageHeader } from '@/components/PageHeader'
import { TiptapEditor } from '@/components/TiptapEditor'

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

export default function YeniSayfaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
  })
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [contentHtml, setContentHtml] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

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
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Başlık zorunludur' })
      return
    }
    if (!form.slug.trim()) {
      setMessage({ type: 'error', text: 'Slug zorunludur' })
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('pages').insert({
      title: form.title,
      slug: form.slug,
      content: content,
      content_html: contentHtml,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    }).select('id').single()

    if (error) {
      setMessage({ type: 'error', text: 'Kaydedilemedi: ' + error.message })
      setSaving(false)
      return
    }
    setMessage({ type: 'success', text: 'Sayfa oluşturuldu' })
    setTimeout(() => router.push(`/sayfalar/${(data as { id: string }).id}`), 1000)
  }

  return (
    <div>
      <PageHeader title="Yeni Sayfa" />

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
                  placeholder="Sayfa başlığı"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setForm((p) => ({ ...p, slug: e.target.value })); setSlugEdited(true) }}
                  placeholder="sayfa-url-adresi"
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
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
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

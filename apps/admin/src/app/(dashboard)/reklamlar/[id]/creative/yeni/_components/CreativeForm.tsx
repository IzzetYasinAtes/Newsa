'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createCreative } from '@/app/actions/ads'

interface AdZone {
  id: string
  name: string
  display_name: string
  width: number | null
  height: number | null
}

interface CreativeFormProps {
  campaignId: string
  zones: AdZone[]
}

export function CreativeForm({ campaignId, zones }: CreativeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'image' | 'html' | 'text'>('image')
  const [imageUrl, setImageUrl] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [targetUrl, setTargetUrl] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const result = await createCreative({
          campaign_id: campaignId,
          zone_id: zoneId,
          title,
          type,
          image_url: type === 'image' ? imageUrl || null : null,
          html_content: type === 'html' ? htmlContent || null : null,
          target_url: targetUrl,
          is_active: true,
        })

        if (!result.success) throw new Error(result.message)
        router.push(`/reklamlar/${campaignId}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div>
          <label htmlFor="zone" className="mb-1.5 block text-sm font-medium">
            Reklam Zonu <span className="text-destructive">*</span>
          </label>
          <select
            id="zone"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.display_name}
                {zone.width && zone.height ? ` (${zone.width}x${zone.height})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
            Başlık <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Yaz İndirimi Banner"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Tip <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-4">
            {(['image', 'html', 'text'] as const).map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={type === t}
                  onChange={() => setType(t)}
                  className="h-4 w-4"
                />
                {t === 'image' ? 'Görsel' : t === 'html' ? 'HTML' : 'Metin'}
              </label>
            ))}
          </div>
        </div>

        {type === 'image' && (
          <div>
            <label htmlFor="image-url" className="mb-1.5 block text-sm font-medium">
              Görsel URL
            </label>
            <input
              id="image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/banner.jpg"
            />
            {imageUrl && (
              <div className="mt-2 overflow-hidden rounded-md border">
                <Image
                  src={imageUrl}
                  alt="Önizleme"
                  width={400}
                  height={200}
                  className="h-auto max-h-48 w-full object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}

        {type === 'html' && (
          <div>
            <label htmlFor="html-content" className="mb-1.5 block text-sm font-medium">
              HTML İçerik
            </label>
            <p className="mb-1 text-xs text-muted-foreground">
              Not: HTML içerik sadece admin tarafından girilmektedir; yine de güvenilir kaynaklardan
              içerik kullanın.
            </p>
            <textarea
              id="html-content"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              rows={6}
              className="w-full rounded-md border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="<div>Reklam içeriği...</div>"
            />
          </div>
        )}

        <div>
          <label htmlFor="target-url" className="mb-1.5 block text-sm font-medium">
            Hedef URL <span className="text-destructive">*</span>
          </label>
          <input
            id="target-url"
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/kampanya"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Kaydediliyor...' : 'Creative Oluştur'}
        </button>
      </div>
    </form>
  )
}

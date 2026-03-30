'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCampaign, updateCampaign } from '@/app/actions/ads'
import type { CreateCampaignData } from '@/app/actions/ads'

interface CampaignFormProps {
  initialData?: {
    id: string
    name: string
    advertiser_name: string
    start_date: string
    end_date: string | null
    budget: number | null
    status: 'draft' | 'active' | 'paused' | 'completed'
  }
}

export function CampaignForm({ initialData }: CampaignFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [advertiserName, setAdvertiserName] = useState(initialData?.advertiser_name ?? '')
  const [startDate, setStartDate] = useState(initialData?.start_date ?? '')
  const [endDate, setEndDate] = useState(initialData?.end_date ?? '')
  const [budget, setBudget] = useState(initialData?.budget?.toString() ?? '')
  const [status, setStatus] = useState<'draft' | 'active' | 'paused' | 'completed'>(
    initialData?.status ?? 'draft'
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const data: CreateCampaignData = {
      name,
      advertiser_name: advertiserName,
      start_date: startDate,
      end_date: endDate || null,
      budget: budget ? parseFloat(budget) : null,
      status,
    }

    startTransition(async () => {
      try {
        if (initialData) {
          const result = await updateCampaign(initialData.id, data)
          if (!result.success) throw new Error(result.message)
          router.push(`/reklamlar/${initialData.id}`)
        } else {
          const result = await createCampaign(data)
          if (!result.success) throw new Error(result.message)
          router.push(`/reklamlar/${result.id}`)
        }
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Kampanya Adı <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Yaz Kampanyası 2025"
            />
          </div>

          <div>
            <label htmlFor="advertiser" className="mb-1.5 block text-sm font-medium">
              Reklamcı Adı <span className="text-destructive">*</span>
            </label>
            <input
              id="advertiser"
              type="text"
              value={advertiserName}
              onChange={(e) => setAdvertiserName(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="XYZ Şirketi"
            />
          </div>

          <div>
            <label htmlFor="start-date" className="mb-1.5 block text-sm font-medium">
              Başlangıç Tarihi <span className="text-destructive">*</span>
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="end-date" className="mb-1.5 block text-sm font-medium">
              Bitiş Tarihi
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="budget" className="mb-1.5 block text-sm font-medium">
              Bütçe (TRY)
            </label>
            <input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="5000.00"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
              Durum
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Taslak</option>
              <option value="active">Aktif</option>
              <option value="paused">Duraklatıldı</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </div>
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
          {isPending ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Kampanya Oluştur'}
        </button>
      </div>
    </form>
  )
}

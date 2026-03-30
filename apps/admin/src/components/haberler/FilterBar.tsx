'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface FilterBarProps {
  categories: Category[]
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tüm Durumlar' },
  { value: 'draft', label: 'Taslak' },
  { value: 'review', label: 'İncelemede' },
  { value: 'published', label: 'Yayında' },
  { value: 'archived', label: 'Arşiv' },
]

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') ?? ''
  const currentKategori = searchParams.get('kategori') ?? ''
  const currentQ = searchParams.get('q') ?? ''
  const currentBaslangic = searchParams.get('baslangic') ?? ''
  const currentBitis = searchParams.get('bitis') ?? ''

  const [searchValue, setSearchValue] = useState(currentQ)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // URL değişince search input'u senkronize et
  useEffect(() => {
    setSearchValue(currentQ)
  }, [currentQ])

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      // Sayfa sıfırla (filtre değişince 1. sayfaya dön)
      params.delete('sayfa')

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      updateParams({ q: value })
    }, 300)
  }

  function handleClearAll() {
    setSearchValue('')
    router.push(pathname)
  }

  const hasFilters =
    currentStatus || currentKategori || currentQ || currentBaslangic || currentBitis

  return (
    <div className="mb-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        {/* Arama kutusu */}
        <div className="flex-1 min-w-48">
          <label htmlFor="filtre-q" className="mb-1 block text-xs font-medium text-muted-foreground">
            Arama
          </label>
          <input
            id="filtre-q"
            type="search"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Başlık ara..."
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Durum filtresi */}
        <div className="min-w-36">
          <label htmlFor="filtre-status" className="mb-1 block text-xs font-medium text-muted-foreground">
            Durum
          </label>
          <select
            id="filtre-status"
            value={currentStatus}
            onChange={(e) => updateParams({ status: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Kategori filtresi */}
        <div className="min-w-40">
          <label htmlFor="filtre-kategori" className="mb-1 block text-xs font-medium text-muted-foreground">
            Kategori
          </label>
          <select
            id="filtre-kategori"
            value={currentKategori}
            onChange={(e) => updateParams({ kategori: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tarih aralığı - başlangıç */}
        <div className="min-w-36">
          <label htmlFor="filtre-baslangic" className="mb-1 block text-xs font-medium text-muted-foreground">
            Başlangıç Tarihi
          </label>
          <input
            id="filtre-baslangic"
            type="date"
            value={currentBaslangic}
            onChange={(e) => updateParams({ baslangic: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tarih aralığı - bitiş */}
        <div className="min-w-36">
          <label htmlFor="filtre-bitis" className="mb-1 block text-xs font-medium text-muted-foreground">
            Bitiş Tarihi
          </label>
          <input
            id="filtre-bitis"
            type="date"
            value={currentBitis}
            onChange={(e) => updateParams({ bitis: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Temizle butonu */}
        {hasFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>
    </div>
  )
}

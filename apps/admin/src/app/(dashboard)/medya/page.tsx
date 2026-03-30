'use client'

import { useState, useEffect, useRef } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { PageHeader } from '@/components/PageHeader'

interface MediaItem {
  id: string
  file_name: string
  original_name: string
  file_url: string
  file_size: number
  mime_type: string
  width: number | null
  height: number | null
  alt_text: string | null
  folder: string
  created_at: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from('media')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        setItems((data as MediaItem[]) ?? [])
      } catch {
        /* Supabase not configured */
      }
    }
    loadData()
  }, [supabase])

  async function loadMedia() {
    try {
      const { data } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setItems((data as MediaItem[]) ?? [])
    } catch {
      /* Supabase not configured */
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Giris yapmalisiniz')

      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const filePath = `media/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file, { cacheControl: '3600' })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)

        await supabase.from('media').insert({
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          folder: 'general',
        })
      }

      await loadMedia()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Yukleme hatasi')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu dosyayi silmek istediginize emin misiniz?')) return
    try {
      const item = items.find((i) => i.id === id)
      if (item) {
        await supabase.storage.from('media').remove([item.file_name])
        await supabase.from('media').delete().eq('id', id)
      }
      setSelectedItem(null)
      await loadMedia()
    } catch {
      /* handle error */
    }
  }

  return (
    <div>
      <PageHeader title="Medya Kutuphanesi" description={`${items.length} dosya`} />

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
        className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary hover:bg-primary/5"
      >
        <p className="text-sm text-muted-foreground">
          {uploading ? 'Yukleniyor...' : 'Dosyalari surukleyin veya tiklayarak secin'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP, GIF, SVG, MP4 (maks 50MB)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedItem(item) }}
            className={`group cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md ${
              selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            {item.mime_type.startsWith('image/') ? (
              <div className="aspect-square bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.file_url}
                  alt={item.alt_text ?? item.original_name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted text-2xl">
                <span aria-label="Video">Video</span>
              </div>
            )}
            <div className="p-2">
              <p className="truncate text-xs font-medium">{item.original_name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">Henuz medya dosyasi yok</p>
      )}

      {/* Detail panel */}
      {selectedItem && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 border-l bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Dosya Detayi</h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Kapat"
            >
              x
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {selectedItem.mime_type.startsWith('image/') && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={selectedItem.file_url} alt={selectedItem.alt_text ?? ''} className="w-full rounded-md" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Dosya adi</p>
              <p className="text-sm">{selectedItem.original_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Boyut</p>
              <p className="text-sm">{formatFileSize(selectedItem.file_size)}</p>
            </div>
            {selectedItem.width && selectedItem.height && (
              <div>
                <p className="text-xs text-muted-foreground">Boyutlar</p>
                <p className="text-sm">{selectedItem.width} x {selectedItem.height}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">URL</p>
              <input
                type="text"
                readOnly
                value={selectedItem.file_url}
                className="w-full rounded border bg-muted px-2 py-1 text-xs"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <button
              onClick={() => handleDelete(selectedItem.id)}
              className="w-full rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground hover:bg-destructive/90"
            >
              Dosyayi Sil
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

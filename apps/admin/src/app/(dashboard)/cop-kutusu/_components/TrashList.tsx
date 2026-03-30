'use client'

import { useState, useTransition } from 'react'
import { restoreArticle, permanentDeleteArticle } from '@/app/actions/articles'

interface TrashArticle {
  id: string
  title: string
  slug: string
  status: string
  deleted_at: string | null
  created_at: string
  category: { name?: string } | null
  author: { full_name?: string; display_name?: string } | null
}

interface TrashListProps {
  articles: TrashArticle[]
}

function formatDateTime(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isOlderThan30Days(isoString: string): boolean {
  const deleted = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - deleted.getTime()
  return diffMs > 30 * 24 * 60 * 60 * 1000
}

export function TrashList({ articles: initialArticles }: TrashListProps) {
  const [articles, setArticles] = useState<TrashArticle[]>(initialArticles)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function handleRestore(id: string) {
    startTransition(async () => {
      try {
        await restoreArticle(id)
        setArticles((prev) => prev.filter((a) => a.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Geri yükleme hatası')
      }
    })
  }

  function handlePermanentDelete(id: string) {
    setConfirmDeleteId(id)
  }

  function confirmDelete() {
    if (!confirmDeleteId) return
    const id = confirmDeleteId
    setConfirmDeleteId(null)
    startTransition(async () => {
      try {
        await permanentDeleteArticle(id)
        setArticles((prev) => prev.filter((a) => a.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kalıcı silme hatası')
      }
    })
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
        Çöp kutusu boş
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Onay Dialogu */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg border bg-card p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold">Kalıcı Silme Onayı</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Bu haber kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                Kalıcı Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Yazar</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Silinme Tarihi</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => {
              const isOld = article.deleted_at ? isOlderThan30Days(article.deleted_at) : false
              const authorName =
                article.author?.display_name ?? article.author?.full_name ?? '-'
              const categoryName = article.category?.name ?? '-'

              return (
                <tr
                  key={article.id}
                  className={`border-b ${isOld ? 'bg-red-50 dark:bg-red-950/20' : 'hover:bg-muted/30'}`}
                >
                  <td className="px-4 py-3">
                    <span className={`font-medium ${isOld ? 'text-red-700 dark:text-red-400' : ''}`}>
                      {article.title}
                    </span>
                    {isOld && (
                      <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-700 dark:bg-red-900/50 dark:text-red-400">
                        30+ gün
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{authorName}</td>
                  <td className={`px-4 py-3 ${isOld ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                    {article.deleted_at ? formatDateTime(article.deleted_at) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestore(article.id)}
                        disabled={isPending}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Geri Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePermanentDelete(article.id)}
                        disabled={isPending}
                        className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                      >
                        Kalıcı Sil
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

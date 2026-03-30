'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { bulkSoftDelete, bulkPublish, bulkArchive } from '@/app/actions/bulk-articles'

interface BulkActionsBarProps {
  selectedIds: string[]
  onClear: () => void
}

type ConfirmAction = 'delete' | 'publish' | 'archive' | null

export function BulkActionsBar({ selectedIds, onClear }: BulkActionsBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [toast, setToast] = useState<string | null>(null)

  const count = selectedIds.length

  if (count === 0) return null

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  function handleAction(action: ConfirmAction) {
    setConfirmAction(action)
  }

  function handleCancel() {
    setConfirmAction(null)
  }

  function handleConfirm() {
    if (!confirmAction) return

    startTransition(async () => {
      let result: { success: boolean; message: string }

      if (confirmAction === 'delete') {
        result = await bulkSoftDelete(selectedIds)
      } else if (confirmAction === 'publish') {
        result = await bulkPublish(selectedIds)
      } else {
        result = await bulkArchive(selectedIds)
      }

      setConfirmAction(null)
      showToast(result.message)

      if (result.success) {
        onClear()
        router.refresh()
      }
    })
  }

  const actionLabel: Record<NonNullable<ConfirmAction>, string> = {
    delete: 'çöp kutusuna taşımak',
    publish: 'yayına almak',
    archive: 'arşivlemek',
  }

  return (
    <>
      {/* Toast bildirimi */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg"
        >
          {toast}
        </div>
      )}

      {/* Onay dialog */}
      {confirmAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-confirm-title"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
        >
          <div className="mx-4 w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h2 id="bulk-confirm-title" className="text-lg font-semibold">
              İşlemi Onayla
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong>{count} haberi</strong> {actionLabel[confirmAction]} istediğinize emin misiniz?
              {confirmAction === 'delete' && ' Bu haberler çöp kutusuna taşınacak, daha sonra geri yüklenebilir.'}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  confirmAction === 'delete'
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isPending ? 'İşleniyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Toplu işlemler"
        className="mb-3 flex items-center justify-between rounded-lg border bg-primary/5 px-4 py-2"
      >
        <span className="text-sm font-medium text-primary">
          {count} haber seçildi
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAction('publish')}
            disabled={isPending}
            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Yayına Al
          </button>
          <button
            type="button"
            onClick={() => handleAction('archive')}
            disabled={isPending}
            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
          >
            Arşivle
          </button>
          <button
            type="button"
            onClick={() => handleAction('delete')}
            disabled={isPending}
            className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
          >
            Sil
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={isPending}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            aria-label="Seçimi temizle"
          >
            ✕ Temizle
          </button>
        </div>
      </div>
    </>
  )
}

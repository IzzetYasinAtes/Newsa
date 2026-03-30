'use client'

import { useState, useEffect, useTransition } from 'react'
import { getRevisions } from '@/app/actions/revisions'

interface Revision {
  id: string
  revision_number: number
  title: string
  created_at: string
  change_summary: string | null
  created_by: string | null
}

interface RevisionsPanelProps {
  articleId: string
  onRestore: (revisionId: string) => void
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

export function RevisionsPanel({ articleId, onRestore }: RevisionsPanelProps) {
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getRevisions(articleId)
      .then((data) => setRevisions((data as Revision[]) ?? []))
      .catch(() => setRevisions([]))
      .finally(() => setLoading(false))
  }, [open, articleId])

  function handleRestore(revisionId: string) {
    startTransition(() => {
      onRestore(revisionId)
    })
  }

  return (
    <details
      className="rounded-lg border bg-card"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer px-6 py-4 font-medium">
        Revizyon Geçmişi
        {revisions.length > 0 && (
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {revisions.length}
          </span>
        )}
      </summary>
      <div className="px-6 pb-4">
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Yükleniyor...</p>
        ) : revisions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Henüz revizyon yok</p>
        ) : (
          <div className="divide-y">
            {revisions.map((rev) => (
              <div key={rev.id} className="flex items-center justify-between py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-medium">
                      #{rev.revision_number}
                    </span>
                    <span className="truncate text-sm font-medium">{rev.title}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDateTime(rev.created_at)}</span>
                    {rev.change_summary && (
                      <>
                        <span>·</span>
                        <span className="truncate">{rev.change_summary}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRestore(rev.id)}
                  className="ml-4 flex-shrink-0 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
                >
                  Bu Revizyonu Geri Yükle
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  )
}

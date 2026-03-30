'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { formatDate } from '@newsa/shared'
import { DeleteArticleButton } from './DeleteArticleButton'
import { BulkActionsBar } from './BulkActionsBar'

type StatusVariant = 'success' | 'warning' | 'default' | 'secondary'

const statusLabels: Record<string, { label: string; variant: StatusVariant }> = {
  draft: { label: 'Taslak', variant: 'secondary' },
  review: { label: 'İncelemede', variant: 'warning' },
  published: { label: 'Yayında', variant: 'success' },
  archived: { label: 'Arşiv', variant: 'default' },
}

interface Article {
  id: string
  title: string
  slug: string
  status: string
  is_featured: boolean
  is_breaking: boolean
  created_at: string
  published_at: string | null
  view_count: number
  category: { name?: string } | null
  author: { display_name?: string; full_name?: string } | null
}

interface ArticlesTableProps {
  articles: Article[]
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = articles.length > 0 && selectedIds.size === articles.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < articles.length

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(articles.map((a) => a.id)))
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  return (
    <>
      <BulkActionsBar
        selectedIds={Array.from(selectedIds)}
        onClear={clearSelection}
      />

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={toggleAll}
                  aria-label="Tümünü seç"
                  className="h-4 w-4 cursor-pointer rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Yazar</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tarih</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Okunma</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Henüz haber yok
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const status = statusLabels[article.status] ?? statusLabels.draft
                const authorName =
                  article.author?.display_name ?? article.author?.full_name ?? '-'
                const categoryName = article.category?.name ?? '-'
                const isSelected = selectedIds.has(article.id)

                return (
                  <tr
                    key={article.id}
                    className={`border-b hover:bg-muted/30 ${isSelected ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(article.id)}
                        aria-label={`${article.title} seç`}
                        className="h-4 w-4 cursor-pointer rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/haberler/${article.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {article.title}
                      </Link>
                      <div className="mt-0.5 flex gap-1">
                        {article.is_featured && (
                          <span className="text-xs text-yellow-600">Öne Çıkan</span>
                        )}
                        {article.is_breaking && (
                          <span className="text-xs text-red-600">Son Dakika</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{categoryName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{authorName}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(article.published_at ?? article.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">{article.view_count}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteArticleButton articleId={article.id} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

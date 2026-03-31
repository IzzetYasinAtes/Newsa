'use client'

import { useState, useTransition, useEffect, type MouseEvent } from 'react'
import { softDeleteArticle } from '@/app/actions/articles'
import { useRouter } from 'next/navigation'

interface DeleteArticleButtonProps {
  articleId: string
}

export function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(false), 3000)
    return () => clearTimeout(t)
  }, [error])

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (error) {
      setError(false)
      return
    }

    if (!confirmed) {
      setConfirmed(true)
      setTimeout(() => setConfirmed(false), 3000)
      return
    }

    startTransition(async () => {
      try {
        await softDeleteArticle(articleId)
        setConfirmed(false)
        router.refresh()
      } catch {
        setConfirmed(false)
        setError(true)
      }
    })
  }

  const label = error ? 'Hata!' : isPending ? '...' : confirmed ? 'Emin misiniz?' : 'Sil'

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded px-2 py-1 text-xs font-medium disabled:opacity-50 ${
        error
          ? 'bg-orange-100 text-orange-700'
          : confirmed
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : 'border hover:bg-muted text-muted-foreground'
      }`}
    >
      {label}
    </button>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { softDeleteArticle } from '@/app/actions/articles'
import { useRouter } from 'next/navigation'

interface DeleteArticleButtonProps {
  articleId: string
}

export function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  function handleClick() {
    if (!confirmed) {
      setConfirmed(true)
      // 3 saniye içinde tekrar tıklanmazsa iptal et
      setTimeout(() => setConfirmed(false), 3000)
      return
    }
    startTransition(async () => {
      try {
        await softDeleteArticle(articleId)
        router.refresh()
      } catch {
        setConfirmed(false)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded px-2 py-1 text-xs font-medium disabled:opacity-50 ${
        confirmed
          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
          : 'border hover:bg-muted text-muted-foreground'
      }`}
    >
      {isPending ? '...' : confirmed ? 'Emin misiniz?' : 'Sil'}
    </button>
  )
}

'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Hata loglama servisi entegrasyonu için yer
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-destructive">Bir Hata Olustu</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Sayfa yuklenirken beklenmedik bir hata olustu. Lutfen tekrar deneyin.
      </p>
      {process.env.NODE_ENV === 'development' && error.message && (
        <pre className="mt-4 max-w-xl overflow-auto rounded-md bg-muted p-4 text-left text-xs text-muted-foreground">
          {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ''}
        </pre>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Yeniden Dene
        </button>
        <Link
          href="/"
          className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent"
        >
          Ana Sayfaya Don
        </Link>
      </div>
    </main>
  )
}

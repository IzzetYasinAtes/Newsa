'use client'

import { useEffect } from 'react'

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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-destructive">Bir Hata Olustu</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Islem sirasinda beklenmedik bir hata meydana geldi.
        </p>

        {/* Admin panelinde hata detayları her zaman gösterilir */}
        {error.message && (
          <div className="mt-4 rounded-md bg-muted p-3 text-left">
            <p className="text-xs font-medium text-muted-foreground mb-1">Hata Detayi:</p>
            <pre className="overflow-auto text-xs text-foreground whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Yeniden Dene
          </button>
          <a
            href="/"
            className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-accent"
          >
            Dashboard&apos;a Don
          </a>
        </div>
      </div>
    </main>
  )
}

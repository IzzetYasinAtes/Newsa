'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="tr">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Beklenmeyen bir hata olustu</h1>
          <p>Bir seyler yanlis gitti. Lutfen tekrar deneyin.</p>
          <button
            onClick={reset}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  )
}

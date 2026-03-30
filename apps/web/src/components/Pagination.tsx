import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Sayfalama">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
          Önceki
        </Link>
      )}
      {pages.map((page, i) => {
        const prev = pages[i - 1]
        const showEllipsis = prev && page - prev > 1
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
            <Link
              href={`${basePath}?page=${page}`}
              className={`rounded-md px-3 py-1.5 text-sm ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              }`}
            >
              {page}
            </Link>
          </span>
        )
      })}
      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
          Sonraki
        </Link>
      )}
    </nav>
  )
}

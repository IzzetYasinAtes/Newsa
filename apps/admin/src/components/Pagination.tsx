import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  buildHref: (page: number) => string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Sayfa numaralarını hesapla: ilk, son ve mevcut etrafında ±2
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  )

  return (
    <nav
      className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Sayfalama"
    >
      {/* Gösterge */}
      <p className="text-sm text-muted-foreground">
        <span className="font-medium">{startItem}–{endItem}</span>
        {' / '}
        <span className="font-medium">{totalItems}</span>
        {' haber'}
      </p>

      {/* Sayfa butonları */}
      <div className="flex items-center gap-1">
        {/* Önceki */}
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            aria-label="Önceki sayfa"
          >
            Önceki
          </Link>
        ) : (
          <span
            className="rounded-md border px-3 py-1.5 text-sm opacity-40 cursor-not-allowed"
            aria-disabled="true"
          >
            Önceki
          </span>
        )}

        {/* Sayfa numaraları */}
        {pageNumbers.map((page, i) => {
          const prev = pageNumbers[i - 1]
          const showEllipsis = prev !== undefined && page - prev > 1
          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
                  …
                </span>
              )}
              <Link
                href={buildHref(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  page === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'border hover:bg-muted'
                }`}
              >
                {page}
              </Link>
            </span>
          )
        })}

        {/* Sonraki */}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            aria-label="Sonraki sayfa"
          >
            Sonraki
          </Link>
        ) : (
          <span
            className="rounded-md border px-3 py-1.5 text-sm opacity-40 cursor-not-allowed"
            aria-disabled="true"
          >
            Sonraki
          </span>
        )}
      </div>
    </nav>
  )
}

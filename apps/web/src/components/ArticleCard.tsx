import Link from 'next/link'
import Image from 'next/image'

const categoryColors: Record<string, string> = {
  'gundem': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'ekonomi': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'teknoloji': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'spor': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'kultur-sanat': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'dunya': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'saglik': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'bilim': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
}

const defaultBadgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'

function getCategoryColor(slug: string): string {
  return categoryColors[slug] ?? defaultBadgeColor
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dk önce`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface ArticleCardProps {
  title: string
  slug: string
  summary?: string | null
  coverImageUrl?: string | null
  coverImageAlt?: string | null
  categoryName: string
  categorySlug: string
  authorName: string
  publishedAt?: string | null
  viewCount?: number
  variant?: 'hero' | 'featured' | 'compact' | 'minimal'
  rank?: number
}

export function ArticleCard({
  title,
  slug,
  summary,
  coverImageUrl,
  coverImageAlt,
  categoryName,
  categorySlug,
  authorName,
  publishedAt,
  viewCount,
  variant = 'featured',
  rank,
}: ArticleCardProps) {
  const href = `/kategori/${categorySlug}/${slug}`
  const badgeColor = getCategoryColor(categorySlug)
  const relativeDate = formatRelativeDate(publishedAt ?? null)

  // ─── Hero Variant (Manşet) ───
  if (variant === 'hero') {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-xl transition-shadow hover:shadow-xl"
      >
        <div className="aspect-[16/9] bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={coverImageAlt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              placeholder="empty"
              quality={75}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <span
            className={`mb-2 inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${badgeColor}`}
          >
            {categoryName}
          </span>
          <h2 className="text-xl font-bold leading-tight text-white md:text-3xl">
            {title}
          </h2>
          {summary && (
            <p className="mt-2 line-clamp-2 text-sm text-white/80">
              {summary}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
            <span>{authorName}</span>
            {relativeDate && (
              <>
                <span>·</span>
                <time>{relativeDate}</time>
              </>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // ─── Compact Variant (Yatay Liste) ───
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
      >
        <div className="relative h-20 w-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={coverImageAlt ?? title}
              fill
              sizes="120px"
              className="object-cover"
              placeholder="empty"
              quality={75}
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <span
            className={`mb-1 inline-block w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeColor}`}
          >
            {categoryName}
          </span>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
            {title}
          </h3>
          {relativeDate && (
            <time className="mt-1 text-xs text-muted-foreground">{relativeDate}</time>
          )}
        </div>
      </Link>
    )
  }

  // ─── Minimal Variant (Sidebar / En Çok Okunan) ───
  if (variant === 'minimal') {
    return (
      <Link
        href={href}
        className="group flex items-start gap-3 border-b border-border/50 py-3 last:border-0"
      >
        {rank != null && (
          <span className="flex-shrink-0 text-2xl font-bold leading-none text-muted-foreground/40">
            {String(rank).padStart(2, '0')}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug group-hover:text-primary">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {relativeDate && <time>{relativeDate}</time>}
            {viewCount != null && viewCount > 0 && (
              <>
                {relativeDate && <span>·</span>}
                <span>{viewCount.toLocaleString('tr-TR')} görüntülenme</span>
              </>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // ─── Featured Variant (Öne Çıkan — Varsayılan) ───
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={coverImageAlt ?? title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="empty"
            quality={75}
          />
        )}
      </div>
      <div className="p-4">
        <span
          className={`mb-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
        >
          {categoryName}
        </span>
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
          {title}
        </h3>
        {summary && (
          <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
            {summary}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{authorName}</span>
          {relativeDate && (
            <>
              <span>·</span>
              <time>{relativeDate}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

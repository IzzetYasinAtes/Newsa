import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@newsa/shared'

interface ArticleCardProps {
  title: string
  slug: string
  summary: string | null
  coverImageUrl: string | null
  coverImageAlt: string | null
  categoryName: string
  categorySlug: string
  authorName: string
  publishedAt: string | null
  variant?: 'hero' | 'featured' | 'standard' | 'horizontal' | 'compact'
}

export function ArticleCard({
  title, slug, summary, coverImageUrl, coverImageAlt,
  categoryName, categorySlug, authorName, publishedAt,
  variant = 'standard',
}: ArticleCardProps) {
  const href = `/kategori/${categorySlug}/${slug}`

  if (variant === 'hero') {
    return (
      <Link href={href} className="group relative block overflow-hidden rounded-xl">
        <div className="aspect-[16/9] bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={coverImageAlt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-6 text-white">
          <span className="mb-2 inline-block rounded bg-primary px-2 py-0.5 text-xs font-medium">{categoryName}</span>
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h2>
          {summary && <p className="mt-2 line-clamp-2 text-sm text-white/80">{summary}</p>}
          <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
            <span>{authorName}</span>
            {publishedAt && <><span>•</span><span>{formatDate(publishedAt)}</span></>}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group flex gap-4">
        <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={coverImageAlt ?? title}
              fill
              sizes="128px"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <span className="text-xs font-medium text-primary">{categoryName}</span>
          <h3 className="mt-0.5 font-semibold leading-snug group-hover:text-primary">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {authorName}{publishedAt && ` • ${formatDate(publishedAt)}`}
          </p>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group block border-b py-3 last:border-0">
        <h3 className="text-sm font-medium leading-snug group-hover:text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{publishedAt && formatDate(publishedAt)}</p>
      </Link>
    )
  }

  // Standard card
  return (
    <Link href={href} className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={coverImageAlt ?? title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-primary">{categoryName}</span>
        <h3 className="mt-1 font-semibold leading-snug group-hover:text-primary">{title}</h3>
        {summary && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{summary}</p>}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{authorName}</span>
          {publishedAt && <><span>•</span><span>{formatDate(publishedAt)}</span></>}
        </div>
      </div>
    </Link>
  )
}

export function generateSlug(title: string): string {
  let slug = title.toLowerCase()
  const trMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  }
  for (const [from, to] of Object.entries(trMap)) {
    slug = slug.replaceAll(from, to)
  }
  slug = slug.replace(/[^a-z0-9\s-]/g, '')
  slug = slug.replace(/\s+/g, '-')
  slug = slug.replace(/-+/g, '-')
  slug = slug.replace(/^-|-$/g, '')
  return slug
}

export function formatDate(dateStr: string, locale = 'tr-TR'): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDatetime(dateStr: string, locale = 'tr-TR'): string {
  return new Date(dateStr).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

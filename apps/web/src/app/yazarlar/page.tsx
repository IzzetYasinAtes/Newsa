import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@newsa/supabase'
import type { Metadata } from 'next'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Yazarlar',
  description: 'Newsa haber platformu yazarlari ve editörleri',
  openGraph: {
    title: 'Yazarlar | Newsa',
    description: 'Newsa haber platformu yazarlari ve editörleri',
    type: 'website',
    url: `${SITE_URL}/yazarlar`,
  },
}

interface AuthorWithCount {
  id: string
  full_name: string
  display_name: string | null
  avatar_url: string | null
  role: string
  article_count: number
}

const roleLabels: Record<string, string> = {
  admin: 'Yönetici',
  editor: 'Editör',
  author: 'Yazar',
}

interface ProfileRow {
  id: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  role: string | null
}

interface ArticleAuthorRow {
  author_id: string | null
}

async function getAuthors(): Promise<AuthorWithCount[]> {
  try {
    const supabase = await createServerClient()

    const { data: rawProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, avatar_url, role')
      .in('role', ['admin', 'editor', 'author'])
      .order('full_name')

    const profiles = (rawProfiles ?? []) as unknown as ProfileRow[]
    if (profiles.length === 0) return []

    const authorIds = profiles.map((p) => p.id)

    const { data: rawCounts } = await supabase
      .from('articles')
      .select('author_id')
      .eq('status', 'published')
      .in('author_id', authorIds)

    const counts = (rawCounts ?? []) as unknown as ArticleAuthorRow[]

    const countMap = new Map<string, number>()
    for (const row of counts) {
      const authorId = row.author_id
      if (authorId) {
        countMap.set(authorId, (countMap.get(authorId) ?? 0) + 1)
      }
    }

    return profiles.map((p) => ({
      id: p.id,
      full_name: p.full_name ?? '',
      display_name: p.display_name ?? null,
      avatar_url: p.avatar_url ?? null,
      role: p.role ?? 'author',
      article_count: countMap.get(p.id) ?? 0,
    }))
  } catch {
    return []
  }
}

export default async function YazarlarPage() {
  const authors = await getAuthors()

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Yazarlar</h1>

      {authors.length === 0 ? (
        <p className="text-muted-foreground">Henuz yazar bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/yazar/${author.id}`}
              className="group flex flex-col items-center rounded-xl border border-border/50 bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full bg-muted">
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.display_name ?? author.full_name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    placeholder="empty"
                    quality={75}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
                    {(author.display_name ?? author.full_name).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold group-hover:text-primary">
                {author.display_name ?? author.full_name}
              </h2>

              <span className="mt-1 text-sm text-muted-foreground">
                {roleLabels[author.role] ?? author.role}
              </span>

              <span className="mt-2 text-sm font-medium text-primary">
                {author.article_count} haber
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

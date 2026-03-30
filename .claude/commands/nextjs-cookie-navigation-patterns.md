# Cookie & Navigation Pattern'leri

## Client-Side Cookie Pattern

Client component'ten cookie set etmek için iki dosya gerekli:

### Pattern: Client Component + Server Action

```typescript
// 1. Server Action (lib/actions/cookies.ts)
'use server'

import { cookies } from 'next/headers'

export async function setTheme(theme: 'light' | 'dark') {
  const cookieStore = await cookies()
  cookieStore.set('theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 yıl
    path: '/',
  })
}

export async function acceptCookieConsent() {
  const cookieStore = await cookies()
  cookieStore.set('cookie-consent', 'accepted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
}
```

```typescript
// 2. Client Component (components/ThemeToggle.tsx)
'use client'

import { setTheme } from '@/lib/actions/cookies'

export function ThemeToggle({ currentTheme }: { currentTheme: string }) {
  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
    >
      {currentTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

```typescript
// 3. Server Component'te cookie oku ve geçir
import { cookies } from 'next/headers'
import { ThemeToggle } from './ThemeToggle'

export default async function Layout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'

  return (
    <html lang="tr" data-theme={theme}>
      <body>
        <ThemeToggle currentTheme={theme} />
        {children}
      </body>
    </html>
  )
}
```

## Server Navigation Pattern'leri

### Server Component'te Navigasyon
```typescript
// 1. Link component (statik navigasyon)
import Link from 'next/link'

<Link href="/haber/slug">Habere Git</Link>
<Link href="/kategori/teknoloji" prefetch={true}>Teknoloji</Link>

// 2. redirect (programatik, server action/component içinde)
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')  // Server-side redirect
}

// 3. Server Action içinde redirect
'use server'
export async function createArticle(formData: FormData) {
  const article = await saveArticle(formData)
  redirect(`/admin/haberler/${article.id}`)
}
```

### Client Component'te Navigasyon
```typescript
'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  return <button onClick={() => router.back()}>Geri</button>
}

export function SearchForm() {
  const router = useRouter()

  function handleSearch(query: string) {
    router.push(`/arama?q=${encodeURIComponent(query)}`)
  }
}
```

### Karar Ağacı
```
Navigasyon tipi?
├── Statik link → <Link href="...">
├── Koşullu redirect (server) → redirect()
├── Form submit sonrası → Server Action + redirect()
├── Kullanıcı eylemi (client) → useRouter().push()
└── Geri gitme → useRouter().back()
```

## useSearchParams + Suspense

```typescript
// searchParams kullanan client component'ler Suspense ile SARULMALI

'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchInputInner() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  return <input defaultValue={q} name="q" />
}

// ZORUNLU: Suspense ile sar
export function SearchInput() {
  return (
    <Suspense fallback={<input disabled placeholder="Yükleniyor..." />}>
      <SearchInputInner />
    </Suspense>
  )
}
```

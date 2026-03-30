# Server vs Client Components Karar Rehberi

## Temel Kural

**Server Component varsayılandır.** `"use client"` sadece gerektiğinde ekle.

## Ne Zaman Server Component?

- Veritabanı/API'den veri çekme
- Hassas bilgilere erişim (API key, token)
- Cookie/header okuma
- SEO kritik içerik render etme
- Büyük bağımlılıkları client bundle'dan tutma
- Metadata üretimi

```typescript
// Server Component (varsayılan, directive yok)
import { createServerClient } from '@newsa/supabase/server'

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  const article = await supabase.from('articles').select('*').eq('slug', slug).single()

  return <article>{/* render */}</article>
}
```

## Ne Zaman Client Component?

**SADECE** şu durumlarda `"use client"` ekle:
- `onClick`, `onChange` gibi event handler'lar
- `useState`, `useEffect`, `useRef` gibi hook'lar
- Browser API'leri (localStorage, window, navigator)
- Üçüncü parti kütüphane gerektiren interaktif bileşenler

```typescript
'use client'

import { useState } from 'react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Haber ara..."
    />
  )
}
```

## Karar Ağacı

```
Bileşen etkileşim gerektiriyor mu?
├── Hayır → SERVER Component
│   ├── Veri çekme → async Server Component
│   ├── Metadata → generateMetadata
│   └── Statik içerik → Server Component
└── Evet → Sadece etkileşimli kısmı CLIENT yap
    ├── Tüm sayfayı 'use client' YAPMA
    ├── Küçük interaktif parçayı ayır
    └── Server Component içinde Client Component kullan
```

## Composition Pattern (Kritik)

Server Component içinde Client Component kullan, tersi değil:

```typescript
// app/haber/[slug]/page.tsx (Server Component)
import { ShareButtons } from '@/components/ShareButtons'  // Client
import { RelatedArticles } from '@/components/RelatedArticles'  // Server

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug)

  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content_html }} />

      {/* Client component - sadece interaktif kısım */}
      <ShareButtons url={`/haber/${article.slug}`} title={article.title} />

      {/* Server component - veri çekme server'da */}
      <RelatedArticles articleId={article.id} />
    </article>
  )
}
```

## Anti-Pattern'ler (YAPMA)

### 1. Tüm sayfayı client yapma
```typescript
// YANLIS - tüm sayfayı client yapma
'use client'
export default function ArticlePage() { ... }

// DOGRU - sadece interaktif parçayı ayır
// page.tsx (server) + InteractiveWidget.tsx ('use client')
```

### 2. Server'da yapılabilecek işi client'ta yapma
```typescript
// YANLIS
'use client'
export function ArticleList() {
  const [articles, setArticles] = useState([])
  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(setArticles)
  }, [])
}

// DOGRU
export default async function ArticleList() {
  const articles = await getPublishedArticles()
  return <ul>{articles.map(a => <li key={a.id}>{a.title}</li>)}</ul>
}
```

### 3. Gereksiz API route oluşturma
```typescript
// YANLIS - Server Component'te API route'a istek atma
// Doğrudan veritabanını sorgula

// DOGRU
const supabase = await createServerClient()
const { data } = await supabase.from('articles').select('*')
```

## Cookie/Header Erişimi

```typescript
// Server Component'te
import { cookies, headers } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
}
```

## searchParams Kullanımı

```typescript
// Server Component'te (Next.js 15+)
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const results = await searchArticles(q, Number(page) || 1)
  return <SearchResults results={results} />
}

// Client Component'te - Suspense ZORUNLU
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchInput() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  return <input defaultValue={q} />
}

// Kullanım - Suspense ile sar
export function SearchBar() {
  return (
    <Suspense fallback={<input disabled placeholder="Yükleniyor..." />}>
      <SearchInput />
    </Suspense>
  )
}
```

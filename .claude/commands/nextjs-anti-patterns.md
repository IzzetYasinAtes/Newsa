# Next.js Anti-Pattern'ler

Bu skill, Next.js App Router'da sık yapılan hataları ve doğru yaklaşımları tanımlar.

## 1. Gereksiz useEffect Kullanımı

### Tarayıcı Algılama
```typescript
// YANLIS
'use client'
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  setIsMobile(window.innerWidth < 768)
}, [])

// DOGRU - CSS media query veya Tailwind responsive
<div className="hidden md:block">Desktop</div>
<div className="block md:hidden">Mobile</div>
```

### Veri Çekme
```typescript
// YANLIS
'use client'
useEffect(() => {
  fetch('/api/articles').then(...)
}, [])

// DOGRU - Server Component ile doğrudan
export default async function Page() {
  const articles = await getArticles()
  return <ArticleList articles={articles} />
}
```

### URL/Pathname Algılama
```typescript
// YANLIS
'use client'
useEffect(() => {
  const path = window.location.pathname
  setCurrentPath(path)
}, [])

// DOGRU - Server'da params/searchParams kullan
export default async function Page({ params, searchParams }: Props) {
  // Doğrudan erişim
}
```

## 2. Gereksiz useState Kullanımı

### Server'dan Gelen Veri
```typescript
// YANLIS
'use client'
const [articles, setArticles] = useState(initialArticles)

// DOGRU - Server Component'te props olarak geçir
export default async function Page() {
  const articles = await getArticles()
  return <ArticleList articles={articles} />
}
```

### Türetilmiş Değer
```typescript
// YANLIS
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// DOGRU - Doğrudan hesapla
const fullName = `${firstName} ${lastName}`
```

## 3. Pages Router Pattern'leri App Router'da

```typescript
// YANLIS - Pages Router API
export async function getServerSideProps() { ... }
export async function getStaticProps() { ... }
import Head from 'next/head'

// DOGRU - App Router
export default async function Page() {
  const data = await fetchData()  // Doğrudan async component
  return <div>{/* render */}</div>
}
export const metadata: Metadata = { title: '...' }  // Head yerine
```

## 4. Performans Anti-Pattern'leri

### Waterfall Request'ler
```typescript
// YANLIS - Sıralı (yavaş)
const articles = await getArticles()
const categories = await getCategories()
const tags = await getTags()

// DOGRU - Paralel
const [articles, categories, tags] = await Promise.all([
  getArticles(),
  getCategories(),
  getTags(),
])
```

### Gereksiz 'use client'
```typescript
// YANLIS - Tüm sayfayı client yapma
'use client'
export default function ArticlePage({ article }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.summary}</p>
      <ShareButtons />  {/* Sadece bu interaktif */}
    </div>
  )
}

// DOGRU - Sadece interaktif kısmı ayır
// page.tsx (server)
export default function ArticlePage({ article }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.summary}</p>
      <ShareButtons url={article.slug} />  {/* 'use client' sadece bu dosyada */}
    </div>
  )
}
```

### Gereksiz API Route
```typescript
// YANLIS - Server Component'ten kendi API'ine istek atma
'use client'
const res = await fetch('/api/articles')

// DOGRU - Server Component'te doğrudan veritabanı sorgusu
const supabase = await createServerClient()
const { data } = await supabase.from('articles').select('*')
```

## 5. Navigasyon Anti-Pattern'leri

```typescript
// YANLIS - Server Component'te useRouter
import { useRouter } from 'next/navigation'  // Client-only hook

// DOGRU - Server Component'te Link veya redirect
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Link ile
<Link href="/haber/slug">Habere Git</Link>

// Programatik (server action içinde)
redirect('/haber/slug')
```

## 6. Routing Anti-Pattern'leri

### Aşırı Derinlik
```typescript
// YANLIS
app/news/articles/details/[id]/content/page.tsx  // /news/articles/details/123/content

// DOGRU
app/haber/[slug]/page.tsx  // /haber/haberin-slugi
```

### Route Handler'da Gereksiz Sarmalama
```typescript
// YANLIS - Supabase'i API route üzerinden sarmala
// app/api/articles/route.ts
export async function GET() {
  const articles = await supabase.from('articles').select('*')
  return Response.json(articles)
}
// Sonra Server Component'te fetch('/api/articles')

// DOGRU - Doğrudan sorgu (sadece dış istemciler için API route yaz)
const { data } = await supabase.from('articles').select('*')
```

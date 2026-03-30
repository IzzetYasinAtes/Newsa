# Next.js App Router Fundamentals

Bu skill, Next.js 14+ App Router ile çalışırken uyulması gereken temel kuralları ve pattern'leri tanımlar.

## Dosya Tabanlı Yönlendirme (File-Based Routing)

### Dosya Konvansiyonları
- `page.tsx` → Route UI (sayfa)
- `layout.tsx` → Paylaşılan layout (child'ları sarar)
- `loading.tsx` → Loading UI (Suspense fallback)
- `error.tsx` → Error UI (Error Boundary)
- `not-found.tsx` → 404 UI
- `route.ts` → API endpoint (Route Handler)
- `template.tsx` → Her navigasyonda yeniden render edilen layout

### Doğru Yapı

```
app/
├── layout.tsx                    # Root layout (zorunlu)
├── page.tsx                      # / (anasayfa)
├── haber/
│   └── [slug]/
│       ├── page.tsx              # /haber/haberin-slugi
│       └── loading.tsx           # Loading state
├── kategori/
│   └── [slug]/
│       └── page.tsx              # /kategori/teknoloji
├── (auth)/                       # Route group (URL'de görünmez)
│   ├── login/page.tsx
│   └── register/page.tsx
└── api/
    └── v1/
        └── articles/
            └── route.ts          # API endpoint
```

## Metadata (SEO İçin Kritik)

### Statik Metadata
```typescript
// Her page.tsx veya layout.tsx'de
export const metadata: Metadata = {
  title: 'Sayfa Başlığı',
  description: 'Sayfa açıklaması',
}
```

### Dinamik Metadata
```typescript
// Dinamik sayfalarda (haber detay gibi)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params  // Next.js 15+: params Promise'dir
  const article = await getArticle(slug)

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.cover_image_url],
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author.display_name],
    },
  }
}
```

## generateStaticParams (SSG)

```typescript
// Derleme zamanında hangi yollar statik oluşturulacak
export async function generateStaticParams() {
  const articles = await getPublishedArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}
```

## Layout Kuralları

1. Root layout **zorunlu**, `<html>` ve `<body>` tag'leri içermeli
2. Layout'lar **yeniden render edilmez** (state korunur)
3. Layout'lar children prop alır, iç içe geçer
4. Sayfa bazlı layout için route group `(group)` kullan

```typescript
// app/layout.tsx - Root Layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

## Dinamik Rotalar

```typescript
// app/haber/[slug]/page.tsx
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>  // Next.js 15+
}) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()
  return <ArticleDetail article={article} />
}
```

## Route Groups

URL yapısını etkilemeden dosyaları organize et:
```
app/
├── (marketing)/          # URL'de görünmez
│   ├── layout.tsx        # Marketing sayfaları layout'u
│   ├── about/page.tsx    # /about
│   └── contact/page.tsx  # /contact
├── (news)/               # URL'de görünmez
│   ├── layout.tsx        # Haber sayfaları layout'u
│   ├── haber/[slug]/page.tsx  # /haber/slug
│   └── kategori/[slug]/page.tsx
```

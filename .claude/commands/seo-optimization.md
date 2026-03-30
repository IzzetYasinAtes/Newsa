# SEO Optimizasyon Skill'i

Haber sitesi için SEO kritik bir gerekliliktir. Bu skill tüm SEO kurallarını tanımlar.

## 1. Metadata Yönetimi

### Statik Sayfalar
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    default: 'Newsa - Güncel Haberler',
    template: '%s | Newsa',  // Alt sayfalarda: "Başlık | Newsa"
  },
  description: 'Türkiye ve dünyadan güncel haberler',
  keywords: ['haber', 'güncel', 'son dakika', 'türkiye'],
  authors: [{ name: 'Newsa' }],
  creator: 'Newsa',
  publisher: 'Newsa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Newsa',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@newsa',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}
```

### Haber Detay Sayfası (Dinamik)
```typescript
// app/haber/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Haber Bulunamadı' }

  const title = article.seo_title || article.title
  const description = article.seo_description || article.summary
  const image = article.cover_image_url

  return {
    title,
    description,
    keywords: article.seo_keywords,
    authors: [{ name: article.author.display_name }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      authors: [article.author.display_name],
      section: article.category.name,
      tags: article.tags?.map(t => t.name),
      images: image ? [{
        url: image,
        width: 1200,
        height: 630,
        alt: article.cover_image_alt || article.title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: article.canonical_url || `/haber/${article.slug}`,
    },
  }
}
```

## 2. JSON-LD Yapısal Veri

### NewsArticle Schema
```typescript
// components/ArticleJsonLd.tsx
export function ArticleJsonLd({ article }: { article: Article }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: article.cover_image_url ? [article.cover_image_url] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author.display_name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/yazar/${article.author.id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Newsa',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/haber/${article.slug}`,
    },
    articleSection: article.category.name,
    keywords: article.tags?.map(t => t.name).join(', '),
    wordCount: article.content_html?.split(/\s+/).length,
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

### BreadcrumbList Schema
```typescript
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

## 3. Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
  ]

  // Kategoriler
  const categories = await getCategories()
  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/kategori/${cat.slug}`,
    lastModified: cat.updated_at,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Haberler (son 1000)
  const articles = await getPublishedArticles({ limit: 1000 })
  const articlePages: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${baseUrl}/haber/${article.slug}`,
    lastModified: article.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...articlePages]
}
```

## 4. robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

## 5. Görsel Optimizasyonu (SEO + Performans)

```typescript
import Image from 'next/image'

// ZORUNLU: width, height ve alt belirt
<Image
  src={article.cover_image_url}
  alt={article.cover_image_alt || article.title}  // Alt text zorunlu
  width={1200}
  height={630}
  priority={isAboveFold}  // Viewport'ta görünen görseller için
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

## 6. URL ve Slug Kuralları

- Slug Türkçe karakter içermemeli: `ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u`
- Küçük harf, kelimeler tire ile ayrılmalı
- Özel karakterler kaldırılmalı
- Maksimum 100 karakter
- URL yapısı: `/haber/{slug}` veya `/kategori/{category-slug}`
- Canonical URL her sayfada olmalı
- Slug değişirse 301 redirect oluşturulmalı

## 7. Core Web Vitals

- **LCP < 2.5s**: Hero image'da `priority` prop, font preload
- **FID < 100ms**: Minimal client JS, code splitting
- **CLS < 0.1**: Image boyutları belirli, font-display: swap
- ISR/SSG ile hızlı TTFB
- Kritik CSS inline
- Lazy load: viewport dışı görseller

## 8. Rendering Stratejisi (SEO Açısından)

| Sayfa | Strateji | SEO Önemi |
|-------|----------|-----------|
| Anasayfa | ISR (60s) | Çok Yüksek |
| Haber Detay | SSG + ISR | Çok Yüksek |
| Kategori | ISR (120s) | Yüksek |
| Etiket | ISR (300s) | Orta |
| Yazar | ISR (300s) | Orta |
| Arama | SSR | Düşük (noindex) |

## 9. Kontrol Listesi

Her sayfa için:
- [ ] `<title>` benzersiz ve açıklayıcı (50-60 karakter)
- [ ] `<meta description>` benzersiz (150-160 karakter)
- [ ] Canonical URL tanımlı
- [ ] Open Graph meta tag'leri
- [ ] Twitter Card meta tag'leri
- [ ] JSON-LD yapısal veri
- [ ] H1 tag'i tek ve anlamlı
- [ ] Görsellerde alt text
- [ ] Internal linking
- [ ] Mobile-friendly
- [ ] Hızlı yüklenme (< 3s)

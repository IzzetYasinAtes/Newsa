# Responsive & Mobile Design Skill'i

Haber sitesi mobile-first tasarlanmalı. Okuyucuların büyük çoğunluğu mobil cihazlardan gelir.

## 1. Temel Prensipler

- **Mobile-first**: Küçük ekrandan başla, büyüğe doğru genişlet
- **Tailwind CSS**: Utility-first, responsive prefix'ler
- **CSS yerine Tailwind**: Gereksiz custom CSS yazma
- **useEffect ile viewport algılama YAPMA**: CSS/Tailwind responsive kullan

## 2. Breakpoint Sistemi

```typescript
// tailwind.config.ts - Varsayılan breakpoint'ler yeterli
// sm: 640px  | md: 768px  | lg: 1024px  | xl: 1280px  | 2xl: 1536px

// Mobile-first yaklaşım: prefix olmadan mobile, prefix ile büyük ekran
<div className="
  px-4          // Mobile: 16px padding
  md:px-8       // Tablet: 32px padding
  lg:px-16      // Desktop: 64px padding
  xl:max-w-7xl xl:mx-auto  // Geniş ekran: max genişlik + ortalama
">
```

## 3. Haber Kartı (Responsive)

```typescript
export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="
      flex flex-col           // Mobile: dikey
      md:flex-row             // Tablet+: yatay
      gap-4
      p-4
      border-b border-gray-200
    ">
      {/* Görsel */}
      <div className="
        relative
        w-full                // Mobile: tam genişlik
        md:w-48 md:flex-shrink-0  // Tablet: sabit genişlik
        lg:w-64
        aspect-video          // 16:9 oran
        md:aspect-square      // Tablet: kare
      ">
        <Image
          src={article.cover_image_url}
          alt={article.cover_image_alt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 192px, 256px"
          className="object-cover rounded-lg"
        />
      </div>

      {/* İçerik */}
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-xs text-blue-600 font-medium uppercase">
          {article.category.name}
        </span>
        <h2 className="
          text-lg              // Mobile
          md:text-xl           // Tablet
          lg:text-2xl          // Desktop
          font-bold leading-tight
        ">
          <Link href={`/haber/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="
          text-sm text-gray-600
          line-clamp-2         // Mobile: 2 satır
          md:line-clamp-3      // Tablet+: 3 satır
        ">
          {article.summary}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
          <span>{article.author.display_name}</span>
          <span>·</span>
          <time>{formatDate(article.published_at)}</time>
        </div>
      </div>
    </article>
  )
}
```

## 4. Grid Listeleme (Responsive)

```typescript
// Haber grid'i - mobilde 1, tablette 2, masaüstünde 3 kolon
<div className="
  grid
  grid-cols-1       // Mobile: 1 kolon
  sm:grid-cols-2    // Tablet küçük: 2 kolon
  lg:grid-cols-3    // Desktop: 3 kolon
  xl:grid-cols-4    // Geniş: 4 kolon
  gap-4
  md:gap-6
">
  {articles.map(article => (
    <ArticleCard key={article.id} article={article} />
  ))}
</div>
```

## 5. Navigasyon (Mobile Hamburger)

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'

export function MobileNav({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger butonu - sadece mobile */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" /* hamburger icon */ />
      </button>

      {/* Desktop menü */}
      <nav className="hidden md:flex items-center gap-6" aria-label="Ana menü">
        {categories.map(cat => (
          <Link key={cat.id} href={`/kategori/${cat.slug}`}
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Mobile menü - overlay */}
      {isOpen && (
        <div className="
          fixed inset-0 z-50
          md:hidden
          bg-white
          flex flex-col
        ">
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-bold text-xl">Newsa</span>
            <button onClick={() => setIsOpen(false)} aria-label="Menüyü kapat">
              <svg className="w-6 h-6" /* close icon */ />
            </button>
          </div>
          <nav className="flex flex-col p-4" aria-label="Mobil menü">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="py-3 text-lg border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
```

## 6. Admin Panel (Tablet + Desktop)

```typescript
// Admin sidebar - mobile'da gizle, toggle ile göster
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="
        hidden             // Mobile: gizli
        md:flex            // Tablet+: görünür
        md:w-64
        flex-col
        bg-gray-900 text-white
        fixed inset-y-0 left-0
      ">
        <AdminSidebar />
      </aside>

      {/* Main content */}
      <main className="
        flex-1
        md:ml-64           // Sidebar genişliği kadar margin
        p-4 md:p-8
      ">
        {/* Mobile topbar */}
        <div className="md:hidden mb-4">
          <MobileAdminNav />
        </div>
        {children}
      </main>
    </div>
  )
}
```

## 7. Tipografi (Responsive)

```typescript
// Haber detay sayfası tipografi
<article className="
  prose                    // Tailwind Typography plugin
  prose-sm                 // Mobile: küçük
  md:prose-base            // Tablet: normal
  lg:prose-lg              // Desktop: büyük
  prose-headings:font-bold
  prose-a:text-blue-600
  prose-img:rounded-lg
  max-w-none               // Tam genişlik
  md:max-w-3xl             // Tablet+: max genişlik
  mx-auto                  // Ortala
">
  <h1 className="
    text-2xl               // Mobile
    md:text-3xl            // Tablet
    lg:text-4xl            // Desktop
    !leading-tight
  ">
    {article.title}
  </h1>
  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content_html) }} />
</article>
```

## 8. Touch Hedefleri

```typescript
// Minimum 44x44px touch hedefi (WCAG 2.5.5)
<button className="
  min-h-[44px] min-w-[44px]  // Minimum touch hedef
  p-3
  flex items-center justify-center
">
  <Icon className="w-5 h-5" />
</button>

// Link listelerinde yeterli boşluk
<nav className="flex flex-col">
  {items.map(item => (
    <Link key={item.id} href={item.url} className="
      py-3 px-4              // Yeterli padding
      min-h-[44px]           // Minimum yükseklik
      flex items-center
    ">
      {item.label}
    </Link>
  ))}
</nav>
```

## 9. Görsel Optimizasyonu (Mobil)

```typescript
// Next.js Image - responsive sizes ZORUNLU
<Image
  src={article.cover_image_url}
  alt={article.cover_image_alt || article.title}
  width={1200}
  height={630}
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  priority={isHero}           // Hero image için priority
  placeholder="blur"          // Blur placeholder
  blurDataURL={article.blur_hash}
  className="w-full h-auto object-cover"
/>
```

## 10. Kontrol Listesi

- [ ] Mobile-first Tailwind kullanımı (prefix'siz = mobile)
- [ ] Tüm sayfalar 320px genişlikte düzgün görünüyor
- [ ] Touch hedefleri minimum 44x44px
- [ ] Hamburger menü mobile'da çalışıyor
- [ ] Form alanları mobile'da kullanılabilir
- [ ] Görseller responsive `sizes` prop'u ile
- [ ] Metin okunabilir (min 14px mobile'da)
- [ ] Yatay kaydırma yok (overflow-x: hidden)
- [ ] Input'larda zoom yapmıyor (min font-size 16px)
- [ ] Landscape ve portrait uyumlu
- [ ] Tablet görünümü düzgün (768-1024px)
- [ ] Admin panel tablet'te kullanılabilir

# UI Design System Skill'i

Newsa haber platformu için tutarlı, modern ve kullanılabilir bir UI sistemi.

**Component Kütüphanesi**: shadcn/ui (Radix UI + Tailwind CSS) temel alınır.
Tüm temel component'ler (Button, Input, Card, Badge, Dialog, Sheet, vb.) shadcn/ui'dan
kurulur ve proje ihtiyacına göre özelleştirilir. Elle component yazmak yerine `npx shadcn@latest add` kullanılır.

**Referanslar**:
- shadcn/ui: https://ui.shadcn.com
- shadcn/ui blocks: https://ui.shadcn.com/blocks
- Admin dashboard pattern: satnaing/shadcn-admin (11.6k star)
- Blog blocks: shadcnblocks.com/blocks/blog (22+ hazır block)
- Rich text editör: shadcn-minimal-tiptap (Tiptap + shadcn/ui)

## 1. Temel Araçlar ve Kurulum

```bash
# shadcn/ui kurulumu (her Next.js app'te)
npx shadcn@latest init

# Temel component'ler
npx shadcn@latest add button input card badge dialog sheet
npx shadcn@latest add dropdown-menu navigation-menu breadcrumb
npx shadcn@latest add pagination skeleton avatar separator
npx shadcn@latest add tabs toast scroll-area command table
npx shadcn@latest add select textarea checkbox switch label
npx shadcn@latest add popover calendar form alert tooltip
```

shadcn/ui component'leri `components/ui/` altına eklenir ve doğrudan düzenlenebilir.

## 2. Renk Sistemi

shadcn/ui CSS variables sistemi kullanılır. Tailwind'e doğrudan HEX yazmak yerine
CSS custom properties üzerinden çalışılır - bu dark mode geçişini kolaylaştırır.

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;           /* Beyaz */
    --foreground: 0 0% 9%;             /* Siyaha yakın */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 9%;
    --primary: 221 83% 53%;            /* Mavi - ana marka rengi */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;          /* Kırmızı */
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 221 83% 53%;
    --radius: 0.5rem;

    /* Haber kategorileri - ek özel renkler */
    --category-politics: 0 72% 51%;     /* Kırmızı */
    --category-economy: 142 71% 45%;    /* Yeşil */
    --category-sports: 221 83% 53%;     /* Mavi */
    --category-tech: 263 70% 50%;       /* Mor */
    --category-culture: 330 81% 60%;    /* Pembe */
    --category-world: 189 94% 43%;      /* Cyan */
    --category-health: 25 95% 53%;      /* Turuncu */
  }

  .dark {
    --background: 0 0% 7%;              /* #121212 */
    --foreground: 0 0% 94%;             /* #f0f0f0 - off-white */
    --card: 0 0% 10%;
    --card-foreground: 0 0% 94%;
    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 94%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 224 76% 48%;
  }
}
```

### Dark Mode Kuralları
- Dark mode tam renk yeniden tasarımı gerektirir, sadece ters çevirme yapılmaz
- Metin: off-white (`#e0e0e0` - `#f0f0f0`), saf beyaz (`#fff`) kullanma
- Arka plan: off-black (`#121212` - `#1a1a1a`), saf siyah (`#000`) kullanma
- Derinlik: dark mode'da gölge yerine daha açık arka plan ile yükseklik göster
- Görseller: dark mode'da hafif parlaklık azaltma (`brightness-90`)

## 3. Tipografi

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      fontFamily: {
        // Başlıklar: Serif font → editoryal otorite hissi (haber sitesi standardı)
        heading: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        // Body: Humanist sans-serif → okunabilirlik
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Haber içeriği: serif veya sans seçilebilir
        article: ['Merriweather', 'Georgia', 'serif'],
        // Kod/mono
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

### Font Yükleme (next/font ile)
```typescript
// app/layout.tsx
import { Inter, Playfair_Display, Merriweather } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' })
const merriweather = Merriweather({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-article',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

### Tipografi Kullanımı
```typescript
// Manşet başlık (serif - editoryal)
<h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">

// Haber kartı başlık (sans - modern)
<h2 className="font-sans text-xl md:text-2xl font-bold text-foreground leading-snug">

// Haber içeriği (serif veya sans - okunabilirlik)
<article className="font-article text-lg leading-relaxed text-foreground/80">

// Meta bilgi (tarih, yazar, kategori)
<span className="text-sm text-muted-foreground">

// Kategori etiketi
<span className="text-xs font-semibold uppercase tracking-wider text-primary">
```

## 4. Spacing ve Container

```
4px  = p-1   → İkon iç boşluk
8px  = p-2   → Kompakt eleman iç boşluk
12px = p-3   → Buton iç boşluk
16px = p-4   → Kart iç boşluk (mobil)
24px = p-6   → Kart iç boşluk (desktop)
32px = p-8   → Section padding
48px = p-12  → Section arası boşluk
64px = p-16  → Büyük bölüm arası
```

```typescript
// Sayfa container
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

// İçerik container (haber detay)
<div className="mx-auto max-w-3xl px-4">

// Geniş container (anasayfa)
<div className="mx-auto max-w-[1400px] px-4 sm:px-6">
```

## 5. Haber Kartı Varyantları (5 tip)

### Hero Card (Manşet - Tam Genişlik)
```typescript
export function ArticleCardHero({ article }: { article: Article }) {
  return (
    <article className="group relative overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        <Image
          src={article.cover_image_url}
          alt={article.cover_image_alt || article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
        <Badge className="bg-primary text-primary-foreground mb-3">
          {article.category.name}
        </Badge>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          <Link href={`/haber/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl">
          {article.summary}
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={article.author.avatar_url} />
              <AvatarFallback>{article.author.display_name[0]}</AvatarFallback>
            </Avatar>
            <span>{article.author.display_name}</span>
          </div>
          <Separator orientation="vertical" className="h-4 bg-white/30" />
          <time dateTime={article.published_at}>{formatRelativeDate(article.published_at)}</time>
        </div>
      </div>
    </article>
  )
}
```

### Featured Card (Öne Çıkan - Büyük)
```typescript
export function ArticleCardFeatured({ article }: { article: Article }) {
  return (
    <article className="group">
      <Card className="overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.cover_image_url}
            alt={article.cover_image_alt || article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{article.category.name}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatRelativeDate(article.published_at)}
            </span>
          </div>
          <h3 className="font-heading text-xl md:text-2xl font-bold leading-snug
            group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/haber/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarImage src={article.author.avatar_url} />
              <AvatarFallback>{article.author.display_name[0]}</AvatarFallback>
            </Avatar>
            <span>{article.author.display_name}</span>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
```

### Standard Card (Listeleme)
```typescript
export function ArticleCardStandard({ article }: { article: Article }) {
  return (
    <article className="group">
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image src={article.cover_image_url} alt={article.cover_image_alt || article.title}
            fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover" />
        </div>
        <CardContent className="p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {article.category.name}
          </span>
          <h3 className="mt-1 text-lg font-bold leading-snug line-clamp-2
            group-hover:text-primary transition-colors">
            <Link href={`/haber/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{article.author.display_name}</span>
            <span>·</span>
            <time dateTime={article.published_at}>{formatRelativeDate(article.published_at)}</time>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
```

### Horizontal Card (Yatay - Liste Görünümü)
```typescript
export function ArticleCardHorizontal({ article }: { article: Article }) {
  return (
    <article className="group flex gap-4 py-4 border-b last:border-0">
      <div className="relative w-32 h-24 md:w-48 md:h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image src={article.cover_image_url} alt={article.cover_image_alt || article.title}
          fill sizes="(max-width: 768px) 128px, 192px" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">{article.category.name}</Badge>
          <time className="text-xs text-muted-foreground">{formatRelativeDate(article.published_at)}</time>
        </div>
        <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2
          group-hover:text-primary transition-colors">
          <Link href={`/haber/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1 hidden md:block">
          {article.summary}
        </p>
      </div>
    </article>
  )
}
```

### Compact Card (Sidebar / En Çok Okunanlar)
```typescript
export function ArticleCardCompact({ article, rank }: { article: Article; rank?: number }) {
  return (
    <article className="flex gap-3 py-3 border-b border-border last:border-0">
      {rank && (
        <span className="text-2xl font-bold text-muted-foreground/30 w-8 flex-shrink-0 tabular-nums">
          {String(rank).padStart(2, '0')}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-primary">{article.category.name}</span>
        <h4 className="mt-0.5 text-sm font-semibold leading-snug line-clamp-2
          hover:text-primary transition-colors">
          <Link href={`/haber/${article.slug}`}>{article.title}</Link>
        </h4>
        <time className="text-xs text-muted-foreground mt-1 block">
          {formatRelativeDate(article.published_at)}
        </time>
      </div>
      {article.cover_image_url && (
        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <Image src={article.cover_image_url} alt="" fill className="object-cover" sizes="64px" />
        </div>
      )}
    </article>
  )
}
```

## 6. Anasayfa Layout - Bento Grid Pattern

2025-2026 trend: Bento grid layout - farklı boyutlarda kartların modüler düzeni.
Ana haber büyük alan kaplar, ikincil haberler küçük hücrelerde yer alır.

```typescript
export default async function HomePage() {
  const [headlines, latest, mostRead, categories] = await Promise.all([
    getHeadlines(5),
    getLatestArticles(12),
    getMostReadArticles(5),
    getActiveCategories(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

      {/* Son Dakika Bandı */}
      <BreakingNewsTicker />

      {/* Manşet - Bento Grid */}
      <section aria-label="Manşet haberler">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ana manşet - 2x2 büyük hücre */}
          <div className="md:col-span-2 md:row-span-2">
            <ArticleCardHero article={headlines[0]} />
          </div>
          {/* Yan haberler - 1x1 hücreler */}
          <div className="hidden lg:block">
            <ArticleCardFeatured article={headlines[1]} />
          </div>
          <div className="hidden lg:block">
            <ArticleCardFeatured article={headlines[2]} />
          </div>
          <div className="hidden lg:block">
            <ArticleCardFeatured article={headlines[3]} />
          </div>
          <div className="hidden lg:block">
            <ArticleCardFeatured article={headlines[4]} />
          </div>
        </div>
        {/* Mobilde kalan haberler yatay scroll */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory mt-4 lg:hidden pb-2
          -mx-4 px-4 scrollbar-hide">
          {headlines.slice(1).map(article => (
            <div key={article.id} className="snap-start w-[280px] flex-shrink-0">
              <ArticleCardStandard article={article} />
            </div>
          ))}
        </div>
      </section>

      {/* Ana İçerik + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol: Son Haberler */}
        <div className="lg:col-span-2 space-y-8">
          <SectionHeader title="Son Haberler" link="/son-haberler" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latest.map(article => (
              <ArticleCardStandard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sag: Sidebar */}
        <aside className="space-y-6">
          {/* En Çok Okunanlar */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">En Çok Okunanlar</h2>
            </CardHeader>
            <CardContent className="p-0">
              {mostRead.map((article, i) => (
                <ArticleCardCompact key={article.id} article={article} rank={i + 1} />
              ))}
            </CardContent>
          </Card>

          {/* Kategoriler */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">Kategoriler</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Link key={cat.id} href={`/kategori/${cat.slug}`}>
                    <Badge variant="secondary">{cat.name}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Kategoriye Göre Haberler */}
      {categories.slice(0, 3).map(category => (
        <section key={category.id} aria-label={`${category.name} haberleri`}>
          <SectionHeader title={category.name} link={`/kategori/${category.slug}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {category.articles?.slice(0, 4).map(article => (
              <ArticleCardStandard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
```

### Section Header
```typescript
export function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-primary pb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {link && (
        <Link href={link} className="text-sm text-primary hover:underline">
          Tümünü Gör
        </Link>
      )}
    </div>
  )
}
```

## 7. Son Dakika Ticker

```typescript
'use client'

import { useEffect, useState } from 'react'

export function BreakingNewsTicker({ news }: { news: BreakingNews[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || news.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, news.length])

  if (news.length === 0) return null

  return (
    <div
      className="bg-destructive text-destructive-foreground"
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-3">
        <Badge className="bg-white text-destructive font-bold text-xs shrink-0 animate-pulse">
          SON DAKİKA
        </Badge>
        <div className="overflow-hidden flex-1">
          <Link
            href={`/haber/${news[currentIndex].slug}`}
            className="text-sm font-medium hover:underline truncate block"
          >
            {news[currentIndex].title}
          </Link>
        </div>
      </div>
    </div>
  )
}
```

## 8. Skeleton Loading States

```typescript
// Kart skeleton
export function ArticleCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

// Anasayfa skeleton
export function HomePageSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Next.js loading.tsx ile kullan
// app/loading.tsx
export default function Loading() {
  return <HomePageSkeleton />
}
```

## 9. Empty States

```typescript
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Kullanım
<EmptyState
  icon={FileTextIcon}
  title="Henüz haber yok"
  description="Bu kategoride henüz yayınlanmış haber bulunmuyor."
/>
```

## 10. Admin Panel (shadcn/ui Dashboard Pattern)

Admin panelde shadcn/ui'ın dashboard bileşenleri kullanılır:

### Sidebar Navigasyon
```typescript
// shadcn/ui Sheet + NavigationMenu ile
const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: FileText, label: 'Haberler', href: '/admin/haberler' },
  { icon: FolderTree, label: 'Kategoriler', href: '/admin/kategoriler' },
  { icon: Tags, label: 'Etiketler', href: '/admin/etiketler' },
  { icon: ImageIcon, label: 'Medya', href: '/admin/medya' },
  { icon: Users, label: 'Kullanıcılar', href: '/admin/kullanicilar' },
  { icon: Settings, label: 'Ayarlar', href: '/admin/ayarlar' },
]
```

### Data Table (TanStack Table + shadcn/ui)
```typescript
// shadcn/ui Table + TanStack Table kombinasyonu
// Özellikler: sıralama, filtreleme, pagination, satır seçimi, toplu işlem
import { DataTable } from '@/components/ui/data-table'

const columns: ColumnDef<Article>[] = [
  { accessorKey: 'title', header: 'Başlık', cell: ({ row }) => (
    <div className="max-w-sm">
      <p className="font-medium truncate">{row.getValue('title')}</p>
      <p className="text-xs text-muted-foreground truncate">/haber/{row.original.slug}</p>
    </div>
  )},
  { accessorKey: 'category.name', header: 'Kategori' },
  { accessorKey: 'status', header: 'Durum', cell: ({ row }) => (
    <StatusBadge status={row.getValue('status')} />
  )},
  { accessorKey: 'published_at', header: 'Tarih', cell: ({ row }) => (
    <span className="text-muted-foreground">{formatDate(row.getValue('published_at'))}</span>
  )},
  { id: 'actions', cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Düzenle</DropdownMenuItem>
        <DropdownMenuItem>Önizle</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Sil</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )},
]
```

### Status Badge
```typescript
const statusConfig = {
  draft:     { label: 'Taslak',    variant: 'secondary' as const },
  review:    { label: 'İnceleme',  variant: 'outline' as const, className: 'border-amber-500 text-amber-600' },
  published: { label: 'Yayında',   variant: 'default' as const, className: 'bg-green-500' },
  archived:  { label: 'Arşiv',     variant: 'secondary' as const },
}
```

### Rich Text Editör
```typescript
// shadcn-minimal-tiptap kullan (Tiptap + shadcn/ui entegrasyonu)
// Kurulum: npx shadcn@latest add (manual - github.com/Aslam97/shadcn-minimal-tiptap)
// Alternatif: Plate editor (AI destekli)
```

## 11. Arama (Command Palette Pattern)

```typescript
// shadcn/ui Command component ile (Kbar benzeri)
'use client'

import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command'

export function SearchCommand() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}
        className="text-muted-foreground gap-2">
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Haber ara...</span>
        <kbd className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Haber, kategori veya etiket ara..." />
        <CommandList>
          <CommandGroup heading="Son Aramalar">
            {/* ... */}
          </CommandGroup>
          <CommandGroup heading="Haberler">
            {/* Arama sonuçları */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

## 12. Geçiş ve Animasyon

```typescript
// Sade, hızlı ve amaçlı animasyonlar
className="transition-colors duration-150"     // Renk geçişi (hover)
className="transition-shadow duration-200"     // Gölge (kart hover)
className="transition-transform duration-500"  // Transform (görsel zoom)

// Kart hover
className="hover:shadow-lg transition-shadow duration-200"

// Görsel hover (zoom) - group ile
className="group-hover:scale-105 transition-transform duration-500"

// Micro-animation: badge pulse (son dakika)
className="animate-pulse"

// İçerik girişi (Faz 2)
// Intersection Observer ile scroll-aware animasyonlar

// YAPMA:
// - 300ms'den uzun geçişler (görsel zoom hariç)
// - Layout shift yaratan animasyonlar
// - Her yerde animasyon kullanma
// - Otomatik carousel/slider (kullanıcıyı rahatsız eder)
```

## 13. Kurallar

1. **shadcn/ui öncelikli**: Elle component yazmadan önce shadcn/ui'da var mı kontrol et
2. **CSS variables**: Renkleri doğrudan yazmak yerine `text-foreground`, `bg-background` kullan
3. **Dark mode ready**: Her component light/dark uyumlu olmalı (CSS variables ile otomatik)
4. **Tutarlılık**: Aynı element her yerde aynı görünmeli
5. **Serif başlık**: Manşet ve haber başlıklarında `font-heading` (serif) kullan
6. **Kontrast**: WCAG AA minimum 4.5:1 (metin), 3:1 (büyük metin)
7. **Focus state**: Her interaktif elemanda görünür focus halkası
8. **Skeleton loader**: Loading state için skeleton kullan, spinner değil
9. **Empty state**: Boş listeler için anlamlı mesaj + ikon göster
10. **line-clamp**: Başlıklar ve özetler için `line-clamp-*` ile taşmayı önle
11. **next/font**: Font yükleme her zaman next/font ile (FOUT/FOIT önleme)
12. **Image sizes**: Her Image component'te `sizes` prop zorunlu

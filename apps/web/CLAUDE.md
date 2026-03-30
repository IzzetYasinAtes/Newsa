# Nevsa Web - Son Kullanıcı Haber Sitesi

## Amaç
SEO uyumlu, hızlı, modern haber okuma deneyimi sunan son kullanıcı sitesi.

## Teknik Kurallar
- **Rendering**: SSG/ISR varsayılan (SEO kritik), SSR sadece dinamik sayfalar (arama)
- **Components**: Server Components varsayılan, `"use client"` sadece gerektiğinde
- **SEO**: Her sayfa `generateMetadata` kullanmalı, JSON-LD yapısal veri eklenm eli
- **Images**: Next.js `Image` component ile, width/height belirtilmeli
- **Port**: 3000

## Sayfa Yapısı
```
src/app/
├── layout.tsx              # Root layout (header, footer)
├── page.tsx                # Anasayfa
├── haber/[slug]/page.tsx   # Haber detay
├── kategori/[slug]/page.tsx # Kategori sayfası
├── etiket/[slug]/page.tsx  # Etiket sayfası
├── yazar/[id]/page.tsx     # Yazar sayfası
├── arama/page.tsx          # Arama sonuçları
├── sitemap.ts              # Dynamic sitemap
├── robots.ts               # robots.txt
└── not-found.tsx           # 404 sayfası
```

## Bağımlılıklar
- `@newsa/shared` - Tipler ve utility'ler
- `@newsa/supabase` - Veri erişimi
- `@newsa/ui` - Paylaşılan bileşenler

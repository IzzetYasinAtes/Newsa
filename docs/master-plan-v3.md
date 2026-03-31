# NEWSA - MASTER PLAN V3 (Yeni Nesil Tasarım ve Eksik Tamamlama)

## Bağlam

Bu doküman, Newsa haber platformunun **Faz 1-5 tamamlanması sonrası** yapılan kapsamlı E2E test ve analiz sonuçlarına dayanır. Referans site olarak [Yeni Kocaeli Gazetesi](https://www.yenikocaeli.com/) incelenmiştir. Mevcut platform çalışır durumda ancak **kritik eksikler, UI/UX yetersizlikleri ve performans sorunları** tespit edilmiştir.

**Test sonucu**: 26 sayfa test edildi → 18 düzgün, 5 kısmen, 3 bozuk.

---

## 1. Executive Summary

Master Plan V3, 4 fazda teslim edilecek:

| Faz | Odak | Tahmini Süre |
|-----|------|-------------|
| **Faz 6** | Kritik Bug Fix & Eksik Tamamlama | ~1 hafta |
| **Faz 7** | Yeni Nesil UI/UX Tasarım (Anasayfa & Web) | ~2 hafta |
| **Faz 8** | İleri Özellikler & İçerik Zenginleştirme | ~2 hafta |
| **Faz 9** | Performans, SEO Polish & Production Deploy | ~1 hafta |

**Hedef**: yenikocaeli.com referansından çok daha modern, hızlı ve kullanıcı dostu bir haber platformu.

---

## 2. E2E Test Bulguları (Özet)

### Kritik Sorunlar (BLOCKER)
| # | Sorun | Etkilenen Alan |
|---|-------|---------------|
| B1 | `/sayfa/[slug]` route'u web'de YOK — Hakkımızda, İletişim, Gizlilik hepsi 404 | Web |
| B2 | Kullanıcılar sayfası 0 kullanıcı gösteriyor (RLS sorunu) | Admin |
| B3 | Roller sayfası boş — seed data eksik | Admin |
| B4 | Denetim logları boş — audit mekanizması tetiklenmiyor | Admin |

### Önemli Sorunlar
| # | Sorun | Etkilenen Alan |
|---|-------|---------------|
| I1 | Arama sadece başlık üzerinden çalışıyor (full-text search yok) | Web |
| I2 | Kategori sayfalarında pagination YOK | Web |
| I3 | Kategori sayfalarında breadcrumb YOK | Web |
| I4 | Haber detayında "ilgili haberler" bölümü YOK | Web |
| I5 | Haber detayında kapak resmi altında büyük boşluk | Web |
| I6 | Yazar sayfasına erişim yolu yok (haber detayında link yok) | Web |
| I7 | Manşet yönetimi boş gösteriyor | Admin |
| I8 | Header/Footer'da Türkçe karakter eksikliği | Web |

### CRUD Test Bulguları (Admin Panel)
| # | Sorun | Etkilenen Alan | Öncelik |
|---|-------|---------------|---------|
| C1 | Kullanıcılar sayfası 0 gösteriyor — RLS veya veri çekme hatası | Admin | KRITIK |
| C2 | Roller sayfası 0 sistem rolü gösteriyor — RLS veya query hatası | Admin | KRITIK |
| C3 | Haber listesindeki satır "Sil" butonu çalışmıyor (düzenleme sayfasındaki çalışıyor) | Admin | ORTA |
| C4 | Bildirimler oturum açan kullanıcıya atanmamış, test edilemedi | Admin | DÜŞÜK |

### CRUD Başarılı İşlemler (12/16)
- ✅ Haber oluşturma/düzenleme/silme (detay sayfasından)
- ✅ Kategori oluşturma/düzenleme/silme
- ✅ Etiket oluşturma/silme (inline form)
- ✅ Menü düzenleme (öğe ekleme, sıralama)
- ✅ Sayfa oluşturma/düzenleme (TipTap editör)
- ✅ Reklam kampanya detay & creative listesi
- ✅ Ayarlar değiştirme/kaydetme
- ✅ Medya kütüphanesi (15 dosya, grid görünüm)
- ✅ Slug otomatik üretimi (Türkçe destekli)
- ✅ Form validasyonları doğru çalışıyor

### Düşük Öncelikli
| # | Sorun | Etkilenen Alan |
|---|-------|---------------|
| L1 | CSP hatası — reklam API connect-src'de izin yok | Web |
| L2 | Footer'da slug uyuşmazlığı (gizlilik vs gizlilik-politikasi) | Web |
| L3 | Bildirimler sayfası boş (admin kullanıcısına bildirim atanmamış) | Admin |

---

## 3. Referans Site Analizi (yenikocaeli.com)

### Mevcut Newsa'da Olmayan Özellikler

| # | Özellik | Referansta Var | Newsa'da Var | Öncelik |
|---|---------|---------------|-------------|---------|
| 1 | Döviz/Altın kurları bandı | ✅ | ❌ | Orta |
| 2 | Hava durumu widget | ✅ | ❌ | Düşük |
| 3 | Sidebar (en çok okunanlar, son dakika) | ✅ | ❌ | Yüksek |
| 4 | Yazarlar/Köşe yazarları sayfası | ✅ | Kısmen (bozuk) | Yüksek |
| 5 | Fotoğraf galerisi sayfası | ✅ | ❌ | Orta |
| 6 | Video haberleri / Web TV | ✅ | ❌ | Düşük |
| 7 | Trend konular / Hashtag sistemi | ✅ | ❌ | Orta |
| 8 | İlgili haberler bölümü | ✅ | ❌ | Yüksek |
| 9 | Sosyal medya paylaşım butonları | ✅ | ✅ | - |
| 10 | Breadcrumb navigasyon | ✅ | Kısmen | Yüksek |
| 11 | E-Gazete / PDF arşiv | ✅ | ❌ | Düşük |
| 12 | Nöbetçi eczane / Servisler | ✅ | ❌ | Düşük |

### Tasarım Farkları

**yenikocaeli.com**: Klasik gazete portalı, 2010'lu yıllar tasarımı, kalabalık layout, aşırı sidebar.

**Newsa hedefi**: Modern, minimalist, hızlı. Tailwind CSS ile yeni nesil tasarım. Referansın **içerik yapısını** al ama **tasarımını alma**.

---

## FAZ 6 — Kritik Bug Fix & Eksik Tamamlama (~1 hafta)

### 6.1 Statik Sayfa Route'u Oluşturma (B1) — P0
**Dosya**: `apps/web/src/app/sayfa/[slug]/page.tsx`

- Supabase'den `pages` tablosundan slug'a göre sayfa çek
- `generateMetadata` ile SEO
- content_html render
- 404 handling
- Footer link'lerini düzelt (slug uyuşmazlığı L2)

### 6.2 Kullanıcılar Sayfası RLS Fix (B2) — P0
**Sorun**: Admin panelde 0 kullanıcı gösteriyor.
- `profiles` tablosundaki RLS policy'yi kontrol et
- Admin kullanıcının profiles SELECT'e erişimini doğrula
- `get_my_role()` SECURITY DEFINER fonksiyonu ile düzelt

### 6.3 Roller Sayfası Veri Eşleme (B3) — P0
**Sorun**: `/roller` sayfası 0 rol gösteriyor.
- Admin sayfasının `roles` tablosunu nasıl sorguladığını kontrol et
- RLS policy kontrol ve düzelt
- 10 sistem rolü listelenebilmeli

### 6.4 Denetim Log Mekanizması (B4) — P1
**Sorun**: Audit log'lar boş.
- Haber oluşturma/güncelleme/silme işlemlerinde audit_log INSERT trigger'ı ekle
- Veya uygulama katmanında log kaydı yap (Supabase query sonrası)
- Mevcut seed audit log'ları kontrol et (RLS engelliyor olabilir)

### 6.5 Manşet Yönetimi Veri Eşleme (I7) — P1
**Sorun**: Admin manşet sayfası 0 gösteriyor ama anasayfada manşetler var.
- Manşet sayfasının query'sini kontrol et
- `is_headline`, `is_featured`, `is_breaking` alanları doğru sorgulanıyor mu?

### 6.6 Bildirimler Eşleme (L3) — P2
- Mevcut admin kullanıcısının (İzzet Yasin) ID'sine bildirim atanmamış
- Seed data'da bildirimler `b0000000...` UUID'lerine atanmış
- Giriş yapan kullanıcıya da örnek bildirimler ekle

### 6.7 CSP Fix (L1) — P2
- Web next.config.js'deki CSP `connect-src`'ye `localhost:3002` (veya API URL) ekle
- Production'da da doğru domain olmalı

### 6.8 Haber Listesi Satır Silme Butonu Fix (C3) — P1
**Sorun**: Haber listesinde satırdaki "Sil" butonu tıklandığında çalışmıyor.
- Event handler'ı kontrol et
- Confirm dialog tetikleniyor mu?
- Haber düzenleme sayfasındaki silme çalışıyor ama listedeki çalışmıyor
- Muhtemelen event propagation veya state sorunu

### 6.9 Türkçe Karakter Düzeltme (I8) — P1
- Header.tsx'deki kategori isimleri hardcoded ve Türkçe karaktersiz
- DB'den dinamik menü çekme veya hardcoded isimleri düzelt:
  - "Gundem" → "Gündem"
  - "Kultur-Sanat" → "Kültür-Sanat"

**Çıktılar:**
- Tüm statik sayfalar web'de açılıyor
- Admin'de kullanıcılar, roller, denetim logları görünüyor
- Manşet yönetimi çalışıyor
- CSP hataları yok

---

## FAZ 7 — Yeni Nesil UI/UX Tasarım (~2 hafta)

### 7.1 Anasayfa Yeniden Tasarım — P0

Mevcut anasayfa basit 3 bölümlü grid. Yeni nesil tasarım:

```
┌─────────────────────────────────────────────────┐
│ [SON DAKİKA BANDI - kayan metin, kırmızı arka]  │
├─────────────────────────────────────────────────┤
│ HEADER: Logo | Menü | Arama | Tema Toggle       │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────┐  ┌──────────┐             │
│  │  MANŞET (büyük)  │  │ Manşet 2 │             │
│  │  hero resim       │  ├──────────┤             │
│  │  + overlay text   │  │ Manşet 3 │             │
│  └──────────────────┘  └──────────┘             │
│                                                  │
├──────────────────────────┬──────────────────────┤
│                          │                      │
│  ÖNE ÇIKANLAR            │  SIDEBAR             │
│  (3'lü grid kartlar)     │  ┌──────────────┐   │
│                          │  │ En Çok       │   │
│  SON HABERLER            │  │ Okunanlar    │   │
│  (liste + küçük resim)   │  ├──────────────┤   │
│                          │  │ Trend        │   │
│  KATEGORİ BLOKLARI       │  │ Etiketler    │   │
│  (Ekonomi | Spor | ...)  │  ├──────────────┤   │
│                          │  │ Reklam       │   │
│                          │  │ Alanı        │   │
│                          │  └──────────────┘   │
├──────────────────────────┴──────────────────────┤
│ FOOTER: Linkler | Sosyal | Copyright             │
└─────────────────────────────────────────────────┘
```

**Bileşenler:**
- `BreakingNewsBanner` — Son dakika kayan bandı (Supabase Realtime)
- `HeroSection` — Büyük manşet + 2 küçük manşet, overlay text
- `FeaturedGrid` — 3'lü kart grid, hover efektleri
- `LatestNewsList` — Sol kolon, sonsuz scroll veya "Daha Fazla Yükle"
- `Sidebar` — Sağ kolon (sticky), en çok okunanlar, trend etiketler
- `CategoryBlocks` — Her kategori için mini haber bloğu
- `MostReadWidget` — Sıra numarası + mini kart
- `TrendingTags` — Popüler etiketler bulutu

### 7.2 Haber Kartı Tasarım Sistemi — P0

4 kart varyantı:

| Varyant | Kullanım | Özellik |
|---------|----------|---------|
| `hero` | Manşet | Tam genişlik, overlay, büyük font |
| `featured` | Öne çıkan | Orta boy, resim üst, başlık alt |
| `compact` | Liste görünümü | Küçük resim sol, başlık sağ |
| `minimal` | Sidebar / En çok okunan | Sıra no + başlık, resimsiz |

Her kartta:
- Kategori badge (renkli)
- Yayın tarihi (relative: "2 saat önce")
- Yazar adı
- Görüntülenme sayısı (opsiyonel)
- Hover: scale + shadow animasyonu

### 7.3 Header Yeniden Tasarım — P0

```
┌─────────────────────────────────────────────────┐
│ [Newsa Logo]  Gündem Ekonomi Teknoloji Spor ... │
│               [Arama ikonu] [Tema] [Mobil menü] │
└─────────────────────────────────────────────────┘
```

- Sticky header (scroll'da küçülen)
- Mega menü (hover'da alt kategori dropdown)
- Mobil: hamburger menü + drawer
- Dark/light tema toggle
- Menü öğeleri DB'den dinamik (menus tablosundan)

### 7.4 Footer Yeniden Tasarım — P1

```
┌─────────────────────────────────────────────────┐
│ NEWSA LOGO  │  KATEGORİLER  │  KURUMSAL  │ İLETİŞİM │
│             │  Gündem        │  Hakkımızda │  info@... │
│  Açıklama   │  Ekonomi       │  İletişim   │  Tel      │
│  metni      │  Teknoloji     │  Gizlilik   │          │
│             │  Spor          │  KVKK       │  Sosyal  │
│             │  Dünya         │  Kullanım   │  medya   │
├─────────────────────────────────────────────────┤
│ © 2026 Newsa. Tüm hakları saklıdır.            │
└─────────────────────────────────────────────────┘
```

### 7.5 Haber Detay Sayfası Yeniden Tasarım — P0

Mevcut sorunlar: boşluk, ilgili haberler yok, yazar linki yok.

```
┌─────────────────────────────────────────────────┐
│ Breadcrumb: Anasayfa > Bilim > Haber Başlığı    │
├──────────────────────────┬──────────────────────┤
│                          │                      │
│ [Kategori Badge]         │  SIDEBAR             │
│ HABER BAŞLIĞI            │  ┌──────────────┐   │
│ Yazar | Tarih | Okunma   │  │ İlgili       │   │
│                          │  │ Haberler     │   │
│ [KAPAK RESMİ]            │  ├──────────────┤   │
│                          │  │ En Çok       │   │
│ Haber metni...           │  │ Okunanlar    │   │
│ ...                      │  ├──────────────┤   │
│                          │  │ Etiketler    │   │
│ [ETİKETLER]              │  ├──────────────┤   │
│ [PAYLAŞIM BUTONLARI]     │  │ Reklam       │   │
│                          │  └──────────────┘   │
├──────────────────────────┴──────────────────────┤
│ İLGİLİ HABERLER (aynı kategoriden 4 haber)      │
└─────────────────────────────────────────────────┘
```

### 7.6 Kategori Sayfası İyileştirme — P1
- Pagination ekleme (mevcut etiket sayfasındaki gibi)
- Breadcrumb ekleme
- Alt kategori navigasyonu
- Sidebar: en çok okunanlar (bu kategoride)

### 7.7 Yazar Sayfası Düzeltme — P1
- Haber detayında yazar adına tıklanabilir link
- `/yazar/[id]` route'unda profil + yazarın haberleri
- Avatar, bio, haber sayısı, toplam okunma

### 7.8 Arama Sayfası Geliştirme — P1
- Full-text search (Supabase `textSearch` veya `to_tsquery`)
- Başlık + özet + içerik üzerinden arama
- Kategori filtresi
- Tarih aralığı filtresi
- Sonuç sayısı gösterimi

### 7.9 Responsive & Mobil Tasarım — P0
- Mobile-first yaklaşım
- Hamburger menü
- Swipeable haber kartları
- Touch-friendly butonlar
- Mobil sidebar collapse

**Çıktılar:**
- Yeni nesil anasayfa (sidebar, manşet hero, en çok okunanlar)
- Modern haber kartı sistemi (4 varyant)
- Responsive header/footer
- Haber detay sayfası (sidebar, ilgili haberler)
- Çalışan arama (full-text)
- Çalışan yazar sayfası
- Tüm sayfalar mobil uyumlu

---

## FAZ 8 — İleri Özellikler & İçerik Zenginleştirme (~2 hafta)

### 8.1 Son Dakika Kayan Bandı — P1
- Anasayfa üstünde kırmızı bant
- `is_breaking=true` haberlerden beslenir
- CSS animation veya marquee
- Supabase Realtime ile canlı güncelleme

### 8.2 En Çok Okunanlar Widget — P0
- Son 7 gün / 30 gün filtreleme
- Sıra numarası (1-10)
- Sidebar'da sticky
- view_count'a göre sıralama

### 8.3 Trend Etiketler Widget — P1
- Son 7 günde en çok kullanılan etiketler
- Kelime bulutu veya liste görünümü
- Etiket sayfasına link

### 8.4 Kategori Blokları (Anasayfa) — P1
Her kategoriden son 3-4 haber:
```
┌─ EKONOMİ ──────────────┐ ┌─ SPOR ──────────────────┐
│ [Büyük haber]           │ │ [Büyük haber]           │
│ ● Alt haber 1           │ │ ● Alt haber 1           │
│ ● Alt haber 2           │ │ ● Alt haber 2           │
│ ● Alt haber 3           │ │ ● Alt haber 3           │
└─────────────────────────┘ └─────────────────────────┘
```

### 8.5 Dark Mode — P2
- Tailwind `dark:` class'ları
- Tema toggle butonu (header'da)
- `next-themes` paketi
- localStorage ile tercih saklama

### 8.6 Sonsuz Scroll / "Daha Fazla Yükle" — P1
- Anasayfa son haberler bölümünde
- Kategori sayfalarında
- Intersection Observer API

### 8.7 Resim Yükleme Performansı — P0
**Sorun**: Resimler yavaş yükleniyor.

Çözümler:
- `next/image` ile otomatik webp/avif dönüşümü (zaten var)
- `placeholder="blur"` + `blurDataURL` ile placeholder
- Lazy loading (varsayılan)
- Resim boyutları: cover için max 800px genişlik, thumbnail için max 400px
- Picsum.photos yerine Supabase Storage + Vercel Image Optimization
- `sizes` prop ile responsive image sizes

### 8.8 Yazarlar Listesi Sayfası — P2
- `/yazarlar` route'u
- Tüm yazarların grid görünümü
- Avatar, ad, bio, haber sayısı
- Yazara tıklayınca `/yazar/[id]`

### 8.9 RSS Feed İyileştirme — P2
- Kategori bazlı RSS (`/rss/gundem.xml`)
- Tam içerikli RSS (content_html)
- Atom feed desteği

### 8.10 Sosyal Medya Zenginleştirme — P2
- Twitter Card preview optimize
- Facebook OG image optimize
- WhatsApp paylaşım butonu
- Kopyala linki butonu

**Çıktılar:**
- Son dakika bandı çalışıyor
- En çok okunanlar widget'ı
- Trend etiketler
- Kategori blokları anasayfada
- Dark mode
- Hızlı resim yüklemesi
- Yazarlar listesi sayfası

---

## FAZ 9 — Performans, SEO Polish & Production Deploy (~1 hafta)

### 9.1 Performans Optimizasyon — P0
- Bundle analyzer ile gereksiz paket tespiti
- Dynamic import ile lazy loading
- Sentry'yi production-only yap (✅ zaten yapıldı)
- Supabase query cache'leme stratejisi
- ISR revalidation süreleri optimize
- Core Web Vitals hedefleri: LCP <2.5s, FID <100ms, CLS <0.1

### 9.2 SEO Final Kontrol — P0
- Tüm sayfaların meta title/description kontrolü
- JSON-LD (NewsArticle, BreadcrumbList, Organization)
- Sitemap.xml'de tüm sayfalar mevcut mu
- robots.txt final kontrol
- Canonical URL'ler
- Google Search Console'a submit

### 9.3 Lighthouse CI — P1
- GitHub Actions'da Lighthouse CI (veya manual)
- Hedef: Performance >90, Accessibility >90, Best Practices >90, SEO >90
- Her PR'da otomatik skor

### 9.4 Accessibility (a11y) Kontrolü — P1
- ARIA label'lar
- Keyboard navigasyon
- Color contrast (WCAG 2.1 AA)
- Screen reader uyumluluğu
- Focus management

### 9.5 E2E Test Suite Tamamlama — P1
- Mevcut 6 test dosyasını çalıştır ve düzelt
- Yeni senaryolar ekle:
  - Statik sayfa erişimi
  - Haber arama
  - Kategori navigasyonu
  - Admin CRUD işlemleri

### 9.6 Production Deployment — P0
- Vercel'e 3 proje deploy
- Supabase production migration
- Environment variables
- Custom domain
- SSL
- Production checklist (docs/production-checklist.md mevcut)

### 9.7 Monitoring & Alerting — P2
- Sentry production DSN
- Vercel Analytics
- Uptime monitoring
- Error rate alerting

**Çıktılar:**
- Lighthouse >90 tüm metriklerde
- Tüm SEO kontrolleri geçiyor
- E2E testler geçiyor
- Production'da canlı
- Monitoring aktif

---

## 5. Sprint Planı

### Sprint 1 (Faz 6, Hafta 1): Bug Fix
| # | Görev | Öncelik | Effort |
|---|-------|---------|--------|
| 1 | `/sayfa/[slug]` route oluştur | P0 | M |
| 2 | Kullanıcılar RLS fix | P0 | S |
| 3 | Roller RLS fix | P0 | S |
| 4 | Denetim log mekanizması | P1 | M |
| 5 | Manşet yönetimi veri eşleme | P1 | S |
| 6 | Türkçe karakter düzeltme | P1 | S |
| 7 | CSP fix | P2 | S |
| 8 | Footer slug düzeltme | P2 | S |
| 9 | Haber listesi satır silme butonu fix | P1 | S |
| 10 | Bildirim seed — oturum açan kullanıcıya bildirim ata | P2 | S |

### Sprint 2-3 (Faz 7, Hafta 2-3): UI/UX
| # | Görev | Öncelik | Effort |
|---|-------|---------|--------|
| 9 | Anasayfa yeniden tasarım | P0 | XL |
| 10 | Haber kartı sistemi (4 varyant) | P0 | L |
| 11 | Header redesign (sticky, mega menu) | P0 | L |
| 12 | Haber detay redesign (sidebar, ilgili haberler) | P0 | L |
| 13 | Footer redesign | P1 | M |
| 14 | Kategori sayfası (pagination, breadcrumb) | P1 | M |
| 15 | Yazar sayfası düzeltme | P1 | M |
| 16 | Arama full-text search | P1 | M |
| 17 | Responsive/mobil tasarım | P0 | L |

### Sprint 4-5 (Faz 8, Hafta 4-5): İleri Özellikler
| # | Görev | Öncelik | Effort |
|---|-------|---------|--------|
| 18 | Son dakika bandı | P1 | M |
| 19 | En çok okunanlar widget | P0 | M |
| 20 | Trend etiketler | P1 | S |
| 21 | Kategori blokları | P1 | M |
| 22 | Resim yükleme performansı | P0 | M |
| 23 | Dark mode | P2 | M |
| 24 | Sonsuz scroll | P1 | M |
| 25 | Yazarlar listesi sayfası | P2 | M |

### Sprint 6 (Faz 9, Hafta 6): Polish & Deploy
| # | Görev | Öncelik | Effort |
|---|-------|---------|--------|
| 26 | Performans optimizasyon | P0 | L |
| 27 | SEO final kontrol | P0 | M |
| 28 | Lighthouse CI | P1 | S |
| 29 | Accessibility kontrol | P1 | M |
| 30 | E2E test tamamlama | P1 | M |
| 31 | Production deployment | P0 | L |
| 32 | Monitoring setup | P2 | S |

---

## 6. Resim Performans Stratejisi (Detay)

Mevcut sorun: picsum.photos görselleri yavaş yükleniyor, Next.js Image optimize ediyor ama kaynak yavaş.

### Kısa Vadeli Çözüm (Faz 6)
- `next/image` `unoptimized={false}` (varsayılan, zaten optimize)
- `sizes` prop ekle: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- `priority` prop manşet resimlerine ekle (LCP optimizasyonu)
- `placeholder="blur"` + basit blurDataURL

### Uzun Vadeli Çözüm (Faz 8)
- Gerçek görselleri Supabase Storage'a yükle
- Vercel Image Optimization ile otomatik resize
- WebP/AVIF formatları (next.config'de zaten var)
- CDN cache headers

---

## 7. Tasarım Prensipleri

### Newsa vs yenikocaeli.com Farkları

| Özellik | yenikocaeli.com | Newsa (Hedef) |
|---------|----------------|---------------|
| Tasarım dili | Klasik gazete, kalabalık | Modern, minimalist, temiz |
| Renk paleti | Kırmızı-beyaz, ağır | Primary blue + nötr tonlar |
| Tipografi | Geleneksel serif | Inter (modern sans-serif) |
| Grid sistemi | Sabit genişlik | Responsive, fluid |
| Animasyonlar | Yok | Subtle hover/transition |
| Dark mode | Yok | Var |
| Sidebar | Her yerde, kalabalık | Sadece anasayfa ve detay |
| Reklam | Agresif, her yerde | Kontrollü, 4 zone |
| Mobil | Responsive ama eski | Mobile-first, modern |

### Renk Sistemi
```
Primary: Blue-600 (#2563EB)
Secondary: Slate-700 (#334155)
Accent: Red-600 (#DC2626) — son dakika, breaking
Background: White / Dark: Slate-900
Card: White / Dark: Slate-800
Muted: Slate-500
```

### Tipografi
```
Başlık: Inter, 700 weight
Alt başlık: Inter, 600 weight
Gövde: Inter, 400 weight
Küçük: Inter, 400 weight, text-sm
Kategori badge: Inter, 500 weight, text-xs, uppercase
```

---

## 8. Doğrulama Kontrol Noktaları

1. **Faz 6 Sonunda**: Tüm blocker bug'lar düzeltilmiş, statik sayfalar açılıyor, admin panelde tüm veriler görünüyor
2. **Faz 7 Sonunda**: Yeni anasayfa canlı, sidebar çalışıyor, mobil tasarım OK, arama full-text
3. **Faz 8 Sonunda**: Son dakika bandı, en çok okunanlar, dark mode, hızlı resim yükleme
4. **Faz 9 Sonunda**: Lighthouse >90, production'da canlı, monitoring aktif

---

## 9. Riskler

| # | Risk | Olasılık | Etki | Azaltma |
|---|------|----------|------|---------|
| R1 | Anasayfa redesign scope creep | Yüksek | Orta | Strict component boundary, iteratif delivery |
| R2 | Full-text search Türkçe performansı | Orta | Orta | Turkish text search config test, fallback ILIKE |
| R3 | Dark mode renk tutarsızlıkları | Orta | Düşük | Tailwind dark: class sistematik kullanım |
| R4 | Supabase Realtime (son dakika) bağlantı limitleri | Orta | Orta | Fallback polling, tier upgrade planı |
| R5 | Vercel Image optimization maliyeti | Düşük | Orta | Resim boyut limitleri, CDN caching |

---

*Bu plan, E2E test sonuçları + referans site analizi + mevcut kod tabanı incelemesi sonucu oluşturulmuştur.*
*Toplam tahmini süre: ~6 hafta.*

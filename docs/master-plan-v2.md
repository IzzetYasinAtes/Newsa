# NEWSA - MASTER PLAN (Kapsamli)

## Bağlam (Context)

Bu doküman, Newsa haber platformunun uçtan uca geliştirme planıdır. Proje şu anda **planlama ve dokümantasyon aşamasında** olup, henüz hiç kod yazılmamıştır. Mevcut repoda 10 doküman, 4 agent tanımı, 10 skill dosyası ve boş proje yapısı bulunmaktadır. Bu master plan, mevcut dokümanları genişleterek üretim kalitesinde, eksiksiz bir referans dokümanı oluşturmayı hedefler.

Mevcut veri modeli 10 tablo (profiles, categories, tags, articles, media, article_tags, article_media, related_articles, settings, audit_logs) ve 4 basit rol (admin, editor, author, viewer) içermektedir. Bu plan, bu temeli 29 tabloya ve 10 detaylı role genişletir.

---

## 1. Executive Summary

**Newsa**, Türkiye ve bölge odaklı modern bir dijital haber platformudur. Next.js 14+ (App Router), Supabase (PostgreSQL, Auth, Storage, Realtime) ve Vercel üzerine kurulu monorepo mimarisiyle 3 uygulama barındırır:

- **Newsa Web** — SEO uyumlu, performanslı son kullanıcı haber sitesi
- **Newsa Admin** — Detaylı editöryal yönetim paneli (RBAC, yayın akışı, medya, reklam)
- **Newsa API** — Mobil uygulama ve dış istemciler için RESTful API

**5 fazda** teslim edilecek olup, toplam tahmini süre **~14 haftadır**:
1. Faz 1 — Altyapı ve Temel Kurulum (~2 hafta)
2. Faz 2 — Temel İçerik Yönetimi (~3 hafta)
3. Faz 3 — Haber Sitesi ve SEO (~3 hafta)
4. Faz 4 — İleri Özellikler (RBAC, yayın akışı, bildirimler) (~3 hafta)
5. Faz 5 — Monetizasyon ve Üretim Hazırlığı (~3 hafta)

**Nihai çıktı**: Günde 50-200 haber yayınlayabilen, 5-15 kişilik editör ekibinin çalışabileceği, reklam geliri üretebilen, tam SEO uyumlu, mobil destekli profesyonel bir haber platformu.

---

## 2. Product Scope (Ürün Kapsamı)

### 2.1 Ürün Vizyonu

Newsa, hızlı, SEO uyumlu, yönetimi kolay ve ölçeklenebilir bir haber deneyimi sunmayı hedefler. 3 ana hedef kitle:
- **Son Kullanıcı (Okuyucu)**: Hızlı, temiz okuma deneyimi; mobil öncelikli, reklam entegrasyonlu
- **Editör Ekibi**: Güçlü admin paneli; haber yazma, düzenleme, yayınlama, medya yönetimi
- **Dış İstemciler**: Mobil uygulama ve üçüncü parti entegrasyonlar için API

### 2.2 UI, Admin ve API İlişkisi

```
┌──────────────┐   ┌───────────────┐   ┌──────────────┐
│  Newsa Web   │   │  Newsa Admin  │   │  Newsa API   │
│  (Okuyucu)   │   │  (Editör)     │   │  (Mobil/Dış) │
│  Port: 3000  │   │  Port: 3001   │   │  Port: 3002  │
│  SSG/ISR     │   │  CSR ağırlıklı│   │  Route Hdlr  │
└──────┬───────┘   └──────┬────────┘   └──────┬───────┘
       │                  │                    │
       └──────────────────┼────────────────────┘
                          │
                ┌─────────┴─────────┐
                │  @newsa/supabase  │ ← Ortak veritabanı erişim katmanı
                │  @newsa/shared    │ ← Ortak tipler, validasyon
                │  @newsa/ui        │ ← Ortak UI bileşenleri
                │  @newsa/config    │ ← Ortak yapılandırma
                └─────────┬─────────┘
                          │
                ┌─────────┴─────────┐
                │     Supabase      │
                │  PostgreSQL + Auth│
                │  Storage + Realtime│
                └───────────────────┘
```

### 2.3 MVP vs İleri Faz Ayrımı

**MVP (Faz 1-3)**: Haber oluşturma/yayınlama, kategori/etiket yönetimi, medya, temel yetkilendirme (4 rol), SEO uyumlu haber sitesi, temel API

**İleri Faz (Faz 4-5)**: Granüler RBAC (10 rol), reklam yönetimi, içerik versiyonlama, bildirimler, menü yönetimi, soft delete, performans optimizasyonu

---

## 3. Actor / Role Analysis (Aktör ve Rol Analizi)

### 3.1 Tasarım Felsefesi

Mevcut modelde `profiles` tablosundaki basit `role` TEXT alanı (admin/editor/author/viewer) üretim ortamı için yetersizdir. Hibrit RBAC modeli (rol bazlı + izin bazlı) tercih edilmiştir.

**Gerekçe**: Bir "Medya Yöneticisi" medya yükleyip organize edebilmeli ama haber yayınlayamamalı. Bir "SEO Yöneticisi" SEO alanlarını düzenleyebilmeli ama haber içeriğini değiştirememeli. Basit rol hiyerarşisi bu ayrımı sağlayamaz.

### 3.2 Roller (10 Adet)

| # | Rol | Sistem Adı | Hiyerarşi | Açıklama |
|---|-----|-----------|-----------|----------|
| 1 | Süper Admin | `super_admin` | 100 | Platform sahibi, tüm yetkiler örtük olarak verilir |
| 2 | Admin | `admin` | 90 | Site yöneticisi, neredeyse tüm yetkiler |
| 3 | Genel Yayın Yönetmeni | `editor_in_chief` | 80 | Editöryal lider, yayın politikası |
| 4 | Editör | `editor` | 60 | İçerik editörü, haber düzenleme/yayınlama |
| 5 | Yazar | `author` | 40 | Haber oluşturma, kendi haberlerini düzenleme |
| 6 | Onaylayıcı | `reviewer` | 50 | İçerik onay/ret (editör yardımcısı) |
| 7 | Medya Yöneticisi | `media_manager` | 30 | Medya kütüphanesi yönetimi |
| 8 | SEO Yöneticisi | `seo_manager` | 30 | SEO alanları ve yönlendirme yönetimi |
| 9 | Reklam Yöneticisi | `ads_manager` | 30 | Reklam kampanyaları ve alanları yönetimi |
| 10 | Destek / Salt Okuma | `support` | 10 | Sadece görüntüleme, denetim logları |

### 3.3 Rol Detayları

**Süper Admin**: Platformun tek sahibi. Tüm izinler örtük. Diğer kullanıcılara herhangi bir rol atayabilir/alabilir. Sistem rollerini düzenleyebilir. Kritik operasyonlar (veritabanı ayarları, süper admin atama) sadece bu rol yapabilir.

**Admin**: Süper Admin hariç tüm yetkilere sahip. Kullanıcı oluşturma/düzenleme, rol atama (kendi seviyesinin altındaki roller), ayar yönetimi. Süper Admin rolü atayamaz.

**Genel Yayın Yönetmeni (Editor-in-Chief)**: Editöryal operasyonların lideri. Tüm haberleri düzenleyebilir, yayınlayabilir, arşivleyebilir. Manşet, öne çıkan, son dakika yönetimi. Kategori, etiket, menü yönetimi. Kullanıcı/rol yönetimi yapamaz.

**Editör**: Tüm haberleri düzenleyebilir ve yayınlayabilir. Kendi oluşturmadığı haberleri silemez. Kategori ve etiket yönetimi yapamaz (sadece mevcut olanları kullanır).

**Yazar**: Kendi haberlerini oluşturur ve düzenler. İncelemeye gönderebilir ama yayınlayamaz. Sadece kendi taslak/inceleme durumundaki haberlerini görebilir.

**Onaylayıcı**: İncelemeye gönderilen haberleri onaylayabilir veya reddedebilir. Haber oluşturamaz. Editör yardımcısı rolü.

**Medya Yöneticisi**: Medya kütüphanesini tam yönetir (yükleme, düzenleme, silme, klasörleme). Haber içeriklerine erişimi yoktur.

**SEO Yöneticisi**: Haberlerin SEO alanlarını düzenleyebilir, etiketleri yönetebilir, URL yönlendirmelerini yönetebilir. Haber içeriğini değiştiremez.

**Reklam Yöneticisi**: Reklam alanları, kampanyalar, kreatifler yönetir. Reklam raporlarını görüntüler. Editöryal içeriğe erişimi yoktur.

**Destek (Salt Okuma)**: Tüm modülleri görüntüleyebilir, denetim loglarını inceleyebilir. Hiçbir şeyi düzenleyemez veya silemez.

---

## 4. Module Breakdown (Modül Kırılımı)

### 4.1 Newsa Web Modülleri

| # | Modül | Faz | Açıklama | Rendering |
|---|-------|-----|----------|-----------|
| W1 | Anasayfa | 3 | Manşet/hero, kategori blokları, son haberler, en çok okunanlar | ISR (60s) |
| W2 | Haber Detay | 3 | İçerik, yazar, galeri, ilgili haberler, paylaşım, reklam alanları | SSG + ISR (300s) |
| W3 | Kategori Sayfası | 3 | Kategoriye göre haber listeleme, pagination | ISR (120s) |
| W4 | Etiket Sayfası | 3 | Etikete göre haber listeleme | ISR (120s) |
| W5 | Yazar Sayfası | 3 | Yazar profili, haberleri | ISR (120s) |
| W6 | Arama | 3 | Full-text Türkçe arama, sonuç listeleme | SSR |
| W7 | Header/Navbar | 3 | Logo, dinamik kategori menüsü, arama, mobil hamburger menü | - |
| W8 | Footer | 3 | Linkler, iletişim, sosyal medya | - |
| W9 | Son Dakika Bandı | 4 | Üst kısımda kayan son dakika haberleri, Supabase Realtime | - |
| W10 | En Çok Okunanlar | 3 | Sidebar widget | - |
| W11 | Sosyal Paylaşım | 3 | Paylaşım butonları (Facebook, X, WhatsApp, LinkedIn, Link kopyala) | - |
| W12 | Breadcrumb | 3 | Navigasyon yardımcısı, SEO uyumlu | - |
| W13 | SEO Altyapısı | 3 | Metadata, JSON-LD, OG tags, sitemap.xml, robots.txt, RSS | - |
| W14 | 404/Hata Sayfaları | 3 | Özel hata sayfaları | SSG |
| W15 | Loading States | 3 | Skeleton loader'lar (5 kart varyantı) | - |
| W16 | Reklam Alanları | 5 | AdZone component, çeşitli kreratif render'ları | - |
| W17 | Statik Sayfalar | 4 | Hakkında, iletişim, gizlilik vb. | SSG |
| W18 | Sponsorlu İçerik | 5 | "Sponsorlu" badge'li haber kartları | - |

### 4.2 Newsa Admin Modülleri

| # | Modül | Faz | Açıklama |
|---|-------|-----|----------|
| A1 | Authentication | 1 | Login, logout, session yönetimi, auth middleware |
| A2 | Dashboard | 2 | Genel istatistikler, son aktiviteler, hızlı erişim |
| A3 | Haber Yönetimi | 2 | CRUD, rich text editör (Tiptap), medya ekleme, SEO alanları, tüm entity alanları |
| A4 | Kategori Yönetimi | 2 | CRUD, hiyerarşik ağaç yapısı, sıralama, SEO alanları |
| A5 | Etiket Yönetimi | 2 | CRUD, otomatik tamamlama, inline oluşturma |
| A6 | Medya Kütüphanesi | 2 | Yükleme (drag-drop), listeleme, arama, klasörleme, silme |
| A7 | Kullanıcı Yönetimi | 2 | CRUD, rol atama, aktif/pasif |
| A8 | Yayın Akışı | 2 | Draft → Review → Published → Archived durum geçişleri |
| A9 | Manşet Yönetimi | 4 | Manşet haberleri seçme, sıralama (drag-drop) |
| A10 | Öne Çıkan Yönetimi | 4 | Öne çıkan haberleri seçme, sıralama |
| A11 | Son Dakika Yönetimi | 4 | Son dakika işaretleme, süre ayarı, otomatik bitiş |
| A12 | Planlı Yayın | 4 | Gelecek tarihli yayın zamanlama, planlı haber listesi |
| A13 | İlgili Haberler | 4 | Manuel ilgili haber seçimi, otomatik öneri |
| A14 | Rol ve Yetki Yönetimi | 4 | Rol CRUD, izin atama, kullanıcı-rol atama, izin override |
| A15 | Reklam Yönetimi | 5 | Reklam alanları, kampanyalar, kreatifler, raporlar |
| A16 | Site Ayarları | 4 | Genel ayarlar (site adı, logo, sosyal medya, SEO varsayılanları) |
| A17 | Menü Yönetimi | 4 | Header/footer menüleri, drag-drop ağaç düzenleme |
| A18 | Denetim Logları | 4 | Kullanıcı aktivite geçmişi, filtreleme |
| A19 | Bildirimler | 4 | Bildirim çanı, okundu/okunmadı, gerçek zamanlı |
| A20 | İçerik Versiyonlama | 5 | Revizyon geçmişi, diff görüntüleme, geri yükleme |
| A21 | Çöp Kutusu | 5 | Silinen içerikleri yönetme, geri alma, kalıcı silme |
| A22 | Statik Sayfa Yönetimi | 4 | Hakkında, iletişim vb. sayfalar CRUD |
| A23 | URL Yönlendirmeleri | 4 | Eski slug → yeni slug 301 yönlendirmeleri |
| A24 | Analytics Dashboard | 4 | Görüntülenme, popüler haberler, yazar istatistikleri |
| A25 | Toplu İşlemler | 4 | Çoklu haber durumu değiştirme, toplu silme |

### 4.3 Newsa API Modülleri

| # | Endpoint | Faz | Yetki | Açıklama |
|---|----------|-----|-------|----------|
| P1 | `GET /api/v1/articles` | 3 | Public | Haber listeleme (pagination, filter, sort) |
| P2 | `GET /api/v1/articles/:slug` | 3 | Public | Haber detay |
| P3 | `POST /api/v1/articles/:slug/view` | 3 | Public | Görüntülenme sayacı |
| P4 | `GET /api/v1/categories` | 3 | Public | Kategori listesi |
| P5 | `GET /api/v1/categories/:slug` | 3 | Public | Kategori detay + haberleri |
| P6 | `GET /api/v1/tags` | 3 | Public | Popüler etiketler |
| P7 | `GET /api/v1/tags/:slug` | 3 | Public | Etiket detay + haberleri |
| P8 | `GET /api/v1/search` | 3 | Public | Full-text arama |
| P9 | `GET /api/v1/featured` | 3 | Public | Öne çıkan haberler |
| P10 | `GET /api/v1/headlines` | 3 | Public | Manşet haberleri |
| P11 | `GET /api/v1/breaking` | 3 | Public | Son dakika haberleri |
| P12 | `GET /api/v1/authors/:id` | 3 | Public | Yazar profili + haberleri |
| P13 | `GET /api/v1/menus/:name` | 4 | Public | Menü öğeleri |
| P14 | `GET /api/v1/pages/:slug` | 4 | Public | Statik sayfa içeriği |
| P15 | `GET /api/v1/sitemap` | 3 | Public | Sitemap verisi |
| P16 | `GET /api/v1/rss` | 3 | Public | RSS feed |
| P17 | `GET /api/v1/ads/zone/:name` | 5 | Public | Reklam verisi |
| P18 | `POST /api/v1/ads/impression` | 5 | Public | Gösterim kaydı |
| P19 | `GET /api/v1/ads/click/:id` | 5 | Public | Tıklama yönlendirmesi |
| P20 | `GET /api/v1/me` | 3 | Auth | Kullanıcı profili |
| P21 | `POST /api/revalidate` | 3 | Webhook | ISR revalidation |
| P22 | `GET /api/health` | 1 | Public | Sağlık kontrolü |
| P23 | Admin CRUD endpoints | 4 | Permission | Tüm entity'ler için admin CRUD |

### 4.4 Ortak Paketler

| Paket | Dizin | İçerik |
|-------|-------|--------|
| @newsa/shared | `packages/shared` | TypeScript tipleri (Article, Category, User, Permission vb.), Zod validasyon şemaları, sabitler (status enum, roller), utility fonksiyonlar (slug, tarih, SEO) |
| @newsa/supabase | `packages/supabase` | Client factory (server/browser), DB auto-generated tipleri, query helper'lar, storage helper'lar, auth helper'lar, permission check |
| @newsa/ui | `packages/ui` | shadcn/ui tabanlı bileşenler (Button, Input, Card, Modal, Pagination, Badge, DataTable, Skeleton), haber kartı varyantları |
| @newsa/config | `packages/config` | ESLint, TypeScript base config, Tailwind preset |

---

## 5. End-to-End News Platform Capability Map

### 5.1 Haber Entity Alanları (Tam Liste)

**Temel Bilgiler**:
- `title` (TEXT, zorunlu, max 200 karakter) — Haber başlığı
- `summary` (TEXT, opsiyonel, max 500 karakter) — Spot/özet
- `content` (JSONB, zorunlu) — Zengin metin (Tiptap JSON formatı)
- `content_html` (TEXT, otomatik) — Render edilmiş HTML (arama/SEO)
- `slug` (TEXT, unique, otomatik) — URL-friendly tanımlayıcı

**Medya**:
- `cover_image_id` (UUID FK) — Kapak görseli (yayın için zorunlu, 1200x630px önerilen)
- `cover_image_alt` (TEXT) — Erişilebilirlik alt metni
- Galeri → `article_media` junction tablosu (sıralı, caption'lı)

**Sınıflandırma**:
- `category_id` (UUID FK, zorunlu) — Ana kategori (tek)
- Etiketler → `article_tags` junction (çoklu)
- İlgili haberler → `related_articles` (max 4-6, manuel/otomatik)

**Yazar ve Düzenleme**:
- `author_id` (UUID FK, zorunlu) — Haberi yazan
- `editor_id` (UUID FK) — Son düzenleyen editör
- `editor_notes` (TEXT) — Editör notları (sadece admin panelde)

**Yayın Durumu**:
- `status` (ENUM: draft, review, published, archived)
- `published_at` (TIMESTAMPTZ) — Yayın tarihi (planlı yayın için gelecek)
- `archived_at` (TIMESTAMPTZ) — Arşivlenme tarihi
- `deleted_at` (TIMESTAMPTZ) — Soft delete (Faz 5)

**Öne Çıkarma**:
- `is_featured` (BOOLEAN) — Öne çıkan haber
- `is_headline` (BOOLEAN) — Manşet
- `is_breaking` (BOOLEAN) — Son dakika
- `featured_order` (INTEGER) — Öne çıkan sıralama
- `breaking_expires_at` (TIMESTAMPTZ) — Son dakika bitiş (varsayılan 4 saat)

**SEO**:
- `seo_title` (TEXT) — Özel SEO başlığı (yoksa title)
- `seo_description` (TEXT) — Meta description (yoksa summary)
- `seo_keywords` (TEXT[]) — Anahtar kelimeler
- `canonical_url` (TEXT) — Harici kaynak canonical

**Metrikler**:
- `view_count` (INTEGER, otomatik) — Görüntülenme
- `share_count` (INTEGER, otomatik) — Paylaşım

**Kaynak**:
- `source_name` (TEXT) — Haber kaynağı
- `source_url` (TEXT) — Kaynak URL (nofollow)

**Sponsorlu İçerik (Faz 5)**:
- `is_sponsored` (BOOLEAN)
- `sponsor_name` (TEXT)
- `sponsor_logo_url` (TEXT)
- `sponsor_campaign_id` (UUID FK)

### 5.2 İçerik Editörü Gereksinimleri (Tiptap)

Desteklenmesi gereken blok tipleri:
- Paragraf, Başlıklar (H2, H3, H4)
- Kalın, italik, altı çizili, üstü çizili
- Sıralı ve sırasız listeler
- Blockquote
- Inline görsel ekleme (medya kütüphanesinden seç veya yükle)
- Video embed (YouTube, Twitter/X)
- Link ekleme (internal/external)
- Tablo
- Ayraç (horizontal rule)

### 5.3 Yayın Akışı (Editorial Workflow)

```
     ┌─────────────────────────────────────────────────────────────┐
     │                                                             │
     ▼                                                             │
  ┌──────┐  yazar gönderir  ┌────────┐  editör onaylar  ┌──────────┐
  │ DRAFT ├────────────────→│ REVIEW ├──────────────────→│PUBLISHED │
  └──┬───┘                  └───┬────┘                   └────┬─────┘
     │                          │                              │
     │                    editör reddeder                 arşivlenir
     │                          │                              │
     │                          ▼                              ▼
     │                    ┌──────────┐                  ┌──────────┐
     │                    │  DRAFT   │                  │ ARCHIVED │
     │                    │(notlarla)│                  └──────────┘
     │                    └──────────┘
     │
     │  yeniden düzenleme için geri çekilir
     ◄──────────────────────────────────────
```

**Kurallar**:
- Yazar → draft oluşturur, review'a gönderebilir
- Editör/Onaylayıcı → review'ı onaylar veya reddeder (not ile)
- Editör → doğrudan published yapabilir (review atlanabilir)
- Published → Archived tek yönlü
- Archived → Draft'a geri dönülebilir (yeniden düzenleme)

### 5.4 Planlı Yayın

- `published_at` gelecek tarih olarak ayarlanır
- Status `published` yapılır ama `published_at > now()` ise sitede görünmez
- Supabase Edge Function veya Vercel Cron Job ile dakikada bir kontrol
- Planlı haberler admin panelde ayrı liste/filtre ile gösterilir

### 5.5 Son Dakika (Breaking News)

- `is_breaking = true` + `breaking_expires_at` (varsayılan: +4 saat)
- Sitede üst kısımda kayan bant (ticker)
- Supabase Realtime ile anında tüm istemcilere iletilir
- Süre dolunca `is_breaking = false` otomatik (Edge Function/cron)
- İleri fazda push notification tetikleyebilir

### 5.6 İçerik Versiyonlama (Faz 5)

- Her kaydetmede `article_revisions` tablosuna snapshot alınır
- Auto-save: 30 saniyede bir debounced (içerik değiştiyse)
- Manuel kayıt, yayınlama, durum değişikliği → zorunlu revizyon
- Admin'de revizyon zaman çizelgesi + iki revizyon arası diff görünümü
- Geri yükleme: seçilen revizyonun alanları aktif habere kopyalanır + yeni revizyon oluşturulur

---

## 6. Admin Panel Capability Map

### 6.1 Dashboard

- Toplam haber sayısı (duruma göre dağılım)
- Bugün yayınlanan haberler
- Son 7/30 gün görüntülenme trendi
- En çok okunan 10 haber
- Son aktiviteler (audit log özeti)
- Onay bekleyen haberler (reviewer/editör için)
- Hızlı erişim butonları (yeni haber, medya yükle)

### 6.2 Haber Yönetimi

- **Liste Sayfası**: DataTable (TanStack Table), durum/kategori/yazar filtreleri, arama, tarih aralığı, sıralama, pagination, toplu işlem seçimi
- **Oluşturma/Düzenleme**: Tüm entity alanlarını içeren form (news-entity-spec'e göre), Tiptap editör, medya picker modal, etiket autocomplete, SEO önizleme, durum geçiş butonları
- **Toplu İşlemler**: Seçili haberlerin durumunu değiştirme, toplu silme (soft delete)

### 6.3 Kategori Yönetimi

- Hiyerarşik ağaç görünümü (parent-child)
- Drag-drop sıralama
- Her kategoride: ad, slug, açıklama, SEO alanları, aktif/pasif, üst kategori
- Kategori silindiğinde haberlere etkisi (RESTRICT → taşınmalı)

### 6.4 Medya Kütüphanesi

- Grid/liste görünümü
- Drag-drop çoklu dosya yükleme
- Klasör yapısı (general, articles, avatars)
- Arama (dosya adı, alt text)
- Dosya detay paneli (boyut, boyutlar, alt text, caption düzenleme)
- Desteklenen formatlar: JPEG, PNG, WebP, GIF, SVG, MP4
- Maks dosya boyutu: 5MB (görseller), 50MB (video)
- Otomatik WebP dönüşümü (Next.js Image)

### 6.5 Kullanıcı Yönetimi

- Kullanıcı listesi (DataTable), rol/durum filtreleri
- Kullanıcı oluşturma (email, ad, şifre, rol atama)
- Kullanıcı düzenleme (profil bilgileri, avatar, bio)
- Aktif/pasif (deactivate) toggle
- Rol atama/değiştirme (çoklu rol destekli)
- Bireysel izin override (grant/revoke)

### 6.6 Yetki Yönetimi

- Rol listesi ve detay sayfası
- Her rol için izin matrisi (checkbox grid)
- Yeni özel rol oluşturma (sistem rolleri silinemez)
- Kullanıcıya bireysel izin verme/alma

### 6.7 Menü Yönetimi

- Header ve footer menüleri ayrı ayrı yönetme
- Menü öğesi ekleme: etiket, URL, tip (kategori/etiket/sayfa/özel), hedef, ikon
- Drag-drop ağaç düzenleme (parent-child, sıralama)
- Masaüstü/mobil görünürlük ayarı
- Aktif/pasif toggle

### 6.8 Reklam Yönetimi (Faz 5)

- **Reklam Alanları**: Zone CRUD, boyut/konum/cihaz hedefleme
- **Kampanyalar**: CRUD, başlangıç/bitiş tarihi, bütçe, öncelik, hedefleme
- **Kreatifler**: Kampanyaya bağlı, görsel/HTML/AdSense/video tipi, ağırlık
- **Raporlar**: Gösterim, tıklama, CTR, tarih aralığı filtreleme, grafik

### 6.9 Denetim Logları

- Tüm CRUD operasyonları otomatik kaydedilir
- Filtreleme: kullanıcı, işlem tipi, entity tipi, tarih aralığı
- Eski/yeni değerler karşılaştırma (JSONB)
- Dışa aktarma

### 6.10 Bildirimler

- Bildirim çanı (topbar'da okunmamış sayısı)
- Bildirim listesi (dropdown veya tam sayfa)
- Okundu/okunmadı toggle
- Tıklayınca ilgili entity'ye navigasyon
- Gerçek zamanlı (Supabase Realtime)

### 6.11 Çöp Kutusu (Faz 5)

- Sekmeler: Haberler | Kategoriler | Medya
- Geri alma (restore) ve kalıcı silme (purge) butonları
- 30 gün sonra otomatik kalıcı silme uyarısı

---

## 7. Roles & Permissions Model (Yetki Modeli)

### 7.1 Veritabanı Şeması

**5 yeni tablo** (Faz 4'te oluşturulacak):

```sql
-- roles: Rol tanımları
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  hierarchy_level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- permissions: İzin tanımları
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- role_permissions: Rol-izin ilişkisi
CREATE TABLE public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- user_roles: Kullanıcı-rol ilişkisi (çoklu rol destekli)
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- user_permissions: Bireysel izin override
CREATE TABLE public.user_permissions (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted BOOLEAN NOT NULL DEFAULT true,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission_id)
);
```

### 7.2 İzin Listesi (60+ izin, 14 modül)

| Modül | İzinler |
|-------|---------|
| articles | create, edit_own, edit_any, delete_own, delete_any, publish, unpublish, archive, submit_review, approve_review, reject_review, feature, breaking, schedule, view_drafts, edit_seo, restore |
| categories | view, create, edit, delete |
| tags | view, create, edit, delete |
| media | view, upload, edit, delete_own, delete_any, manage_folders |
| users | view, create, edit, deactivate, delete |
| roles | view, manage, assign |
| settings | view, manage |
| ads | view, manage_zones, manage_campaigns, manage_creatives, view_reports |
| menus | view, manage |
| audit | view |
| analytics | view, export |
| pages | create, edit, delete |
| redirects | manage |
| trash | view, restore, purge |

### 7.3 Rol-İzin Matrisi

| İzin | Super Admin | Admin | Baş Editör | Editör | Yazar | Onaylayıcı | Medya Yön. | SEO Yön. | Reklam Yön. | Destek |
|------|:-----------:|:-----:|:----------:|:------:|:-----:|:----------:|:----------:|:--------:|:-----------:|:------:|
| articles.create | X | X | X | X | X | - | - | - | - | - |
| articles.edit_own | X | X | X | X | X | - | - | - | - | - |
| articles.edit_any | X | X | X | X | - | - | - | - | - | - |
| articles.delete_any | X | X | X | - | - | - | - | - | - | - |
| articles.publish | X | X | X | X | - | - | - | - | - | - |
| articles.approve_review | X | X | X | X | - | X | - | - | - | - |
| articles.feature | X | X | X | X | - | - | - | - | - | - |
| articles.breaking | X | X | X | X | - | - | - | - | - | - |
| articles.edit_seo | X | X | X | X | - | - | - | X | - | - |
| categories.* | X | X | X | - | - | - | - | - | - | - |
| media.upload | X | X | X | X | X | - | X | - | - | - |
| media.delete_any | X | X | - | - | - | - | X | - | - | - |
| users.* | X | X | - | - | - | - | - | - | - | - |
| roles.* | X | X | - | - | - | - | - | - | - | - |
| settings.manage | X | X | - | - | - | - | - | - | - | - |
| ads.* | X | X | - | - | - | - | - | - | X | - |
| menus.manage | X | X | X | - | - | - | - | - | - | - |
| audit.view | X | X | X | - | - | - | - | - | - | X |
| analytics.view | X | X | X | X | own | - | - | X | X | X |
| trash.* | X | X | X | - | - | - | - | - | - | - |

> **Not**: Super Admin tüm izinlere örtük olarak sahiptir (kod seviyesinde kontrol, DB'de her izin ayrı ayrı atanmaz).

### 7.4 İzin Kontrol Fonksiyonu

```sql
CREATE OR REPLACE FUNCTION public.has_permission(
  p_user_id UUID, p_permission TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_is_super BOOLEAN;
  v_override BOOLEAN;
  v_role_perm BOOLEAN;
BEGIN
  -- Super admin bypass
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id AND r.name = 'super_admin'
  ) INTO v_is_super;
  IF v_is_super THEN RETURN true; END IF;

  -- Bireysel override kontrolü
  SELECT up.granted INTO v_override
  FROM user_permissions up JOIN permissions p ON p.id = up.permission_id
  WHERE up.user_id = p_user_id AND p.name = p_permission;
  IF v_override IS NOT NULL THEN RETURN v_override; END IF;

  -- Rol bazlı izin kontrolü
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = p_user_id AND p.name = p_permission
  ) INTO v_role_perm;
  RETURN v_role_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 7.5 RLS Entegrasyonu

Faz 4'te mevcut RLS politikaları `has_permission()` fonksiyonunu kullanacak şekilde güncellenecek:

```sql
-- Örnek: Haber düzenleme politikası
CREATE POLICY "edit_any_articles" ON articles FOR UPDATE
  USING (has_permission(auth.uid(), 'articles.edit_any'));

CREATE POLICY "edit_own_articles" ON articles FOR UPDATE
  USING (auth.uid() = author_id AND has_permission(auth.uid(), 'articles.edit_own'));
```

### 7.6 Frontend Entegrasyonu

- Admin login'de tüm kullanıcı izinleri fetch edilip memory'de cache'lenir
- React context: `PermissionProvider` → `usePermission('articles.publish')` hook'u
- Server Actions ve API route handler'larda izin kontrolü
- UI'da izin bazlı buton/sayfa gizleme

---

## 8. Advertising Management Model (Reklam Yönetimi)

### 8.1 Reklam Alanları (Ad Zones)

| Zone Adı | Konum | Boyut | Cihaz | Açıklama |
|----------|-------|-------|-------|----------|
| header_banner | Sayfa üstü | 728x90 / 320x50 | desktop/mobile | Leaderboard banner |
| sidebar_top | Sağ sidebar üst | 300x250 | desktop | Medium rectangle |
| sidebar_sticky | Sağ sidebar yapışkan | 300x600 | desktop | Half page ad |
| in_article | Haber içi (3. paragraf sonrası) | 728x90 / 300x250 | all | Native görünümlü |
| between_list | Liste arası (her 5. haber sonrası) | 728x90 / 300x250 | all | Feed reklam |
| footer_banner | Sayfa altı | 728x90 / 320x50 | all | Footer leaderboard |
| sticky_mobile | Mobil yapışkan alt | 320x50 | mobile | Sticky bottom |
| interstitial | Tam sayfa overlay | Responsive | mobile | Sayfa geçişlerinde |
| sponsored_content | İçerik alanı | Kart formatı | all | Sponsorlu haber kartı |

### 8.2 Veritabanı Şeması (5 tablo)

```sql
-- ad_zones: Reklam yerleşim alanları
CREATE TABLE public.ad_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  zone_type TEXT NOT NULL, -- header_banner, sidebar, in_article, vb.
  placement TEXT NOT NULL,
  default_width INTEGER,
  default_height INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  device_target TEXT NOT NULL DEFAULT 'all', -- all, desktop, mobile, tablet
  max_ads INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ad_campaigns: Reklam kampanyaları
CREATE TABLE public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  advertiser_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, paused, completed, archived
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  budget_total DECIMAL(12,2),
  budget_daily DECIMAL(12,2),
  budget_spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  priority INTEGER NOT NULL DEFAULT 5, -- 1-10
  targeting JSONB DEFAULT '{}', -- { categories: [], device: [] }
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ad_creatives: Reklam görselleri/kodları
CREATE TABLE public.ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES ad_zones(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  creative_type TEXT NOT NULL, -- image, html, adsense, video, native
  image_url TEXT,
  image_alt TEXT,
  click_url TEXT,
  html_content TEXT, -- Sandboxed iframe içinde render edilecek
  adsense_slot TEXT,
  adsense_format TEXT,
  video_url TEXT,
  video_poster TEXT,
  width INTEGER,
  height INTEGER,
  weight INTEGER NOT NULL DEFAULT 1, -- Rotasyon ağırlığı
  is_active BOOLEAN NOT NULL DEFAULT true,
  device_target TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ad_impressions: Gösterim takibi
CREATE TABLE public.ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creative_id UUID NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES ad_zones(id),
  article_id UUID REFERENCES articles(id),
  session_id TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ad_clicks: Tıklama takibi
CREATE TABLE public.ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  impression_id UUID REFERENCES ad_impressions(id),
  creative_id UUID NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  click_url TEXT NOT NULL,
  device_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 8.3 Reklam Sunma Mantığı

1. **Zone Resolution**: `<AdZone name="sidebar_top" />` component zone'a ait aktif reklamları ister
2. **Filtreleme**: Aktif kampanya, tarih aralığında, bütçe aşılmamış, cihaz/kategori hedeflemesi uygun
3. **Seçim**: Öncelik (priority) + ağırlık (weight) + rastgele rotasyon
4. **Render**: Tipe göre render (görsel, sandboxed iframe, AdSense, video)
5. **Takip**: IntersectionObserver ile görünürlük → `navigator.sendBeacon` ile impression kaydı
6. **Tıklama**: `/api/v1/ads/click/:creative_id` üzerinden redirect + kayıt

### 8.4 Güvenlik

- **HTML/JS reklamlar**: Zorunlu olarak `<iframe srcdoc="..." sandbox="allow-scripts allow-popups">` içinde render
- **Görsel reklamlar**: Standard `<a><img loading="lazy"></a>`
- **AdSense**: Global script bir kez yüklenir, `<ins>` öğeleri ile slot render
- Ana doküman DOM'una reklamverenin script'i asla doğrudan eklenmez

### 8.5 Sponsorlu İçerik

- Haberlerde `is_sponsored = true` flag'i
- Haber kartlarında ve detay sayfasında "Sponsorlu" badge'i
- Sponsor adı ve logosu gösterilir
- Sponsorlu haberler reklam kampanyasına bağlanabilir (tracking için)
- Sponsorlu içerik normal editoryal akıştan geçer (taslak → yayın)

---

## 9. API Scope (API Kapsamı)

### 9.1 Endpoint Haritası

**Public Endpoints (Auth gerektirmez)**:

| Method | Endpoint | Cache | Açıklama |
|--------|----------|-------|----------|
| GET | /api/v1/articles | 60s | Pagination, filter (category, tag, author, date, featured), sort |
| GET | /api/v1/articles/:slug | 300s | Tam haber detayı + yazar + kategori + etiketler |
| POST | /api/v1/articles/:slug/view | - | Görüntülenme sayacı artırma |
| GET | /api/v1/categories | 300s | Tüm aktif kategoriler (hiyerarşik) |
| GET | /api/v1/categories/:slug | 120s | Kategori detay + haberleri |
| GET | /api/v1/tags | 300s | Popüler etiketler |
| GET | /api/v1/tags/:slug | 120s | Etiket detay + haberleri |
| GET | /api/v1/search?q= | 30s | Full-text Türkçe arama |
| GET | /api/v1/featured | 60s | Öne çıkan haberler |
| GET | /api/v1/headlines | 60s | Manşet haberleri |
| GET | /api/v1/breaking | 30s | Son dakika haberleri |
| GET | /api/v1/authors/:id | 120s | Yazar profili + haberleri |
| GET | /api/v1/menus/:name | 600s | Dinamik menü verisi |
| GET | /api/v1/pages/:slug | 600s | Statik sayfa |
| GET | /api/v1/sitemap | 3600s | Sitemap verisi |
| GET | /api/v1/rss | 300s | RSS feed (XML) |
| GET | /api/v1/ads/zone/:name | 60s | Zone'a ait aktif reklam |
| POST | /api/v1/ads/impression | - | Reklam gösterim kaydı |
| GET | /api/v1/ads/click/:id | - | Tıklama redirect + kayıt |

**Protected Endpoints (User auth)**:

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/v1/me | Kullanıcı profili |
| PATCH | /api/v1/me | Profil güncelleme |

**Admin Endpoints (Auth + Permission kontrolü)**:
Tüm entity'ler için CRUD endpoint'leri `/api/v1/admin/` prefix'i altında. Her endpoint ilgili permission'ı kontrol eder.

**Webhook**:

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/revalidate | ISR on-demand revalidation (secret ile) |

### 9.2 Standart Response Format

```typescript
// Başarılı (tekil)
{ "success": true, "data": { ... } }

// Başarılı (liste)
{
  "success": true,
  "data": [...],
  "meta": { "total": 245, "page": 1, "per_page": 20, "total_pages": 13 }
}

// Hata
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Haber bulunamadı" }
}
```

Hata kodları: `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `RATE_LIMITED`, `INTERNAL_ERROR`

### 9.3 Query Parameter Standardı

```
?page=1&per_page=20&sort=published_at&order=desc
&category=teknoloji&tag=yapay-zeka&author=uuid
&q=arama+terimi&featured=true
&from=2026-01-01&to=2026-03-30
&fields=id,title,slug,summary,cover_image,published_at
```

### 9.4 Rate Limiting

| Katman | Limit | Pencere | Hedef |
|--------|-------|---------|-------|
| Public Anonim | 60 req | 1 dk | Auth'sız public endpoint'ler |
| Public Auth | 120 req | 1 dk | Auth'lu public endpoint'ler |
| Admin | 300 req | 1 dk | Admin endpoint'leri |
| Webhook | 10 req | 1 dk | Revalidation |
| Reklam Takip | 1000 req | 1 dk | Impression/click (yüksek hacim) |

**Uygulama**: `@upstash/ratelimit` (Redis tabanlı) + Vercel Edge Middleware. Vercel serverless fonksiyonları stateless olduğu için in-memory rate limiting çalışmaz.

### 9.5 Caching Headers

```typescript
const CACHE_CONFIGS = {
  articles_list:  'public, s-maxage=60, stale-while-revalidate=30',
  article_detail: 'public, s-maxage=300, stale-while-revalidate=60',
  categories:     'public, s-maxage=300, stale-while-revalidate=60',
  search:         'public, s-maxage=30, stale-while-revalidate=10',
  breaking:       'public, s-maxage=30, stale-while-revalidate=10',
  admin:          'private, no-cache, no-store, must-revalidate',
}
```

### 9.6 API Versioning

Tüm endpoint'ler `/api/v1/` prefix'i altında. Breaking change gerektiğinde `/api/v2/` açılır, v1 deprecation header'ı ile 6 ay daha desteklenir.

---

## 10. SEO & Discoverability Scope

### 10.1 Metadata Yönetimi

Her sayfa için Next.js `generateMetadata` kullanılacak:
- `title` — Dinamik (haber: başlık | Newsa, kategori: Kategori Adı | Newsa)
- `description` — Haber: summary veya seo_description
- `openGraph` — og:title, og:description, og:image (1200x630), og:type="article"
- `twitter` — card: "summary_large_image", site handle
- `alternates.canonical` — Canonical URL
- `robots` — index/noindex kararları (draft sayfaları noindex)

### 10.2 JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Haber Başlığı",
  "description": "Haber özeti",
  "image": ["https://...1200x630.jpg"],
  "datePublished": "2026-03-30T10:00:00+03:00",
  "dateModified": "2026-03-30T12:00:00+03:00",
  "author": { "@type": "Person", "name": "Yazar Adı", "url": "..." },
  "publisher": {
    "@type": "Organization",
    "name": "Newsa",
    "logo": { "@type": "ImageObject", "url": "..." }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "..." }
}
```

Ek yapısal veriler: `BreadcrumbList`, `WebSite` (sitelinks search box), `Organization`

### 10.3 Sitemap

`apps/web/src/app/sitemap.ts` — Next.js dynamic sitemap:
- Tüm yayınlanmış haberler (lastmod: updated_at)
- Tüm aktif kategoriler
- Tüm etiketler (haber sayısı > 0)
- Tüm yazar sayfaları
- Statik sayfalar
- Anasayfa

Büyük siteler için sitemap index + alt sitemap'ler (her 50.000 URL)

### 10.4 robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://newsa.com/sitemap.xml
```

### 10.5 RSS Feed

`/api/v1/rss` → XML RSS 2.0 formatında son 50 haber

### 10.6 Slug Stratejisi

Format: `/{category-slug}/{article-slug}`
- Türkçe karakter dönüşümü (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u)
- Benzersiz (unique constraint)
- Slug değiştiğinde eski slug'dan 301 redirect (redirects tablosu)

### 10.7 Core Web Vitals Hedefleri

| Metrik | Hedef |
|--------|-------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FID (First Input Delay) | < 100ms |
| INP (Interaction to Next Paint) | < 200ms |

**Stratejiler**: Next.js Image (width/height/sizes zorunlu), font preloading, lazy load (görseller, reklamlar), ISR/SSG, bundle analizi, tree shaking

### 10.8 Pagination SEO

- `rel="canonical"` her sayfada
- Pagination URL formatı: `?page=2` (query parameter)
- Her sayfa kendi canonical'ına sahip
- "Daha fazla yükle" yerine sayfa numaralı pagination (SEO uyumlu)

---

## 11. Technical Architecture Planning Notes

### 11.1 Proje Klasör Yapısı

```
newsa/
├── apps/
│   ├── web/                    # Son kullanıcı haber sitesi
│   │   └── src/
│   │       ├── app/            # Next.js App Router
│   │       │   ├── (anasayfa)/ # Route group
│   │       │   ├── [category]/[slug]/ # Haber detay
│   │       │   ├── kategori/[slug]/
│   │       │   ├── etiket/[slug]/
│   │       │   ├── yazar/[id]/
│   │       │   ├── arama/
│   │       │   ├── sayfa/[slug]/
│   │       │   ├── sitemap.ts
│   │       │   ├── robots.ts
│   │       │   └── layout.tsx
│   │       ├── components/     # Web-specific components
│   │       └── lib/            # Web-specific utilities
│   │
│   ├── admin/                  # Admin paneli
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (auth)/login/
│   │       │   ├── (dashboard)/
│   │       │   │   ├── haberler/
│   │       │   │   ├── kategoriler/
│   │       │   │   ├── etiketler/
│   │       │   │   ├── medya/
│   │       │   │   ├── kullanicilar/
│   │       │   │   ├── roller/
│   │       │   │   ├── reklamlar/
│   │       │   │   ├── menuler/
│   │       │   │   ├── sayfalar/
│   │       │   │   ├── ayarlar/
│   │       │   │   ├── denetim/
│   │       │   │   ├── cop-kutusu/
│   │       │   │   └── layout.tsx
│   │       │   └── layout.tsx
│   │       ├── components/
│   │       └── lib/
│   │
│   └── api/                    # REST API
│       └── src/app/
│           └── api/v1/
│               ├── articles/
│               ├── categories/
│               ├── tags/
│               ├── search/
│               ├── featured/
│               ├── breaking/
│               ├── authors/
│               ├── menus/
│               ├── pages/
│               ├── ads/
│               ├── me/
│               ├── admin/
│               ├── rss/
│               └── health/
│
├── packages/
│   ├── shared/src/
│   │   ├── types/              # Article, Category, User, Permission vb.
│   │   ├── constants/          # Status enum'ları, roller
│   │   ├── utils/              # slug, date, seo helpers
│   │   └── validations/        # Zod schemas
│   │
│   ├── supabase/src/
│   │   ├── client/             # Server/browser client factory
│   │   ├── types/              # Auto-generated DB types
│   │   ├── queries/            # Query helpers (articles, categories, vb.)
│   │   ├── storage/            # Storage helpers
│   │   └── auth/               # Auth helpers, permission check
│   │
│   ├── ui/src/
│   │   ├── components/         # Button, Input, Card, Modal, DataTable vb.
│   │   ├── news-cards/         # Hero, Featured, Standard, Horizontal, Compact
│   │   └── index.ts
│   │
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── supabase/
│   ├── config.toml
│   ├── migrations/             # SQL migration dosyaları
│   ├── seed.sql
│   └── functions/              # Edge Functions (planlı yayın, auto-purge)
│
├── e2e/                        # Playwright E2E testleri
│   ├── admin/
│   ├── web/
│   └── api/
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .github/workflows/          # CI/CD
```

### 11.2 Rendering Stratejisi

| Sayfa | Strateji | Revalidation | Neden |
|-------|----------|-------------|-------|
| Anasayfa | ISR | 60s + on-demand | Sık güncellenen, SEO kritik |
| Haber Detay | SSG + ISR | 300s + on-demand | SEO kritik, az değişir |
| Kategori | ISR | 120s + on-demand | SEO kritik, orta sıklık |
| Etiket | ISR | 120s | SEO kritik |
| Yazar | ISR | 120s | SEO kritik |
| Arama | SSR | - | Dinamik, kullanıcıya özel |
| Admin | CSR | - | SEO gereksiz, interaktif |

### 11.3 Ortamlar

| Ortam | Branch | URL | Supabase | Amaç |
|-------|--------|-----|----------|------|
| Local | - | localhost:3000/3001/3002 | Supabase CLI (local) | Geliştirme |
| Preview | PR branch | *.vercel.app | Staging project | PR review |
| Staging | develop | staging.newsa.com | Staging project | Test & QA |
| Production | main | newsa.com | Production project | Canlı |

### 11.4 Ortak Veri Sözleşmeleri

- Tüm entity tipleri `@newsa/shared` paketinde tanımlı
- Zod validasyon şemaları tüm uygulamalar tarafından kullanılır
- Supabase auto-generated tipler `@newsa/supabase` paketinde
- API response format tüm endpoint'lerde standart

### 11.5 Auth Yaklaşımı

- Supabase Auth (email/password)
- JWT token tabanlı
- Server-side: `createServerClient` ile cookie-based session
- Client-side: `createBrowserClient` ile auto-refresh
- Admin middleware: tüm (dashboard) route'ları korur
- API: Bearer token doğrulama

### 11.6 Migration Stratejisi

- Her veritabanı değişikliği migration ile
- Her migration geri alınabilir (down migration)
- `supabase db reset` ile local sıfırlama + seed
- Production: maintenance window'da uygulama
- Point-in-time recovery (Supabase Pro)

---

## 12. Testing Strategy (Test Stratejisi)

### 12.1 Test Piramidi

```
        ┌───────────┐
        │   E2E     │  Playwright (kritik akışlar)
        ├───────────┤
      ┌─┤ Integr.  ├─┐  Vitest + Supabase (DB, RLS, API)
      ├─┴───────────┴─┤
    ┌─┤    Unit       ├─┐  Vitest (utils, hooks, validations)
    └─┴───────────────┴─┘
```

### 12.2 Faz Bazlı Test Planı

**Faz 1 — Altyapı Testleri**:
- Smoke: `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm type-check` hatasız
- Integration: 10 tablo oluşturulmuş, RLS aktif, seed data yüklü
- E2E: Admin login çalışıyor, web anasayfa 200 dönüyor, API health 200

**Faz 2 — İçerik Yönetimi Testleri**:
- Unit: Slug üretimi (Türkçe edge case'ler), tarih formatlama, Zod validasyon, status geçiş validasyonu
- Integration: Article CRUD, RLS (yazar vs editör vs public erişim), medya upload, kategori hiyerarşisi, audit log kaydı
- E2E: Haber oluşturma full flow, medya yükleme, kategori/etiket CRUD, yayınlama akışı (draft→review→publish)

**Faz 3 — Web ve SEO Testleri**:
- Unit: API response format, pagination hesaplama, arama query sanitizasyonu
- Integration: Tüm public API endpoint'leri doğru format, pagination, filtreleme, caching header'lar
- SEO: Meta tag'ler, JSON-LD geçerliliği, OG image, canonical URL, sitemap XML, robots.txt, RSS
- E2E: Anasayfa render, haber detay, kategori filtreleme, arama, pagination, 404, mobil responsive
- Performance: Lighthouse CI (>90 perf, 100 SEO, >90 a11y, LCP<2.5s, CLS<0.1)

**Faz 4 — İleri Özellik Testleri**:
- Unit: `has_permission()` tüm rol/izin kombinasyonları
- Integration: RBAC data migration, permission-based RLS, bildirim oluşturma, planlı yayın, menü CRUD
- E2E: Rol yönetimi, yetki atama, kısıtlı UI (rol bazlı buton gizleme), manşet yönetimi, son dakika, bildirim çanı, menü drag-drop, statik sayfa

**Faz 5 — Monetizasyon ve Regression Testleri**:
- Unit: Reklam seçim mantığı, bütçe hesaplama
- Integration: `get_ads_for_zone()`, impression/click kaydı, bütçe limiti, tarih filtresi, revizyon oluşturma, soft delete, auto-purge
- E2E: Reklam yönetimi CRUD, reklam render, impression tracking, revizyon geçmişi, diff, geri yükleme, çöp kutusu
- Regression: Tüm Faz 1-4 testleri tekrar
- Performance: Reklamlı sayfa LCP bütçesi içinde, API p95 < 200ms
- Security: XSS kontrolü (reklam HTML), CSP header'lar, rate limiting, RLS kapsamı

### 12.3 Test Ortamları

- **Local**: Supabase CLI + seed data
- **CI/CD**: Supabase CLI Docker + Playwright Docker + paralel test
- **Staging**: Ayrı Supabase projesi + Vercel preview

### 12.4 Test Verisi (seed.sql)

- 3 kullanıcı (admin, editör, yazar) → Faz 4'te 10 kullanıcı (her rol için 1)
- 5 kategori (2 alt kategorili)
- 10 etiket
- 20 haber (çeşitli durumlar: draft, review, published, archived, featured, breaking)
- 10 medya dosyası
- İlgili haber ilişkileri

---

## 13. Phase-Based Master Plan (Faz Bazlı Ana Plan)

### FAZ 1 — Altyapı ve Temel Kurulum (~2 hafta)

**Amaç**: Monorepo, veritabanı, auth ve temel layout'ları kurarak sonraki tüm geliştirmelerin üzerine inşa edileceği temeli oluşturmak.

**Kapsam**:
1. Monorepo kurulumu (pnpm workspace, Turborepo, root package.json)
2. 3 Next.js 14+ uygulaması (web:3000, admin:3001, api:3002)
3. 4 paylaşılan paket (@newsa/shared, @newsa/supabase, @newsa/ui, @newsa/config)
4. Supabase projesi oluşturma ve local CLI setup
5. Temel veritabanı şeması (10 orijinal tablo + indeksler + RLS)
6. Database fonksiyonları (updated_at trigger, slug üretimi, view count)
7. Seed data
8. Supabase Auth yapılandırması
9. Admin login sayfası + auth middleware
10. Web: root layout, header/footer placeholder
11. Admin: dashboard layout, sidebar, topbar
12. API: health endpoint, CORS config
13. Vercel deploy yapılandırması (3 proje)
14. CI/CD pipeline (GitHub Actions: lint, type-check, build)
15. Environment variable setup (.env.example'lar)

**Çıktılar**:
- `pnpm dev` / `pnpm build` / `pnpm lint` çalışıyor
- 10 tablo RLS ile oluşturulmuş
- Admin login fonksiyonel
- Vercel preview deploy'lar çalışıyor
- CI kontrolleri PR'da çalışıyor

**Bağımlılıklar**: Supabase hesabı, Vercel hesabı, domain yapılandırması

**Riskler**:
- Turborepo + paylaşılan Tailwind konfigürasyon karmaşıklığı
- Supabase local Docker Windows'ta WSL2 gerektirebilir

**Test Odağı**: Altyapı smoke testleri, build doğrulama, login E2E

---

### FAZ 2 — Temel İçerik Yönetimi (~3 hafta)

**Amaç**: Editöryal iş akışının tamamını oluşturmak — haber CRUD, medya kütüphanesi, kategoriler, etiketler ve yayınlama pipeline'ı.

**Kapsam**:
1. Rich text editör (Tiptap) entegrasyonu
2. Haber oluşturma formu (tüm entity alanları)
3. Haber listesi (admin) — DataTable, filtreler, arama
4. Haber düzenleme (admin)
5. Kategori CRUD — hiyerarşik ağaç
6. Etiket CRUD — autocomplete
7. Medya kütüphanesi — yükleme, listeleme, arama, klasörleme
8. Medya picker modal
9. Yayın akışı: draft → review → published → archived
10. Zod validasyon şemaları
11. Supabase query helper'lar
12. TypeScript entity tipleri
13. Temel web haber listesi/detay (test amaçlı)
14. Audit log kaydı
15. Dashboard istatistikleri

**Çıktılar**:
- Admin'de tam haber yaşam döngüsü
- Medya yönetimi çalışıyor
- Kategori/etiket yönetimi çalışıyor
- Yayınlama akışı durum geçişleri

**Bağımlılıklar**: Faz 1 tamamlanmış

**Riskler**:
- Tiptap editör karmaşıklığı (inline görseller, embed'ler)
- RLS politika çakışmaları (draft vs public erişim)

**Test Odağı**: CRUD unit/integration testleri, RLS testleri, yayınlama E2E

---

### FAZ 3 — Haber Sitesi ve SEO (~3 hafta)

**Amaç**: Tam SEO uyumlu, performanslı, responsive haber sitesi ve public API oluşturmak.

**Kapsam**:
1. Anasayfa (hero/manşet, kategori blokları, son haberler, en çok okunanlar)
2. Haber detay sayfası (içerik, yazar, galeri, paylaşım)
3. Kategori sayfası (pagination)
4. Etiket sayfası
5. Yazar sayfası
6. Arama sayfası
7. 404 sayfası
8. SEO: generateMetadata, JSON-LD, OG tags, Twitter Cards
9. Dinamik sitemap.ts
10. robots.ts
11. RSS feed
12. Breadcrumb
13. Responsive tasarım (mobile-first, Tailwind)
14. Next.js Image optimizasyonu
15. ISR/SSG yapılandırması
16. Public API endpoint'leri (articles, categories, tags, search, featured, breaking, authors)
17. API response standardizasyonu
18. Caching headers
19. On-demand revalidation endpoint

**Çıktılar**:
- Tam SEO uyumlu haber sitesi
- Tüm public API endpoint'leri
- RSS + Sitemap
- Core Web Vitals optimize
- Responsive tüm breakpoint'lerde

**Bağımlılıklar**: Faz 2 (içerik mevcut olmalı)

**Riskler**:
- ISR revalidation güvenilirliği
- Türkçe full-text search performansı
- Vercel Image optimizasyon maliyeti

**Test Odağı**: SEO validasyon, web E2E, API testleri, Lighthouse CI

---

### FAZ 4 — İleri Özellikler (~3 hafta)

**Amaç**: Granüler RBAC, manşet/son dakika yönetimi, planlı yayın, bildirimler, menü yönetimi ve analytics eklemek.

**Kapsam**:
1. RBAC: yeni tablolar (roles, permissions, role_permissions, user_roles, user_permissions)
2. `has_permission()` fonksiyonu
3. RLS politikaları güncelleme
4. Admin: rol ve izin yönetimi UI
5. Admin: kullanıcı rol atama UI
6. İzin bazlı UI görünürlüğü
7. Manşet yönetimi UI
8. Öne çıkan yönetimi UI
9. Son dakika yönetimi (set, timer, auto-expire)
10. Planlı yayın (cron kontrol)
11. İlgili haberler yönetimi
12. Analytics dashboard
13. Menü yönetimi (drag-drop ağaç)
14. Web: dinamik menüler
15. Bildirim sistemi (tablo, trigger'lar, Realtime)
16. Admin: bildirim çanı
17. Denetim log görüntüleyici
18. Statik sayfa yönetimi
19. URL yönlendirmeleri
20. Son dakika bandı (web, Realtime)

**Çıktılar**:
- 10 rollü RBAC sistemi çalışıyor
- Editöryal akış (manşet, öne çıkan, son dakika) tam
- Planlı yayın çalışıyor
- Bildirim sistemi canlı
- Dinamik menüler, statik sayfalar, analytics

**Bağımlılıklar**: Faz 3. RBAC migration mevcut işlevselliği bozmamalı.

**Riskler**:
- RBAC migration'da mevcut kullanıcı erişiminin korunması
- Supabase Realtime bağlantı limitleri (free tier)
- Planlı yayın için güvenilir cron mekanizması

**Test Odağı**: İzin matrisi unit testleri, RLS integration, yayın akışı E2E, bildirim testleri

---

### FAZ 5 — Monetizasyon ve Üretim Hazırlığı (~3 hafta)

**Amaç**: Reklam sistemi, içerik versiyonlama, soft delete, performans optimizasyonu ve üretim hazırlığı.

**Kapsam**:
1. Reklam yönetimi: zones, campaigns, creatives (DB + admin UI)
2. Reklam sunma API endpoint'i
3. Web: reklam render bileşenleri (AdZone, çeşitli tipler)
4. Reklam impression/click tracking
5. Reklam raporlama dashboard
6. Sponsorlu içerik flag
7. İçerik versiyonlama: article_revisions + auto-save
8. Revizyon geçmişi görüntüleyici + diff
9. Versiyon geri yükleme
10. Soft delete: deleted_at ekleme
11. Çöp kutusu yönetimi UI
12. Auto-purge (30 gün, Edge Function/cron)
13. Performans optimizasyonu (bundle analizi, lazy loading)
14. Güvenlik sıkılaştırma (CSP, rate limiting, input validation audit)
15. Hata izleme (Sentry)
16. Tam E2E test suite
17. Yük/stres testi
18. Üretim ortamı checklist
19. Dokümantasyon finalizasyonu

**Çıktılar**:
- Tam reklam yönetim sistemi
- İçerik versiyonlama + auto-save
- Soft delete + çöp kutusu
- Lighthouse >90 tüm metrikler
- Tam E2E test suite
- Üretime hazır deployment

**Bağımlılıklar**: Faz 4

**Riskler**:
- HTML reklam XSS riski (sandboxed iframe ile mitigation)
- ad_impressions tablo büyümesi (partitioning veya periyodik arşiv)
- Auto-save çakışması (iki editör aynı haberi düzenlerse → optimistic locking)

**Test Odağı**: Reklam render/tracking, versiyonlama, soft delete, tam regression, performans, güvenlik audit

---

## 14. Initial Sprint/Backlog Proposal (İlk Sprint Önerisi)

### Sprint 1 (Faz 1, Hafta 1-2): Altyapı Kurulumu

| # | Görev | Agent | Öncelik | Effort | Bağımlılık |
|---|-------|-------|---------|--------|------------|
| 1 | Monorepo kurulumu (pnpm, Turborepo, root package.json) | Developer | P0 | L | - |
| 2 | Next.js projeleri başlatma (3 app, TypeScript strict) | Developer | P0 | L | #1 |
| 3 | Paylaşılan paketler kurulumu (4 paket) | Developer | P0 | M | #1 |
| 4 | Supabase projesi ve local CLI setup | Developer | P0 | M | - |
| 5 | Veritabanı şeması (10 tablo, indeksler, RLS, fonksiyonlar) | Developer | P0 | L | #4 |
| 6 | Seed data | Developer | P1 | S | #5 |
| 7 | Authentication altyapısı (Auth config, login, middleware) | Developer | P0 | M | #4, #5 |
| 8 | Temel layout ve navigasyon (web header/footer, admin sidebar) | Developer | P1 | M | #2 |
| 9 | Vercel deploy yapılandırması | Developer | P1 | S | #2 |
| 10 | CI/CD pipeline (GitHub Actions) | Developer | P2 | S | - |

**Bağımlılık Grafiği**:
```
#1 Monorepo ──→ #2 Next.js ──→ #8 Layout
     │              │            #9 Vercel
     └──→ #3 Packages

#4 Supabase ──→ #5 Schema ──→ #6 Seed
                    │           #7 Auth

#10 CI/CD (bağımsız)
```

### Sprint 2-3 (Faz 2, Hafta 3-5): İçerik Yönetimi

| # | Görev | Agent | Öncelik | Effort |
|---|-------|-------|---------|--------|
| 11 | Tiptap rich text editör entegrasyonu | Developer | P0 | L |
| 12 | Haber oluşturma formu (tüm alanlar) | Developer | P0 | XL |
| 13 | Haber listesi (admin) — DataTable + filtreler | Developer | P0 | L |
| 14 | Haber düzenleme sayfası | Developer | P0 | L |
| 15 | Kategori CRUD (hiyerarşik) | Developer | P0 | M |
| 16 | Etiket CRUD (autocomplete) | Developer | P0 | M |
| 17 | Medya kütüphanesi (upload, browse, search) | Developer | P0 | L |
| 18 | Medya picker modal | Developer | P0 | M |
| 19 | Yayın akışı (durum geçişleri) | Developer | P0 | M |
| 20 | Zod validasyon şemaları | Developer | P0 | M |
| 21 | Supabase query helpers | Developer | P0 | L |
| 22 | TypeScript entity tipleri | Developer | P0 | M |
| 23 | Dashboard istatistikleri | Developer | P1 | M |
| 24 | Audit log kaydı | Developer | P1 | M |
| 25 | Temel web listesi/detay | Developer | P1 | M |

### Sprint 4-5 (Faz 3, Hafta 6-8): Web ve SEO

| # | Görev | Agent | Öncelik | Effort |
|---|-------|-------|---------|--------|
| 26 | Anasayfa (hero, bloklar, son haberler) | Developer | P0 | XL |
| 27 | Haber detay sayfası | Developer | P0 | L |
| 28 | Kategori sayfası + pagination | Developer | P0 | M |
| 29 | Etiket sayfası | Developer | P0 | M |
| 30 | Yazar sayfası | Developer | P0 | M |
| 31 | Arama sayfası | Developer | P0 | L |
| 32 | SEO: Metadata, JSON-LD, OG tags | Developer | P0 | L |
| 33 | Sitemap + robots.txt + RSS | Developer | P0 | M |
| 34 | Responsive tasarım | Developer | P0 | L |
| 35 | Public API endpoint'leri | Developer | P0 | L |
| 36 | Caching + revalidation | Developer | P1 | M |
| 37 | 404 + hata sayfaları | Developer | P1 | S |
| 38 | Performance optimizasyon | Developer | P1 | M |

---

## 15. Open Risks / Assumptions / Decisions Needed

### Açık Riskler

| # | Risk | Olasılık | Etki | Azaltma |
|---|------|----------|------|---------|
| R1 | Supabase free tier rate limiting | Orta | Yüksek | ISR/caching, connection pooling, tier upgrade planı |
| R2 | Tiptap editör karmaşıklığı | Orta | Orta | Temel blok tiplerinden başla, iteratif geliştir |
| R3 | ad_impressions tablo büyümesi | Yüksek | Orta | Date-based partitioning, günlük rollup, 90 gün arşiv |
| R4 | HTML reklam XSS riski | Düşük | Yüksek | Zorunlu sandboxed iframe, asla ana DOM'a doğrudan ekleme |
| R5 | RBAC migration veri kaybı | Düşük | Yüksek | Aşamalı migration: önce yeni tablolar, sonra veri taşıma, sonra eski kolon silme |
| R6 | Supabase Realtime bağlantı limitleri | Orta | Orta | Connection pooling, tier upgrade, WebSocket fallback |
| R7 | Vercel Edge/Image optimizasyon maliyeti | Orta | Orta | Görsel boyut limitleri, CDN caching, alternatif image provider |
| R8 | Türkçe full-text search performansı | Düşük | Orta | Turkish text search config, gerçekçi veri hacmiyle test |
| R9 | Auto-save çakışmaları | Orta | Orta | Optimistic locking (updated_at check), çakışma uyarısı |
| R10 | Monorepo build süresi | Düşük | Düşük | Turborepo caching, incremental builds |

### Varsayımlar

1. Supabase free/pro tier başlangıç kapasitesi yeterli
2. Vercel Hobby/Pro plan deployment ihtiyaçlarını karşılar
3. Editör ekibi 5-15 kişi arasında
4. Günlük 50-200 haber yayınlanacak
5. İlk etapta tek dil (Türkçe)
6. Mobil uygulama ayrı geliştirilecek, API üzerinden çalışacak
7. Google AdSense entegrasyonu planlanıyor (3rd party ad network)
8. Yorum sistemi ilk 5 fazda yok, gelecekte eklenecek (şema planlandı)
9. Editör ekibi temel bilgisayar kullanımına sahip, karmaşık arayüzler gereksiz

### Karar Gerektiren Konular

| # | Konu | Seçenekler | Önerim |
|---|------|-----------|--------|
| D1 | URL formatı | `/{slug}` vs `/{category}/{slug}` | `/{category}/{slug}` — SEO ve kullanıcı deneyimi için daha iyi |
| D2 | Tiptap vs Plate editör | Tiptap (daha olgun, Türkçe desteği) vs Plate (daha yeni, headless) | **Tiptap** — daha olgun, geniş eklenti ekosistemi |
| D3 | Upstash vs in-memory rate limiting | Upstash (dağıtık, ücretli) vs in-memory (ücretsiz, serverless'ta çalışmaz) | **Upstash** — Vercel serverless için zorunlu |
| D4 | Medya CDN | Supabase Storage + Vercel Image vs Cloudinary | **Supabase Storage + Vercel Image** — ekstra maliyet yok, yeterli |
| D5 | Font seçimi | Inter + serif haber fontu vs özel font | Mevcut: Inter (sans) — haber sitesi için serif heading düşünülebilir |
| D6 | Yorum sistemi zamanlaması | Faz 5'e dahil vs gelecek faz | **Gelecek faz** — MVP + ilk 5 faz yeterince kapsamlı |
| D7 | Supabase Edge Functions vs Vercel Cron | Planlı yayın + auto-purge için | **Vercel Cron** — daha basit yapılandırma, Supabase dependency azaltır |

---

## Doğrulama (Verification)

Bu planın doğruluğunu test etmek için:

1. **Faz 1 Sonunda**: `pnpm install && supabase start && supabase db reset && pnpm dev` ile 3 uygulama çalışıyor, admin login test ediliyor
2. **Faz 2 Sonunda**: Admin'de haber oluştur → düzenle → yayınla → web'de gör akışı test
3. **Faz 3 Sonunda**: Lighthouse CI skoru ölç (>90/100/90), sitemap.xml doğrula, API endpoint'leri test
4. **Faz 4 Sonunda**: 10 farklı rol ile giriş → her rolün yapabildiği/yapamadığı işlemleri doğrula
5. **Faz 5 Sonunda**: Reklam oluştur → web'de görüntüle → impression/click kaydını doğrula, revision oluştur → diff görüntüle → geri yükle

---

## Kritik Mimari Kararların Gerekçeleri

1. **Hibrit RBAC > basit rol hiyerarşisi**: Rol patlaması olmadan ince taneli erişim sağlar. `user_permissions` override tablosu edge case'leri karşılar.

2. **`has_permission()` tek yetkilendirme noktası**: RLS ve uygulama kodu aynı fonksiyonu çağırır → tutarlılık. `SECURITY DEFINER` ile RLS bypass ederek kendi izin kontrolünü yapar.

3. **Sandboxed iframe HTML reklamlar**: Güvenlik için vazgeçilmez. Reklamverenin HTML/JS'i asla ana doküman context'inde çalışmamalı.

4. **Revizyon snapshot'ları > diff depolama**: Full field snapshot depolamak diff'ten daha basit ve güvenilir. Depolama maliyeti minimal, karmaşıklık azalması önemli. Diff'ler gösterim sırasında hesaplanır.

5. **Soft delete > ayrı çöp tabloları**: `deleted_at` nullable timestamp eklemek, paralel çöp tabloları tutmaktan çok daha basit. RLS otomatik filtreler.

6. **Supabase Realtime > polling**: Ayrı WebSocket altyapısı olmadan anlık bildirim teslimi sağlar.

7. **Upstash Redis > in-memory rate limiting**: Vercel serverless stateless, in-memory çalışmaz. Upstash dağıtık rate limiting sunar.

8. **İmpression tablosu büyüme yönetimi**: Günlük rollup aggregation + 90 gün arşiv. 10M satır/ay aşılırsa ayrı analytics veritabanı düşünülecek.

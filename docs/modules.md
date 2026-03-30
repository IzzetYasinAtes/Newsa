# Modül Listesi ve Sorumluluk Ayrımı

## Proje Bazlı Sorumluluk Matrisi

### Nevsa Web (`apps/web`) - Son Kullanıcı Haber Sitesi

**Amaç**: SEO uyumlu, hızlı, modern haber okuma deneyimi

| Modül | Faz | Açıklama |
|-------|-----|----------|
| Anasayfa | 1 | Manşet slider, kategori blokları, son haberler, en çok okunanlar |
| Haber Detay | 1 | İçerik, yazar bilgisi, galeri, ilgili haberler, paylaşım butonları |
| Kategori Sayfası | 1 | Kategoriye göre haber listeleme, pagination |
| Etiket Sayfası | 1 | Etikete göre haber listeleme |
| Yazar Sayfası | 1 | Yazar profili ve haberleri |
| Arama | 1 | Full-text arama, sonuç listeleme |
| SEO Altyapısı | 1 | Metadata, JSON-LD, OG tags, sitemap, robots.txt |
| Header/Navbar | 1 | Logo, kategori menüsü, arama, mobil menü |
| Footer | 1 | Linkler, iletişim, sosyal medya |
| Son Dakika Bandı | 2 | Üst kısımda kayan son dakika haberleri |
| En Çok Okunanlar | 2 | Sidebar widget |
| Sosyal Paylaşım | 2 | Paylaşım butonları, share count |
| Breadcrumb | 2 | Navigasyon yardımcısı |
| 404 / Hata Sayfaları | 1 | Özel hata sayfaları |
| Loading States | 1 | Skeleton loader'lar |

**Teknik Özellikler**:
- SSG/ISR rendering (SEO kritik sayfalar)
- Next.js Image optimizasyonu
- Core Web Vitals optimizasyonu
- Mobile-first responsive tasarım
- Structured data (JSON-LD)
- Dynamic sitemap

---

### Nevsa Admin (`apps/admin`) - Admin Paneli

**Amaç**: Editör ekibi için güçlü, kullanıcı dostu yönetim arayüzü

| Modül | Faz | Açıklama |
|-------|-----|----------|
| Authentication | 1 | Login, logout, session yönetimi |
| Dashboard | 1 | Genel istatistikler, son aktiviteler |
| Haber Yönetimi | 1 | CRUD, rich text editör, medya ekleme, SEO alanları |
| Kategori Yönetimi | 1 | CRUD, hiyerarşik yapı, sıralama |
| Etiket Yönetimi | 1 | CRUD, otomatik tamamlama |
| Medya Kütüphanesi | 1 | Yükleme, listeleme, arama, silme, klasörleme |
| Kullanıcı Yönetimi | 1 | CRUD, rol atama, aktif/pasif |
| Yayın Akışı | 1 | Draft → Review → Published → Archived |
| Manşet Yönetimi | 2 | Manşet haberleri seçme ve sıralama |
| Öne Çıkan Yönetimi | 2 | Öne çıkan haberleri seçme |
| Son Dakika Yönetimi | 2 | Son dakika işaretleme, süre ayarı |
| Banner/Reklam Yönetimi | 3 | Reklam alanları yapılandırma |
| Site Ayarları | 2 | Genel ayarlar (site adı, logo, sosyal medya) |
| SEO Ayarları | 2 | Varsayılan SEO yapılandırması |
| Audit Log | 2 | Kullanıcı aktiviteleri görüntüleme |
| Rol ve Yetki Yönetimi | 2 | Detaylı izin yapılandırması |
| Planlı Yayın | 2 | Gelecek tarihli yayın zamanlama |
| Toplu İşlemler | 2 | Çoklu haber durumu değiştirme |
| İlgili Haberler | 2 | Manuel ilgili haber seçimi |
| Analytics Dashboard | 3 | Detaylı okuma/etkileşim raporları |

**Teknik Özellikler**:
- Client-side rendering ağırlıklı (interaktif panel)
- Role-based access control
- Rich text editör (Tiptap)
- Drag & drop medya yükleme
- Real-time bildirimler (Supabase Realtime, Faz 2)
- Responsive (tablet uyumlu)

---

### Nevsa API (`apps/api`) - Dış İstemci API

**Amaç**: Mobil uygulama ve üçüncü parti istemciler için RESTful API

| Modül | Faz | Açıklama |
|-------|-----|----------|
| Health Check | 1 | `GET /api/health` |
| Haber Listeleme | 1 | `GET /api/articles` (pagination, sort, filter) |
| Haber Detay | 1 | `GET /api/articles/:slug` |
| Kategori Listeleme | 1 | `GET /api/categories` |
| Etiket Listeleme | 1 | `GET /api/tags` |
| Arama | 1 | `GET /api/search?q=` |
| Manşet/Öne Çıkan | 2 | `GET /api/featured`, `GET /api/headlines` |
| Son Dakika | 2 | `GET /api/breaking` |
| Yazar | 2 | `GET /api/authors/:id` |
| View Count | 1 | `POST /api/articles/:id/view` |
| Revalidation | 1 | `POST /api/revalidate` (webhook) |
| Authentication | 1 | `POST /api/auth/login`, `POST /api/auth/refresh` |

**Teknik Özellikler**:
- Next.js Route Handlers
- JWT authentication (Supabase tokens)
- Rate limiting
- CORS yapılandırması
- Response caching
- API versioning (`/api/v1/`)
- Error handling standardı
- Pagination standardı (cursor-based veya offset)

---

## Ortak Paketler

### @newsa/shared (`packages/shared`)
- TypeScript tip tanımları (Article, Category, Tag, User, vb.)
- Sabitler (status enum'ları, roller, vb.)
- Utility fonksiyonlar (slug üretimi, tarih formatlama, vb.)
- Validation şemaları (Zod)

### @newsa/supabase (`packages/supabase`)
- Supabase client factory (server/client)
- Database tipleri (auto-generated)
- Query helper'lar
- Storage helper'lar
- Auth helper'lar

### @newsa/ui (`packages/ui`)
- Paylaşılan UI bileşenleri (Button, Input, Card, vb.)
- Tailwind preset/config
- Web ve Admin'de ortak kullanılan bileşenler

### @newsa/config (`packages/config`)
- ESLint yapılandırması
- TypeScript base config
- Tailwind preset

# Newsa - Master Plan

## 1. Proje Vizyonu

Newsa, Türkiye ve bölge odaklı modern bir dijital haber platformudur. Amacı; hızlı, SEO uyumlu, yönetimi kolay ve ölçeklenebilir bir haber deneyimi sunmaktır. Editör ekipleri için güçlü bir admin paneli, son kullanıcılar için hızlı ve temiz bir okuma deneyimi, mobil uygulamalar için güvenilir bir API sağlar.

## 2. Hedefler

### Kısa Vadeli (MVP - Faz 1)
- Haber oluşturma, düzenleme, yayınlama akışı
- Temel kategori ve etiket yönetimi
- SEO uyumlu haber detay ve listeleme sayfaları
- Admin panelinde temel CRUD operasyonları
- Rol bazlı yetkilendirme (Admin, Editör, Yazar)
- Medya yükleme ve yönetimi
- API üzerinden haber listeleme ve detay

### Orta Vadeli (Faz 2)
- Manşet, öne çıkan haberler, son dakika yönetimi
- Gelişmiş arama ve filtreleme
- Planlı yayın (scheduled publishing)
- İlgili haberler önerisi
- Sosyal medya entegrasyonları
- Performans optimizasyonu (ISR, caching)
- Analytics dashboard

### Uzun Vadeli (Faz 3)
- Push notification sistemi
- Yorum sistemi
- Newsletter yönetimi
- A/B test altyapısı
- Çoklu dil desteği (i18n)
- Reklam yönetimi modülü
- Gelişmiş analytics ve raporlama

## 3. Teknik Kapsam

### Mimari
```
┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│  Nevsa Web  │  │ Nevsa Admin  │  │  Nevsa API  │
│  (Next.js)  │  │  (Next.js)   │  │  (Next.js)  │
│  SSR/SSG    │  │  CSR/SSR     │  │  Route Hdlr │
└──────┬──────┘  └──────┬───────┘  └──────┬──────┘
       │                │                  │
       └────────────────┼──────────────────┘
                        │
              ┌─────────┴─────────┐
              │    @newsa/supabase │
              │   (Shared Client)  │
              └─────────┬─────────┘
                        │
              ┌─────────┴─────────┐
              │     Supabase      │
              │  ┌──────────────┐ │
              │  │  PostgreSQL  │ │
              │  │  Auth        │ │
              │  │  Storage     │ │
              │  │  Realtime    │ │
              │  │  Edge Func.  │ │
              │  └──────────────┘ │
              └───────────────────┘
```

### Monorepo Yapısı
- **Turborepo** ile build orchestration
- **pnpm workspaces** ile paket yönetimi
- Paylaşılan tipler ve utilities `packages/` altında
- Her uygulama bağımsız deploy edilebilir

### Rendering Stratejisi
| Sayfa | Strateji | Neden |
|-------|----------|-------|
| Anasayfa | ISR (60s) | Sık güncellenen içerik, SEO kritik |
| Haber Detay | SSG + ISR | SEO kritik, yayınlandıktan sonra az değişir |
| Kategori Listesi | ISR (120s) | SEO kritik, orta sıklıkta güncellenir |
| Arama | SSR | Dinamik, kullanıcıya özel sonuçlar |
| Admin Panel | CSR | SEO gereksiz, interaktif |

## 4. Modül Listesi

### Nevsa Web (Son Kullanıcı)
1. Anasayfa (manşet, slider, kategoriye göre haberler)
2. Haber Detay Sayfası
3. Kategori Sayfası
4. Etiket Sayfası
5. Yazar Sayfası
6. Arama Sayfası
7. Son Dakika Bandı
8. Header / Navigation
9. Footer
10. SEO / Metadata Yönetimi
11. Sosyal Paylaşım Butonları
12. İlgili Haberler Widget
13. En Çok Okunanlar Widget
14. Breadcrumb Navigasyonu

### Nevsa Admin
1. Dashboard (genel istatistikler)
2. Haber Yönetimi (CRUD, rich text editor)
3. Kategori Yönetimi
4. Etiket Yönetimi
5. Yazar/Kullanıcı Yönetimi
6. Medya Kütüphanesi
7. Manşet/Öne Çıkan Yönetimi
8. Son Dakika Yönetimi
9. Banner/Reklam Alanları Yönetimi
10. Site Ayarları
11. SEO Ayarları
12. Rol ve Yetki Yönetimi
13. Audit Log Görüntüleme
14. Yayın Akışı (Taslak > İnceleme > Yayında > Arşiv)

### Nevsa API
1. Haber Listeleme (pagination, filtreleme)
2. Haber Detay
3. Kategori Listeleme
4. Etiket Listeleme
5. Arama
6. Manşet/Öne Çıkan Haberler
7. Son Dakika Haberleri
8. Yazar Profili
9. Authentication Endpoints
10. Medya URL Servisi

## 5. Fazlara Bölünmüş Geliştirme Planı

### Faz 1 - MVP (Sprint 1-4, ~8 hafta)

**Sprint 1: Altyapı ve Temel Kurulum** (2 hafta)
- Monorepo kurulumu (Turborepo + pnpm)
- Next.js projeleri başlatma (web, admin, api)
- Supabase projesi oluşturma ve bağlantı
- Paylaşılan paketler yapılandırma
- Veritabanı şeması tasarımı ve migration'lar
- Authentication altyapısı (Supabase Auth)
- Temel layout ve navigasyon (web + admin)
- CI/CD pipeline (Vercel)

**Sprint 2: Haber Yönetimi Core** (2 hafta)
- Haber CRUD (admin)
- Rich text editör entegrasyonu
- Medya yükleme (Supabase Storage)
- Kategori CRUD (admin)
- Etiket CRUD (admin)
- Haber listeleme sayfası (web)
- Haber detay sayfası (web)

**Sprint 3: İçerik ve SEO** (2 hafta)
- SEO metadata yönetimi
- Slug otomatik üretimi
- Yayın durumu yönetimi (taslak/yayında/arşiv)
- Anasayfa tasarımı ve implementasyonu
- Kategori sayfaları
- Yazar sayfaları
- Sitemap oluşturma
- API temel endpoint'leri

**Sprint 4: Polish ve MVP Tamamlama** (2 hafta)
- Rol bazlı yetkilendirme
- Arama fonksiyonu
- Responsive tasarım iyileştirmeleri
- Performans optimizasyonu
- E2E testler
- Bug fix ve stabilizasyon
- MVP deployment

### Faz 2 - Gelişmiş Özellikler (Sprint 5-8, ~8 hafta)
- Manşet ve öne çıkan haber yönetimi
- Son dakika haberleri sistemi
- Planlı yayın
- İlgili haberler algoritması
- Gelişmiş arama ve filtreleme
- Analytics dashboard
- Banner/reklam alanları
- Sosyal medya paylaşım optimizasyonu
- Audit log sistemi
- API genişletme (pagination, filtreleme, sıralama)

### Faz 3 - İleri Özellikler (Sprint 9-12, ~8 hafta)
- Push notification
- Yorum sistemi
- Newsletter
- Çoklu dil desteği
- A/B testing altyapısı
- Gelişmiş raporlama
- CDN ve caching optimizasyonları
- Mobil uygulama için API zenginleştirme

## 6. MVP Kapsamı

MVP'de olması gereken minimum özellikler:
- [x] Haber oluşturma, düzenleme, silme (admin)
- [x] Haber listeleme ve detay (web)
- [x] Kategori yönetimi
- [x] Etiket yönetimi
- [x] Medya yükleme
- [x] SEO metadata
- [x] Slug yönetimi
- [x] Yayın durumu (taslak/yayında)
- [x] Admin authentication
- [x] Temel rol yönetimi (admin/editör)
- [x] Anasayfa
- [x] Responsive tasarım
- [x] API: Haber listeleme ve detay
- [x] Vercel deployment

MVP'de olmayacaklar:
- [ ] Son dakika sistemi
- [ ] Manşet yönetimi
- [ ] Planlı yayın
- [ ] Yorum sistemi
- [ ] Newsletter
- [ ] Push notification
- [ ] Reklam yönetimi
- [ ] Çoklu dil

## 7. Riskler

| Risk | Olasılık | Etki | Azaltma Stratejisi |
|------|----------|------|---------------------|
| Supabase rate limiting | Orta | Yüksek | ISR/caching, connection pooling |
| SEO performans sorunları | Düşük | Yüksek | SSG/ISR doğru kullanımı, Core Web Vitals takibi |
| Rich text editör karmaşıklığı | Orta | Orta | Hazır çözüm (Tiptap/Plate) kullanımı |
| Medya depolama maliyeti | Orta | Orta | Görsel optimizasyonu, boyut limitleri |
| Monorepo build süresi | Düşük | Düşük | Turborepo caching, incremental builds |
| Supabase vendor lock-in | Düşük | Orta | Abstraction layer (@newsa/supabase) |

## 8. Varsayımlar

1. Supabase free/pro tier yeterli başlangıç kapasitesi sağlar
2. Vercel Hobby/Pro plan deployment ihtiyaçlarını karşılar
3. Editör ekibi 5-15 kişi arasında olacak
4. Günlük 50-200 haber yayınlanacak
5. İlk etapta tek dil (Türkçe) yeterli
6. Mobil uygulama API üzerinden çalışacak (ayrı geliştirme)
7. Reklam yönetimi MVP'de gerekli değil
8. Kullanıcı yorumları MVP'de gerekli değil

## 9. Bağımlılıklar

### Dış Bağımlılıklar
- Supabase hesabı ve proje oluşturulması
- Vercel hesabı ve proje bağlantısı
- Domain yapılandırması
- SSL sertifikası (Vercel otomatik)

### İç Bağımlılıklar
- Veritabanı şeması → Tüm uygulamalar
- @newsa/supabase paketi → web, admin, api
- @newsa/shared tipleri → web, admin, api
- Authentication → Admin panel, API
- Supabase Storage → Medya yönetimi

### Teknik Bağımlılıklar
```
apps/web     → packages/shared, packages/supabase, packages/ui
apps/admin   → packages/shared, packages/supabase, packages/ui
apps/api     → packages/shared, packages/supabase
packages/supabase → packages/shared
```

## 10. Test Stratejisi

Detaylar: `docs/test-strategy.md`

- **Unit Test**: Vitest - utility fonksiyonlar, hook'lar, veri dönüşümleri
- **Integration Test**: Vitest + Supabase - veritabanı operasyonları
- **E2E Test**: Playwright - kritik kullanıcı akışları
- **Visual Test**: Playwright screenshot comparison
- **Performance Test**: Lighthouse CI

## 11. Deploy Stratejisi

Detaylar: `docs/deploy-strategy.md`

- Her PR → Preview deployment (Vercel)
- `develop` → Staging environment
- `main` → Production environment
- Veritabanı migration'ları CI/CD'de otomatik çalışır
- Rollback: Vercel instant rollback + migration down

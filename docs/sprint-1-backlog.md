# Sprint 1 - Backlog

**Sprint Amacı**: Monorepo altyapısını kurmak, Supabase şemasını oluşturmak, temel layout ve authentication altyapısını hazır hale getirmek.

**Süre**: 2 hafta
**Sorumlu Agent'lar**: PM (koordinasyon), Developer (implementasyon), Analyst (doğrulama)

---

## Görevler

### 1. Monorepo Kurulumu
**Agent**: Developer
**Öncelik**: P0 (Kritik)
**Tahmini Effort**: L

- [ ] pnpm workspace yapılandırması (`pnpm-workspace.yaml`)
- [ ] Turborepo yapılandırması (`turbo.json`)
- [ ] Root `package.json` (scripts, devDependencies)
- [ ] `.gitignore` güncelleme (Node.js uyumlu)
- [ ] `.env.example` dosyaları

**Acceptance Criteria**:
- `pnpm install` hatasız çalışır
- `pnpm dev` tüm uygulamaları başlatır
- `pnpm build` tüm uygulamaları derler

---

### 2. Next.js Projeleri Başlatma
**Agent**: Developer
**Öncelik**: P0
**Tahmini Effort**: L
**Bağımlılık**: #1

- [ ] `apps/web` - Next.js 14+ App Router, Tailwind CSS
- [ ] `apps/admin` - Next.js 14+ App Router, Tailwind CSS
- [ ] `apps/api` - Next.js 14+ App Router (Route Handlers)
- [ ] TypeScript strict mode tüm projelerde
- [ ] Her proje için temel `layout.tsx` ve `page.tsx`
- [ ] Port yapılandırması: web:3000, admin:3001, api:3002

**Acceptance Criteria**:
- Her uygulama bağımsız olarak `dev` modda çalışır
- Her uygulama bağımsız olarak `build` edilir
- TypeScript hataları yok

---

### 3. Paylaşılan Paketler
**Agent**: Developer
**Öncelik**: P0
**Tahmini Effort**: M
**Bağımlılık**: #1

- [ ] `packages/shared` - Ortak tipler ve utility'ler
- [ ] `packages/supabase` - Supabase client ve tipler
- [ ] `packages/ui` - Paylaşılan UI bileşenleri (temel)
- [ ] `packages/config` - Paylaşılan yapılandırmalar (tsconfig, eslint, tailwind)
- [ ] Paketler arası dependency doğru yapılandırılmış

**Acceptance Criteria**:
- Uygulamalar paylaşılan paketleri import edebilir
- TypeScript tipleri projeler arası çalışır

---

### 4. Supabase Kurulumu
**Agent**: Developer
**Öncelik**: P0
**Tahmini Effort**: M

- [ ] Supabase projesi oluşturma (veya CLI local setup)
- [ ] `supabase/config.toml` yapılandırması
- [ ] Supabase client oluşturma (`packages/supabase`)
- [ ] Server-side ve client-side client ayrımı

**Acceptance Criteria**:
- `supabase start` ile local Supabase çalışır
- Uygulamalar Supabase'e bağlanır

---

### 5. Veritabanı Şeması (Migration'lar)
**Agent**: Developer
**Öncelik**: P0
**Tahmini Effort**: L
**Bağımlılık**: #4

- [ ] `profiles` tablosu ve trigger
- [ ] `categories` tablosu
- [ ] `tags` tablosu
- [ ] `media` tablosu
- [ ] `articles` tablosu (tüm alanlar)
- [ ] `article_tags` junction tablosu
- [ ] `article_media` junction tablosu
- [ ] `related_articles` tablosu
- [ ] `settings` tablosu
- [ ] `audit_logs` tablosu
- [ ] RLS politikaları
- [ ] İndeksler
- [ ] `updated_at` trigger fonksiyonu
- [ ] `generate_slug` fonksiyonu
- [ ] `increment_view_count` fonksiyonu
- [ ] Storage bucket'ları

**Acceptance Criteria**:
- `supabase db reset` hatasız çalışır
- Tüm tablolar oluşturulur
- RLS aktif ve çalışıyor
- Supabase Dashboard'da tablolar görünür

---

### 6. Seed Data
**Agent**: Developer
**Öncelik**: P1
**Tahmini Effort**: S
**Bağımlılık**: #5

- [ ] `supabase/seed.sql` oluştur
- [ ] 3 kullanıcı (admin, editor, author)
- [ ] 5 kategori
- [ ] 10 etiket
- [ ] Test haberleri (çeşitli durumlar)

**Acceptance Criteria**:
- `supabase db reset` sonrası seed data yüklenir
- Admin panelde test verileri görünür

---

### 7. Authentication Altyapısı
**Agent**: Developer
**Öncelik**: P0
**Tahmini Effort**: M
**Bağımlılık**: #4, #5

- [ ] Supabase Auth yapılandırması
- [ ] Admin login sayfası (`apps/admin`)
- [ ] Auth middleware (protected routes)
- [ ] Session yönetimi
- [ ] Logout fonksiyonu
- [ ] Auth context/hook

**Acceptance Criteria**:
- Admin panele giriş yapılabilir
- Giriş yapmamış kullanıcı login'e yönlendirilir
- Session süresi dolunca re-login gerekir

---

### 8. Temel Layout ve Navigasyon
**Agent**: Developer
**Öncelik**: P1
**Tahmini Effort**: M
**Bağımlılık**: #2

- [ ] Web: Header (logo, navigasyon, arama ikonu)
- [ ] Web: Footer (linkler, copyright)
- [ ] Web: Ana layout yapısı
- [ ] Admin: Sidebar navigasyon
- [ ] Admin: Topbar (kullanıcı bilgisi, logout)
- [ ] Admin: Ana layout yapısı
- [ ] Responsive temel yapı

**Acceptance Criteria**:
- Web anasayfa layout'u gösterilir
- Admin panel sidebar ile navigasyon çalışır
- Mobil görünümde hamburger menü çalışır

---

### 9. Vercel Deploy Yapılandırması
**Agent**: Developer
**Öncelik**: P1
**Tahmini Effort**: S
**Bağımlılık**: #2

- [ ] `vercel.json` yapılandırmaları
- [ ] Environment variable tanımları
- [ ] Build komutları doğrulanmış
- [ ] Preview deployment test edilmiş

**Acceptance Criteria**:
- PR açıldığında preview deploy çalışır
- 3 proje de başarıyla deploy olur

---

### 10. CI/CD Temel Pipeline
**Agent**: Developer
**Öncelik**: P2
**Tahmini Effort**: S

- [ ] GitHub Actions workflow
- [ ] Lint kontrolü
- [ ] Type check
- [ ] Build kontrolü

**Acceptance Criteria**:
- PR'da otomatik kontroller çalışır
- Hata durumunda PR merge engellenebilir

---

## Görev Öncelik Sırası

```
P0 (Blokleyici - ilk yapılacak):
  #1 Monorepo Kurulumu
  #2 Next.js Projeleri (← #1'e bağlı)
  #3 Paylaşılan Paketler (← #1'e bağlı)
  #4 Supabase Kurulumu
  #5 Veritabanı Şeması (← #4'e bağlı)
  #7 Authentication (← #4, #5'e bağlı)

P1 (Önemli):
  #6 Seed Data (← #5'e bağlı)
  #8 Layout ve Navigasyon (← #2'ye bağlı)
  #9 Vercel Deploy (← #2'ye bağlı)

P2 (İyi olur):
  #10 CI/CD Pipeline
```

## Sprint 1 Bağımlılık Grafiği

```
#1 Monorepo ──→ #2 Next.js ──→ #8 Layout
     │              │
     └──→ #3 Packages    #9 Vercel Deploy

#4 Supabase ──→ #5 Schema ──→ #6 Seed
                    │
                    └──→ #7 Auth

#10 CI/CD (bağımsız)
```

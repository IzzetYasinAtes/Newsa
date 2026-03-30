# Test Stratejisi

## Test Piramidi

```
        ┌─────────┐
        │  E2E    │  Playwright (kritik akışlar)
        ├─────────┤
      ┌─┤ Integr. ├─┐  Vitest + Supabase (API, DB)
      ├─┴─────────┴─┤
    ┌─┤    Unit     ├─┐  Vitest (utils, hooks, transforms)
    └─┴─────────────┴─┘
```

## 1. Unit Testler (Vitest)

**Kapsam**: Utility fonksiyonlar, data transformasyonları, custom hook'lar, pure fonksiyonlar

**Araçlar**: Vitest, Testing Library

**Konvansiyonlar**:
- Test dosyaları: `*.test.ts` / `*.test.tsx`
- Aynı dizinde kaynak dosya ile yan yana
- `describe` / `it` yapısı

**Hedef Kapsam**: %80+ coverage (packages/shared, packages/supabase)

### Öncelikli Test Alanları
- Slug üretimi
- Tarih formatlama
- SEO metadata üretimi
- Data validation fonksiyonları
- Type guard'lar
- API response transformasyonları

---

## 2. Integration Testler (Vitest + Supabase)

**Kapsam**: Veritabanı operasyonları, Supabase sorguları, API endpoint'leri

**Araçlar**: Vitest, Supabase local (Docker)

**Konvansiyonlar**:
- Test dosyaları: `*.integration.test.ts`
- Test veritabanı kullanır (seed data ile)
- Her test suite öncesi/sonrası temizlik

### Öncelikli Test Alanları
- Haber CRUD operasyonları
- RLS politikaları
- Kategori/etiket ilişkileri
- Authentication akışları
- Medya yükleme

---

## 3. E2E Testler (Playwright)

**Kapsam**: Kritik kullanıcı akışları, görsel doğrulama

**Araçlar**: Playwright, Playwright MCP

**Konvansiyonlar**:
- Test dosyaları: `e2e/*.spec.ts`
- Page Object Model kullanılır
- Her test bağımsız çalışır (izole state)

### Kritik Test Senaryoları

#### Admin Panel
1. **Giriş akışı**: Login → Dashboard
2. **Haber oluşturma**: Form doldur → Kaydet → Listede gör
3. **Haber yayınlama**: Draft → Review → Publish
4. **Kategori yönetimi**: Oluştur → Düzenle → Sil
5. **Medya yükleme**: Dosya seç → Yükle → Galeriden seç
6. **Rol kontrolü**: Yazar olarak giriş → yayınlama butonu görünmemeli

#### Web (Son Kullanıcı)
1. **Anasayfa yüklenme**: Manşet, kategoriler, son haberler görünür
2. **Haber detay**: Tıkla → Detay sayfası açılır → İçerik doğru
3. **Kategori sayfası**: Kategori tıkla → Haberler listelenir
4. **Arama**: Kelime yaz → Sonuçlar listelenir
5. **SEO kontrol**: Meta tag'ler doğru render ediliyor
6. **Responsive**: Mobil görünüm doğru

#### API
1. **Haber listeleme**: GET /api/articles → 200 + pagination
2. **Haber detay**: GET /api/articles/:slug → 200 + doğru veri
3. **Auth**: Protected endpoint'e tokensız istek → 401
4. **Filtreleme**: Kategori/etiket filtresi çalışıyor

---

## 4. Smoke Test

Her deploy sonrası çalışır:
- [ ] Anasayfa yükleniyor
- [ ] Haber detay sayfası açılıyor
- [ ] Admin login çalışıyor
- [ ] API /health endpoint 200 dönüyor
- [ ] Görseller yükleniyor

---

## 5. Test Ortamı

```
Local Development:
  - Supabase CLI (local PostgreSQL)
  - Seed data ile test veritabanı

CI/CD (GitHub Actions):
  - Supabase CLI Docker
  - Playwright Docker
  - Paralel test çalıştırma

Staging:
  - Ayrı Supabase projesi
  - Vercel preview deployment
```

---

## 6. Test Verisi

`supabase/seed.sql` dosyasında:
- 3 kullanıcı (admin, editör, yazar)
- 5 kategori
- 10 etiket
- 20 haber (çeşitli durumlar: draft, review, published, archived)
- 10 medya dosyası
- İlgili haber ilişkileri

---

## 7. CI/CD Entegrasyonu

```yaml
# Her PR'da:
- Lint kontrolü
- Type check
- Unit testler
- Integration testler

# Merge sonrası (develop):
- E2E testler
- Smoke testler
- Preview deployment doğrulaması

# Release (main):
- Full regression
- Smoke test (production)
```

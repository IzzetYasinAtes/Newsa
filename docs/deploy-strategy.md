# Deploy Stratejisi

## Ortamlar

| Ortam | Branch | URL | Supabase | Amaç |
|-------|--------|-----|----------|------|
| Local | - | localhost:3000/3001/3002 | Supabase CLI (local) | Geliştirme |
| Preview | PR branch | *.vercel.app | Staging project | PR review |
| Staging | develop | staging.newsa.com | Staging project | Test & QA |
| Production | main | newsa.com | Production project | Canlı |

## Vercel Yapılandırması

### 3 Ayrı Vercel Projesi

```
Vercel Dashboard
├── newsa-web        → apps/web       → newsa.com
├── newsa-admin      → apps/admin     → admin.newsa.com
└── newsa-api        → apps/api       → api.newsa.com
```

### Root Directory Ayarı
Her Vercel projesinde root directory monorepo kökü olarak ayarlanır, build komutu Turborepo üzerinden çalışır:

```
# newsa-web
Build Command: cd ../.. && pnpm turbo build --filter=@newsa/web
Output Directory: apps/web/.next

# newsa-admin
Build Command: cd ../.. && pnpm turbo build --filter=@newsa/admin
Output Directory: apps/admin/.next

# newsa-api
Build Command: cd ../.. && pnpm turbo build --filter=@newsa/api
Output Directory: apps/api/.next
```

## Environment Variables

### Paylaşılan (Tüm projeler)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Server-side only
```

### Web
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_URL=
REVALIDATION_SECRET=              # ISR revalidation
```

### Admin
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_URL=
```

### API
```
API_SECRET_KEY=
CORS_ALLOWED_ORIGINS=
```

## Deploy Akışı

```
Developer Push
       │
       ▼
  GitHub PR ──→ Vercel Preview Deploy
       │              │
       │         Smoke Tests
       │              │
       ▼              ▼
  Code Review    Test Results
       │
       ▼
  Merge to develop ──→ Staging Deploy
       │                     │
       │               E2E + Regression
       │                     │
       ▼                     ▼
  Merge to main ──→ Production Deploy
                          │
                    Smoke Test (Prod)
                          │
                    ✅ Done / 🔄 Rollback
```

## Database Migration

### Geliştirme
```bash
supabase migration new <name>     # Yeni migration oluştur
supabase db push                  # Local'e uygula
supabase db reset                 # Local'i sıfırla + seed
```

### Staging/Production
- Migration'lar Supabase Dashboard veya CI/CD üzerinden uygulanır
- `supabase db push --linked` ile remote'a push
- Her migration geri alınabilir olmalı (down migration)
- Production migration'ları maintenance window'da uygulanır

## Rollback Stratejisi

### Uygulama Rollback
- Vercel "Instant Rollback" özelliği ile önceki deploy'a dönüş
- 1 tıklama ile yapılır, downtime yok

### Database Rollback
- Her migration'ın down versiyonu yazılır
- Kritik değişiklikler için backup alınır
- Point-in-time recovery (Supabase Pro)

## Monitoring

- **Vercel Analytics**: Sayfa performansı, Core Web Vitals
- **Supabase Dashboard**: DB performansı, API kullanımı
- **Sentry** (opsiyonel): Error tracking
- **Uptime Robot** (opsiyonel): Uptime monitoring

## Caching Stratejisi

| Kaynak | Cache Süresi | Strateji |
|--------|-------------|----------|
| Anasayfa | 60s | ISR |
| Haber Detay | 300s | ISR + On-demand revalidation |
| Kategori Sayfası | 120s | ISR |
| Statik Sayfalar | Build time | SSG |
| API Responses | 60s | Cache-Control header |
| Görseller | 31d | Vercel Edge Cache + CDN |

### On-Demand Revalidation
Admin panelde haber yayınlandığında/güncellendiğinde ilgili sayfalar revalidate edilir:
```
POST /api/revalidate?secret=xxx&path=/haber/slug
POST /api/revalidate?secret=xxx&path=/kategori/slug
POST /api/revalidate?secret=xxx&path=/
```

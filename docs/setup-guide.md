# Kurulum Sırası

## Ön Gereksinimler

1. **Node.js** 18+ kurulu
2. **pnpm** 8+ kurulu (`npm install -g pnpm`)
3. **Supabase CLI** kurulu (`npx supabase init` veya `scoop install supabase`)
4. **Docker** (Supabase local için)
5. **Git** kurulu
6. **Vercel CLI** (opsiyonel) (`npm install -g vercel`)

## Kurulum Adımları

### Adım 1: Monorepo Altyapısı
```bash
# Root package.json ve workspace yapılandırması
pnpm init
# pnpm-workspace.yaml oluştur
# turbo.json oluştur
# .gitignore güncelle
```

### Adım 2: Paylaşılan Paketler
```bash
# Sıralama önemli - önce config, sonra shared, sonra diğerleri
packages/config    → tsconfig, eslint, tailwind base
packages/shared    → tipler, utils
packages/supabase  → client, db tipleri
packages/ui        → ortak bileşenler (temel)
```

### Adım 3: Next.js Uygulamaları
```bash
# Her uygulama Next.js 14+ App Router ile
pnpm create next-app apps/web --typescript --tailwind --app --use-pnpm
pnpm create next-app apps/admin --typescript --tailwind --app --use-pnpm
pnpm create next-app apps/api --typescript --tailwind --app --use-pnpm
```

### Adım 4: Supabase
```bash
supabase init                    # supabase/ klasörünü oluşturur
supabase start                   # Local Supabase başlatır
# Migration dosyaları oluştur
# Seed data yaz
supabase db reset                # Şemayı uygula + seed data
```

### Adım 5: Paket Bağlantıları
```bash
# Her uygulamada paylaşılan paketleri ekle
cd apps/web && pnpm add @newsa/shared @newsa/supabase @newsa/ui
cd apps/admin && pnpm add @newsa/shared @newsa/supabase @newsa/ui
cd apps/api && pnpm add @newsa/shared @newsa/supabase
```

### Adım 6: Environment
```bash
# Root .env.example oluştur
# Her uygulamada .env.local oluştur
# Supabase URL ve key'leri yapıştır
```

### Adım 7: Authentication
```bash
# Supabase Auth yapılandırması
# Admin login sayfası
# Auth middleware
```

### Adım 8: Temel Layoutlar
```bash
# Web: header, footer, ana layout
# Admin: sidebar, topbar, ana layout
```

### Adım 9: Deploy
```bash
# Vercel'de 3 proje oluştur
# GitHub repo bağla
# Environment variable'ları ayarla
# İlk deploy
```

### Adım 10: CI/CD
```bash
# .github/workflows/ci.yml oluştur
# Lint, type-check, build, test
```

## Doğrulama Kontrol Listesi

Sprint 1 tamamlandığında:

- [ ] `pnpm install` hatasız çalışıyor
- [ ] `pnpm dev` 3 uygulamayı başlatıyor
- [ ] `pnpm build` hatasız tamamlanıyor
- [ ] `pnpm lint` hata vermiyor
- [ ] `pnpm type-check` geçiyor
- [ ] `supabase start` local DB başlatıyor
- [ ] `supabase db reset` şemayı oluşturuyor ve seed data yüklüyor
- [ ] Web anasayfa render ediliyor (localhost:3000)
- [ ] Admin login sayfası görünüyor (localhost:3001)
- [ ] API health endpoint çalışıyor (localhost:3002/api/health)
- [ ] Admin panele giriş yapılabiliyor
- [ ] Vercel preview deployment çalışıyor

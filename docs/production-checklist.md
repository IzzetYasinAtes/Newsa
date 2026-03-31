# Newsa - Üretim Ortamı Checklist

## 1. Ortam Değişkenleri

### Supabase (Zorunlu)
```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### Sentry (Opsiyonel - Hata İzleme)
```
NEXT_PUBLIC_SENTRY_DSN=https://<key>@sentry.io/<project>
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
SENTRY_AUTH_TOKEN=<auth-token>
SENTRY_ORG=<org-slug>
SENTRY_PROJECT=<project-slug>
```

### Vercel
```
VERCEL_URL=<auto-set>
```

## 2. Supabase Production Kurulumu

- [ ] Supabase projesini Pro plan'a yükselt (production yükü için)
- [ ] Migration'ları production'a uygula (`supabase db push`)
- [ ] RLS politikalarının aktif olduğunu doğrula
- [ ] Seed data ile temel admin kullanıcısı oluştur
- [ ] Connection pooling (PgBouncer) aktif
- [ ] Backup ayarlarını yapılandır (Point-in-Time Recovery)
- [ ] Custom domain yapılandır (opsiyonel)

## 3. Vercel Deployment

- [ ] 3 proje oluştur: newsa-web, newsa-admin, newsa-api
- [ ] Her projede root directory ayarla (apps/web, apps/admin, apps/api)
- [ ] Build command: `cd ../.. && pnpm build --filter=@newsa/web`
- [ ] Environment variables ekle (yukarıdaki tüm env'ler)
- [ ] Custom domain bağla (web: newsa.com, admin: admin.newsa.com, api: api.newsa.com)
- [ ] Preview deployments aktif
- [ ] Production branch: main

## 4. DNS ve Domain

- [ ] Ana domain (newsa.com) → Vercel web projesine
- [ ] Admin subdomain (admin.newsa.com) → Vercel admin projesine
- [ ] API subdomain (api.newsa.com) → Vercel API projesine
- [ ] SSL sertifikaları otomatik (Vercel)
- [ ] www redirect ayarla

## 5. Güvenlik

- [ ] CSP headers aktif (middleware'de tanımlı)
- [ ] Rate limiting aktif (API endpoint'lerinde)
- [ ] CORS sadece izin verilen origin'ler
- [ ] Supabase RLS tüm tablolarda aktif
- [ ] Service role key sadece server-side'da
- [ ] Admin paneli sadece authenticated kullanıcılara
- [ ] Input validation (Zod) tüm form'larda
- [ ] XSS koruması aktif

## 6. Performans

- [ ] Next.js Image optimization aktif
- [ ] ISR/SSG kritik sayfalar için yapılandırılmış
- [ ] Caching headers doğru ayarlanmış
- [ ] Bundle size kabul edilebilir seviyede
- [ ] Lighthouse skoru >90 (Performance, Accessibility, Best Practices)
- [ ] Core Web Vitals hedefleri karşılanıyor (LCP <2.5s, FID <100ms, CLS <0.1)

## 7. SEO

- [ ] Sitemap.xml erişilebilir (/sitemap.xml)
- [ ] Robots.txt doğru yapılandırılmış (/robots.txt)
- [ ] RSS feed aktif (/rss.xml)
- [ ] Tüm sayfalar meta title/description içeriyor
- [ ] OG tags ve Twitter Cards tanımlı
- [ ] JSON-LD structured data (NewsArticle, BreadcrumbList)
- [ ] Canonical URL'ler doğru
- [ ] Google Search Console'a kayıt

## 8. İzleme ve Loglama

- [ ] Sentry DSN yapılandırılmış (client + server)
- [ ] Error boundary'ler tüm app'lerde aktif
- [ ] Supabase dashboard'dan DB metrikleri izleniyor
- [ ] Vercel Analytics aktif (opsiyonel)
- [ ] Uptime monitoring (UptimeRobot veya benzeri)

## 9. Test

- [ ] `pnpm build` hatasız tamamlanıyor
- [ ] `pnpm type-check` hatasız
- [ ] `pnpm lint` hatasız
- [ ] E2E testler geçiyor (`pnpm test:e2e`)
- [ ] Manuel smoke test: login → haber oluştur → yayınla → web'de gör

## 10. İlk Kullanıcı ve İçerik

- [ ] Super admin kullanıcısı oluşturuldu
- [ ] Temel kategoriler tanımlandı
- [ ] Site ayarları yapılandırıldı (site adı, logo, favicon)
- [ ] Hakkımızda / İletişim gibi statik sayfalar hazır
- [ ] Header/footer menüleri yapılandırıldı

## 11. Yedekleme ve Felaket Kurtarma

- [ ] Supabase otomatik backup aktif
- [ ] Git repository yedekleme (GitHub)
- [ ] Env variables yedekleme (güvenli konumda)
- [ ] Rollback prosedürü belirlendi (Vercel instant rollback)

## 12. Go-Live Sonrası

- [ ] Google Analytics / Search Console bağlandı
- [ ] Sosyal medya hesapları meta tag'lere eklendi
- [ ] İlk içerikler yayınlandı
- [ ] Monitoring alert'leri yapılandırıldı
- [ ] Ekip eğitimi tamamlandı (admin panel kullanımı)

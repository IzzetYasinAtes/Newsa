# Newsa - Haber Platformu

## Proje Özeti
Newsa, Next.js + Supabase + Vercel üzerine kurulu modern bir haber platformudur.
Monorepo yapısında 3 uygulama barındırır.

## Teknoloji Stack
- **Frontend/UI**: Next.js 14+ (App Router)
- **Backend/Data**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Deploy**: Vercel
- **Monorepo**: Turborepo
- **Paket Yönetimi**: pnpm
- **Dil**: TypeScript (strict mode)
- **Stil**: Tailwind CSS
- **Test**: Vitest (unit), Playwright (E2E)

## Projeler
| Proje | Dizin | Açıklama |
|-------|-------|----------|
| Nevsa UI | `apps/web` | Son kullanıcı haber sitesi (SEO uyumlu, SSR/SSG) |
| Nevsa Admin | `apps/admin` | Admin paneli (haber/kategori/medya/kullanıcı yönetimi) |
| Nevsa API | `apps/api` | Mobil ve dış istemciler için REST API (Next.js Route Handlers) |

## Ortak Paketler
| Paket | Dizin | Açıklama |
|-------|-------|----------|
| @newsa/shared | `packages/shared` | Ortak tipler, sabitler, yardımcı fonksiyonlar |
| @newsa/supabase | `packages/supabase` | Supabase client, veritabanı tipleri, migration'lar |
| @newsa/ui | `packages/ui` | Paylaşılan UI bileşenleri |
| @newsa/config | `packages/config` | ESLint, TypeScript, Tailwind ortak yapılandırmaları |

## MCP Sunucuları
- **Supabase MCP**: Veri şeması erişimi, migration yönetimi
- **Playwright MCP**: E2E test ve ekran doğrulama

## Agent Organizasyonu
Bu projede 4 agent rolü tanımlıdır:
- **Project Manager**: Görev dağıtımı, planlama, koordinasyon
- **Analyst**: İhtiyaç analizi, gereksinim dokümanları
- **Developer**: Kod üretimi, mimari uygulama
- **Tester**: Test planlama ve yürütme

Detaylar: `docs/agent-organization.md`

## Geliştirme Kuralları
1. **TypeScript strict mode** kullan, `any` tipi yasak
2. **Server Components** varsayılan, client component sadece gerektiğinde
3. Tüm API çağrıları `@newsa/supabase` üzerinden yapılır
4. Her component/modül için barrel export kullanma, doğrudan import yap
5. Veritabanı değişiklikleri migration ile yapılır, manuel SQL yasak
6. Environment değişkenleri `.env.local` dosyasında, secret'lar Vercel'de
7. Commit mesajları conventional commits formatında (feat:, fix:, docs:, vb.)
8. PR açmadan önce lint ve type-check geçmeli
9. Her yeni özellik için en az temel E2E testi yazılmalı
10. SEO kritik sayfalar SSG/ISR ile render edilmeli

## Dosya İsimlendirme
- Componentler: `PascalCase.tsx`
- Utility/hook: `camelCase.ts`
- Sayfalar (App Router): `page.tsx`, `layout.tsx`
- Tipler: `types.ts` veya `*.types.ts`
- Testler: `*.test.ts` veya `*.spec.ts`

## Branch Stratejisi ve Git Workflow

**Ana dal**: `main` (production)

### Her görev için akış:
1. `main`'den yeni branch oluştur: `feature/görev-adi` veya `fix/hata-adi`
2. Çalışmayı bu branch'ta yap, commit'le
3. Tester agent testleri çalıştırır
4. Test başarılı → Developer agent PR oluşturur ve merge eder
5. Branch silinir, sonraki görev için `main`'den yeni branch açılır

### Kısıtlamalar:
- SADECE `izzetyasinates/newsa` reposuna erişim var
- Başka GitHub repolarına push, clone, PR açma, erişim YASAK

### Kurallar:
- `main`'e doğrudan commit ATILMAZ
- Her iş birimi ayrı branch'ta yapılır
- PR oluştur → test geç → merge et → branch sil
- Commit mesajları conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- PR merge sonrası ilgili branch otomatik silinir

### Branch isimlendirme:
- `feature/haber-crud` → Yeni özellik
- `fix/slug-generation` → Hata düzeltme
- `chore/monorepo-setup` → Altyapı/yapılandırma
- `docs/api-spec` → Dokümantasyon

## Skills (Geliştirme Kuralları)

Tüm agent'lar aşağıdaki skill dosyalarına uymalıdır:

| Skill | Dosya | Açıklama |
|-------|-------|----------|
| App Router | `.claude/commands/nextjs-app-router.md` | Next.js routing, metadata, layout kuralları |
| Server/Client | `.claude/commands/nextjs-server-client-components.md` | Component tipi karar rehberi |
| Anti-Pattern | `.claude/commands/nextjs-anti-patterns.md` | Yapılmaması gereken hatalar |
| Advanced Routing | `.claude/commands/nextjs-advanced-routing.md` | Route handlers, server actions, streaming |
| Cookie/Nav | `.claude/commands/nextjs-cookie-navigation-patterns.md` | Cookie ve navigasyon pattern'leri |
| SEO | `.claude/commands/seo-optimization.md` | Metadata, JSON-LD, sitemap, Core Web Vitals |
| Güvenlik | `.claude/commands/security-hardening.md` | Auth, XSS, CSRF, RLS, rate limiting |
| Responsive | `.claude/commands/responsive-mobile-design.md` | Mobile-first, Tailwind responsive, touch |
| Erişilebilirlik | `.claude/commands/accessibility.md` | WCAG 2.1 AA, semantik HTML, ARIA |
| UI Design System | `.claude/commands/ui-design-system.md` | Renk, tipografi, component pattern'leri, kart varyantları |

## Komutlar
```bash
pnpm dev          # Tüm uygulamaları geliştirme modunda başlat
pnpm build        # Tüm uygulamaları derle
pnpm lint         # Lint kontrolü
pnpm type-check   # TypeScript tip kontrolü
pnpm test         # Unit testleri çalıştır
pnpm test:e2e     # E2E testleri çalıştır
```

# Proje Klasör Yapısı

```
Newsa/
├── CLAUDE.md                          # Ana proje kuralları
├── package.json                       # Root workspace package
├── pnpm-workspace.yaml                # pnpm workspace tanımı
├── turbo.json                         # Turborepo yapılandırması
├── .gitignore
├── .env.example                       # Environment değişken şablonu
│
├── apps/
│   ├── web/                           # Nevsa Web - Son kullanıcı sitesi
│   │   ├── CLAUDE.md
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx         # Root layout
│   │       │   ├── page.tsx           # Anasayfa
│   │       │   ├── not-found.tsx      # 404
│   │       │   ├── sitemap.ts         # Dynamic sitemap
│   │       │   ├── robots.ts          # robots.txt
│   │       │   ├── haber/
│   │       │   │   └── [slug]/
│   │       │   │       └── page.tsx   # Haber detay
│   │       │   ├── kategori/
│   │       │   │   └── [slug]/
│   │       │   │       └── page.tsx   # Kategori sayfası
│   │       │   ├── etiket/
│   │       │   │   └── [slug]/
│   │       │   │       └── page.tsx   # Etiket sayfası
│   │       │   ├── yazar/
│   │       │   │   └── [id]/
│   │       │   │       └── page.tsx   # Yazar sayfası
│   │       │   └── arama/
│   │       │       └── page.tsx       # Arama
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   ├── Footer.tsx
│   │       │   ├── ArticleCard.tsx
│   │       │   ├── ArticleList.tsx
│   │       │   ├── CategoryNav.tsx
│   │       │   ├── SearchBar.tsx
│   │       │   ├── BreakingNews.tsx
│   │       │   ├── FeaturedSlider.tsx
│   │       │   ├── RelatedArticles.tsx
│   │       │   ├── ShareButtons.tsx
│   │       │   └── Breadcrumb.tsx
│   │       ├── lib/
│   │       │   └── utils.ts
│   │       └── styles/
│   │           └── globals.css
│   │
│   ├── admin/                         # Nevsa Admin - Yönetim paneli
│   │   ├── CLAUDE.md
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── login/
│   │       │   │   └── page.tsx
│   │       │   └── (dashboard)/
│   │       │       ├── layout.tsx     # Sidebar layout
│   │       │       ├── page.tsx       # Dashboard
│   │       │       ├── haberler/
│   │       │       │   ├── page.tsx
│   │       │       │   ├── yeni/page.tsx
│   │       │       │   └── [id]/page.tsx
│   │       │       ├── kategoriler/
│   │       │       │   └── page.tsx
│   │       │       ├── etiketler/
│   │       │       │   └── page.tsx
│   │       │       ├── medya/
│   │       │       │   └── page.tsx
│   │       │       ├── kullanicilar/
│   │       │       │   └── page.tsx
│   │       │       └── ayarlar/
│   │       │           └── page.tsx
│   │       ├── components/
│   │       │   ├── Sidebar.tsx
│   │       │   ├── Topbar.tsx
│   │       │   ├── ArticleForm.tsx
│   │       │   ├── ArticleTable.tsx
│   │       │   ├── CategoryForm.tsx
│   │       │   ├── MediaUploader.tsx
│   │       │   ├── MediaGallery.tsx
│   │       │   ├── RichTextEditor.tsx
│   │       │   └── DataTable.tsx
│   │       ├── lib/
│   │       │   ├── utils.ts
│   │       │   └── auth.ts
│   │       └── styles/
│   │           └── globals.css
│   │
│   └── api/                           # Nevsa API - Dış istemci API
│       ├── CLAUDE.md
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── src/
│           └── app/
│               ├── layout.tsx
│               └── api/
│                   ├── health/route.ts
│                   └── v1/
│                       ├── articles/
│                       │   ├── route.ts
│                       │   └── [slug]/
│                       │       ├── route.ts
│                       │       └── view/route.ts
│                       ├── categories/route.ts
│                       ├── tags/route.ts
│                       ├── search/route.ts
│                       ├── featured/route.ts
│                       ├── breaking/route.ts
│                       ├── authors/[id]/route.ts
│                       ├── auth/
│                       │   ├── login/route.ts
│                       │   └── refresh/route.ts
│                       └── revalidate/route.ts
│
├── packages/
│   ├── shared/                        # Ortak tipler ve utility'ler
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types/
│   │       │   ├── article.ts
│   │       │   ├── category.ts
│   │       │   ├── tag.ts
│   │       │   ├── user.ts
│   │       │   ├── media.ts
│   │       │   └── api.ts
│   │       ├── constants/
│   │       │   ├── roles.ts
│   │       │   └── status.ts
│   │       └── utils/
│   │           ├── slug.ts
│   │           ├── date.ts
│   │           └── seo.ts
│   │
│   ├── supabase/                      # Supabase client ve tipler
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── client.ts              # Browser client
│   │       ├── server.ts              # Server client
│   │       ├── middleware.ts           # Auth middleware helper
│   │       ├── types/
│   │       │   └── database.ts        # Auto-generated DB types
│   │       └── queries/
│   │           ├── articles.ts
│   │           ├── categories.ts
│   │           ├── tags.ts
│   │           └── media.ts
│   │
│   ├── ui/                            # Paylaşılan UI bileşenleri
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       ├── Pagination.tsx
│   │       └── Spinner.tsx
│   │
│   └── config/                        # Paylaşılan yapılandırmalar
│       ├── eslint.js
│       ├── tsconfig.base.json
│       └── tailwind.preset.js
│
├── supabase/                          # Supabase yapılandırması
│   ├── config.toml
│   ├── seed.sql
│   └── migrations/
│       ├── 00001_create_profiles.sql
│       ├── 00002_create_categories.sql
│       ├── 00003_create_tags.sql
│       ├── 00004_create_media.sql
│       ├── 00005_create_articles.sql
│       ├── 00006_create_junction_tables.sql
│       ├── 00007_create_settings.sql
│       ├── 00008_create_audit_logs.sql
│       ├── 00009_create_functions.sql
│       └── 00010_create_rls_policies.sql
│
├── e2e/                               # E2E testler (Playwright)
│   ├── playwright.config.ts
│   ├── fixtures/
│   ├── pages/
│   ├── admin/
│   ├── web/
│   └── api/
│
├── docs/                              # Proje dokümanları
│   ├── master-plan.md
│   ├── agent-organization.md
│   ├── modules.md
│   ├── data-model.md
│   ├── news-entity-spec.md
│   ├── deploy-strategy.md
│   ├── test-strategy.md
│   ├── sprint-1-backlog.md
│   ├── setup-guide.md
│   └── folder-structure.md
│
├── .claude/                           # Claude Code yapılandırması
│   ├── agents/
│   │   ├── project-manager.md
│   │   ├── analyst.md
│   │   ├── developer.md
│   │   └── tester.md
│   └── skills/
│
└── .github/                           # CI/CD
    └── workflows/
        └── ci.yml
```

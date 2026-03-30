# Güvenlik Skill'i

Haber platformu için güvenlik kuralları ve best practice'ler.

## 1. Authentication & Authorization

### Supabase Auth Middleware
```typescript
// middleware.ts (root)
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Admin route'ları koru
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/v1/admin/:path*'],
}
```

### Rol Bazlı Erişim Kontrolü (RBAC)
```typescript
// lib/auth.ts
type Role = 'admin' | 'editor' | 'author' | 'viewer'

const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 4,
  editor: 3,
  author: 2,
  viewer: 1,
}

export async function requireRole(minimumRole: Role) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || ROLE_HIERARCHY[profile.role as Role] < ROLE_HIERARCHY[minimumRole]) {
    throw new Error('Yetkisiz erişim')
  }

  return { user, role: profile.role as Role }
}

// Kullanım
export default async function AdminArticlesPage() {
  await requireRole('author')  // Minimum yazar rolü gerekli
  // ...
}
```

## 2. Input Validation (Zod)

### Server Action'larda Validation
```typescript
'use server'

import { z } from 'zod'

const ArticleSchema = z.object({
  title: z.string().min(10).max(200).trim(),
  summary: z.string().max(500).optional(),
  content: z.string().min(1),
  category_id: z.string().uuid(),
  status: z.enum(['draft', 'review']),
  seo_title: z.string().max(70).optional(),
  seo_description: z.string().max(160).optional(),
})

export async function createArticle(formData: FormData): Promise<void> {
  // MUTLAKA validate et
  const parsed = ArticleSchema.safeParse({
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    category_id: formData.get('category_id'),
    status: formData.get('status'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(', '))
  }

  // Validated data ile devam et
  const supabase = await createServerClient()
  await supabase.from('articles').insert(parsed.data)
}
```

### API Route'larda Validation
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = ArticleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: parsed.error.errors } },
      { status: 400 }
    )
  }

  // ...
}
```

## 3. XSS Koruması

### HTML İçerik Sanitizasyonu
```typescript
import DOMPurify from 'isomorphic-dompurify'

// Rich text editörden gelen HTML'i temizle
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's',
                   'ul', 'ol', 'li', 'blockquote', 'a', 'img',
                   'table', 'thead', 'tbody', 'tr', 'th', 'td',
                   'br', 'hr', 'code', 'pre', 'figure', 'figcaption'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'width', 'height',
                   'class', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
  })
}

// dangerouslySetInnerHTML kullanmadan önce MUTLAKA sanitize et
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content_html) }} />
```

### Link Güvenliği
```typescript
// Dış linklerde rel="noopener noreferrer nofollow"
<a href={url} target="_blank" rel="noopener noreferrer nofollow">
  {text}
</a>
```

## 4. CSRF Koruması

Next.js Server Actions otomatik CSRF koruması sağlar. API route'lar için:

```typescript
// API'de Origin kontrolü
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || []

  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Invalid origin' } },
      { status: 403 }
    )
  }
  // ...
}
```

## 5. Rate Limiting

```typescript
// lib/rate-limit.ts
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) return false

  record.count++
  return true
}

// API Route'da kullanım
export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429 }
    )
  }
  // ...
}
```

## 6. HTTP Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
```

## 7. Environment Variable Güvenliği

```typescript
// KURALLAR:
// 1. NEXT_PUBLIC_ prefix'i olan değişkenler client'ta görünür - hassas veri KOYMA
// 2. Server-only değişkenleri NEXT_PUBLIC_ olmadan tanımla
// 3. .env.local gitignore'da olmalı
// 4. Production secret'ları Vercel Environment Variables'da

// DOGRU
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co        // Public - OK
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                     // Public - OK (RLS ile korunur)
SUPABASE_SERVICE_ROLE_KEY=eyJ...                          // Server-only - HASSAS
REVALIDATION_SECRET=abc123                                // Server-only - HASSAS

// Server-side'da runtime validation
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

// Build time'da doğrula
envSchema.parse(process.env)
```

## 8. Supabase RLS (Row Level Security)

```sql
-- RLS HER ZAMAN AÇIK OLMALI
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public okuma: sadece yayınlanmış haberler
CREATE POLICY "public_read_published" ON public.articles
  FOR SELECT USING (status = 'published' AND published_at <= now());

-- Yazar: kendi haberlerini yönetir
CREATE POLICY "author_manage_own" ON public.articles
  FOR ALL USING (auth.uid() = author_id);

-- Editör/Admin: tüm haberleri yönetir
CREATE POLICY "editor_manage_all" ON public.articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );
```

## 9. Dosya Yükleme Güvenliği

```typescript
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB

export async function uploadMedia(file: File) {
  // Tip kontrolü
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Desteklenmeyen dosya türü')
  }

  // Boyut kontrolü
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Dosya boyutu 5MB\'dan büyük olamaz')
  }

  // Dosya adını sanitize et
  const safeName = `${crypto.randomUUID()}.${file.type.split('/')[1]}`

  const supabase = await createServerClient()
  const { data, error } = await supabase.storage
    .from('media')
    .upload(`uploads/${safeName}`, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error
  return data
}
```

## 10. Güvenlik Kontrol Listesi

- [ ] RLS tüm tablolarda aktif
- [ ] Service role key sadece server-side'da
- [ ] Input validation (Zod) tüm form/API'lerde
- [ ] HTML içerik sanitize ediliyor
- [ ] Security header'lar tanımlı
- [ ] CORS doğru yapılandırılmış
- [ ] Rate limiting API'lerde aktif
- [ ] Dosya yükleme kontrolleri
- [ ] Audit log kritik işlemlerde
- [ ] HTTPS zorunlu (Vercel otomatik)
- [ ] Cookie'ler httpOnly, secure, sameSite
- [ ] Dependency audit (`pnpm audit`)

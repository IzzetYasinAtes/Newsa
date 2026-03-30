# Next.js Advanced Routing & Server Actions

## Route Handlers (API Routes)

### Temel Yapı
```typescript
// app/api/v1/articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@newsa/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 20

  const { data, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  return NextResponse.json({
    data,
    meta: { total: count, page, limit }
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const body = await request.json()
  const { data, error } = await supabase.from('articles').insert(body).select().single()

  if (error) {
    return NextResponse.json({ error: { code: 'INSERT_FAILED', message: error.message } }, { status: 400 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
```

### Dinamik Route Handler
```typescript
// app/api/v1/articles/[slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:profiles(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Article not found' } }, { status: 404 })
  }
  return NextResponse.json({ data })
}
```

### CORS (API Projesi İçin)
```typescript
// app/api/v1/articles/route.ts
const ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS?.split(',') || []

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const data = await getArticles()

  const response = NextResponse.json({ data })
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  return response
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const response = new NextResponse(null, { status: 204 })
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  return response
}
```

## Server Actions

### Dosya Konvansiyonu
```typescript
// lib/actions/article.ts
'use server'

import { createServerClient } from '@newsa/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArticle(formData: FormData): Promise<void> {
  const supabase = await createServerClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const { error } = await supabase.from('articles').insert({
    title,
    content,
    slug: generateSlug(title),
    status: 'draft',
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/haberler')
  redirect('/admin/haberler')
}

export async function publishArticle(id: string): Promise<void> {
  const supabase = await createServerClient()
  await supabase
    .from('articles')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin/haberler')
}
```

### Form ile Kullanım
```typescript
// Dosyadaki Server Action'ı import et
import { createArticle } from '@/lib/actions/article'

export default function NewArticlePage() {
  return (
    <form action={createArticle}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Kaydet</button>
    </form>
  )
}
```

### useActionState ile
```typescript
'use client'

import { useActionState } from 'react'
import { createArticle } from '@/lib/actions/article'

export function ArticleForm() {
  const [state, formAction, pending] = useActionState(createArticle, null)

  return (
    <form action={formAction}>
      <input name="title" required disabled={pending} />
      <button type="submit" disabled={pending}>
        {pending ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  )
}
```

## Error Handling

```typescript
// app/haber/[slug]/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <h2>Bir hata oluştu</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Tekrar Dene</button>
    </div>
  )
}
```

## Streaming ve Suspense

```typescript
// app/page.tsx (Anasayfa)
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div>
      {/* Hızlı yüklenen kısım */}
      <h1>Newsa</h1>

      {/* Yavaş veri - Suspense ile stream et */}
      <Suspense fallback={<ArticleListSkeleton />}>
        <LatestArticles />
      </Suspense>

      <Suspense fallback={<SidebarSkeleton />}>
        <MostReadArticles />
      </Suspense>
    </div>
  )
}

// Bu component async olduğu için Suspense ile sarılmalı
async function LatestArticles() {
  const articles = await getLatestArticles()
  return <ArticleList articles={articles} />
}
```

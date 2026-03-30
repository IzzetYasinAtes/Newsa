# Nevsa API - Dış İstemci API

## Amaç
Mobil uygulama ve üçüncü parti istemciler için RESTful API. Next.js Route Handlers kullanır.

## Teknik Kurallar
- **Versioning**: `/api/v1/` prefix
- **Auth**: JWT (Supabase tokens), public endpoint'ler auth gerektirmez
- **Format**: JSON response, standart hata formatı
- **Caching**: Cache-Control header'ları
- **CORS**: Yapılandırılmış origin'ler
- **Port**: 3002

## Endpoint Yapısı
```
src/app/api/
├── health/route.ts                    # Health check
└── v1/
    ├── articles/
    │   ├── route.ts                   # GET (list), POST (create)
    │   └── [slug]/
    │       ├── route.ts               # GET (detail)
    │       └── view/route.ts          # POST (increment view)
    ├── categories/route.ts            # GET (list)
    ├── tags/route.ts                  # GET (list)
    ├── search/route.ts                # GET (search)
    ├── featured/route.ts              # GET (featured articles)
    ├── breaking/route.ts              # GET (breaking news)
    ├── authors/[id]/route.ts          # GET (author profile)
    ├── auth/
    │   ├── login/route.ts             # POST
    │   └── refresh/route.ts           # POST
    └── revalidate/route.ts            # POST (webhook)
```

## Response Formatı
```typescript
// Başarılı
{ "data": T, "meta": { "total": number, "page": number, "limit": number } }

// Hata
{ "error": { "code": string, "message": string } }
```

## Bağımlılıklar
- `@newsa/shared` - Tipler ve utility'ler
- `@newsa/supabase` - Veri erişimi

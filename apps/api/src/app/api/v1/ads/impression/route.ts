import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

interface ImpressionBody {
  creative_id: string
  zone_id: string
  event_type: 'impression' | 'click'
}

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: { code: 'INVALID_JSON', message: 'Geçersiz JSON' } }, { status: 400 })
    }

    const { creative_id, zone_id, event_type } = body as Partial<ImpressionBody>

    if (!creative_id || !zone_id || !event_type) {
      return NextResponse.json(
        { error: { code: 'MISSING_FIELDS', message: 'creative_id, zone_id ve event_type zorunludur' } },
        { status: 400 }
      )
    }

    if (event_type !== 'impression' && event_type !== 'click') {
      return NextResponse.json(
        { error: { code: 'INVALID_EVENT', message: "event_type 'impression' veya 'click' olmalıdır" } },
        { status: 400 }
      )
    }

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') ?? 'unknown')
    const ip_hash = await hashIp(ip)
    const user_agent = request.headers.get('user-agent') ?? null

    // Use untyped client to avoid cross-package generic type resolution issues
    // All runtime types are validated above
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const { error } = await supabase.from('ad_impressions').insert({
      creative_id,
      zone_id,
      event_type,
      ip_hash,
      user_agent,
    })

    if (error) {
      console.error('Ad impression insert error:', error)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Kayıt edilemedi' } },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: { success: true } }, { status: 201 })
  } catch (err) {
    console.error('Ad impression error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Sunucu hatası' } },
      { status: 500 }
    )
  }
}

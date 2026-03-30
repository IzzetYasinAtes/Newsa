'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'

interface AdCreative {
  id: string
  zone_id: string
  title: string
  type: 'image' | 'html' | 'text'
  image_url: string | null
  html_content: string | null
  target_url: string
}

interface AdZoneProps {
  zone: string
  className?: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

export function AdZone({ zone, className }: AdZoneProps) {
  const [creative, setCreative] = useState<AdCreative | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

    async function loadAd() {
      const { data: zoneData } = await supabase
        .from('ad_zones')
        .select('id')
        .eq('name', zone)
        .eq('is_active', true)
        .single()

      if (!zoneData) return

      const { data: creativeData } = await supabase
        .from('ad_creatives')
        .select('id, zone_id, title, type, image_url, html_content, target_url')
        .eq('zone_id', zoneData.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (creativeData) {
        setCreative(creativeData as AdCreative)
      }
    }

    loadAd().catch(console.error)
  }, [zone])

  // Impression tracking
  useEffect(() => {
    if (!creative || loaded) return
    setLoaded(true)

    void fetch(`${apiUrl}/api/v1/ads/impression`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creative_id: creative.id,
        zone_id: creative.zone_id,
        event_type: 'impression',
      }),
    }).catch(() => {
      // fire-and-forget — hata önemsiz
    })
  }, [creative, loaded])

  function handleClick() {
    if (!creative) return

    void fetch(`${apiUrl}/api/v1/ads/impression`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creative_id: creative.id,
        zone_id: creative.zone_id,
        event_type: 'click',
      }),
    }).catch(() => {
      // fire-and-forget
    })
  }

  if (!creative) return null

  return (
    <div className={className} aria-label={`Reklam: ${creative.title}`}>
      {creative.type === 'image' && creative.image_url && (
        <a
          href={creative.target_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="block"
        >
          <Image
            src={creative.image_url}
            alt={creative.title}
            width={728}
            height={90}
            className="h-auto w-full rounded"
            unoptimized
          />
        </a>
      )}

      {creative.type === 'html' && creative.html_content && (
        <div onClick={handleClick} className="block cursor-pointer">
          <iframe
            srcDoc={creative.html_content}
            sandbox="allow-scripts allow-popups"
            style={{ border: 'none', width: '100%', height: '100%' }}
            title={`Reklam: ${creative.title}`}
          />
        </div>
      )}

      {creative.type === 'text' && (
        <a
          href={creative.target_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="block rounded border bg-muted p-3 text-sm hover:bg-muted/80"
        >
          {creative.title}
        </a>
      )}
    </div>
  )
}

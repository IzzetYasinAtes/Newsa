import { createClient } from '@/lib/supabase-server'
import AyarlarClient from './AyarlarClient'

interface Setting {
  key: string
  value: string | null
}

const SETTING_KEYS = [
  'site_name',
  'site_description',
  'site_logo',
  'social_twitter',
  'social_facebook',
  'social_instagram',
  'seo_default_title',
  'seo_default_description',
]

export default async function AyarlarPage() {
  let initialSettings: Record<string, string> = {}

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', SETTING_KEYS)

    for (const item of (data as Setting[]) ?? []) {
      initialSettings[item.key] = item.value ?? ''
    }
  } catch {
    /* Supabase not configured yet */
  }

  return <AyarlarClient initialSettings={initialSettings} />
}

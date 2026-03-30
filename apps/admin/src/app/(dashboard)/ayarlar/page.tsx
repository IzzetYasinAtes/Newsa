'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { PageHeader } from '@/components/PageHeader'

interface Setting {
  key: string
  value: string | null
}

type SettingsMap = Record<string, string>

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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

const settingLabels: Record<string, string> = {
  site_name: 'Site Adı',
  site_description: 'Site Açıklaması',
  site_logo: 'Logo URL',
  social_twitter: 'Twitter / X',
  social_facebook: 'Facebook',
  social_instagram: 'Instagram',
  seo_default_title: 'Varsayılan SEO Başlığı',
  seo_default_description: 'Varsayılan SEO Açıklaması',
}

const settingPlaceholders: Record<string, string> = {
  site_name: 'Newsa',
  site_description: 'Güncel haberler için Newsa',
  site_logo: 'https://...',
  social_twitter: '@newsa',
  social_facebook: 'https://facebook.com/newsa',
  social_instagram: '@newsa',
  seo_default_title: 'Newsa - Güncel Haberler',
  seo_default_description: 'Türkiye ve dünyadan son dakika haberleri',
}

const textareaKeys = new Set(['site_description', 'seo_default_description'])

export default function AyarlarPage() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', SETTING_KEYS)

      const map: SettingsMap = {}
      for (const item of (data as Setting[]) ?? []) {
        map[item.key] = item.value ?? ''
      }
      setSettings(map)
      setLoading(false)
    }
    load()
  }, [])

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const upserts = SETTING_KEYS.map((key) => ({
      key,
      value: settings[key] ?? '',
    }))

    const { error } = await supabase
      .from('settings')
      .upsert(upserts, { onConflict: 'key' })

    if (error) {
      setMessage({ type: 'error', text: 'Kaydedilemedi: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Ayarlar kaydedildi' })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Ayarlar" />
        <p className="py-8 text-center text-sm text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  const groups = [
    {
      title: 'Site Bilgileri',
      keys: ['site_name', 'site_description', 'site_logo'],
    },
    {
      title: 'Sosyal Medya',
      keys: ['social_twitter', 'social_facebook', 'social_instagram'],
    },
    {
      title: 'SEO Varsayılanları',
      keys: ['seo_default_title', 'seo_default_description'],
    },
  ]

  return (
    <div>
      <PageHeader title="Site Ayarları" description="Genel site yapılandırması" />

      {message && (
        <div className={`mb-4 rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title} className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold">{group.title}</h2>
            <div className="space-y-4">
              {group.keys.map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium">{settingLabels[key]}</label>
                  {textareaKeys.has(key) ? (
                    <textarea
                      value={settings[key] ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={settingPlaceholders[key]}
                      rows={3}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[key] ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={settingPlaceholders[key]}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}

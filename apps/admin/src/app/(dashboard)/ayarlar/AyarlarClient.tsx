'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { PageHeader } from '@/components/PageHeader'

type SettingsMap = Record<string, string>

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
  site_name: 'Site Adi',
  site_description: 'Site Aciklamasi',
  site_logo: 'Logo URL',
  social_twitter: 'Twitter / X',
  social_facebook: 'Facebook',
  social_instagram: 'Instagram',
  seo_default_title: 'Varsayilan SEO Basligi',
  seo_default_description: 'Varsayilan SEO Aciklamasi',
}

const settingPlaceholders: Record<string, string> = {
  site_name: 'Newsa',
  site_description: 'Guncel haberler icin Newsa',
  site_logo: 'https://...',
  social_twitter: '@newsa',
  social_facebook: 'https://facebook.com/newsa',
  social_instagram: '@newsa',
  seo_default_title: 'Newsa - Guncel Haberler',
  seo_default_description: 'Turkiye ve dunyadan son dakika haberleri',
}

const textareaKeys = new Set(['site_description', 'seo_default_description'])

interface AyarlarClientProps {
  initialSettings: SettingsMap
}

export default function AyarlarClient({ initialSettings }: AyarlarClientProps) {
  const [settings, setSettings] = useState<SettingsMap>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = getSupabaseBrowserClient()

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
      title: 'SEO Varsayilanlari',
      keys: ['seo_default_title', 'seo_default_description'],
    },
  ]

  return (
    <div>
      <PageHeader title="Site Ayarlari" description="Genel site yapilandirmasi" />

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
            {saving ? 'Kaydediliyor...' : 'Ayarlari Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}

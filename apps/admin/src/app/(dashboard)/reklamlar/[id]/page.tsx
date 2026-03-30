import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getCampaignStats } from '@/app/actions/ads'
import { CreativeToggle } from './_components/CreativeToggle'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Taslak',
  active: 'Aktif',
  paused: 'Duraklatıldı',
  completed: 'Tamamlandı',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

interface CreativeRow {
  id: string
  title: string
  type: string
  target_url: string
  is_active: boolean
  created_at: string
  zone: { name: string; display_name: string } | null
}

interface CampaignRow {
  id: string
  name: string
  advertiser_name: string
  start_date: string
  end_date: string | null
  budget: number | null
  status: string
  created_at: string
}

async function getCampaign(id: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_campaigns')
      .select('id, name, advertiser_name, start_date, end_date, budget, status, created_at')
      .eq('id', id)
      .single()
    return data as CampaignRow | null
  } catch {
    return null
  }
}

async function getCreatives(campaignId: string): Promise<CreativeRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_creatives')
      .select(`
        id, title, type, target_url, is_active, created_at,
        zone:ad_zones!zone_id(name, display_name)
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })

    if (!data) return []

    return data.map((item) => ({
      ...item,
      zone: Array.isArray(item.zone) ? (item.zone[0] ?? null) : (item.zone as CreativeRow['zone']),
    }))
  } catch {
    return []
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function KampanyaDetayPage({ params }: PageProps) {
  const { id } = await params
  const [campaign, creatives, stats] = await Promise.all([
    getCampaign(id),
    getCreatives(id),
    getCampaignStats(id),
  ])

  if (!campaign) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Reklamcı: {campaign.advertiser_name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/reklamlar/${id}/creative/yeni`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Creative Ekle
          </Link>
          <Link
            href="/reklamlar"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Geri
          </Link>
        </div>
      </div>

      {/* Kampanya Bilgileri */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs text-muted-foreground">Durum</div>
          <div className="mt-1">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[campaign.status] ?? STATUS_COLORS.draft}`}
            >
              {STATUS_LABELS[campaign.status] ?? campaign.status}
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs text-muted-foreground">Başlangıç</div>
          <div className="mt-1 text-sm font-medium">{formatDate(campaign.start_date)}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs text-muted-foreground">Bitiş</div>
          <div className="mt-1 text-sm font-medium">
            {campaign.end_date ? formatDate(campaign.end_date) : '—'}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs text-muted-foreground">Bütçe</div>
          <div className="mt-1 text-sm font-medium">
            {campaign.budget != null
              ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(campaign.budget)
              : '—'}
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Performans Raporu</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.impressions.toLocaleString('tr-TR')}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Toplam Görüntüleme</div>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.clicks.toLocaleString('tr-TR')}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Toplam Tıklama</div>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.ctr}%</div>
            <div className="mt-1 text-xs text-muted-foreground">CTR Oranı</div>
          </div>
        </div>
      </div>

      {/* Creatives Listesi */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Reklam Kreatifleri ({creatives.length})</h2>
        {creatives.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Henüz creative eklenmemiş.{' '}
            <Link href={`/reklamlar/${id}/creative/yeni`} className="text-primary underline">
              Creative ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Zone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tip</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hedef URL</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                </tr>
              </thead>
              <tbody>
                {creatives.map((creative) => (
                  <tr key={creative.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{creative.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {creative.zone?.display_name ?? creative.zone?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                        {creative.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                      <a
                        href={creative.target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        {creative.target_url}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <CreativeToggle
                        creativeId={creative.id}
                        campaignId={id}
                        isActive={creative.is_active}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

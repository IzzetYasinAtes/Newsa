import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

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

async function getCampaigns(): Promise<CampaignRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_campaigns')
      .select('id, name, advertiser_name, start_date, end_date, budget, status, created_at')
      .order('created_at', { ascending: false })

    return (data ?? []) as CampaignRow[]
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

export default async function ReklamlarPage() {
  const campaigns = await getCampaigns()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reklam Yönetimi</h1>
          <p className="mt-1 text-sm text-muted-foreground">{campaigns.length} kampanya</p>
        </div>
        <Link
          href="/reklamlar/yeni"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Yeni Kampanya
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
          Henüz kampanya oluşturulmamış.{' '}
          <Link href="/reklamlar/yeni" className="text-primary underline">
            İlk kampanyayı oluştur
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kampanya</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reklamcı</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlangıç</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bitiş</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bütçe</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{campaign.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{campaign.advertiser_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(campaign.start_date)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {campaign.end_date ? formatDate(campaign.end_date) : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {campaign.budget != null
                      ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(campaign.budget)
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[campaign.status] ?? STATUS_COLORS.draft}`}
                    >
                      {STATUS_LABELS[campaign.status] ?? campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/reklamlar/${campaign.id}`}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                      >
                        Detay
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

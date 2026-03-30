import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { CreativeForm } from './_components/CreativeForm'

interface AdZone {
  id: string
  name: string
  display_name: string
  width: number | null
  height: number | null
}

async function getCampaignName(id: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_campaigns')
      .select('name')
      .eq('id', id)
      .single()
    return data?.name ?? null
  } catch {
    return null
  }
}

async function getAdZones(): Promise<AdZone[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_zones')
      .select('id, name, display_name, width, height')
      .eq('is_active', true)
      .order('display_name')
    return (data ?? []) as AdZone[]
  } catch {
    return []
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CreativeYeniPage({ params }: PageProps) {
  const { id } = await params
  const [campaignName, zones] = await Promise.all([getCampaignName(id), getAdZones()])

  if (!campaignName) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Creative Ekle</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kampanya: {campaignName}</p>
      </div>
      <CreativeForm campaignId={id} zones={zones} />
    </div>
  )
}

'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { createCampaignSchema, updateCampaignSchema, createCreativeSchema, updateCreativeSchema } from '@newsa/shared'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return { supabase, user }
}

// ─── Kampanya ────────────────────────────────────────────────────────────────

export interface CreateCampaignData {
  name: string
  advertiser_name: string
  start_date: string
  end_date?: string | null
  budget?: number | null
  status?: 'draft' | 'active' | 'paused' | 'completed'
}

export async function createCampaign(
  data: CreateCampaignData
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const parsed = createCampaignSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0]?.message ?? 'Geçersiz veri' }
    }

    const { supabase, user } = await getAuthenticatedUser()

    const { data: campaign, error } = await supabase
      .from('ad_campaigns')
      .insert({
        name: data.name,
        advertiser_name: data.advertiser_name,
        start_date: data.start_date,
        end_date: data.end_date ?? null,
        budget: data.budget ?? null,
        status: data.status ?? 'draft',
        created_by: user.id,
      })
      .select('id')
      .single()

    if (error) throw error

    revalidatePath('/reklamlar')
    return { success: true, message: 'Kampanya oluşturuldu', id: campaign.id }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Bilinmeyen hata' }
  }
}

export async function updateCampaign(
  id: string,
  data: Partial<CreateCampaignData>
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = updateCampaignSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0]?.message ?? 'Geçersiz veri' }
    }

    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('ad_campaigns')
      .update(parsed.data)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/reklamlar')
    revalidatePath(`/reklamlar/${id}`)
    return { success: true, message: 'Kampanya güncellendi' }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Bilinmeyen hata' }
  }
}

export async function deleteCampaign(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('ad_campaigns')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/reklamlar')
    return { success: true, message: 'Kampanya silindi' }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Bilinmeyen hata' }
  }
}

// ─── Creative ─────────────────────────────────────────────────────────────────

export interface CreateCreativeData {
  campaign_id: string
  zone_id: string
  title: string
  type: 'image' | 'html' | 'text'
  image_url?: string | null
  html_content?: string | null
  target_url: string
  is_active?: boolean
}

export async function createCreative(
  data: CreateCreativeData
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const parsed = createCreativeSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0]?.message ?? 'Geçersiz veri' }
    }

    const { supabase } = await getAuthenticatedUser()

    const { data: creative, error } = await supabase
      .from('ad_creatives')
      .insert({
        campaign_id: data.campaign_id,
        zone_id: data.zone_id,
        title: data.title,
        type: data.type,
        image_url: data.image_url ?? null,
        html_content: data.html_content ?? null,
        target_url: data.target_url,
        is_active: data.is_active ?? true,
      })
      .select('id')
      .single()

    if (error) throw error

    revalidatePath(`/reklamlar/${data.campaign_id}`)
    return { success: true, message: 'Creative oluşturuldu', id: creative.id }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Bilinmeyen hata' }
  }
}

export async function updateCreative(
  id: string,
  data: Partial<CreateCreativeData>
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = updateCreativeSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, message: parsed.error.errors[0]?.message ?? 'Geçersiz veri' }
    }

    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('ad_creatives')
      .update(parsed.data)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/reklamlar')
    return { success: true, message: 'Creative güncellendi' }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Bilinmeyen hata' }
  }
}

export async function toggleCreative(
  id: string,
  campaignId: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('ad_creatives')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) throw error

    revalidatePath(`/reklamlar/${campaignId}`)
    return { success: true, message: isActive ? 'Creative aktif edildi' : 'Creative pasif edildi' }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Bilinmeyen hata' }
  }
}

// ─── İstatistikler ────────────────────────────────────────────────────────────

export interface CampaignStats {
  impressions: number
  clicks: number
  ctr: number
}

export async function getCampaignStats(campaignId: string): Promise<CampaignStats> {
  try {
    const { supabase } = await getAuthenticatedUser()

    // creative ID'lerini al
    const { data: creatives } = await supabase
      .from('ad_creatives')
      .select('id')
      .eq('campaign_id', campaignId)

    if (!creatives || creatives.length === 0) {
      return { impressions: 0, clicks: 0, ctr: 0 }
    }

    const creativeIds = creatives.map((c) => c.id)

    const { data: impressionData } = await supabase
      .from('ad_impressions')
      .select('event_type')
      .in('creative_id', creativeIds)

    const impressions = impressionData?.filter((i) => i.event_type === 'impression').length ?? 0
    const clicks = impressionData?.filter((i) => i.event_type === 'click').length ?? 0
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0

    return { impressions, clicks, ctr }
  } catch {
    return { impressions: 0, clicks: 0, ctr: 0 }
  }
}

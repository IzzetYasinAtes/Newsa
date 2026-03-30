import { CampaignForm } from '../_components/CampaignForm'

export default function YeniKampanyaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Yeni Kampanya</h1>
        <p className="mt-1 text-sm text-muted-foreground">Yeni bir reklam kampanyası oluşturun</p>
      </div>
      <CampaignForm />
    </div>
  )
}

-- Reklam Zonları (Ad Zones) — sayfadaki reklam alanlarını tanımlar
CREATE TABLE ad_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'header', 'sidebar', 'in-article', 'footer'
  display_name TEXT NOT NULL,
  description TEXT,
  width INTEGER,
  height INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reklam Kampanyaları
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  advertiser_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','completed')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reklam Kreatifleri (Ad Creatives)
CREATE TABLE ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES ad_zones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image','html','text')),
  image_url TEXT,
  html_content TEXT,
  target_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- İmpresyon ve Tıklama Takibi
CREATE TABLE ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creative_id UUID NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES ad_zones(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression','click')),
  user_agent TEXT,
  ip_hash TEXT, -- hashed for privacy
  created_at TIMESTAMPTZ DEFAULT now()
);

-- İndeksler
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_ad_creatives_campaign ON ad_creatives(campaign_id);
CREATE INDEX idx_ad_creatives_zone ON ad_creatives(zone_id);
CREATE INDEX idx_ad_impressions_creative ON ad_impressions(creative_id);
CREATE INDEX idx_ad_impressions_created ON ad_impressions(created_at);

-- RLS
ALTER TABLE ad_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read zones" ON ad_zones FOR SELECT USING (true);
CREATE POLICY "Admin manage zones" ON ad_zones FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read active campaigns" ON ad_campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Admin manage campaigns" ON ad_campaigns FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read active creatives" ON ad_creatives FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage creatives" ON ad_creatives FOR ALL TO authenticated USING (true);

CREATE POLICY "Anyone insert impression" ON ad_impressions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read impressions" ON ad_impressions FOR SELECT TO authenticated USING (true);

-- Seed: Temel Ad Zones
INSERT INTO ad_zones (name, display_name, description, width, height) VALUES
  ('header-banner', 'Header Banner', 'Sayfa üstü tam genişlik banner', 728, 90),
  ('sidebar-rectangle', 'Sidebar Dikdörtgen', 'Sağ kenar çubuğu reklamı', 300, 250),
  ('in-article', 'Makale İçi', 'Haber içine gömülü reklam', 300, 250),
  ('footer-banner', 'Footer Banner', 'Sayfa altı banner', 728, 90);

-- updated_at trigger for ad_campaigns
CREATE TRIGGER ad_campaigns_updated_at
  BEFORE UPDATE ON ad_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

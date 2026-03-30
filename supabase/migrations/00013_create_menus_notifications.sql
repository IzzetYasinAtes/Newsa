-- ============================================================
-- Menus & Menu Items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.menus (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  location     TEXT NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id    UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  url        TEXT NOT NULL,
  link_type  TEXT NOT NULL DEFAULT 'custom' CHECK (link_type IN ('custom', 'category', 'tag', 'page')),
  entity_id  UUID,
  target     TEXT NOT NULL DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
  is_active  BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id   ON public.menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON public.menu_items(parent_id);

-- ============================================================
-- Notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  entity_type TEXT,
  entity_id   UUID,
  action_url  TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id  ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read  ON public.notifications(user_id, is_read);

-- ============================================================
-- Pages (Statik Sayfalar)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  content         JSONB,
  content_html    TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  seo_title       TEXT,
  seo_description TEXT,
  created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug   ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);

-- ============================================================
-- Redirects (URL Yönlendirmeleri)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.redirects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path TEXT NOT NULL UNIQUE,
  target_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  hit_count   INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_redirects_source_path ON public.redirects(source_path);
CREATE INDEX IF NOT EXISTS idx_redirects_is_active   ON public.redirects(is_active);

-- ============================================================
-- updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_generic_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS menus_updated_at ON public.menus;
CREATE TRIGGER menus_updated_at
  BEFORE UPDATE ON public.menus
  FOR EACH ROW EXECUTE FUNCTION public.update_generic_updated_at();

DROP TRIGGER IF EXISTS menu_items_updated_at ON public.menu_items;
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_generic_updated_at();

DROP TRIGGER IF EXISTS pages_updated_at ON public.pages;
CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_generic_updated_at();

DROP TRIGGER IF EXISTS redirects_updated_at ON public.redirects;
CREATE TRIGGER redirects_updated_at
  BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.update_generic_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.menus         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects     ENABLE ROW LEVEL SECURITY;

-- menus: herkes okuyabilir
CREATE POLICY "menus_select_all" ON public.menus FOR SELECT USING (true);
CREATE POLICY "menus_admin_write" ON public.menus FOR ALL USING (
  public.has_permission(auth.uid(), 'menus.manage')
);

-- menu_items: herkes okuyabilir
CREATE POLICY "menu_items_select_all" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_admin_write" ON public.menu_items FOR ALL USING (
  public.has_permission(auth.uid(), 'menus.manage')
);

-- notifications: kullanıcı sadece kendi bildirimlerini görebilir
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- pages: yayınlananları herkes görebilir, adminler tümünü yönetir
CREATE POLICY "pages_select_published" ON public.pages
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);
CREATE POLICY "pages_write" ON public.pages
  FOR ALL USING (public.has_permission(auth.uid(), 'pages.edit'));

-- redirects: adminler yönetir
CREATE POLICY "redirects_select_active" ON public.redirects
  FOR SELECT USING (true);
CREATE POLICY "redirects_admin_write" ON public.redirects
  FOR ALL USING (public.has_permission(auth.uid(), 'redirects.manage'));

-- ============================================================
-- Seed: Varsayılan Menüler
-- ============================================================
INSERT INTO public.menus (name, display_name, location) VALUES
  ('header_main',  'Ana Menü',    'header'),
  ('footer_links', 'Alt Menü',    'footer')
ON CONFLICT (name) DO NOTHING;

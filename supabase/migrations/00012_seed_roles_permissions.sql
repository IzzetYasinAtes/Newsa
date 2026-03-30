-- ============================================================
-- Seed: Sistem Rolleri
-- ============================================================
INSERT INTO public.roles (name, display_name, description, is_system, hierarchy_level) VALUES
  ('super_admin',     'Süper Admin',          'Sistemin tam kontrolüne sahip kök yönetici', true, 100),
  ('admin',           'Admin',                'Tüm yönetim işlemlerini yapabilir',          true,  90),
  ('editor_in_chief', 'Genel Yayın Yönetmeni','Editöryal sürecin sorumlusu',               true,  80),
  ('editor',          'Editör',               'Haber düzenleme ve yayınlama yetkisi',       true,  60),
  ('reviewer',        'Yorumcu/İnceleyici',   'Haberleri inceleyip onaylayabilir',          true,  50),
  ('author',          'Yazar',                'Kendi haberlerini yazabilir',                true,  40),
  ('media_manager',   'Medya Yöneticisi',     'Medya kütüphanesini yönetir',               true,  30),
  ('seo_manager',     'SEO Yöneticisi',       'SEO alanlarını düzenleyebilir',             true,  30),
  ('ads_manager',     'Reklam Yöneticisi',    'Reklam bölgelerini ve kampanyaları yönetir',true,  30),
  ('support',         'Destek',               'Temel görüntüleme ve destek yetkisi',        true,  10)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Seed: Permissions
-- ============================================================
INSERT INTO public.permissions (name, display_name, module) VALUES
  -- articles modülü
  ('articles.create',          'Haber Oluştur',            'articles'),
  ('articles.edit_own',        'Kendi Haberini Düzenle',   'articles'),
  ('articles.edit_any',        'Her Haberi Düzenle',       'articles'),
  ('articles.delete_own',      'Kendi Haberini Sil',       'articles'),
  ('articles.delete_any',      'Her Haberi Sil',           'articles'),
  ('articles.publish',         'Haber Yayınla',            'articles'),
  ('articles.unpublish',       'Yayından Kaldır',          'articles'),
  ('articles.archive',         'Haberi Arşivle',           'articles'),
  ('articles.submit_review',   'İncelemeye Gönder',        'articles'),
  ('articles.approve_review',  'İncelemeyi Onayla',        'articles'),
  ('articles.reject_review',   'İncelemeyi Reddet',        'articles'),
  ('articles.feature',         'Öne Çıkar',                'articles'),
  ('articles.breaking',        'Son Dakika İşaretle',      'articles'),
  ('articles.schedule',        'Planlı Yayın',             'articles'),
  ('articles.view_drafts',     'Taslakları Gör',           'articles'),
  ('articles.edit_seo',        'SEO Düzenle',              'articles'),
  ('articles.restore',         'Haberi Geri Yükle',        'articles'),

  -- categories modülü
  ('categories.view',   'Kategorileri Gör',    'categories'),
  ('categories.create', 'Kategori Oluştur',    'categories'),
  ('categories.edit',   'Kategori Düzenle',    'categories'),
  ('categories.delete', 'Kategori Sil',        'categories'),

  -- tags modülü
  ('tags.view',   'Etiketleri Gör',    'tags'),
  ('tags.create', 'Etiket Oluştur',    'tags'),
  ('tags.edit',   'Etiket Düzenle',    'tags'),
  ('tags.delete', 'Etiket Sil',        'tags'),

  -- media modülü
  ('media.view',           'Medya Gör',              'media'),
  ('media.upload',         'Medya Yükle',            'media'),
  ('media.edit',           'Medya Düzenle',          'media'),
  ('media.delete_own',     'Kendi Medyasını Sil',    'media'),
  ('media.delete_any',     'Her Medyayı Sil',        'media'),
  ('media.manage_folders', 'Klasörleri Yönet',       'media'),

  -- users modülü
  ('users.view',       'Kullanıcıları Gör',       'users'),
  ('users.create',     'Kullanıcı Oluştur',       'users'),
  ('users.edit',       'Kullanıcı Düzenle',       'users'),
  ('users.deactivate', 'Kullanıcı Deaktive Et',   'users'),
  ('users.delete',     'Kullanıcı Sil',           'users'),

  -- roles modülü
  ('roles.view',   'Rolleri Gör',    'roles'),
  ('roles.manage', 'Rolleri Yönet',  'roles'),
  ('roles.assign', 'Rol Ata',        'roles'),

  -- settings modülü
  ('settings.view',   'Ayarları Gör',    'settings'),
  ('settings.manage', 'Ayarları Yönet',  'settings'),

  -- ads modülü
  ('ads.view',              'Reklamları Gör',           'ads'),
  ('ads.manage_zones',      'Reklam Bölgelerini Yönet', 'ads'),
  ('ads.manage_campaigns',  'Kampanyaları Yönet',       'ads'),
  ('ads.manage_creatives',  'Görsel Öğeleri Yönet',     'ads'),
  ('ads.view_reports',      'Reklam Raporları Gör',     'ads'),

  -- menus modülü
  ('menus.view',   'Menüleri Gör',    'menus'),
  ('menus.manage', 'Menüleri Yönet',  'menus'),

  -- audit modülü
  ('audit.view', 'Denetim Kayıtlarını Gör', 'audit'),

  -- analytics modülü
  ('analytics.view',   'Analitik Gör',    'analytics'),
  ('analytics.export', 'Analitik Dışa Aktar', 'analytics'),

  -- pages modülü
  ('pages.create', 'Sayfa Oluştur', 'pages'),
  ('pages.edit',   'Sayfa Düzenle', 'pages'),
  ('pages.delete', 'Sayfa Sil',     'pages'),

  -- redirects modülü
  ('redirects.manage', 'Yönlendirmeleri Yönet', 'redirects'),

  -- trash modülü
  ('trash.view',    'Çöp Kutusunu Gör',       'trash'),
  ('trash.restore', 'Çöp Kutusundan Geri Yükle', 'trash'),
  ('trash.purge',   'Kalıcı Olarak Sil',      'trash')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Seed: Role - Permission Mappings
-- ============================================================
-- super_admin has_permission() fonksiyonunda daima true döndürür, ayrıca kayıt gerekmez.

-- admin: neredeyse her şey (sadece super_admin rolünü yönetemez)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin'
  AND p.name NOT IN (
    -- admin bazı hassas işlemleri yapamaz
    'roles.manage' -- super_admin kısıtlaması için ayrılabilir; şimdilik ekleyelim
  )
ON CONFLICT DO NOTHING;

-- editor_in_chief
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'editor_in_chief'
  AND p.name IN (
    'articles.create','articles.edit_own','articles.edit_any',
    'articles.delete_own','articles.delete_any',
    'articles.publish','articles.unpublish','articles.archive',
    'articles.submit_review','articles.approve_review','articles.reject_review',
    'articles.feature','articles.breaking','articles.schedule',
    'articles.view_drafts','articles.edit_seo','articles.restore',
    'categories.view','categories.create','categories.edit',
    'tags.view','tags.create','tags.edit',
    'media.view','media.upload','media.edit','media.delete_own','media.delete_any','media.manage_folders',
    'users.view',
    'analytics.view','analytics.export',
    'audit.view',
    'menus.view','menus.manage',
    'pages.create','pages.edit','pages.delete',
    'trash.view','trash.restore'
  )
ON CONFLICT DO NOTHING;

-- editor
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'editor'
  AND p.name IN (
    'articles.create','articles.edit_own','articles.edit_any',
    'articles.delete_own',
    'articles.publish','articles.unpublish','articles.archive',
    'articles.submit_review','articles.approve_review','articles.reject_review',
    'articles.feature','articles.breaking','articles.schedule',
    'articles.view_drafts','articles.edit_seo',
    'categories.view','categories.create','categories.edit',
    'tags.view','tags.create','tags.edit',
    'media.view','media.upload','media.edit','media.delete_own',
    'analytics.view',
    'trash.view','trash.restore'
  )
ON CONFLICT DO NOTHING;

-- reviewer
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'reviewer'
  AND p.name IN (
    'articles.view_drafts','articles.submit_review','articles.approve_review','articles.reject_review',
    'articles.edit_own',
    'categories.view','tags.view',
    'media.view','media.upload',
    'analytics.view'
  )
ON CONFLICT DO NOTHING;

-- author
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'author'
  AND p.name IN (
    'articles.create','articles.edit_own','articles.delete_own',
    'articles.submit_review','articles.view_drafts',
    'categories.view','tags.view','tags.create',
    'media.view','media.upload','media.delete_own'
  )
ON CONFLICT DO NOTHING;

-- media_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'media_manager'
  AND p.name IN (
    'media.view','media.upload','media.edit','media.delete_own','media.delete_any','media.manage_folders',
    'categories.view','tags.view'
  )
ON CONFLICT DO NOTHING;

-- seo_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'seo_manager'
  AND p.name IN (
    'articles.edit_seo','articles.view_drafts',
    'categories.view','categories.edit',
    'tags.view',
    'pages.create','pages.edit',
    'redirects.manage',
    'analytics.view','analytics.export'
  )
ON CONFLICT DO NOTHING;

-- ads_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'ads_manager'
  AND p.name IN (
    'ads.view','ads.manage_zones','ads.manage_campaigns','ads.manage_creatives','ads.view_reports',
    'analytics.view'
  )
ON CONFLICT DO NOTHING;

-- support
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'support'
  AND p.name IN (
    'articles.view_drafts',
    'categories.view','tags.view',
    'media.view',
    'users.view',
    'analytics.view'
  )
ON CONFLICT DO NOTHING;

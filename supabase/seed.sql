-- Seed data: Test kullanıcıları Supabase Auth üzerinden oluşturulmalıdır.
-- Bu dosya, auth kullanıcıları oluşturulduktan sonra çalıştırılır.

-- Kategoriler
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Gündem', 'gundem', 'Güncel haberler ve gelişmeler', 1, true),
  ('a0000000-0000-0000-0000-000000000002', 'Ekonomi', 'ekonomi', 'Ekonomi ve finans haberleri', 2, true),
  ('a0000000-0000-0000-0000-000000000003', 'Teknoloji', 'teknoloji', 'Teknoloji dünyasından haberler', 3, true),
  ('a0000000-0000-0000-0000-000000000004', 'Spor', 'spor', 'Spor haberleri ve sonuçları', 4, true),
  ('a0000000-0000-0000-0000-000000000005', 'Kültür-Sanat', 'kultur-sanat', 'Kültür ve sanat haberleri', 5, true);

-- Etiketler
INSERT INTO public.tags (name, slug) VALUES
  ('Türkiye', 'turkiye'),
  ('Dünya', 'dunya'),
  ('Politika', 'politika'),
  ('Yapay Zeka', 'yapay-zeka'),
  ('Borsa', 'borsa'),
  ('Futbol', 'futbol'),
  ('Basketbol', 'basketbol'),
  ('Sinema', 'sinema'),
  ('Müzik', 'muzik'),
  ('Bilim', 'bilim');

-- Varsayılan site ayarları
INSERT INTO public.settings (key, value, description) VALUES
  ('site_name', '"Newsa"', 'Site adı'),
  ('site_description', '"Türkiye ve bölge odaklı modern dijital haber platformu"', 'Site açıklaması'),
  ('site_logo', '""', 'Site logosu URL'),
  ('social_twitter', '""', 'Twitter/X hesabı'),
  ('social_facebook', '""', 'Facebook sayfası'),
  ('social_instagram', '""', 'Instagram hesabı'),
  ('seo_default_title', '"Newsa - Haber Platformu"', 'Varsayılan SEO başlığı'),
  ('seo_default_description', '"Türkiye ve bölge odaklı modern dijital haber platformu"', 'Varsayılan SEO açıklaması'),
  ('articles_per_page', '20', 'Sayfa başına haber sayısı'),
  ('breaking_news_duration_hours', '4', 'Son dakika süresi (saat)');

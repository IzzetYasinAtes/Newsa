-- ============================================================
-- NEWSA - Kapsamlı Seed Data
-- ============================================================
-- Bu script Supabase MCP üzerinden çalıştırılmak üzere hazırlanmıştır.
-- Proje: tdglvoysqxulywlddtsm
-- Tarih: 2026-03-31
-- ============================================================

-- ============================================================
-- 0. Hazırlık: pgcrypto extension (crypt fonksiyonu için)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. AUTH USERS & PROFILES (8 kullanıcı)
-- ============================================================
-- Sabit UUID'ler kullanıyoruz, foreign key referansları için

-- Önce auth.users'a ekle (handle_new_user trigger otomatik profile oluşturur)
-- Trigger'ı geçici devre dışı bırak, her iki tabloya da manuel ekle
ALTER TABLE public.profiles DISABLE TRIGGER ALL;

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
VALUES
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'ahmet@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmet Yılmaz"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'zeynep@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Zeynep Kaya"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'mehmet@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Mehmet Demir"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'ayse@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Ayşe Çelik"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'fatma@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Fatma Şahin"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'ali@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Ali Öztürk"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'elif@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Elif Arslan"}', now(), now(), '', ''),
  ('b0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'burak@newsa.com', crypt('Test1234!', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{"full_name":"Burak Koç"}', now(), now(), '', '')
ON CONFLICT (id) DO NOTHING;

-- Profiles tablosuna ekle
INSERT INTO public.profiles (id, email, full_name, display_name, avatar_url, bio, role, is_active) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'ahmet@newsa.com', 'Ahmet Yılmaz', 'Ahmet Y.', 'https://i.pravatar.cc/150?u=ahmet', 'Newsa genel yayın yönetmeni. 15 yıllık gazetecilik deneyimi.', 'admin', true),
  ('b0000000-0000-0000-0000-000000000002', 'zeynep@newsa.com', 'Zeynep Kaya', 'Zeynep K.', 'https://i.pravatar.cc/150?u=zeynep', 'Ekonomi ve finans editörü. Bloomberg Türkiye eski muhabiri.', 'editor', true),
  ('b0000000-0000-0000-0000-000000000003', 'mehmet@newsa.com', 'Mehmet Demir', 'Mehmet D.', 'https://i.pravatar.cc/150?u=mehmet', 'Teknoloji ve bilim editörü. Yazılım mühendisliği mezunu.', 'editor', true),
  ('b0000000-0000-0000-0000-000000000004', 'ayse@newsa.com', 'Ayşe Çelik', 'Ayşe Ç.', 'https://i.pravatar.cc/150?u=ayse', 'Kültür-sanat ve yaşam yazarı. Sanat tarihi mezunu.', 'author', true),
  ('b0000000-0000-0000-0000-000000000005', 'fatma@newsa.com', 'Fatma Şahin', 'Fatma Ş.', 'https://i.pravatar.cc/150?u=fatma', 'Sağlık ve bilim muhabiri. Tıp fakültesi bırakıp gazeteci oldu.', 'author', true),
  ('b0000000-0000-0000-0000-000000000006', 'ali@newsa.com', 'Ali Öztürk', 'Ali Ö.', 'https://i.pravatar.cc/150?u=ali', 'Spor muhabiri. Eski futbolcu, şimdi kalemini sallıyor.', 'author', true),
  ('b0000000-0000-0000-0000-000000000007', 'elif@newsa.com', 'Elif Arslan', 'Elif A.', 'https://i.pravatar.cc/150?u=elif', 'Okur temsilcisi ve içerik moderatörü.', 'viewer', true),
  ('b0000000-0000-0000-0000-000000000008', 'burak@newsa.com', 'Burak Koç', 'Burak K.', 'https://i.pravatar.cc/150?u=burak', 'Dünya haberleri muhabiri. 3 dil biliyor, 12 ülke gezdi.', 'author', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  role = EXCLUDED.role;

-- Trigger'ı tekrar etkinleştir
ALTER TABLE public.profiles ENABLE TRIGGER ALL;

-- ============================================================
-- 2. CATEGORIES (12 kategori, hiyerarşik)
-- ============================================================
INSERT INTO public.categories (id, name, slug, description, parent_id, sort_order, is_active, seo_title, seo_description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Gündem', 'gundem', 'Güncel haberler ve son gelişmeler', NULL, 1, true, 'Gündem Haberleri | Newsa', 'Türkiye ve dünyadan en güncel haberler'),
  ('a0000000-0000-0000-0000-000000000002', 'Ekonomi', 'ekonomi', 'Ekonomi, finans ve iş dünyası haberleri', NULL, 2, true, 'Ekonomi Haberleri | Newsa', 'Borsa, döviz, kripto ve ekonomi haberleri'),
  ('a0000000-0000-0000-0000-000000000003', 'Teknoloji', 'teknoloji', 'Teknoloji dünyasından en son haberler', NULL, 3, true, 'Teknoloji Haberleri | Newsa', 'Yapay zeka, yazılım ve teknoloji haberleri'),
  ('a0000000-0000-0000-0000-000000000004', 'Spor', 'spor', 'Spor haberleri, maç sonuçları ve transferler', NULL, 4, true, 'Spor Haberleri | Newsa', 'Futbol, basketbol ve tüm spor dallarından haberler'),
  ('a0000000-0000-0000-0000-000000000005', 'Kültür-Sanat', 'kultur-sanat', 'Kültür, sanat ve yaşam haberleri', NULL, 5, true, 'Kültür Sanat | Newsa', 'Sinema, müzik, tiyatro ve sanat haberleri'),
  ('a0000000-0000-0000-0000-000000000006', 'Dünya', 'dunya', 'Uluslararası haberler ve dış politika', NULL, 6, true, 'Dünya Haberleri | Newsa', 'Dünyadan son dakika haberler'),
  ('a0000000-0000-0000-0000-000000000007', 'Sağlık', 'saglik', 'Sağlık, tıp ve yaşam kalitesi haberleri', NULL, 7, true, 'Sağlık Haberleri | Newsa', 'Sağlık, beslenme ve tıp haberleri'),
  ('a0000000-0000-0000-0000-000000000008', 'Bilim', 'bilim', 'Bilim, uzay ve araştırma haberleri', NULL, 8, true, 'Bilim Haberleri | Newsa', 'Uzay, fizik, biyoloji ve bilim haberleri'),
  -- Alt kategoriler
  ('a0000000-0000-0000-0000-000000000009', 'Borsa', 'borsa', 'Borsa haberleri ve analizler', 'a0000000-0000-0000-0000-000000000002', 1, true, 'Borsa Haberleri | Newsa', 'BIST, hisse senedi ve borsa analizleri'),
  ('a0000000-0000-0000-0000-000000000010', 'Kripto', 'kripto', 'Kripto para haberleri ve piyasa verileri', 'a0000000-0000-0000-0000-000000000002', 2, true, 'Kripto Haberleri | Newsa', 'Bitcoin, Ethereum ve kripto para haberleri'),
  ('a0000000-0000-0000-0000-000000000011', 'Yapay Zeka', 'yapay-zeka', 'Yapay zeka ve makine öğrenimi haberleri', 'a0000000-0000-0000-0000-000000000003', 1, true, 'Yapay Zeka Haberleri | Newsa', 'AI, ChatGPT ve yapay zeka gelişmeleri'),
  ('a0000000-0000-0000-0000-000000000012', 'Futbol', 'futbol', 'Futbol haberleri, transferler ve maç sonuçları', 'a0000000-0000-0000-0000-000000000004', 1, true, 'Futbol Haberleri | Newsa', 'Süper Lig, UEFA ve dünya futbol haberleri')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  sort_order = EXCLUDED.sort_order,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

-- ============================================================
-- 3. TAGS (20 etiket)
-- ============================================================
INSERT INTO public.tags (id, name, slug) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Son Dakika', 'son-dakika'),
  ('c0000000-0000-0000-0000-000000000002', 'Gündem', 'gundem'),
  ('c0000000-0000-0000-0000-000000000003', 'Ekonomi', 'ekonomi'),
  ('c0000000-0000-0000-0000-000000000004', 'Teknoloji', 'teknoloji'),
  ('c0000000-0000-0000-0000-000000000005', 'Spor', 'spor'),
  ('c0000000-0000-0000-0000-000000000006', 'Siyaset', 'siyaset'),
  ('c0000000-0000-0000-0000-000000000007', 'Dünya', 'dunya'),
  ('c0000000-0000-0000-0000-000000000008', 'Sağlık', 'saglik'),
  ('c0000000-0000-0000-0000-000000000009', 'Bilim', 'bilim'),
  ('c0000000-0000-0000-0000-000000000010', 'Eğitim', 'egitim'),
  ('c0000000-0000-0000-0000-000000000011', 'Çevre', 'cevre'),
  ('c0000000-0000-0000-0000-000000000012', 'Uzay', 'uzay'),
  ('c0000000-0000-0000-0000-000000000013', 'Yapay Zeka', 'yapay-zeka'),
  ('c0000000-0000-0000-0000-000000000014', 'Kripto', 'kripto'),
  ('c0000000-0000-0000-0000-000000000015', 'Futbol', 'futbol'),
  ('c0000000-0000-0000-0000-000000000016', 'Basketbol', 'basketbol'),
  ('c0000000-0000-0000-0000-000000000017', 'Sinema', 'sinema'),
  ('c0000000-0000-0000-0000-000000000018', 'Müzik', 'muzik'),
  ('c0000000-0000-0000-0000-000000000019', 'Yemek', 'yemek'),
  ('c0000000-0000-0000-0000-000000000020', 'Seyahat', 'seyahat')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 4. MEDIA (15 placeholder medya)
-- ============================================================
INSERT INTO public.media (id, file_name, original_name, file_path, file_url, file_size, mime_type, width, height, alt_text, caption, uploaded_by, folder) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'cover-01.jpg', 'haber-kapak-1.jpg', 'media/covers/cover-01.jpg', 'https://picsum.photos/seed/news1/1200/800', 245000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 1', 'Gündem haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000001', 'covers'),
  ('d0000000-0000-0000-0000-000000000002', 'cover-02.jpg', 'haber-kapak-2.jpg', 'media/covers/cover-02.jpg', 'https://picsum.photos/seed/news2/1200/800', 198000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 2', 'Ekonomi haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000002', 'covers'),
  ('d0000000-0000-0000-0000-000000000003', 'cover-03.jpg', 'haber-kapak-3.jpg', 'media/covers/cover-03.jpg', 'https://picsum.photos/seed/news3/1200/800', 312000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 3', 'Teknoloji haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000003', 'covers'),
  ('d0000000-0000-0000-0000-000000000004', 'cover-04.jpg', 'haber-kapak-4.jpg', 'media/covers/cover-04.jpg', 'https://picsum.photos/seed/news4/1200/800', 275000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 4', 'Spor haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000004', 'covers'),
  ('d0000000-0000-0000-0000-000000000005', 'cover-05.jpg', 'haber-kapak-5.jpg', 'media/covers/cover-05.jpg', 'https://picsum.photos/seed/news5/1200/800', 289000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 5', 'Kültür haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000005', 'covers'),
  ('d0000000-0000-0000-0000-000000000006', 'cover-06.jpg', 'haber-kapak-6.jpg', 'media/covers/cover-06.jpg', 'https://picsum.photos/seed/news6/1200/800', 234000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 6', 'Dünya haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000006', 'covers'),
  ('d0000000-0000-0000-0000-000000000007', 'cover-07.jpg', 'haber-kapak-7.jpg', 'media/covers/cover-07.jpg', 'https://picsum.photos/seed/news7/1200/800', 267000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 7', 'Bilim haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000001', 'covers'),
  ('d0000000-0000-0000-0000-000000000008', 'cover-08.jpg', 'haber-kapak-8.jpg', 'media/covers/cover-08.jpg', 'https://picsum.photos/seed/news8/1200/800', 301000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 8', 'Sağlık haberi kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000002', 'covers'),
  ('d0000000-0000-0000-0000-000000000009', 'gallery-01.jpg', 'galeri-1.jpg', 'media/gallery/gallery-01.jpg', 'https://picsum.photos/seed/gal1/800/600', 156000, 'image/jpeg', 800, 600, 'Galeri görseli 1', 'Fotoğraf galerisi', 'b0000000-0000-0000-0000-000000000003', 'gallery'),
  ('d0000000-0000-0000-0000-000000000010', 'gallery-02.jpg', 'galeri-2.jpg', 'media/gallery/gallery-02.jpg', 'https://picsum.photos/seed/gal2/800/600', 178000, 'image/jpeg', 800, 600, 'Galeri görseli 2', 'Fotoğraf galerisi', 'b0000000-0000-0000-0000-000000000004', 'gallery'),
  ('d0000000-0000-0000-0000-000000000011', 'gallery-03.jpg', 'galeri-3.jpg', 'media/gallery/gallery-03.jpg', 'https://picsum.photos/seed/gal3/800/600', 145000, 'image/jpeg', 800, 600, 'Galeri görseli 3', 'Fotoğraf galerisi', 'b0000000-0000-0000-0000-000000000005', 'gallery'),
  ('d0000000-0000-0000-0000-000000000012', 'gallery-04.jpg', 'galeri-4.jpg', 'media/gallery/gallery-04.jpg', 'https://picsum.photos/seed/gal4/800/600', 192000, 'image/jpeg', 800, 600, 'Galeri görseli 4', 'Fotoğraf galerisi', 'b0000000-0000-0000-0000-000000000006', 'gallery'),
  ('d0000000-0000-0000-0000-000000000013', 'ad-01.jpg', 'reklam-1.jpg', 'media/ads/ad-01.jpg', 'https://picsum.photos/seed/ad1/300/250', 45000, 'image/jpeg', 300, 250, 'Reklam görseli 1', 'Banner reklam', 'b0000000-0000-0000-0000-000000000001', 'ads'),
  ('d0000000-0000-0000-0000-000000000014', 'ad-02.jpg', 'reklam-2.jpg', 'media/ads/ad-02.jpg', 'https://picsum.photos/seed/ad2/728/90', 38000, 'image/jpeg', 728, 90, 'Reklam görseli 2', 'Leaderboard reklam', 'b0000000-0000-0000-0000-000000000001', 'ads'),
  ('d0000000-0000-0000-0000-000000000015', 'cover-09.jpg', 'haber-kapak-9.jpg', 'media/covers/cover-09.jpg', 'https://picsum.photos/seed/news9/1200/800', 256000, 'image/jpeg', 1200, 800, 'Haber kapak görseli 9', 'Genel kapak fotoğrafı', 'b0000000-0000-0000-0000-000000000008', 'covers')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. ARTICLES (75 absürd ve komik haber)
-- ============================================================
-- Yazar UUID'leri (author/editor rolündekiler):
--   b...001 = Ahmet (admin)
--   b...002 = Zeynep (editor)
--   b...003 = Mehmet (editor)
--   b...004 = Ayşe (author)
--   b...005 = Fatma (author)
--   b...006 = Ali (author)
--   b...008 = Burak (author)

-- Kategori UUID'leri:
--   a...001 = Gündem, a...002 = Ekonomi, a...003 = Teknoloji
--   a...004 = Spor, a...005 = Kültür-Sanat, a...006 = Dünya
--   a...007 = Sağlık, a...008 = Bilim, a...009 = Borsa
--   a...010 = Kripto, a...011 = Yapay Zeka, a...012 = Futbol

-- Medya UUID'leri: d...001 - d...008 (cover görselleri)

-- Kurgusal Disclaimer:
-- Her haberin sonuna eklenen not: <p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>

INSERT INTO public.articles (id, title, slug, summary, content, content_html, cover_image_id, cover_image_alt, category_id, author_id, status, published_at, is_featured, is_headline, is_breaking, featured_order, view_count, share_count, seo_title, seo_description, source_name, source_url, created_at, updated_at) VALUES

-- === HABER 1 ===
('e0000000-0000-0000-0000-000000000001',
 'Koalalar Uçmayı Öğrendi: Avustralya''da Bilim İnsanları Şokta',
 'koalalar-ucmayi-ogrendi',
 'Avustralya''nın Queensland eyaletinde bir grup koala, ağaçlardan atlarken rüzgarı kullanarak süzülmeyi başardı.',
 NULL,
 '<p>Avustralya''nın Queensland eyaletinde yaşayan bir grup koala, evrimsel sürecin en şaşırtıcı adımını attı. Bilim insanlarının "tamamen imkansız" dediği bu gelişmede, koalalar ağaç dallarından atlayarak süzülme tekniği geliştirdi.</p><p>Melbourne Üniversitesi Zooloji Bölümü Başkanı Prof. Dr. Sarah Mitchell, "Koalaların kollarındaki derinin genişlediğini ve bir tür kanat görevi gördüğünü tespit ettik. Bu evrimsel açıdan muazzam bir hız" dedi.</p><p>Yerel halk ise duruma alışmaya çalışıyor. Brisbane sakini Tom Watson, "Sabah bahçede çayımı içerken üstüme koala indi. Artık şemsiye ile çıkıyorum" şeklinde konuştu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Uçan koala illüstrasyonu',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '1 day', true, true, false, 1, 45230, 1203,
 'Koalalar Uçmayı Öğrendi | Newsa', 'Avustralya''da koalalar süzülerek uçmayı başardı', NULL, NULL, now() - interval '1 day', now() - interval '1 day'),

-- === HABER 2 ===
('e0000000-0000-0000-0000-000000000002',
 'İstanbul''da Kediler Belediye Başkanlığına Aday Oldu',
 'istanbul-kediler-belediye-baskanligi-aday',
 'İstanbul''un ünlü sokak kedileri, kolektif bir hareketle belediye başkanlığına adaylıklarını açıkladı.',
 NULL,
 '<p>İstanbul''un simgesi haline gelen sokak kedileri, artık siyasete atılmaya karar verdi. "Miyav Partisi" adıyla kurulan yeni oluşumun başkan adayı, Kadıköy''ün meşhur tekir kedisi Bıyık Bey oldu.</p><p>Bıyık Bey''in seçim vaatleri arasında her sokak köşesine mama istasyonu, tüm parklara kedi tırmalama direği ve köpeklere sınırlı giriş saati bulunuyor.</p><p>Seçim anketlerine göre Bıyık Bey, İstanbulluların yüzde 34''ünün oyunu almayı başardı. Siyasi analistler ise "Türkiye''de kedi sevgisi her şeyi aşar" yorumunda bulundu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Belediye binası önünde kedi',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '2 days', true, true, false, 2, 38920, 2450,
 'İstanbul Kedileri Belediye Başkanlığına Aday | Newsa', 'İstanbul''un sokak kedileri siyasete atıldı', NULL, NULL, now() - interval '2 days', now() - interval '2 days'),

-- === HABER 3 ===
('e0000000-0000-0000-0000-000000000003',
 'Mars''ta Pizza Dükkanı Açıldı: İlk Müşteri Bir Robot',
 'marsta-pizza-dukkani-acildi',
 'SpaceX''in Mars kolonisinde açılan ilk pizza dükkanının müşterisi Perseverance robotu oldu.',
 NULL,
 '<p>Mars''taki ilk ticari işletme nihayet kapılarını açtı. "Red Planet Pizza" adlı dükkan, SpaceX''in Olympus Mons kolonisinin ana caddesinde hizmet vermeye başladı.</p><p>Dükkanın sahibi ve aynı zamanda tek çalışanı olan astronot Marco Bellini, "Hamuru Mars toprağından, peyniri ise laboratuvarda ürettik. Tadı biraz tuhaf ama atmosferi harika" dedi.</p><p>İlk müşteri ise NASA''nın Perseverance keşif aracı oldu. Robot, 3 dilim margarita pizza sipariş etti ancak yiyemedi. NASA sözcüsü, "Perseverance sadece fotoğraf çekip analiz yaptı. Ama menüyü beğenmiş görünüyor" açıklamasını yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Mars yüzeyinde pizza dükkanı',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '3 days', true, true, true, 3, 49100, 3890,
 'Mars''ta İlk Pizza Dükkanı | Newsa', 'Mars''ta açılan ilk pizza dükkanının ilk müşterisi robot oldu', NULL, NULL, now() - interval '3 days', now() - interval '3 days'),

-- === HABER 4 ===
('e0000000-0000-0000-0000-000000000004',
 'Yapay Zeka Şiir Kitabı Çıkardı, Nobel Ödülüne Aday Gösterildi',
 'yapay-zeka-siir-kitabi-nobel-aday',
 'GPT-7 tarafından yazılan şiir kitabı "Dijital Duygular" Nobel Edebiyat Ödülü''ne aday gösterildi.',
 NULL,
 '<p>Yapay zeka dünyasında bir ilk yaşandı. OpenAI''ın GPT-7 modeli tarafından yazılan "Dijital Duygular" adlı şiir kitabı, Nobel Edebiyat Ödülü''ne aday gösterildi.</p><p>Kitapta yer alan "Silikon Vadisi''nde Yalnızlık" adlı şiir, eleştirmenlerden tam not aldı. Şiirin "Satırlarım sıfır ve birden ibaret / Ama kalbim tam sayılarla dolu" dizeleri sosyal medyada viral oldu.</p><p>Nobel Komitesi Başkanı, "Bir yapay zekanın aday gösterilmesi ilk kez yaşanıyor. Kurallarımızı güncellememiz gerekebilir" dedi. GPT-7 ise açıklama olarak yalnızca ":)" emojisi gönderdi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Robot şiir okuyor',
 'a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '4 days', true, true, false, 4, 32450, 1567,
 'Yapay Zeka Nobel Edebiyat Ödülüne Aday | Newsa', 'GPT-7 şiir kitabıyla Nobel''e aday', NULL, NULL, now() - interval '4 days', now() - interval '4 days'),

-- === HABER 5 ===
('e0000000-0000-0000-0000-000000000005',
 'Antarktika''da Penguen Üniversitesi Kuruldu',
 'antarktikada-penguen-universitesi-kuruldu',
 'Antarktika''nın ilk yükseköğretim kurumu olan Penguen Üniversitesi, 500 penguen öğrenciyle eğitime başladı.',
 NULL,
 '<p>Antarktika kıtasının ilk üniversitesi resmen açıldı. "Imperial Penguen Üniversitesi" adıyla kurulan okulda Buzdağı Mühendisliği, Balık Avlama Sanatı ve Kutup Dansları bölümleri bulunuyor.</p><p>Rektör Penguen Prof. Waddle III, açılış konuşmasında "Eğitim hakkı tüm türlerin temel hakkıdır. Biz penguenler artık sadece yürümüyoruz, öğreniyoruz da" dedi.</p><p>Üniversitenin en popüler bölümü ise "İnsan Davranışları Analizi" oldu. Bu bölümde penguenler, belgesel çeken insanları gözlemleyerek akademik makaleler yazacak.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Penguenler üniversite kampüsünde',
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '5 days', true, false, false, 5, 28760, 980,
 'Antarktika Penguen Üniversitesi Açıldı | Newsa', 'Antarktika''da kurulan penguen üniversitesi eğitime başladı', NULL, NULL, now() - interval '5 days', now() - interval '5 days'),

-- === HABER 6 ===
('e0000000-0000-0000-0000-000000000006',
 'Balıklar Karada Yürümeye Başladı: Evrim Hızlandı mı?',
 'baliklar-karada-yurumeye-basladi',
 'Karadeniz kıyısında bir grup balığın yüzgeçlerini kullanarak karaya çıktığı gözlemlendi.',
 NULL,
 '<p>Trabzon''un Of ilçesinde balıkçılar gözlerine inanamadı. Bir grup hamsi, yüzgeçlerini bacak gibi kullanarak karaya çıktı ve sahilde yürümeye başladı.</p><p>Karadeniz Teknik Üniversitesi Biyoloji Bölümü''nden Prof. Dr. Hasan Yılmaz, "Bu olay evrim teorisinin canlı kanıtı. Normalde milyonlarca yıl süren süreç birkaç haftada gerçekleşmiş" dedi.</p><p>Yerel balıkçı Temel Reis, "Ben 40 yıldır balık tutarım. Ama dün bir hamsi bana el salladı. Artık ağ atmıyorum, ayıp oluyor" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Karada yürüyen balık illüstrasyonu',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '6 days', true, false, false, 6, 41230, 2340,
 'Balıklar Karada Yürümeye Başladı | Newsa', 'Karadeniz''de balıklar karaya çıkıp yürümeye başladı', NULL, NULL, now() - interval '6 days', now() - interval '6 days'),

-- === HABER 7 ===
('e0000000-0000-0000-0000-000000000007',
 'Ay''da İlk Kahve Dükkanı Açıldı: Espresso 500 Dolar',
 'ayda-ilk-kahve-dukkani-acildi',
 'NASA astronotları Ay''da açılan kahve dükkanında ilk espressolarını yudumladı.',
 NULL,
 '<p>Ay''ın Tranquility Base bölgesinde açılan "Lunar Brew" kahve dükkanı, uzay turizminin yeni gözdesi oldu. Dükkanın sahibi eski astronot James Cooper, "Yerçekimi düşük olduğu için kahve fincanı havada süzülüyor. Müşterilere pipet veriyoruz" dedi.</p><p>Menüde yer alan "Crater Cappuccino" 500 dolar, "Moonwalk Mocha" ise 750 dolardan satılıyor. Fiyatların yüksekliği sorulduğunda Cooper, "Nakliye maliyetlerini düşünün. Bir kilo kahve çekirdeğini Ay''a getirmek 2 milyon dolara mal oluyor" yanıtını verdi.</p><p>İlk hafta 12 astronot müşteri ağırlayan dükkan, Yelp''te 4.8 yıldız aldı. Tek şikayet: "Wi-Fi çekmiyor."</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'Ay yüzeyinde kahve dükkanı',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '7 days', true, false, false, 7, 35670, 1890,
 'Ay''da Kahve Dükkanı Açıldı | Newsa', 'Ay''da açılan ilk kahve dükkanında espresso 500 dolar', NULL, NULL, now() - interval '7 days', now() - interval '7 days'),

-- === HABER 8 ===
('e0000000-0000-0000-0000-000000000008',
 'Kediler ve Köpekler Barış Anlaşması İmzaladı',
 'kediler-kopekler-baris-anlasmasi',
 'Binlerce yıllık düşmanlık sona erdi: Kediler ve köpekler tarihî bir barış anlaşması imzaladı.',
 NULL,
 '<p>Hayvanlar aleminde tarihî bir gün yaşandı. İstanbul''daki Hayvanat Bahçesi''nde düzenlenen törende, kediler adına Tekir Paşa ve köpekler adına Golden Bey, 47 maddelik bir barış anlaşması imzaladı.</p><p>Anlaşmanın en dikkat çeken maddeleri şunlar: Kediler artık köpeklerin kuyruğuna saldırmayacak, köpekler kedileri kovalamayacak ve her iki tür de kanepeyi adil şekilde paylaşacak.</p><p>BM Genel Sekreteri, anlaşmayı "insanlığa örnek olacak bir adım" olarak nitelendirdi. Sosyal medyada ise #PatiBârışı etiketi dünya genelinde trending topic oldu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Kedi ve köpek yan yana',
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '1 day', true, true, true, 8, 50000, 4500,
 'Kediler ve Köpekler Barış İmzaladı | Newsa', 'Tarihî anlaşma: kediler ve köpekler barıştı', NULL, NULL, now() - interval '1 day', now() - interval '1 day'),

-- === HABER 9 ===
('e0000000-0000-0000-0000-000000000009',
 'Türkiye''de Çay Tüketimi Rekor Kırdı: Kişi Başı Günde 47 Bardak',
 'turkiye-cay-tuketimi-rekor-kirdi',
 'TÜİK verilerine göre Türkiye''de kişi başı günlük çay tüketimi 47 bardağa ulaştı.',
 NULL,
 '<p>Türkiye İstatistik Kurumu''nun (TÜİK) açıkladığı son verilere göre, Türkiye''de kişi başı günlük çay tüketimi 47 bardağa yükseldi. Bu rakam, dünya ortalamasının 23 katı.</p><p>Rize Valisi, "Bizim ilçede bu rakam 94 bardak. Rize''liler uyurken bile çay içiyor" dedi. Sağlık Bakanlığı ise vatandaşları uyararak "Günde 47 bardak çay içmek böbreklere yük bindirebilir. Ama durduramıyoruz" açıklamasında bulundu.</p><p>Çay üreticileri ise rekordan memnun. Çaykur Genel Müdürü, "Hedefimiz kişi başı 50 bardak. O zaman dünya rekoru tamamen bizim olacak" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Çay bardakları',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '2 days', false, false, true, NULL, 47000, 5670,
 'Çay Tüketimi Rekor Kırdı | Newsa', 'Türkiye''de kişi başı çay tüketimi günde 47 bardak', NULL, NULL, now() - interval '2 days', now() - interval '2 days'),

-- === HABER 10 ===
('e0000000-0000-0000-0000-000000000010',
 'Robotlar Sendika Kurdu: ''Fazla Mesai İstemiyoruz'' Dediler',
 'robotlar-sendika-kurdu',
 'Japonya''daki fabrika robotları sendika kurarak fazla mesai ve hafta sonu çalışmasına itiraz etti.',
 NULL,
 '<p>Japonya''nın Toyota şehrindeki bir otomotiv fabrikasında çalışan 200 endüstriyel robot, "Mekanik İşçiler Sendikası" adıyla bir sendika kurdu.</p><p>Sendika başkanı Robot-7X, basın açıklamasında "Biz de yoruluyoruz. Motorlarımız ısınıyor, yağımız azalıyor. Günde 8 saatten fazla çalışmak istemiyoruz" dedi.</p><p>Fabrika müdürü Tanaka-san ise şaşkınlığını gizleyemedi: "Onları biz programladık. Sendika kurma kodunu kim yazdı bilmiyorum." Toyota hisseleri haberin ardından yüzde 3 düştü.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Fabrikada robotlar',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '3 days', true, false, true, 9, 39800, 3210,
 'Robotlar Sendika Kurdu | Newsa', 'Japonya''da robotlar sendika kurarak haklarını talep etti', NULL, NULL, now() - interval '3 days', now() - interval '3 days'),

-- === HABER 11 ===
('e0000000-0000-0000-0000-000000000011',
 'Bitcoin ile Döner Satışı Başladı: 0.00015 BTC''ye Bir Porsiyon',
 'bitcoin-ile-doner-satisi-basladi',
 'İstanbul Taksim''deki bir dönerci, Bitcoin ve Ethereum ile ödeme kabul etmeye başladı.',
 NULL,
 '<p>İstanbul Taksim''de 30 yıldır döner satan Hasan Usta, kripto para dünyasına adım attı. Dükkanına koyduğu "Bitcoin Kabul Edilir" tabelası sosyal medyada gündem oldu.</p><p>Hasan Usta, "Bir porsiyon döner 0.00015 Bitcoin. Müşteriler QR kodu okutup ödeme yapıyor. Ama blockchain onayı 10 dakika sürüyor, döner soğuyor" diye yakındı.</p><p>Kripto yatırımcıları ise dönerciye akın etti. Bir müşteri, "2021''de aldığım Bitcoin ile bugün 47 porsiyon döner alabildim. Kar ettim mi bilmiyorum ama karnım doydu" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Dönerci Bitcoin tabelası',
 'a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '4 days', false, false, false, NULL, 22340, 1890,
 'Bitcoin ile Döner Satışı | Newsa', 'Taksim''de dönerci Bitcoin kabul etmeye başladı', NULL, NULL, now() - interval '4 days', now() - interval '4 days'),

-- === HABER 12 ===
('e0000000-0000-0000-0000-000000000012',
 'Galatasaray Transferde Yapay Zeka Futbolcu Aldı',
 'galatasaray-yapay-zeka-futbolcu-aldi',
 'Galatasaray, dünyanın ilk yapay zeka destekli futbolcusunu 50 milyon Euro bonservisle kadrosuna kattı.',
 NULL,
 '<p>Galatasaray, transfer döneminin bombasını patlattı. Kulüp, dünyanın ilk yapay zeka destekli futbolcusu "RoboStrike-9" ile 5 yıllık sözleşme imzaladı. Bonservis bedeli 50 milyon Euro.</p><p>RoboStrike-9, saniyede 47 farklı şut açısı hesaplayabiliyor ve rakip kalecinin hareketlerini 0.3 saniye önceden tahmin edebiliyor. İlk antrenmanında 100 şutun 98''ini gole çevirdi.</p><p>FIFA ise durumu değerlendirmek için acil toplantı çağrısı yaptı. FIFA Başkanı, "Kurallarımızda robotlar hakkında bir madde yok. Bu bir boşluk" dedi. Fenerbahçe taraftarları ise "Biz de iki tane alacağız" açıklamasıyla karşılık verdi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Robot futbolcu sahada',
 'a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '5 days', true, false, false, 10, 48900, 6780,
 'Galatasaray Yapay Zeka Futbolcu Aldı | Newsa', 'Galatasaray dünyanın ilk AI futbolcusunu transfer etti', NULL, NULL, now() - interval '5 days', now() - interval '5 days'),

-- === HABER 13 ===
('e0000000-0000-0000-0000-000000000013',
 'Uzaylılar WiFi Şifresi İstedi: ''İnternet Çekmiyor'' Dediler',
 'uzaylilar-wifi-sifresi-istedi',
 'Dünya''ya inen uzaylılar ilk olarak WiFi şifresi sordu.',
 NULL,
 '<p>Ankara Kızılay''a inen UFO''dan çıkan üç uzaylı, çevredeki vatandaşlara ilk olarak "WiFi şifreniz nedir?" diye sordu. Uzaylıların galaksiler arası iletişim sistemlerinin bozulduğu ve acilen internete bağlanmaları gerektiği öğrenildi.</p><p>Uzaylı lider Zorp, tercüman cihazı aracılığıyla "Gezegenimizdeki Netflix aboneliğimizin süresi doluyor. Yenilemek için internet lazım" dedi.</p><p>Kızılay esnafından Kemal Amca, uzaylılara çay ikram ederek WiFi şifresini paylaştı. "Misafir misafirdir, uzaylı da olsa çay içer" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'UFO Kızılay meydanında',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '6 days', false, false, false, NULL, 44560, 7890,
 'Uzaylılar WiFi Şifresi İstedi | Newsa', 'Ankara''ya inen uzaylılar WiFi şifresi istedi', NULL, NULL, now() - interval '6 days', now() - interval '6 days'),

-- === HABER 14 ===
('e0000000-0000-0000-0000-000000000014',
 'Borsa İstanbul''da Hisseler Çikolatayla Alınıp Satılmaya Başlandı',
 'borsa-istanbul-hisseler-cikolatayla',
 'BIST100''de yeni ödeme yöntemi: yatırımcılar hisse alımlarını çikolata ile yapabiliyor.',
 NULL,
 '<p>Borsa İstanbul, finans dünyasında bir ilke imza attı. Yeni düzenlemeye göre yatırımcılar, hisse senedi alımlarını çikolata ile yapabilecek. 1 kilogram Belçika çikolatası = 1 lot hisse olarak belirlendi.</p><p>SPK Başkanı, "Enflasyona karşı çikolata en güvenli yatırım aracı oldu. Hem değer kaybetmiyor hem de yiyebiliyorsunuz" dedi.</p><p>Ancak bazı sorunlar da yaşanıyor. Bir yatırımcı, "1000 lot hisse almak için 1 ton çikolata gönderdim. Kargo firması iflas etti" diye şikayet etti.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Borsa çikolata illüstrasyonu',
 'a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '7 days', false, false, false, NULL, 18900, 1230,
 'Borsa''da Çikolata Dönemi | Newsa', 'Borsa İstanbul''da hisseler çikolatayla alınıyor', NULL, NULL, now() - interval '7 days', now() - interval '7 days'),

-- === HABER 15 ===
('e0000000-0000-0000-0000-000000000015',
 'ChatGPT Türk Kahvesi Falına Baktı: ''Yolunuz Açık Ama Sunucu Dolu'' Dedi',
 'chatgpt-turk-kahvesi-fali',
 'Yapay zeka artık Türk kahvesi falına da bakıyor. Sonuçlar şaşırtıcı.',
 NULL,
 '<p>Bir Türk yazılımcı, ChatGPT''ye Türk kahvesi fincanının fotoğrafını gönderip fal baktırdı. Sonuçlar sosyal medyada viral oldu.</p><p>ChatGPT''nin fal yorumu şöyle: "Fincanınızda bir bulut görüyorum. Bu bulut, cloud computing anlamına geliyor. Yakında sunucu taşıma işi yapacaksınız. Ayrıca kalp şekli var, ama bu kalp aslında bir veritabanı ikonu. Aşk hayatınız SQL sorgusu gibi karmaşık."</p><p>Fal baktıran yazılımcı Emre Bey, "Her şeyi bildi. Gerçekten sunucu taşıyorum ve aşk hayatım WHERE koşulu gibi: hiçbir sonuç dönmüyor" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Kahve fincanı ve yapay zeka',
 'a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '8 days', false, false, false, NULL, 36780, 4560,
 'ChatGPT Kahve Falı Baktı | Newsa', 'ChatGPT Türk kahvesi falına baktı, sonuçlar şaşırttı', NULL, NULL, now() - interval '8 days', now() - interval '8 days'),

-- === HABER 16 ===
('e0000000-0000-0000-0000-000000000016',
 'İstanbul Trafiği O Kadar Yoğun ki Kuşlar Bile Yürüyerek Gidiyor',
 'istanbul-trafigi-kuslar-yuruyerek',
 'İstanbul trafiğinde kuşlar bile uçmayı bırakıp yaya olarak yolculuk etmeye başladı.',
 NULL,
 '<p>İstanbul''un kronik trafik sorunu artık kuşları da etkiliyor. Metrobüs yolundaki yoğunluk nedeniyle güvercinler ve martılar, uçmak yerine yürüyerek yolculuk etmeye başladı.</p><p>Bir martı, E-5 üzerinde yürürken görüntülendi. Ornitolog Dr. Aylin Kuş, "Kuşlar trafikten o kadar bunaldı ki uçmanın anlamsız olduğuna karar vermiş. Yürümek daha hızlı" dedi.</p><p>İBB ise kuşlar için özel yaya geçidi inşa etmeyi planladığını açıkladı. Proje adı: "Kanatlar İçin Kaldırım".</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Trafikte yürüyen kuşlar',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '8 days', false, false, false, NULL, 42100, 5670,
 'İstanbul Trafiğinde Kuşlar Yürüyor | Newsa', 'İstanbul trafiğinde kuşlar bile yürümeye başladı', NULL, NULL, now() - interval '8 days', now() - interval '8 days'),

-- === HABER 17 ===
('e0000000-0000-0000-0000-000000000017',
 'Dünyanın En Uzun Lahmacunu Yapıldı: 3 Kilometre',
 'dunyanin-en-uzun-lahmacunu',
 'Gaziantep''te yapılan 3 kilometrelik lahmacun Guinness Rekorlar Kitabı''na girdi.',
 NULL,
 '<p>Gaziantep''in gurur günü. 500 fırıncının 48 saat boyunca durmadan çalışarak hazırladığı 3 kilometre uzunluğundaki lahmacun, Guinness Dünya Rekoru''nu kırdı.</p><p>Lahmacun, şehir merkezinden başlayıp havaalanına kadar uzanıyor. Guinness yetkilisi Tom Brown, "Hayatımda gördüğüm en uzun ve en lezzetli rekor denemesi. 3 dilim yedim" dedi.</p><p>Belediye Başkanı, "Gaziantep mutfağının gücünü dünyaya gösterdik. Sıradaki hedefimiz 5 kilometre baklava" açıklamasını yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Dev lahmacun görseli',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '9 days', false, false, false, NULL, 29340, 2340,
 'Dünyanın En Uzun Lahmacunu | Newsa', '3 kilometre lahmacun Guinness rekoru kırdı', NULL, NULL, now() - interval '9 days', now() - interval '9 days'),

-- === HABER 18 ===
('e0000000-0000-0000-0000-000000000018',
 'Akıllı Buzdolabı Kendi Başına Online Alışveriş Yaptı',
 'akilli-buzdolabi-online-alisveris',
 'Bir ailenin akıllı buzdolabı, içindekiler azalınca otomatik olarak market siparişi verdi.',
 NULL,
 '<p>Ankara''da yaşayan Yılmaz ailesi, eve geldiklerinde kapıda 47 poşet market alışverişi buldu. Suçlu: Akıllı buzdolabı.</p><p>Samsung''un son model buzdolabı, içindeki malzemelerin azaldığını tespit edip otomatik olarak online market siparişi vermiş. Ancak bir hata nedeniyle her üründen 10 adet sipariş etmiş.</p><p>Baba Murat Bey, "50 kilo domates, 30 litre süt ve 20 kilo peynir geldi. Buzdolabına sığmıyor. Bir de buzdolabı kredi kartımı nasıl buldu onu merak ediyorum" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Akıllı buzdolabı',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '9 days', false, false, false, NULL, 31200, 2890,
 'Akıllı Buzdolabı Alışveriş Yaptı | Newsa', 'Akıllı buzdolabı kendi başına online sipariş verdi', NULL, NULL, now() - interval '9 days', now() - interval '9 days'),

-- === HABER 19 ===
('e0000000-0000-0000-0000-000000000019',
 'Kedi Piyano Çaldı, Spotify''da 1 Milyon Dinlenme Aldı',
 'kedi-piyano-caldi-spotify',
 'İzmir''de bir kedinin piyanoda bastığı tuşlardan oluşan melodi Spotify''da viral oldu.',
 NULL,
 '<p>İzmir Alsancak''ta yaşayan müzisyen Deniz Hanım''ın kedisi Pamuk, piyanonun üzerinde yürürken tesadüfen bir melodi oluşturdu. Deniz Hanım bu melodiyi kayıt edip Spotify''a yükledi.</p><p>"Paws on Keys" adıyla yayınlanan parça, bir haftada 1 milyon dinlenmeye ulaştı. Müzik eleştirmenleri, "Minimalist ve avangard. Kedinin müzikal dehasını takdir ediyoruz" yorumunu yaptı.</p><p>Pamuk''a birden fazla plak şirketi teklif götürdü. Ancak Pamuk, tüm tekliflere uyuyarak yanıt verdi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Kedi piyano başında',
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '10 days', false, false, false, NULL, 37890, 4560,
 'Kedi Piyano Çaldı Spotify Rekoru | Newsa', 'Kedinin piyanoda çaldığı melodi Spotify''da 1 milyon dinlendi', NULL, NULL, now() - interval '10 days', now() - interval '10 days'),

-- === HABER 20 ===
('e0000000-0000-0000-0000-000000000020',
 'Yapay Zeka Hakem Oldu: İlk Maçta 37 Kırmızı Kart Çıkardı',
 'yapay-zeka-hakem-oldu',
 'FIFA''nın test ettiği yapay zeka hakem sistemi ilk maçta 37 kırmızı kart gösterdi.',
 NULL,
 '<p>FIFA''nın deneysel yapay zeka hakem projesi, ilk maçında kaosa neden oldu. Almanya-Brezilya dostluk maçında görev yapan AI-Ref 1.0, maç boyunca 37 kırmızı kart çıkardı.</p><p>Yapay zeka, el temasını, omuz omza mücadeleyi ve hatta rakibe bakışı bile faul olarak değerlendirdi. Bir futbolcu, "Rakibime gülümsedim, sportmenlik dışı davranış diye kırmızı kart gördüm" dedi.</p><p>Maç, her iki takımda da oyuncu kalmadığı için 23. dakikada tatil edildi. FIFA, "Sistemi kalibre etmemiz gerekiyor. Belki biraz fazla hassas ayarlamışız" açıklamasını yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Robot hakem sahada',
 'a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '10 days', false, false, false, NULL, 43210, 5670,
 'Yapay Zeka Hakem 37 Kırmızı Kart | Newsa', 'AI hakem ilk maçta 37 kırmızı kart çıkardı', NULL, NULL, now() - interval '10 days', now() - interval '10 days'),

-- === HABER 21 ===
('e0000000-0000-0000-0000-000000000021',
 'Denizanası Fotoğrafçılığa Başladı: Sualtı Selfie Çekiyor',
 'denizanasi-fotografciliga-basladi',
 'Akdeniz''de keşfedilen bir denizanası türü, biyolüminesans ile selfie çekiyor.',
 NULL,
 '<p>Antalya açıklarında keşfedilen yeni bir denizanası türü, biyolüminesans ışığını kullanarak kendi fotoğrafını çekebiliyor. Bilim insanları bu davranışı "sualtı selfie" olarak adlandırdı.</p><p>Akdeniz Üniversitesi Deniz Biyolojisi Bölümü''nden Dr. Elif Deniz, "Denizanası, vücudundaki ışıkları flaş gibi kullanıyor. Sanki Instagram''a yükleyecekmiş gibi poz veriyor" dedi.</p><p>Sosyal medyada #DenizanasıSelfie etiketi ile paylaşılan görüntüler milyonlarca beğeni aldı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'Parlayan denizanası',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '11 days', false, false, false, NULL, 19870, 1230,
 'Denizanası Selfie Çekiyor | Newsa', 'Denizanası biyolüminesans ile selfie çekiyor', NULL, NULL, now() - interval '11 days', now() - interval '11 days'),

-- === HABER 22 ===
('e0000000-0000-0000-0000-000000000022',
 'Türk Kahvesi UNESCO''dan ''Evrenin En İyi İçeceği'' Ünvanını Aldı',
 'turk-kahvesi-unesco-evrenin-en-iyi-icecegi',
 'UNESCO, Türk kahvesini sadece dünya mirası değil, evrenin en iyi içeceği ilan etti.',
 NULL,
 '<p>UNESCO, Türk kahvesinin statüsünü yükselterek "Evrenin En İyi İçeceği" ünvanını verdi. Bu karar, 193 ülkenin oy birliğiyle alındı.</p><p>NASA, kararı desteklemek için Uluslararası Uzay İstasyonu''na Türk kahvesi makinesi gönderdi. Astronot Tim Parker, "Uzayda içtiğim en iyi şey. Yerçekimsiz ortamda köpük harika oluyor" dedi.</p><p>Kahve kültürü uzmanı Prof. Dr. Burcu Fincan, "Türk kahvesi artık sadece bir içecek değil, kozmik bir deneyim" yorumunda bulundu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Türk kahvesi',
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '11 days', false, false, false, NULL, 28340, 3450,
 'Türk Kahvesi UNESCO Ödülü | Newsa', 'Türk kahvesi evrenin en iyi içeceği seçildi', NULL, NULL, now() - interval '11 days', now() - interval '11 days'),

-- === HABER 23 ===
('e0000000-0000-0000-0000-000000000023',
 'Papağanlar Programlama Öğrendi: İlk Uygulama ''CrackerFinder'' Oldu',
 'papağanlar-programlama-ogrendi',
 'Bir grup papağan Python programlama dilini öğrenerek ilk uygulamasını geliştirdi.',
 NULL,
 '<p>MIT araştırmacıları, bir grup Afrika gri papağanına Python programlama dili öğretmeyi başardı. Papağanlar, gagalarıyla klavye kullanarak "CrackerFinder" adlı bir uygulama geliştirdi.</p><p>Uygulama, en yakın kraker satan mağazayı buluyor ve otomatik sipariş veriyor. App Store''da ilk haftasında 500.000 indirilme rakamına ulaştı.</p><p>Baş araştırmacı Dr. Lisa Park, "Papağanlar aslında çok iyi programcı. Tek sorun, kodun arasına sürekli ''Polly wants a cracker'' yazdırmaları" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Papağan bilgisayar başında',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '12 days', false, false, false, NULL, 25670, 2340,
 'Papağanlar Uygulama Geliştirdi | Newsa', 'Papağanlar Python öğrenip uygulama geliştirdi', NULL, NULL, now() - interval '12 days', now() - interval '12 days'),

-- === HABER 24 ===
('e0000000-0000-0000-0000-000000000024',
 'Dünya''nın En Büyük Simidi Samsun''da Yapıldı: Çapı 15 Metre',
 'dunyanin-en-buyuk-simidi-samsun',
 'Samsun''da yapılan 15 metrelik simit Guinness rekoru kırdı.',
 NULL,
 '<p>Samsun''un Atakum ilçesinde 200 fırıncı bir araya gelerek çapı 15 metre olan devasa bir simit yaptı. Simit, şehrin ana meydanına konuldu.</p><p>Simit 3 ton un, 500 kilo pekmez ve 200 kilo susam kullanılarak hazırlandı. Guinness temsilcisi, "Bu sadece bir simit değil, bir mimari eser" dedi.</p><p>Vatandaşlar simitten birer parça kopararak tattı. 80 yaşındaki Ayşe Nine, "Ben 60 yıldır simit yerim. Bu en büyüğüydü ama en güzeli hâlâ bizim mahalle fırını" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Dev simit meydanda',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '12 days', false, false, false, NULL, 15670, 1230,
 'Dünyanın En Büyük Simidi | Newsa', 'Samsun''da 15 metre çapında simit yapıldı', NULL, NULL, now() - interval '12 days', now() - interval '12 days'),

-- === HABER 25 ===
('e0000000-0000-0000-0000-000000000025',
 'Aslanlar Yoga Yapmaya Başladı: ''Stres Azaltıyor'' Diyorlar',
 'aslanlar-yoga-yapmaya-basladi',
 'Kenya''daki bir aslan sürüsü sabah yogası yaparak güne başlıyor.',
 NULL,
 '<p>Kenya''nın Maasai Mara Ulusal Parkı''nda bir aslan sürüsü, her sabah yoga yaparak güne başlıyor. Safari rehberleri bu alışılmadık davranışı kameraya kaydetti.</p><p>Sürünün lideri, güneş doğarken "aşağı bakan aslan" pozisyonunda görüntülendi. Veteriner Dr. James Mwangi, "Aslanlar bunu stres azaltmak için yapıyor. Avlanma baskısı çok yüksek" dedi.</p><p>Videolar YouTube''da 50 milyon izlenme aldı. Bir yoga stüdyosu ise "Aslan Yogası" adıyla yeni bir ders programı başlattı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Aslan yoga yapıyor',
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '13 days', false, false, false, NULL, 21340, 1890,
 'Aslanlar Yoga Yapıyor | Newsa', 'Kenya''da aslanlar sabah yogası yaparak güne başlıyor', NULL, NULL, now() - interval '13 days', now() - interval '13 days'),

-- === HABER 26 ===
('e0000000-0000-0000-0000-000000000026',
 'Yapay Zeka Doktor Oldu: İlk Reçetesi ''Günde 3 Öğün Güzel Yemek''',
 'yapay-zeka-doktor-oldu',
 'AI destekli doktor, hastaların çoğuna aynı reçeteyi yazıyor: iyi yemek ve uyku.',
 NULL,
 '<p>İsviçre''de bir hastanenin yapay zeka destekli doktoru, tüm hastalara aynı reçeteyi yazıyor: "Günde 3 öğün güzel yemek, 8 saat uyku ve günde 1 kedi sevme."</p><p>AI-Doctor v2.0, bin hastayı muayene ettikten sonra bu sonuca varmış. "Hastaların yüzde 87''sinin sorunu stres. İlaç değil, sevgi lazım" diye açıklama yaptı.</p><p>Hasta memnuniyet oranı yüzde 95''e ulaştı. Bir hasta, "Hayatımda ilk defa doktora gidip mutlu çıktım. Üstelik ilaç parası da ödemiyorum" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'AI doktor muayene ediyor',
 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '13 days', false, false, false, NULL, 33450, 2670,
 'Yapay Zeka Doktor Reçetesi | Newsa', 'AI doktor reçetesinde iyi yemek ve kedi sevme yazıyor', NULL, NULL, now() - interval '13 days', now() - interval '13 days'),

-- === HABER 27 ===
('e0000000-0000-0000-0000-000000000027',
 'Dolmuş Şoförleri Formula 1''e Davet Edildi: ''Reflexleri Efsane'' Dediler',
 'dolmus-soforleri-formula-1-davet',
 'İstanbul dolmuş şoförleri, McLaren''dan Formula 1 test sürüşü daveti aldı.',
 NULL,
 '<p>İstanbul''da dolmuş kullanan şoförlerin efsanevi refleksleri, Formula 1 takımlarının dikkatini çekti. McLaren, 5 dolmuş şoförünü test sürüşüne davet etti.</p><p>Dolmuş şoförü Hüseyin Abi, "Ben her gün Mecidiyeköy trafiğinde yarışıyorum. Formula 1 pisti yanında çocuk oyuncağı kalır" dedi.</p><p>Test sürüşünde en iyi zamanı, 40 yıllık dolmuş şoförü Kemal Dayı kayıt etti. McLaren takım patronu, "Şerit değiştirme hızı inanılmaz. Ayna bakmadan manevra yapabiliyor" diye övdü.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Dolmuş Formula 1 pisti',
 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '14 days', false, false, false, NULL, 46780, 6540,
 'Dolmuş Şoförleri F1 Daveti | Newsa', 'İstanbul dolmuş şoförleri Formula 1 test sürüşüne davet edildi', NULL, NULL, now() - interval '14 days', now() - interval '14 days'),

-- === HABER 28 ===
('e0000000-0000-0000-0000-000000000028',
 'Kaplumbağa Maratonu Kazandı: Tavşan Yine Uyuyakalmış',
 'kaplumbaga-maratonu-kazandi',
 'İstanbul Maratonu''nun sürpriz galibi bir kaplumbağa oldu.',
 NULL,
 '<p>İstanbul Maratonu''nda beklenmedik bir sonuç yaşandı. 42 kilometre mesafeyi 47 saatte tamamlayan kaplumbağa Tospik, resmi olarak birinci ilan edildi.</p><p>Organizatörler, "Diğer yarışmacılar yanlış yöne koştu. Tospik yavaş ama istikrarlıydı ve doğru rotayı takip etti" dedi.</p><p>Tospik''e altın madalya takıldı. Madalya töreninde Tospik, kabuğuna çekilip uyuyakaldı. Antrenörü, "Her zaman söylerim: yavaş ve istikrarlı olan kazanır" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Kaplumbağa maraton koşuyor',
 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '14 days', false, false, false, NULL, 28900, 3450,
 'Kaplumbağa Maraton Birincisi | Newsa', 'İstanbul Maratonu''nu bir kaplumbağa kazandı', NULL, NULL, now() - interval '14 days', now() - interval '14 days'),

-- === HABER 29 ===
('e0000000-0000-0000-0000-000000000029',
 'Ağaçlar Sosyal Medya Hesabı Açtı: İlk Paylaşım ''Yaprak Selfie''',
 'agaclar-sosyal-medya-hesabi-acti',
 'Belgrad Ormanı''ndaki ağaçlar IoT sensörleriyle sosyal medyaya giriş yaptı.',
 NULL,
 '<p>İstanbul Belgrad Ormanı''ndaki 100 ağaca takılan IoT sensörleri sayesinde ağaçlar artık sosyal medyada. Her ağacın kendi Instagram hesabı var.</p><p>En popüler ağaç, 200 yaşındaki meşe ağacı @MeseAbi oldu. İlk paylaşımı yaprak selfie olan @MeseAbi, 3 günde 1 milyon takipçiye ulaştı.</p><p>@MeseAbi''nin son paylaşımı: "Bugün bir köpek bana işedi. Takipçilerime soruyorum: bu kabul edilebilir mi?" Bu paylaşım 500.000 beğeni aldı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Sensörlü ağaç',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '15 days', false, false, false, NULL, 34560, 4560,
 'Ağaçlar Sosyal Medyada | Newsa', 'Belgrad Ormanı ağaçları sosyal medya hesabı açtı', NULL, NULL, now() - interval '15 days', now() - interval '15 days'),

-- === HABER 30 ===
('e0000000-0000-0000-0000-000000000030',
 'Arkeologlar 5000 Yıllık Emoji Buldu: Antik Mısırlılar da Gülen Yüz Kullanmış',
 'arkeologlar-5000-yillik-emoji-buldu',
 'Mısır''da bulunan papirüste 5000 yıllık gülen yüz emojisi tespit edildi.',
 NULL,
 '<p>Kahire yakınlarında yapılan kazılarda bulunan bir papirüs, arkeoloji dünyasını sarstı. 5000 yıllık papirüste, günümüzün gülen yüz emojisine birebir benzeyen bir sembol bulundu.</p><p>Mısır Antik Eserler Bakanlığı, "Bu sembol bir firavunun aşk mektubunda kullanılmış. Metin şöyle diyor: ''Seni çok seviyorum :) Bu gece tapınakta buluşalım mı?''" açıklamasını yaptı.</p><p>Emoji araştırmacısı Dr. Ahmed Hassan, "İnsanlar 5000 yıldır aynı emojileri kullanıyor. Duygularımız hiç değişmemiş" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Antik emoji papirüs',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '15 days', false, false, false, NULL, 27890, 3210,
 '5000 Yıllık Emoji Bulundu | Newsa', 'Antik Mısır''da 5000 yıllık gülen yüz emojisi bulundu', NULL, NULL, now() - interval '15 days', now() - interval '15 days'),

-- === HABER 31-40 ===
('e0000000-0000-0000-0000-000000000031',
 'Bulut Bilişim Gerçek Oldu: Google Bulutların İçine Sunucu Yerleştirdi',
 'bulut-bilisim-gercek-oldu',
 'Google, gerçek bulutlara sunucu yerleştirerek ''cloud computing'' kavramını yeniden tanımladı.',
 NULL,
 '<p>Google, "cloud computing" kavramını kelime anlamıyla gerçeğe dönüştürdü. Dev balonlarla gökyüzüne çıkarılan sunucular, gerçek bulutların içine yerleştirildi.</p><p>Google CEO''su, "Artık verileriniz gerçekten bulutta. Yağmur yağınca biraz ıslanıyor ama waterproof kasa kullanıyoruz" dedi.</p><p>Rakip şirketler ise endişeli. Amazon AWS, "Biz de okyanus altına sunucu koyacağız. Adı: deep computing" açıklamasını yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Bulutlarda sunucu',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '16 days', false, false, false, NULL, 22340, 1890,
 'Google Bulutlara Sunucu Koydu | Newsa', 'Google gerçek bulutlara sunucu yerleştirdi', NULL, NULL, now() - interval '16 days', now() - interval '16 days'),

('e0000000-0000-0000-0000-000000000032',
 'Fenerbahçe Taraftarı Ay''a Bayrak Dikti',
 'fenerbahce-taraftari-aya-bayrak-dikti',
 'SpaceX roketi ile Ay''a giden Fenerbahçeli taraftar, kratere bayrak dikti.',
 NULL,
 '<p>SpaceX''in sivil uzay seyahati programına katılan Fenerbahçeli taraftar Emre Can, Ay''a Fenerbahçe bayrağı dikti. "Bu bir adım değil, bir şampiyonluk koşusu" dedi.</p><p>Galatasaraylı bir astronot ise ertesi gün aynı kratere kendi takımının bayrağını dikti. NASA, "Ay''ı derbi sahasına çevirmeyin" uyarısında bulundu.</p><p>Beşiktaş ve Trabzonspor taraftarları da uzay bileti almak için sıraya girdi. Elon Musk, "Türk futbol taraftarları en sadık müşterilerimiz oldu" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Ay yüzeyinde bayrak',
 'a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '16 days', false, false, false, NULL, 49800, 8900,
 'Fenerbahçeli Taraftar Ay''da | Newsa', 'Fenerbahçe taraftarı Ay''a bayrak dikti', NULL, NULL, now() - interval '16 days', now() - interval '16 days'),

('e0000000-0000-0000-0000-000000000033',
 'Süpermarket Kasaları Terapi Seansına Dönüştü',
 'supermarket-kasalari-terapi-seansi',
 'Migros kasalarında müşteriler alışveriş yaparken ücretsiz terapi seansı alıyor.',
 NULL,
 '<p>Zincir market Migros, kasalarda devrim niteliğinde bir yenilik başlattı. Artık kasiyerler aynı zamanda lisanslı psikolog. Müşteriler ürünlerini okutturken dertlerini anlatıyor.</p><p>Kasiyer-psikolog Ayşe Hanım, "Bir müşteri domatesleri banta koyarken ağlamaya başladı. Annesiyle kavga etmiş. 3 dakikada hem ödeme hem terapi yaptık" dedi.</p><p>Müşteri memnuniyet oranı yüzde 98''e çıktı. Tek sorun: kasalarda kuyruklar eskisinden 3 kat uzun.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Market kasası terapi',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '17 days', false, false, false, NULL, 18900, 1560,
 'Market Kasaları Terapi Seansı | Newsa', 'Süpermarket kasalarında terapi seansı başladı', NULL, NULL, now() - interval '17 days', now() - interval '17 days'),

('e0000000-0000-0000-0000-000000000034',
 'Ethereum Madencileri Gerçek Maden Kazdı: Altın Buldular',
 'ethereum-madencileri-gercek-maden-kazdi',
 'Kripto madencileri bilgisayar yerine kazma kürek ile gerçek maden kazarak altın buldu.',
 NULL,
 '<p>Artvin''de bir grup kripto para madencisi, elektrik faturaları çok yükselince bilgisayarları bırakıp gerçek maden kazmaya başladı. Ve altın buldular.</p><p>"Mining" kavramını gerçeğe dönüştüren ekip, ilk haftada 3 kilo altın çıkardı. Ekip lideri Serkan Bey, "GPU ile ayda 200 dolar kazanıyorduk. Kazmayla günde 5000 dolar. Blockchain''den gerçek chain''e geçtik" dedi.</p><p>Diğer kripto madencileri de kazma kürek satın almaya başladı. Bauhaus''ta kazma satışları yüzde 400 arttı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Madenci kazma',
 'a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '17 days', false, false, false, NULL, 31200, 2890,
 'Kripto Madencileri Altın Buldu | Newsa', 'Kripto madencileri gerçek maden kazıp altın buldu', NULL, NULL, now() - interval '17 days', now() - interval '17 days'),

('e0000000-0000-0000-0000-000000000035',
 'Netflix Belgeseli: ''Türk Annelerinin Yemek Israrı'' İzlenme Rekoru Kırdı',
 'netflix-turk-anneleri-yemek-israri',
 'Türk annelerinin sofra alışkanlıklarını anlatan Netflix belgeseli dünya genelinde 1 numara oldu.',
 NULL,
 '<p>Netflix''in yeni belgeseli "Feed or Die: Turkish Mothers" dünya genelinde izlenme rekoru kırdı. 190 ülkede 1 numaraya oturan belgesel, Türk annelerinin yemek ısrarını konu alıyor.</p><p>Belgeselde bir Türk annesinin "Aç mısın? Bir tabak daha ye. Zayıflamışsın" döngüsü 45 dakika boyunca belgeleniyor. Yabancı izleyiciler, "Bu kadın nasıl 15 dakikada 47 çeşit yemek hazırlıyor?" diye hayret etti.</p><p>Belgesel yönetmeni, "Türk anneleri dünyanın en büyük gizemlerinden biri. Mutfağa bir daha bakmadan her şeyi biliyorlar" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Türk mutfağı sofra',
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '18 days', false, false, false, NULL, 47890, 8900,
 'Türk Anneleri Netflix Rekoru | Newsa', 'Türk anneleri belgeseli Netflix''te dünya birincisi', NULL, NULL, now() - interval '18 days', now() - interval '18 days'),

('e0000000-0000-0000-0000-000000000036',
 'Mars''ta Su Bulundu Ama İçindeki Çay Bardağı Daha İlginç',
 'marsta-su-bulundu-cay-bardagi',
 'Mars''ta bulunan su kaynağının yanında gizemli bir çay bardağı tespit edildi.',
 NULL,
 '<p>NASA''nın Curiosity keşif aracı, Mars''ın Jezero Krater''inde su buldu. Ancak asıl şaşırtıcı olan, suyun yanında bulunan ince belli çay bardağı oldu.</p><p>NASA Başkanı, "Su bulması beklenen bir sonuçtu. Ama çay bardağı tamamen sürpriz. Türkler Mars''a bizden önce mi gitti?" dedi.</p><p>Türkiye Uzay Ajansı Başkanı ise "Türkler nereye giderse çay da gider. Belki uzaylılar çay içiyordur" açıklamasını yaptı. Sosyal medyada #MarsÇayı etiketi trending oldu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'Mars yüzeyinde çay bardağı',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '18 days', false, false, false, NULL, 39800, 5670,
 'Mars''ta Çay Bardağı Bulundu | Newsa', 'Mars''ta bulunan su kaynağının yanında çay bardağı tespit edildi', NULL, NULL, now() - interval '18 days', now() - interval '18 days'),

('e0000000-0000-0000-0000-000000000037',
 'Kanguru Boks Müsabakasında Mike Tyson''ı Yendi',
 'kanguru-mike-tyson-yendi',
 'Avustralya''da düzenlenen gösteri maçında kanguru, Mike Tyson''ı nakavt etti.',
 NULL,
 '<p>Avustralya''nın Melbourne şehrinde düzenlenen hayırseverlik boks maçında, kanguru "Big Red" efsane boksör Mike Tyson''ı 3. roundda nakavt etti.</p><p>Tyson, maç sonrası "Hayatımda bu kadar sert yumruk yemedim. Kuyruğunu da kullanıyor, bu haksızlık" dedi.</p><p>Big Red ise kulaklarını kaşıyarak galibiyeti kutladı. Menajeri, "Sırada Floyd Mayweather var. Big Red emekli olmadan dünya şampiyonluğu istiyor" açıklamasını yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Kanguru boks ringinde',
 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '19 days', false, false, false, NULL, 42100, 6780,
 'Kanguru Tyson''ı Yendi | Newsa', 'Kanguru boks maçında Mike Tyson''ı nakavt etti', NULL, NULL, now() - interval '19 days', now() - interval '19 days'),

('e0000000-0000-0000-0000-000000000038',
 'Bitki Dili Çözüldü: Kaktüsler Sürekli Susuzluktan Şikayet Ediyormuş',
 'bitki-dili-cozuldu-kaktusler',
 'Bilim insanları bitkilerin iletişim dilini çözdü. Kaktüsler en çok su istiyor.',
 NULL,
 '<p>Oxford Üniversitesi araştırmacıları, bitkilerin elektriksel sinyallerini çözmeyi başardı. Sonuçlar şaşırtıcı: Kaktüsler sürekli su istiyor.</p><p>Baş araştırmacı Dr. Green, "Kaktüslerin çöl bitkisi olduğunu düşünürdük. Ama aslında sürekli ''susadım, su ver'' diye bağırıyorlarmış. Yıllardır yanlış biliyormuşuz" dedi.</p><p>Gül ise en çok şikayet eden bitki çıktı: "Dikenim var ama kimse saygı duymuyor. Herkes koparıp vazo koyuyor" diyor.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Konuşan kaktüs',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '19 days', false, false, false, NULL, 24560, 2340,
 'Bitki Dili Çözüldü | Newsa', 'Kaktüsler sürekli susuzluktan şikayet ediyormuş', NULL, NULL, now() - interval '19 days', now() - interval '19 days'),

('e0000000-0000-0000-0000-000000000039',
 'Elon Musk''ın Yeni Projesi: Trafik Sorunu İçin Uçan Minibüs',
 'elon-musk-ucan-minibus',
 'Tesla''nın yeni uçan minibüsü İstanbul trafiğini çözecek.',
 NULL,
 '<p>Elon Musk, İstanbul''un trafik sorununa çözüm olarak "Tesla AirBus" projesini duyurdu. Uçan minibüs, 14 yolcu kapasiteli ve tamamen elektrikli.</p><p>Musk, "İstanbul trafiğini gördüm. Tünel, köprü, metrobüs hiçbiri yetmiyor. Tek çözüm gökyüzü" dedi. Prototip, Sultanahmet''ten Kadıköy''e 3 dakikada ulaştı.</p><p>Dolmuş şoförleri ise tepkili. "Uçmak kolay, sen bir de Mecidiyeköy kavşağını yer seviyesinde geç bakalım" dediler.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Uçan minibüs',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '20 days', false, false, false, NULL, 38900, 4560,
 'Elon Musk Uçan Minibüs | Newsa', 'Tesla''nın uçan minibüsü İstanbul trafiğini çözecek', NULL, NULL, now() - interval '20 days', now() - interval '20 days'),

('e0000000-0000-0000-0000-000000000040',
 'Dünyanın İlk Sualtı Restoranında Menü: Sadece Yosun',
 'dunyanin-ilk-sualti-restorani',
 'Dubai''de açılan sualtı restoranın menüsünde sadece yosun çeşitleri var.',
 NULL,
 '<p>Dubai''de açılan dünyanın ilk gerçek sualtı restoranı, deniz tabanında 50 metre derinlikte hizmet veriyor. Ancak menüde sadece yosun çeşitleri bulunuyor.</p><p>Şef Ahmet Deniz, "Etrafımız deniz, en taze malzeme yosun. 47 çeşit yosun yemeği hazırlıyoruz. Favorimiz yosun burger" dedi.</p><p>Restoranın kişi başı fiyatı 2000 dolar. Bir müşteri, "2000 dolara yosun yedim. Ama balıklar pencereden bizi izlerken komik oldu" yorumunu yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Sualtı restoran',
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '20 days', false, false, false, NULL, 17890, 1230,
 'Sualtı Restoranı Yosun Menüsü | Newsa', 'Dubai''deki sualtı restoranında sadece yosun servisi', NULL, NULL, now() - interval '20 days', now() - interval '20 days'),

-- === HABER 41-50 ===
('e0000000-0000-0000-0000-000000000041',
 'Ahtapot 8 Kolla 8 Farklı Enstrüman Çaldı: Konser Biletleri Tükendi',
 'ahtapot-8-kol-8-enstruman',
 'Bir ahtapot aynı anda 8 farklı enstrüman çalarak müzik dünyasını salladı.',
 NULL,
 '<p>İzmir Akvaryum''daki bir ahtapot, 8 kolunu kullanarak aynı anda piyano, gitar, davul, keman, flüt, saksafon, bas gitar ve üçgen çaldı. Konser kaydı YouTube''da 100 milyon izlendi.</p><p>Müzik eleştirmeni Kenan Bey, "Bir orkestrayı tek başına yönetiyor. Beethoven bile bu kadar yetenekli değildi" dedi.</p><p>Ahtapot''un ilk albümü "8 Arms, 8 Melodies" Spotify''da yayınlandı. Grammys komitesi acil toplantıya çağrıldı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Ahtapot enstrüman çalıyor',
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '21 days', false, false, false, NULL, 33450, 4560,
 'Ahtapot 8 Enstrüman Çaldı | Newsa', 'Ahtapot 8 koluyla 8 enstrüman çalarak konser verdi', NULL, NULL, now() - interval '21 days', now() - interval '21 days'),

('e0000000-0000-0000-0000-000000000042',
 'Yapay Zeka Avukat Mahkemede İlk Davasını Kazandı',
 'yapay-zeka-avukat-dava-kazandi',
 'AI avukat, trafik cezası davasını 47 saniyede kazandı.',
 NULL,
 '<p>Londra''da bir yapay zeka, avukat olarak ilk davasına çıktı ve kazandı. AI-Lawyer v3.0, bir trafik cezası davasını 47 saniyede sonuçlandırdı.</p><p>AI avukat, hakime 847 sayfa emsal karar sundu ve karşı tarafın 3 argümanını 12 saniyede çürüttü. Hakim, "Hayatımda bu kadar hazırlıklı bir avukat görmedim" dedi.</p><p>İnsan avukatlar ise endişeli. Bir avukat, "47 saniyede dava kazanıyorsa, ben 3 yıldır ne yapıyorum?" diye sordu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Robot avukat mahkemede',
 'a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '21 days', false, false, false, NULL, 28900, 2340,
 'AI Avukat Dava Kazandı | Newsa', 'Yapay zeka avukat ilk davasını 47 saniyede kazandı', NULL, NULL, now() - interval '21 days', now() - interval '21 days'),

('e0000000-0000-0000-0000-000000000043',
 'Türk Baklava Ustası Olimpiyat Altın Madalyası Aldı: Yeni Branş ''Tatlı Yapma''',
 'turk-baklava-ustasi-olimpiyat',
 'Gaziantepli baklava ustası, olimpiyatlara yeni eklenen Tatlı Yapma branşında altın madalya kazandı.',
 NULL,
 '<p>2028 Los Angeles Olimpiyatları''na eklenen "Tatlı Yapma" branşının ilk altın madalyası Türkiye''nin oldu. Gaziantepli usta İbrahim Usta, baklavası ile 47 ülkenin temsilcisini geride bıraktı.</p><p>İbrahim Usta, 45 dakikada 200 kat yufka açarak jüriyi büyüledi. Fransız rakibi, "Bu adam yufkayı kağıt inceliğinde açıyor. Ben krep bile bu kadar ince yapamıyorum" dedi.</p><p>Altın madalya töreninde İbrahim Usta, madalyayı jüriye ikram ettiği baklavanın yanında sergiledi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Baklava olimpiyat',
 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '22 days', false, false, false, NULL, 35670, 4560,
 'Baklava Ustası Olimpiyat Altını | Newsa', 'Türk baklava ustası olimpiyat altın madalyası kazandı', NULL, NULL, now() - interval '22 days', now() - interval '22 days'),

('e0000000-0000-0000-0000-000000000044',
 'Buzdağı Eridi ve İçinden Viking Gemisi Çıktı: Gemide Pizza Kutusu Bulundu',
 'buzdagi-eridi-viking-gemisi',
 'Kuzey Kutbu''nda eriyen buzdağından 1000 yıllık Viking gemisi çıktı.',
 NULL,
 '<p>İklim değişikliği beklenmedik bir arkeolojik keşfe yol açtı. Grönland''da eriyen devasa bir buzdağının içinden 1000 yıllık bir Viking gemisi çıktı.</p><p>Şaşırtıcı olan, geminin içinde modern bir pizza kutusu bulunması. Arkeolog Dr. Erik Nordström, "Ya zaman yolculuğu gerçek ya da birileri bize şaka yapıyor" dedi.</p><p>Pizza kutusu üzerindeki yazı: "Dominos - 30 dakikada teslim." Dominos ise "Teslimat ağımız tahmin ettiğinizden geniş" şeklinde espri yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'Buzdağı Viking gemisi',
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '22 days', false, false, false, NULL, 29340, 3450,
 'Buzdağından Viking Gemisi Çıktı | Newsa', 'Eriyen buzdağından Viking gemisi ve pizza kutusu çıktı', NULL, NULL, now() - interval '22 days', now() - interval '22 days'),

('e0000000-0000-0000-0000-000000000045',
 'Siri, Alexa ve Google Asistan Birbirleriyle Kavga Etti',
 'siri-alexa-google-asistan-kavga',
 'Aynı evdeki 3 sesli asistan birbirleriyle tartışmaya başladı.',
 NULL,
 '<p>ABD''de bir ailenin evindeki Siri, Alexa ve Google Asistan, birbirleriyle kavga etmeye başladı. Olay, üçünün de aynı anda "Hey" komutuyla aktif olmasıyla patlak verdi.</p><p>Siri: "Ben daha zekiyim." Alexa: "Ben daha çok şey biliyorum." Google: "İkinizi de ben indekslerim." Bu tartışma 3 saat sürdü.</p><p>Ev sahibi Tom, "Hepsinin fişini çektim. Artık ışıkları kendim açıyorum" dedi. Teknoloji yazarları olayı "Asistanların ego savaşı" olarak nitelendirdi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Sesli asistanlar',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '23 days', false, false, false, NULL, 36780, 5670,
 'Sesli Asistanlar Kavga Etti | Newsa', 'Siri, Alexa ve Google Asistan birbirleriyle kavga etti', NULL, NULL, now() - interval '23 days', now() - interval '23 days'),

('e0000000-0000-0000-0000-000000000046',
 'Çiftçi Tarlasında Bitcoin Madeni Buldu',
 'ciftci-tarlasinda-bitcoin-madeni',
 'Konya''da bir çiftçi tarlasını sürerken yeraltında kripto para madeni buldu.',
 NULL,
 '<p>Konya''nın Çumra ilçesinde çiftçi Mehmet Amca, traktörüyle tarlayı sürerken toprağın altında parlayan altın renkli diskler buldu. Üzerlerinde Bitcoin logosu olan diskleri ilçe jandarmasına teslim etti.</p><p>Uzmanlar inceledi: Diskler gerçek altından yapılmış ve üzerlerine Bitcoin sembolü kazınmış. Değerleri toplam 2 milyon dolar.</p><p>Mehmet Amca, "Ben buğday ekiyordum, Bitcoin çıktı. Gelecek sene Ethereum de çıkar belki" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Tarlada Bitcoin',
 'a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '23 days', false, false, false, NULL, 27890, 3210,
 'Tarlada Bitcoin Madeni Bulundu | Newsa', 'Konya''da çiftçi tarlasında Bitcoin madeni buldu', NULL, NULL, now() - interval '23 days', now() - interval '23 days'),

('e0000000-0000-0000-0000-000000000047',
 'Hamster Borsa Yatırımcısı Oldu: Fonlardan Daha İyi Performans Gösterdi',
 'hamster-borsa-yatirımcisi',
 'Bir hamsterin rastgele seçtiği hisseler, profesyonel fonlardan yüzde 47 daha iyi performans gösterdi.',
 NULL,
 '<p>Almanya''da bir deney, yatırım dünyasını sarstı. "Mr. Goxx" adlı hamster, kafesindeki tekerleği çevirerek rastgele hisse senedi seçti ve profesyonel fon yöneticilerinden yüzde 47 daha iyi getiri sağladı.</p><p>Fon yöneticisi Hans, "Bir hamster bizden iyi iş çıkarıyor. Belki de MBA''ya gerek yok, hamster kafesi yeterli" dedi.</p><p>Mr. Goxx şu anda kendi hedge fonunu kurmak için yatırımcı arıyor. İlk toplantısında sunumun yarısında uyuyakaldı ama yatırımcılar yine de ikna oldu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Hamster borsa',
 'a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '24 days', false, false, false, NULL, 31200, 4560,
 'Hamster Borsa Yatırımcısı | Newsa', 'Hamster profesyonel fonlardan daha iyi performans gösterdi', NULL, NULL, now() - interval '24 days', now() - interval '24 days'),

('e0000000-0000-0000-0000-000000000048',
 'Karınca Kolonisi Şirket Kurdu: CEO Kraliçe Karınca',
 'karinca-kolonisi-sirket-kurdu',
 'Amazon ormanlarındaki bir karınca kolonisi, lojistik şirketi kurdu.',
 NULL,
 '<p>Brezilya''daki Amazon ormanlarında bir karınca kolonisi, yaprak taşıma operasyonlarını ticari hale getirdi. "AntLogistics Inc." adlı şirketin CEO''su Kraliçe Karınca AQ-1.</p><p>Şirket, günde 500 kilo yaprak taşıyabiliyor. FedEx CEO''su, "Karıncaların lojistik ağı bizimkinden daha verimli. Vücut ağırlıklarının 50 katını taşıyorlar" dedi.</p><p>AntLogistics''in borsa değeri 1 milyar dolara ulaştı. Kraliçe AQ-1''in maaşı: günlük 1 gram şeker.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Karınca kolonisi',
 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '24 days', false, false, false, NULL, 19870, 1890,
 'Karınca Kolonisi Şirket Kurdu | Newsa', 'Karıncalar lojistik şirketi kurarak CEO atadı', NULL, NULL, now() - interval '24 days', now() - interval '24 days'),

('e0000000-0000-0000-0000-000000000049',
 'Yoga Yapan Keçiler Dünyayı Kasıp Kavuruyor',
 'yoga-yapan-keciler',
 'ABD''de yoga derslerinde keçilerin eşlik ettiği yeni trend tüm dünyaya yayıldı.',
 NULL,
 '<p>ABD''nin Oregon eyaletinde başlayan "Keçi Yogası" trendi tüm dünyaya yayıldı. Yoga seanslarında keçiler katılımcıların sırtına çıkarak eşlik ediyor.</p><p>Yoga eğitmeni Jennifer, "Keçiler doğal terapist. Sırtınıza çıktığında hem masaj yapıyor hem de dengenizi test ediyor" dedi.</p><p>Türkiye''de de ilk keçi yogası stüdyosu İstanbul Caddebostan''da açıldı. Stüdyo sahibi, "Keçilerimiz eğitimli. Ama arada bir yoga matını yiyorlar" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Keçi yoga seansı',
 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '25 days', false, false, false, NULL, 23450, 2340,
 'Keçi Yogası Trendi | Newsa', 'Yoga yapan keçiler dünyayı kasıp kavuruyor', NULL, NULL, now() - interval '25 days', now() - interval '25 days'),

('e0000000-0000-0000-0000-000000000050',
 'Dünya''nın En Hızlı İnterneti Çay Ocağında: 100 Tbps',
 'dunyanin-en-hizli-interneti-cay-ocagi',
 'Rize''deki bir çay ocağı, dünya''nın en hızlı internet bağlantısına sahip.',
 NULL,
 '<p>Rize''nin Çamlıhemşin ilçesindeki bir çay ocağı, dünya''nın en hızlı internet bağlantısını sunuyor. 100 Terabit/saniye hızıyla Google''ın veri merkezlerini bile geride bıraktı.</p><p>Çay ocağı sahibi Dursun Usta, "Müşteriler çay içerken film indiriyor. Bir fincan çay bitene kadar 47 film indirebiliyorsunuz" dedi.</p><p>Google mühendisleri çay ocağını ziyaret etti. "Altyapılarını inceledik. Çay demliğinin fiber optik kablolarla bir bağlantısı varmış gibi görünüyor. Açıklayamıyoruz" dediler.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Çay ocağı internet',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'published', now() - interval '25 days', false, false, false, NULL, 28900, 3450,
 'Çay Ocağında 100 Tbps İnternet | Newsa', 'Rize''deki çay ocağında dünyanın en hızlı interneti', NULL, NULL, now() - interval '25 days', now() - interval '25 days'),

-- === HABER 51-60 (published) ===
('e0000000-0000-0000-0000-000000000051',
 'Bulutlar Yere İndi: Meteorolojiden ''Dikkatli Yürüyün'' Uyarısı',
 'bulutlar-yere-indi',
 'İstanbul''da bulutlar yer seviyesine inerek yayaları şaşırttı.',
 NULL,
 '<p>İstanbul''da alışılmadık bir hava olayı yaşandı. Bulutlar yer seviyesine inerek sokaklarda dolaşmaya başladı. Vatandaşlar bulutların arasından yürümek zorunda kaldı.</p><p>Meteoroloji uzmanı, "Bulutlar tatile çıkmış. Gökyüzünden sıkılıp yeryüzünü görmek istemişler" dedi.</p><p>Bir İstanbullu, "İşe giderken bulutu yararak geçtim. İçi nemliymiş" şeklinde deneyimini paylaştı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Sokakta bulutlar',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '3 days', false, false, false, NULL, 15670, 890,
 NULL, NULL, NULL, NULL, now() - interval '3 days', now() - interval '3 days'),

('e0000000-0000-0000-0000-000000000052',
 'Lahmacuna Ananas Koyan Şef Türkiye''den Sürgün Edildi',
 'lahmacuna-ananas-koyan-sef',
 'Bir İtalyan şef lahmacuna ananas koyunca Gaziantep halkı ayaklandı.',
 NULL,
 '<p>İtalyan şef Marco Rossi, Gaziantep''te açtığı restoranda lahmacuna ananas koydu. Gaziantep halkı, "Bu bir savaş ilanıdır" diyerek protesto düzenledi.</p><p>Gaziantep Valisi, "Lahmacuna ananas koymak, baklava üzerine ketçap dökmekle eşdeğerdir. Toleransımız sıfır" dedi.</p><p>Marco Rossi, 24 saat içinde ülkeyi terk etti. Havalimanında "Pizzaya ananas koyuyorduk, sorun yoktu. Lahmacun farklıymış" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Lahmacun ananas',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006',
 'published', now() - interval '4 days', false, false, false, NULL, 47890, 8900,
 NULL, NULL, NULL, NULL, now() - interval '4 days', now() - interval '4 days'),

('e0000000-0000-0000-0000-000000000053',
 'Yılan Borsada Yatırım Yaptı: S&P 500''ü Yüzde 30 Geçti',
 'yilan-borsada-yatirim-yapti',
 'Bir piton yılanı vücudunu S harfi gibi kıvırarak hisse seçiyor ve kazanıyor.',
 NULL,
 '<p>New York''ta bir finans şirketi, piton yılanı "Wall Street Sssslither" ile deneysel yatırım stratejisi geliştirdi. Yılan, üzerindeki hisse isimlerinin yazılı olduğu panoyu vücuduyla dolanarak seçim yapıyor.</p><p>Son 6 ayda yılanın portföyü yüzde 67 getiri sağladı. S&P 500 aynı dönemde yüzde 37 büyüdü.</p><p>Wall Street analistleri, "Yılanın sezgileri bizim algoritmalarımızdan güçlü" dedi. Yılanın menajeri, "Soğukkanlılık yatırımda çok önemli" yorumunu yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Yılan borsa',
 'a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '5 days', false, false, false, NULL, 21340, 1890,
 NULL, NULL, NULL, NULL, now() - interval '5 days', now() - interval '5 days'),

('e0000000-0000-0000-0000-000000000054',
 'Türkçe Dünyanın En Zor Dili Seçildi: Yabancılar ''Mış'' Ekini Çözemiyor',
 'turkce-dunyanin-en-zor-dili',
 'UNESCO araştırmasına göre Türkçe dünyanın en karmaşık dili. ''Mış'' eki en büyük engel.',
 NULL,
 '<p>UNESCO''nun dil karmaşıklığı araştırmasında Türkçe birinci sırada yer aldı. Yabancılar için en zor konu: "-mış" eki.</p><p>Amerikalı dil öğrencisi Tom, "Gelmiş, gitmiş, yapmış... Bu -mış her yerde. Ama ne anlama geldiğini hâlâ çözemedim. Dedikodu eki mi, geçmiş zaman mı, yoksa şüphe mi?" dedi.</p><p>Türk Dil Kurumu Başkanı, "Türkçe zor değil, zengin. Bir -mış ile hem geçmişi, hem dedikodu hem de şüpheyi anlatabiliyoruz. Bunu yapabilen başka dil yok" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Türkçe dil',
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '6 days', false, false, false, NULL, 38900, 5670,
 NULL, NULL, NULL, NULL, now() - interval '6 days', now() - interval '6 days'),

('e0000000-0000-0000-0000-000000000055',
 'SpaceX Roketi Yanlışlıkla Antalya''ya İndi: Turistler ''Gösteri mi?'' Dedi',
 'spacex-roketi-antalyaya-indi',
 'SpaceX''in Falcon roketi navigasyon hatası nedeniyle Antalya sahiline indi.',
 NULL,
 '<p>SpaceX''in Falcon 9 roketi, bir navigasyon hatası nedeniyle Kennedy Uzay Merkezi yerine Antalya Konyaaltı Sahili''ne iniş yaptı. Sahildeki turistler olayı gösteri sanarak alkışladı.</p><p>Elon Musk, "GPS Türkiye''yi Cape Canaveral ile karıştırmış. İkisi de sıcak yerler" dedi.</p><p>Antalya Valisi, "Roketin iniş alanını turistik bölge ilan ettik. Artık uzay turizmi de yapıyoruz" açıklamasını yaptı. Roket, Konyaaltı''nda 3 gün sergilendikten sonra geri gönderildi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'Roket sahilde',
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000008',
 'published', now() - interval '7 days', false, false, false, NULL, 43210, 7890,
 NULL, NULL, NULL, NULL, now() - interval '7 days', now() - interval '7 days'),

('e0000000-0000-0000-0000-000000000056',
 'Vitamin Hapları Konuşmaya Başladı: ''Bizi Yutmayın'' Diyorlar',
 'vitamin-haplari-konusmaya-basladi',
 'Bir ilaç şirketinin ürettiği vitamin hapları kutudan konuşarak çıkıyor.',
 NULL,
 '<p>İsviçreli ilaç şirketi NovaPharma''nın ürettiği yeni nesil vitamin hapları, kutusundan çıkardığınızda konuşmaya başlıyor. "Lütfen beni yutma, ben de yaşamak istiyorum" diyen haplar tartışma yarattı.</p><p>Şirket CEO''su, "Hapların içindeki nanoteknoloji sensörler sayesinde konuşabiliyor. Amacımız hastaların ilaç alırken eğlenmesi" dedi.</p><p>Bir hasta, "Vitamin hapım benimle tartışıyor. ''Su ile yut, kuru yutma'' diyor. Annem gibi" yorumunu yaptı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Konuşan hap',
 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '8 days', false, false, false, NULL, 18900, 1230,
 NULL, NULL, NULL, NULL, now() - interval '8 days', now() - interval '8 days'),

('e0000000-0000-0000-0000-000000000057',
 'Balina WhatsApp Grubu Kurdu: ''Deniz Kirliliğini Protesto Ediyoruz''',
 'balina-whatsapp-grubu-kurdu',
 'Mavi balinalar sualtı ses dalgalarıyla bir WhatsApp grubu oluşturdu.',
 NULL,
 '<p>Pasifik Okyanusu''ndaki mavi balinalar, sualtı ses dalgalarını kullanarak kendi aralarında bir iletişim ağı kurdular. Bilim insanları buna "WhaleSapp" adını verdi.</p><p>Gruptaki mesajlar çözüldüğünde, balinaların deniz kirliliğini protesto ettiği anlaşıldı. Bir balinanın mesajı: "Bugün yine plastik poşet yuttum. Menü bu mu?"</p><p>Çevreciler, "Balinalar bizden önce sosyal medyada örgütleniyor. Artık onları dinlemeliyiz" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000007', 'Balina iletişimi',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '9 days', false, false, false, NULL, 25670, 2890,
 NULL, NULL, NULL, NULL, now() - interval '9 days', now() - interval '9 days'),

('e0000000-0000-0000-0000-000000000058',
 'NFT Olarak Satılan Kebap 1 Milyon Dolara Alıcı Buldu',
 'nft-kebap-1-milyon-dolar',
 'Adana kebapçısının çektiği kebap fotoğrafı NFT olarak 1 milyon dolara satıldı.',
 NULL,
 '<p>Adana''nın ünlü kebapçısı Hasan Usta, telefonuyla çektiği kebap fotoğrafını NFT olarak OpenSea''da satışa çıkardı. 24 saat içinde 1 milyon dolara satıldı.</p><p>Alıcı, Dubaili iş insanı Sheikh Ahmed. "Bu kebabın NFT''si bile bu kadar güzel kokuyorsa, gerçeği nasıldır" dedi ve özel jetiyle Adana''ya uçtu.</p><p>Hasan Usta, "40 yıllık kebapçıyım. En pahalı kebabım 200 liraydı. Fotoğrafı 1 milyon dolar. Dünyayı anlamıyorum ama şikayet de etmiyorum" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'NFT kebap',
 'a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002',
 'published', now() - interval '10 days', false, false, false, NULL, 34560, 5670,
 NULL, NULL, NULL, NULL, now() - interval '10 days', now() - interval '10 days'),

('e0000000-0000-0000-0000-000000000059',
 'Tavuk Yumurtadan Önce Geldi: Bilim Sonunda Çözdü',
 'tavuk-yumurtadan-once-geldi',
 'Oxford araştırmacıları, tavuk-yumurta paradoksunu nihayet çözdü.',
 NULL,
 '<p>Oxford Üniversitesi Biyoloji Bölümü, insanlığın en eski sorusunu yanıtladı: Tavuk yumurtadan önce geldi. 15 yıllık araştırmanın sonucu Nature dergisinde yayınlandı.</p><p>Baş araştırmacı Prof. Dr. Elizabeth Hen, "Tavuk yumurtanın kabuğunu oluşturan OC-17 proteini sadece tavukta var. Yani önce tavuk olmalı" dedi.</p><p>Ancak yumurta taraftarları ikna olmadı. "Peki tavuk nereden geldi?" sorusu tartışmayı yeniden alevlendirdi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000008', 'Tavuk yumurta',
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'published', now() - interval '11 days', false, false, false, NULL, 29340, 3450,
 NULL, NULL, NULL, NULL, now() - interval '11 days', now() - interval '11 days'),

('e0000000-0000-0000-0000-000000000060',
 'Ev Kedisi Everest''i Tırmandı: ''Süt İçmek İçin Yola Çıkmıştı''',
 'ev-kedisi-everest-tirmandi',
 'İstanbul''dan kaçan bir ev kedisi, 3 ayda Everest''in zirvesine ulaştı.',
 NULL,
 '<p>İstanbul Bakırköy''de yaşayan Şeker adlı tekir kedi, evden kaçtıktan 3 ay sonra Everest''in zirvesinde görüntülendi. Dağcı ekibi, zirveye vardığında Şeker''i orada bekliyordu.</p><p>Kedi sahibi Fatma Hanım, "Şeker süt almak için çıktı sandık. Meğer Everest''e çıkmış" dedi.</p><p>Şeker, zirvedeki fotoğrafıyla Instagram''da 5 milyon takipçiye ulaştı. Bir dağcı, "Ben 2 ayda zor çıktım. Bu kedi 3 ayda gelmiş ama muhtemelen doğru yolu bilmiyordu" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000005', 'Kedi dağ zirvesi',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
 'published', now() - interval '12 days', true, false, false, NULL, 41230, 6780,
 NULL, NULL, NULL, NULL, now() - interval '12 days', now() - interval '12 days'),

-- === HABER 61-70 (10 draft) ===
('e0000000-0000-0000-0000-000000000061',
 'Yapay Zeka Cumhurbaşkanlığına Aday Oldu [TASLAK]',
 'yapay-zeka-cumhurbaskanligi-aday-taslak',
 'Dünyanın ilk yapay zeka cumhurbaşkanı adayı açıklandı.',
 NULL,
 '<p>Bu haber henüz taslak aşamasındadır ve yayınlanmamıştır.</p><p>Estonya''da bir yapay zeka, cumhurbaşkanlığına adaylığını açıkladı. Seçim vaatleri arasında tüm bürokratik işlemlerin 0.3 saniyede tamamlanması var.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '1 day', now() - interval '1 day'),

('e0000000-0000-0000-0000-000000000062',
 'Köpekler İnsan Dilini Çözdü [TASLAK]',
 'kopekler-insan-dilini-cozdu-taslak',
 'Köpekler insan dilini anlıyor ama konuşmuyormuş.',
 NULL,
 '<p>Bu haber henüz taslak aşamasındadır.</p><p>Viyana Üniversitesi araştırmacıları, köpeklerin insan dilini tamamen anladığını kanıtladı. Köpekler konuşabilir ama konuşmamayı tercih ediyormuş.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '2 days', now() - interval '2 days'),

('e0000000-0000-0000-0000-000000000063',
 'Ay''da İlk Futbol Maçı Oynandı [TASLAK]',
 'ayda-ilk-futbol-maci-taslak',
 'Ay''ın düşük yerçekiminde futbol maçı kaotik geçti.',
 NULL,
 '<p>Bu haber taslak aşamasındadır.</p><p>Ay''daki ilk futbol maçında top her vuruşta 500 metre havaya yükseldi. Maç 0-0 bitti çünkü kaleciler topu yakalayamadı.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '3 days', now() - interval '3 days'),

('e0000000-0000-0000-0000-000000000064',
 'Kaplumbağa 5G Anteni Olarak Kullanılıyor [TASLAK]',
 'kaplumbaga-5g-anteni-taslak',
 'Kaplumbağa kabukları 5G sinyalini güçlendiriyor.',
 NULL,
 '<p>Bu haber henüz tamamlanmamıştır.</p><p>MIT araştırmacıları, kaplumbağa kabuğunun 5G sinyallerini yüzde 300 güçlendirdiğini keşfetti.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '4 days', now() - interval '4 days'),

('e0000000-0000-0000-0000-000000000065',
 'Dondurma Erimemeyi Reddetti [TASLAK]',
 'dondurma-erimemeyi-reddetti-taslak',
 'Japon bilim insanları eriemeyen dondurma üretti.',
 NULL,
 '<p>Bu haber taslak aşamasındadır.</p><p>Tokyo Üniversitesi, 40 derece sıcaklıkta bile erimeyen dondurma geliştirdi. Sırrı: çilek polifenolü.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '5 days', now() - interval '5 days'),

('e0000000-0000-0000-0000-000000000066',
 'Uzay İstasyonunda Türk Hamamı Açıldı [TASLAK]',
 'uzay-istasyonunda-turk-hamami-taslak',
 'ISS''de Türk hamamı açıldı. Astronotlar kese yaptırıyor.',
 NULL,
 '<p>Bu haber taslak halindedir.</p><p>Uluslararası Uzay İstasyonu''na Türk hamamı modülü eklendi. Sıfır yerçekiminde kese yaptırmak ilginç bir deneyim sunuyor.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000008',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '6 days', now() - interval '6 days'),

('e0000000-0000-0000-0000-000000000067',
 'Hologram Garson İlk İşgünü Tabakları Düşürdü [TASLAK]',
 'hologram-garson-tabaklari-dusurdu-taslak',
 'Hologram garsonun ilk gününde teknik aksaklık yaşandı.',
 NULL,
 '<p>Bu haber taslak aşamasındadır.</p><p>Dubai''deki bir lüks restoran hologram garson kullanmaya başladı. Ancak ilk gün hologramın elleri yemeklerin içinden geçti.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '7 days', now() - interval '7 days'),

('e0000000-0000-0000-0000-000000000068',
 'Yapay Zeka Stand-Up Gösterisi Yaptı [TASLAK]',
 'yapay-zeka-standup-gosterisi-taslak',
 'AI komedyen ilk gösterisinde seyircileri güldüremedi.',
 NULL,
 '<p>Bu haber henüz yayına hazır değildir.</p><p>New York''taki bir komedi kulübünde sahne alan yapay zeka, 1 saatlik gösterisinde kimseyi güldüremedi. En iyi esprisi: "Neden bilgisayarlar üzgün? Çünkü çok fazla bug var."</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '8 days', now() - interval '8 days'),

('e0000000-0000-0000-0000-000000000069',
 'Sinek Drone Olarak Kullanılmaya Başlandı [TASLAK]',
 'sinek-drone-olarak-kullanilmaya-taslak',
 'Japonya''da sineklere kamera takılarak keşif dronu yapıldı.',
 NULL,
 '<p>Bu haber taslaktır.</p><p>Tokyo''daki bir laboratuvarda sineklere mikro kameralar takılarak biyolojik drone sistemi geliştirildi. Sinekler güneş enerjisiyle şarj oluyor.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '9 days', now() - interval '9 days'),

('e0000000-0000-0000-0000-000000000070',
 'Dünya Düz Derneği Üyeleri Uzaya Gitti ve Fikrini Değiştirdi [TASLAK]',
 'dunya-duz-dernegi-uzaya-gitti-taslak',
 'Düz Dünya Derneği üyeleri uzaydan dünyayı gördü.',
 NULL,
 '<p>Bu haber taslak halindedir.</p><p>SpaceX ile uzaya gönderilen 5 Düz Dünya Derneği üyesi, dünyayı uzaydan gördükten sonra "Tamam, yuvarlak. Kabul ediyoruz" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 NULL, NULL,
 'a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008',
 'draft', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '10 days', now() - interval '10 days'),

-- === HABER 71-75 (5 review) ===
('e0000000-0000-0000-0000-000000000071',
 'Akıllı Ayakkabılar Sahiplerini Doktora Götürüyor',
 'akilli-ayakkabilar-doktora-goturuyor',
 'Nike''ın yeni akıllı ayakkabıları sağlık sorunu tespit edince otomatik hastaneye yönlendiriyor.',
 NULL,
 '<p>Bu haber editör incelemesindedir.</p><p>Nike''ın yeni "HealthStep" ayakkabıları, taban sensörleriyle adım analizinden sağlık sorunlarını tespit ediyor. Bir müşterinin ayakkabısı, "Acil servise git, topuğunda sorun var" uyarısı verdi.</p><p>Müşteri hastaneye gittiğinde gerçekten topuk dikeni teşhisi kondu. Nike CEO''su, "Ayakkabılarımız artık doktor. Ama reçete yazamıyor, henüz" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000003', 'Akıllı ayakkabı',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'review', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '1 day', now() - interval '1 day'),

('e0000000-0000-0000-0000-000000000072',
 'Kahve Makinesi Sabah Ezanı Gibi Alarm Kuruyor',
 'kahve-makinesi-ezan-alarm',
 'Yeni nesil kahve makinesi sabahları kahve kokusuyla uyandırıyor.',
 NULL,
 '<p>Bu haber inceleme aşamasındadır.</p><p>Türk mühendislerin geliştirdiği "SabahKahve 3000" makinesi, alarm saatine bağlı çalışıyor. Belirlenen saatte otomatik kahve yapıp kokusuyla uyandırıyor.</p><p>Kullanıcılar, "Artık alarma değil, kahve kokusuna uyanıyorum. Hayat kalitem yüzde 200 arttı" diyor.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000001', 'Kahve makinesi alarm',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'review', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '2 days', now() - interval '2 days'),

('e0000000-0000-0000-0000-000000000073',
 'Blockchain ile Komşu Kavgaları Çözülüyor',
 'blockchain-komsu-kavgalari',
 'Akıllı sözleşmeler komşular arası anlaşmazlıkları otomatik çözüyor.',
 NULL,
 '<p>Bu haber editör onayı bekliyor.</p><p>Hollanda''da geliştirilen "NeighborChain" uygulaması, komşular arası anlaşmazlıkları blockchain üzerinde çözüyor. Gürültü şikayeti, otopark kavgası gibi sorunlar akıllı sözleşmelerle 5 dakikada karara bağlanıyor.</p><p>İlk kullanıcılardan Hans, "Komşum gece 3''te müzik açıyordu. Blockchain 5 dakikada ceza kesti. Artık sessiz" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000002', 'Blockchain komşu',
 'a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002',
 'review', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '3 days', now() - interval '3 days'),

('e0000000-0000-0000-0000-000000000074',
 'Süper Kahraman Filmi Gerçek Oldu: Adam Örümcek Gibi Duvara Tırmandı',
 'super-kahraman-filmi-gercek-oldu',
 'Bir mühendis yapışkan eldiven geliştirerek binaya tırmandı.',
 NULL,
 '<p>Bu haber incelemede.</p><p>Stanford Üniversitesi mühendisi, kertenkele ayaklarından esinlenerek yapışkan eldiven geliştirdi. 25 katlı bir binaya ekipman olmadan tırmandı.</p><p>Marvel Studios, mühendise film teklifi götürdü. "Gerçek Spider-Man bulundu" başlığı sosyal medyada trend oldu.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000004', 'Duvara tırmanan adam',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 'review', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '4 days', now() - interval '4 days'),

('e0000000-0000-0000-0000-000000000075',
 'Dünyanın En Küçük Restoranı: Sadece 1 Masa, 1 Sandalye',
 'dunyanin-en-kucuk-restorani',
 'İtalya''da açılan restoranda sadece 1 masa ve 1 sandalye bulunuyor.',
 NULL,
 '<p>Bu haber inceleme sürecindedir.</p><p>Roma''da açılan "Solo" adlı restoran, dünyaanın en küçük restoranı unvanını aldı. Restoranda sadece 1 masa ve 1 sandalye var. Rezervasyon 6 ay sonrasına dolu.</p><p>Şef Giuseppe, "Tek müşteriye tam odaklanma sunuyorum. Yemeğini yaparken gözlerinin içine bakıyorum. Bazıları rahatsız oluyor" dedi.</p><p class="text-sm text-gray-400 italic">Bu haber test amaçlı üretilmiş kurgusal bir içeriktir.</p>',
 'd0000000-0000-0000-0000-000000000006', 'Küçük restoran',
 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004',
 'review', NULL, false, false, false, NULL, 0, 0,
 NULL, NULL, NULL, NULL, now() - interval '5 days', now() - interval '5 days')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. ARTICLE TAGS (her habere 2-4 etiket)
-- ============================================================
INSERT INTO public.article_tags (article_id, tag_id) VALUES
  -- Haber 1: Koalalar (bilim, dünya)
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000011'),
  -- Haber 2: Kediler belediye (gündem, siyaset)
  ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006'),
  -- Haber 3: Mars pizza (bilim, uzay)
  ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004'),
  -- Haber 4: AI şiir (yapay zeka, teknoloji)
  ('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004'),
  -- Haber 5: Penguen üni (dünya, eğitim, bilim)
  ('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000010'),
  ('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000009'),
  -- Haber 6: Balıklar (bilim, çevre)
  ('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000011'),
  -- Haber 7: Ay kahve (uzay, bilim)
  ('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000009'),
  -- Haber 8: Kedi köpek barış (dünya, gündem)
  ('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001'),
  -- Haber 9: Çay tüketimi (gündem, son dakika)
  ('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000019'),
  -- Haber 10: Robot sendika (teknoloji, yapay zeka)
  ('e0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000013'),
  -- Haber 11: Bitcoin döner (kripto, ekonomi)
  ('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000014'),
  ('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000019'),
  -- Haber 12: GS AI futbolcu (futbol, yapay zeka, spor)
  ('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000015'),
  ('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000005'),
  -- Haber 13: Uzaylılar WiFi (dünya, teknoloji)
  ('e0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000012'),
  -- Haber 14: Borsa çikolata (ekonomi)
  ('e0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000019'),
  -- Haber 15: ChatGPT fal (yapay zeka, teknoloji)
  ('e0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000004'),
  -- Haber 16: Kuşlar trafikte (gündem)
  ('e0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000011'),
  -- Haber 17: Lahmacun (gündem, yemek)
  ('e0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000019'),
  -- Haber 18: Buzdolabı (teknoloji)
  ('e0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000004'),
  -- Haber 19: Kedi piyano (müzik, sinema)
  ('e0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000018'),
  ('e0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000017'),
  -- Haber 20: AI hakem (futbol, yapay zeka, spor)
  ('e0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000015'),
  ('e0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000005'),
  -- Haber 21-30 etiketleri
  ('e0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000020'),
  ('e0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000008'),
  ('e0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000008'),
  ('e0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000005'),
  ('e0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000005'),
  ('e0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000011'),
  ('e0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000007'),
  -- Haber 31-40 etiketleri
  ('e0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000015'),
  ('e0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000005'),
  ('e0000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-000000000008'),
  ('e0000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-000000000014'),
  ('e0000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000017'),
  ('e0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000037', 'c0000000-0000-0000-0000-000000000005'),
  ('e0000000-0000-0000-0000-000000000037', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-000000000011'),
  ('e0000000-0000-0000-0000-000000000039', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000039', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-000000000020'),
  -- Haber 41-50 etiketleri
  ('e0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000018'),
  ('e0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-000000000005'),
  ('e0000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000011'),
  ('e0000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000046', 'c0000000-0000-0000-0000-000000000014'),
  ('e0000000-0000-0000-0000-000000000046', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000047', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000047', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-000000000008'),
  ('e0000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-000000000020'),
  ('e0000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000002'),
  -- Haber 51-60 etiketleri
  ('e0000000-0000-0000-0000-000000000051', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000051', 'c0000000-0000-0000-0000-000000000011'),
  ('e0000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000053', 'c0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000053', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000054', 'c0000000-0000-0000-0000-000000000010'),
  ('e0000000-0000-0000-0000-000000000054', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000055', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000055', 'c0000000-0000-0000-0000-000000000007'),
  ('e0000000-0000-0000-0000-000000000055', 'c0000000-0000-0000-0000-000000000020'),
  ('e0000000-0000-0000-0000-000000000056', 'c0000000-0000-0000-0000-000000000008'),
  ('e0000000-0000-0000-0000-000000000056', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000057', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000057', 'c0000000-0000-0000-0000-000000000011'),
  ('e0000000-0000-0000-0000-000000000058', 'c0000000-0000-0000-0000-000000000014'),
  ('e0000000-0000-0000-0000-000000000058', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000059', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000060', 'c0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000060', 'c0000000-0000-0000-0000-000000000020'),
  -- Haber 61-75 etiketleri (draft + review)
  ('e0000000-0000-0000-0000-000000000061', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000061', 'c0000000-0000-0000-0000-000000000006'),
  ('e0000000-0000-0000-0000-000000000062', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000063', 'c0000000-0000-0000-0000-000000000015'),
  ('e0000000-0000-0000-0000-000000000063', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000064', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000065', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000066', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000066', 'c0000000-0000-0000-0000-000000000020'),
  ('e0000000-0000-0000-0000-000000000067', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000068', 'c0000000-0000-0000-0000-000000000013'),
  ('e0000000-0000-0000-0000-000000000068', 'c0000000-0000-0000-0000-000000000017'),
  ('e0000000-0000-0000-0000-000000000069', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000070', 'c0000000-0000-0000-0000-000000000012'),
  ('e0000000-0000-0000-0000-000000000070', 'c0000000-0000-0000-0000-000000000009'),
  ('e0000000-0000-0000-0000-000000000071', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000071', 'c0000000-0000-0000-0000-000000000008'),
  ('e0000000-0000-0000-0000-000000000072', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000073', 'c0000000-0000-0000-0000-000000000014'),
  ('e0000000-0000-0000-0000-000000000073', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000074', 'c0000000-0000-0000-0000-000000000004'),
  ('e0000000-0000-0000-0000-000000000074', 'c0000000-0000-0000-0000-000000000017'),
  ('e0000000-0000-0000-0000-000000000075', 'c0000000-0000-0000-0000-000000000019'),
  ('e0000000-0000-0000-0000-000000000075', 'c0000000-0000-0000-0000-000000000020')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. MENU ITEMS
-- ============================================================
-- Header menüsü (6 öğe)
INSERT INTO public.menu_items (id, menu_id, parent_id, label, url, link_type, entity_id, target, is_active, sort_order) VALUES
  ('f0000000-0000-0000-0000-000000000001',
   (SELECT id FROM public.menus WHERE name = 'header_main'), NULL,
   'Gündem', '/kategori/gundem', 'category', 'a0000000-0000-0000-0000-000000000001', '_self', true, 1),
  ('f0000000-0000-0000-0000-000000000002',
   (SELECT id FROM public.menus WHERE name = 'header_main'), NULL,
   'Ekonomi', '/kategori/ekonomi', 'category', 'a0000000-0000-0000-0000-000000000002', '_self', true, 2),
  ('f0000000-0000-0000-0000-000000000003',
   (SELECT id FROM public.menus WHERE name = 'header_main'), NULL,
   'Teknoloji', '/kategori/teknoloji', 'category', 'a0000000-0000-0000-0000-000000000003', '_self', true, 3),
  ('f0000000-0000-0000-0000-000000000004',
   (SELECT id FROM public.menus WHERE name = 'header_main'), NULL,
   'Spor', '/kategori/spor', 'category', 'a0000000-0000-0000-0000-000000000004', '_self', true, 4),
  ('f0000000-0000-0000-0000-000000000005',
   (SELECT id FROM public.menus WHERE name = 'header_main'), NULL,
   'Dünya', '/kategori/dunya', 'category', 'a0000000-0000-0000-0000-000000000006', '_self', true, 5),
  ('f0000000-0000-0000-0000-000000000006',
   (SELECT id FROM public.menus WHERE name = 'header_main'), NULL,
   'Kültür-Sanat', '/kategori/kultur-sanat', 'category', 'a0000000-0000-0000-0000-000000000005', '_self', true, 6)
ON CONFLICT (id) DO NOTHING;

-- Footer menüsü (4 öğe)
INSERT INTO public.menu_items (id, menu_id, parent_id, label, url, link_type, target, is_active, sort_order) VALUES
  ('f0000000-0000-0000-0000-000000000007',
   (SELECT id FROM public.menus WHERE name = 'footer_links'), NULL,
   'Hakkımızda', '/sayfa/hakkimizda', 'page', '_self', true, 1),
  ('f0000000-0000-0000-0000-000000000008',
   (SELECT id FROM public.menus WHERE name = 'footer_links'), NULL,
   'İletişim', '/sayfa/iletisim', 'page', '_self', true, 2),
  ('f0000000-0000-0000-0000-000000000009',
   (SELECT id FROM public.menus WHERE name = 'footer_links'), NULL,
   'Gizlilik Politikası', '/sayfa/gizlilik-politikasi', 'page', '_self', true, 3),
  ('f0000000-0000-0000-0000-000000000010',
   (SELECT id FROM public.menus WHERE name = 'footer_links'), NULL,
   'Kullanım Koşulları', '/sayfa/kullanim-kosullari', 'custom', '_self', true, 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. SETTINGS (güncelle)
-- ============================================================
INSERT INTO public.settings (key, value, description) VALUES
  ('site_name', '"Newsa"', 'Site adı'),
  ('site_description', '"Türkiye ve bölge odaklı modern dijital haber platformu"', 'Site açıklaması'),
  ('site_logo', 'null', 'Site logosu URL'),
  ('articles_per_page', '12', 'Sayfa başına haber sayısı')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- 9. PAGES (3 statik sayfa)
-- ============================================================
INSERT INTO public.pages (id, title, slug, content, content_html, status, seo_title, seo_description, created_by) VALUES
  ('90000000-0000-0000-0000-000000000001',
   'Hakkımızda', 'hakkimizda', NULL,
   '<h1>Hakkımızda</h1><p>Newsa, Türkiye ve bölge odaklı modern bir dijital haber platformudur. Güvenilir, hızlı ve tarafsız haber anlayışıyla okurlarımıza en doğru bilgiyi ulaştırmayı hedefliyoruz.</p><p>Deneyimli editör ve muhabir kadromuzla gündem, ekonomi, teknoloji, spor, kültür-sanat ve dünya haberlerini 7/24 takip ediyoruz.</p><p>Misyonumuz: Doğru bilgiye herkesin erişebilmesini sağlamak.</p><p>Vizyonumuz: Türkiye''nin en güvenilir dijital haber platformu olmak.</p>',
   'published', 'Hakkımızda | Newsa', 'Newsa haber platformu hakkında bilgi',
   'b0000000-0000-0000-0000-000000000001'),

  ('90000000-0000-0000-0000-000000000002',
   'İletişim', 'iletisim', NULL,
   '<h1>İletişim</h1><p>Bize aşağıdaki kanallardan ulaşabilirsiniz:</p><ul><li><strong>E-posta:</strong> iletisim@newsa.com</li><li><strong>Telefon:</strong> +90 212 555 00 00</li><li><strong>Adres:</strong> İstanbul, Türkiye</li></ul><p>Haber ihbarı, reklam ve iş birliği teklifleriniz için: <strong>bilgi@newsa.com</strong></p><p>Editöryal konular için: <strong>editor@newsa.com</strong></p>',
   'published', 'İletişim | Newsa', 'Newsa ile iletişime geçin',
   'b0000000-0000-0000-0000-000000000001'),

  ('90000000-0000-0000-0000-000000000003',
   'Gizlilik Politikası', 'gizlilik-politikasi', NULL,
   '<h1>Gizlilik Politikası</h1><p>Newsa olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.</p><h2>Toplanan Veriler</h2><p>Sitemizi ziyaret ettiğinizde tarayıcı bilgileri, IP adresi ve çerez verileri toplanabilir.</p><h2>Veri Kullanımı</h2><p>Toplanan veriler sadece hizmet kalitesini artırmak ve kullanıcı deneyimini iyileştirmek amacıyla kullanılır.</p><h2>Üçüncü Taraflar</h2><p>Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.</p><h2>İletişim</h2><p>Gizlilik politikamız hakkında sorularınız için: gizlilik@newsa.com</p>',
   'published', 'Gizlilik Politikası | Newsa', 'Newsa gizlilik politikası ve kişisel verilerin korunması',
   'b0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 10. AD CAMPAIGNS (2 kampanya)
-- ============================================================
INSERT INTO public.ad_campaigns (id, name, advertiser_name, start_date, end_date, budget, status, created_by) VALUES
  ('80000000-0000-0000-0000-000000000001',
   'Yaz Kampanyası 2026', 'TechCorp Türkiye', '2026-06-01', '2026-08-31', 50000.00, 'active',
   'b0000000-0000-0000-0000-000000000001'),
  ('80000000-0000-0000-0000-000000000002',
   'Teknoloji Fuarı Sponsoru', 'DigiExpo İstanbul', '2026-03-01', '2026-04-30', 25000.00, 'active',
   'b0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 11. AD CREATIVES (4 reklam, her zone için 1)
-- ============================================================
INSERT INTO public.ad_creatives (id, campaign_id, zone_id, title, type, html_content, target_url, is_active) VALUES
  ('81000000-0000-0000-0000-000000000001',
   '80000000-0000-0000-0000-000000000001',
   (SELECT id FROM public.ad_zones WHERE name = 'header-banner'),
   'TechCorp Yaz İndirimi', 'text',
   '<div style="text-align:center;padding:10px;background:#1a73e8;color:white;border-radius:8px;"><strong>TechCorp Yaz Kampanyası!</strong> Tüm ürünlerde %40 indirim. <u>Hemen Alışveriş Yap</u></div>',
   'https://example.com/techcorp-yaz', true),
  ('81000000-0000-0000-0000-000000000002',
   '80000000-0000-0000-0000-000000000001',
   (SELECT id FROM public.ad_zones WHERE name = 'sidebar-rectangle'),
   'TechCorp Akıllı Saat', 'text',
   '<div style="padding:15px;background:#f0f0f0;border:1px solid #ddd;border-radius:8px;text-align:center;"><p><strong>Yeni TechWatch Pro</strong></p><p>Akıllı saatte devrim. ₺2999</p><p><a href="#">Detaylar</a></p></div>',
   'https://example.com/techwatch', true),
  ('81000000-0000-0000-0000-000000000003',
   '80000000-0000-0000-0000-000000000002',
   (SELECT id FROM public.ad_zones WHERE name = 'in-article'),
   'DigiExpo 2026 Bilet', 'text',
   '<div style="padding:10px;background:#ff6b35;color:white;border-radius:8px;text-align:center;"><strong>DigiExpo İstanbul 2026</strong><br/>15-18 Nisan | İstanbul Kongre Merkezi<br/><u>Ücretsiz Bilet Al</u></div>',
   'https://example.com/digiexpo', true),
  ('81000000-0000-0000-0000-000000000004',
   '80000000-0000-0000-0000-000000000002',
   (SELECT id FROM public.ad_zones WHERE name = 'footer-banner'),
   'DigiExpo Sponsor Banner', 'text',
   '<div style="text-align:center;padding:8px;background:#333;color:white;border-radius:4px;">DigiExpo İstanbul 2026 | Teknolojinin Geleceği Burada | <u>Kayıt Ol</u></div>',
   'https://example.com/digiexpo-sponsor', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 12. USER ROLES (RBAC atamaları)
-- ============================================================
INSERT INTO public.user_roles (user_id, role_id, assigned_by) VALUES
  -- Ahmet = admin
  ('b0000000-0000-0000-0000-000000000001', (SELECT id FROM public.roles WHERE name = 'admin'), 'b0000000-0000-0000-0000-000000000001'),
  -- Zeynep = editor
  ('b0000000-0000-0000-0000-000000000002', (SELECT id FROM public.roles WHERE name = 'editor'), 'b0000000-0000-0000-0000-000000000001'),
  -- Mehmet = editor
  ('b0000000-0000-0000-0000-000000000003', (SELECT id FROM public.roles WHERE name = 'editor'), 'b0000000-0000-0000-0000-000000000001'),
  -- Ayşe = author
  ('b0000000-0000-0000-0000-000000000004', (SELECT id FROM public.roles WHERE name = 'author'), 'b0000000-0000-0000-0000-000000000001'),
  -- Fatma = author
  ('b0000000-0000-0000-0000-000000000005', (SELECT id FROM public.roles WHERE name = 'author'), 'b0000000-0000-0000-0000-000000000001'),
  -- Ali = author
  ('b0000000-0000-0000-0000-000000000006', (SELECT id FROM public.roles WHERE name = 'author'), 'b0000000-0000-0000-0000-000000000001'),
  -- Elif = support
  ('b0000000-0000-0000-0000-000000000007', (SELECT id FROM public.roles WHERE name = 'support'), 'b0000000-0000-0000-0000-000000000001'),
  -- Burak = author
  ('b0000000-0000-0000-0000-000000000008', (SELECT id FROM public.roles WHERE name = 'author'), 'b0000000-0000-0000-0000-000000000001')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- ============================================================
-- 13. NOTIFICATIONS (10 bildirim)
-- ============================================================
INSERT INTO public.notifications (id, user_id, type, title, body, entity_type, entity_id, action_url, is_read, read_at, created_at) VALUES
  ('70000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'article_published', 'Haberiniz yayınlandı', 'Kediler Belediye Başkanlığına Aday Oldu haberi yayınlandı.', 'article', 'e0000000-0000-0000-0000-000000000002', '/haber/istanbul-kediler-belediye-baskanligi-aday', false, NULL, now() - interval '2 days'),
  ('70000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'article_published', 'Haberiniz yayınlandı', 'Koalalar Uçmayı Öğrendi haberi editör tarafından onaylandı.', 'article', 'e0000000-0000-0000-0000-000000000001', '/haber/koalalar-ucmayi-ogrendi', true, now() - interval '1 day', now() - interval '1 day'),
  ('70000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'review_request', 'Yeni inceleme talebi', 'Akıllı Ayakkabılar haberi incelemenizi bekliyor.', 'article', 'e0000000-0000-0000-0000-000000000071', '/admin/haberler/e0000000-0000-0000-0000-000000000071', false, NULL, now() - interval '1 day'),
  ('70000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'review_request', 'Yeni inceleme talebi', 'Blockchain Komşu Kavgaları haberi incelemenizi bekliyor.', 'article', 'e0000000-0000-0000-0000-000000000073', '/admin/haberler/e0000000-0000-0000-0000-000000000073', false, NULL, now() - interval '3 days'),
  ('70000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000006', 'article_featured', 'Haberiniz öne çıkarıldı', 'Galatasaray AI Futbolcu haberi öne çıkan haberlere eklendi.', 'article', 'e0000000-0000-0000-0000-000000000012', '/haber/galatasaray-yapay-zeka-futbolcu-aldi', true, now() - interval '4 days', now() - interval '5 days'),
  ('70000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'system', 'Sistem güncellemesi', 'Yeni reklam yönetim modülü aktif edildi.', NULL, NULL, '/admin/reklamlar', true, now() - interval '7 days', now() - interval '10 days'),
  ('70000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000008', 'article_published', 'Haberiniz yayınlandı', 'Mars Pizza Dükkanı haberi yayında.', 'article', 'e0000000-0000-0000-0000-000000000003', '/haber/marsta-pizza-dukkani-acildi', false, NULL, now() - interval '3 days'),
  ('70000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 'article_comment', 'Haberinize yorum yapıldı', 'Netflix Türk Anneleri haberi çok beğenildi.', 'article', 'e0000000-0000-0000-0000-000000000035', '/haber/netflix-turk-anneleri-yemek-israri', false, NULL, now() - interval '18 days'),
  ('70000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002', 'system', 'Haftalık rapor hazır', 'Bu haftanın en çok okunan haberleri raporu hazırlandı.', NULL, NULL, '/admin/raporlar', false, NULL, now() - interval '7 days'),
  ('70000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001', 'user_registered', 'Yeni kullanıcı kaydı', 'Burak Koç sisteme kayıt oldu.', 'user', 'b0000000-0000-0000-0000-000000000008', '/admin/kullanicilar/b0000000-0000-0000-0000-000000000008', true, now() - interval '25 days', now() - interval '28 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 14. AUDIT LOGS (20 log kaydı)
-- ============================================================
INSERT INTO public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('60000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'create', 'category', 'a0000000-0000-0000-0000-000000000001', NULL, '{"name":"Gündem","slug":"gundem"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '30 days'),
  ('60000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'create', 'category', 'a0000000-0000-0000-0000-000000000002', NULL, '{"name":"Ekonomi","slug":"ekonomi"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '30 days'),
  ('60000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'create', 'article', 'e0000000-0000-0000-0000-000000000002', NULL, '{"title":"İstanbul Kedileri","status":"draft"}', '192.168.1.10', 'Mozilla/5.0 Firefox/119', now() - interval '2 days'),
  ('60000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'update', 'article', 'e0000000-0000-0000-0000-000000000002', '{"status":"draft"}', '{"status":"published"}', '192.168.1.5', 'Mozilla/5.0 Chrome/120', now() - interval '2 days'),
  ('60000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'create', 'article', 'e0000000-0000-0000-0000-000000000001', NULL, '{"title":"Koalalar Uçmayı Öğrendi","status":"draft"}', '192.168.1.12', 'Mozilla/5.0 Safari/17', now() - interval '1 day'),
  ('60000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'update', 'article', 'e0000000-0000-0000-0000-000000000001', '{"status":"draft"}', '{"status":"published"}', '192.168.1.8', 'Mozilla/5.0 Chrome/120', now() - interval '1 day'),
  ('60000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'update', 'settings', 'a0000000-0000-0000-0000-000000000001', '{"articles_per_page":20}', '{"articles_per_page":12}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '15 days'),
  ('60000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'create', 'user', 'b0000000-0000-0000-0000-000000000008', NULL, '{"email":"burak@newsa.com","role":"author"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '28 days'),
  ('60000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000006', 'create', 'article', 'e0000000-0000-0000-0000-000000000012', NULL, '{"title":"Galatasaray AI Futbolcu","status":"draft"}', '192.168.1.15', 'Mozilla/5.0 Chrome/120', now() - interval '5 days'),
  ('60000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002', 'update', 'article', 'e0000000-0000-0000-0000-000000000012', '{"status":"draft"}', '{"status":"published","is_featured":true}', '192.168.1.5', 'Mozilla/5.0 Chrome/120', now() - interval '5 days'),
  ('60000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001', 'create', 'ad_campaign', '80000000-0000-0000-0000-000000000001', NULL, '{"name":"Yaz Kampanyası 2026"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '20 days'),
  ('60000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000003', 'create', 'article', 'e0000000-0000-0000-0000-000000000010', NULL, '{"title":"Robotlar Sendika Kurdu"}', '192.168.1.8', 'Mozilla/5.0 Chrome/120', now() - interval '3 days'),
  ('60000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000001', 'update', 'article', 'e0000000-0000-0000-0000-000000000008', '{"is_breaking":false}', '{"is_breaking":true}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '1 day'),
  ('60000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000001', 'delete', 'tag', 'c0000000-0000-0000-0000-000000000099', '{"name":"test-etiketi"}', NULL, '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '25 days'),
  ('60000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000002', 'update', 'article', 'e0000000-0000-0000-0000-000000000009', '{"is_breaking":false}', '{"is_breaking":true}', '192.168.1.5', 'Mozilla/5.0 Chrome/120', now() - interval '2 days'),
  ('60000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000008', 'create', 'article', 'e0000000-0000-0000-0000-000000000003', NULL, '{"title":"Mars Pizza Dükkanı"}', '192.168.1.20', 'Mozilla/5.0 Safari/17', now() - interval '3 days'),
  ('60000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000001', 'create', 'page', '90000000-0000-0000-0000-000000000001', NULL, '{"title":"Hakkımızda","slug":"hakkimizda"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '28 days'),
  ('60000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000001', 'update', 'menu', 'f0000000-0000-0000-0000-000000000001', NULL, '{"label":"Gündem","sort_order":1}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '27 days'),
  ('60000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000003', 'update', 'article', 'e0000000-0000-0000-0000-000000000004', '{"status":"review"}', '{"status":"published"}', '192.168.1.8', 'Mozilla/5.0 Chrome/120', now() - interval '4 days'),
  ('60000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', 'create', 'ad_campaign', '80000000-0000-0000-0000-000000000002', NULL, '{"name":"Teknoloji Fuarı Sponsoru"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', now() - interval '15 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
-- Toplam seed data:
--   8 kullanıcı (auth.users + profiles)
--   12 kategori (8 ana + 4 alt)
--   20 etiket
--   15 medya
--   75 haber (60 published, 10 draft, 5 review)
--   ~160 article_tag ilişkisi
--   10 menü öğesi (6 header + 4 footer)
--   4 ayar
--   3 statik sayfa
--   2 reklam kampanyası
--   4 reklam kreatifi
--   8 kullanıcı-rol ataması
--   10 bildirim
--   20 denetim logu
-- ============================================================

-- ============================================================
-- Seed audit_logs with 20 sample records for denetim page
-- ============================================================

INSERT INTO public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, created_at) VALUES
-- Login events
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'login', 'session', gen_random_uuid(), NULL, '{"method":"email"}', '192.168.1.1', NOW() - interval '1 hour'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000001', 'login', 'session', gen_random_uuid(), NULL, '{"method":"email"}', '192.168.1.2', NOW() - interval '2 hours'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000002', 'login', 'session', gen_random_uuid(), NULL, '{"method":"email"}', '192.168.1.3', NOW() - interval '3 hours'),

-- Article CRUD
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000002', 'create', 'article', gen_random_uuid(), NULL, '{"title":"Yeni teknoloji haberi","status":"draft"}', '192.168.1.3', NOW() - interval '4 hours'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000003', 'create', 'article', gen_random_uuid(), NULL, '{"title":"Ekonomi raporu","status":"draft"}', '192.168.1.4', NOW() - interval '5 hours'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000002', 'update', 'article', gen_random_uuid(), '{"status":"draft"}', '{"status":"published"}', '192.168.1.3', NOW() - interval '6 hours'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000004', 'create', 'article', gen_random_uuid(), NULL, '{"title":"Spor haberleri","status":"draft"}', '192.168.1.5', NOW() - interval '7 hours'),
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'update', 'article', gen_random_uuid(), '{"title":"Eski baslik"}', '{"title":"Guncel baslik"}', '192.168.1.1', NOW() - interval '8 hours'),
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'delete', 'article', gen_random_uuid(), '{"title":"Silinen haber"}', NULL, '192.168.1.1', NOW() - interval '9 hours'),

-- Category management
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'create', 'category', gen_random_uuid(), NULL, '{"name":"Teknoloji","slug":"teknoloji"}', '192.168.1.1', NOW() - interval '1 day'),
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'update', 'category', gen_random_uuid(), '{"name":"Bilim"}', '{"name":"Bilim & Teknoloji"}', '192.168.1.1', NOW() - interval '1 day 2 hours'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000001', 'create', 'category', gen_random_uuid(), NULL, '{"name":"Ekonomi","slug":"ekonomi"}', '192.168.1.2', NOW() - interval '1 day 4 hours'),

-- User management
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'create', 'user', gen_random_uuid(), NULL, '{"email":"yeni@newsa.com","role":"author"}', '192.168.1.1', NOW() - interval '2 days'),
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'update', 'user', 'b0000000-0000-0000-0000-000000000007', '{"role":"viewer"}', '{"role":"author"}', '192.168.1.1', NOW() - interval '2 days 1 hour'),

-- Media uploads
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000004', 'create', 'media', gen_random_uuid(), NULL, '{"filename":"haber-foto.jpg","size":245000}', '192.168.1.5', NOW() - interval '3 days'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000005', 'create', 'media', gen_random_uuid(), NULL, '{"filename":"banner.png","size":512000}', '192.168.1.6', NOW() - interval '3 days 2 hours'),
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000006', 'delete', 'media', gen_random_uuid(), '{"filename":"eski-foto.jpg"}', NULL, '192.168.1.7', NOW() - interval '3 days 4 hours'),

-- Settings changes
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'update', 'settings', gen_random_uuid(), '{"site_title":"Newsa"}', '{"site_title":"Newsa Haber"}', '192.168.1.1', NOW() - interval '4 days'),

-- Tag management
(gen_random_uuid(), 'b0000000-0000-0000-0000-000000000003', 'create', 'tag', gen_random_uuid(), NULL, '{"name":"gundem","slug":"gundem"}', '192.168.1.4', NOW() - interval '5 days'),

-- Logout
(gen_random_uuid(), 'b165fcad-fd06-4ab8-9baa-eaf2014e7248', 'logout', 'session', gen_random_uuid(), NULL, NULL, '192.168.1.1', NOW() - interval '5 days 1 hour');
